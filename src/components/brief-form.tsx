"use client";

import { ArrowRight } from "@phosphor-icons/react/ssr";
import { useActionState, useEffect, useId, useMemo, useRef, useState } from "react";

import {
  getPeptalkContext,
  getPeptalkTracking,
} from "@/components/peptalk-tracking";
import { RosterCreatorMultiSelect } from "@/components/roster-creator-multi-select";
import { submitBrief, type FormState } from "@/lib/actions/leads";
import type { RosterFormOption } from "@/lib/roster-form-options";
import { useShortlist } from "@/lib/shortlist";
import { cn } from "@/lib/utils";

const initial: FormState = { ok: false, message: "" };

function ArrowIcon({ className }: { className?: string }) {
  return <ArrowRight weight="bold" aria-hidden className={className} />;
}

export function BriefForm({
  surface = "dark",
  formFootnote,
  omitFootnote = false,
  fillHeight = false,
  spacious = false,
  rosterOptions = [],
  initialCreatorSlugs = [],
  prefillShortlist = false,
}: {
  surface?: "dark" | "light";
  formFootnote?: string;
  omitFootnote?: boolean;
  fillHeight?: boolean;
  /** Extra room between fields — used on /contact. */
  spacious?: boolean;
  rosterOptions?: RosterFormOption[];
  initialCreatorSlugs?: string[];
  /** When true, merge the visitor's shortlist into the initial creator selection. */
  prefillShortlist?: boolean;
}) {
  const [state, action, pending] = useActionState(submitBrief, initial);
  const shortlist = useShortlist();
  const [selectedCreatorSlugs, setSelectedCreatorSlugs] = useState<string[]>(
    [],
  );
  const [prefillReady, setPrefillReady] = useState(false);
  const light = surface === "light";
  const id = useId();
  const trackingRef = useRef<HTMLInputElement>(null);
  const contextRef = useRef<HTMLInputElement>(null);

  const prefillSlugs = useMemo(() => {
    const shortlistSlugs = prefillShortlist
      ? shortlist.map((entry) => entry.slug)
      : [];
    return [...new Set([...initialCreatorSlugs, ...shortlistSlugs])].filter(
      (slug) => rosterOptions.some((option) => option.slug === slug),
    );
  }, [initialCreatorSlugs, prefillShortlist, rosterOptions, shortlist]);

  useEffect(() => {
    if (prefillReady || prefillSlugs.length === 0) return;
    setSelectedCreatorSlugs(prefillSlugs);
    setPrefillReady(true);
  }, [prefillReady, prefillSlugs]);

  function stampPeptalkFields() {
    if (trackingRef.current) {
      trackingRef.current.value = JSON.stringify(getPeptalkTracking());
    }
    if (contextRef.current) {
      contextRef.current.value = JSON.stringify(getPeptalkContext());
    }
  }

  const fieldShell = light
    ? "w-full rounded-sm border border-forest/40 bg-white px-3.5 text-[0.9375rem] text-charcoal outline-none transition-colors placeholder:text-charcoal/45 focus:border-forest focus:outline focus:outline-2 focus:outline-offset-[-2px] focus:outline-forest"
    : "w-full rounded-sm border border-cream/25 bg-cream/5 px-3.5 text-[0.9375rem] text-cream outline-none transition-colors placeholder:text-cream/35 focus:border-cream focus:outline focus:outline-2 focus:outline-offset-[-2px] focus:outline-cream";
  const inputClass = cn(
    fieldShell,
    spacious ? "h-12 leading-none" : "h-11 leading-none",
  );
  const textareaClass = cn(
    fieldShell,
    spacious
      ? "min-h-28 resize-y py-3.5 leading-relaxed"
      : "min-h-24 resize-y py-3 leading-relaxed",
  );

  const labelClass = light
    ? "block text-[0.8125rem] font-medium leading-none text-charcoal"
    : "block text-[0.8125rem] font-medium leading-none text-cream/75";

  const optionalClass = light ? "text-charcoal/40" : "text-cream/45";
  const fieldClass = spacious ? "space-y-2.5" : "space-y-2";

  return (
    <form
      action={action}
      onSubmit={stampPeptalkFields}
      className={cn(
        fillHeight && "flex h-full flex-col",
        spacious ? "space-y-6" : "space-y-5",
      )}
    >
      <input
        ref={trackingRef}
        type="hidden"
        name="peptalkTracking"
        defaultValue="{}"
      />
      <input
        ref={contextRef}
        type="hidden"
        name="peptalkContext"
        defaultValue="{}"
      />
      <div className={cn("grid sm:grid-cols-2", spacious ? "gap-5" : "gap-4", fillHeight && "flex-1")}>
        <div className={fieldClass}>
          <label htmlFor={`${id}-name`} className={labelClass}>
            Name
          </label>
          <input
            id={`${id}-name`}
            name="name"
            required
            autoComplete="name"
            placeholder="First and last"
            className={inputClass}
          />
        </div>
        <div className={fieldClass}>
          <label htmlFor={`${id}-email`} className={labelClass}>
            Work Email
          </label>
          <input
            id={`${id}-email`}
            name="email"
            type="email"
            required
            autoComplete="email"
            placeholder="you@company.com"
            className={inputClass}
          />
        </div>
        <div className={fieldClass}>
          <label htmlFor={`${id}-phone`} className={labelClass}>
            Phone
          </label>
          <input
            id={`${id}-phone`}
            name="phone"
            type="tel"
            required
            autoComplete="tel"
            placeholder="+1 555 000 0000"
            className={inputClass}
          />
        </div>
        <div className={fieldClass}>
          <label htmlFor={`${id}-company`} className={labelClass}>
            Company
          </label>
          <input
            id={`${id}-company`}
            name="company"
            required
            autoComplete="organization"
            placeholder="Where you're briefing from"
            className={inputClass}
          />
        </div>
        <div className={cn(fieldClass, "sm:col-span-2")}>
          <label htmlFor={`${id}-role`} className={labelClass}>
            Role{" "}
            <span className={cn("font-normal", optionalClass)}>(Optional)</span>
          </label>
          <input
            id={`${id}-role`}
            name="role"
            autoComplete="organization-title"
            placeholder="Creator Partnerships Manager"
            className={inputClass}
          />
        </div>
        {rosterOptions.length > 0 ? (
          <div className={cn(fieldClass, "sm:col-span-2")}>
            <label htmlFor={`${id}-creators`} className={labelClass}>
              Creators you&apos;re interested in{" "}
              <span className={cn("font-normal", optionalClass)}>
                (Optional)
              </span>
            </label>
            <RosterCreatorMultiSelect
              id={`${id}-creators`}
              options={rosterOptions}
              selectedSlugs={selectedCreatorSlugs}
              onSelectedChange={setSelectedCreatorSlugs}
              surface={surface}
              spacious={spacious}
            />
          </div>
        ) : null}
        <div className={cn(fieldClass, "sm:col-span-2")}>
          <label htmlFor={`${id}-message`} className={labelClass}>
            Brief
          </label>
          <textarea
            id={`${id}-message`}
            name="brief"
            required
            rows={spacious ? 4 : 3}
            placeholder="Audience, ambition, deadline, budget shape."
            className={textareaClass}
          />
        </div>
        <div className={cn(fieldClass, "sm:col-span-2")}>
          <label htmlFor={`${id}-deliverables`} className={labelClass}>
            Deliverables{" "}
            <span className={cn("font-normal", optionalClass)}>(Optional)</span>
          </label>
          <textarea
            id={`${id}-deliverables`}
            name="deliverables"
            rows={spacious ? 4 : 3}
            placeholder="What you need delivered, and by when."
            className={textareaClass}
          />
        </div>
      </div>

      <div className={cn(fillHeight ? "mt-auto" : undefined, spacious ? "pt-2" : "pt-1")}>
        <button
          type="submit"
          disabled={pending}
          className={cn(
            "inline-flex w-full items-center justify-center gap-2 rounded-sm border px-6 font-medium transition-colors disabled:opacity-60",
            spacious ? "py-4 text-base" : "py-3.5 text-[0.9375rem]",
            light
              ? "border-forest bg-forest text-cream hover:border-forest-dark hover:bg-forest-dark"
              : "border-cream bg-cream text-charcoal hover:bg-cream-dark",
          )}
        >
          {pending ? "Sending…" : "Send brief"}
          <ArrowIcon className="size-3.5 shrink-0" />
        </button>
        {light && !omitFootnote && formFootnote?.trim() ? (
          <p className="mt-4 text-center text-[0.8125rem] leading-snug text-charcoal/45">
            {formFootnote}
          </p>
        ) : null}
      </div>

      {state.message ? (
        <p
          role="status"
          className={cn(
            "text-sm",
            state.ok
              ? light
                ? "text-forest"
                : "text-[#E4EBE6]"
              : "text-danger",
          )}
        >
          {state.message}
        </p>
      ) : null}
    </form>
  );
}
