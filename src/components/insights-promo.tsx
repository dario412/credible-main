"use client";

import Link from "next/link";
import { useActionState } from "react";
import { ArrowRight } from "@phosphor-icons/react";

import { PatternField } from "@/components/pattern-field";
import { useSiteChrome } from "@/components/site-chrome-context";
import { submitWaitlist, type FormState } from "@/lib/actions/leads";

const initial: FormState = { ok: false, message: "" };
const CREAM_RGB = { r: 249, g: 243, b: 239 };

export function InsightsPromo() {
  const [state, action, pending] = useActionState(submitWaitlist, initial);
  const { chrome } = useSiteChrome();
  const newsletter = chrome.insightsPromo.newsletter;
  const roster = chrome.insightsPromo.roster;

  const showNewsletter = Boolean(
    newsletter.eyebrow.trim() ||
      newsletter.headline.trim() ||
      newsletter.description.trim(),
  );
  const showRoster = Boolean(
    roster.eyebrow.trim() ||
      roster.headline.trim() ||
      roster.description.trim() ||
      roster.ctaLabel.trim(),
  );

  if (!showNewsletter && !showRoster) return null;

  return (
    <div className="mt-10 grid gap-4 md:mt-12 md:grid-cols-2 md:gap-5">
      {showNewsletter ? (
        <div className="relative flex flex-col justify-between overflow-hidden rounded-sm bg-cream-dark px-6 py-7 md:px-8 md:py-8">
          <div>
            {newsletter.eyebrow.trim() ? (
              <p className="text-[0.65rem] font-medium tracking-[0.16em] text-charcoal/45 uppercase">
                {newsletter.eyebrow}
              </p>
            ) : null}
            {newsletter.headline.trim() ? (
              <h2 className="mt-3 max-w-[18ch] font-display text-[1.55rem] leading-[1.1] tracking-tight text-charcoal sm:text-[1.7rem] md:text-[1.85rem]">
                {newsletter.headline}
              </h2>
            ) : null}
            {newsletter.description.trim() ? (
              <p className="mt-3 max-w-sm text-[0.9rem] leading-relaxed text-charcoal/65">
                {newsletter.description}
              </p>
            ) : null}
          </div>

          <form action={action} className="mt-6">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-stretch">
              <label htmlFor="insights-newsletter-email" className="sr-only">
                Email
              </label>
              <input
                id="insights-newsletter-email"
                name="email"
                type="email"
                required
                placeholder={newsletter.emailPlaceholder || "Work email"}
                className="min-h-11 w-full flex-1 rounded-sm border border-forest bg-[#FBF8F5] px-3.5 text-[0.9rem] text-charcoal outline-none placeholder:text-charcoal/40 focus:outline focus:outline-2 focus:outline-offset-[-2px] focus:outline-forest"
              />
              <button
                type="submit"
                disabled={pending}
                className="min-h-11 shrink-0 cursor-pointer rounded-sm bg-forest px-5 text-[0.8125rem] font-medium text-cream transition-colors hover:bg-forest-dark disabled:opacity-70 sm:px-6"
              >
                {pending
                  ? "Joining…"
                  : newsletter.buttonLabel.trim() || "Subscribe"}
              </button>
            </div>
            {state.message ? (
              <p
                role="status"
                className={`mt-2.5 text-sm ${state.ok ? "text-forest" : "text-danger"}`}
              >
                {state.message}
              </p>
            ) : null}
          </form>
        </div>
      ) : null}

      {showRoster ? (
        <Link
          href={roster.ctaHref.trim() || "/roster"}
          className="group relative flex min-h-[13.75rem] cursor-pointer overflow-hidden rounded-sm bg-forest px-6 py-7 transition-colors hover:bg-forest-dark md:px-8 md:py-8"
        >
          <PatternField
            color={CREAM_RGB}
            className="opacity-[0.12]"
            mask="linear-gradient(to left, black 0%, rgba(0,0,0,0.45) 40%, transparent 85%)"
          />

          <div className="relative z-2 flex flex-1 flex-col justify-between">
            <div>
              {roster.eyebrow.trim() ? (
                <p className="text-[0.65rem] font-medium tracking-[0.16em] text-cream/55 uppercase">
                  {roster.eyebrow}
                </p>
              ) : null}
              {roster.headline.trim() ? (
                <h2 className="mt-3 max-w-[16ch] font-display text-[1.55rem] leading-[1.1] tracking-tight text-cream sm:text-[1.7rem] md:text-[1.85rem]">
                  {roster.headline}
                </h2>
              ) : null}
              {roster.description.trim() ? (
                <p className="mt-3 max-w-sm text-[0.9rem] leading-relaxed text-cream/70">
                  {roster.description}
                </p>
              ) : null}
            </div>

            {roster.ctaLabel.trim() ? (
              <span className="mt-6 inline-flex items-center gap-1.5 text-[0.875rem] font-medium text-cream">
                {roster.ctaLabel}
                <ArrowRight
                  weight="bold"
                  className="size-3.5 transition-transform duration-300 group-hover:translate-x-0.5"
                  aria-hidden
                />
              </span>
            ) : null}
          </div>
        </Link>
      ) : null}
    </div>
  );
}
