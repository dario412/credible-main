"use client";

import { StatCounter } from "@/components/stat-counter";

const EYEBROW =
  "text-[0.68rem] font-medium tracking-[0.18em] text-charcoal/45 uppercase";

const FACTS = [
  {
    value: "24",
    label: "Signed creators",
    caption:
      "Founders, operators, investors, and specialists — a capped roster, not an open marketplace.",
  },
  {
    value: "2",
    label: "Week review cycle",
    caption:
      "Applications read fortnightly. Qualified profiles get a fit call — not a template autoresponder.",
  },
  {
    value: "4",
    label: "Commercial formats",
    caption:
      "Partnerships, speaking, live events, and ambassador terms. One team from brief to delivery.",
  },
] as const;

export function RepresentationProgramFacts() {
  return (
    <section className="bg-cream px-6 py-14 md:px-10 md:py-18 lg:px-12 lg:py-20">
      <div className="mx-auto max-w-352">
        <div className="mx-auto max-w-2xl text-center">
          <p className={EYEBROW}>Program snapshot</p>
          <h2 className="mt-3 font-display text-[1.65rem] leading-[1.12] tracking-tight text-charcoal md:text-[1.95rem]">
            What representation looks like in practice
          </h2>
          <p className="mt-4 text-[0.9375rem] leading-relaxed text-charcoal/60">
            Numbers are one thing — how we work with creators is the point.
            Selective intake, named managers, and deals scoped for operators who
            already have an audience.
          </p>
        </div>

        <ul className="mt-12 grid gap-5 md:grid-cols-3 md:gap-6">
          {FACTS.map((fact, index) => (
            <li
              key={fact.label}
              className="flex flex-col rounded-sm border border-charcoal/10 bg-white px-6 py-8 md:px-7 md:py-9"
            >
              <p className="font-display text-[3.25rem] leading-none tracking-tight text-forest md:text-[3.75rem]">
                <StatCounter
                  value={fact.value}
                  duration={1200}
                  delay={index * 100}
                />
              </p>
              <p className="mt-4 text-[1rem] leading-snug font-medium text-charcoal md:text-[1.05rem]">
                {fact.label}
              </p>
              <p className="mt-2 flex-1 text-[0.8125rem] leading-relaxed text-charcoal/55 md:text-[0.875rem]">
                {fact.caption}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
