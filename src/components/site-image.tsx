import Image, { type ImageProps } from "next/image";

import { imageUnoptimized } from "@/lib/media";

/**
 * next/image wrapper that skips optimization for media-library URLs
 * (`/api/media/...`), which are served from the database and fail the
 * default optimizer / remote allowlist.
 */
export function SiteImage({ src, unoptimized, ...props }: ImageProps) {
  const srcValue = typeof src === "string" ? src : "";
  return (
    <Image
      src={src}
      unoptimized={unoptimized || imageUnoptimized(srcValue)}
      {...props}
    />
  );
}
