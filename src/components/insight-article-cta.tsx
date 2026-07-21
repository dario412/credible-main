import Link from "next/link";
import { ArrowRight } from "@phosphor-icons/react/ssr";

import { PatternField } from "@/components/pattern-field";

const CREAM_RGB = { r: 249, g: 243, b: 239 };

export function InsightArticleCta() {
  return (
    <div className="relative overflow-hidden rounded-sm bg-forest px-5 py-6 shadow-[0_14px_36px_rgba(42,73,57,0.28)] md:px-6 md:py-7">
      <PatternField
        color={CREAM_RGB}
        className="opacity-[0.16]"
        mask="linear-gradient(to left, black 0%, rgba(0,0,0,0.55) 35%, rgba(0,0,0,0.12) 65%, transparent 88%)"
      />

      <div className="relative z-2">
        <p className="font-display text-[1.35rem] leading-[1.12] tracking-tight text-cream md:text-[1.45rem]">
          Ready to brief an expert?
        </p>
        <p className="mt-2 text-[0.8125rem] leading-relaxed text-cream/70">
          Browse operators by topic, format, and archetype — then send a brief.
        </p>

        <Link
          href="/roster"
          className="mt-5 inline-flex w-full items-center justify-center gap-1.5 rounded-sm bg-cream px-4 py-3 text-[0.8125rem] font-medium text-charcoal transition-colors hover:bg-cream-dark"
        >
          Browse the roster
          <ArrowRight weight="bold" className="size-3.5" aria-hidden />
        </Link>
      </div>
    </div>
  );
}
