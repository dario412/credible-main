export type AboutHeroStat = {
  label: string;
  value: string;
};

export type AboutJumpLink = {
  href: string;
  label: string;
};

export type AboutLedgerItem = {
  value: string;
  label: string;
  note: string;
};

export type AboutModelItem = {
  n: string;
  title: string;
  body: string;
};

export type AboutRosterLane = {
  title: string;
  body: string;
  image: string;
};

export type AboutFace = {
  src: string;
};

export type AboutPageSections = {
  hero: {
    image: string;
    eyebrow: string;
    headline: string;
    subhead: string;
    stats: AboutHeroStat[];
    primaryCta: string;
    primaryHref: string;
    secondaryCta: string;
    secondaryHref: string;
  };
  thesis: {
    eyebrow: string;
    headline: string;
    body: string;
  };
  why: {
    eyebrow: string;
    headline: string;
    paragraphs: string[];
    jumpEyebrow: string;
    jumps: AboutJumpLink[];
    asideHeadline: string;
    asideBody: string;
    asideCta: string;
    asideHref: string;
  };
  ledger: {
    headline: string;
    subhead: string;
    items: AboutLedgerItem[];
  };
  model: {
    headline: string;
    subhead: string;
    items: AboutModelItem[];
  };
  roster: {
    eyebrow: string;
    headline: string;
    subhead: string;
    lanes: AboutRosterLane[];
  };
  cta: {
    eyebrow: string;
    headline: string;
    body: string;
    faces: AboutFace[];
    facesLabel: string;
    facesNote: string;
    primaryCta: string;
    primaryHref: string;
    secondaryCta: string;
    secondaryHref: string;
  };
};

