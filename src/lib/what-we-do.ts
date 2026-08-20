export type WhatWeDoProof = {
  title: string;
  body: string;
};

export type WhatWeDoLane = {
  n: string;
  title: string;
  body: string;
};

export type WhatWeDoMoment = {
  eyebrow: string;
  title: string;
  body: string;
};

export type WhatWeDoService = {
  n: string;
  lane: string;
  title: string;
  body: string;
  formats: string[];
  bestFor: string;
};

export type WhatWeDoStep = {
  n: string;
  title: string;
  body: string;
};

export type WhatWeDoMatrixRow = {
  n: string;
  moment: string;
  becomes: string;
  lanes: boolean[];
};

export type WhatWeDoPageSections = {
  hero: {
    eyebrow: string;
    headline: string;
    subhead: string;
    primaryCta: string;
    primaryHref: string;
    secondaryCta: string;
    secondaryHref: string;
    proofs: WhatWeDoProof[];
    system: {
      image: string;
      eyebrow: string;
      headline: string;
      badge: string;
      lanes: WhatWeDoLane[];
      footnote: string;
    };
  };
  moments: {
    headline: string;
    subhead: string;
    items: WhatWeDoMoment[];
  };
  services: {
    eyebrow: string;
    headline: string;
    subhead: string;
    cards: WhatWeDoService[];
  };
  process: {
    eyebrow: string;
    headline: string;
    body: string;
    footnote: string;
    ctaLabel: string;
    ctaHref: string;
    steps: WhatWeDoStep[];
  };
  choose: {
    eyebrow: string;
    headline: string;
    subhead: string;
    colMoment: string;
    colBecomes: string;
    laneLabels: string[];
    rows: WhatWeDoMatrixRow[];
  };
  cta: {
    eyebrow: string;
    headline: string;
    body: string;
    primaryCta: string;
    primaryHref: string;
    secondaryCta: string;
    secondaryHref: string;
  };
};

