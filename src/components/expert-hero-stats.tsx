"use client";

import { StatCounter } from "@/components/stat-counter";
import { FadeUp } from "@/components/fade-up";
import type { ExpertProfileStat } from "@/lib/expert-profiles";
import { cn } from "@/lib/utils";

/** Highlights with no digits (e.g. "Former NFL Pro") render as statements. */
function isTextOnlyStat(stat: ExpertProfileStat) {
  return !/\d/.test(stat.value.trim());
}

export function ExpertHeroStats({ stats }: { stats: ExpertProfileStat[] }) {
  if (stats.length === 0) return null;

  return (
    <dl className="grid grid-cols-2 auto-rows-fr gap-3 sm:max-w-lg lg:w-[30rem] lg:gap-3.5">
      {stats.slice(0, 4).map((stat, index) => {
        const textOnly = isTextOnlyStat(stat);
        const statement = textOnly
          ? (stat.label || stat.value).trim()
          : "";

        return (
          <FadeUp
            key={`${stat.value}-${stat.label}-${index}`}
            delay={index * 180}
            duration={1200}
            y={22}
            threshold={0.15}
            className="h-full min-w-0"
          >
            <div
              className={cn(
                "relative flex h-full min-h-[8.75rem] flex-col overflow-hidden rounded-sm px-4 py-4 backdrop-blur-md md:min-h-[9.75rem] md:px-5 md:py-5",
                textOnly
                  ? "justify-between border border-cream/15 bg-cream/[0.07]"
                  : "justify-between bg-cream/10",
              )}
            >
              {textOnly ? (
                <>
                  <dt className="text-[0.65rem] font-medium tracking-[0.16em] text-cream/45 uppercase">
                    Credential
                  </dt>
                  <dd className="mt-3 font-display text-[1.35rem] leading-[1.15] tracking-tight text-cream md:text-[1.5rem]">
                    {statement}
                  </dd>
                </>
              ) : (
                <>
                  <dd
                    className={cn(
                      "font-display text-[2.35rem] leading-none tracking-tight text-cream md:text-[2.85rem]",
                      stat.accent === "forest" && "text-[#9BC4AD]",
                    )}
                  >
                    <StatCounter
                      value={stat.value}
                      delay={index * 180}
                      duration={1600 + index * 100}
                    />
                  </dd>
                  {stat.label ? (
                    <dt className="mt-2.5 min-h-[2.6em] text-[0.75rem] tracking-[0.12em] text-cream/70 uppercase md:text-[0.8rem]">
                      {stat.label}
                    </dt>
                  ) : null}
                </>
              )}
            </div>
          </FadeUp>
        );
      })}
    </dl>
  );
}
