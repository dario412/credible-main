import type { CaseStudyBlock } from "@/lib/case-study-content";

export type CaseStudyMeta = {
  label: string;
  value: string;
};

export type CaseStudyResult = {
  value: string;
  caption: string;
  label?: string;
};

export type CaseStudyQuote = {
  label: string;
  text: string;
  name: string;
  role: string;
  /** Optional portrait; falls back to initials */
  image?: string;
  initials?: string;
};

export type CaseStudyDeliverable = {
  label: string;
  title: string;
  meta: string;
  logo: string;
};

export type CaseStudyCtaCreator = {
  name: string;
  slug: string;
  shortBio: string;
  image: string;
  role: string;
  topics: string[];
  combinedReach: string;
  growth90d: string;
  audienceWho: string;
  audienceWhere: string;
  channels: {
    type: "linkedin" | "youtube" | "podcast" | "x";
    url: string;
  }[];
};

export type CaseStudyStory = {
  challenge: string[];
  approach: string[];
  outcomes: string[];
  outcomesHeadline?: string;
  deliverablesHeadline?: string;
  deliverablesIntro?: string[];
  deliverables: CaseStudyDeliverable[];
};

export type CaseStudyCard = {
  slug: string;
  client: string;
  title: string;
  summary: string;
  /** Display title on the detail hero; falls back to `title` */
  heroTitle?: string;
  /** Italic trailing phrase on the detail hero, e.g. "ubiquity." */
  heroTitleEmphasis?: string;
  heroSummary?: string;
  meta?: CaseStudyMeta[];
  results?: CaseStudyResult[];
  quote?: CaseStudyQuote;
  story?: CaseStudyStory;
  /** Ordered body content — preferred over legacy quote/story/results. */
  blocks?: CaseStudyBlock[];
  ctaCreator?: CaseStudyCtaCreator;
  /** DB id when loaded from CMS — used to update in place on save. */
  id?: string;
  /** Primary pillar (DB column). Prefer `pillars` for display. */
  pillar: CaseStudyPillar;
  /** Engagement pillars shown on cards and the detail hero. */
  pillars?: CaseStudyPillar[];
  clientType: "Direct client" | "Agency client";
  industry: string;
  size: string;
  period: string;
  coverImage: string;
  logo?: string;
  featured?: boolean;
};

/** Placeholder brand mark for development — Notion cube everywhere */
export const CASE_STUDY_LOGO = "/brand/notion-logo.png";

export const CASE_STUDY_CLIENT_TYPES = [
  "Direct client",
  "Agency client",
] as const;

export const CASE_STUDY_PILLARS = [
  "Brand Partnership",
  "Ambassador",
  "Speaking",
  "Live Event",
] as const;

export type CaseStudyPillar = (typeof CASE_STUDY_PILLARS)[number];

export const DEFAULT_CASE_STUDY_PILLAR: CaseStudyPillar = CASE_STUDY_PILLARS[0];

const PILLAR_SET = new Set<string>(CASE_STUDY_PILLARS);

/** Legacy admin labels — mapped on read so existing DB rows keep working. */
const LEGACY_CASE_STUDY_PILLARS: Record<string, CaseStudyPillar> = {
  Content: "Brand Partnership",
  Brand: "Ambassador",
  Live: "Live Event",
};

export function migrateCaseStudyPillar(value: string): CaseStudyPillar | null {
  if (isCaseStudyPillar(value)) return value;
  return LEGACY_CASE_STUDY_PILLARS[value] ?? null;
}

export function isCaseStudyPillar(value: string): value is CaseStudyPillar {
  return PILLAR_SET.has(value);
}

export function splitCaseStudyPillars(value: string): string[] {
  return value
    .split(/[·•|,/]/)
    .map((part) => part.trim())
    .filter(Boolean);
}