export const DEFAULT_WHAT_WE_DO_SECTIONS: WhatWeDoPageSections = {
  hero: {
    eyebrow: "What we do",
    headline: "Expert-led growth, managed end to end.",
    subhead:
      "Credible turns expert authority into content, partnerships, speaking, and live programs that B2B buyers actually trust.",
    primaryCta: "Send a brand brief",
    primaryHref: "/contact",
    secondaryCta: "Compare services",
    secondaryHref: "#services",
    proofs: [
      {
        title: "Managed end to end",
        body: "Strategy, shortlist, scope, pricing, timelines, delivery.",
      },
      {
        title: "Built for B2B",
        body: "Buyer trust, category authority, and credible context.",
      },
    ],
    system: {
      image: "/images/what-we-do/hero-system.jpg",
      eyebrow: "Service system",
      headline: "Four service lanes.\nOne managed system.",
      badge: "4",
      lanes: [
        {
          n: "01",
          title: "Expert content",
          body: "Series, reports, webinars, and editorial programs buyers keep.",
        },
        {
          n: "02",
          title: "Brand partnerships",
          body: "Creator-led campaigns and integrations with credible fit.",
        },
        {
          n: "03",
          title: "Speaking & keynotes",
          body: "Keynotes, panels, firesides, and category briefings.",
        },
        {
          n: "04",
          title: "Live programming",
          body: "Roundtables, executive forums, launches, and hosted moments.",
        },
      ],
      footnote:
        "The buyer does not have to pick perfectly. We shape the mix from one brief.",
    },
  },
  moments: {
    headline: "Choose by business moment,\nnot by content format.",
    subhead:
      "The page should help a buyer recognize their goal first, then understand the right service mix.",
    items: [
      {
        eyebrow: "Launch or reposition",
        title: "Borrow category trust",
        body: "Use expert-led content and partnerships to make a new idea feel understood and credible.",
      },
      {
        eyebrow: "Educate buyers",
        title: "Create useful authority",
        body: "Build repeatable formats that help prospects think through problems before a sales conversation.",
      },
      {
        eyebrow: "Move a room",
        title: "Make live moments matter",
        body: "Use speakers, hosts, and programming to turn events into trusted buyer experiences.",
      },
    ],
  },
  services: {
    eyebrow: "Services",
    headline: "The right format depends on the business moment.",
    subhead:
      "Four lanes, one managed system. Most strong programs combine more than one.",
    cards: [
      {
        n: "01",
        lane: "Content strategy",
        title: "Expert content series",
        body: "Use expert voices to build repeatable education that buyers save and share.",
        formats: [
          "Newsletters",
          "Video series",
          "Webinars",
          "Reports",
          "Editorial franchises",
        ],
        bestFor:
          "Category creation, pipeline nurture, and turning complex ideas into useful authority.",
      },
      {
        n: "02",
        lane: "Campaign fit",
        title: "Brand partnerships",
        body: "Attach a credible operator, founder, investor, or specialist to a message that needs trust transfer, not just reach.",
        formats: ["Creator-led campaigns", "Integrations", "Ambassador programs"],
        bestFor:
          "Launches, repositioning, sponsor programs, and thought-leadership campaigns.",
      },
      {
        n: "03",
        lane: "Room impact",
        title: "Speaking & keynotes",
        body: "Book expert voices for executive audience moments where the room needs practical authority.",
        formats: ["Keynotes", "Panels", "Firesides", "Category briefings"],
        bestFor: "Rooms that need practical authority, not generic inspiration.",
      },
      {
        n: "04",
        lane: "Live programming",
        title: "Live events & programming",
        body: "Design hosted moments around the expert, from private tables to full community programming.",
        formats: [
          "Roundtables",
          "Executive forums",
          "Salons",
          "Launches",
          "Community programming",
        ],
        bestFor:
          "Relationship-building, market education, and experiences people talk about after.",
      },
    ],
  },
  process: {
    eyebrow: "Process",
    headline: "From one brief to a managed program.",
    body: "Bring the business moment. We shape the right format, match the expert voice, and manage the work through delivery.",
    footnote:
      "You do not have to know the exact service before starting. The brief creates the path.",
    ctaLabel: "Send a brand brief",
    ctaHref: "/contact",
    steps: [
      {
        n: "01",
        title: "Brief the moment",
        body: "Goal, audience, category, timing, and why an expert voice matters here.",
      },
      {
        n: "02",
        title: "Shape the service mix",
        body: "We recommend content, partnership, speaking, live, or a combined program.",
      },
      {
        n: "03",
        title: "Match the voice",
        body: "Shortlist credible experts by audience trust, authority, availability, and fit.",
      },
      {
        n: "04",
        title: "Manage delivery",
        body: "Scope, terms, production, approvals, timelines, and reporting stay handled.",
      },
    ],
  },
  choose: {
    eyebrow: "How to choose",
    headline: "Start with the business moment, not the format.",
    subhead:
      "Find your moment on the left. The marked lanes are where we would start — most programs use more than one.",
    colMoment: "Your business moment",
    colBecomes: "What it becomes",
    laneLabels: ["Content", "Partners", "Speaking", "Live"],
    rows: [
      {
        n: "01",
        moment: "Launch or reposition",
        becomes:
          "Borrow category trust so a market understands why your point of view matters now.",
        lanes: [true, true, false, false],
      },
      {
        n: "02",
        moment: "Educate a buying committee",
        becomes:
          "Create useful authority when the sale depends on helping prospects think through a complex problem.",
        lanes: [true, false, true, false],
      },
      {
        n: "03",
        moment: "Move an executive room",
        becomes:
          "Make live moments matter when attention, credibility, and discussion need to happen in real time.",
        lanes: [false, false, true, true],
      },
      {
        n: "04",
        moment: "Build a repeat program",
        becomes:
          "Compound the relationship when one campaign should become an ongoing editorial, event, and partnership system.",
        lanes: [true, true, true, true],
      },
    ],
  },
  cta: {
    eyebrow: "Best next step",
    headline: "Send one brief.\nWe recommend the service mix.",
    body: "You should not need to self-diagnose perfectly before starting. Tell us the business moment and we will shape the rest.",
    primaryCta: "Send a brand brief",
    primaryHref: "/contact",
    secondaryCta: "Explore the roster",
    secondaryHref: "/roster",
  },
};

