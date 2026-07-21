export type ExpertChannel = {
  type: "linkedin" | "youtube" | "podcast" | "x";
  url: string;
};

export function parseExpertChannels(value: unknown): ExpertChannel[] {
  if (!Array.isArray(value)) return [];
  return value.filter((item): item is ExpertChannel => {
    if (!item || typeof item !== "object") return false;
    const channel = item as ExpertChannel;
    return (
      typeof channel.url === "string" &&
      ["linkedin", "youtube", "podcast", "x"].includes(channel.type)
    );
  });
}
