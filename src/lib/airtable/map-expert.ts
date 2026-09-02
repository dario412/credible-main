import type { ExpertChannel } from "@/lib/expert-channels";
import { sumChannelFollowers } from "@/lib/channel-sparkline";
import type { AirtableAttachment, AirtableRecord } from "./client";
import {
  mapAirtableProfileSections,
  type AirtableProfileSections,
} from "./map-profile-sections";
import { websiteCategoriesFromFields } from "./website-categories";
import { AIRTABLE_CREATOR_TESTIMONIALS_FIELD } from "./testimonials";

export type MapExpertOptions = Record<string, never>;

export type MappedExpert = {
  airtableId: string;
  slug: string;
  name: string;
  nameFirst: string | null;
  title: string;
  bio: string;
  shortBio: string | null;
  websiteSubtitle: string | null;
  image: string | null;
  bannerImage: string | null;
  categories: string[];
  topics: string[];
  formats: string[];
  combinedReach: string | null;
  highlight1: string | null;
  highlight2: string | null;
  highlight3: string | null;
  highlight4: string | null;
  growth90d: string | null;
  audienceWho: string | null;
  audienceWhere: string | null;
  channels: ExpertChannel[];
  exclusive: boolean;
  featured: boolean;
  quote: string | null;
  quoteSource: string | null;
  brandPartnershipsCopy: string | null;
  seoTitle: string | null;
  seoDescription: string | null;
  expertsRecordIds: string[];
  recentPartnerships: string[];
  companyLogoIds: string[];
  similarProfileIds: string[];
  profileSections: AirtableProfileSections;
  testimonialIds: string[];
};

function normalizeKey(key: string): string {
  return key.replace(/\uFEFF/g, "").trim().toLowerCase();
}

/** Case-insensitive / BOM-tolerant field lookup. */
function field(fields: Record<string, unknown>, ...aliases: string[]): unknown {
  const byNorm = new Map(
    Object.entries(fields).map(([k, v]) => [normalizeKey(k), v] as const),
  );
  for (const alias of aliases) {
    const hit = byNorm.get(normalizeKey(alias));
    if (hit !== undefined && hit !== null && hit !== "") return hit;
  }
  return undefined;
}

function fieldMatching(
  fields: Record<string, unknown>,
  ...needles: string[]
): unknown {
  const required = needles.map((n) => n.toLowerCase());
  for (const [key, value] of Object.entries(fields)) {
    if (value === undefined || value === null || value === "") continue;
    const lower = normalizeKey(key);
    if (required.every((n) => lower.includes(n))) return value;
  }
  return undefined;
}

function asString(value: unknown): string | null {
  if (typeof value === "string") {
    const trimmed = value.trim();
    return trimmed || null;
  }
  if (typeof value === "number" && Number.isFinite(value)) return String(value);
  // Lookup / linked values sometimes arrive as string arrays
  if (Array.isArray(value)) {
    for (const item of value) {
      const s = asString(item);
      if (s) return s;
    }
  }
  // Airtable aiText fields arrive as { state, value, isStale }
  if (value && typeof value === "object" && "value" in value) {
    return asString((value as { value: unknown }).value);
  }
  return null;
}

function asBoolean(value: unknown): boolean {
  if (value === true || value === 1 || value === "1" || value === "true") {
    return true;
  }
  if (typeof value === "string") {
    const lower = value.trim().toLowerCase();
    return (
      lower === "yes" ||
      lower === "exclusive" ||
      lower === "signed" ||
      lower === "true"
    );
  }
  return false;
}

function recordIds(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value.filter(
    (id): id is string => typeof id === "string" && id.startsWith("rec"),
  );
}

function asStringList(value: unknown): string[] {
  if (Array.isArray(value)) {
    return value
      .flatMap((item) => {
        if (typeof item === "string") return splitThemeLine(item);
        if (item && typeof item === "object" && "name" in item) {
          const name = (item as { name?: unknown }).name;
          return typeof name === "string" ? [name.trim()] : [];
        }
        return [];
      })
      .filter(Boolean);
  }
  if (typeof value === "string") return splitThemeLine(value);
  return [];
}

