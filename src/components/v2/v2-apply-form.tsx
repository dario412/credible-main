"use client";

import Link from "next/link";
import { useActionState, useId, useState } from "react";

import {
  submitRepresentationApplication,
  type FormState,
} from "@/lib/actions/leads";
import { V2_HOME } from "@/lib/v2-links";
import { cn } from "@/lib/utils";

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
  "Speaking & keynotes",
  "Brand partnerships",
  "Live events",
  "Ambassador programs",
] as const;

const fieldClass =
  "h-[54px] w-full rounded-[8px] border border-[var(--v2-border)] bg-[var(--v2-snow)] px-4 text-[15px] leading-[18px] text-[var(--v2-timberline)] outline-none placeholder:text-[var(--v2-lichen)]";

export function V2ApplyForm() {
  const [state, action, pending] = useActionState(
    submitRepresentationApplication,
    initial,
  );
  const id = useId();
  const [formats, setFormats] = useState<string[]>(["Speaking & keynotes"]);

  if (state.ok) {
    return (
      <div className="rounded-[16px] border border-[var(--v2-rule-light)] bg-[var(--v2-snow)] p-10 shadow-[0_1px_2px_rgba(14,26,20,0.06),0_16px_40px_rgba(14,26,20,0.08)]">
        <p className="v2-display text-[32px] leading-10 text-[var(--v2-timberline)]">
          Application received
        </p>
        <p className="mt-3 text-[15px] leading-6 text-[var(--v2-lichen)]">
          {state.message} If your profile is a fit, a manager will reach out
          within two weeks.
        </p>
        <Link
          href={V2_HOME}
          className="mt-8 inline-flex h-14 items-center rounded-full bg-[var(--v2-evergreen)] px-[34px] text-[16px] font-medium text-[var(--v2-snow)]"
        >
          Back to homepage
        </Link>
      </div>
    );
  }

  return (
    <form
      action={action}
      className="overflow-hidden rounded-[16px] border border-[var(--v2-rule-light)] bg-[var(--v2-snow)] shadow-[0_1px_2px_rgba(14,26,20,0.06),0_16px_40px_rgba(14,26,20,0.08)]"
    >
      <div className="flex flex-col justify-between gap-6 border-b border-[var(--v2-rule-light)] px-10 py-8 md:flex-row md:items-end">
        <div>
          <p className="text-[13px] leading-[18px] font-semibold tracking-[0.08em] text-[var(--v2-ember)] uppercase">
            Start application
          </p>
          <h2 className="v2-display mt-3 text-[clamp(2rem,3vw,3.5rem)] leading-[1.07] text-[var(--v2-timberline)]">
            Tell us about your audience.
          </h2>
        </div>
        <p className="max-w-[230px] text-[14px] leading-[22px] text-[var(--v2-lichen)]">
          Fields are grouped to feel lighter and make the first step obvious.
        </p>
      </div>

      <div className="grid grid-cols-3 border-b border-[var(--v2-rule-light)] text-[13px] leading-[18px]">
        <p className="bg-[var(--v2-glacier)] px-6 py-[18px] font-semibold text-[var(--v2-evergreen-deep)]">
          01 Profile
        </p>
        <p className="border-l border-[var(--v2-rule-light)] px-6 py-[18px] text-[var(--v2-lichen)]">
          02 Audience
        </p>
        <p className="border-l border-[var(--v2-rule-light)] px-6 py-[18px] text-[var(--v2-lichen)]">
          03 Fit
        </p>
      </div>

      <div className="grid gap-[18px] px-10 pt-8 pb-10 sm:grid-cols-2">
        <label className="flex flex-col gap-2">
          <span className="text-[13px] leading-[18px] text-[var(--v2-lichen)]">
            Full name *
          </span>
          <input
            id={`${id}-name`}
            name="name"
            required
            autoComplete="name"
            placeholder="Your name"
            className={fieldClass}
          />
        </label>
        <label className="flex flex-col gap-2">
          <span className="text-[13px] leading-[18px] text-[var(--v2-lichen)]">
            Email *
          </span>
          <input
            id={`${id}-email`}
            name="email"
            type="email"
            required
            autoComplete="email"
            placeholder="you@company.com"
            className={fieldClass}
          />
        </label>
        <label className="flex flex-col gap-2">
          <span className="text-[13px] leading-[18px] text-[var(--v2-lichen)]">
            Primary platform *
          </span>
          <select
            id={`${id}-platform`}
            name="platform"
            required
            defaultValue=""
            className={fieldClass}
          >
            <option value="" disabled>
              LinkedIn, newsletter, podcast…
            </option>
            {PLATFORMS.map((platform) => (
              <option key={platform} value={platform}>
                {platform}
              </option>
            ))}
          </select>
        </label>
        <label className="flex flex-col gap-2">
          <span className="text-[13px] leading-[18px] text-[var(--v2-lichen)]">
            Audience size
          </span>
          <input
            name="audience"
            placeholder="e.g. 45k LinkedIn followers"
            className={fieldClass}
          />
        </label>
        <label className="col-span-full flex flex-col gap-2">
          <span className="text-[13px] leading-[18px] text-[var(--v2-lichen)]">
            Profile or channel URL *
          </span>
          <input
            name="profileUrl"
            type="url"
            required
            placeholder="https://"
            className={fieldClass}
          />
        </label>
        <div className="col-span-full flex flex-col gap-2.5">
          <span className="text-[13px] leading-[18px] text-[var(--v2-lichen)]">
            Formats you are open to *
          </span>
          <div className="flex flex-wrap gap-2.5">
            {FORMATS.map((format) => {
              const selected = formats.includes(format);
              return (
                <button
                  key={format}
                  type="button"
                  onClick={() =>
                    setFormats((current) =>
                      current.includes(format)
                        ? current.filter((item) => item !== format)
                        : [...current, format],
                    )
                  }
                  className={cn(
                    "rounded-full px-3.5 py-2.5 text-[13px] leading-[18px]",
                    selected
                      ? "bg-[var(--v2-evergreen)] text-[var(--v2-snow)]"
                      : "bg-[var(--v2-glacier)] text-[var(--v2-evergreen-deep)]",
                  )}
                >
                  {format.replace("Speaking & keynotes", "Speaking")}
                </button>
              );
            })}
          </div>
          {formats.map((format) => (
            <input key={format} type="hidden" name="formats" value={format} />
          ))}
        </div>
        <label className="col-span-full flex flex-col gap-2">
          <span className="text-[13px] leading-[18px] text-[var(--v2-lichen)]">
            Topics & expertise *
          </span>
          <textarea
            name="topics"
            required
            rows={4}
            placeholder="What do you speak and write about? Who is your audience?"
            className="min-h-[120px] w-full resize-none rounded-[8px] border border-[var(--v2-border)] bg-[var(--v2-snow)] p-4 text-[15px] leading-6 text-[var(--v2-timberline)] outline-none placeholder:text-[var(--v2-lichen)]"
          />
        </label>
        <input
          type="hidden"
          name="pitch"
          value="See topics and expertise in this application."
        />
        <div className="col-span-full mt-2 flex flex-col items-start justify-between gap-5 sm:flex-row sm:items-center">
          <p className="max-w-[430px] text-[13px] leading-5 text-[var(--v2-lichen)]">
            We do not share your details with brands without consent.
          </p>
          <button
            type="submit"
            disabled={pending || formats.length === 0}
            className="inline-flex h-14 cursor-pointer items-center rounded-full bg-[var(--v2-evergreen)] px-[34px] text-[16px] leading-5 font-medium text-[var(--v2-snow)] disabled:opacity-60"
          >
            {pending ? "Sending…" : "Continue application"}
          </button>
        </div>
        {state.message ? (
          <p className="col-span-full text-sm text-[#8b3a3a]">{state.message}</p>
        ) : null}
      </div>
    </form>
  );
}
