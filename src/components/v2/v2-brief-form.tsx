"use client";

import { useActionState, useId } from "react";
import { ShieldCheck } from "@phosphor-icons/react";

import { ArrowRightIcon } from "@/components/v2/v2-icons";
import { submitBrief, type FormState } from "@/lib/actions/leads";
import { useShortlist } from "@/lib/shortlist";
import { cn } from "@/lib/utils";

const initial: FormState = { ok: false, message: "" };

const fieldClass =
  "h-9 w-full rounded-[8px] border border-[var(--v2-border)] bg-[var(--v2-snow)] px-3.5 text-[14px] leading-[18px] text-[var(--v2-timberline)] outline-none placeholder:text-[var(--v2-lichen)]";

const areaClass =
  "min-h-[56px] w-full resize-none rounded-[8px] border border-[var(--v2-border)] bg-[var(--v2-snow)] px-3.5 py-2.5 text-[14px] leading-[18px] text-[var(--v2-timberline)] outline-none placeholder:text-[var(--v2-lichen)]";

function FieldLabel({
  htmlFor,
  children,
  optional = false,
}: {
  htmlFor: string;
  children: string;
  optional?: boolean;
}) {
  return (
    <label
      htmlFor={htmlFor}
      className="text-[13px] leading-4 font-medium text-[var(--v2-timberline)]"
    >
      {children}
      {optional ? (
        <span className="ml-1.5 font-normal text-[var(--v2-lichen)]">
          Optional
        </span>
      ) : null}
    </label>
  );
}

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
    <form action={action} className="flex flex-col gap-2.5">
      <div className="grid gap-x-3 gap-y-2.5 sm:grid-cols-2">
        <div className="flex flex-col gap-1">
          <FieldLabel htmlFor={`${id}-name`}>Name</FieldLabel>
          <input
            id={`${id}-name`}
            name="name"
            required
            autoComplete="name"
            placeholder="First and last"
            className={fieldClass}
          />
        </div>
        <div className="flex flex-col gap-1">
          <FieldLabel htmlFor={`${id}-email`}>Work email</FieldLabel>
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
        <div className="flex flex-col gap-1">
          <FieldLabel htmlFor={`${id}-phone`}>Phone</FieldLabel>
          <input
            id={`${id}-phone`}
            name="phone"
            type="tel"
            required
            autoComplete="tel"
            placeholder="+1 555 000 0000"
            className={fieldClass}
          />
        </div>
        <div className="flex flex-col gap-1">
          <FieldLabel htmlFor={`${id}-company`}>Company</FieldLabel>
          <input
            id={`${id}-company`}
            name="company"
            required
            autoComplete="organization"
            placeholder="Where you're briefing from"
            className={fieldClass}
          />
        </div>
      </div>

      <div className="flex flex-col gap-1">
        <FieldLabel htmlFor={`${id}-role`} optional>
          Role
        </FieldLabel>
        <input
          id={`${id}-role`}
          name="role"
          autoComplete="organization-title"
          placeholder="Head of brand, partnerships, etc."
          className={fieldClass}
        />
      </div>

      <div className="flex flex-col gap-1">
        <FieldLabel htmlFor={`${id}-brief`}>Brief</FieldLabel>
        <textarea
          id={`${id}-brief`}
          name="brief"
          required
          rows={2}
          placeholder="Audience, ambition, deadline, budget shape."
          className={areaClass}
        />
      </div>

      <div className="flex flex-col gap-1">
        <FieldLabel htmlFor={`${id}-deliverables`} optional>
          Deliverables
        </FieldLabel>
        <input
          id={`${id}-deliverables`}
          name="deliverables"
          placeholder="Keynote, series, ambassador, dinner, etc."
          className={fieldClass}
        />
      </div>

      <div className="flex flex-col gap-2 pt-0.5">
        <button
          type="submit"
          disabled={pending}
          className="inline-flex h-11 cursor-pointer items-center justify-center gap-2.5 rounded-full bg-[var(--v2-evergreen)] text-[15px] leading-5 font-medium text-[var(--v2-snow)] transition-transform active:scale-[0.98] disabled:opacity-60"
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
