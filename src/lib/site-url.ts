/** Public site origin for SEO, Auth.js, and absolute links. */
export function getSiteUrl(): string {
  const candidates = [
    process.env.AUTH_URL,
    process.env.NEXT_PUBLIC_SITE_URL,
    process.env.VERCEL_PROJECT_PRODUCTION_URL
      ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
      : undefined,
    process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : undefined,
  ];

  for (const raw of candidates) {
    if (!raw?.trim()) continue;
    const trimmed = raw.trim().replace(/\/$/, "");
    if (/localhost|127\.0\.0\.1/i.test(trimmed)) continue;
    if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) {
      return trimmed;
    }
    return `https://${trimmed}`;
  }

  return "http://localhost:3000";
}

/** Auth.js reads AUTH_URL at runtime; override bad localhost values on Vercel. */
export function ensureAuthUrl() {
  if (!process.env.VERCEL && process.env.NODE_ENV !== "production") return;

  const resolved = getSiteUrl();
  if (/localhost|127\.0\.0\.1/i.test(process.env.AUTH_URL ?? "")) {
    process.env.AUTH_URL = resolved;
  }
}
