import Link from "next/link";
import { ArrowRight } from "@phosphor-icons/react/ssr";

import { PatternField } from "@/components/pattern-field";

const CREAM_RGB = { r: 249, g: 243, b: 239 };

/** Compact roster CTA — matches Insights promo card language. */
export function InsightArticleCta() {
  return (
    <Link
      href="/roster"
      className="group relative flex flex-col justify-between overflow-hidden rounded-sm bg-forest px-5 py-6 transition-colors hover:bg-forest-dark md:px-6 md:py-7"
    >
      <PatternField
        color={CREAM_RGB}
        className="opacity-[0.12]"
        mask="linear-gradient(to left, black 0%, rgba(0,0,0,0.45) 40%, transparent 85%)"
      />

      <div className="relative z-2">
        <p className="font-display text-[1.35rem] leading-[1.12] tracking-tight text-cream md:text-[1.45rem]">
          Ready to brief an expert?
        </p>
        <p className="mt-2 text-[0.8125rem] leading-relaxed text-cream/70">
          Browse operators by topic, format, and archetype — then send a brief.
        </p>

        <span className="mt-5 inline-flex items-center gap-1.5 text-[0.875rem] font-medium text-cream">
          Browse the roster
          <ArrowRight
            weight="bold"
            className="size-3.5 transition-transform duration-300 group-hover:translate-x-0.5"
            aria-hidden
          />
        </span>
      </div>
    </Link>
  );
}
