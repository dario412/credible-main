export type RosterPageSections = {
  hero: {
    headline: string;
    headlineAccent: string;
    subhead: string;
  };
};

export const DEFAULT_ROSTER_SECTIONS: RosterPageSections = {
  hero: {
    headline: "24 B2B expert creators",
    headlineAccent: "ready to brief.",
    subhead:
      "Filter by role, topic or channel. Each profile carries reach data, past collaborations and format-level pricing so you can shortlist before you brief.",
  },
};

function asString(value: unknown, fallback: string) {
  return typeof value === "string" ? value : fallback;
}

export function mergeRosterSections(raw: unknown): RosterPageSections {
  const data = (raw && typeof raw === "object" ? raw : {}) as {
    hero?: Partial<RosterPageSections["hero"]>;
  };
  const defaults = DEFAULT_ROSTER_SECTIONS;
  const hero = data.hero ?? {};

  return {
    hero: {
      headline: asString(hero.headline, defaults.hero.headline),
      headlineAccent: asString(
        hero.headlineAccent,
        defaults.hero.headlineAccent,
      ),
      subhead: asString(hero.subhead, defaults.hero.subhead),
    },
  };
}
