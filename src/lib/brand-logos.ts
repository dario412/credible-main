/**
 * Resolve white wordmarks for Trusted-by strips on dark hero stages.
 * Prefer Airtable `Logo url` when present; then local brand assets; then
 * a logo derived from the organisation website URL.
 */

import { isLowQualityLogoUrl, logoUrlFromWebsite } from "@/lib/website-logo";

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
  turbotax: "/brand/clients/intuit-wordmark-white.svg",
  justworks: "/brand/clients/justworks-wordmark-white.svg",
  hcltech: "/brand/clients/hcltech-wordmark-white.svg",
  "general catalyst": "/brand/clients/general-catalyst-wordmark-white.svg",
  vanta: "/brand/clients/vanta-wordmark-white.svg",
  attio: "/brand/clients/attio-wordmark-white.svg",
  clerk: "/brand/clients/clerk-wordmark-white.svg",
  saastr: "/brand/clients/saastr-wordmark-white.svg",
  "wispr flow": "/brand/clients/wispr-flow-wordmark-white.svg",
  wisprflow: "/brand/clients/wispr-flow-wordmark-white.svg",
  "wispr flow ai": "/brand/clients/wispr-flow-wordmark-white.svg",
  zoom: "/brand/clients/zoom-wordmark-white.svg",
  "poly ai": "/brand/clients/polyai-wordmark-white.svg",
};

/** Legacy dev placeholder — dark mark, invisible on dark project cards. */
export const LEGACY_CASE_STUDY_LOGO = "/brand/notion-logo.png";

function isLegacyCaseStudyPlaceholder(logo?: string | null) {
  const value = logo?.trim();
  return !value || value === LEGACY_CASE_STUDY_LOGO;
}

function isLightLogoAsset(src: string) {
  return /-white\.(svg|png|webp)$/i.test(src) || src.includes("-wordmark-white");
}

/** Logo for project cards and heroes — CMS upload first, then brand fallbacks. */
export function resolveCaseStudyClientLogo(
  client: string,
  logo?: string | null,
  options?: { tone?: "dark" | "light" },
): string {
  const tone = options?.tone ?? "dark";
  const trimmed = logo?.trim();

  if (trimmed && !isLegacyCaseStudyPlaceholder(trimmed)) {
    return trimmed;
  }

  if (tone === "dark") {
    return (
      resolveBrandLogo(client) ?? "/brand/clients/notion-wordmark-white.svg"
    );
  }

  return "/brand/clients/notion-wordmark.png";
}

export function caseStudyLogoNeedsInvert(src: string) {
  if (isLightLogoAsset(src)) return false;
  if (src.startsWith("/api/media/")) return false;
  if (/^https?:\/\//i.test(src)) return true;
  return true;
}

export type TrustedBrand = {
  name: string;
  logo?: string;
};

function normalizeBrandKey(name: string): string {
  return name.trim().toLowerCase().replace(/\s+/g, " ");
}

function brandLookupKeys(name: string): string[] {
  const key = normalizeBrandKey(name);
  const compact = key.replace(/[^a-z0-9]+/g, "");
  const withoutAi = key.replace(/\s+ai$/, "");
  return [...new Set([key, compact, withoutAi, withoutAi.replace(/[^a-z0-9]+/g, "")])];
}

export function resolveBrandLogo(
  name: string,
  airtableLogoUrl?: string | null,
  websiteUrl?: string | null,
): string | undefined {
  const explicit = airtableLogoUrl?.trim();
  if (explicit && /^https?:\/\//i.test(explicit) && !isLowQualityLogoUrl(explicit)) {
    return explicit;
  }
  for (const key of brandLookupKeys(name)) {
    const hit = LOCAL_BRAND_LOGOS[key];
    if (hit) return hit;
  }
  const fromSite = logoUrlFromWebsite(websiteUrl);
  if (fromSite && !isLowQualityLogoUrl(fromSite)) return fromSite;
  return undefined;
}

export function withResolvedLogos(
  brands: Array<{ name: string; logo?: string | null; websiteUrl?: string | null }>,
): TrustedBrand[] {
  const seen = new Set<string>();
  const out: TrustedBrand[] = [];
  for (const brand of brands) {
    const name = brand.name?.trim();
    if (!name) continue;
    const key = brandLookupKeys(name)[1] ?? brandLookupKeys(name)[0]!;
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
      logo: resolveBrandLogo(name, brand.logo, brand.websiteUrl),
    });
  }
  return out;
}

/** Brands that have a usable logo asset — drives the tall Trusted-by hero layout. */
export function brandsWithLogos(brands: TrustedBrand[]): TrustedBrand[] {
  return brands.filter(
    (b) => Boolean(b.logo) && !isLowQualityLogoUrl(b.logo),
  );
}
