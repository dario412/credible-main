import { RosterVisualEditor } from "@/components/roster-visual-editor";
import { RosterCard, type RosterCardExpert } from "@/components/roster-card";
import { StickyRosterFilters } from "@/components/roster-filters";
import {
  getRosterPageSections,
  saveRosterPage,
} from "@/lib/actions/admin-cms";
import { auth } from "@/lib/auth";
import { parseExpertChannels } from "@/lib/expert-channels";
import { hasPermission } from "@/lib/permissions";
import { prisma } from "@/lib/prisma";
import { buildRosterFilterOptions } from "@/lib/roster-filter-options";
import { linkedinTopVoiceFromExtras } from "@/lib/airtable/map-profile-sections";
import { loadWebsiteCategoryChoices } from "@/lib/airtable/website-categories";
import { createMetadata } from "@/lib/seo";

export const dynamic = "force-dynamic";

export async function generateMetadata() {
  const count = await prisma.expert.count();
  return createMetadata({
    title: "Roster",
    description: `${count} B2B expert creators ready to brief — filter by role, category or channel.`,
    path: "/roster",
  });
}

type SearchParams = Promise<{
  archetype?: string;
  topic?: string;
  channels?: string;
  q?: string;
  /** @deprecated legacy param */
  category?: string;
  /** @deprecated use channels */
  format?: string;
}>;

export default async function RosterPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const [params, sections, session] = await Promise.all([
    searchParams,
    getRosterPageSections(),
    auth(),
  ]);
  const canEdit = Boolean(
    session?.user && hasPermission(session.user.role, "MANAGE_CONTENT"),
  );

  const archetype = (params.archetype ?? params.category)?.trim();
  const topic = params.topic?.trim();
  const channelParam = params.channels?.trim() || params.format?.trim();
  const selectedChannels = channelParam
    ? channelParam
        .split(",")
        .map((item) => item.trim().toLowerCase())
        .filter(Boolean)
    : [];
  const q = params.q?.trim();

  const [all, categoryChoices] = await Promise.all([
    prisma.expert.findMany({ orderBy: { name: "asc" } }),
    loadWebsiteCategoryChoices(),
  ]);
  const { archetypeOptions, topicOptions } = buildRosterFilterOptions(
    all,
    categoryChoices,
  );

  const experts = all.filter((expert) => {
    const categories = expert.categories ?? [];
    const topics = expert.topics ?? [];
    const expertChannelTypes = parseExpertChannels(expert.channels).map(
      (channel) => channel.type,
    );

    if (
      archetype &&
      !categories.some((c) => c.toLowerCase() === archetype.toLowerCase())
    ) {
      return false;
    }
    if (
      topic &&
      !topics.some((t) => t.toLowerCase() === topic.toLowerCase())
    ) {
      return false;
    }
    if (
      selectedChannels.length > 0 &&
      !selectedChannels.some((channel) =>
        expertChannelTypes.includes(
          channel as (typeof expertChannelTypes)[number],
        ),
      )
    ) {
      return false;
    }
    if (q) {
      const hay = `${expert.name} ${expert.title} ${expert.bio}`.toLowerCase();
      if (!hay.includes(q.toLowerCase())) return false;
    }
    return true;
  });

  const cards: RosterCardExpert[] = experts.map((expert) => ({
    id: expert.id,
    slug: expert.slug,
    name: expert.name,
    shortBio: expert.shortBio,
    image: expert.image,
    role: expert.categories[0] ?? null,
    topics: expert.topics ?? [],
    combinedReach: expert.combinedReach,
    growth90d: expert.growth90d,
    audienceWho: expert.audienceWho,
    audienceWhere: expert.audienceWhere,
    channels: parseExpertChannels(expert.channels),
    linkedinTopVoice: linkedinTopVoiceFromExtras(expert.profileExtras),
  }));

  return (
    <div className="px-6 py-16 md:px-10 md:py-20 lg:px-12">
      <div className="mx-auto max-w-352">
        <RosterVisualEditor
          initial={sections}
          canEdit={canEdit}
          saveAction={saveRosterPage}
          rosterCount={all.length}
        >
          <StickyRosterFilters
            archetypeOptions={archetypeOptions}
            topicOptions={topicOptions}
            currentArchetype={archetype}
            currentTopic={topic}
            currentChannels={selectedChannels}
            currentQuery={q}
          />

          <p className="mt-8 text-sm text-charcoal/50">
            {experts.length === 0
              ? "No experts match these filters."
              : `${experts.length} ${experts.length === 1 ? "expert" : "experts"}`}
          </p>

          <div className="mt-5 grid items-stretch gap-x-5 gap-y-10 overflow-visible sm:grid-cols-2 lg:grid-cols-3">
            {cards.map((expert) => (
              <RosterCard key={expert.id} expert={expert} />
            ))}
          </div>
        </RosterVisualEditor>
      </div>
    </div>
  );
}
