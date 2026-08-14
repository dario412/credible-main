"use client";

import { useActionState, useId } from "react";
import { CaretDown, ShieldCheck } from "@phosphor-icons/react";

import { ArrowRightIcon } from "@/components/v2/v2-icons";
import { submitBrief, type FormState } from "@/lib/actions/leads";
import { useShortlist } from "@/lib/shortlist";
import { cn } from "@/lib/utils";

const initial: FormState = { ok: false, message: "" };

const formats = [
  "Brand partnership",
  "Ambassador program",
  "Speaking engagement",
  "Live event",
  "Not sure yet",
] as const;

const fieldClass =
  "h-11 w-full rounded-[8px] border border-[var(--v2-border)] bg-[var(--v2-snow)] px-4 text-[15px] leading-[18px] text-[var(--v2-timberline)] outline-none placeholder:text-[var(--v2-lichen)]";

export function V2ShortlistHint() {
  const entries = useShortlist();
  if (entries.length === 0) return null;
  return (
    <span className="inline-flex items-center gap-2 rounded-full bg-[var(--v2-glacier)] px-3 py-1.5">
      <span className="size-1.5 rounded-full bg-[var(--v2-ember)]" />
      <span className="text-[12px] leading-4 font-medium text-[var(--v2-evergreen)]">
        {entries.length} from your shortlist attached
      </span>
    </span>
  );
}

export function V2BriefForm({ footnote }: { footnote: string }) {
  const [state, action, pending] = useActionState(submitBrief, initial);
  const id = useId();
  const shortlist = useShortlist();

  return (
    <form action={action} className="flex flex-col gap-4">
      <div className="grid gap-5 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <label
            htmlFor={`${id}-name`}
            className="text-[13px] leading-4 font-medium text-[var(--v2-timberline)]"
          >
            Your name
          </label>
          <input
            id={`${id}-name`}
            name="name"
            required
            autoComplete="name"
            placeholder="First and last"
            className={fieldClass}
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label
            htmlFor={`${id}-email`}
            className="text-[13px] leading-4 font-medium text-[var(--v2-timberline)]"
          >
            Work email
          </label>
          <input
            id={`${id}-email`}
            name="email"
            type="email"
            required
            autoComplete="email"
            placeholder="you@company.com"
            className={fieldClass}
          />
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <label
          htmlFor={`${id}-company`}
          className="text-[13px] leading-4 font-medium text-[var(--v2-timberline)]"
        >
          Company
        </label>
        <input
          id={`${id}-company`}
          name="company"
          autoComplete="organization"
          placeholder="Where you're briefing from"
          className={fieldClass}
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label
          htmlFor={`${id}-format`}
          className="text-[13px] leading-4 font-medium text-[var(--v2-timberline)]"
        >
          What are you building?
        </label>
        <div className="relative">
          <select
            id={`${id}-format`}
            name="format"
            required
            defaultValue=""
            className={cn(fieldClass, "appearance-none pr-10 invalid:text-[var(--v2-lichen)]")}
          >
            <option value="" disabled>
              Choose a format
            </option>
            {formats.map((format) => (
              <option key={format} value={format}>
                {format}
              </option>
            ))}
          </select>
          <CaretDown
            weight="bold"
            aria-hidden
            className="pointer-events-none absolute top-1/2 right-4 size-4 -translate-y-1/2 text-[var(--v2-lichen)]"
          />
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <label
          htmlFor={`${id}-brief`}
          className="text-[13px] leading-4 font-medium text-[var(--v2-timberline)]"
        >
          The brief (short version)
        </label>
        <textarea
          id={`${id}-brief`}
          name="brief"
          required
          rows={3}
          placeholder="Audience, ambition, deadline, budget shape."
          className="min-h-[84px] w-full resize-none rounded-[8px] border border-[var(--v2-border)] bg-[var(--v2-snow)] px-4 py-3.5 text-[15px] leading-[18px] text-[var(--v2-timberline)] outline-none placeholder:text-[var(--v2-lichen)]"
        />
      </div>

      <div className="flex flex-col gap-2.5 pt-0.5">
        <button
          type="submit"
          disabled={pending}
          className="inline-flex h-12 cursor-pointer items-center justify-center gap-2.5 rounded-full bg-[var(--v2-evergreen)] text-[16px] leading-5 font-medium text-[var(--v2-snow)] transition-transform active:scale-[0.98] disabled:opacity-60"
        >
          {pending ? "Sending…" : "Send brief"}
          <ArrowRightIcon className="size-[17px]" />
        </button>
        {footnote.trim() ? (
          <p className="flex items-center justify-center gap-2 text-[13px] leading-4 text-[var(--v2-lichen)]">
            <ShieldCheck className="size-[13px]" weight="regular" aria-hidden />
            {footnote}
          </p>
        ) : null}
      </div>

      {state.message ? (
        <p
          role="status"
          className={cn(
            "text-sm",
            state.ok ? "text-[var(--v2-evergreen)]" : "text-[#8b3a3a]",
          )}
        >
          {state.message}
        </p>
      ) : null}

      {shortlist.length > 0 ? (
        <p className="sr-only">
          {shortlist.length} creator{shortlist.length === 1 ? "" : "s"} from your
          shortlist will be mentioned when you follow up.
        </p>
      ) : null}
    </form>
  );
}
