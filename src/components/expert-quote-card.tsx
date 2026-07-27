"use client";

import { FadeUp } from "@/components/fade-up";

export function ExpertQuoteCard({
  quote,
  attribution,
}: {
  quote: string;
  attribution?: string;
}) {
  return (
    <FadeUp duration={1200} y={24} threshold={0.3} className="lg:mt-8">
      <figure className="relative isolate overflow-hidden rounded-sm bg-cream-dark px-6 py-7 text-charcoal md:px-7 md:py-8">
        <p className="relative text-[0.65rem] font-medium tracking-[0.18em] text-charcoal/45 uppercase">
          In their words
        </p>

        <blockquote className="relative mt-4 font-display text-[1.25rem] leading-[1.3] tracking-tight text-charcoal md:text-[1.4rem] md:leading-[1.28]">
          {quote}
        </blockquote>

        {attribution ? (
          <figcaption className="relative mt-5 text-[0.8rem] leading-snug tracking-wide text-charcoal/55">
            {attribution.replace(/^—\s*/, "")}
          </figcaption>
        ) : null}
      </figure>
    </FadeUp>
  );
}
