"use client";

import { useState } from "react";
import {
  Check,
  Copy,
  EnvelopeSimple,
  LinkedinLogo,
  XLogo,
} from "@phosphor-icons/react";

import { cn } from "@/lib/utils";

export function InsightShare({
  url,
  title,
  className,
}: {
  url: string;
  title: string;
  className?: string;
}) {
  const [copied, setCopied] = useState(false);
  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);

  const links = [
    {
      label: "LinkedIn",
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
      icon: LinkedinLogo,
    },
    {
      label: "X",
      href: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`,
      icon: XLogo,
    },
    {
      label: "Email",
      href: `mailto:?subject=${encodedTitle}&body=${encodedUrl}`,
      icon: EnvelopeSimple,
    },
  ] as const;

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  }

  return (
    <div className={cn(className)}>
      <p className="text-[0.75rem] font-medium tracking-[0.04em] text-charcoal/45 uppercase">
        Share
      </p>
      <ul className="mt-3 flex flex-wrap items-center gap-3">
        {links.map(({ label, href, icon: Icon }) => (
          <li key={label}>
            <a
              href={href}
              target={label === "Email" ? undefined : "_blank"}
              rel={label === "Email" ? undefined : "noopener noreferrer"}
              aria-label={`Share on ${label}`}
              className="inline-flex size-8 items-center justify-center text-charcoal transition-colors hover:text-forest"
            >
              <Icon weight="bold" className="size-5" aria-hidden />
            </a>
          </li>
        ))}
        <li>
          <button
            type="button"
            aria-label={copied ? "Link copied" : "Copy link"}
            onClick={copyLink}
            className={cn(
              "inline-flex size-8 cursor-pointer items-center justify-center transition-colors",
              copied ? "text-forest" : "text-charcoal hover:text-forest",
            )}
          >
            {copied ? (
              <Check weight="bold" className="size-5" aria-hidden />
            ) : (
              <Copy weight="bold" className="size-5" aria-hidden />
            )}
          </button>
        </li>
      </ul>
    </div>
  );
}
