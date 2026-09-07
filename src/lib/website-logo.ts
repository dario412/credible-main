/**
 * Derive a logo URL from an organisation website when Airtable has no Logo url.
 * Only used when LOGO_DEV_TOKEN is set — generic favicon CDNs look like white
 * boxes on the dark Trusted-by strip after invert.
 */

export function domainFromWebsiteUrl(raw: string | null | undefined): string | null {
  const value = raw?.trim();
  if (!value) return null;
  try {
    const withProtocol = /^https?:\/\//i.test(value) ? value : `https://${value}`;
    const host = new URL(withProtocol).hostname.replace(/^www\./i, "").toLowerCase();
    if (!host || !host.includes(".")) return null;
    return host;
  } catch {
    return null;
  }
}

/** Favicon / icon CDNs — too small and opaque for the dark hero logo strip. */
export function isLowQualityLogoUrl(src: string | null | undefined): boolean {
  if (!src?.trim()) return true;
  return (
    /google\.com\/s2\/favicons/i.test(src) ||
    /gstatic\.com\/favicon/i.test(src) ||
    /icons\.duckduckgo\.com/i.test(src) ||
    /icon\.horse\/icon\//i.test(src) ||
    /unavatar\.io\//i.test(src)
  );
}

/**
 * Optional Logo.dev mark from a company website.
 * Returns undefined without LOGO_DEV_TOKEN so we skip the brand instead of
 * showing a broken white square.
 */
export function logoUrlFromWebsite(
  websiteUrl: string | null | undefined,
): string | undefined {
  const domain = domainFromWebsiteUrl(websiteUrl);
  if (!domain) return undefined;

  const token = process.env.LOGO_DEV_TOKEN?.trim();
  if (!token) return undefined;

  const params = new URLSearchParams({
    token,
    format: "png",
    size: "200",
    theme: "light",
  });
  return `https://img.logo.dev/${encodeURIComponent(domain)}?${params}`;
}
