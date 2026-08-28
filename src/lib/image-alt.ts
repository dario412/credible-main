/** Max length for CMS alt text fields. */
export const IMAGE_ALT_MAX = 200;

/** Resolve alt text from an explicit value and ordered fallbacks. */
export function resolveImageAlt(
  explicit: string | null | undefined,
  ...fallbacks: (string | null | undefined)[]
): string {
  const trimmed = explicit?.trim();
  if (trimmed) return trimmed.slice(0, IMAGE_ALT_MAX);
  for (const fallback of fallbacks) {
    const next = fallback?.trim();
    if (next) return next.slice(0, IMAGE_ALT_MAX);
  }
  return "";
}

export function coverAltFor(title: string): string {
  const trimmed = title.trim();
  return trimmed ? `Cover image for ${trimmed}` : "Cover image";
}

export function logoAltFor(name: string): string {
  const trimmed = name.trim();
  if (!trimmed) return "Client logo";
  return trimmed.toLowerCase().includes("logo") ? trimmed : `${trimmed} logo`;
}

export function portraitAltFor(name: string, detail?: string | null): string {
  const trimmed = name.trim();
  if (!trimmed) return "Portrait";
  const extra = detail?.trim();
  return extra ? `${trimmed}, ${extra}` : trimmed;
}
