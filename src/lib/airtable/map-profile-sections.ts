import type {
  ExpertAudience,
  ExpertAudienceSlice,
  ExpertChannelPresence,
  ExpertFormatChannel,
  ExpertFormatOffering,
  ExpertTopicShare,
} from "@/lib/expert-profiles";
import {
  growthDisplayFromFields,
  parseChannelFollowerHistory,
} from "@/lib/channel-follower-history";
import { meetsMinimumChannelFollowers } from "@/lib/channel-sparkline";
import type { AirtableRecord } from "./client";

function field(fields: Record<string, unknown>, ...aliases: string[]): unknown {
  const byNorm = new Map(
    Object.entries(fields).map(([k, v]) => [
      k.replace(/\uFEFF/g, "").trim().toLowerCase(),
      v,
    ]),
  );
  for (const alias of aliases) {
    const hit = byNorm.get(alias.replace(/\uFEFF/g, "").trim().toLowerCase());
    if (hit === undefined || hit === null || hit === "") continue;
    if (Array.isArray(hit) && hit.length === 0) continue;
    return hit;
  }
  return undefined;
}

function asBoolean(value: unknown): boolean {
  if (value === true || value === 1 || value === "1") return true;
  if (typeof value === "string" && /^(yes|true|checked)$/i.test(value.trim())) {
    return true;
  }
  return false;
}

function asString(value: unknown): string | null {
  if (typeof value === "string" && value.trim()) return value.trim();
  if (typeof value === "number" && Number.isFinite(value)) return String(value);
  if (Array.isArray(value)) {
    for (const item of value) {
      const s = asString(item);
      if (s) return s;
    }
  }
  if (value && typeof value === "object" && "value" in value) {
    return asString((value as { value: unknown }).value);
  }
  return null;
}

function asNumber(value: unknown): number | null {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string" && value.trim()) {
    const raw = value.trim().replace(/,/g, "");
    const compact = raw.match(/^([\d.]+)\s*([kmb])$/i);
    if (compact) {
      const n = Number(compact[1]);
      if (!Number.isFinite(n)) return null;
      const unit = compact[2]!.toLowerCase();
      return n * (unit === "k" ? 1_000 : unit === "m" ? 1_000_000 : 1_000_000_000);
    }
    const n = Number(raw);
    return Number.isFinite(n) ? n : null;
  }
  if (Array.isArray(value)) {
    for (const item of value) {
      const n = asNumber(item);
      if (n != null) return n;
    }
  }
  if (value && typeof value === "object" && "value" in value) {
    return asNumber((value as { value: unknown }).value);
  }
  return null;
}

