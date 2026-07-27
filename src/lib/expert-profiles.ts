export type ExpertProfileStat = {
  label: string;
  value: string;
  accent?: "forest";
};

export type ExpertChannelPresence = {
  platform: string;
  handle: string;
  followers: string;
  growth90d: string;
  engagement: string;
  icon: "linkedin" | "youtube" | "podcast" | "newsletter" | "x";
  url?: string;
};

export type ExpertTopicShare = {
  label: string;
  percent: number;
};

export type ExpertAudienceSlice = {
  label: string;
  percent: number;
};

export type ExpertAudience = {
  seniority: ExpertAudienceSlice[];
  industry: ExpertAudienceSlice[];
  geography: ExpertAudienceSlice[];
};

export type ExpertFormatOffering = {
  category: string;
  title: string;
  description: string;
  pricing: string;
};

export type ExpertRecentWork = {
  client: string;
  meta: string;
  title: string;
  description: string;
  href?: string;
  tone: "forest" | "rust" | "sage";
};

export type ExpertProfileEnrichment = {
  based?: string;
  languages?: string[];
  representationStatus?: "SIGNED" | "AVAILABLE";
  quote?: string;
  quoteAttribution?: string;
  stats?: ExpertProfileStat[];
  channels?: ExpertChannelPresence[];
  topicShares?: ExpertTopicShare[];
  audience?: ExpertAudience;
  formats?: ExpertFormatOffering[];
  recentWork?: ExpertRecentWork[];
  featuredCaseStudyHref?: string;
  /** Full-bleed stage / keynote hero image */
  stageImage?: string;
  /** CSS object-position for the stage image (e.g. "center 28%") */
  stageImagePosition?: string;
  /** Background image for the bottom CTA band */
  ctaImage?: string;
  /** One-line proof of why this talent matters */
  heroProof?: string;
  /** Brands this talent has worked with */
  trustedBy?: { name: string; logo?: string }[];
};

/** White wordmarks so every hero logo reads on the dark stage image. */
const BRAND_LOGOS = {
  Notion: "/brand/clients/notion-wordmark-white.svg",
  Stripe: "/brand/clients/stripe-wordmark-white.svg",
  Linear: "/brand/clients/linear-wordmark-white.svg",
  Figma: "/brand/clients/figma-wordmark-white.svg",
  Vercel: "/brand/clients/vercel-wordmark-white.svg",
  Intercom: "/brand/clients/intercom-wordmark-white.svg",
  Ramp: "/brand/clients/ramp-wordmark-white.svg",
  Retool: "/brand/clients/retool-wordmark-white.svg",
  Loom: "/brand/clients/loom-wordmark-white.svg",
  Cursor: "/brand/clients/cursor-wordmark-white.svg",
} as const;

function brands(...names: (keyof typeof BRAND_LOGOS)[]) {
  return names.map((name) => ({ name, logo: BRAND_LOGOS[name] }));
}

