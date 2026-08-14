/** Optimal logo asset: white wordmark SVG/PNG, ~28px tall, max ~152px wide. */
export const TRUSTED_BY_LOGO_HINT =
  "White wordmark on transparent background. Aim for ~28px tall and under ~152px wide so it matches the charcoal grid.";

export type TrustedByTestimonial = {
  quote: string;
  name: string;
  title: string;
  imageSrc: string;
};

export type TrustedByClient = {
  id?: string;
  name: string;
  logoSrc: string;
  caseStudySlug: string;
  testimonial: TrustedByTestimonial | null;
  sortOrder?: number;
  active?: boolean;
};

export function emptyTrustedByClient(): TrustedByClient {
  return {
    name: "",
    logoSrc: "",
    caseStudySlug: "",
    testimonial: null,
  };
}

export function emptyTrustedByTestimonial(): TrustedByTestimonial {
  return {
    quote: "",
    name: "",
    title: "",
    imageSrc: "/images/creator-placeholder.png",
  };
}

export function hasTrustedByStory(client: TrustedByClient) {
  return Boolean(client.testimonial?.quote?.trim());
}

export function visiblePortrait(
  src?: string | null,
  fallback = "/images/experts/amara-chen.jpg",
) {
  const value = src?.trim() ?? "";
  if (!value || value.includes("creator-placeholder")) return fallback;
  return value;
}

export const DEFAULT_TRUSTED_CLIENTS: TrustedByClient[] = [
  {
    name: "LinkedIn",
    logoSrc: "/brand/clients/linkedin-wordmark-white.svg",
    caseStudySlug: "",
    testimonial: null,
  },
  {
    name: "Airtable",
    logoSrc: "/brand/clients/airtable-wordmark-white.svg",
    caseStudySlug: "stage-to-boardroom",
    testimonial: {
      quote:
        "Credible turned a single keynote into a year-long advisory partnership — exactly the kind of credibility our buyers trust.",
      name: "Maya Chen",
      title: "Head of Brand Partnerships, Airtable",
      imageSrc: "/images/experts/amara-chen.jpg",
    },
  },
  {
    name: "Wispr Flow",
    logoSrc: "/brand/clients/wispr-flow-wordmark-white.svg",
    caseStudySlug: "",
    testimonial: null,
  },
  {
    name: "Webflow",
    logoSrc: "/brand/clients/webflow-wordmark-white.svg",
    caseStudySlug: "creator-led-launch",
    testimonial: {
      quote:
        "They assembled operators and trusted voices into one coherent launch narrative — stage, media, and everything in between.",
      name: "Jordan Hale",
      title: "Director of Marketing, Webflow",
      imageSrc: "/images/experts/sofia-martinez.jpg",
    },
  },
  {
    name: "Perplexity",
    logoSrc: "/brand/clients/perplexity-wordmark-white.svg",
    caseStudySlug: "",
    testimonial: null,
  },
  {
    name: "Typeform",
    logoSrc: "/brand/clients/typeform-wordmark-white.svg",
    caseStudySlug: "",
    testimonial: null,
  },
  {
    name: "Zapier",
    logoSrc: "/brand/clients/zapier-wordmark-white.svg",
    caseStudySlug: "",
    testimonial: null,
  },
  {
    name: "HubSpot",
    logoSrc: "/brand/clients/hubspot-wordmark-white.svg",
    caseStudySlug: "stage-to-boardroom",
    testimonial: {
      quote:
        "The creators we booked felt like peers to our audience — not sponsors. That authenticity moved the deal cycle.",
      name: "Sam Okonkwo",
      title: "VP Marketing, HubSpot",
      imageSrc: "/images/experts/james-okafor.jpg",
    },
  },
  {
    name: "Profound",
    logoSrc: "/brand/clients/profound-wordmark-white.svg",
    caseStudySlug: "",
    testimonial: null,
  },
  {
    name: "AWS",
    logoSrc: "/brand/clients/aws-wordmark-white.svg",
    caseStudySlug: "",
    testimonial: null,
  },
  {
    name: "PolyAI",
    logoSrc: "/brand/clients/polyai-wordmark-white.svg",
    caseStudySlug: "",
    testimonial: null,
  },
  {
    name: "Intuit",
    logoSrc: "/brand/clients/intuit-wordmark-white.svg",
    caseStudySlug: "",
    testimonial: null,
  },
  {
    name: "HCLTech",
    logoSrc: "/brand/clients/hcltech-wordmark-white.svg",
    caseStudySlug: "",
    testimonial: null,
  },
  {
    name: "General Catalyst",
    logoSrc: "/brand/clients/general-catalyst-wordmark-white.svg",
    caseStudySlug: "",
    testimonial: null,
  },
  {
    name: "Justworks",
    logoSrc: "/brand/clients/justworks-wordmark-white.svg",
    caseStudySlug: "",
    testimonial: null,
  },
];

type TrustedClientRow = {
  id: string;
  name: string;
  logoSrc: string;
  caseStudySlug: string;
  testimonialQuote: string | null;
  testimonialName: string | null;
  testimonialTitle: string | null;
  testimonialImage: string | null;
  sortOrder: number;
  active: boolean;
};

export function trustedClientToCard(row: TrustedClientRow): TrustedByClient {
  const quote = row.testimonialQuote?.trim() ?? "";
  const name = row.testimonialName?.trim() ?? "";
  return {
    id: row.id,
    name: row.name,
    logoSrc: row.logoSrc,
    caseStudySlug: row.caseStudySlug,
    sortOrder: row.sortOrder,
    active: row.active,
    testimonial:
      quote || name
        ? {
            quote,
            name,
            title: row.testimonialTitle ?? "",
            imageSrc: visiblePortrait(row.testimonialImage),
          }
        : null,
  };
}

export function trustedClientToRow(client: TrustedByClient, sortOrder: number) {
  return {
    name: client.name.trim(),
    logoSrc: client.logoSrc.trim(),
    caseStudySlug: client.caseStudySlug.trim(),
    testimonialQuote: client.testimonial?.quote?.trim() || null,
    testimonialName: client.testimonial?.name?.trim() || null,
    testimonialTitle: client.testimonial?.title?.trim() || null,
    testimonialImage: client.testimonial?.imageSrc?.trim() || null,
    sortOrder,
    active: client.active ?? true,
  };
}