function uniquePillars(values: string[]): CaseStudyPillar[] {
  const seen = new Set<CaseStudyPillar>();
  const ordered: CaseStudyPillar[] = [];

  for (const value of values) {
    const pillar = migrateCaseStudyPillar(value);
    if (!pillar || seen.has(pillar)) continue;
    seen.add(pillar);
    ordered.push(pillar);
  }

  return CASE_STUDY_PILLARS.filter((pillar) => seen.has(pillar));
}

export function normalizeCaseStudyPillars(
  study: Pick<CaseStudyCard, "pillar" | "pillars" | "meta">,
): CaseStudyPillar[] {
  if (Array.isArray(study.pillars) && study.pillars.length > 0) {
    const fromArray = uniquePillars(study.pillars);
    if (fromArray.length > 0) return fromArray;
  }

  const pillarsFromMeta = study.meta?.find((item) =>
    /pillar/i.test(item.label),
  )?.value;
  if (pillarsFromMeta?.trim()) {
    const fromMeta = uniquePillars(splitCaseStudyPillars(pillarsFromMeta));
    if (fromMeta.length > 0) return fromMeta;
  }

  const migrated = migrateCaseStudyPillar(study.pillar);
  return migrated ? [migrated] : [DEFAULT_CASE_STUDY_PILLAR];
}

export function formatCaseStudyPillars(
  study: Pick<CaseStudyCard, "pillar" | "pillars" | "meta">,
) {
  return normalizeCaseStudyPillars(study).join(" · ");
}

