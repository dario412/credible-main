import {
  blocksToMarkdown,
  ensureBlockIds,
  parseInsightBody,
  type InsightBlock,
} from "@/lib/insight-content";
import type { CaseStudyCard } from "@/lib/case-studies";
import { CASE_STUDY_LOGO } from "@/lib/case-studies";

export const BRAND_COLORS = [
  "charcoal",
  "cream",
  "cream-dark",
  "forest",
  "forest-dark",
] as const;

export type BrandColor = (typeof BRAND_COLORS)[number];
export type TextSize = "sm" | "md" | "lg";
export type HeadlineSize = "md" | "lg" | "xl";
export type Radius = "none" | "sm" | "md";

export type TextStyle = {
  color: BrandColor;
  size: TextSize;
};

export type HeadlineStyle = {
  color: BrandColor;
  size: HeadlineSize;
};

export type CtaStyle = {
  bg: BrandColor;
  text: BrandColor;
  border: BrandColor | "none";
  size: TextSize;
  radius: Radius;
};

export type HomePageSections = {
  hero: {
    headline: string;
    subhead: string;
    primaryCta: string;
    primaryHref: string;
    secondaryCta: string;
    secondaryHref: string;
    headlineStyle: HeadlineStyle;
    subheadStyle: TextStyle;
    primaryCtaStyle: CtaStyle;
    secondaryCtaStyle: CtaStyle;
  };
  waysIn: {
    headline: string;
    subhead: string;
    items: Array<{ title: string; body: string }>;
  };
  roster: {
    headline: string;
    subhead: string;
    ctaLabel: string;
    ctaHref: string;
  };
  impact: {
    headline: string;
    stats: Array<{ value: string; detail: string }>;
  };
  keyStudy: {
    headline: string;
    headlineAccent: string;
    summary: string;
    pillar: string;
    lead: string;
    term: string;
    ctaLabel: string;
    ctaHref: string;
    metrics: Array<{ value: string; label: string; note: string }>;
  };
  brandBrief: {
    eyebrow: string;
    headline: string;
    headlineEmphasis: string;
    subhead: string;
    quote: string;
    quoteName: string;
    quoteRole: string;
    formTitle: string;
  };
  footer: {
    tagline: string;
    companyLine: string;
    email: string;
  };
};

export const DEFAULT_HOME_SECTIONS: HomePageSections = {
  hero: {
    headline: "Book the voices your buyers already trust",
    subhead:
      "Founders, operators, investors, and specialists — briefed for stage, content, and advisory that moves B2B brands.",
    primaryCta: "Apply for Representation",
    primaryHref: "/contact",
    secondaryCta: "Explore roster",
    secondaryHref: "/roster",
    headlineStyle: { color: "charcoal", size: "xl" },
    subheadStyle: { color: "charcoal", size: "md" },
    primaryCtaStyle: {
      bg: "charcoal",
      text: "cream",
      border: "none",
      size: "md",
      radius: "sm",
    },
    secondaryCtaStyle: {
      bg: "cream",
      text: "charcoal",
      border: "charcoal",
      size: "md",
      radius: "sm",
    },
  },
  waysIn: {
    headline: "One roster,\nfour ways in.",
    subhead:
      "Whatever the brief maps to — a keynote, a series, a category ambassador, a private dinner — the same team handles it end-to-end.",
    items: [
      {
        title: "Brand partnerships",
        body: "Campaign work with creators your buyers already trust — long-form and considered, not a one-post drop.",
      },
      {
        title: "Ambassador programs",
        body: "Category ambassadors and retainers that embed a credible voice into your brand for the long haul.",
      },
      {
        title: "Speaking engagements",
        body: "Keynotes, panels, fireside chats and closed-door executive sessions. Bureau-quality booking.",
      },
      {
        title: "Live events",
        body: "Creators attend and amplify your event — presence, content and credibility that give the room lasting reach.",
      },
    ],
  },
  roster: {
    headline: "The roster, ready to brief.",
    subhead:
      "Twenty-four founders, operators, investors and specialists. Each profile carries reach data, past work and format-level pricing.",
    ctaLabel: "See all 24 creators",
    ctaHref: "/roster",
  },
  impact: {
    headline: "Credible gives your brand\nan unfair advantage.",
    stats: [
      { value: "24", detail: "Signed creators across 4 archetypes" },
      { value: "18.4M", detail: "Combined reach across channels" },
      { value: "60+", detail: "Brand partners booked with Credible" },
      { value: "142", detail: "Stages and sessions delivered" },
    ],
  },
  keyStudy: {
    headline: "How Notion built B2B's defining founder series —",
    headlineAccent: "without a studio.",
    summary:
      "One operator voice. Twelve episodes. End-to-end casting, format, and distribution — so Notion owned the category without standing up an in-house media team.",
    pillar: "Content",
    lead: "Alex Lieberman",
    term: "22 months",
    ctaLabel: "Read the full case study",
    ctaHref: "/case-studies/notion-founders-journal",
    metrics: [
      {
        value: "12",
        label: "Episodes shipped end-to-end — zero studio overhead",
        note: "",
      },
      {
        value: "4.1M",
        label: "Downloads across video, audio, and written",
        note: "",
      },
      {
        value: "$18.4M",
        label: "Pipeline attributed in the first partnership term",
        note: "Renewed through 2027",
      },
    ],
  },
  brandBrief: {
    eyebrow: "For brands & agencies",
    headline: "Reach buyers through the voices they",
    headlineEmphasis: "already trust.",
    subhead:
      "In-house or agency — send the ambition. We'll return a shortlist within 48 hours.",
    quote:
      "Credible turned a single keynote into a year-long advisory partnership — exactly the kind of credibility our buyers trust.",
    quoteName: "Maya Chen",
    quoteRole: "Head of Brand Partnerships, Stripe",
    formTitle: "Send a brief",
  },
  footer: {
    tagline: "The talent agency for the expert economy.",
    companyLine: "A PepTalk company.",
    email: "hello@crediblecreators.com",
  },
};

