"use client";

import Link from "next/link";
import { ArrowRight } from "@phosphor-icons/react";

import { FadeUp } from "@/components/fade-up";

export function ExpertInterestCta({
  first,
  slug,
}: {
  first: string;
  slug: string;
}) {
  return (
    <div className="relative">
      <FadeUp duration={1200} y={22} threshold={0.3}>
        <h2 className="mx-auto max-w-[14ch] font-display text-[2rem] leading-[1.05] tracking-tight text-cream sm:text-[2.4rem] md:text-[2.75rem]">
          Interested in working with {first}?
        </h2>
      </FadeUp>

      <FadeUp delay={160} duration={1200} y={22} threshold={0.3}>
        <p className="mx-auto mt-5 max-w-lg text-[1rem] leading-relaxed text-cream/70 md:mt-6">
          Every enquiry gets a same-day acknowledgement from {first}&apos;s
          manager at Credible. Brief availability is limited to two commercial
          partners per quarter.
        </p>
      </FadeUp>

      <FadeUp delay={320} duration={1200} y={22} threshold={0.3}>
        <div className="mt-9 flex w-full flex-col gap-3 sm:mx-auto sm:max-w-md sm:flex-row sm:justify-center">
          <Link
            href={`/contact?expert=${encodeURIComponent(slug)}`}
            className="group inline-flex flex-1 items-center justify-center gap-2 rounded-sm bg-cream px-6 py-3.5 text-[0.9375rem] font-medium text-charcoal transition-colors hover:bg-cream-dark"
          >
            Send brief
            <ArrowRight
              weight="bold"
              className="size-3.5 transition-transform duration-300 group-hover:translate-x-0.5"
              aria-hidden
            />
          </Link>
          <Link
            href="/roster"
            className="inline-flex flex-1 items-center justify-center gap-2 rounded-sm border border-cream/25 bg-charcoal/20 px-6 py-3.5 text-[0.9375rem] font-medium text-cream backdrop-blur-sm transition-colors hover:border-cream/50 hover:bg-cream/10"
          >
            Browse roster
          </Link>
        </div>
      </FadeUp>
    </div>
  );
}
