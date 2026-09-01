export type RosterFormOption = {
  slug: string;
  name: string;
  image?: string | null;
  role?: string | null;
};

export function rosterCardsToFormOptions(
  cards: Array<{
    slug: string;
    name: string;
    image?: string | null;
    role?: string | null;
  }>,
): RosterFormOption[] {
  return cards.map((card) => ({
    slug: card.slug,
    name: card.name,
    image: card.image ?? null,
    role: card.role ?? null,
  }));
}

export function formatCreatorNames(
  slugs: string[],
  options: RosterFormOption[],
): string {
  const bySlug = new Map(options.map((option) => [option.slug, option.name]));
  return slugs
    .map((slug) => bySlug.get(slug) ?? slug)
    .filter(Boolean)
    .join(", ");
}

export function parseCreatorSlugsFromQuery(
  params: { expert?: string; experts?: string },
): string[] {
  const fromList = params.experts
    ?.split(",")
    .map((slug) => slug.trim())
    .filter(Boolean);
  if (fromList?.length) return [...new Set(fromList)];

  const single = params.expert?.trim();
  return single ? [single] : [];
}