export const CASE_STUDIES: CaseStudyCard[] = [
  {
    slug: "notion-founders-journal",
    client: "Notion",
    title:
      "The Founder's Journal — Notion's flagship B2B media property",
    summary:
      "A 22-month partnership. Twelve episodes with an operator as editorial lead. 4.1M downloads and $18.4M in first-touch pipeline — the playbook the category keeps trying to reverse-engineer.",
    heroTitle: "From newsletter voice to B2B",
    heroTitleEmphasis: "ubiquity.",
    heroSummary:
      "How Credible built out Alex Lieberman's post-Morning Brew business across content, brand, and stage — in 18 months, without a single one-off influencer post.",
    meta: [
      { label: "Client", value: "Notion" },
      {
        label: "Pillars used",
        value: "Brand Partnership · Ambassador · Speaking",
      },
    ],
    pillars: ["Brand Partnership", "Ambassador", "Speaking"],
    blocks: [
      {
        type: "quoteFull",
        text: "I'd been managing myself for two years and hitting a ceiling. Credible built the business I couldn't build alone — and did it without ever making me feel like a product on a shelf.",
        name: "Alex Lieberman",
        role: "Co-founder, Morning Brew",
      },
      { type: "h2", text: "The challenge", id: "challenge" },
      {
        type: "p",
        text: "After Morning Brew, Alex had the audience every B2B brand wanted — and a calendar full of one-off asks that never compounded. Brands wanted a post. Agencies wanted a rate. Nobody wanted to build a real business around the trust he'd earned.",
      },
      {
        type: "p",
        text: "Self-managing for two years meant leaving pipeline on the table, saying yes to the wrong work, and watching category peers industrialize while he stayed stuck in inbox mode.",
      },
      { type: "h2", text: "Our approach", id: "approach" },
      {
        type: "p",
        text: "We treated Alex like a company, not a channel. Credible built the operating system: positioning, offer architecture, pricing, and a roster of brand partners who bought programs — not posts.",
      },
      {
        type: "p",
        text: "Content, brand, and speaking ran as one system. Each flagship series, keynote, and ambassador seat fed the next. No freelancers stitching briefs. One team owning the commercial relationship end-to-end.",
      },
      {
        type: "h2",
        text: "Eighteen months, four revenue lines.",
        id: "outcomes",
      },
      {
        type: "p",
        text: "In eighteen months the business moved from scattered inbound to four compounding revenue lines — content partnerships, keynotes, audience growth, and program retainers — without a single one-off influencer post.",
      },
      {
        type: "stats",
        items: [
          {
            label: "Content partnerships",
            value: "6",
            caption: "Ongoing series, 12–18 month terms",
          },
          {
            label: "Keynotes delivered",
            value: "19",
            caption: "Avg fee 3.4× baseline",
          },
          {
            label: "Reach growth",
            value: "+58%",
            caption: "Combined, 18 months",
          },
          {
            label: "Gross revenue",
            value: "$4.2M",
            caption: "Across all pillars",
          },
        ],
      },
      {
        type: "h2",
        text: "What actually shipped.",
        id: "deliverables",
      },
      {
        type: "deliverables",
        intro: [
          "Flagship programs with Notion, Ramp, and SaaStr — each structured as an ongoing partnership, not a one-off post.",
        ],
        items: [
          {
            label: "Notion",
            title: "The Founder's Journal — sponsored series",
            meta: "12 episodes · 4.1M downloads · 22-month term",
            logo: "/brand/clients/notion-wordmark.png",
          },
          {
            label: "Ramp",
            title: "Year of Founders ambassadorship",
            meta: "18 months · content + events + podcast",
            logo: "/brand/clients/ramp.svg",
          },
          {
            label: "SaaStr",
            title: "SaaStr Annual closing keynote",
            meta: "12,000 attendees · highest-rated session 2025",
            logo: "/brand/clients/saastr.svg",
          },
        ],
      },
    ],
    results: [
      {
        label: "Content partnerships",
        value: "6",
        caption: "Ongoing series, 12–18 month terms",
      },
      {
        label: "Keynotes delivered",
        value: "19",
        caption: "Avg fee 3.4× baseline",
      },
      {
        label: "Reach growth",
        value: "+58%",
        caption: "Combined, 18 months",
      },
      {
        label: "Gross revenue",
        value: "$4.2M",
        caption: "Across all pillars",
      },
    ],
    quote: {
      label: "Alex on the work",
      text: "I'd been managing myself for two years and hitting a ceiling. Credible built the business I couldn't build alone — and did it without ever making me feel like a product on a shelf.",
      name: "Alex Lieberman",
      role: "Co-founder, Morning Brew",
      initials: "AL",
      image: "/images/experts/noah-bennett.jpg",
    },
    story: {
      challenge: [
        "After Morning Brew, Alex had the audience every B2B brand wanted — and a calendar full of one-off asks that never compounded. Brands wanted a post. Agencies wanted a rate. Nobody wanted to build a real business around the trust he'd earned.",
        "Self-managing for two years meant leaving pipeline on the table, saying yes to the wrong work, and watching category peers industrialize while he stayed stuck in inbox mode.",
      ],
      approach: [
        "We treated Alex like a company, not a channel. Credible built the operating system: positioning, offer architecture, pricing, and a roster of brand partners who bought programs — not posts.",
        "Content, brand, and speaking ran as one system. Each flagship series, keynote, and ambassador seat fed the next. No freelancers stitching briefs. One team owning the commercial relationship end-to-end.",
      ],
      outcomes: [
        "In eighteen months the business moved from scattered inbound to four compounding revenue lines — content partnerships, keynotes, audience growth, and program retainers — without a single one-off influencer post.",
      ],
      outcomesHeadline: "Eighteen months, four revenue lines.",
      deliverablesHeadline: "What actually shipped.",
      deliverablesIntro: [
        "Flagship programs with Notion, Ramp, and SaaStr — each structured as an ongoing partnership, not a one-off post.",
      ],
      deliverables: [
        {
          label: "Notion",
          title: "The Founder's Journal — sponsored series",
          meta: "12 episodes · 4.1M downloads · 22-month term",
          logo: "/brand/clients/notion-wordmark.png",
        },
        {
          label: "Ramp",
          title: "Year of Founders ambassadorship",
          meta: "18 months · content + events + podcast",
          logo: "/brand/clients/ramp.svg",
        },
        {
          label: "SaaStr",
          title: "SaaStr Annual closing keynote",
          meta: "12,000 attendees · highest-rated session 2025",
          logo: "/brand/clients/saastr.svg",
        },
      ],
    },
    pillar: "Brand Partnership",
    clientType: "Direct client",
    industry: "Software & technology",
    size: "Mid-size",
    period: "2024–2026",
    coverImage: "/images/case-studies/notion.jpg",
    logo: CASE_STUDY_LOGO,
    featured: true,
    ctaCreator: {
      name: "Alex Lieberman",
      slug: "alex-lieberman",
      shortBio:
        "Morning Brew co-founder and Founder’s Journal host — the operator voice founders already listen to.",
      image: "/images/experts/alex-lieberman.png",
      role: "Founder / C-Suite",
      topics: ["Entrepreneurship", "Media", "Creator economy"],
      combinedReach: "3.2M",
      growth90d: "+18%",
      audienceWho: "Founders & operators",
      audienceWhere: "SaaS, media & startups",
      channels: [
        { type: "linkedin", url: "https://www.linkedin.com/in/alexlieberman" },
        { type: "podcast", url: "https://www.youtube.com/@foundersjournal" },
        { type: "x", url: "https://x.com/businessbarista" },
      ],
    },
  },
  {
    slug: "hubspot-fintech-report",
    client: "HubSpot",
    title: "HubSpot's fintech report — with a category investor",
    summary:
      "A quarterly research release fronted by a category-defining investor. 41k downloads in eight weeks.",
    pillar: "Brand Partnership",
    clientType: "Direct client",
    industry: "Marketing & SaaS",
    size: "Enterprise",
    period: "2025",
    coverImage: "/images/case-studies/hubspot.jpg",
    logo: CASE_STUDY_LOGO,
  },
  {
    slug: "vanta-category-ambassador",
    client: "Vanta",
    title: "Vanta's category ambassador program",
    summary:
      "Twelve months of content and events that put a practitioner voice at the centre of Vanta's category leadership.",
    pillar: "Ambassador",
    clientType: "Direct client",
    industry: "Security & compliance",
    size: "Growth",
    period: "2024–25",
    coverImage: "/images/case-studies/vanta.jpg",
    logo: CASE_STUDY_LOGO,
  },
  {
    slug: "ramp-summit-keynote",
    client: "Ramp",
    title: "Ramp Summit — closing keynote for finance leaders",
    summary:
      "Closing keynote to 2,400 finance leaders. Highest-rated session of the summit — 4.9/5 attendee score.",
    pillar: "Speaking",
    clientType: "Direct client",
    industry: "Fintech",
    size: "Growth",
    period: "2025",
    coverImage: "/images/case-studies/ramp.jpg",
    logo: CASE_STUDY_LOGO,
  },
  {
    slug: "stripe-founder-salons",
    client: "Stripe",
    title: "Stripe's founder salons — a closed network in four cities",
    summary:
      "Four cities, sixteen dinners, 340 founders in the room. A closed network Stripe couldn't have built alone.",
    pillar: "Live Event",
    clientType: "Direct client",
    industry: "Payments & infrastructure",
    size: "Enterprise",
    period: "2025",
    coverImage: "/images/case-studies/stripe.jpg",
    logo: CASE_STUDY_LOGO,
  },
  {
    slug: "linear-product-series",
    client: "Linear",
    title: "Linear's operator series — shipping in public with practitioners",
    summary:
      "A six-part series that put product operators in the frame and turned roadmap craft into category narrative.",
    pillar: "Brand Partnership",
    clientType: "Agency client",
    industry: "Software & technology",
    size: "Growth",
    period: "2025",
    coverImage: "/images/case-studies/notion.jpg",
    logo: CASE_STUDY_LOGO,
  },
  {
    slug: "figma-brand-film",
    client: "Figma",
    title: "Figma's brand film — designers who build the tools",
    summary:
      "A brand film fronted by design leaders. Launched at Config to an audience that already spoke the language.",
    pillar: "Ambassador",
    clientType: "Agency client",
    industry: "Design & creative",
    size: "Enterprise",
    period: "2025",
    coverImage: "/images/case-studies/hubspot.jpg",
    logo: CASE_STUDY_LOGO,
  },
  {
    slug: "attio-sales-keynote",
    client: "Attio",
    title: "Attio at SaaStr — a founder keynote on CRM without the bloat",
    summary:
      "Main-stage keynote that framed Attio's point of view for buyers tired of legacy CRM theatre.",
    pillar: "Speaking",
    clientType: "Direct client",
    industry: "CRM & sales",
    size: "SMB",
    period: "2025",
    coverImage: "/images/case-studies/ramp.jpg",
    logo: CASE_STUDY_LOGO,
  },
  {
    slug: "clerk-community-dinners",
    client: "Clerk",
    title: "Clerk's builder dinners — auth conversations off the record",
    summary:
      "Eight cities, intimate rooms, the buyers who actually ship auth. A live network that compounds.",
    pillar: "Live Event",
    clientType: "Agency client",
    industry: "Developer tools",
    size: "Growth",
    period: "2025",
    coverImage: "/images/case-studies/stripe.jpg",
    logo: CASE_STUDY_LOGO,
  },
];