function firstUrl(value: unknown): string | null {
  if (Array.isArray(value)) {
    for (const item of value) {
      const url = firstUrl(item);
      if (url) return url;
    }
    return null;
  }
  const s = asString(value);
  if (!s) return null;
  if (/^https?:\/\//i.test(s)) return s;
  if (/^(www\.)?[a-z0-9.-]+\.[a-z]{2,}\b/i.test(s)) return `https://${s}`;
  return null;
}

function followerDisplay(value: unknown): string | null {
  const formatted = formatFollowers(asNumber(value));
  if (formatted) return formatted;
  const s = asString(value);
  if (s && /\d/.test(s) && !/^rec[a-z0-9]+$/i.test(s)) return s;
  return null;
}

function formatFollowers(count: number | null): string | null {
  if (count == null || count <= 0) return null;
  if (count >= 1_000_000) {
    const m = count / 1_000_000;
    return `${m >= 10 ? Math.round(m) : m.toFixed(1).replace(/\.0$/, "")}M`;
  }
  if (count >= 1_000) {
    const k = count / 1_000;
    return `${k >= 100 ? Math.round(k) : k.toFixed(k >= 10 ? 0 : 1).replace(/\.0$/, "")}k`;
  }
  return String(count);
}

function urlMatchesPlatform(url: string, platform: string): boolean {
  try {
    const host = new URL(url).hostname.replace(/^www\./, "").toLowerCase();
    switch (platform) {
      case "LinkedIn":
        return host === "linkedin.com" || host.endsWith(".linkedin.com");
      case "YouTube":
        return (
          host === "youtube.com" ||
          host.endsWith(".youtube.com") ||
          host === "youtu.be"
        );
      case "X / Twitter":
        return host === "x.com" || host === "twitter.com";
      case "Instagram":
        return host === "instagram.com" || host.endsWith(".instagram.com");
      case "Facebook":
        return (
          host === "facebook.com" ||
          host.endsWith(".facebook.com") ||
          host === "fb.com"
        );
      case "TikTok":
        return host === "tiktok.com" || host.endsWith(".tiktok.com");
      default:
        return true;
    }
  } catch {
    return false;
  }
}

function handleFromUrl(url: string, platform: string): string {
  try {
    const u = new URL(url);
    const host = u.hostname.replace(/^www\./, "");
    const parts = u.pathname.split("/").filter(Boolean);
    const last = decodeURIComponent(parts[parts.length - 1] ?? "").replace(
      /\/+$/,
      "",
    );
    if (platform === "Newsletter") {
      if (last && last !== "subscribe") {
        return last.startsWith("@") ? last : last.replace(/[-_]/g, " ");
      }
      return host;
    }
    if (!last) return host || platform;
    if (last.startsWith("@")) return last;
    if (platform === "LinkedIn" && (parts[0] === "in" || parts[0] === "company")) {
      return `@${last}`;
    }
    if (platform === "Facebook" && parts[0] === "profile.php") {
      return host;
    }
    if (
      ["X / Twitter", "Instagram", "TikTok", "Facebook", "YouTube"].includes(
        platform,
      )
    ) {
      return last.startsWith("@") ? last : `@${last}`;
    }
    return last.replace(/[-_]/g, " ");
  } catch {
    return platform;
  }
}

function splitLines(value: unknown): string[] {
  const raw = asString(value);
  if (!raw) return [];
  return raw
    .split(/[\n\r]+|•|\u2022|,|;/)
    .map((part) => part.replace(/\s+/g, " ").trim())
    .filter(Boolean);
}

/** Multi-select / linked-record labels without comma-splitting choice names. */
function selectLabels(value: unknown): string[] {
  if (Array.isArray(value)) {
    const out: string[] = [];
    const seen = new Set<string>();
    for (const item of value) {
      let label = "";
      if (typeof item === "string") label = item.replace(/\s+/g, " ").trim();
      else if (item && typeof item === "object" && "name" in item) {
        const name = (item as { name?: unknown }).name;
        if (typeof name === "string") label = name.replace(/\s+/g, " ").trim();
      }
      if (!label) continue;
      const key = label.toLowerCase();
      if (seen.has(key)) continue;
      seen.add(key);
      out.push(label);
    }
    return out;
  }
  return splitLines(value);
}

function recordIds(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value.filter(
    (id): id is string => typeof id === "string" && id.startsWith("rec"),
  );
}

function toAudienceSlices(labels: string[]): ExpertAudienceSlice[] {
  if (labels.length === 0) return [];
  const weight = Math.floor(100 / labels.length);
  return labels.map((label, i) => ({
    label,
    percent:
      i === labels.length - 1 ? 100 - weight * (labels.length - 1) : weight,
  }));
}

function splitQuote(raw: string | null): {
  quote: string | null;
  attribution: string | null;
} {
  if (!raw) return { quote: null, attribution: null };
  const fromMatch = raw.match(/^(.*?)\s+(from\s+.+)$/i);
  if (fromMatch) {
    return {
      quote: fromMatch[1]!.trim().replace(/^["“]|["”]$/g, ""),
      attribution: fromMatch[2]!.trim(),
    };
  }
  return { quote: raw.replace(/^["“]|["”]$/g, ""), attribution: null };
}

export type AirtableProfileSections = {
  quote: string | null;
  quoteAttribution: string | null;
  channels: ExpertChannelPresence[];
  topicShares: ExpertTopicShare[];
  audience: ExpertAudience | null;
  formats: ExpertFormatOffering[];
  linkedinTopVoice: boolean;
};

function buildChannels(fields: Record<string, unknown>): ExpertChannelPresence[] {
  const defs: Array<{
    icon: ExpertChannelPresence["icon"];
    platform: string;
    platformKey: string;
    urlAliases: string[];
    followerAliases: string[];
  }> = [
    {
      icon: "linkedin",
      platform: "LinkedIn",
      platformKey: "LinkedIn",
      urlAliases: ["Channel | LinkedIn | URL", "LinkedIn"],
      followerAliases: [
        "Channel | LinkedIn | Followers",
        "Channel | LinkedIn | Follower count",
      ],
    },
    {
      icon: "youtube",
      platform: "YouTube",
      platformKey: "YouTube",
      urlAliases: ["Channel | YouTube | URL", "YouTube"],
      followerAliases: [
        "Channel | YouTube | Followers",
        "Channel | YouTube | Follower count",
      ],
    },
    {
      icon: "x",
      platform: "X / Twitter",
      platformKey: "x.com",
      urlAliases: ["Channel | x.com | URL", "X", "Twitter"],
      followerAliases: [
        "Channel | x.com | Followers",
        "Channel | X | Followers",
      ],
    },
    {
      icon: "newsletter",
      platform: "Newsletter",
      platformKey: "Newsletter",
      urlAliases: ["Channel | Newsletter | URL"],
      followerAliases: ["Channel | Newsletter | Followers"],
    },
    {
      icon: "instagram",
      platform: "Instagram",
      platformKey: "Instagram",
      urlAliases: ["Channel | Instagram | URL", "Instagram"],
      followerAliases: ["Channel | Instagram | Followers"],
    },
    {
      icon: "facebook",
      platform: "Facebook",
      platformKey: "Facebook",
      urlAliases: ["Channel | Facebook | URL", "Facebook"],
      followerAliases: ["Channel | Facebook | Followers"],
    },
  ];

  const channels: ExpertChannelPresence[] = [];
  for (const def of defs) {
    const rawUrl = firstUrl(field(fields, ...def.urlAliases));
    const url =
      rawUrl && urlMatchesPlatform(rawUrl, def.platform) ? rawUrl : null;
    const followers = followerDisplay(field(fields, ...def.followerAliases));
    if (!followers || !meetsMinimumChannelFollowers(followers)) continue;

    const growthRaw = asString(
      field(
        fields,
        `Channel | ${def.platformKey} | Growth (90d)`,
        `Channel | ${def.platformKey} | Growth 90d`,
        `Channel | ${def.platformKey} | 90d Growth`,
        `Channel | ${def.platformKey} | 90d growth`,
      ),
    );
    const sparkline = parseChannelFollowerHistory(
      field(
        fields,
        `Channel | ${def.platformKey} | Follower history`,
        `Channel | ${def.platformKey} | Followers history`,
        `Channel | ${def.platformKey} | Sparkline`,
      ),
    );

    channels.push({
      icon: def.icon,
      platform: def.platform,
      handle: url ? handleFromUrl(url, def.platform) : def.platform,
      followers,
      growth90d: growthDisplayFromFields(growthRaw, sparkline ?? undefined),
      engagement: "—",
      url: url ?? undefined,
      sparkline: sparkline ?? undefined,
    });
  }
  return channels;
}

export type MapProfileSectionsOptions = {
  /** Credible | Topics id → Topic label for Talks about links. */
  topicNamesById?: Map<string, string>;
};

function buildTopicShares(
  fields: Record<string, unknown>,
  topicNamesById: Map<string, string>,
): ExpertTopicShare[] {
  // fldA1MRZ9JVvauTHC — Creator | Profile | Talks about (linked Credible | Topics)
  const linkedIds = recordIds(
    field(
      fields,
      "Creator | Profile | Talks about",
      "Creator | Profile | Topics",
      "Talks about",
    ),
  );
  const fromLinks = linkedIds
    .map((id) => topicNamesById.get(id))
    .filter((name): name is string => Boolean(name?.trim()))
    .slice(0, 8);

  const themes = (
    fromLinks.length > 0
      ? fromLinks
      : splitLines(
          field(
            fields,
            "Creator | Profile | Key themes",
            "Key themes",
            "Topics",
          ),
        )
  ).slice(0, 8);
  if (themes.length === 0) return [];
  const weights = [32, 22, 16, 12, 10, 8, 6, 4].slice(0, themes.length);
  const sum = weights.reduce((a, b) => a + b, 0);
  return themes.map((label, i) => ({
    label,
    percent: Math.round(((weights[i] ?? 8) / sum) * 100),
  }));
}

function buildAudience(fields: Record<string, unknown>): ExpertAudience | null {
  // fldZyoLHWFebulqK3 — Creator | Profile | Audience (multipleSelects)
  const seniority = toAudienceSlices(
    selectLabels(
      field(fields, "Creator | Profile | Audience", "Audience"),
    ).slice(0, 8),
  );
  // fldjZPa1A5wwauttb — Creator | Website | Best for (multipleSelects)
  const industry = toAudienceSlices(
    selectLabels(
      field(fields, "Creator | Website | Best for", "Best for"),
    ).slice(0, 8),
  );
  if (seniority.length === 0 && industry.length === 0) return null;
  return { seniority, industry, geography: [] };
}

function ratePositive(fields: Record<string, unknown>, ...aliases: string[]) {
  const n = asNumber(field(fields, ...aliases));
  return n != null && n > 0;
}

/**
 * Brand partnership channel rows on profile Formats panels.
 * A platform appears when any matching Creator | Rate | … Gross/Internal
 * field is > 0:
 * - LinkedIn — LinkedIn Video Post, LinkedIn Image Post
 * - X — x.com post
 * - Instagram — Instagram Static Post, Reel, Story Set
 * - TikTok — TikTok video
 * - Newsletter — Owned newsletter dedicated / mention
 * - YouTube — YouTube video / short
 */
function buildBrandPartnershipChannels(
  fields: Record<string, unknown>,
): ExpertFormatChannel[] {
  const rows: ExpertFormatChannel[] = [];

  const linkedin: string[] = [];
  if (ratePositive(fields, "Creator | Rate | LinkedIn Video Post | Gross", "Creator | Rate | LinkedIn Video Post | Internal")) {
    linkedin.push("Video Post");
  }
  if (ratePositive(fields, "Creator | Rate | LinkedIn Image Post | Gross", "Creator | Rate | LinkedIn Image Post | Internal")) {
    linkedin.push("Image Post");
  }
  if (linkedin.length) rows.push({ channel: "LinkedIn", formats: linkedin });

  const xFormats: string[] = [];
  if (ratePositive(fields, "Creator | Rate | x.com post | Gross", "Creator | Rate | x.com post | Internal")) {
    xFormats.push("Post");
  }
  if (xFormats.length) rows.push({ channel: "X", formats: xFormats });

  const ig: string[] = [];
  if (ratePositive(fields, "Creator | Rate | Instagram Static Post | Gross", "Creator | Rate | Instagram Static Post | Internal")) {
    ig.push("Static Post");
  }
  if (ratePositive(fields, "Creator | Rate | Instagram Reel | Gross", "Creator | Rate | Instagram Reel | Internal")) {
    ig.push("Reel");
  }
  if (ratePositive(fields, "Creator | Rate | Instagram Story Set | Gross", "Creator | Rate | Instagram Story Set | Internal")) {
    ig.push("Story");
  }
  if (ig.length) rows.push({ channel: "Instagram", formats: ig });

  const tiktok: string[] = [];
  if (ratePositive(fields, "Creator | Rate | TikTok video | Gross", "Creator | Rate | TikTok video | Internal")) {
    tiktok.push("Video");
  }
  if (tiktok.length) rows.push({ channel: "TikTok", formats: tiktok });

  const newsletter: string[] = [];
  if (ratePositive(fields, "Creator | Rate | Owned newsletter dedicated | Gross", "Creator | Rate | Owned newsletter dedicated | Internal")) {
    newsletter.push("Dedicated Send");
  }
  if (ratePositive(fields, "Creator | Rate | Owned newsletter mention | Gross", "Creator | Rate | Owned newsletter mention | Internal")) {
    newsletter.push("Brand Feature");
  }
  if (newsletter.length) rows.push({ channel: "Newsletter", formats: newsletter });

  const youtube: string[] = [];
  if (ratePositive(fields, "Creator | Rate | YouTube video | Gross", "Creator | Rate | YouTube video | Internal")) {
    youtube.push("Video");
  }
  if (ratePositive(fields, "Creator | Rate | YouTube short | Gross", "Creator | Rate | YouTube short | Internal")) {
    youtube.push("Short");
  }
  if (youtube.length) rows.push({ channel: "YouTube", formats: youtube });

  return rows;
}

function buildFormats(fields: Record<string, unknown>): ExpertFormatOffering[] {
  const formats: ExpertFormatOffering[] = [];
  const brandCopy = asString(
    field(
      fields,
      "Creator | Website | Brand partnerships",
      "Brand partnerships copy",
    ),
  );
  const brandChannels = buildBrandPartnershipChannels(fields);
  if (brandCopy || brandChannels.length > 0) {
    formats.push({
      kind: "brandPartnerships",
      category: "01",
      title: "Brand partnerships",
      description: brandCopy ?? "",
      channels: brandChannels.length ? brandChannels : undefined,
      formats: brandChannels.length ? undefined : ["Sponsored content"],
    });
  }

  const speakingCopy = asString(
    field(fields, "Creator | Website | Speaking copy", "Speaking copy"),
  );
  const keynote = field(fields, "Creator | Profile | Keynote Speaking") === true;
  if (speakingCopy || keynote) {
    formats.push({
      kind: "speaking",
      category: String(formats.length + 1).padStart(2, "0"),
      title: "Speaking",
      description: speakingCopy ?? "",
      formats: [
        "In-Person Keynote",
        "Virtual Keynote / Webinar",
        "Podcast Guest",
        "Fireside Chat",
      ],
    });
  }

  const liveCopy = asString(
    field(fields, "Creator | Website | Live events copy", "Live events copy"),
  );
  if (liveCopy) {
    formats.push({
      kind: "liveEvents",
      category: String(formats.length + 1).padStart(2, "0"),
      title: "Live events",
      description: liveCopy ?? "",
      formats: ["Panel", "Retreat / Summit", "Roundtable"],
    });
  }

  const ambassadorCopy = asString(
    field(
      fields,
      "Creator | Website | Ambassador program copy",
      "Ambassador program copy",
    ),
  );
  if (ambassadorCopy) {
    formats.push({
      kind: "ambassador",
      category: String(formats.length + 1).padStart(2, "0"),
      title: "Ambassador program",
      description: ambassadorCopy ?? "",
      formats: ["Brand Ambassador", "Category Ambassador"],
    });
  }

  return formats;
}

/** Extract quote / channels / topics / audience / formats from a Credible | Data record. */
export function mapAirtableProfileSections(
  record: AirtableRecord,
  options: MapProfileSectionsOptions = {},
): AirtableProfileSections {
  const { fields } = record;
  const topicNamesById = options.topicNamesById ?? new Map<string, string>();
  const quoteRaw = asString(
    field(fields, "Creator | Website | Quote", "Quote"),
  );
  const { quote, attribution } = splitQuote(quoteRaw);

  return {
    quote,
    quoteAttribution: attribution,
    channels: buildChannels(fields),
    topicShares: buildTopicShares(fields, topicNamesById),
    audience: buildAudience(fields),
    formats: buildFormats(fields),
    linkedinTopVoice: asBoolean(
      field(
        fields,
        // fldaqAr8Ss77Sb1Kg — Channel | LinkedIn | Top Voice
        "Channel | LinkedIn | Top Voice",
        "LinkedIn | Top Voice",
        "LinkedIn Top Voice",
        "Top Voice",
      ),
    ),
  };
}

/** Read synced Top Voice flag from Expert.profileExtras JSON. */
export function linkedinTopVoiceFromExtras(profileExtras: unknown): boolean {
  if (!profileExtras || typeof profileExtras !== "object") return false;
  const extras = profileExtras as {
    linkedinTopVoice?: unknown;
    profileSections?: { linkedinTopVoice?: unknown };
  };
  if (typeof extras.profileSections?.linkedinTopVoice === "boolean") {
    return extras.profileSections.linkedinTopVoice;
  }
  if (typeof extras.linkedinTopVoice === "boolean") {
    return extras.linkedinTopVoice;
  }
  return asBoolean(
    extras.profileSections?.linkedinTopVoice ?? extras.linkedinTopVoice,
  );
}
