/**
 * Resolve white wordmarks for Trusted-by strips on dark hero stages.
 * Prefer Airtable `Logo url` when present; fall back to local brand assets.
 */

const LOCAL_BRAND_LOGOS: Record<string, string> = {
  notion: "/brand/clients/notion-wordmark-white.svg",
  stripe: "/brand/clients/stripe-wordmark-white.svg",
  linear: "/brand/clients/linear-wordmark-white.svg",
  figma: "/brand/clients/figma-wordmark-white.svg",
  vercel: "/brand/clients/vercel-wordmark-white.svg",
  intercom: "/brand/clients/intercom-wordmark-white.svg",
  ramp: "/brand/clients/ramp-wordmark-white.svg",
  retool: "/brand/clients/retool-wordmark-white.svg",
  loom: "/brand/clients/loom-wordmark-white.svg",
  cursor: "/brand/clients/cursor-wordmark-white.svg",
  linkedin: "/brand/clients/linkedin-wordmark-white.svg",
  airtable: "/brand/clients/airtable-wordmark-white.svg",
  webflow: "/brand/clients/webflow-wordmark-white.svg",
  zapier: "/brand/clients/zapier-wordmark-white.svg",
  hubspot: "/brand/clients/hubspot-wordmark-white.svg",
  aws: "/brand/clients/aws-wordmark-white.svg",
  typeform: "/brand/clients/typeform-wordmark-white.svg",
  perplexity: "/brand/clients/perplexity-wordmark-white.svg",
  profound: "/brand/clients/profound-wordmark-white.svg",
  polyai: "/brand/clients/polyai-wordmark-white.svg",
  intuit: "/brand/clients/intuit-wordmark-white.svg",
  justworks: "/brand/clients/justworks-wordmark-white.svg",
  hcltech: "/brand/clients/hcltech-wordmark-white.svg",
  "general catalyst": "/brand/clients/general-catalyst-wordmark-white.svg",
  vanta: "/brand/clients/vanta-wordmark-white.svg",
  attio: "/brand/clients/attio-wordmark-white.svg",
  clerk: "/brand/clients/clerk-wordmark-white.svg",
  saastr: "/brand/clients/saastr-wordmark-white.svg",
  "wispr flow": "/brand/clients/wispr-flow-wordmark-white.svg",
  wisprflow: "/brand/clients/wispr-flow-wordmark-white.svg",
};

export type TrustedBrand = {
  name: string;
  logo?: string;
};

function normalizeBrandKey(name: string): string {
  return name.trim().toLowerCase().replace(/\s+/g, " ");
}

export function resolveBrandLogo(
  name: string,
  airtableLogoUrl?: string | null,
): string | undefined {
  if (airtableLogoUrl && /^https?:\/\//i.test(airtableLogoUrl.trim())) {
    return airtableLogoUrl.trim();
  }
  const key = normalizeBrandKey(name);
  return LOCAL_BRAND_LOGOS[key];
}

export function withResolvedLogos(
  brands: Array<{ name: string; logo?: string | null }>,
): TrustedBrand[] {
  const seen = new Set<string>();
  const out: TrustedBrand[] = [];
  for (const brand of brands) {
    const name = brand.name?.trim();
    if (!name) continue;
    const key = normalizeBrandKey(name);
    if (seen.has(key)) continue;
    // Skip agency labels that aren't client logos
    if (
      key === "peptalk" ||
      key === "credible content creator" ||
      key === "credible"
    ) {
      continue;
    }
    seen.add(key);
    out.push({
      name,
      logo: resolveBrandLogo(name, brand.logo),
    });
  }
  return out;
}

/** Brands that have a logo asset — drives the tall Trusted-by hero layout. */
export function brandsWithLogos(brands: TrustedBrand[]): TrustedBrand[] {
  return brands.filter((b) => Boolean(b.logo));
}
