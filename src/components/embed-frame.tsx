"use client";

import {
  isAllowedEmbedSrc,
  parseEmbedUrl,
  type EmbedProvider,
} from "@/lib/embed-url";
import { cn } from "@/lib/utils";

export function EmbedFrame({
  url,
  provider: providerHint,
  title,
  className,
}: {
  /** Original pasted URL (LinkedIn post or YouTube). */
  url: string;
  provider?: EmbedProvider;
  title?: string;
  className?: string;
}) {
  const parsed = parseEmbedUrl(url);
  const provider = parsed?.provider ?? providerHint;
  const embedSrc =
    parsed?.embedSrc && isAllowedEmbedSrc(parsed.embedSrc)
      ? parsed.embedSrc
      : null;
  const canonical = parsed?.canonicalUrl ?? url.trim();
  const label =
    title?.trim() ||
    (provider === "youtube" ? "Embedded video" : "Embedded post");

  if (!embedSrc || !provider) {
    if (!canonical) return null;
    return (
      <p className={cn("text-[0.875rem] text-charcoal/60", className)}>
        <a
          href={canonical}
          target="_blank"
          rel="noopener noreferrer"
          className="font-medium text-forest underline-offset-2 hover:underline"
        >
          Open link
        </a>
        <span className="text-charcoal/40">
          {" "}
          — paste a public LinkedIn post or YouTube URL to embed.
        </span>
      </p>
    );
  }

  const providerLabel = provider === "youtube" ? "YouTube" : "LinkedIn";

  if (provider === "youtube") {
    return (
      <figure className={cn("my-2", className)}>
        <div className="relative aspect-video w-full overflow-hidden rounded-sm border border-charcoal/10 bg-charcoal/5">
          <iframe
            src={embedSrc}
            title={label}
            loading="lazy"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            className="absolute inset-0 size-full border-0"
          />
        </div>
        <figcaption className="mt-2.5 text-[0.75rem] text-charcoal/45">
          <a
            href={canonical}
            target="_blank"
            rel="noopener noreferrer"
            className="transition-colors hover:text-forest"
          >
            View on {providerLabel}
          </a>
        </figcaption>
      </figure>
    );
  }

  return (
    <figure className={cn("my-2", className)}>
      <div className="mx-auto w-full max-w-[34rem] overflow-hidden rounded-sm border border-charcoal/10 bg-white">
        <iframe
          src={embedSrc}
          title={label}
          loading="lazy"
          allowFullScreen
          className="block w-full border-0"
          style={{ minHeight: 480, height: 560 }}
        />
      </div>
      <figcaption className="mt-2.5 text-[0.75rem] text-charcoal/45">
        <a
          href={canonical}
          target="_blank"
          rel="noopener noreferrer"
          className="transition-colors hover:text-forest"
        >
          View on {providerLabel}
        </a>
      </figcaption>
    </figure>
  );
}