/** Profile fields not yet in the Expert model — keyed by slug. */
export const EXPERT_PROFILE_ENRICHMENT: Record<string, ExpertProfileEnrichment> =
  {
    "alex-lieberman": {
      based: "New York",
      languages: ["English"],
      representationStatus: "SIGNED",
      stageImage: "/images/experts/alex-lieberman-stage.png",
      stageImagePosition: "center 28%",
      ctaImage: "/images/experts/alex-lieberman-cta.jpg",
      heroProof:
        "Morning Brew co-founder. Founder’s Journal host. The operator voice founders already listen to.",
      trustedBy: brands(
        "Notion",
        "Ramp",
        "Stripe",
        "Linear",
        "Intercom",
        "Cursor",
        "Figma",
        "Vercel",
        "Retool",
        "Loom",
      ),
      quote:
        "The best founder stories don’t sell a product — they make operators feel less alone in the work.",
      quoteAttribution: "— from Founder’s Journal, Season 1",
      stats: [
        { label: "Combined reach", value: "3.2M" },
        { label: "Podcast downloads", value: "2.1M" },
        { label: "Newsletter reach", value: "4M+" },
        { label: "Growth (90d)", value: "+18%", accent: "forest" },
      ],
      featuredCaseStudyHref: "/case-studies/notion-founders-journal",
      channels: [
        {
          icon: "linkedin",
          platform: "LinkedIn",
          handle: "@alexlieberman",
          followers: "890k",
          growth90d: "+6.2%",
          engagement: "4.1%",
          url: "https://www.linkedin.com/in/alexlieberman",
        },
        {
          icon: "podcast",
          platform: "Podcast",
          handle: "Founder’s Journal",
          followers: "2.1M dl",
          growth90d: "+12.4%",
          engagement: "n/a",
          url: "https://www.youtube.com/@foundersjournal",
        },
        {
          icon: "youtube",
          platform: "YouTube",
          handle: "Founder’s Journal",
          followers: "186k",
          growth90d: "+9.8%",
          engagement: "5.4%",
          url: "https://www.youtube.com/@foundersjournal",
        },
        {
          icon: "newsletter",
          platform: "Newsletter",
          handle: "Morning Brew network",
          followers: "4M+",
          growth90d: "+3.1%",
          engagement: "41% open",
        },
        {
          icon: "x",
          platform: "X / Twitter",
          handle: "@businessbarista",
          followers: "312k",
          growth90d: "+2.4%",
          engagement: "1.6%",
          url: "https://x.com/businessbarista",
        },
      ],
      topicShares: [
        { label: "Entrepreneurship", percent: 32 },
        { label: "Media businesses", percent: 22 },
        { label: "Creator economy", percent: 16 },
        { label: "Leadership", percent: 12 },
        { label: "Career", percent: 10 },
        { label: "SaaS growth", percent: 8 },
      ],
      audience: {
        seniority: [
          { label: "Founder / C-Suite", percent: 41 },
          { label: "VP / Director", percent: 26 },
          { label: "Manager / IC", percent: 22 },
          { label: "Investor", percent: 11 },
        ],
        industry: [
          { label: "SaaS / Tech", percent: 38 },
          { label: "Media / Marketing", percent: 28 },
          { label: "Financial services", percent: 12 },
          { label: "Other", percent: 22 },
        ],
        geography: [
          { label: "US", percent: 72 },
          { label: "UK", percent: 9 },
          { label: "Canada", percent: 6 },
        ],
      },
      formats: [
        {
          category: "Content",
          title: "Podcast series",
          description:
            "Hosted or co-produced series with brand integration. Built for operators who already trust Alex’s voice.",
          pricing: "Custom scoped",
        },
        {
          category: "Speaking",
          title: "Keynote",
          description:
            "45–60 minute delivery. Preferred topics: building media businesses, founder storytelling, and creator-led growth.",
          pricing: "From $65k",
        },
        {
          category: "Speaking",
          title: "Fireside",
          description:
            "Moderated conversation format. Strong for founder summits, closed-door exec events, and product launches.",
          pricing: "From $45k",
        },
        {
          category: "Brand",
          title: "Ambassadorship",
          description:
            "12–18 month terms only. Selective — Alex takes on a small number of brand partners per year.",
          pricing: "Custom scoped",
        },
      ],
      recentWork: [
        {
          client: "Notion",
          meta: "Content partnership · 2024",
          title: "Notion × Founder’s Journal",
          description:
            "A 12-episode series on how operators build companies — and the tools that keep them clear.",
          href: "/case-studies/notion-founders-journal",
          tone: "sage",
        },
        {
          client: "Ramp",
          meta: "Ambassador · 2024–25",
          title: "Ramp — Year of Founders",
          description:
            "Long-form brand partnership across editorial, podcast, and live stages.",
          href: "/case-studies/ramp-summit-keynote",
          tone: "forest",
        },
        {
          client: "HubSpot",
          meta: "Keynote · 2025",
          title: "HubSpot — media company keynote",
          description:
            "“Why every SaaS company is now a media company.” Main-stage delivery.",
          href: "/case-studies/hubspot-fintech-report",
          tone: "rust",
        },
      ],
    },
    "amara-chen": {
      based: "Singapore",
      languages: ["English", "Mandarin"],
      representationStatus: "SIGNED",
      stageImage: "/images/case-studies/notion.jpg",
      heroProof:
        "Operator-turned-founder. 90+ keynote stages. The culture voice buyers already trust.",
      trustedBy: brands(
        "Notion",
        "Figma",
        "Ramp",
        "Retool",
        "Loom",
        "Vercel",
        "Stripe",
        "Linear",
        "Intercom",
        "Cursor",
      ),
      quote:
        "Culture is the operating system. Get it right and growth compounds without force.",
      quoteAttribution: "— from a 2025 SaaStr keynote",
      stats: [
        { label: "Combined reach", value: "4.8M" },
        { label: "Newsletter subs", value: "180k" },
        { label: "Keynote stages", value: "90+" },
        { label: "Growth (90d)", value: "+42%", accent: "forest" },
      ],
      featuredCaseStudyHref: "/case-studies/notion-founders-journal",
      channels: [
        {
          icon: "linkedin",
          platform: "LinkedIn",
          handle: "@amarachen",
          followers: "2.4M",
          growth90d: "+8.4%",
          engagement: "3.2%",
        },
        {
          icon: "youtube",
          platform: "YouTube",
          handle: "Operator Notes",
          followers: "312k",
          growth90d: "+22.1%",
          engagement: "6.1%",
        },
        {
          icon: "podcast",
          platform: "Podcast",
          handle: "Operator Notes / Culture OS",
          followers: "2.1M dl",
          growth90d: "+14.0%",
          engagement: "n/a",
        },
        {
          icon: "newsletter",
          platform: "Newsletter",
          handle: "Clarity Weekly",
          followers: "180k",
          growth90d: "+6.8%",
          engagement: "44% open",
        },
        {
          icon: "x",
          platform: "X / Twitter",
          handle: "@amarachen",
          followers: "218k",
          growth90d: "-1.2%",
          engagement: "0.8%",
        },
      ],
      topicShares: [
        { label: "Entrepreneurship", percent: 28 },
        { label: "Media businesses", percent: 21 },
        { label: "Creator economy", percent: 17 },
        { label: "Leadership culture", percent: 13 },
        { label: "SaaS growth", percent: 11 },
        { label: "Career", percent: 10 },
      ],
      audience: {
        seniority: [
          { label: "Founder / C-Suite", percent: 38 },
          { label: "VP / Director", percent: 27 },
          { label: "Manager / IC", percent: 24 },
          { label: "Investor", percent: 11 },
        ],
        industry: [
          { label: "SaaS / Tech", percent: 42 },
          { label: "Media / Marketing", percent: 23 },
          { label: "Financial services", percent: 14 },
          { label: "Other", percent: 21 },
        ],
        geography: [
          { label: "US", percent: 61 },
          { label: "UK", percent: 12 },
          { label: "Singapore", percent: 8 },
        ],
      },
      formats: [
        {
          category: "Speaking",
          title: "Keynote",
          description:
            "45–60 minute delivery. Preferred topics: culture systems, founder leadership, and scaling expert brands.",
          pricing: "From $75k",
        },
        {
          category: "Speaking",
          title: "Fireside",
          description:
            "Moderated conversation format. Works well for closed-door executive events and summits.",
          pricing: "From $50k",
        },
        {
          category: "Content",
          title: "Podcast series",
          description:
            "Sponsored series (host or guest). Includes brand integration and distribution.",
          pricing: "Custom scoped",
        },
        {
          category: "Brand",
          title: "Ambassadorship",
          description:
            "12–18 month terms only. Selective — Amara takes on 2 ambassador partners per year maximum.",
          pricing: "Custom scoped",
        },
      ],
      recentWork: [
        {
          client: "Notion",
          meta: "Content partnership · 2025",
          title: "Notion × Operator Notes",
          description:
            "A 12-episode series exploring how founders scale culture without slowing the product.",
          href: "/case-studies/notion-founders-journal",
          tone: "sage",
        },
        {
          client: "HubSpot",
          meta: "Keynote · 2025",
          title: "HubSpot — category keynote",
          description:
            "“Why every SaaS company is now a media company.” Main-stage delivery.",
          href: "/case-studies/hubspot-fintech-report",
          tone: "rust",
        },
        {
          client: "Ramp",
          meta: "Ambassador · 2024–25",
          title: "Ramp — Year of Founders",
          description:
            "12-month brand ambassadorship. Editorial, podcast, and event integration.",
          href: "/case-studies/ramp-summit-keynote",
          tone: "forest",
        },
      ],
    },
    "james-okafor": {
      based: "Lagos / London",
      languages: ["English"],
      representationStatus: "SIGNED",
      stageImage: "/images/case-studies/hubspot.jpg",
      heroProof:
        "High-energy stage presence. 120+ talks. The performance voice sales orgs bring in to move rooms.",
      trustedBy: brands(
        "Ramp",
        "Intercom",
        "Notion",
        "Retool",
        "Stripe",
        "Loom",
        "Figma",
        "Vercel",
        "Linear",
        "Cursor",
      ),
      quote:
        "Momentum is a brief you renew every week. Audiences follow people who keep shipping.",
      quoteAttribution: "— from a 2025 Web Summit stage",
      stats: [
        { label: "Combined reach", value: "2.1M" },
        { label: "Stage talks", value: "120+" },
        { label: "Podcast downloads", value: "890k" },
        { label: "Growth (90d)", value: "+28%", accent: "forest" },
      ],
      channels: [
        {
          icon: "linkedin",
          platform: "LinkedIn",
          handle: "@jamesokafor",
          followers: "890k",
          growth90d: "+11.2%",
          engagement: "4.1%",
        },
        {
          icon: "youtube",
          platform: "YouTube",
          handle: "Ship Cadence",
          followers: "240k",
          growth90d: "+18.4%",
          engagement: "5.8%",
        },
        {
          icon: "podcast",
          platform: "Podcast",
          handle: "Ship Cadence Live",
          followers: "890k dl",
          growth90d: "+9.6%",
          engagement: "n/a",
        },
        {
          icon: "x",
          platform: "X / Twitter",
          handle: "@jamesokafor",
          followers: "160k",
          growth90d: "+3.1%",
          engagement: "1.4%",
        },
      ],
      topicShares: [
        { label: "Performance", percent: 26 },
        { label: "Sales leadership", percent: 22 },
        { label: "Resilience", percent: 18 },
        { label: "Stage craft", percent: 14 },
        { label: "Team culture", percent: 12 },
        { label: "Career", percent: 8 },
      ],
      audience: {
        seniority: [
          { label: "VP / Director", percent: 34 },
          { label: "Founder / C-Suite", percent: 29 },
          { label: "Manager / IC", percent: 28 },
          { label: "Investor", percent: 9 },
        ],
        industry: [
          { label: "B2B / Enterprise", percent: 46 },
          { label: "SaaS / Tech", percent: 28 },
          { label: "Services", percent: 14 },
          { label: "Other", percent: 12 },
        ],
        geography: [
          { label: "UK", percent: 34 },
          { label: "US", percent: 31 },
          { label: "Nigeria", percent: 18 },
        ],
      },
      formats: [
        {
          category: "Speaking",
          title: "Keynote",
          description:
            "High-energy stage talks on performance, resilience, and sales credibility.",
          pricing: "From $45k",
        },
        {
          category: "Speaking",
          title: "Workshop",
          description:
            "Half-day intensives for revenue teams installing operating cadence.",
          pricing: "From $28k",
        },
        {
          category: "Content",
          title: "Podcast guest",
          description:
            "Flagship podcast takeovers with clip packages for social distribution.",
          pricing: "Custom scoped",
        },
        {
          category: "Brand",
          title: "Ambassador",
          description:
            "Selective annual seats for brands that need an operator voice on stage.",
          pricing: "Custom scoped",
        },
      ],
      recentWork: [
        {
          client: "SaaStr",
          meta: "Keynote · 2025",
          title: "SaaStr Annual — main stage",
          description:
            "Closing talk on performance systems for revenue orgs.",
          href: "/case-studies/hubspot-fintech-report",
          tone: "rust",
        },
        {
          client: "Ramp",
          meta: "Workshop · 2025",
          title: "Ramp revenue offsite",
          description:
            "Closed-door operating workshop for GTM leadership.",
          href: "/case-studies/ramp-summit-keynote",
          tone: "forest",
        },
        {
          client: "Notion",
          meta: "Podcast · 2024",
          title: "Founder's Journal guest arc",
          description:
            "Three-episode arc on building teams that ship under pressure.",
          href: "/case-studies/notion-founders-journal",
          tone: "sage",
        },
      ],
    },
    "sofia-martinez": {
      based: "Madrid",
      languages: ["English", "Spanish"],
      representationStatus: "SIGNED",
      stageImage: "/images/case-studies/stripe.jpg",
      heroProof:
        "Brand partnership strategist. 40+ campaigns. The operator who keeps creators editorial and brands clear.",
      trustedBy: brands(
        "Notion",
        "Figma",
        "Loom",
        "Linear",
        "Stripe",
        "Cursor",
        "Ramp",
        "Vercel",
        "Retool",
        "Intercom",
      ),
      quote:
        "Partnerships work when the creator stays editorial and the brand stays clear on the outcome.",
      quoteAttribution: "— from a 2025 brand partnership brief",
      stats: [
        { label: "Combined reach", value: "1.6M" },
        { label: "Newsletter subs", value: "95k" },
        { label: "Campaigns led", value: "40+" },
        { label: "Growth (90d)", value: "+19%", accent: "forest" },
      ],
      channels: [
        {
          icon: "linkedin",
          platform: "LinkedIn",
          handle: "@sofiamartinez",
          followers: "640k",
          growth90d: "+7.2%",
          engagement: "3.8%",
        },
        {
          icon: "newsletter",
          platform: "Newsletter",
          handle: "Partnership Signal",
          followers: "95k",
          growth90d: "+5.4%",
          engagement: "41% open",
        },
        {
          icon: "podcast",
          platform: "Podcast",
          handle: "Brand Room",
          followers: "420k dl",
          growth90d: "+12.0%",
          engagement: "n/a",
        },
        {
          icon: "x",
          platform: "X / Twitter",
          handle: "@sofiam",
          followers: "88k",
          growth90d: "+2.1%",
          engagement: "1.1%",
        },
      ],
      topicShares: [
        { label: "Brand partnerships", percent: 30 },
        { label: "Media strategy", percent: 22 },
        { label: "Creator commerce", percent: 18 },
        { label: "SaaS storytelling", percent: 14 },
        { label: "Audience trust", percent: 10 },
        { label: "Career", percent: 6 },
      ],
      audience: {
        seniority: [
          { label: "Brand / Partnerships", percent: 36 },
          { label: "VP / Director", percent: 28 },
          { label: "Founder / C-Suite", percent: 22 },
          { label: "Manager / IC", percent: 14 },
        ],
        industry: [
          { label: "Media / Marketing", percent: 39 },
          { label: "SaaS / Tech", percent: 33 },
          { label: "Consumer brands", percent: 16 },
          { label: "Other", percent: 12 },
        ],
        geography: [
          { label: "EU", percent: 44 },
          { label: "US", percent: 38 },
          { label: "LATAM", percent: 10 },
        ],
      },
      formats: [
        {
          category: "Content",
          title: "Newsletter series",
          description:
            "Sponsored editorial arcs with measurement built for partnership teams.",
          pricing: "From $35k",
        },
        {
          category: "Brand",
          title: "Ambassadorship",
          description:
            "12-month brand seats with clear editorial guardrails.",
          pricing: "Custom scoped",
        },
        {
          category: "Content",
          title: "Content series",
          description:
            "Multi-format campaigns across newsletter, LinkedIn, and podcast.",
          pricing: "Custom scoped",
        },
        {
          category: "Speaking",
          title: "Fireside",
          description:
            "On-stage partnership conversations for brand and media summits.",
          pricing: "From $30k",
        },
      ],
      recentWork: [
        {
          client: "Notion",
          meta: "Content · 2025",
          title: "Partnership playbook series",
          description:
            "Editorial series on how B2B brands brief creators without killing the voice.",
          href: "/case-studies/notion-founders-journal",
          tone: "sage",
        },
        {
          client: "Ramp",
          meta: "Ambassador · 2024–25",
          title: "Ramp creator partnerships",
          description:
            "Year-long brand program spanning newsletter and events.",
          href: "/case-studies/ramp-summit-keynote",
          tone: "forest",
        },
        {
          client: "SaaStr",
          meta: "Fireside · 2025",
          title: "SaaStr partner summit",
          description:
            "Moderated session on measuring creator partnerships beyond vanity metrics.",
          href: "/case-studies/hubspot-fintech-report",
          tone: "rust",
        },
      ],
    },
    "noah-bennett": {
      based: "Austin, TX",
      languages: ["English"],
      representationStatus: "SIGNED",
      stageImage: "/images/case-studies/ramp.jpg",
      heroProof:
        "Former COO. Systems over slogans. The operator brands brief when cadence has to survive reality.",
      trustedBy: brands(
        "Ramp",
        "Notion",
        "Retool",
        "Vercel",
        "Linear",
        "Intercom",
        "Figma",
        "Stripe",
        "Loom",
        "Cursor",
      ),
      quote:
        "Operators don't need more inspiration. They need a cadence that survives contact with reality.",
      quoteAttribution: "— from a 2025 operator roundtable",
      stats: [
        { label: "Combined reach", value: "980K" },
        { label: "Newsletter subs", value: "42k" },
        { label: "Podcast downloads", value: "610k" },
        { label: "Growth (90d)", value: "+31%", accent: "forest" },
      ],
      channels: [
        {
          icon: "linkedin",
          platform: "LinkedIn",
          handle: "@noahbennett",
          followers: "410k",
          growth90d: "+9.8%",
          engagement: "4.4%",
        },
        {
          icon: "newsletter",
          platform: "Newsletter",
          handle: "Operating Cadence",
          followers: "42k",
          growth90d: "+8.1%",
          engagement: "48% open",
        },
        {
          icon: "podcast",
          platform: "Podcast",
          handle: "The Cadence",
          followers: "610k dl",
          growth90d: "+15.2%",
          engagement: "n/a",
        },
        {
          icon: "youtube",
          platform: "YouTube",
          handle: "Operator Desk",
          followers: "96k",
          growth90d: "+19.0%",
          engagement: "5.2%",
        },
      ],
      topicShares: [
        { label: "Operating systems", percent: 27 },
        { label: "Hiring", percent: 21 },
        { label: "Decision quality", percent: 18 },
        { label: "Product ops", percent: 15 },
        { label: "Founder coaching", percent: 12 },
        { label: "Career", percent: 7 },
      ],
      audience: {
        seniority: [
          { label: "Founder / C-Suite", percent: 41 },
          { label: "COO / Ops", percent: 26 },
          { label: "VP / Director", percent: 22 },
          { label: "Manager / IC", percent: 11 },
        ],
        industry: [
          { label: "SaaS / Product", percent: 48 },
          { label: "Marketplace", percent: 18 },
          { label: "Fintech", percent: 16 },
          { label: "Other", percent: 18 },
        ],
        geography: [
          { label: "US", percent: 72 },
          { label: "UK", percent: 11 },
          { label: "Canada", percent: 6 },
        ],
      },
      formats: [
        {
          category: "Speaking",
          title: "Keynote",
          description:
            "Operator talks on systems, hiring, and decision quality under pressure.",
          pricing: "From $40k",
        },
        {
          category: "Content",
          title: "Podcast guest",
          description:
            "Deep-dive interviews with clip packages for LinkedIn distribution.",
          pricing: "Custom scoped",
        },
        {
          category: "Brand",
          title: "Ambassador",
          description:
            "Long-term operator voice for product and infrastructure brands.",
          pricing: "Custom scoped",
        },
        {
          category: "Speaking",
          title: "Executive roundtable",
          description:
            "Facilitated sessions for leadership teams installing cadence.",
          pricing: "From $25k",
        },
      ],
      recentWork: [
        {
          client: "Ramp",
          meta: "Ambassador · 2024–25",
          title: "Year of Operators",
          description:
            "Editorial and stage program for finance and ops leaders.",
          href: "/case-studies/ramp-summit-keynote",
          tone: "forest",
        },
        {
          client: "Notion",
          meta: "Content · 2025",
          title: "Ops systems series",
          description:
            "Multi-part series on decision hygiene inside growing teams.",
          href: "/case-studies/notion-founders-journal",
          tone: "sage",
        },
        {
          client: "SaaStr",
          meta: "Roundtable · 2025",
          title: "COO closed-door",
          description:
            "Facilitated operator session at SaaStr Annual.",
          href: "/case-studies/hubspot-fintech-report",
          tone: "rust",
        },
      ],
    },
    "lena-weiss": {
      based: "Berlin",
      languages: ["English", "German"],
      representationStatus: "SIGNED",
      stageImage: "/images/case-studies/vanta.jpg",
      heroProof:
        "280+ episodes hosted. The interviewer brands trust to make executives and operators sound human.",
      trustedBy: brands(
        "Notion",
        "Loom",
        "Ramp",
        "Figma",
        "Cursor",
        "Vercel",
        "Stripe",
        "Linear",
        "Retool",
        "Intercom",
      ),
      quote:
        "The best interview is invisible. The guest does the work — you just make the room safe enough.",
      quoteAttribution: "— from a 2025 media masters session",
      stats: [
        { label: "Combined reach", value: "3.2M" },
        { label: "Episodes hosted", value: "280+" },
        { label: "Podcast downloads", value: "1.4M" },
        { label: "Growth (90d)", value: "+24%", accent: "forest" },
      ],
      channels: [
        {
          icon: "linkedin",
          platform: "LinkedIn",
          handle: "@lenaweiss",
          followers: "720k",
          growth90d: "+6.4%",
          engagement: "3.5%",
        },
        {
          icon: "youtube",
          platform: "YouTube",
          handle: "The Room",
          followers: "380k",
          growth90d: "+16.8%",
          engagement: "7.0%",
        },
        {
          icon: "podcast",
          platform: "Podcast",
          handle: "The Room",
          followers: "1.4M dl",
          growth90d: "+11.3%",
          engagement: "n/a",
        },
        {
          icon: "newsletter",
          platform: "Newsletter",
          handle: "Signal Notes",
          followers: "110k",
          growth90d: "+4.9%",
          engagement: "39% open",
        },
      ],
      topicShares: [
        { label: "Media & culture", percent: 25 },
        { label: "AI & work", percent: 21 },
        { label: "Founder interviews", percent: 19 },
        { label: "Marketing", percent: 15 },
        { label: "Stage craft", percent: 12 },
        { label: "Career", percent: 8 },
      ],
      audience: {
        seniority: [
          { label: "Founder / C-Suite", percent: 33 },
          { label: "VP / Director", percent: 30 },
          { label: "Manager / IC", percent: 26 },
          { label: "Investor", percent: 11 },
        ],
        industry: [
          { label: "Media / AI", percent: 37 },
          { label: "SaaS / Tech", percent: 29 },
          { label: "Marketing", percent: 20 },
          { label: "Other", percent: 14 },
        ],
        geography: [
          { label: "EU", percent: 48 },
          { label: "US", percent: 36 },
          { label: "UK", percent: 9 },
        ],
      },
      formats: [
        {
          category: "Content",
          title: "Podcast host",
          description:
            "Flagship hosted series with brand integration and clip systems.",
          pricing: "Custom scoped",
        },
        {
          category: "Speaking",
          title: "Moderator",
          description:
            "On-stage moderation for conferences and brand summits.",
          pricing: "From $35k",
        },
        {
          category: "Content",
          title: "Newsletter",
          description:
            "Editorial newsletter partnerships with measured distribution.",
          pricing: "From $28k",
        },
        {
          category: "Content",
          title: "Content series",
          description:
            "Interview-led series across video, audio, and social.",
          pricing: "Custom scoped",
        },
      ],
      recentWork: [
        {
          client: "Notion",
          meta: "Podcast · 2025",
          title: "Founder's Journal host arc",
          description:
            "Hosted operator conversations with distribution across LinkedIn and YouTube.",
          href: "/case-studies/notion-founders-journal",
          tone: "sage",
        },
        {
          client: "SaaStr",
          meta: "Moderator · 2025",
          title: "SaaStr main-stage panels",
          description:
            "Three moderated panels on AI, media, and founder trust.",
          href: "/case-studies/hubspot-fintech-report",
          tone: "rust",
        },
        {
          client: "Ramp",
          meta: "Series · 2024",
          title: "Founder interview series",
          description:
            "Six-part interview series for finance operators.",
          href: "/case-studies/ramp-summit-keynote",
          tone: "forest",
        },
      ],
    },
    "daniel-park": {
      based: "London, UK",
      languages: ["English", "Korean"],
      representationStatus: "SIGNED",
      stageImage: "/images/case-studies/notion.jpg",
      heroProof:
        "Investor voice on AI and fintech. 5.4M combined reach. Usefulness at scale — then the audience shows up.",
      trustedBy: brands(
        "Stripe",
        "Notion",
        "Ramp",
        "Vercel",
        "Cursor",
        "Linear",
        "Figma",
        "Intercom",
        "Retool",
        "Loom",
      ),
      quote:
        "Attention is a byproduct of usefulness. Build usefulness at scale and the audience shows up.",
      quoteAttribution: "— from a 2025 Startup Grind keynote",
      stats: [
        { label: "Combined reach", value: "5.4M" },
        { label: "Newsletter subs", value: "210k" },
        { label: "Podcast downloads", value: "2.1M" },
        { label: "Growth (90d)", value: "+37%", accent: "forest" },
      ],
      featuredCaseStudyHref: "/case-studies/notion-founders-journal",
      channels: [
        {
          icon: "linkedin",
          platform: "LinkedIn",
          handle: "@danielpark",
          followers: "2.8M",
          growth90d: "+10.1%",
          engagement: "3.6%",
        },
        {
          icon: "youtube",
          platform: "YouTube",
          handle: "Signal / Build",
          followers: "540k",
          growth90d: "+24.0%",
          engagement: "6.4%",
        },
        {
          icon: "podcast",
          platform: "Podcast",
          handle: "Signal / Build",
          followers: "2.1M dl",
          growth90d: "+13.5%",
          engagement: "n/a",
        },
        {
          icon: "newsletter",
          platform: "Newsletter",
          handle: "Beyond Deep Weekly",
          followers: "210k",
          growth90d: "+7.4%",
          engagement: "42% open",
        },
        {
          icon: "x",
          platform: "X / Twitter",
          handle: "@danielpark",
          followers: "310k",
          growth90d: "-0.8%",
          engagement: "0.9%",
        },
      ],
      topicShares: [
        { label: "AI infrastructure", percent: 26 },
        { label: "Fintech", percent: 22 },
        { label: "Investing", percent: 18 },
        { label: "Product builds", percent: 15 },
        { label: "Future of work", percent: 12 },
        { label: "Career", percent: 7 },
      ],
      audience: {
        seniority: [
          { label: "Investor / Analyst", percent: 38 },
          { label: "VP / Director", percent: 27 },
          { label: "Manager / IC", percent: 24 },
          { label: "Founder", percent: 11 },
        ],
        industry: [
          { label: "AI / Fintech", percent: 44 },
          { label: "SaaS / Tech", percent: 26 },
          { label: "Financial services", percent: 16 },
          { label: "Other", percent: 14 },
        ],
        geography: [
          { label: "US", percent: 52 },
          { label: "UK", percent: 22 },
          { label: "EU", percent: 14 },
        ],
      },
      formats: [
        {
          category: "Speaking",
          title: "Keynote",
          description:
            "45–60 minute delivery on AI adoption, fintech infrastructure, and category narrative.",
          pricing: "From $80k",
        },
        {
          category: "Speaking",
          title: "Fireside",
          description:
            "Investor-operator conversations for summits and closed executive rooms.",
          pricing: "From $55k",
        },
        {
          category: "Content",
          title: "Podcast series",
          description:
            "Sponsored series with brand integration and weekly distribution.",
          pricing: "Custom scoped",
        },
        {
          category: "Brand",
          title: "Ambassadorship",
          description:
            "Selective annual seats — two commercial partners per year maximum.",
          pricing: "Custom scoped",
        },
      ],
      recentWork: [
        {
          client: "Notion",
          meta: "Content partnership · 2025",
          title: "Notion × Signal / Build",
          description:
            "A 12-episode series on how builders scale operating systems.",
          href: "/case-studies/notion-founders-journal",
          tone: "sage",
        },
        {
          client: "SaaStr",
          meta: "Keynote · 2025",
          title: "SaaStr Annual — closing keynote",
          description:
            "“Attention is a byproduct of usefulness.” 12k in the room.",
          href: "/case-studies/hubspot-fintech-report",
          tone: "rust",
        },
        {
          client: "Ramp",
          meta: "Ambassador · 2024–25",
          title: "Ramp — Year of Founders",
          description:
            "12-month brand ambassadorship across editorial, podcast, and events.",
          href: "/case-studies/ramp-summit-keynote",
          tone: "forest",
        },
      ],
    },
  };

export function getExpertProfileEnrichment(
  slug: string,
): ExpertProfileEnrichment {
  return EXPERT_PROFILE_ENRICHMENT[slug] ?? {};
}

export function expertInitials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

export function formatTopicLabel(value: string) {
  if (value.toLowerCase() === "ai") return "AI";
  return value;
}

export function firstName(name: string) {
  return name.split(/\s+/)[0] ?? name;
}

export function isPositiveGrowth(value: string) {
  return value.trim().startsWith("+");
}

export function channelPresenceUrl(channel: ExpertChannelPresence) {
  if (channel.url) return channel.url;

  const handle = channel.handle.replace(/^@/, "").split(/\s|\//)[0] ?? "";

  switch (channel.icon) {
    case "linkedin":
      return `https://www.linkedin.com/in/${handle || "company"}`;
    case "youtube":
      return `https://www.youtube.com/@${handle.replace(/\s+/g, "") || "channel"}`;
    case "podcast":
      return "https://open.spotify.com/";
    case "newsletter":
      return "https://substack.com/";
    case "x":
      return `https://x.com/${handle || "home"}`;
  }
}
