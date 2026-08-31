import "server-only";

import type { RosterCardExpert } from "@/components/roster-card";
import type { HeroCastMember } from "@/components/home-2/hero-cast";
import { parseExpertChannels } from "@/lib/expert-channels";
import { isLinkedInTopVoice } from "@/lib/expert-profiles";
import { prisma } from "@/lib/prisma";
import { selectRosterPreviewCards } from "@/lib/roster-preview";

export type { HeroCastMember };
export { selectRosterPreviewCards };

function toRosterCard(expert: {
  id: string;
  slug: string;
  name: string;
  shortBio: string | null;
  image: string | null;
  categories: string[];
  topics: string[];
  combinedReach: string | null;
  growth90d: string | null;
  audienceWho: string | null;
  audienceWhere: string | null;
  channels: unknown;
}): RosterCardExpert {
  return {
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
    linkedinTopVoice: isLinkedInTopVoice(expert.slug),
  };
}

/** Full roster as cards, A–Z — used for homepage preview + editor picker. */
export async function loadRosterCards(): Promise<RosterCardExpert[]> {
  const experts = await prisma.expert.findMany({
    orderBy: { name: "asc" },
  });
  return experts.map(toRosterCard);
}

export async function loadRosterPreviewCards(
  featuredSlugs: string[] = [],
): Promise<RosterCardExpert[]> {
  const all = await loadRosterCards();
  return selectRosterPreviewCards(all, featuredSlugs);
}

/** Full roster for hero / about cast rails, A–Z by name. */
export async function loadHeroCast(): Promise<HeroCastMember[]> {
  const experts = await prisma.expert.findMany({
    orderBy: { name: "asc" },
  });

  return experts.map((expert) => ({
    id: expert.id,
    slug: expert.slug,
    name: expert.name,
    image: expert.image,
    role: expert.categories[0] ?? null,
  }));
}

/** Roster faces with portraits for CTA marquees — featured first, then A–Z. */
export async function loadCreatorMarqueeFaces(): Promise<
  Array<{ slug: string; name: string; image: string }>
> {
  const experts = await prisma.expert.findMany({
    where: { image: { not: null } },
    orderBy: [{ featured: "desc" }, { name: "asc" }],
    select: { slug: true, name: true, image: true },
  });

  return experts
    .filter(
      (expert): expert is { slug: string; name: string; image: string } =>
        Boolean(expert.image?.trim()),
    )
    .map((expert) => ({
      slug: expert.slug,
      name: expert.name,
      image: expert.image.trim(),
    }));
}