const BRAND_COLOR_SET = new Set<string>(BRAND_COLORS);
const TEXT_SIZES = new Set<string>(["sm", "md", "lg"]);
const HEADLINE_SIZES = new Set<string>(["md", "lg", "xl"]);
const RADII = new Set<string>(["none", "sm", "md"]);

function asBrandColor(value: unknown, fallback: BrandColor): BrandColor {
  return typeof value === "string" && BRAND_COLOR_SET.has(value)
    ? (value as BrandColor)
    : fallback;
}

function asBorderColor(
  value: unknown,
  fallback: BrandColor | "none",
): BrandColor | "none" {
  if (value === "none") return "none";
  return asBrandColor(value, fallback === "none" ? "charcoal" : fallback);
}

function mergeHeadlineStyle(raw: unknown): HeadlineStyle {
  const base = DEFAULT_HOME_SECTIONS.hero.headlineStyle;
  const data = (raw && typeof raw === "object" ? raw : {}) as Partial<HeadlineStyle>;
  return {
    color: asBrandColor(data.color, base.color),
    size:
      typeof data.size === "string" && HEADLINE_SIZES.has(data.size)
        ? (data.size as HeadlineSize)
        : base.size,
  };
}

function mergeTextStyle(raw: unknown): TextStyle {
  const base = DEFAULT_HOME_SECTIONS.hero.subheadStyle;
  const data = (raw && typeof raw === "object" ? raw : {}) as Partial<TextStyle>;
  return {
    color: asBrandColor(data.color, base.color),
    size:
      typeof data.size === "string" && TEXT_SIZES.has(data.size)
        ? (data.size as TextSize)
        : base.size,
  };
}

function mergeCtaStyle(raw: unknown, fallback: CtaStyle): CtaStyle {
  const data = (raw && typeof raw === "object" ? raw : {}) as Partial<CtaStyle>;
  return {
    bg: asBrandColor(data.bg, fallback.bg),
    text: asBrandColor(data.text, fallback.text),
    border: asBorderColor(data.border, fallback.border),
    size:
      typeof data.size === "string" && TEXT_SIZES.has(data.size)
        ? (data.size as TextSize)
        : fallback.size,
    radius:
      typeof data.radius === "string" && RADII.has(data.radius)
        ? (data.radius as Radius)
        : fallback.radius,
  };
}

function asString(value: unknown, fallback: string) {
  return typeof value === "string" ? value : fallback;
}

