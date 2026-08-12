import {
  MicrophoneStage,
  RocketLaunch,
  SealCheck,
  TrendUp,
  X,
} from "@phosphor-icons/react/ssr";
import type { ComponentType } from "react";

import { RepresentationApplyCta } from "@/components/representation-apply-cta";

const EYEBROW =
  "text-[0.68rem] font-medium tracking-[0.18em] text-charcoal/45 uppercase";

type PersonaIcon = ComponentType<{
  weight?: "thin" | "light" | "regular" | "bold" | "fill" | "duotone";
  className?: string;
  "aria-hidden"?: boolean;
}>;

type Persona = {
  icon: PersonaIcon;
  title: string;
  signal: string;
  body: string;
};

const PERSONAS: Persona[] = [
  {
    icon: RocketLaunch,
    title: "Founders & operators",
    signal: "Built and scaled something",
    body: "Your audience trusts your judgment on GTM, product, and leadership — not lifestyle content or hot takes for reach.",
  },
  {
    icon: TrendUp,
    title: "Investors & analysts",
    signal: "Markets, capital, category thesis",
    body: "You interpret sectors and allocation for buyers who already cite your view in diligence calls and board prep.",
  },
  {
    icon: SealCheck,
    title: "Subject-matter experts",
    signal: "Practitioner depth in a vertical",
    body: "Security, finance, HR, AI, ops — a consistent publishing or speaking cadence and an audience of practitioners.",
  },
  {
    icon: MicrophoneStage,
    title: "Speakers & hosts",
    signal: "Stage, podcast, or newsletter",
    body: "Keynotes, shows, or written formats with a B2B following and room to grow repeat commercial work.",
  },
];

const FIT_SIGNALS = [
  "Buyers, builders, or decision-makers in your audience",
  "A body of work brands can evaluate before they brief",
  "Interest in partnerships, speaking, or advisory — not one-off posts",
] as const;

const NOT_FIT = [
  "Consumer entertainment or lifestyle-first audiences",
  "No consistent publishing, speaking, or hosting yet",
  "A marketplace listing — we manage deals, not discovery alone",
] as const;

export function RepresentationWhoWeLookFor() {
  return (
    <section className="px-6 py-16 md:px-10 md:py-20 lg:px-12 lg:py-24">
      <div className="mx-auto grid max-w-352 items-start gap-12 lg:grid-cols-[minmax(0,0.88fr)_minmax(0,1.12fr)] lg:gap-16 xl:gap-20">
        <div className="lg:sticky lg:top-28 lg:self-start">
          <p className={EYEBROW}>Who we look for</p>
          <h2 className="mt-3 font-display text-[1.85rem] leading-[1.1] tracking-tight text-charcoal md:text-[2.25rem]">
            Operators your buyers already trust
          </h2>
          <p className="mt-4 max-w-md text-[0.9375rem] leading-relaxed text-charcoal/65">
            We represent credibility in a category — founders, investors,
            practitioners, and hosts with real B2B audiences. Self-qualify
            before you apply.
          </p>

          <div className="mt-8 space-y-6">
            <div>
              <p className="text-[0.65rem] font-medium tracking-[0.14em] text-forest uppercase">
                Likely a fit
              </p>
              <ul className="mt-3 space-y-2.5">
                {FIT_SIGNALS.map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-2.5 text-[0.8125rem] leading-snug text-charcoal/70"
                  >
                    <span
                      aria-hidden
                      className="mt-1.5 size-1.5 shrink-0 rounded-full bg-forest"
                    />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-sm border border-charcoal/8 bg-[#FBF8F5] px-4 py-4 md:px-5 md:py-5">
              <p className="text-[0.65rem] font-medium tracking-[0.14em] text-charcoal/45 uppercase">
                Probably not a fit
              </p>
              <ul className="mt-3 space-y-2.5">
                {NOT_FIT.map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-2.5 text-[0.8125rem] leading-snug text-charcoal/55"
                  >
                    <X
                      weight="bold"
                      className="mt-0.5 size-3.5 shrink-0 text-charcoal/35"
                      aria-hidden
                    />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <RepresentationApplyCta surface="accent" className="mt-8 hidden lg:inline-flex">
            Apply if this sounds like you
          </RepresentationApplyCta>
        </div>

        <ul className="border-t border-charcoal/12">
          {PERSONAS.map((persona) => (
            <li
              key={persona.title}
              className="flex items-start gap-5 border-b border-charcoal/12 py-8 md:gap-6 md:py-9"
            >
              <span className="flex size-11 shrink-0 items-center justify-center rounded-sm border border-charcoal/10 bg-[#FBF8F5] md:size-12">
                <persona.icon
                  weight="duotone"
                  className="size-5 text-forest md:size-6"
                  aria-hidden
                />
              </span>

              <div className="min-w-0 flex-1">
                <p className="text-[0.65rem] font-medium tracking-[0.14em] text-forest uppercase">
                  {persona.signal}
                </p>
                <h3 className="mt-1.5 font-display text-[1.3rem] leading-snug tracking-tight text-charcoal md:text-[1.45rem]">
                  {persona.title}
                </h3>
                <p className="mt-2.5 text-[0.875rem] leading-relaxed text-charcoal/60">
                  {persona.body}
                </p>
              </div>
            </li>
          ))}
        </ul>

        <RepresentationApplyCta
          surface="accent"
          className="w-full sm:w-auto lg:hidden"
        >
          Apply if this sounds like you
        </RepresentationApplyCta>
      </div>
    </section>
  );
}
