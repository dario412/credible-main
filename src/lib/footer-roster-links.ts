import "server-only";

import { loadWebsiteCategoryChoices } from "@/lib/airtable/website-categories";
import { prisma } from "@/lib/prisma";
import {
  buildFooterRosterNavLinks,
  buildRosterFilterOptions,
} from "@/lib/roster-filter-options";

export async function loadFooterRosterNavLinks(
  allCreatorsLabel = "All creators",
) {
  const [experts, categoryChoices] = await Promise.all([
    prisma.expert.findMany({ select: { categories: true, topics: true } }),
    loadWebsiteCategoryChoices(),
  ]);

  const { topicOptions } = buildRosterFilterOptions(experts, categoryChoices);
  return buildFooterRosterNavLinks(topicOptions, allCreatorsLabel);
}
