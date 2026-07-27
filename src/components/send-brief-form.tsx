"use client";

import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  CaretDown,
  Check,
  MagnifyingGlass,
  Plus,
  X,
} from "@phosphor-icons/react";
import { useActionState, useEffect, useId, useMemo, useState } from "react";

import { submitSendBrief, type FormState } from "@/lib/actions/leads";
import { clearShortlist, useShortlist } from "@/lib/shortlist";
import { cn } from "@/lib/utils";

export type BriefCreator = {
  slug: string;
  name: string;
  image?: string | null;
  role?: string | null;
};

export type BriefAudience = "brand" | "agency" | "creator";

const initial: FormState = { ok: false, message: "" };

const AUDIENCES: { id: BriefAudience; label: string; hint: string }[] = [
  { id: "brand", label: "Brand", hint: "Briefing for your own company" },
  { id: "agency", label: "Agency", hint: "Briefing on behalf of a client" },
  { id: "creator", label: "Creator", hint: "Applying for representation" },
];

const FORMATS = [
  "Keynote",
  "Fireside / panel",
  "Podcast",
  "Content series",
  "Newsletter",
  "Ambassadorship",
  "Live event",
  "Not sure yet",
] as const;

const TIMINGS = [
  "Within 4 weeks",
  "1–3 months",
  "3–6 months",
  "Just exploring",
] as const;

const BUDGETS = [
  "Under $25k",
  "$25k–$50k",
  "$50k–$100k",
  "$100k+",
  "Not set yet",
] as const;

/** Mirrors the forest-bordered inputs used by the waitlist and brand brief. */
const inputClass =
  "w-full rounded-sm border border-forest/30 bg-cream px-3.5 py-2.5 text-[0.875rem] text-charcoal outline-none transition-colors placeholder:text-charcoal/35 focus:border-forest focus:outline focus:outline-2 focus:outline-offset-[-2px] focus:outline-forest";
const labelClass =
  "block text-[0.625rem] font-medium tracking-[0.14em] text-charcoal/50 uppercase";

function SectionLabel({
  step,
  children,
}: {
  step: string;
  children: React.ReactNode;
}) {
  return (
    <p className="flex items-baseline gap-2.5">
      <span className="font-display text-[0.875rem] leading-none tracking-tight text-forest">
        {step}
      </span>
      <span className="text-[0.6875rem] font-medium tracking-[0.16em] text-charcoal/45 uppercase">
        {children}
      </span>
    </p>
  );
}