function asString(value: unknown, fallback: string) {
  return typeof value === "string" ? value : fallback;
}

function padN(index: number, fallback: string) {
  return fallback.trim() || String(index + 1).padStart(2, "0");
}

function mergeProofs(raw: unknown, defaults: WhatWeDoProof[]): WhatWeDoProof[] {
  if (!Array.isArray(raw)) return defaults.map((item) => ({ ...item }));

  const merged = raw
    .map((item, i) => {
      const row = (item && typeof item === "object" ? item : {}) as Partial<
        WhatWeDoProof
      >;
      const fallback = defaults[i] ?? { title: "", body: "" };
      const title = asString(row.title, fallback.title);
      const body = asString(row.body, fallback.body);
      if (!title.trim() && !body.trim()) return null;
      return { title, body };
    })
    .filter((item): item is WhatWeDoProof => item !== null);

  return merged.length > 0 ? merged : defaults.map((item) => ({ ...item }));
}

function mergeLanes(raw: unknown, defaults: WhatWeDoLane[]): WhatWeDoLane[] {
  if (!Array.isArray(raw)) return defaults.map((item) => ({ ...item }));

  const merged = raw
    .map((item, i) => {
      const row = (item && typeof item === "object" ? item : {}) as Partial<
        WhatWeDoLane
      >;
      const fallback = defaults[i] ?? { n: "", title: "", body: "" };
      const title = asString(row.title, fallback.title);
      const body = asString(row.body, fallback.body);
      if (!title.trim() && !body.trim()) return null;
      return {
        n: padN(i, asString(row.n, fallback.n)),
        title,
        body,
      };
    })
    .filter((item): item is WhatWeDoLane => item !== null);

  return merged.length > 0 ? merged : defaults.map((item) => ({ ...item }));
}

function mergeMoments(
  raw: unknown,
  defaults: WhatWeDoMoment[],
): WhatWeDoMoment[] {
  if (!Array.isArray(raw)) return defaults.map((item) => ({ ...item }));

  const merged = raw
    .map((item, i) => {
      const row = (item && typeof item === "object" ? item : {}) as Partial<
        WhatWeDoMoment
      >;
      const fallback = defaults[i] ?? { eyebrow: "", title: "", body: "" };
      const eyebrow = asString(row.eyebrow, fallback.eyebrow);
      const title = asString(row.title, fallback.title);
      const body = asString(row.body, fallback.body);
      if (!eyebrow.trim() && !title.trim() && !body.trim()) return null;
      return { eyebrow, title, body };
    })
    .filter((item): item is WhatWeDoMoment => item !== null);

  return merged.length > 0 ? merged : defaults.map((item) => ({ ...item }));
}

function mergeFormats(raw: unknown, fallback: string[]): string[] {
  if (!Array.isArray(raw)) return [...fallback];
  return raw
    .map((item) => (typeof item === "string" ? item : ""))
    .map((item) => item.trim())
    .filter(Boolean);
}

function mergeServices(
  raw: unknown,
  defaults: WhatWeDoService[],
): WhatWeDoService[] {
  if (!Array.isArray(raw)) return defaults.map((item) => ({ ...item, formats: [...item.formats] }));

  const merged = raw
    .map((item, i) => {
      const row = (item && typeof item === "object" ? item : {}) as Partial<
        WhatWeDoService
      > & { formats?: unknown };
      const fallback = defaults[i] ?? {
        n: "",
        lane: "",
        title: "",
        body: "",
        formats: [],
        bestFor: "",
      };
      const title = asString(row.title, fallback.title);
      const body = asString(row.body, fallback.body);
      const lane = asString(row.lane, fallback.lane);
      const bestFor = asString(row.bestFor, fallback.bestFor);
      if (!title.trim() && !body.trim() && !lane.trim() && !bestFor.trim()) {
        return null;
      }
      return {
        n: padN(i, asString(row.n, fallback.n)),
        lane,
        title,
        body,
        formats: mergeFormats(row.formats, fallback.formats),
        bestFor,
      };
    })
    .filter((item): item is WhatWeDoService => item !== null);

  return merged.length > 0
    ? merged
    : defaults.map((item) => ({ ...item, formats: [...item.formats] }));
}

