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
  ctaCreator?: CaseStudyCtaCreator;
  pillar: "Content" | "Brand" | "Speaking" | "Live";
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
  "Content",
  "Brand",
  "Speaking",
  "Live",
] as const;

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
      { label: "Client roster", value: "Notion, Ramp, SaaStr, others" },
      { label: "Duration", value: "18 months (ongoing)" },
      { label: "Pillars used", value: "Content · Brand · Speaking" },
      { label: "Gross revenue", value: "$4.2M" },
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
    pillar: "Content",
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
        "Founder voice building category media — newsletters, stages, and brand programs that compound.",
      image: "/images/experts/noah-bennett.jpg",
      role: "Founder / C-Suite",
      topics: ["Media", "SaaS", "Brand"],
      combinedReach: "2.4M",
      growth90d: "+28%",
      audienceWho: "Founders & operators",
      audienceWhere: "B2B media & SaaS",
      channels: [
        { type: "linkedin", url: "https://www.linkedin.com/" },
        { type: "podcast", url: "https://open.spotify.com/" },
        { type: "x", url: "https://x.com/" },
      ],
    },
  },
  {
    slug: "hubspot-fintech-report",
    client: "HubSpot",
    title: "HubSpot's fintech report — with a category investor",
    summary:
      "A quarterly research release fronted by a category-defining investor. 41k downloads in eight weeks.",
    pillar: "Content",
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
    pillar: "Brand",
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
    pillar: "Live",
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
    pillar: "Content",
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
    pillar: "Brand",
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
    pillar: "Live",
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
  return {
    title: study.heroTitle ?? study.title,
    titleEmphasis: study.heroTitleEmphasis,
    summary: study.heroSummary ?? study.summary,
    meta:
      study.meta ??
      ([
        { label: "Client", value: study.client },
        { label: "Duration", value: study.period },
        { label: "Pillar", value: study.pillar },
        { label: "Client type", value: study.clientType },
      ] satisfies CaseStudyMeta[]),
    results: study.results ?? [],
  };
}

export function similarCaseStudies(slug: string, limit = 3) {
  const current = getCaseStudy(slug);
  const others = CASE_STUDIES.filter((study) => study.slug !== slug);

  if (!current) return others.slice(0, limit);

  const samePillar = others.filter((study) => study.pillar === current.pillar);
  const rest = others.filter((study) => study.pillar !== current.pillar);

  return [...samePillar, ...rest].slice(0, limit);
}

export function secondaryCaseStudies() {
  return CASE_STUDIES.filter((study) => !study.featured).slice(0, 4);
}

export function filterCaseStudies(filters: {
  clientType?: string;
  pillar?: string;
  q?: string;
}) {
  const q = filters.q?.trim().toLowerCase();

  return CASE_STUDIES.filter((study) => {
    if (
      filters.clientType &&
      study.clientType.toLowerCase() !== filters.clientType.toLowerCase()
    ) {
      return false;
    }
    if (
      filters.pillar &&
      study.pillar.toLowerCase() !== filters.pillar.toLowerCase()
    ) {
      return false;
    }
    if (q) {
      const hay =
        `${study.title} ${study.client} ${study.summary} ${study.industry} ${study.pillar}`.toLowerCase();
      if (!hay.includes(q)) return false;
    }
    return true;
  });
}
