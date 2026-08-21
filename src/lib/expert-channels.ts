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
