export type CaseStudiesPageSections = {
  hero: {
    /** First line of the H1. */
    headline: string;
    /** Second-line lead-in before the accent. */
    headlineContinued: string;
    /** Forest-green end of the H1 (e.g. "next."). */
    headlineAccent: string;
    subhead: string;
  };
  archive: {
    headline: string;
    emptyFiltered: string;
    emptyNone: string;
  };
};

export const DEFAULT_CASE_STUDIES_SECTIONS: CaseStudiesPageSections = {
  hero: {
    headline: "Work that ran, and",
    headlineContinued: "what happened",
    headlineAccent: "next.",
    subhead:
      "Not decks or promises — deals we structured, delivered, and measured with expert creators your buyers already trust.",
  },
  archive: {
    headline: "All stories",
    emptyFiltered: "More stories will land here as the catalogue grows.",
    emptyNone: "No projects yet.",
  },
};

function asString(value: unknown, fallback: string) {
  return typeof value === "string" ? value : fallback;
}

export function mergeCaseStudiesSections(
  raw: unknown,
): CaseStudiesPageSections {
  const data = (raw && typeof raw === "object" ? raw : {}) as {
    hero?: Partial<CaseStudiesPageSections["hero"]>;
    archive?: Partial<CaseStudiesPageSections["archive"]>;
  };
  const defaults = DEFAULT_CASE_STUDIES_SECTIONS;
  const hero = data.hero ?? {};
  const archive = data.archive ?? {};

  return {
    hero: {
      headline: asString(hero.headline, defaults.hero.headline),
      headlineContinued: asString(
        hero.headlineContinued,
        defaults.hero.headlineContinued,
      ),
      headlineAccent: asString(
        hero.headlineAccent,
        defaults.hero.headlineAccent,
      ),
      subhead: asString(hero.subhead, defaults.hero.subhead),
    },
    archive: {
      headline: asString(archive.headline, defaults.archive.headline),
      emptyFiltered: asString(
        archive.emptyFiltered,
        defaults.archive.emptyFiltered,
      ),
      emptyNone: asString(archive.emptyNone, defaults.archive.emptyNone),
    },
  };
}