export const DEFAULT_ABOUT_SECTIONS: AboutPageSections = {
  hero: {
    image: "/images/about/hero-stage.jpg",
    eyebrow: "A PepTalk company",
    headline: "We represent the people\nbuyers already trust.",
    subhead:
      "Credible Creators is a management agency for the expert economy: founders, operators, investors, and specialists whose voices shape how professional audiences think, buy, and build.",
    stats: [
      { label: "Roster", value: "24 expert voices" },
      { label: "Backed by", value: "PepTalk" },
    ],
    primaryCta: "Work with our roster",
    primaryHref: "/roster",
    secondaryCta: "Apply for representation",
    secondaryHref: "/apply-for-representation",
  },
  thesis: {
    eyebrow: "The thesis",
    headline: "Expertise is the new distribution.",
    body: "Reach is easy to buy. Credibility is not. We help brands work with operators who already have trust in the room, and help creators turn that trust into durable commercial work.",
  },
  why: {
    eyebrow: "Why we exist",
    headline:
      "The creator economy grew up. Representation has to grow up with it.",
    paragraphs: [
      "The most valuable creators in B2B are not entertainers chasing attention. They are practitioners with judgment: people who have built companies, led functions, allocated capital, or shaped a category.",
      "That kind of trust deserves a different commercial model. Credible gives expert voices the management layer they need — strategy, pricing, negotiation, delivery, and brand fit — without turning them into a marketplace profile.",
      "For brands, it means access to voices their buyers already respect. For creators, it means commercial work that compounds instead of interrupting the work that made them credible.",
    ],
    jumpEyebrow: "On this page",
    jumps: [
      { href: "#why", label: "Why we exist" },
      { href: "#ledger", label: "Operating model" },
      { href: "#model", label: "How we work" },
      { href: "#roster", label: "The roster" },
    ],
    asideHeadline: "Ready to brief an expert?",
    asideBody:
      "Browse operators by topic, format, and archetype — then send a brief.",
    asideCta: "Browse the roster",
    asideHref: "/roster",
  },
  ledger: {
    headline: "Credible gives expert voices\ncommercial leverage.",
    subhead:
      "A smaller roster creates better fit, better pricing, and more credible work for both sides of the market.",
    items: [
      {
        value: "24",
        label: "represented expert voices",
        note: "Founders, operators, investors, and category specialists.",
      },
      {
        value: "4",
        label: "formats managed end to end",
        note: "The work is packaged around trust, not inventory.",
      },
      {
        value: "B2B",
        label: "audiences and buyer contexts",
        note: "Built for professional decisions, not passive reach.",
      },
      {
        value: "1:1",
        label: "manager attention",
        note: "No self-serve listings, no marketplace inbox.",
      },
    ],
  },
  model: {
    headline: "Selective by design,\ncommercial by default.",
    subhead:
      "The business case is simple: a smaller roster creates better fit, better pricing, and better delivery.",
    items: [
      {
        n: "01",
        title: "Talent management",
        body: "Named managers protect positioning, bandwidth, and deal quality.",
      },
      {
        n: "02",
        title: "Brand strategy",
        body: "Briefs are shaped around audience trust, not forced into generic creator formats.",
      },
      {
        n: "03",
        title: "Commercial operations",
        body: "Scope, pricing, contracts, timelines, and delivery stay managed end to end.",
      },
      {
        n: "04",
        title: "PepTalk infrastructure",
        body: "Backed by the same team placing expert voices into high-stakes brand and event moments.",
      },
    ],
  },
  roster: {
    eyebrow: "How credibility compounds",
    headline: "A roster with range,\nmanaged with restraint.",
    subhead:
      "The agency only works if the roster stays credible. Every partnership, stage, and content program has to protect the expert's point of view while making the commercial opportunity easier to execute.",
    lanes: [
      {
        title: "Founders & operators",
        body: "Commercial work shaped around judgment.",
        image: "/images/experts/alex-lieberman.png",
      },
      {
        title: "Category specialists",
        body: "Expertise that can hold a room and a buying committee.",
        image: "/images/experts/daniel-park.jpg",
      },
      {
        title: "Speakers & hosts",
        body: "Presence for high-trust moments.",
        image: "/images/experts/amara-chen.jpg",
      },
      {
        title: "Investors & analysts",
        body: "Markets, capital, and category thesis.",
        image: "/images/experts/noah-bennett.jpg",
      },
      {
        title: "Subject-matter experts",
        body: "Practitioner depth in a vertical.",
        image: "/images/experts/james-okafor.jpg",
      },
    ],
  },
  cta: {
    eyebrow: "Two ways in",
    headline:
      "Find the voice your buyers already believe — or become one of them.",
    body: "Brands turn expert trust into campaigns, content, speaking, and live moments. Creators turn authority into managed opportunity.",
    faces: [
      { src: "/images/experts/alex-lieberman.png" },
      { src: "/images/experts/amara-chen.jpg" },
      { src: "/images/experts/daniel-park.jpg" },
    ],
    facesLabel: "24 creators represented",
    facesNote: "Actively recruiting",
    primaryCta: "Send a brand brief",
    primaryHref: "/contact",
    secondaryCta: "Apply for representation",
    secondaryHref: "/apply-for-representation",
  },
};

function asString(value: unknown, fallback: string) {
  return typeof value === "string" ? value : fallback;
}

const LEGACY_ABOUT_HERO_IMAGES = new Set([
  "/images/experts/alex-lieberman-stage.png",
]);

function aboutHeroImage(value: unknown, fallback: string) {
  const image = asString(value, fallback).trim() || fallback;
  return LEGACY_ABOUT_HERO_IMAGES.has(image) ? fallback : image;
}

function padN(index: number, fallback: string) {
  return fallback.trim() || String(index + 1).padStart(2, "0");
}

function mergePairList<T extends Record<string, string>>(
  raw: unknown,
  defaults: T[],
  keys: (keyof T)[],
  empty: T,
): T[] {
  if (!Array.isArray(raw)) return defaults.map((item) => ({ ...item }));

  const merged = raw
    .map((item, i) => {
      const row = (item && typeof item === "object" ? item : {}) as Partial<T>;
      const fallback = defaults[i] ?? empty;
      const next = { ...empty };
      for (const key of keys) {
        next[key] = asString(row[key], fallback[key]) as T[keyof T];
      }
      const blank = keys.every((key) => !String(next[key] ?? "").trim());
      return blank ? null : next;
    })
    .filter((item): item is T => item !== null);

  return merged.length > 0 ? merged : defaults.map((item) => ({ ...item }));
}

