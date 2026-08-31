import {
  blocksToMarkdown,
  ensureBlockIds,
  parseInsightBody,
  type InsightBlock,
} from "@/lib/insight-content";
import type { CaseStudyCard } from "@/lib/case-studies";
import {
  CASE_STUDY_LOGO,
  DEFAULT_CASE_STUDY_PILLAR,
  normalizeCaseStudyPillars,
  projectHref,
} from "@/lib/case-studies";

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

export type HomeFaqItem = {
  q: string;
  a: string;
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
    /** Ordered expert slugs for the homepage roster preview (up to 4). */
    featuredSlugs: string[];
  };
  impact: {
    headline: string;
    stats: Array<{ value: string; detail: string }>;
  };
  keyStudy: {
    logoSrc: string;
    logoAlt: string;
    headline: string;
    headlineAccent: string;
    summary: string;
    meta: Array<{ label: string; value: string }>;
    showCta: boolean;
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
    quotePhoto: string;
    quoteLogo: string;
    quoteLogoName: string;
    formTitle: string;
    formFootnote: string;
    briefedByLabel: string;
    briefedByLogos: Array<{ name: string; src: string }>;
  };
  creatorCta: {
    eyebrow: string;
    headline: string;
    subhead: string;
    showFacesMarquee: boolean;
    stat1: string;
    stat2: string;
    primaryCtaLabel: string;
    primaryCtaHref: string;
    secondaryCtaLabel: string;
    secondaryCtaHref: string;
  };
  faq: {
    eyebrow: string;
    headline: string;
    subhead: string;
    items: HomeFaqItem[];
  };
  trustedBy: {
    introLine: string;
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
    primaryHref: "/apply-for-representation",
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
    featuredSlugs: [],
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
    logoSrc: "/brand/clients/notion-lockup.png",
    logoAlt: "Notion",
    headline: "How Notion built B2B's defining founder series —",
    headlineAccent: "without a studio.",
    summary:
      "One operator voice. Twelve episodes. End-to-end casting, format, and distribution — so Notion owned the category without standing up an in-house media team.",
    meta: [
      { label: "Pillar", value: "Brand Partnership" },
      { label: "Lead", value: "Alex Lieberman" },
      { label: "Term", value: "22 months" },
    ],
    showCta: true,
    ctaLabel: "Read the full project",
    ctaHref: projectHref("notion-founders-journal"),
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
    quotePhoto: "/images/experts/amara-chen.jpg",
    quoteLogo: "/brand/clients/stripe-wordmark-white.svg",
    quoteLogoName: "Stripe",
    formTitle: "Send a brief",
    formFootnote: "Shortlist within 48 hours · no pitch deck required",
    briefedByLabel: "Briefed by teams at",
    briefedByLogos: [
      { name: "Stripe", src: "/brand/clients/stripe-wordmark-white.svg" },
      { name: "Figma", src: "/brand/clients/figma-wordmark-white.svg" },
      { name: "Notion", src: "/brand/clients/notion-wordmark-white.png" },
      { name: "Linear", src: "/brand/clients/linear-wordmark-white.svg" },
      { name: "Vercel", src: "/brand/clients/vercel-wordmark-white.svg" },
    ],
  },
  creatorCta: {
    eyebrow: "For creators",
    headline: "Your audience is already a business. Run it like one.",
    subhead:
      "We represent 24 founders, operators and investors. You keep the voice. We handle the inbound, the pricing and the delivery.",
    showFacesMarquee: true,
    stat1: "24 creators represented",
    stat2: "Applications reviewed fortnightly",
    primaryCtaLabel: "Apply for representation",
    primaryCtaHref: "/apply-for-representation",
    secondaryCtaLabel: "What we offer creators",
    secondaryCtaHref: "/what-we-do",
  },
  faq: {
    eyebrow: "FAQ",
    headline: "Questions before you brief.",
    subhead:
      "How booking works, what to expect, and how we match creators to your brief.",
    items: [
      {
        q: "What should I include in a brief?",
        a: "Audience, goal, timing, and any creator or format preferences. We return a shortlist with reach data, past work, and scoped pricing — usually within 48 hours.",
      },
      {
        q: "Do you work with agencies as well as brands?",
        a: "Yes. In-house teams and agencies brief us the same way. We return named creators with reach, relevant work, and commercials in one document you can forward internally.",
      },
      {
        q: "Can we combine more than one format?",
        a: "Yes. Most engagements blend formats — for example editorial plus speaking, or a partnership supported by live sessions. We shape the mix around the outcome, not the menu.",
      },
      {
        q: "How do you choose creators?",
        a: "Fit to audience, category authority, format experience, and availability. You can name someone from the roster or ask us for a shortlist based on the business moment you are trying to solve.",
      },
      {
        q: "What happens after we send a brief?",
        a: "We acknowledge same day, return a shortlist within 48 hours when the roster fits, then scope delivery, approvals, and reporting in one managed plan.",
      },
      {
        q: "How is pricing structured?",
        a: "Format-level pricing scoped to the brief — not a generic rate card. We share numbers once we know audience, deliverables, and timing.",
      },
    ],
  },
  trustedBy: {
    introLine: "Trusted by the world's leading SaaS companies",
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

const APPLY_PAGE = "/apply-for-representation";

function pagePath(href: string) {
  return href.split("#")[0]?.split("?")[0] ?? href;
}

/** Saved homepage CTAs still point at /contact or retired /v2-* routes. */
function resolveApplyHref(href: string, label: string) {
  const path = pagePath(href);
  if (path === "/v2-apply-for-representation") return APPLY_PAGE;
  if (/apply/i.test(label) && path === "/contact") return APPLY_PAGE;
  return href;
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

function mergeFeaturedSlugs(raw: unknown, fallback: string[]): string[] {
  if (!Array.isArray(raw)) return [...fallback];
  const seen = new Set<string>();
  const out: string[] = [];
  for (const item of raw) {
    if (typeof item !== "string") continue;
    const slug = item.trim();
    if (!slug || seen.has(slug)) continue;
    seen.add(slug);
    out.push(slug);
    if (out.length >= 4) break;
  }
  return out;
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
    featuredSlugs: mergeFeaturedSlugs(data.featuredSlugs, defaults.featuredSlugs),
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

function mergeKeyStudyMeta(
  raw: unknown,
  defaults: HomePageSections["keyStudy"]["meta"],
): HomePageSections["keyStudy"]["meta"] {
  const data = (raw && typeof raw === "object" ? raw : {}) as Record<
    string,
    unknown
  >;

  if (Array.isArray(data.meta)) {
    const merged = data.meta
      .map((item, i) => {
        const row = (item && typeof item === "object" ? item : {}) as Partial<{
          label: string;
          value: string;
        }>;
        const fallback = defaults[i] ?? { label: "", value: "" };
        const label = asString(row.label, fallback.label);
        const value = asString(row.value, fallback.value);
        if (!label.trim() && !value.trim()) return null;
        return { label, value };
      })
      .filter((item): item is { label: string; value: string } => item !== null);

    if (merged.length > 0) return merged;
  }

  const legacy = [
    { label: "Pillar", value: asString(data.pillar, defaults[0]?.value ?? "") },
    { label: "Lead", value: asString(data.lead, defaults[1]?.value ?? "") },
    { label: "Term", value: asString(data.term, defaults[2]?.value ?? "") },
  ].filter((item) => item.value.trim());

  return legacy.length > 0 ? legacy : defaults;
}

function mergeKeyStudy(raw: unknown): HomePageSections["keyStudy"] {
  const defaults = DEFAULT_HOME_SECTIONS.keyStudy;
  const data = (raw && typeof raw === "object" ? raw : {}) as Partial<
    HomePageSections["keyStudy"]
  >;
  const metricsRaw = Array.isArray(data.metrics) ? data.metrics : [];
  return {
    logoSrc: asString(data.logoSrc, defaults.logoSrc),
    logoAlt: asString(data.logoAlt, defaults.logoAlt),
    headline: asString(data.headline, defaults.headline),
    headlineAccent: asString(data.headlineAccent, defaults.headlineAccent),
    summary: asString(data.summary, defaults.summary),
    meta: mergeKeyStudyMeta(raw, defaults.meta),
    showCta:
      typeof data.showCta === "boolean"
        ? data.showCta
        : !asString(data.ctaLabel, defaults.ctaLabel).trim()
          ? false
          : defaults.showCta,
    ctaLabel: (() => {
      const label = asString(data.ctaLabel, defaults.ctaLabel);
      return /^read the full case study$/i.test(label.trim())
        ? "Read the full project"
        : label;
    })(),
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

function mergeBriefedByLogos(
  raw: unknown,
  defaults: HomePageSections["brandBrief"]["briefedByLogos"],
): HomePageSections["brandBrief"]["briefedByLogos"] {
  if (!Array.isArray(raw)) return defaults;

  const merged = raw
    .map((item, i) => {
      const row = (item && typeof item === "object" ? item : {}) as Partial<{
        name: string;
        src: string;
      }>;
      const fallback = defaults[i] ?? { name: "", src: "" };
      const name = asString(row.name, fallback.name);
      const src = asString(row.src, fallback.src);
      if (!name.trim() && !src.trim()) return null;
      return { name, src };
    })
    .filter(
      (item): item is { name: string; src: string } => item !== null,
    );

  return merged.length > 0 ? merged : defaults;
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
    quotePhoto: asString(data.quotePhoto, defaults.quotePhoto),
    quoteLogo: asString(data.quoteLogo, defaults.quoteLogo),
    quoteLogoName: asString(data.quoteLogoName, defaults.quoteLogoName),
    formTitle: asString(data.formTitle, defaults.formTitle),
    formFootnote: asString(data.formFootnote, defaults.formFootnote),
    briefedByLabel: asString(data.briefedByLabel, defaults.briefedByLabel),
    briefedByLogos: mergeBriefedByLogos(data.briefedByLogos, defaults.briefedByLogos),
  };
}

function mergeCreatorCta(raw: unknown): HomePageSections["creatorCta"] {
  const defaults = DEFAULT_HOME_SECTIONS.creatorCta;
  const data = (raw && typeof raw === "object" ? raw : {}) as Partial<
    HomePageSections["creatorCta"]
  >;
  return {
    eyebrow: asString(data.eyebrow, defaults.eyebrow),
    headline: asString(data.headline, defaults.headline),
    subhead: asString(data.subhead, defaults.subhead),
    showFacesMarquee:
      typeof data.showFacesMarquee === "boolean"
        ? data.showFacesMarquee
        : defaults.showFacesMarquee,
    stat1: asString(data.stat1, defaults.stat1),
    stat2: asString(data.stat2, defaults.stat2),
    primaryCtaLabel: asString(data.primaryCtaLabel, defaults.primaryCtaLabel),
    primaryCtaHref: resolveApplyHref(
      asString(data.primaryCtaHref, defaults.primaryCtaHref),
      asString(data.primaryCtaLabel, defaults.primaryCtaLabel),
    ),
    secondaryCtaLabel: asString(
      data.secondaryCtaLabel,
      defaults.secondaryCtaLabel,
    ),
    secondaryCtaHref: asString(
      data.secondaryCtaHref,
      defaults.secondaryCtaHref,
    ),
  };
}

function mergeHomeFaqItems(
  raw: unknown,
  defaults: HomeFaqItem[],
): HomeFaqItem[] {
  if (!Array.isArray(raw)) return defaults.map((item) => ({ ...item }));

  const merged = raw
    .map((item, i) => {
      const row = (item && typeof item === "object" ? item : {}) as Partial<
        HomeFaqItem
      >;
      const fallback = defaults[i] ?? { q: "", a: "" };
      const q = asString(row.q, fallback.q);
      const a = asString(row.a, fallback.a);
      if (!q.trim() && !a.trim()) return null;
      return { q, a };
    })
    .filter((item): item is HomeFaqItem => item !== null);

  return merged.length > 0 ? merged : defaults.map((item) => ({ ...item }));
}

function mergeHomeFaq(raw: unknown): HomePageSections["faq"] {
  const defaults = DEFAULT_HOME_SECTIONS.faq;
  const data = (raw && typeof raw === "object" ? raw : {}) as Partial<
    HomePageSections["faq"]
  >;
  return {
    eyebrow: asString(data.eyebrow, defaults.eyebrow),
    headline: asString(data.headline, defaults.headline),
    subhead: asString(data.subhead, defaults.subhead),
    items: mergeHomeFaqItems(data.items, defaults.items),
  };
}

function mergeHomeTrustedBy(raw: unknown): HomePageSections["trustedBy"] {
  const defaults = DEFAULT_HOME_SECTIONS.trustedBy;
  const data = (raw && typeof raw === "object" ? raw : {}) as Partial<
    HomePageSections["trustedBy"]
  >;
  return {
    introLine: asString(data.introLine, defaults.introLine),
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
    creatorCta?: unknown;
    faq?: unknown;
    trustedBy?: unknown;
    footer?: unknown;
  };
  const hero = data.hero ?? {};
  const defaults = DEFAULT_HOME_SECTIONS.hero;
  const primaryCta = asString(hero.primaryCta, defaults.primaryCta);

  return {
    hero: {
      headline: asString(hero.headline, defaults.headline),
      subhead: asString(hero.subhead, defaults.subhead),
      primaryCta,
      primaryHref: resolveApplyHref(
        asString(hero.primaryHref, defaults.primaryHref),
        primaryCta,
      ),
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
    creatorCta: mergeCreatorCta(data.creatorCta),
    faq: mergeHomeFaq(data.faq),
    trustedBy: mergeHomeTrustedBy(data.trustedBy),
    footer: mergeFooter(data.footer),
  };
}

export function emptyHomeFaqItem(): HomeFaqItem {
  return { q: "", a: "" };
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
  id?: string;
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
  coverImageAlt?: string | null;
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

  const pillars = normalizeCaseStudyPillars({
    pillar: (row.pillar as CaseStudyCard["pillar"]) || DEFAULT_CASE_STUDY_PILLAR,
    pillars: Array.isArray(data.pillars) ? data.pillars : undefined,
    meta: data.meta,
  });

  return {
    id: row.id,
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
    blocks: Array.isArray(data.blocks) ? data.blocks : undefined,
    ctaCreator: data.ctaCreator,
    pillar: pillars[0] ?? DEFAULT_CASE_STUDY_PILLAR,
    pillars,
    clientType: (row.clientType as CaseStudyCard["clientType"]) || "Direct client",
    industry: row.industry || "",
    size: row.size || "",
    period: row.period || "",
    relatedExperts: Array.isArray(row.relatedExperts)
      ? row.relatedExperts.filter((slug) => typeof slug === "string" && slug.trim())
      : data.ctaCreator?.slug
        ? [data.ctaCreator.slug]
        : [],
    coverImage: row.coverImage || data.coverImage || "/images/case-studies/notion.jpg",
    coverImageAlt: row.coverImageAlt?.trim() || data.coverImageAlt?.trim() || undefined,
    logo: data.logo ?? CASE_STUDY_LOGO,
    logoAlt: typeof data.logoAlt === "string" ? data.logoAlt.trim() || undefined : undefined,
    featured: row.featured || Boolean(data.featured),
    seoTitle: row.seoTitle ?? undefined,
    seoDescription: row.seoDescription ?? undefined,
    ogImage:
      typeof data.ogImage === "string" && data.ogImage.trim()
        ? data.ogImage.trim()
        : undefined,
    ogImageAlt:
      typeof data.ogImageAlt === "string" && data.ogImageAlt.trim()
        ? data.ogImageAlt.trim()
        : undefined,
  };
}

export function caseStudyCardToRow(card: CaseStudyCard) {
  const pillars = normalizeCaseStudyPillars(card);
  const {
    id: _id,
    slug,
    title,
    summary,
    client,
    pillar: _pillar,
    pillars: _pillars,
    clientType,
    industry,
    size,
    period,
    relatedExperts,
    coverImage,
    coverImageAlt: _coverImageAlt,
    featured,
    seoTitle: _seoTitle,
    seoDescription: _seoDescription,
    ogImage: _ogImage,
    ...rest
  } = card;

  const meta = [
    { label: "Client", value: client },
    { label: "Pillars used", value: pillars.join(" · ") },
  ];

  const speakers = [
    ...new Set(
      (relatedExperts ?? [])
        .map((item) => item.trim())
        .filter(Boolean),
    ),
  ];

  return {
    slug,
    title,
    summary,
    client,
    pillar: pillars[0] ?? DEFAULT_CASE_STUDY_PILLAR,
    clientType,
    industry,
    size,
    period: period ?? "",
    coverImage,
    coverImageAlt: card.coverImageAlt?.trim() || null,
    featured: Boolean(featured),
    seoTitle: card.seoTitle?.trim() || null,
    seoDescription: card.seoDescription?.trim() || null,
    data: {
      ...rest,
      pillars,
      ogImage: card.ogImage?.trim() || undefined,
      ogImageAlt: card.ogImageAlt?.trim() || undefined,
      meta: Array.isArray(rest.meta) && rest.meta.length > 0 ? rest.meta : meta,
    },
    relatedExperts: speakers,
  };
}