function mergeWaysIn(raw: unknown): HomePageSections["waysIn"] {
  const defaults = DEFAULT_HOME_SECTIONS.waysIn;
  const data = (raw && typeof raw === "object" ? raw : {}) as Partial<
    HomePageSections["waysIn"]
  >;
  const itemsRaw = Array.isArray(data.items) ? data.items : [];
  return {
    headline: asString(data.headline, defaults.headline),
    subhead: asString(data.subhead, defaults.subhead),
    items: defaults.items.map((item, i) => {
      const row = (itemsRaw[i] && typeof itemsRaw[i] === "object"
        ? itemsRaw[i]
        : {}) as Partial<{ title: string; body: string }>;
      return {
        title: asString(row.title, item.title),
        body: asString(row.body, item.body),
      };
    }),
  };
}

function mergeRoster(raw: unknown): HomePageSections["roster"] {
  const defaults = DEFAULT_HOME_SECTIONS.roster;
  const data = (raw && typeof raw === "object" ? raw : {}) as Partial<
    HomePageSections["roster"]
  >;
  return {
    headline: asString(data.headline, defaults.headline),
    subhead: asString(data.subhead, defaults.subhead),
    ctaLabel: asString(data.ctaLabel, defaults.ctaLabel),
    ctaHref: asString(data.ctaHref, defaults.ctaHref),
  };
}

function mergeImpact(raw: unknown): HomePageSections["impact"] {
  const defaults = DEFAULT_HOME_SECTIONS.impact;
  const data = (raw && typeof raw === "object" ? raw : {}) as Partial<
    HomePageSections["impact"]
  >;
  const statsRaw = Array.isArray(data.stats) ? data.stats : [];
  return {
    headline: asString(data.headline, defaults.headline),
    stats: defaults.stats.map((stat, i) => {
      const row = (statsRaw[i] && typeof statsRaw[i] === "object"
        ? statsRaw[i]
        : {}) as Partial<{ value: string; detail: string }>;
      return {
        value: asString(row.value, stat.value),
        detail: asString(row.detail, stat.detail),
      };
    }),
  };
}

function mergeKeyStudy(raw: unknown): HomePageSections["keyStudy"] {
  const defaults = DEFAULT_HOME_SECTIONS.keyStudy;
  const data = (raw && typeof raw === "object" ? raw : {}) as Partial<
    HomePageSections["keyStudy"]
  >;
  const metricsRaw = Array.isArray(data.metrics) ? data.metrics : [];
  return {
    headline: asString(data.headline, defaults.headline),
    headlineAccent: asString(data.headlineAccent, defaults.headlineAccent),
    summary: asString(data.summary, defaults.summary),
    pillar: asString(data.pillar, defaults.pillar),
    lead: asString(data.lead, defaults.lead),
    term: asString(data.term, defaults.term),
    ctaLabel: asString(data.ctaLabel, defaults.ctaLabel),
    ctaHref: asString(data.ctaHref, defaults.ctaHref),
    metrics: defaults.metrics.map((metric, i) => {
      const row = (metricsRaw[i] && typeof metricsRaw[i] === "object"
        ? metricsRaw[i]
        : {}) as Partial<{ value: string; label: string; note: string }>;
      return {
        value: asString(row.value, metric.value),
        label: asString(row.label, metric.label),
        note: asString(row.note, metric.note),
      };
    }),
  };
}

function mergeBrandBrief(raw: unknown): HomePageSections["brandBrief"] {
  const defaults = DEFAULT_HOME_SECTIONS.brandBrief;
  const data = (raw && typeof raw === "object" ? raw : {}) as Partial<
    HomePageSections["brandBrief"]
  >;
  return {
    eyebrow: asString(data.eyebrow, defaults.eyebrow),
    headline: asString(data.headline, defaults.headline),
    headlineEmphasis: asString(data.headlineEmphasis, defaults.headlineEmphasis),
    subhead: asString(data.subhead, defaults.subhead),
    quote: asString(data.quote, defaults.quote),
    quoteName: asString(data.quoteName, defaults.quoteName),
    quoteRole: asString(data.quoteRole, defaults.quoteRole),
    formTitle: asString(data.formTitle, defaults.formTitle),
  };
}

