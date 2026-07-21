"use client";

import Image from "next/image";
import Link from "next/link";
import { useActionState } from "react";
import { ArrowRight } from "@phosphor-icons/react";

import { PatternField } from "@/components/pattern-field";
import { submitWaitlist, type FormState } from "@/lib/actions/leads";

const initial: FormState = { ok: false, message: "" };

const CREAM_RGB = { r: 249, g: 243, b: 239 };

const ROSTER_FACES = [
  { src: "/images/experts/amara-chen.jpg", alt: "Amara Chen" },
  { src: "/images/experts/daniel-park.jpg", alt: "Daniel Park" },
  { src: "/images/experts/lena-weiss.jpg", alt: "Lena Weiss" },
  { src: "/images/experts/james-okafor.jpg", alt: "James Okafor" },
] as const;

export function InsightsPromo() {
  const [state, action, pending] = useActionState(submitWaitlist, initial);

  return (
    <div className="mt-10 grid gap-4 md:mt-12 md:grid-cols-2 md:gap-5">
      <div className="relative flex flex-col justify-between overflow-hidden rounded-sm bg-forest px-6 py-6 shadow-[0_10px_28px_rgba(28,26,23,0.08)] md:px-8 md:py-7 lg:px-9">
        <PatternField
          color={CREAM_RGB}
          className="opacity-[0.12]"
          mask="linear-gradient(to left, black 0%, rgba(0,0,0,0.55) 35%, rgba(0,0,0,0.12) 65%, transparent 85%)"
        />

        <div className="relative z-2">
          <h2 className="max-w-[18ch] font-display text-[1.45rem] leading-[1.12] tracking-tight text-cream sm:text-[1.6rem] md:text-[1.75rem]">
            Get the monthly briefing
          </h2>
          <p className="mt-2 max-w-sm text-[0.85rem] leading-relaxed text-cream/70">
            Field notes on B2B creators, buyer research, and the formats that
            actually move pipeline.
          </p>
        </div>

        <form action={action} className="relative z-2 mt-5">
          <div className="rounded-sm bg-cream p-1.5 sm:p-2">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-stretch sm:gap-2">
              <label htmlFor="insights-newsletter-email" className="sr-only">
                Email
              </label>
              <input
                id="insights-newsletter-email"
                name="email"
                type="email"
                required
                placeholder="Work email"
                className="min-h-11 w-full flex-1 rounded-sm border border-transparent bg-transparent px-3.5 text-[0.9rem] text-charcoal outline-none placeholder:text-charcoal/45 focus-visible:border-forest/30 focus-visible:outline-none sm:px-4"
              />
              <button
                type="submit"
                disabled={pending}
                className="min-h-11 shrink-0 cursor-pointer rounded-sm bg-rust px-5 text-[0.8125rem] font-medium text-cream transition-colors hover:bg-rust-dark disabled:opacity-70 sm:px-6"
              >
                {pending ? "Joining…" : "Subscribe"}
              </button>
            </div>
          </div>
          {state.message ? (
            <p
              role="status"
              className={`mt-2.5 text-sm ${state.ok ? "text-[#E4EBE6]" : "text-red-200"}`}
            >
              {state.message}
            </p>
          ) : null}
        </form>
      </div>

      <Link
        href="/roster"
        className="group relative flex cursor-pointer overflow-hidden rounded-sm bg-[#FBF8F5] shadow-[0_10px_28px_rgba(28,26,23,0.05)] transition-shadow duration-300 hover:shadow-[0_16px_36px_rgba(28,26,23,0.08)]"
      >
        <div className="relative z-2 flex flex-1 flex-col justify-between px-5 py-6 md:px-7 md:py-7 lg:max-w-[58%] lg:px-8">
          <div>
            <h2 className="max-w-[16ch] font-display text-[1.45rem] leading-[1.12] tracking-tight text-charcoal transition-colors group-hover:text-forest sm:text-[1.6rem] md:text-[1.75rem]">
              Browse our roster of creators
            </h2>
            <p className="mt-2 max-w-xs text-[0.85rem] leading-relaxed text-charcoal/60">
              Expert operators ready to brief — filter by topic, format, and
              archetype.
            </p>
          </div>

          <span className="mt-5 inline-flex items-center gap-1.5 text-[0.8125rem] font-medium text-charcoal transition-colors duration-300 group-hover:text-forest">
            Explore the roster
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
          </span>
        </div>

        <div
          aria-hidden
          className="pointer-events-none absolute inset-y-0 right-0 hidden w-[48%] items-center justify-end pr-4 sm:flex md:pr-5"
        >
          <div className="relative h-36 w-full max-w-[190px] transition-transform duration-500 ease-out group-hover:translate-x-1">
            {ROSTER_FACES.map((face, index) => (
              <div
                key={face.src}
                className="absolute overflow-hidden rounded-sm border border-cream/80 bg-[#E4EBE6] shadow-[0_12px_28px_rgba(28,26,23,0.12)]"
                style={{
                  width: "6.1rem",
                  height: "7.75rem",
                  right: `${index}rem`,
                  top: `${index * 0.7}rem`,
                  zIndex: index + 1,
                  transform: `rotate(${(index - 1.5) * 3.5}deg)`,
                }}
              >
                <Image
                  src={face.src}
                  alt=""
                  fill
                  sizes="98px"
                  className="object-cover"
                />
              </div>
            ))}
          </div>
        </div>
      </Link>
    </div>
  );
}