export function SendBriefForm({
  preselected,
  roster,
  initialAudience = "brand",
}: {
  preselected: BriefCreator[];
  roster: BriefCreator[];
  initialAudience?: BriefAudience;
}) {
  const [state, action, pending] = useActionState(submitSendBrief, initial);
  const shortlist = useShortlist();
  const id = useId();

  const [audience, setAudience] = useState<BriefAudience>(initialAudience);
  const [selected, setSelected] = useState<BriefCreator[]>(preselected);
  const [formats, setFormats] = useState<string[]>([]);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [pickerQuery, setPickerQuery] = useState("");

  // Landing here without creators in the URL still picks up the basket.
  useEffect(() => {
    if (preselected.length > 0 || shortlist.length === 0) return;
    setSelected((current) => {
      if (current.length > 0) return current;
      return shortlist.flatMap((entry) => {
        const match = roster.find((creator) => creator.slug === entry.slug);
        return match ? [match] : [];
      });
    });
    // Seeded once from whatever the basket held on arrival.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shortlist.length]);

  useEffect(() => {
    if (state.ok) clearShortlist();
  }, [state.ok]);

  const briefingTalent = audience !== "creator";

  const pickerResults = useMemo(() => {
    const query = pickerQuery.trim().toLowerCase();
    return roster.filter((creator) => {
      if (!query) return true;
      return (
        creator.name.toLowerCase().includes(query) ||
        (creator.role ?? "").toLowerCase().includes(query)
      );
    });
  }, [roster, pickerQuery]);

  function toggleCreator(creator: BriefCreator) {
    setSelected((current) =>
      current.some((item) => item.slug === creator.slug)
        ? current.filter((item) => item.slug !== creator.slug)
        : [...current, creator],
    );
  }

  function toggleFormat(format: string) {
    setFormats((current) =>
      current.includes(format)
        ? current.filter((item) => item !== format)
        : [...current, format],
    );
  }

  if (state.ok) {
    return (
      <div className="rounded-sm border border-charcoal/8 bg-[#FBF8F5] p-6 shadow-[0_10px_28px_rgba(28,26,23,0.06)] md:p-8">
        <span className="inline-flex size-10 items-center justify-center rounded-full bg-forest/10 text-forest">
          <Check weight="bold" className="size-5" aria-hidden />
        </span>

        <h2 className="mt-5 font-display text-[1.6rem] leading-tight tracking-tight text-charcoal md:text-[1.85rem]">
          Brief received.
        </h2>
        <p className="mt-3 text-[0.9rem] leading-relaxed text-charcoal/65">
          {state.message} Watch for a same-day acknowledgement from a real
          person — not an autoresponder.
        </p>

        <div className="mt-7 flex flex-col gap-3 sm:flex-row">
          <Link
            href="/roster"
            className="group inline-flex items-center justify-center gap-2 rounded-sm bg-forest px-5 py-3 text-[0.8125rem] font-medium text-cream transition-colors hover:bg-forest-dark"
          >
            Keep browsing the roster
            <ArrowRight
              weight="bold"
              aria-hidden
              className="size-3.5 transition-transform duration-300 group-hover:translate-x-0.5"
            />
          </Link>
          <Link
            href="/case-studies"
            className="inline-flex items-center justify-center rounded-sm border border-charcoal/20 px-5 py-3 text-[0.8125rem] font-medium text-charcoal transition-colors hover:border-charcoal"
          >
            See work that ran
          </Link>
        </div>
      </div>
    );
  }

  return (
    <form
      action={action}
      className="rounded-sm border border-charcoal/8 bg-[#FBF8F5] p-5 shadow-[0_10px_28px_rgba(28,26,23,0.06)] sm:p-6 md:p-8"
    >
      <input type="hidden" name="audience" value={audience} />
      <input
        type="hidden"
        name="creators"
        value={selected
          .map((creator) => `${creator.name} (${creator.slug})`)
          .join(", ")}
      />
      <input type="hidden" name="formats" value={formats.join(", ")} />

      {/* Who's briefing — keeps one form serving brands, agencies and creators. */}
      <fieldset>
        <legend className="sr-only">I&apos;m briefing as</legend>
        <SectionLabel step="01">I&apos;m briefing as</SectionLabel>
        <div className="mt-3.5 grid gap-2 sm:grid-cols-3">
          {AUDIENCES.map((option) => {
            const active = audience === option.id;
            return (
              <button
                key={option.id}
                type="button"
                onClick={() => setAudience(option.id)}
                aria-pressed={active}
                className={cn(
                  "cursor-pointer rounded-sm border px-3.5 py-3 text-left transition-colors",
                  active
                    ? "border-forest bg-forest/8"
                    : "border-forest/20 bg-cream hover:border-forest/45",
                )}
              >
                <span
                  className={cn(
                    "block font-display text-[1.0625rem] leading-none tracking-tight",
                    active ? "text-forest" : "text-charcoal",
                  )}
                >
                  {option.label}
                </span>
                <span className="mt-1.5 block text-[0.6875rem] leading-snug text-charcoal/50">
                  {option.hint}
                </span>
              </button>
            );
          })}
        </div>
      </fieldset>

      {briefingTalent ? (
        <div className="mt-7 border-t border-charcoal/8 pt-6">
          <div className="flex items-center justify-between gap-3">
            <SectionLabel step="02">Creators</SectionLabel>
            <span className="text-[0.6875rem] text-charcoal/45">
              {selected.length > 0
                ? `${selected.length} selected`
                : "Optional — we can recommend"}
            </span>
          </div>

          {selected.length > 0 ? (
            <ul className="mt-3.5 flex flex-wrap gap-2">
              {selected.map((creator) => (
                <li key={creator.slug}>
                  <span className="inline-flex items-center gap-2 rounded-sm border border-forest/25 bg-forest/6 py-1 pr-1 pl-1.5 text-[0.8125rem] font-medium text-charcoal">
                    <span className="relative size-6 shrink-0 overflow-hidden rounded-xs bg-[#E4EBE6]">
                      {creator.image ? (
                        <Image
                          src={creator.image}
                          alt=""
                          fill
                          sizes="24px"
                          className="object-cover object-top"
                        />
                      ) : null}
                    </span>
                    {creator.name}
                    <button
                      type="button"
                      onClick={() => toggleCreator(creator)}
                      aria-label={`Remove ${creator.name}`}
                      className="cursor-pointer p-1 text-charcoal/35 transition-colors hover:text-charcoal"
                    >
                      <X weight="bold" className="size-3" aria-hidden />
                    </button>
                  </span>
                </li>
              ))}
            </ul>
          ) : null}

          <button
            type="button"
            onClick={() => setPickerOpen((current) => !current)}
            aria-expanded={pickerOpen}
            className="mt-2.5 inline-flex cursor-pointer items-center gap-1.5 text-[0.75rem] font-medium text-forest transition-colors hover:text-forest-dark"
          >
            <Plus weight="bold" className="size-3" aria-hidden />
            {selected.length > 0 ? "Add more creators" : "Add creators"}
          </button>

          {pickerOpen ? (
            <div className="mt-3 overflow-hidden rounded-sm border border-forest/25 bg-cream">
              <div className="flex items-center gap-2 border-b border-charcoal/8 px-3 py-2.5">
                <MagnifyingGlass
                  weight="bold"
                  aria-hidden
                  className="size-3.5 shrink-0 text-charcoal/35"
                />
                <input
                  type="search"
                  value={pickerQuery}
                  onChange={(event) => setPickerQuery(event.target.value)}
                  placeholder="Search the roster"
                  className="w-full bg-transparent text-[0.8125rem] text-charcoal outline-none placeholder:text-charcoal/35"
                />
              </div>

              <ul className="max-h-56 overflow-y-auto">
                {pickerResults.map((creator) => {
                  const active = selected.some(
                    (item) => item.slug === creator.slug,
                  );
                  return (
                    <li key={creator.slug}>
                      <button
                        type="button"
                        onClick={() => toggleCreator(creator)}
                        aria-pressed={active}
                        className="flex w-full cursor-pointer items-center gap-2.5 px-3 py-2 text-left transition-colors hover:bg-cream-dark"
                      >
                        <span
                          className={cn(
                            "inline-flex size-4 shrink-0 items-center justify-center rounded-xs border transition-colors",
                            active
                              ? "border-forest bg-forest text-cream"
                              : "border-charcoal/25",
                          )}
                        >
                          {active ? (
                            <Check
                              weight="bold"
                              className="size-2.5"
                              aria-hidden
                            />
                          ) : null}
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="block truncate text-[0.8125rem] text-charcoal">
                            {creator.name}
                          </span>
                          {creator.role ? (
                            <span className="block truncate text-[0.6875rem] text-charcoal/45">
                              {creator.role}
                            </span>
                          ) : null}
                        </span>
                      </button>
                    </li>
                  );
                })}
                {pickerResults.length === 0 ? (
                  <li className="px-3 py-3 text-[0.75rem] text-charcoal/45">
                    No creators match that search.
                  </li>
                ) : null}
              </ul>
            </div>
          ) : null}
        </div>
      ) : null}

      <div className="mt-7 border-t border-charcoal/8 pt-6">
        <SectionLabel step={briefingTalent ? "03" : "02"}>
          Your details
        </SectionLabel>
      </div>

      <div className="mt-3.5 grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <label htmlFor={`${id}-name`} className={labelClass}>
            Your name
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
        <div className="space-y-1.5">
          <label htmlFor={`${id}-email`} className={labelClass}>
            Work email
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
      </div>

      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <label htmlFor={`${id}-company`} className={labelClass}>
            {briefingTalent ? "Company" : "Where you publish"}
          </label>
          <input
            id={`${id}-company`}
            name="company"
            autoComplete="organization"
            placeholder={
              briefingTalent ? "Where you're briefing from" : "Channel or handle"
            }
            className={inputClass}
          />
        </div>
        <div className="space-y-1.5">
          <label htmlFor={`${id}-role`} className={labelClass}>
            Your role <span className="text-charcoal/40">— optional</span>
          </label>
          <input
            id={`${id}-role`}
            name="jobRole"
            placeholder={briefingTalent ? "Head of Brand" : "Founder, host…"}
            className={inputClass}
          />
        </div>
      </div>

      {briefingTalent ? (
        <>
          <fieldset className="mt-7 border-t border-charcoal/8 pt-6">
            <legend className="sr-only">What are you looking for?</legend>
            <SectionLabel step="04">What are you looking for?</SectionLabel>
            <div className="mt-3.5 flex flex-wrap gap-2">
              {FORMATS.map((format) => {
                const active = formats.includes(format);
                return (
                  <button
                    key={format}
                    type="button"
                    onClick={() => toggleFormat(format)}
                    aria-pressed={active}
                    className={cn(
                      "cursor-pointer rounded-sm border px-3 py-2 text-[0.6875rem] font-medium tracking-[0.06em] uppercase transition-colors",
                      active
                        ? "border-forest bg-forest text-cream"
                        : "border-forest/20 bg-cream text-charcoal/70 hover:border-forest/45 hover:text-charcoal",
                    )}
                  >
                    {format}
                  </button>
                );
              })}
            </div>
          </fieldset>

          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <label htmlFor={`${id}-timing`} className={labelClass}>
                Timing
              </label>
              <div className="relative">
                <select
                  id={`${id}-timing`}
                  name="timing"
                  defaultValue=""
                  className={cn(inputClass, "cursor-pointer appearance-none pr-10")}
                >
                  <option value="">Select</option>
                  {TIMINGS.map((timing) => (
                    <option key={timing} value={timing}>
                      {timing}
                    </option>
                  ))}
                </select>
                <CaretDown
                  weight="bold"
                  aria-hidden
                  className="pointer-events-none absolute top-1/2 right-3.5 size-3 -translate-y-1/2 text-charcoal/40"
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <label htmlFor={`${id}-budget`} className={labelClass}>
                Budget shape
              </label>
              <div className="relative">
                <select
                  id={`${id}-budget`}
                  name="budget"
                  defaultValue=""
                  className={cn(inputClass, "cursor-pointer appearance-none pr-10")}
                >
                  <option value="">Select</option>
                  {BUDGETS.map((budget) => (
                    <option key={budget} value={budget}>
                      {budget}
                    </option>
                  ))}
                </select>
                <CaretDown
                  weight="bold"
                  aria-hidden
                  className="pointer-events-none absolute top-1/2 right-3.5 size-3 -translate-y-1/2 text-charcoal/40"
                />
              </div>
            </div>
          </div>
        </>
      ) : null}

      <div className="mt-7 border-t border-charcoal/8 pt-6">
        <SectionLabel step={briefingTalent ? "05" : "03"}>
          {briefingTalent ? "The brief" : "Your audience"}
        </SectionLabel>
      </div>

      <div className="mt-3.5 space-y-1.5">
        <label htmlFor={`${id}-brief`} className="sr-only">
          {briefingTalent
            ? "The brief"
            : "Your audience and what you're building"}
        </label>
        <textarea
          id={`${id}-brief`}
          name="brief"
          required
          rows={4}
          placeholder={
            briefingTalent
              ? "Who you need to reach, the outcome you're after, and any dates that matter."
              : "Where you publish, the size and shape of your audience, and what you want representation to unlock."
          }
          className={cn(inputClass, "min-h-28 resize-y")}
        />
      </div>

      <button
        type="submit"
        disabled={pending}
        className="group mt-7 inline-flex w-full cursor-pointer items-center justify-center gap-2 rounded-sm bg-forest px-6 py-4 text-[0.875rem] font-medium text-cream transition-colors hover:bg-forest-dark disabled:opacity-60"
      >
        {pending
          ? "Sending…"
          : briefingTalent
            ? selected.length > 0
              ? `Send brief${selected.length > 1 ? ` for ${selected.length} creators` : ""}`
              : "Send brief"
            : "Send application"}
        <ArrowRight
          weight="bold"
          aria-hidden
          className="size-3.5 transition-transform duration-300 group-hover:translate-x-0.5"
        />
      </button>

      <p className="mt-3 text-center text-[0.6875rem] leading-snug text-charcoal/45">
        Same-day acknowledgement · shortlist within 48 hours · no pitch deck
        required
      </p>

      {state.message && !state.ok ? (
        <p role="status" className="mt-3 text-center text-[0.8125rem] text-danger">
          {state.message}
        </p>
      ) : null}
    </form>
  );
}