function mergeFooter(raw: unknown): HomePageSections["footer"] {
  const defaults = DEFAULT_HOME_SECTIONS.footer;
  const data = (raw && typeof raw === "object" ? raw : {}) as Partial<
    HomePageSections["footer"]
  >;
  return {
    tagline: asString(data.tagline, defaults.tagline),
    companyLine: asString(data.companyLine, defaults.companyLine),
    email: asString(data.email, defaults.email),
  };
}

export function mergeHomeSections(raw: unknown): HomePageSections {
  const data = (raw && typeof raw === "object" ? raw : {}) as {
    hero?: Partial<HomePageSections["hero"]> & Record<string, unknown>;
    waysIn?: unknown;
    roster?: unknown;
    impact?: unknown;
    keyStudy?: unknown;
    brandBrief?: unknown;
    footer?: unknown;
  };
  const hero = data.hero ?? {};
  const defaults = DEFAULT_HOME_SECTIONS.hero;

  return {
    hero: {
      headline: asString(hero.headline, defaults.headline),
      subhead: asString(hero.subhead, defaults.subhead),
      primaryCta: asString(hero.primaryCta, defaults.primaryCta),
      primaryHref: asString(hero.primaryHref, defaults.primaryHref),
      secondaryCta: asString(hero.secondaryCta, defaults.secondaryCta),
      secondaryHref: asString(hero.secondaryHref, defaults.secondaryHref),
      headlineStyle: mergeHeadlineStyle(hero.headlineStyle),
      subheadStyle: mergeTextStyle(hero.subheadStyle),
      primaryCtaStyle: mergeCtaStyle(hero.primaryCtaStyle, defaults.primaryCtaStyle),
      secondaryCtaStyle: mergeCtaStyle(
        hero.secondaryCtaStyle,
        defaults.secondaryCtaStyle,
      ),
    },
    waysIn: mergeWaysIn(data.waysIn),
    roster: mergeRoster(data.roster),
    impact: mergeImpact(data.impact),
    keyStudy: mergeKeyStudy(data.keyStudy),
    brandBrief: mergeBrandBrief(data.brandBrief),
    footer: mergeFooter(data.footer),
  };
}

export function insightBlocksForSave(blocks: InsightBlock[]) {
  const normalized = ensureBlockIds(blocks);
  return {
    blocks: normalized,
    body: blocksToMarkdown(normalized),
  };
}

export function blocksFromLegacyBody(body: string): InsightBlock[] {
  return parseInsightBody(body).blocks;
}

type CaseStudyRow = {
  slug: string;
  title: string;
  summary: string;
  client: string;
  pillar: string;
  clientType: string;
  industry: string;
  size: string;
  period: string;
  coverImage: string | null;
  featured: boolean;
  data: unknown;
  relatedExperts?: string[];
  seoTitle?: string | null;
  seoDescription?: string | null;
};

export function caseStudyToCard(row: CaseStudyRow): CaseStudyCard {
  const data =
    row.data && typeof row.data === "object"
      ? (row.data as Partial<CaseStudyCard>)
      : {};

  return {
    slug: row.slug,
    client: row.client || data.client || "",
    title: row.title,
    summary: row.summary,
    heroTitle: data.heroTitle,
    heroTitleEmphasis: data.heroTitleEmphasis,
    heroSummary: data.heroSummary,
    meta: data.meta,
    results: data.results,
    quote: data.quote,
    story: data.story,
    ctaCreator: data.ctaCreator,
    pillar: (row.pillar as CaseStudyCard["pillar"]) || "Content",
    clientType: (row.clientType as CaseStudyCard["clientType"]) || "Direct client",
    industry: row.industry || "",
    size: row.size || "",
    period: row.period || "",
    coverImage: row.coverImage || data.coverImage || "/images/case-studies/notion.jpg",
    logo: data.logo ?? CASE_STUDY_LOGO,
    featured: row.featured || Boolean(data.featured),
  };
}

export function caseStudyCardToRow(card: CaseStudyCard) {
  const {
    slug,
    title,
    summary,
    client,
    pillar,
    clientType,
    industry,
    size,
    period,
    coverImage,
    featured,
    ...rest
  } = card;

  return {
    slug,
    title,
    summary,
    client,
    pillar,
    clientType,
    industry,
    size,
    period,
    coverImage,
    featured: Boolean(featured),
    data: rest,
    relatedExperts: rest.ctaCreator?.slug ? [rest.ctaCreator.slug] : [],
  };
}
