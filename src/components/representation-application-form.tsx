"use client";

import Link from "next/link";
import { ArrowRight, Check } from "@phosphor-icons/react";
import { useActionState, useId } from "react";

import {
  submitRepresentationApplication,
  type FormState,
} from "@/lib/actions/leads";

const initial: FormState = { ok: false, message: "" };

const PLATFORMS = [
  "LinkedIn",
  "YouTube",
  "Podcast",
  "Newsletter",
  "X / Twitter",
  "Other",
] as const;

const FORMATS = [
  "Brand partnerships",
  "Speaking & keynotes",
  "Live events",
  "Ambassador programs",
] as const;

const inputClass =
  "w-full rounded-sm border border-charcoal/15 bg-cream px-3.5 py-2.5 text-[0.875rem] text-charcoal outline-none transition-colors placeholder:text-charcoal/35 focus:border-forest focus:outline focus:outline-2 focus:outline-offset-[-2px] focus:outline-forest";
const labelClass =
  "block text-[0.625rem] font-medium tracking-[0.14em] text-charcoal/50 uppercase";

export function RepresentationApplicationForm() {
  const [state, action, pending] = useActionState(
    submitRepresentationApplication,
    initial,
  );
  const id = useId();

  if (state.ok) {
    return (
      <div className="rounded-sm border border-charcoal/10 bg-[#FBF8F5] p-8 md:p-10">
        <span className="inline-flex size-11 items-center justify-center rounded-full bg-forest/10 text-forest">
          <Check weight="bold" className="size-5" aria-hidden />
        </span>
        <h3 className="mt-5 font-display text-[1.65rem] leading-tight tracking-tight text-charcoal md:text-[1.85rem]">
          Application received
        </h3>
        <p className="mt-3 text-[0.9375rem] leading-relaxed text-charcoal/65">
          {state.message} If your profile is a fit, a manager will reach out
          within two weeks.
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Link
            href="/roster"
            className="inline-flex items-center justify-center gap-2 rounded-sm bg-forest px-6 py-3 text-[0.875rem] font-medium text-cream transition-colors hover:bg-forest-dark"
          >
            Browse the roster
            <ArrowRight weight="bold" className="size-3.5" aria-hidden />
          </Link>
          <Link
            href="/insights"
            className="inline-flex items-center justify-center rounded-sm border border-charcoal/15 px-6 py-3 text-[0.875rem] font-medium text-charcoal transition-colors hover:border-charcoal/30"
          >
            Read field notes
          </Link>
        </div>
      </div>
    );
  }

  return (
    <form
      action={action}
      className="rounded-sm border border-charcoal/10 bg-white p-6 shadow-[0_12px_40px_rgba(28,26,23,0.06)] md:p-8 lg:p-10"
    >
      <div className="border-b border-charcoal/8 pb-6">
        <p className="text-[0.68rem] font-medium tracking-[0.16em] text-charcoal/45 uppercase">
          Your information
        </p>
        <p className="mt-1 text-[0.8125rem] text-charcoal/55">
          Fields marked * are required.
        </p>
      </div>

      <div className="mt-6 space-y-5">
        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label htmlFor={`${id}-name`} className={labelClass}>
              Full name *
            </label>
            <input
              id={`${id}-name`}
              name="name"
              required
              autoComplete="name"
              className={`${inputClass} mt-1.5`}
            />
          </div>
          <div>
            <label htmlFor={`${id}-email`} className={labelClass}>
              Email *
            </label>
            <input
              id={`${id}-email`}
              name="email"
              type="email"
              required
              autoComplete="email"
              className={`${inputClass} mt-1.5`}
            />
          </div>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label htmlFor={`${id}-platform`} className={labelClass}>
              Primary platform *
            </label>
            <select
              id={`${id}-platform`}
              name="platform"
              required
              defaultValue=""
              className={`${inputClass} mt-1.5`}
            >
              <option value="" disabled>
                Select platform
              </option>
              {PLATFORMS.map((platform) => (
                <option key={platform} value={platform}>
                  {platform}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor={`${id}-audience`} className={labelClass}>
              Audience size
            </label>
            <input
              id={`${id}-audience`}
              name="audience"
              placeholder="e.g. 45k LinkedIn followers"
              className={`${inputClass} mt-1.5`}
            />
          </div>
        </div>

        <div>
          <label htmlFor={`${id}-profile-url`} className={labelClass}>
            Profile or channel URL *
          </label>
          <input
            id={`${id}-profile-url`}
            name="profileUrl"
            type="url"
            required
            placeholder="https://"
            className={`${inputClass} mt-1.5`}
          />
        </div>

        <div>
          <label htmlFor={`${id}-location`} className={labelClass}>
            Location
          </label>
          <input
            id={`${id}-location`}
            name="location"
            placeholder="City, country / timezone"
            className={`${inputClass} mt-1.5`}
          />
        </div>

        <fieldset className="border-t border-charcoal/8 pt-6">
          <legend className={labelClass}>Formats you&apos;re open to *</legend>
          <div className="mt-3 grid gap-2 sm:grid-cols-2">
            {FORMATS.map((format) => (
              <label
                key={format}
                className="flex cursor-pointer items-center gap-2.5 rounded-sm border border-charcoal/10 px-3.5 py-2.5 text-[0.875rem] text-charcoal transition-colors has-checked:border-forest/40 has-checked:bg-forest/5"
              >
                <input
                  type="checkbox"
                  name="formats"
                  value={format}
                  className="size-4 rounded-sm border-charcoal/25 text-forest focus:ring-forest"
                />
                {format}
              </label>
            ))}
          </div>
        </fieldset>

        <div>
          <label htmlFor={`${id}-topics`} className={labelClass}>
            Topics & expertise *
          </label>
          <textarea
            id={`${id}-topics`}
            name="topics"
            required
            rows={3}
            placeholder="What do you speak and write about? Who is your audience?"
            className={`${inputClass} mt-1.5 resize-y`}
          />
        </div>

        <div>
          <label htmlFor={`${id}-pitch`} className={labelClass}>
            Why Credible? *
          </label>
          <textarea
            id={`${id}-pitch`}
            name="pitch"
            required
            rows={4}
            placeholder="What are you building with your audience — and what would commercial representation unlock?"
            className={`${inputClass} mt-1.5 resize-y`}
          />
        </div>

        <div>
          <label htmlFor={`${id}-work-links`} className={labelClass}>
            Recent work (optional)
          </label>
          <textarea
            id={`${id}-work-links`}
            name="workLinks"
            rows={2}
            placeholder="Links to talks, series, or campaigns you're proud of"
            className={`${inputClass} mt-1.5 resize-y`}
          />
        </div>
      </div>

      {state.message && !state.ok ? (
        <p className="mt-5 text-sm text-danger" role="alert">
          {state.message}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={pending}
        className="mt-8 inline-flex w-full items-center justify-center gap-2 rounded-sm bg-charcoal px-6 py-3.5 text-[0.9rem] font-medium text-cream transition-colors hover:bg-charcoal/90 disabled:opacity-60 sm:w-auto"
      >
        {pending ? "Submitting…" : "Submit application"}
        <ArrowRight weight="bold" className="size-3.5" aria-hidden />
      </button>

      <p className="mt-4 text-[0.75rem] leading-relaxed text-charcoal/45">
        By submitting, you agree we may contact you about representation. We
        don&apos;t share your details with brands without consent.
      </p>
    </form>
  );
}
