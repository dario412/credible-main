import Image from "next/image";

import type { ExpertChannelPresence } from "@/lib/expert-profiles";

/** Standard inline brand mark size — matches common UI icon scale. */
export const CHANNEL_BRAND_LOGO_SIZE = 24;

const PLATFORM_LOGOS: Record<
  ExpertChannelPresence["icon"],
  { src: string; label: string }
> = {
  linkedin: { src: "/brand/linkedin-in-bug.png", label: "LinkedIn" },
  youtube: { src: "/brand/platforms/youtube.svg", label: "YouTube" },
  x: { src: "/brand/platforms/x.svg", label: "X" },
  instagram: { src: "/brand/platforms/instagram.svg", label: "Instagram" },
  facebook: { src: "/brand/platforms/facebook.svg", label: "Facebook" },
  tiktok: { src: "/brand/platforms/tiktok.svg", label: "TikTok" },
  podcast: { src: "/brand/platforms/podcast.svg", label: "Podcast" },
  newsletter: { src: "/brand/platforms/newsletter.svg", label: "Newsletter" },
};

function newsletterLogoSrc(url?: string): string {
  const host = url?.toLowerCase() ?? "";
  if (host.includes("substack")) return "/brand/platforms/substack.svg";
  return PLATFORM_LOGOS.newsletter.src;
}

export function ChannelBrandIcon({
  icon,
  url,
}: {
  icon: ExpertChannelPresence["icon"];
  url?: string;
  platform?: string;
}) {
  const logo =
    icon === "newsletter"
      ? { src: newsletterLogoSrc(url), label: "Newsletter" }
      : (PLATFORM_LOGOS[icon] ?? PLATFORM_LOGOS.newsletter);

  return (
    <Image
      src={logo.src}
      alt=""
      width={CHANNEL_BRAND_LOGO_SIZE}
      height={CHANNEL_BRAND_LOGO_SIZE}
      className="size-6 shrink-0 object-contain"
      aria-hidden
    />
  );
}
