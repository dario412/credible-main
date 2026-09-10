"use client";

import {
  isAllowedEmbedSrc,
  parseEmbedUrl,
  type EmbedProvider,
} from "@/lib/embed-url";
import { cn } from "@/lib/utils";

type EmbedItem = {
  url: string;
  provider?: EmbedProvider;
  title?: string;
};

export function EmbedFrame({
  url,
  provider: providerHint,
  title,
  className,
  fill = false,
}: {
  /** Original pasted URL (LinkedIn post or YouTube). */
  url: string;
  provider?: EmbedProvider;
  title?: string;
  className?: string;
  /** Stretch to parent (use inside embed grids). */
  fill?: boolean;
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
      <figure className={cn(fill ? "h-full" : "my-2", className)}>
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
    <figure className={cn(fill ? "h-full min-w-0" : "my-2", className)}>
      <div
        className={cn(
          "overflow-hidden rounded-sm border border-charcoal/10 bg-white",
          fill ? "w-full" : "mx-auto w-full max-w-[34rem]",
        )}
      >
        <iframe
          src={embedSrc}
          title={label}
          loading="lazy"
          allowFullScreen
          className="block w-full border-0"
          style={{ minHeight: fill ? 620 : 670, height: fill ? 620 : 670 }}
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

/** One embed full-width; two+ side-by-side on sm+. */
export function EmbedGrid({
  items,
  className,
}: {
  items: EmbedItem[];
  className?: string;
}) {
  if (items.length === 0) return null;

  if (items.length === 1) {
    const item = items[0]!;
    return (
      <div className={cn("max-w-xl", className)}>
        <EmbedFrame
          url={item.url}
          provider={item.provider}
          title={item.title}
        />
      </div>
    );
  }

  return (
    <div
      className={cn(
        "grid gap-5 sm:grid-cols-2 sm:gap-6",
        className,
      )}
    >
      {items.map((item, index) => (
        <EmbedFrame
          key={`${item.url}-${index}`}
          url={item.url}
          provider={item.provider}
          title={item.title}
          fill
        />
      ))}
    </div>
  );
}
