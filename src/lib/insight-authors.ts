export type InsightAuthor = {
  slug: string;
  name: string;
  role: string;
  shortBio: string;
  bio: string;
  /** Optional portrait; falls back to brand mark on pages. */
  image?: string;
};

export const INSIGHT_AUTHORS: Record<string, InsightAuthor> = {
  "credible-team": {
    slug: "credible-team",
    name: "Credible team",
    role: "Editorial",
    shortBio:
      "Field notes from Credible Creators — briefing, formats, and the expert economy.",
    bio: "Credible Creators is a B2B talent agency connecting brands with expert operators — the voices buyers already trust. We publish field notes on briefing, formats, and the expert economy so partnership teams brief with clarity and creators stay editorial.",
  },
};

export const DEFAULT_INSIGHT_AUTHOR_SLUG = "credible-team";

export function getInsightAuthor(slug = DEFAULT_INSIGHT_AUTHOR_SLUG) {
  return INSIGHT_AUTHORS[slug] ?? INSIGHT_AUTHORS[DEFAULT_INSIGHT_AUTHOR_SLUG]!;
}
