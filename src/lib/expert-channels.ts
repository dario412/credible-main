export type ExpertChannel = {
  type:
    | "linkedin"
    | "youtube"
    | "podcast"
    | "x"
    | "tiktok"
    | "instagram"
    | "facebook"
    | "newsletter";
  url: string;
};

const EXPERT_CHANNEL_TYPES: ExpertChannel["type"][] = [
  "linkedin",
  "youtube",
  "podcast",
  "x",
  "tiktok",
  "instagram",
  "facebook",
  "newsletter",
];

/**
 * Roster Channels filter options — matches Brand partnerships channel rows on
 * profile pages (FormatsPanel), which are derived from Creator | Rate | … fields.
 */
export const BRAND_PARTNERSHIP_CHANNEL_FILTER_OPTIONS = [
  { label: "LinkedIn", value: "linkedin" },
  { label: "X", value: "x" },
  { label: "Instagram", value: "instagram" },
  { label: "TikTok", value: "tiktok" },
  { label: "Newsletter", value: "newsletter" },
  { label: "YouTube", value: "youtube" },
] as const;

export type BrandPartnershipChannelFilterValue =
  (typeof BRAND_PARTNERSHIP_CHANNEL_FILTER_OPTIONS)[number]["value"];

const FORMAT_CHANNEL_LABEL_TO_TYPE: Record<
  string,
  BrandPartnershipChannelFilterValue
> = {
  linkedin: "linkedin",
  x: "x",
  twitter: "x",
  "x / twitter": "x",
  instagram: "instagram",
  tiktok: "tiktok",
  newsletter: "newsletter",
  youtube: "youtube",
};

export function parseExpertChannels(value: unknown): ExpertChannel[] {
  if (!Array.isArray(value)) return [];
  return value.filter((item): item is ExpertChannel => {
    if (!item || typeof item !== "object") return false;
    const channel = item as ExpertChannel;
    return (
      typeof channel.url === "string" &&
      EXPERT_CHANNEL_TYPES.includes(channel.type)
    );
  });
}

function channelTypeFromFormatLabel(
  label: string,
): BrandPartnershipChannelFilterValue | null {
  return FORMAT_CHANNEL_LABEL_TO_TYPE[label.trim().toLowerCase()] ?? null;
}

/**
 * Channels listed under Brand partnerships on a profile (rate-backed rows in
 * profileExtras.profileSections.formats), used by the roster Channels filter.
 */
export function partnershipChannelTypesFromProfileExtras(
  profileExtras: unknown,
): BrandPartnershipChannelFilterValue[] {
  if (!profileExtras || typeof profileExtras !== "object") return [];
  const sections = (profileExtras as { profileSections?: unknown })
    .profileSections;
  if (!sections || typeof sections !== "object") return [];
  const formats = (sections as { formats?: unknown }).formats;
  if (!Array.isArray(formats)) return [];

  const types = new Set<BrandPartnershipChannelFilterValue>();
  for (const offering of formats) {
    if (!offering || typeof offering !== "object") continue;
    const channels = (offering as { channels?: unknown }).channels;
    if (!Array.isArray(channels)) continue;
    for (const row of channels) {
      if (!row || typeof row !== "object") continue;
      const label = (row as { channel?: unknown }).channel;
      if (typeof label !== "string") continue;
      const type = channelTypeFromFormatLabel(label);
      if (type) types.add(type);
    }
  }

  return [...types];
}
