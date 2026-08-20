import "server-only";

import type { RosterCardExpert } from "@/components/roster-card";
import type { HeroCastMember } from "@/components/home-2/hero-cast";
import { parseExpertChannels } from "@/lib/expert-channels";
import { isLinkedInTopVoice } from "@/lib/expert-profiles";
import { prisma } from "@/lib/prisma";

export type { HeroCastMember };

const PREVIEW_COUNT = 4;
const HERO_CAST_COUNT = 6;

export async function loadRosterPreviewCards(): Promise<RosterCardExpert[]> {
  const experts = await prisma.expert.findMany({
    orderBy: { name: "asc" },
    take: PREVIEW_COUNT,
  });

  return experts.map((expert) => ({
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
  }));
}

/** Prefer experts with portraits for the home hero cast band. */
export async function loadHeroCast(
  count = HERO_CAST_COUNT,
): Promise<HeroCastMember[]> {
  const withImages = await prisma.expert.findMany({
    where: { image: { not: null } },
    orderBy: { name: "asc" },
    take: count * 2,
  });

  let pool = withImages.filter((e) => Boolean(e.image?.trim()));

  if (pool.length < count) {
    const extras = await prisma.expert.findMany({
      where: {
        id: { notIn: pool.map((e) => e.id) },
      },
      orderBy: { name: "asc" },
      take: count - pool.length,
    });
    pool = [...pool, ...extras];
  }

  // Spread across the list so adjacent panels aren't alphabetical clones.
  const step = Math.max(1, Math.floor(pool.length / count));
  const picked: typeof pool = [];
  for (let i = 0; picked.length < count && i < pool.length; i += step) {
    picked.push(pool[i]!);
  }
  for (const expert of pool) {
    if (picked.length >= count) break;
    if (!picked.some((p) => p.id === expert.id)) picked.push(expert);
  }

  return picked.slice(0, count).map((expert) => ({
    id: expert.id,
    slug: expert.slug,
    name: expert.name,
    image: expert.image,
    role: expert.categories[0] ?? null,
  }));
}
