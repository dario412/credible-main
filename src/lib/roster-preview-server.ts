import "server-only";

import type { RosterCardExpert } from "@/components/roster-card";
import { parseExpertChannels } from "@/lib/expert-channels";
import { isLinkedInTopVoice } from "@/lib/expert-profiles";
import { prisma } from "@/lib/prisma";

const PREVIEW_COUNT = 4;

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
