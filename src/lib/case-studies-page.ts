export type CaseStudiesFaqItem = {
  q: string;
  a: string;
};

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
  faq: {
    eyebrow: string;
    headline: string;
    subhead: string;
    items: CaseStudiesFaqItem[];
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
  faq: {
    eyebrow: "FAQ",
    headline: "Questions brands ask before they brief.",
    subhead:
      "How the work gets structured, measured, and handed off — without the pitch deck.",
    items: [
      {
        q: "Are these results typical?",
        a: "Each case is specific to the brief, creator, and market. We publish them as proof of how we work — not as a guarantee. On a fit call we map what a comparable outcome looks like for your audience and goal.",
      },
      {
        q: "Can we brief a creator from one of these stories?",
        a: "Yes. Send a brief with the creator named, or ask us for a shortlist of operators with a similar profile. We’ll come back with availability, pricing, and a scoped proposal.",
      },
      {
        q: "How do you measure success?",
        a: "We agree success metrics up front — pipeline, awareness, sign-ups, or category authority — then report against them. Format-level pricing and delivery sit in one document you can forward internally.",
      },
      {
        q: "What’s the typical engagement length?",
        a: "From single keynotes and content drops to multi-month ambassador terms. Brand partnerships and retainers usually run longer; speaking and live events are scoped per date.",
      },
      {
        q: "Do you work with agencies as well as brands?",
        a: "Yes. In-house teams and agencies brief us the same way. We return a named shortlist with reach data, past work, and commercials — usually within 48 hours.",
      },
      {
        q: "How quickly can we start?",
        a: "Same-day acknowledgement on briefs. Shortlist within 48 hours when the roster fits. Live dates and longer programs depend on creator availability — we’ll flag timing early.",
      },
    ],
  },
};

function asString(value: unknown, fallback: string) {
  return typeof value === "string" ? value : fallback;
}

function mergeFaqItems(
  raw: unknown,
  defaults: CaseStudiesFaqItem[],
): CaseStudiesFaqItem[] {
  if (!Array.isArray(raw)) return defaults.map((item) => ({ ...item }));

  const merged = raw
    .map((item, i) => {
      const row = (item && typeof item === "object" ? item : {}) as Partial<
        CaseStudiesFaqItem
      >;
      const fallback = defaults[i] ?? { q: "", a: "" };
      const q = asString(row.q, fallback.q);
      const a = asString(row.a, fallback.a);
      if (!q.trim() && !a.trim()) return null;
      return { q, a };
    })
    .filter((item): item is CaseStudiesFaqItem => item !== null);

  return merged.length > 0 ? merged : defaults.map((item) => ({ ...item }));
}

export function mergeCaseStudiesSections(
  raw: unknown,
): CaseStudiesPageSections {
  const data = (raw && typeof raw === "object" ? raw : {}) as {
    hero?: Partial<CaseStudiesPageSections["hero"]>;
    archive?: Partial<CaseStudiesPageSections["archive"]>;
    faq?: Partial<CaseStudiesPageSections["faq"]> & { items?: unknown };
  };
  const defaults = DEFAULT_CASE_STUDIES_SECTIONS;
  const hero = data.hero ?? {};
  const archive = data.archive ?? {};
  const faq = data.faq ?? {};

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
    faq: {
      eyebrow: asString(faq.eyebrow, defaults.faq.eyebrow),
      headline: asString(faq.headline, defaults.faq.headline),
      subhead: asString(faq.subhead, defaults.faq.subhead),
      items: mergeFaqItems(faq.items, defaults.faq.items),
    },
  };
}

export function emptyCaseStudiesFaqItem(): CaseStudiesFaqItem {
  return { q: "", a: "" };
}