function mergeSteps(raw: unknown, defaults: WhatWeDoStep[]): WhatWeDoStep[] {
  if (!Array.isArray(raw)) return defaults.map((item) => ({ ...item }));

  const merged = raw
    .map((item, i) => {
      const row = (item && typeof item === "object" ? item : {}) as Partial<
        WhatWeDoStep
      >;
      const fallback = defaults[i] ?? { n: "", title: "", body: "" };
      const title = asString(row.title, fallback.title);
      const body = asString(row.body, fallback.body);
      if (!title.trim() && !body.trim()) return null;
      return {
        n: padN(i, asString(row.n, fallback.n)),
        title,
        body,
      };
    })
    .filter((item): item is WhatWeDoStep => item !== null);

  return merged.length > 0 ? merged : defaults.map((item) => ({ ...item }));
}

function mergeLaneLabels(raw: unknown, defaults: string[]): string[] {
  if (!Array.isArray(raw)) return [...defaults];
  const merged = raw
    .map((item, i) => asString(item, defaults[i] ?? "").trim())
    .filter(Boolean);
  return merged.length > 0 ? merged : [...defaults];
}

function mergeBools(
  raw: unknown,
  fallback: boolean[],
  length: number,
): boolean[] {
  const source = Array.isArray(raw) ? raw : fallback;
  return Array.from({ length }, (_, i) =>
    Boolean(source[i] ?? fallback[i] ?? false),
  );
}

function mergeMatrixRows(
  raw: unknown,
  defaults: WhatWeDoMatrixRow[],
  laneCount: number,
): WhatWeDoMatrixRow[] {
  if (!Array.isArray(raw)) {
    return defaults.map((item) => ({
      ...item,
      lanes: mergeBools(item.lanes, item.lanes, laneCount),
    }));
  }

  const merged = raw
    .map((item, i) => {
      const row = (item && typeof item === "object" ? item : {}) as Partial<
        WhatWeDoMatrixRow
      > & { lanes?: unknown };
      const fallback = defaults[i] ?? {
        n: "",
        moment: "",
        becomes: "",
        lanes: Array.from({ length: laneCount }, () => false),
      };
      const moment = asString(row.moment, fallback.moment);
      const becomes = asString(row.becomes, fallback.becomes);
      if (!moment.trim() && !becomes.trim()) return null;
      return {
        n: padN(i, asString(row.n, fallback.n)),
        moment,
        becomes,
        lanes: mergeBools(row.lanes, fallback.lanes, laneCount),
      };
    })
    .filter((item): item is WhatWeDoMatrixRow => item !== null);

  return merged.length > 0
    ? merged
    : defaults.map((item) => ({
        ...item,
        lanes: mergeBools(item.lanes, item.lanes, laneCount),
      }));
}

