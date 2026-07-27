import Link from "next/link";
import {
  ArrowUpRight,
  Handshake,
  Microphone,
  SealCheck,
  Ticket,
} from "@phosphor-icons/react/ssr";

import { WAYS } from "@/components/ways-in";

const WAY_ICONS = {
  partnerships: Handshake,
  ambassadors: SealCheck,
  speaking: Microphone,
  live: Ticket,
} as const;

export function WaysInAccordion() {
  return (
    <section className="bg-cream px-6 py-16 md:px-10 md:py-20 lg:px-12">
      <div className="mx-auto grid max-w-352 gap-12 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:items-start lg:gap-16 xl:gap-24">
        <div className="lg:sticky lg:top-28">
          <h2 className="font-display text-[2.6rem] leading-[1.08] tracking-tight text-charcoal sm:text-[3.15rem] md:text-[3.65rem]">
            One roster,
            <br />
            four ways in.
          </h2>

          <p className="mt-6 max-w-md text-[0.9rem] leading-relaxed text-charcoal/70 md:text-[0.95rem]">
            Whatever the brief maps to — a keynote, a series, a category
            ambassador, a private dinner — the same team handles it end-to-end.
          </p>
        </div>

        <ul className="border-t border-charcoal/12">
          {WAYS.map((way) => {
            const Icon = WAY_ICONS[way.visual];

            return (
              <li
                key={way.index}
                className="flex items-start gap-5 border-b border-charcoal/12 py-8 md:gap-7 md:py-10"
              >
                <Icon
                  weight="light"
                  aria-hidden
                  className="mt-0.5 size-6 shrink-0 text-forest md:size-7"
                />

                <div className="min-w-0 flex-1">
                  <h3 className="font-display text-[1.4rem] leading-tight tracking-tight md:text-[1.75rem]">
                    <Link
                      href="/what-we-do"
                      className="group inline-flex items-center gap-2.5 text-charcoal transition-colors hover:text-forest"
                    >
                      {way.title}
                      <ArrowUpRight
                        weight="bold"
                        aria-hidden
                        className="size-4 shrink-0 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:rotate-45 md:size-5"
                      />
                    </Link>
                  </h3>

                  <p className="mt-5 max-w-lg text-[1rem] leading-relaxed text-charcoal/70 md:mt-6 md:text-[1.0625rem]">
                    {way.body}
                  </p>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
