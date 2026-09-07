/**
 * Derive a logo URL from an organisation website when Airtable has no Logo url.
 * Quality order elsewhere: explicit Logo url → local white wordmark → this fallback.
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

/**
 * Best-effort logo for a company website.
 * Prefers Logo.dev when LOGO_DEV_TOKEN is set; otherwise Google Favicons (128px).
 */
export function logoUrlFromWebsite(
  websiteUrl: string | null | undefined,
): string | undefined {
  const domain = domainFromWebsiteUrl(websiteUrl);
  if (!domain) return undefined;

  const token = process.env.LOGO_DEV_TOKEN?.trim();
  if (token) {
    const params = new URLSearchParams({
      token,
      format: "png",
      size: "200",
      theme: "dark",
    });
    return `https://img.logo.dev/${encodeURIComponent(domain)}?${params}`;
  }

  return `https://www.google.com/s2/favicons?domain=${encodeURIComponent(domain)}&sz=128`;
}