export function mergeWhatWeDoSections(raw: unknown): WhatWeDoPageSections {
  const data = (raw && typeof raw === "object" ? raw : {}) as {
    hero?: Partial<WhatWeDoPageSections["hero"]> & {
      proofs?: unknown;
      system?: Partial<WhatWeDoPageSections["hero"]["system"]> & {
        lanes?: unknown;
      };
    };
    moments?: Partial<WhatWeDoPageSections["moments"]> & { items?: unknown };
    services?: Partial<WhatWeDoPageSections["services"]> & { cards?: unknown };
    process?: Partial<WhatWeDoPageSections["process"]> & { steps?: unknown };
    choose?: Partial<WhatWeDoPageSections["choose"]> & {
      laneLabels?: unknown;
      rows?: unknown;
    };
    cta?: Partial<WhatWeDoPageSections["cta"]>;
  };
  const defaults = DEFAULT_WHAT_WE_DO_SECTIONS;
  const hero = data.hero ?? {};
  const system = hero.system;
  const moments = data.moments ?? {};
  const services = data.services ?? {};
  const process = data.process ?? {};
  const choose = data.choose ?? {};
  const cta = data.cta ?? {};
  const laneLabels = mergeLaneLabels(choose.laneLabels, defaults.choose.laneLabels);

  return {
    hero: {
      eyebrow: asString(hero.eyebrow, defaults.hero.eyebrow),
      headline: asString(hero.headline, defaults.hero.headline),
      subhead: asString(hero.subhead, defaults.hero.subhead),
      primaryCta: asString(hero.primaryCta, defaults.hero.primaryCta),
      primaryHref: asString(hero.primaryHref, defaults.hero.primaryHref),
      secondaryCta: asString(hero.secondaryCta, defaults.hero.secondaryCta),
      secondaryHref: asString(hero.secondaryHref, defaults.hero.secondaryHref),
      proofs: mergeProofs(hero.proofs, defaults.hero.proofs),
      system: {
        image: asString(system?.image, defaults.hero.system.image),
        eyebrow: asString(system?.eyebrow, defaults.hero.system.eyebrow),
        headline: asString(system?.headline, defaults.hero.system.headline),
        badge: asString(system?.badge, defaults.hero.system.badge),
        lanes: mergeLanes(system?.lanes, defaults.hero.system.lanes),
        footnote: asString(system?.footnote, defaults.hero.system.footnote),
      },
    },
    moments: {
      headline: asString(moments.headline, defaults.moments.headline),
      subhead: asString(moments.subhead, defaults.moments.subhead),
      items: mergeMoments(moments.items, defaults.moments.items),
    },
    services: {
      eyebrow: asString(services.eyebrow, defaults.services.eyebrow),
      headline: asString(services.headline, defaults.services.headline),
      subhead: asString(services.subhead, defaults.services.subhead),
      cards: mergeServices(services.cards, defaults.services.cards),
    },
    process: {
      eyebrow: asString(process.eyebrow, defaults.process.eyebrow),
      headline: asString(process.headline, defaults.process.headline),
      body: asString(process.body, defaults.process.body),
      footnote: asString(process.footnote, defaults.process.footnote),
      ctaLabel: asString(process.ctaLabel, defaults.process.ctaLabel),
      ctaHref: asString(process.ctaHref, defaults.process.ctaHref),
      steps: mergeSteps(process.steps, defaults.process.steps),
    },
    choose: {
      eyebrow: asString(choose.eyebrow, defaults.choose.eyebrow),
      headline: asString(choose.headline, defaults.choose.headline),
      subhead: asString(choose.subhead, defaults.choose.subhead),
      colMoment: asString(choose.colMoment, defaults.choose.colMoment),
      colBecomes: asString(choose.colBecomes, defaults.choose.colBecomes),
      laneLabels,
      rows: mergeMatrixRows(choose.rows, defaults.choose.rows, laneLabels.length),
    },
    cta: {
      eyebrow: asString(cta.eyebrow, defaults.cta.eyebrow),
      headline: asString(cta.headline, defaults.cta.headline),
      body: asString(cta.body, defaults.cta.body),
      primaryCta: asString(cta.primaryCta, defaults.cta.primaryCta),
      primaryHref: asString(cta.primaryHref, defaults.cta.primaryHref),
      secondaryCta: asString(cta.secondaryCta, defaults.cta.secondaryCta),
      secondaryHref: asString(cta.secondaryHref, defaults.cta.secondaryHref),
    },
  };
}

export function emptyWhatWeDoProof(): WhatWeDoProof {
  return { title: "", body: "" };
}

export function emptyWhatWeDoLane(): WhatWeDoLane {
  return { n: "", title: "", body: "" };
}

export function emptyWhatWeDoMoment(): WhatWeDoMoment {
  return { eyebrow: "", title: "", body: "" };
}

export function emptyWhatWeDoService(): WhatWeDoService {
  return { n: "", lane: "", title: "", body: "", formats: [], bestFor: "" };
}

export function emptyWhatWeDoStep(): WhatWeDoStep {
  return { n: "", title: "", body: "" };
}

export function emptyWhatWeDoMatrixRow(laneCount = 4): WhatWeDoMatrixRow {
  return {
    n: "",
    moment: "",
    becomes: "",
    lanes: Array.from({ length: laneCount }, () => false),
  };
}

export function formatsToText(formats: string[]) {
  return formats.join("\n");
}

export function textToFormats(text: string) {
  return text.split("\n").map((line) => line.trimEnd());
}