export function getCaseStudy(slug: string) {
  return CASE_STUDIES.find((study) => study.slug === slug);
}

export function featuredCaseStudy() {
  return CASE_STUDIES.find((study) => study.featured) ?? CASE_STUDIES[0];
}

export function caseStudyHero(study: CaseStudyCard) {
  const pillars = normalizeCaseStudyPillars(study);

  return {
    title: study.heroTitle ?? study.title,
    titleEmphasis: study.heroTitleEmphasis,
    summary: study.heroSummary ?? study.summary,
    client: study.client,
    pillars,
    meta: [
      { label: "Client", value: study.client },
      {
        label: "Pillars used",
        value: pillars.join(" · "),
      },
    ] satisfies CaseStudyMeta[],
    results: study.results ?? [],
  };
}

export function similarCaseStudies(slug: string, limit = 3) {
  const current = getCaseStudy(slug);
  const others = CASE_STUDIES.filter((study) => study.slug !== slug);

  if (!current) return others.slice(0, limit);

  const currentPillars = new Set(normalizeCaseStudyPillars(current));
  const samePillar = others.filter((study) =>
    normalizeCaseStudyPillars(study).some((p) => currentPillars.has(p)),
  );
  const rest = others.filter(
    (study) =>
      !normalizeCaseStudyPillars(study).some((p) => currentPillars.has(p)),
  );

  return [...samePillar, ...rest].slice(0, limit);
}

export function secondaryCaseStudies() {
  return CASE_STUDIES.filter((study) => !study.featured).slice(0, 4);
}

export function filterCaseStudies(
  filters: {
    clientType?: string;
    pillar?: string;
    q?: string;
  },
  source: CaseStudyCard[] = CASE_STUDIES,
) {
  const q = filters.q?.trim().toLowerCase();

  return source.filter((study) => {
    if (
      filters.clientType &&
      study.clientType.toLowerCase() !== filters.clientType.toLowerCase()
    ) {
      return false;
    }
    if (filters.pillar) {
      const filterPillar =
        migrateCaseStudyPillar(filters.pillar) ?? filters.pillar;
      if (
        !normalizeCaseStudyPillars(study).some(
          (p) => p.toLowerCase() === filterPillar.toLowerCase(),
        )
      ) {
        return false;
      }
    }
    if (q) {
      const hay =
        `${study.title} ${study.client} ${study.summary} ${study.industry} ${formatCaseStudyPillars(study)}`.toLowerCase();
      if (!hay.includes(q)) return false;
    }
    return true;
  });
}
