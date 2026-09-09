export type EmbedProvider = "linkedin" | "youtube";

export type ParsedEmbed = {
  provider: EmbedProvider;
  /** Safe iframe src (allowlisted host only). */
  embedSrc: string;
  /** Original post/video URL for fallback links. */
  canonicalUrl: string;
};

function isLinkedInHost(host: string): boolean {
  const h = host.toLowerCase();
  return h === "linkedin.com" || h === "www.linkedin.com" || h.endsWith(".linkedin.com");
}

function isYouTubeHost(host: string): boolean {
  const h = host.toLowerCase();
  return (
    h === "youtube.com" ||
    h === "www.youtube.com" ||
    h === "m.youtube.com" ||
    h === "youtu.be" ||
    h === "www.youtu.be"
  );
}

/** Extract LinkedIn URN from a post/feed/embed URL. */
function linkedInUrnFromUrl(url: URL): string | null {
  const path = url.pathname;

  const feedUrn = path.match(
    /\/(?:embed\/)?feed\/update\/(urn:li:(?:share|activity|ugcPost):\d+)/i,
  );
  if (feedUrn?.[1]) return feedUrn[1];

  // /posts/slug-share-123456-_Xx/ or ...-activity-123456-Xx
  const labeled = path.match(
    /\/posts\/[^/]*?-(share|activity|ugcPost)-(\d{10,})-[A-Za-z0-9_-]+\/?/i,
  );
  if (labeled?.[1] && labeled[2]) {
    const kind = labeled[1].toLowerCase() === "ugcpost" ? "ugcPost" : labeled[1].toLowerCase();
    return `urn:li:${kind}:${labeled[2]}`;
  }

  // Generic /posts/...-{15+digit-id}-{suffix}
  const postsId = path.match(/\/posts\/[^/]*?-(\d{15,})-[A-Za-z0-9]{2,}\/?/i);
  if (postsId?.[1]) return `urn:li:activity:${postsId[1]}`;

  return null;
}

function youTubeIdFromUrl(url: URL): string | null {
  const host = url.hostname.toLowerCase();

  if (host === "youtu.be" || host === "www.youtu.be") {
    const id = url.pathname.split("/").filter(Boolean)[0];
    return id && /^[\w-]{6,}$/.test(id) ? id : null;
  }

  if (url.pathname.startsWith("/embed/")) {
    const id = url.pathname.split("/")[2];
    return id && /^[\w-]{6,}$/.test(id) ? id : null;
  }

  if (url.pathname.startsWith("/shorts/")) {
    const id = url.pathname.split("/")[2];
    return id && /^[\w-]{6,}$/.test(id) ? id : null;
  }

  const v = url.searchParams.get("v");
  if (v && /^[\w-]{6,}$/.test(v)) return v;

  return null;
}

/**
 * Parse a LinkedIn post or YouTube URL into a safe embed target.
 * Returns null when the URL is missing, malformed, or not allowlisted.
 */
export function parseEmbedUrl(input: string): ParsedEmbed | null {
  const trimmed = input.trim();
  if (!trimmed) return null;

  let url: URL;
  try {
    url = new URL(trimmed);
  } catch {
    return null;
  }

  if (url.protocol !== "http:" && url.protocol !== "https:") return null;

  const host = url.hostname.toLowerCase();

  if (isLinkedInHost(host)) {
    const urn = linkedInUrnFromUrl(url);
    if (!urn) return null;
    // Only digits after the type — reject anything else that snuck into the path.
    if (!/^urn:li:(?:share|activity|ugcPost):\d+$/i.test(urn)) return null;
    return {
      provider: "linkedin",
      embedSrc: `https://www.linkedin.com/embed/feed/update/${urn}`,
      canonicalUrl: trimmed,
    };
  }

  if (isYouTubeHost(host)) {
    const id = youTubeIdFromUrl(url);
    if (!id) return null;
    return {
      provider: "youtube",
      embedSrc: `https://www.youtube.com/embed/${id}`,
      canonicalUrl: trimmed,
    };
  }

  return null;
}

/** True when iframe src is an allowlisted embed URL we generated. */
export function isAllowedEmbedSrc(src: string): boolean {
  try {
    const url = new URL(src);
    if (url.protocol !== "https:") return false;
    const host = url.hostname.toLowerCase();
    if (host === "www.linkedin.com") {
      return /^\/embed\/feed\/update\/urn:li:(?:share|activity|ugcPost):\d+$/i.test(
        url.pathname,
      );
    }
    if (host === "www.youtube.com") {
      return /^\/embed\/[\w-]{6,}$/.test(url.pathname);
    }
    return false;
  } catch {
    return false;
  }
}
