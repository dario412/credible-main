import { prisma } from "@/lib/prisma";
import { createMetadata } from "@/lib/seo";
import { parseExpertChannels } from "@/lib/expert-channels";
import { RosterCard, type RosterCardExpert } from "@/components/roster-card";
import { RosterFilters } from "@/components/roster-filters";

export const dynamic = "force-dynamic";

export const metadata = createMetadata({
  title: "Roster",
  description:
    "Twenty-four B2B expert creators ready to brief — filter by archetype, topic or channel.",
  path: "/roster",
});

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
  const params = await searchParams;
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

  const all = await prisma.expert.findMany({ orderBy: { name: "asc" } });

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
  }));

  return (
    <div className="px-6 py-16 md:px-10 md:py-20 lg:px-12">
      <div className="mx-auto max-w-352">
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="font-display text-[2.6rem] leading-[1.08] tracking-tight text-charcoal sm:text-[3.15rem] md:text-[3.65rem]">
            24 B2B expert creators
            <br />
            <span className="text-forest">ready to brief.</span>
          </h1>
          <p className="mx-auto mt-5 max-w-lg text-[0.9rem] leading-relaxed text-charcoal/65 md:text-[0.95rem]">
            Filter by archetype, topic or channel. Each profile carries reach
            data, past collaborations and format-level pricing so you can
            shortlist before you brief.
          </p>
        </div>

        <div className="mx-auto mt-8 max-w-4xl md:mt-10">
          <RosterFilters
            currentArchetype={archetype}
            currentTopic={topic}
            currentChannels={selectedChannels}
            currentQuery={q}
          />
        </div>

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
      </div>
    </div>
  );
}