/** Key themes arrive as newline-separated blobs in Airtable. */
function splitThemeLine(value: string): string[] {
  return value
    .split(/[\n\r]+|•|\u2022|,|;/)
    .map((part) => part.replace(/\s+/g, " ").trim())
    .filter(Boolean);
}

/** "214K Combined reach" / "$75M Successful Exit as Co-Founder" / "3 Platforms". */
export function parseHighlightStat(
  raw: string | null | undefined,
): { value: string; label: string } | null {
  if (!raw) return null;
  const text = raw.replace(/\s+/g, " ").trim();
  if (!text) return null;
  const match = text.match(
    /^([+\-]?\$?\d[\d.,]*(?:\s*[KkMmBb])?\+?%?)\s+(.*)$/,
  );
  if (!match) return { value: text, label: "" };
  const value = (match[1] ?? "").replace(/\s+/g, "");
  const label = (match[2] ?? "").trim();
  return { value: value || text, label };
}

function isCombinedReachLabel(label: string) {
  const lower = label.toLowerCase();
  // Do not rewrite platform-specific stats like "LinkedIn Followers".
  if (
    /linkedin|youtube|newsletter|instagram|tiktok|facebook|podcast|\btwitter\b|(^|[\s/])x([\s/]|$)/.test(
      lower,
    )
  ) {
    return false;
  }
  return /\bcombined\b/.test(lower) || /^reach$/.test(lower.trim());
}

/** Keep reach highlights aligned with the summed channel follower total. */
export function withSyncedReachHighlight(
  raw: string | null,
  combinedReach: string | null,
): string | null {
  if (!raw || !combinedReach) return raw;
  const parsed = parseHighlightStat(raw);
  if (!parsed?.label || !isCombinedReachLabel(parsed.label)) return raw;
  return `${combinedReach} ${parsed.label}`;
}

export { isCombinedReachLabel };

function highlightField(
  fields: Record<string, unknown>,
  n: 1 | 2 | 3 | 4,
): string | null {
  const direct = asString(
    field(
      fields,
      `Creator | Website | Highlight ${n}`,
      `Creator | Wesbite | Highlight ${n}`,
      `Website | Highlight ${n}`,
      `Highlight ${n}`,
    ),
  );
  if (direct) return direct;

  const re = new RegExp(`highlight\\s*${n}\\b`);
  for (const [key, value] of Object.entries(fields)) {
    if (!re.test(normalizeKey(key))) continue;
    const parsed = asString(value);
    if (parsed) return parsed;
  }
  return null;
}

/** "3.2M Combined reach" / "20k+" → "3.2M" / "20k+" for roster cards. */
function asReachMetric(value: unknown): string | null {
  const raw = asString(value);
  if (!raw) return null;
  const match = raw.match(/^([+-]?[\d.,]+\s*[KkMmBb%+]*)/);
  if (match?.[1]) return match[1].replace(/\s+/g, "");
  return raw;
}

