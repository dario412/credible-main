import type { RosterCardExpert } from "@/components/roster-card";

const PREVIEW_COUNT = 4;

/** Pick up to 4 featured cards in slug order; fall back to first A–Z. */
export function selectRosterPreviewCards(
  all: RosterCardExpert[],
  featuredSlugs: string[] = [],
): RosterCardExpert[] {
  if (all.length === 0) return [];
  const bySlug = new Map(all.map((card) => [card.slug, card]));
  const picked = featuredSlugs
    .map((slug) => bySlug.get(slug))
    .filter((card): card is RosterCardExpert => Boolean(card))
    .slice(0, PREVIEW_COUNT);
  if (picked.length > 0) return picked;
  return all.slice(0, PREVIEW_COUNT);
}
