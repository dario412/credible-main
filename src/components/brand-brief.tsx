"use client";

import Link from "next/link";
import { useActionState } from "react";

import { submitBrief, type FormState } from "@/lib/actions/leads";

const initial: FormState = { ok: false, message: "" };

const formats = [
  "Brand partnership",
  "Ambassador program",
  "Speaking engagement",
  "Live event",
  "Not sure yet",
] as const;

const inputClass =
  "w-full border-b border-cream/25 bg-transparent pb-2.5 pt-1 text-sm text-cream transition-colors placeholder:text-cream/35 focus:border-cream focus:outline-none";

const labelClass =
  "block text-[10px] font-medium uppercase tracking-[0.18em] text-cream/50";

export function BrandBrief() {
  const [state, action, pending] = useActionState(submitBrief, initial);

  return (
    <section className="bg-charcoal px-6 py-16 md:px-10 md:py-20 lg:px-12 lg:py-24">
      <div className="mx-auto max-w-352">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-20">
          {/* Left: pitch */}
          <div>
            <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-cream/45">
              For brands
            </p>

            <h2 className="mt-6 max-w-xl font-display text-[2.1rem] leading-[1.08] tracking-tight text-cream sm:text-[2.6rem] md:text-[3rem]">
              Reach B2B audiences through the people they{" "}
              <em className="font-display italic text-[#E4EBE6]">
                already trust.
              </em>
            </h2>

            <p className="mt-6 max-w-md text-[0.9rem] leading-relaxed text-cream/70 md:text-base">
              Whether you&apos;re an in-house team briefing direct, or an
              agency briefing us in on behalf of a client — send us the
              ambition and we&apos;ll come back with a shortlist within 48
              hours.
            </p>

            <Link
              href="/what-we-do"
              className="mt-8 inline-flex items-center border border-cream/30 px-5 py-2.5 text-[0.8125rem] font-medium text-cream transition-colors hover:border-cream hover:bg-cream hover:text-charcoal"
            >
              How we work with brands
              <span aria-hidden className="ml-2">
                →
              </span>
            </Link>
          </div>

          {/* Right: brief form */}
          <form action={action} className="space-y-7">
            <div className="grid gap-7 sm:grid-cols-2">
              <div>
                <label htmlFor="brief-name" className={labelClass}>
                  Your name
                </label>
                <input
                  id="brief-name"
                  name="name"
                  required
                  autoComplete="name"
                  placeholder="First and last"
                  className={inputClass}
                />
              </div>
              <div>
                <label htmlFor="brief-email" className={labelClass}>
                  Work email
                </label>
                <input
                  id="brief-email"
                  name="email"
                  type="email"
                  required
                  autoComplete="email"
                  placeholder="you@company.com"
                  className={inputClass}
                />
              </div>
            </div>

            <div>
              <label htmlFor="brief-company" className={labelClass}>
                Company
              </label>
              <input
                id="brief-company"
                name="company"
                autoComplete="organization"
                placeholder="Where you're briefing from"
                className={inputClass}
              />
            </div>

            <div>
              <label htmlFor="brief-format" className={labelClass}>
                What are you building?
              </label>
              <div className="relative">
                <select
                  id="brief-format"
                  name="format"
                  required
                  defaultValue=""
                  className={`${inputClass} appearance-none pr-8 invalid:text-cream/35`}
                >
                  <option value="" disabled>
                    Choose a format
                  </option>
                  {formats.map((format) => (
                    <option
                      key={format}
                      value={format}
                      className="text-charcoal"
                    >
                      {format}
                    </option>
                  ))}
                </select>
                <span
                  aria-hidden
                  className="pointer-events-none absolute right-1 top-1/2 -translate-y-1/2 text-cream/50"
                >
                  ↓
                </span>
              </div>
            </div>

            <div>
              <label htmlFor="brief-message" className={labelClass}>
                The brief (short version)
              </label>
              <textarea
                id="brief-message"
                name="brief"
                required
                rows={3}
                placeholder="Audience, ambition, deadline, budget shape."
                className={`${inputClass} resize-none`}
              />
            </div>

            <button
              type="submit"
              disabled={pending}
              className="inline-flex items-center bg-cream px-7 py-3 text-[0.8125rem] font-medium text-charcoal transition-colors hover:bg-cream-dark disabled:opacity-60"
            >
              {pending ? "Sending…" : "Send brief"}
              <span aria-hidden className="ml-2">
                →
              </span>
            </button>

            {state.message ? (
              <p
                role="status"
                className={`text-sm ${state.ok ? "text-[#E4EBE6]" : "text-red-300"}`}
              >
                {state.message}
              </p>
            ) : null}
          </form>
        </div>

        {/* Creators strip */}
        <div className="mt-14 flex flex-col gap-5 border-t border-cream/10 pt-8 md:mt-16 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-cream/45">
              For creators
            </p>
            <p className="mt-2 max-w-xl text-sm leading-relaxed text-cream/70">
              Founder, operator, investor or specialist ready to treat your
              audience as a business? Applications reviewed fortnightly.
            </p>
          </div>
          <Link
            href="/contact"
            className="inline-flex w-fit shrink-0 items-center border border-cream/30 px-5 py-2.5 text-[0.8125rem] font-medium text-cream transition-colors hover:border-cream hover:bg-cream hover:text-charcoal"
          >
            Apply
            <span aria-hidden className="ml-2">
              →
            </span>
          </Link>
        </div>
      </div>
    </section>
  );
}