function firstUrl(value: unknown): string | null {
  if (typeof value === "string" && /^https?:\/\//i.test(value.trim())) {
    return value.trim();
  }
  if (!Array.isArray(value) || value.length === 0) return null;
  for (const item of value) {
    if (typeof item === "string" && /^https?:\/\//i.test(item.trim())) {
      return item.trim();
    }
    if (item && typeof item === "object" && "url" in item) {
      const url = (item as AirtableAttachment).url;
      if (typeof url === "string" && /^https?:\/\//i.test(url)) return url;
    }
  }
  return null;
}

function slugify(input: string): string {
  return input
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

function channelFromUrl(
  type: ExpertChannel["type"],
  value: unknown,
): ExpertChannel | null {
  const url = firstUrl(value) ?? asString(value);
  if (!url || !/^https?:\/\//i.test(url)) return null;
  return { type, url };
}

function firstNameFrom(name: string, explicit: string | null): string | null {
  if (explicit) return explicit;
  return name.trim().split(/\s+/)[0] || null;
}

function slugFromValue(raw: string | null, fallbackName: string): string {
  if (!raw) return slugify(fallbackName);
  if (/^https?:\/\//i.test(raw)) {
    try {
      const path = new URL(raw).pathname.replace(/\/+$/, "");
      const seg = path.split("/").filter(Boolean).pop();
      return seg ? slugify(seg) : slugify(fallbackName);
    } catch {
      return slugify(raw);
    }
  }
  return slugify(raw);
}

/**
 * Map a Credible | Data Airtable record into an Expert upsert payload.
 */
export function mapAirtableRecordToExpert(
  record: AirtableRecord,
  _options: MapExpertOptions = {},
): MappedExpert | null {
  const { fields, id: airtableId } = record;

  if (asBoolean(field(fields, "Creator | Archive", "Archive"))) {
    return null;
  }

  // Full name field in Airtable is literally "Creator | <BOM>Name"
  const name = asString(
    field(fields, "Creator | Name", "Name", "Full Name") ??
      [...Object.entries(fields)].find(([k]) => {
        const n = normalizeKey(k);
        return (
          n === "creator | name" ||
          (n.startsWith("creator |") &&
            n.endsWith("name") &&
            !n.includes("first") &&
            !n.includes("experts"))
        );
      })?.[1],
  );
  if (!name) return null;

  const nameFirst = asString(
    field(fields, "Creator | Name first", "Name first", "First Name"),
  );

  const slug = slugFromValue(
    asString(field(fields, "Website | Slug", "Slug", "URL Slug", "Handle")),
    name,
  );
  if (!slug) return null;

  const websiteSubtitle = asString(
    field(fields, "Creator | Website | Subtitle", "Website | Subtitle") ??
      fieldMatching(fields, "website", "subtitle"),
  );

  const profileTitle = asString(
    field(fields, "Creator | Profile | Title", "Job Title", "Role"),
  );

  const profileShortBio = asString(
    field(
      fields,
      "Creator | Profile | Short bio",
      "Short Bio",
      "Short bio",
    ),
  );

  const longBio = asString(
    field(
      fields,
      "Creator | Website | Long bio",
      "Creator | Profile | Long bio",
      "Long bio",
      "Bio",
    ),
  );

  const shortBio = websiteSubtitle ?? profileShortBio;

  const image =
    firstUrl(field(fields, "Creator | Expert image", "Expert image")) ??
    firstUrl(
      field(fields, "Creator | Expert image preview", "Expert image preview"),
    );

  const bannerImage = firstUrl(
    field(
      fields,
      "Creator | Website | Banner image",
      "Website | Banner image",
      "Banner image",
    ),
  );

  // Creator | Website | Archetype (fldNR16ZQJeDMlWc8) — multipleSelects
  const categories = asStringList(
    field(fields, "Creator | Website | Archetype", "Archetype"),
  );

  const title =
    (profileTitle && profileTitle !== websiteSubtitle
      ? profileTitle
      : null) ??
    categories[0] ??
    name;
  const bio = longBio ?? shortBio ?? title;

  const topics = websiteCategoriesFromFields(fields).slice(0, 6);

  const profileSections = mapAirtableProfileSections(record);

  const highlight1 = highlightField(fields, 1);
  const highlight2 = highlightField(fields, 2);
  const highlight3 = highlightField(fields, 3);
  const highlight4 = highlightField(fields, 4);

  const followersHeadline = asString(
    field(
      fields,
      "Creator | Profile | Followers headline",
      "Followers headline",
    ),
  );

  const parsedHighlights = [highlight1, highlight2, highlight3, highlight4]
    .map(parseHighlightStat)
    .filter((stat): stat is { value: string; label: string } => Boolean(stat));

  const reachStat =
    parsedHighlights.find((stat) => /reach/i.test(stat.label)) ??
    parsedHighlights[0];
  const growthStat = parsedHighlights.find((stat) => /growth/i.test(stat.label));

  const combinedReachFromChannels = sumChannelFollowers(
    profileSections.channels,
  );
  const combinedReach =
    combinedReachFromChannels ??
    reachStat?.value ??
    asReachMetric(followersHeadline);
  const growth90d = growthStat?.value ?? null;

  const syncedHighlight1 = withSyncedReachHighlight(highlight1, combinedReach);
  const syncedHighlight2 = withSyncedReachHighlight(highlight2, combinedReach);
  const syncedHighlight3 = withSyncedReachHighlight(highlight3, combinedReach);
  const syncedHighlight4 = withSyncedReachHighlight(highlight4, combinedReach);

  const exclusiveRaw = field(
    fields,
    "Creator | Exclusivity",
    "Exclusivity",
    "Exclusive",
  );
  const exclusive =
    exclusiveRaw === true ||
    (typeof exclusiveRaw === "string" &&
      /^(yes|exclusive|signed|true)$/i.test(exclusiveRaw.trim()));

  const brandPartnershipsCopy = asString(
    field(
      fields,
      "Creator | Website | Brand partnerships",
      "Brand partnerships copy",
    ),
  );

  const channels: ExpertChannel[] = [];
  for (const [type, value] of [
    ["linkedin", field(fields, "Channel | LinkedIn | URL", "LinkedIn")],
    ["youtube", field(fields, "Channel | YouTube | URL", "YouTube")],
    ["x", field(fields, "Channel | x.com | URL", "X", "Twitter")],
    ["tiktok", field(fields, "Channel | TikTok | URL", "TikTok")],
    ["instagram", field(fields, "Channel | Instagram | URL", "Instagram")],
    ["facebook", field(fields, "Channel | Facebook | URL", "Facebook")],
    ["newsletter", field(fields, "Channel | Newsletter | URL")],
    ["podcast", field(fields, "Channel | Podcast | URL", "Podcast")],
  ] as const) {
    const channel = channelFromUrl(type, value);
    if (channel) channels.push(channel);
  }

  const quote = profileSections.quote;
  const quoteSource = profileSections.quoteAttribution;

  return {
    airtableId,
    slug,
    name,
    nameFirst: firstNameFrom(name, nameFirst),
    title,
    bio,
    shortBio,
    websiteSubtitle,
    image: image ?? bannerImage,
    bannerImage,
    categories,
    topics,
    formats: [],
    combinedReach,
    highlight1: syncedHighlight1,
    highlight2: syncedHighlight2,
    highlight3: syncedHighlight3,
    highlight4: syncedHighlight4,
    growth90d,
    audienceWho: asString(
      field(fields, "Creator | Profile | Audience", "Audience"),
    ),
    audienceWhere: asString(field(fields, "Location", "Geography")),
    channels,
    exclusive,
    featured: exclusive,
    quote,
    quoteSource,
    brandPartnershipsCopy,
    seoTitle: asString(field(fields, "Website | Meta Title", "SEO Title")),
    seoDescription: asString(
      field(fields, "Website | Meta Description", "SEO Description"),
    ),
    expertsRecordIds: recordIds(field(fields, "Experts | Name", "Experts")),
    recentPartnerships: asStringList(
      field(
        fields,
        "Creator | Profile | Recent partnerships",
        "Recent partnerships",
      ),
    ),
    companyLogoIds: recordIds(
      field(
        fields,
        "Creator | Website | Company logos",
        "Website | Company logos",
        "Company logos",
      ),
    ),
    similarProfileIds: recordIds(
      field(fields, "Similar profiles", "Similar Profiles"),
    ),
    profileSections,
    testimonialIds: recordIds(
      field(fields, AIRTABLE_CREATOR_TESTIMONIALS_FIELD, "Credible |  Testimonials"),
    ),
  };
}