function mergeParagraphs(raw: unknown, defaults: string[]): string[] {
  if (!Array.isArray(raw)) return [...defaults];
  const merged = raw
    .map((item, i) => asString(item, defaults[i] ?? "").trim())
    .filter(Boolean);
  return merged.length > 0 ? merged : [...defaults];
}

function mergeLedger(
  raw: unknown,
  defaults: AboutLedgerItem[],
): AboutLedgerItem[] {
  if (!Array.isArray(raw)) return defaults.map((item) => ({ ...item }));

  const merged = raw
    .map((item, i) => {
      const row = (item && typeof item === "object" ? item : {}) as Partial<
        AboutLedgerItem
      >;
      const fallback = defaults[i] ?? { value: "", label: "", note: "" };
      const value = asString(row.value, fallback.value);
      const label = asString(row.label, fallback.label);
      const note = asString(row.note, fallback.note);
      if (!value.trim() && !label.trim() && !note.trim()) return null;
      return { value, label, note };
    })
    .filter((item): item is AboutLedgerItem => item !== null);

  return merged.length > 0 ? merged : defaults.map((item) => ({ ...item }));
}

function mergeModel(
  raw: unknown,
  defaults: AboutModelItem[],
): AboutModelItem[] {
  if (!Array.isArray(raw)) return defaults.map((item) => ({ ...item }));

  const merged = raw
    .map((item, i) => {
      const row = (item && typeof item === "object" ? item : {}) as Partial<
        AboutModelItem
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
    .filter((item): item is AboutModelItem => item !== null);

  return merged.length > 0 ? merged : defaults.map((item) => ({ ...item }));
}

function mergeRosterLanes(
  raw: unknown,
  defaults: AboutRosterLane[],
): AboutRosterLane[] {
  if (!Array.isArray(raw)) return defaults.map((item) => ({ ...item }));

  const merged = raw
    .map((item, i) => {
      const row = (item && typeof item === "object" ? item : {}) as Partial<
        AboutRosterLane
      >;
      const fallback = defaults[i] ?? { title: "", body: "", image: "" };
      const title = asString(row.title, fallback.title);
      const body = asString(row.body, fallback.body);
      const image = asString(row.image, fallback.image);
      if (!title.trim() && !body.trim() && !image.trim()) return null;
      return { title, body, image };
    })
    .filter((item): item is AboutRosterLane => item !== null);

  return merged.length > 0 ? merged : defaults.map((item) => ({ ...item }));
}

function mergeFaces(raw: unknown, defaults: AboutFace[]): AboutFace[] {
  if (!Array.isArray(raw)) return defaults.map((item) => ({ ...item }));

  const merged = raw
    .map((item, i) => {
      if (typeof item === "string") {
        return item.trim() ? { src: item } : null;
      }
      const row = (item && typeof item === "object" ? item : {}) as Partial<
        AboutFace
      >;
      const fallback = defaults[i] ?? { src: "" };
      const src = asString(row.src, fallback.src);
      return src.trim() ? { src } : null;
    })
    .filter((item): item is AboutFace => item !== null);

  return merged.length > 0 ? merged : defaults.map((item) => ({ ...item }));
}

export function mergeAboutSections(raw: unknown): AboutPageSections {
  const data = (raw && typeof raw === "object" ? raw : {}) as {
    hero?: Partial<AboutPageSections["hero"]> & { stats?: unknown };
    thesis?: Partial<AboutPageSections["thesis"]>;
    why?: Partial<AboutPageSections["why"]> & {
      paragraphs?: unknown;
      jumps?: unknown;
    };
    ledger?: Partial<AboutPageSections["ledger"]> & { items?: unknown };
    model?: Partial<AboutPageSections["model"]> & { items?: unknown };
    roster?: Partial<AboutPageSections["roster"]> & { lanes?: unknown };
    cta?: Partial<AboutPageSections["cta"]> & { faces?: unknown };
  };
  const defaults = DEFAULT_ABOUT_SECTIONS;
  const hero = data.hero ?? {};
  const thesis = data.thesis ?? {};
  const why = data.why ?? {};
  const ledger = data.ledger ?? {};
  const model = data.model ?? {};
  const roster = data.roster ?? {};
  const cta = data.cta ?? {};

  return {
    hero: {
      image: aboutHeroImage(hero.image, defaults.hero.image),
      eyebrow: asString(hero.eyebrow, defaults.hero.eyebrow),
      headline: asString(hero.headline, defaults.hero.headline),
      subhead: asString(hero.subhead, defaults.hero.subhead),
      stats: mergePairList(
        hero.stats,
        defaults.hero.stats,
        ["label", "value"],
        { label: "", value: "" },
      ),
      primaryCta: asString(hero.primaryCta, defaults.hero.primaryCta),
      primaryHref: asString(hero.primaryHref, defaults.hero.primaryHref),
      secondaryCta: asString(hero.secondaryCta, defaults.hero.secondaryCta),
      secondaryHref: asString(hero.secondaryHref, defaults.hero.secondaryHref),
    },
    thesis: {
      eyebrow: asString(thesis.eyebrow, defaults.thesis.eyebrow),
      headline: asString(thesis.headline, defaults.thesis.headline),
      body: asString(thesis.body, defaults.thesis.body),
    },
    why: {
      eyebrow: asString(why.eyebrow, defaults.why.eyebrow),
      headline: asString(why.headline, defaults.why.headline),
      paragraphs: mergeParagraphs(why.paragraphs, defaults.why.paragraphs),
      jumpEyebrow: asString(why.jumpEyebrow, defaults.why.jumpEyebrow),
      jumps: mergePairList(why.jumps, defaults.why.jumps, ["href", "label"], {
        href: "",
        label: "",
      }),
      asideHeadline: asString(why.asideHeadline, defaults.why.asideHeadline),
      asideBody: asString(why.asideBody, defaults.why.asideBody),
      asideCta: asString(why.asideCta, defaults.why.asideCta),
      asideHref: asString(why.asideHref, defaults.why.asideHref),
    },
    ledger: {
      headline: asString(ledger.headline, defaults.ledger.headline),
      subhead: asString(ledger.subhead, defaults.ledger.subhead),
      items: mergeLedger(ledger.items, defaults.ledger.items),
    },
    model: {
      headline: asString(model.headline, defaults.model.headline),
      subhead: asString(model.subhead, defaults.model.subhead),
      items: mergeModel(model.items, defaults.model.items),
    },
    roster: {
      eyebrow: asString(roster.eyebrow, defaults.roster.eyebrow),
      headline: asString(roster.headline, defaults.roster.headline),
      subhead: asString(roster.subhead, defaults.roster.subhead),
      lanes: mergeRosterLanes(roster.lanes, defaults.roster.lanes),
    },
    cta: {
      eyebrow: asString(cta.eyebrow, defaults.cta.eyebrow),
      headline: asString(cta.headline, defaults.cta.headline),
      body: asString(cta.body, defaults.cta.body),
      faces: mergeFaces(cta.faces, defaults.cta.faces),
      facesLabel: asString(cta.facesLabel, defaults.cta.facesLabel),
      facesNote: asString(cta.facesNote, defaults.cta.facesNote),
      primaryCta: asString(cta.primaryCta, defaults.cta.primaryCta),
      primaryHref: asString(cta.primaryHref, defaults.cta.primaryHref),
      secondaryCta: asString(cta.secondaryCta, defaults.cta.secondaryCta),
      secondaryHref: asString(cta.secondaryHref, defaults.cta.secondaryHref),
    },
  };
}

export function emptyAboutHeroStat(): AboutHeroStat {
  return { label: "", value: "" };
}

export function emptyAboutJumpLink(): AboutJumpLink {
  return { href: "", label: "" };
}

export function emptyAboutLedgerItem(): AboutLedgerItem {
  return { value: "", label: "", note: "" };
}

export function emptyAboutModelItem(): AboutModelItem {
  return { n: "", title: "", body: "" };
}

export function emptyAboutRosterLane(): AboutRosterLane {
  return { title: "", body: "", image: "" };
}

export function emptyAboutFace(): AboutFace {
  return { src: "" };
}

export function paragraphsToText(paragraphs: string[]) {
  return paragraphs.join("\n\n");
}

export function textToParagraphs(text: string) {
  return text.split(/\n\n+/);
}
