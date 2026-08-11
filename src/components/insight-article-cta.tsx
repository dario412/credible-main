"use client";

import Link from "next/link";
import { ArrowRight } from "@phosphor-icons/react";

import { PatternField } from "@/components/pattern-field";
import { useSiteChrome } from "@/components/site-chrome-context";

const CREAM_RGB = { r: 249, g: 243, b: 239 };

/** Compact roster CTA — insight & case study article sidebars. */
export function InsightArticleCta() {
  const { chrome } = useSiteChrome();
  const cta = chrome.articleSidebarCta;

  if (
    !cta.headline.trim() &&
    !cta.description.trim() &&
    !cta.ctaLabel.trim()
  ) {
    return null;
  }

  return (
    <Link
      href={cta.ctaHref.trim() || "/roster"}
      className="group relative flex flex-col justify-between overflow-hidden rounded-sm bg-forest px-5 py-6 transition-colors hover:bg-forest-dark md:px-6 md:py-7"
    >
      <PatternField
        color={CREAM_RGB}
        className="opacity-[0.12]"
        mask="linear-gradient(to left, black 0%, rgba(0,0,0,0.45) 40%, transparent 85%)"
      />

      <div className="relative z-2">
        {cta.headline.trim() ? (
          <p className="font-display text-[1.35rem] leading-[1.12] tracking-tight text-cream md:text-[1.45rem]">
            {cta.headline}
          </p>
        ) : null}
        {cta.description.trim() ? (
          <p
            className={`text-[0.8125rem] leading-relaxed text-cream/70 ${
              cta.headline.trim() ? "mt-2" : ""
            }`}
          >
            {cta.description}
          </p>
        ) : null}

        {cta.ctaLabel.trim() ? (
          <span
            className={`inline-flex items-center gap-1.5 text-[0.875rem] font-medium text-cream ${
              cta.headline.trim() || cta.description.trim() ? "mt-5" : ""
            }`}
          >
            {cta.ctaLabel}
            <ArrowRight
              weight="bold"
              className="size-3.5 transition-transform duration-300 group-hover:translate-x-0.5"
              aria-hidden
            />
          </span>
        ) : null}
      </div>
    </Link>
  );
}
