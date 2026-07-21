"use client";

import Link from "next/link";
import { ArrowRight, Clock } from "@phosphor-icons/react";

import { PatternField } from "@/components/pattern-field";
import { cn } from "@/lib/utils";

const CREAM_RGB = { r: 249, g: 243, b: 239 };

const updates = [
  {
    label: "Next update",
    date: "21.07",
    time: "3:00 PM CET",
    status: "Today",
    accent: true,
  },
  {
    label: "Following update",
    date: "22.07",
    time: "3:00 PM CET",
    status: "Tomorrow",
    accent: false,
  },
] as const;

export function InProgressPlaceholder({
  title = "Still in progress",
}: {
  title?: string;
}) {
  const displayTitle = title.replace(/\s*—\s*still in progress$/i, "").trim();

  return (
    <section className="relative isolate min-h-[calc(100vh-8rem)] overflow-hidden">
      {/* Atmosphere */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_20%_0%,rgba(52,91,71,0.14),transparent_55%),radial-gradient(ellipse_at_90%_80%,rgba(147,91,59,0.08),transparent_50%)]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -top-24 -right-16 size-[28rem] rounded-full bg-forest/8 blur-3xl md:size-[36rem]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-32 -left-20 size-[24rem] rounded-full bg-[#E4EBE6]/80 blur-3xl"
      />

      <div className="relative mx-auto grid max-w-352 gap-10 px-6 py-16 md:gap-14 md:px-10 md:py-20 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] lg:items-center lg:gap-16 lg:px-12 lg:py-24">
        <div className="ip-enter">
          <div className="inline-flex items-center gap-2 rounded-full border border-forest/20 bg-forest/8 px-3.5 py-1.5">
            <span className="relative flex size-2">
              <span className="absolute inset-0 animate-ping rounded-full bg-forest/50" />
              <span className="relative size-2 rounded-full bg-forest" />
            </span>
            <span className="text-[0.7rem] font-medium tracking-[0.16em] text-forest uppercase">
              Work in progress
            </span>
          </div>

          <p className="mt-8 font-display text-[0.95rem] tracking-tight text-charcoal/45 md:text-base">
            Credible
          </p>

          <h1 className="mt-3 max-w-[12ch] font-display text-[2.75rem] leading-[1.02] tracking-tight text-charcoal sm:text-[3.5rem] md:text-[4.25rem] lg:text-[4.75rem]">
            {displayTitle ? (
              <>
                {displayTitle}
                <span className="block italic text-forest">
                  — still in progress
                </span>
              </>
            ) : (
              <>
                Still{" "}
                <em className="font-display italic text-forest">in progress</em>
              </>
            )}
          </h1>

          <p className="mt-6 max-w-md text-[1.02rem] leading-relaxed text-charcoal/60 md:text-[1.1rem]">
            This page is being crafted with the same care we bring to every
            brief. Check back for the next drop.
          </p>

          <Link
            href="/"
            className="group mt-10 inline-flex items-center gap-2 bg-forest px-6 py-3.5 text-[0.875rem] font-medium text-cream transition-colors hover:bg-forest-dark"
          >
            Go to home
            <span
              aria-hidden
              className="relative inline-flex size-3.5 shrink-0 overflow-hidden"
            >
              <ArrowRight
                weight="bold"
                className="size-3.5 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-[120%]"
              />
              <ArrowRight
                weight="bold"
                className="absolute inset-0 size-3.5 -translate-x-[120%] transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-0"
              />
            </span>
          </Link>
        </div>

        <div className="ip-enter ip-enter-delay relative">
          <div className="relative overflow-hidden rounded-[1.35rem] bg-forest px-6 py-8 shadow-[0_24px_60px_rgba(42,73,57,0.28)] md:px-8 md:py-10">
            <PatternField
              color={CREAM_RGB}
              className="opacity-[0.14]"
              mask="linear-gradient(to left, black 0%, rgba(0,0,0,0.55) 40%, transparent 88%)"
            />

            <div className="relative z-2">
              <div className="flex items-center gap-2 text-cream/70">
                <Clock weight="bold" className="size-4" aria-hidden />
                <p className="text-[0.7rem] font-medium tracking-[0.16em] uppercase">
                  Update schedule
                </p>
              </div>

              <ul className="mt-8 space-y-4">
                {updates.map((update, index) => (
                  <li
                    key={update.date}
                    className={cn(
                      "rounded-[1.05rem] border px-5 py-5 transition-transform duration-500",
                      update.accent
                        ? "border-cream/25 bg-cream text-charcoal shadow-[0_12px_32px_rgba(28,26,23,0.12)]"
                        : "border-cream/15 bg-cream/5 text-cream",
                    )}
                    style={{
                      transitionTimingFunction: "cubic-bezier(0.22, 1, 0.36, 1)",
                      animationDelay: `${180 + index * 120}ms`,
                    }}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p
                          className={cn(
                            "text-[0.7rem] font-medium tracking-[0.14em] uppercase",
                            update.accent ? "text-forest" : "text-cream/50",
                          )}
                        >
                          {update.label}
                        </p>
                        <p className="mt-2 font-display text-[2rem] leading-none tracking-tight md:text-[2.35rem]">
                          {update.date}
                        </p>
                        <p
                          className={cn(
                            "mt-2 text-[0.9rem]",
                            update.accent ? "text-charcoal/60" : "text-cream/65",
                          )}
                        >
                          {update.time}
                        </p>
                      </div>
                      <span
                        className={cn(
                          "shrink-0 rounded-full px-2.5 py-1 text-[10px] font-medium tracking-[0.1em] uppercase",
                          update.accent
                            ? "bg-forest/10 text-forest"
                            : "bg-cream/10 text-cream/70",
                        )}
                      >
                        {update.status}
                      </span>
                    </div>
                  </li>
                ))}
              </ul>

              <p className="mt-7 text-[0.8125rem] leading-relaxed text-cream/55">
                Fresh sections land at 3 PM CET — stay close.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Giant watermark */}
      <p
        aria-hidden
        className="pointer-events-none absolute right-[-4%] bottom-[-6%] select-none font-display text-[18vw] leading-none tracking-tight text-charcoal/[0.035] md:text-[14vw]"
      >
        WIP
      </p>
    </section>
  );
}
