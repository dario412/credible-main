"use client";

import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState, useTransition } from "react";
import { cn } from "@/lib/utils";

export const ARCHETYPE_OPTIONS = [
  "Founder / C-Suite",
  "Investor / Analyst",
  "Subject Matter Expert",
  "Category Specialist",
] as const;

export const TOPIC_OPTIONS = [
  "SaaS",
  "Fintech",
  "AI",
  "Marketing",
  "Sales",
  "Product",
  "Media",
] as const;

export const FORMAT_OPTIONS = [
  "Keynote",
  "Podcast guest",
  "Content series",
  "Newsletter",
  "Ambassador",
] as const;

type FilterPatch = {
  archetype?: string;
  topic?: string;
  format?: string;
  q?: string;
};

export function RosterFilters({
  currentArchetype,
  currentTopic,
  currentFormat,
  currentQuery,
}: {
  currentArchetype?: string;
  currentTopic?: string;
  currentFormat?: string;
  currentQuery?: string;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [pending, startTransition] = useTransition();
  const [query, setQuery] = useState(currentQuery ?? "");

  useEffect(() => {
    setQuery(currentQuery ?? "");
  }, [currentQuery]);

  useEffect(() => {
    const handle = setTimeout(() => {
      if ((currentQuery ?? "") === query) return;
      update({ q: query || undefined });
    }, 300);
    return () => clearTimeout(handle);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query]);

  function update(patch: FilterPatch) {
    const params = new URLSearchParams();
    const archetype =
      "archetype" in patch ? patch.archetype : currentArchetype;
    const topic = "topic" in patch ? patch.topic : currentTopic;
    const format = "format" in patch ? patch.format : currentFormat;
    const q = "q" in patch ? patch.q : currentQuery;

    if (archetype) params.set("archetype", archetype);
    if (topic) params.set("topic", topic);
    if (format) params.set("format", format);
    if (q) params.set("q", q);

    const qs = params.toString();
    startTransition(() => {
      router.push(qs ? `${pathname}?${qs}` : pathname);
    });
  }

  const hasFilters = Boolean(
    currentArchetype || currentTopic || currentFormat || query,
  );

  return (
    <div
      className={cn(
        "rounded-sm border border-charcoal/8 bg-[#FBF8F5] px-5 py-6 shadow-[0_10px_28px_rgba(28,26,23,0.05)] transition-opacity md:px-7 md:py-7",
        pending && "opacity-70",
      )}
    >
      <div className="relative">
        <label htmlFor="roster-search" className="sr-only">
          Search experts
        </label>
        <span
          aria-hidden
          className="pointer-events-none absolute top-1/2 left-0 -translate-y-1/2 text-charcoal/40"
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            className="size-4"
          >
            <circle cx="11" cy="11" r="7" />
            <path d="m20 20-3.5-3.5" strokeLinecap="round" />
          </svg>
        </span>
        <input
          id="roster-search"
          type="search"
          placeholder="Search by name, title, or focus…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full border-b border-charcoal/12 bg-transparent py-2.5 pr-16 pl-7 text-sm text-charcoal transition-colors placeholder:text-charcoal/40 focus:border-forest focus:outline-none"
        />
        {hasFilters ? (
          <button
            type="button"
            onClick={() => {
              setQuery("");
              startTransition(() => router.push(pathname));
            }}
            className="absolute top-1/2 right-0 -translate-y-1/2 cursor-pointer text-xs text-charcoal/50 transition-colors hover:text-forest focus-visible:rounded-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-forest"
          >
            Clear all
          </button>
        ) : null}
      </div>

      <div className="mt-7 divide-y divide-charcoal/10">
        <FilterRow
          id="roster-archetype-label"
          label="Archetype"
          options={["All", ...ARCHETYPE_OPTIONS]}
          current={currentArchetype}
          onSelect={(value) =>
            update(
              value === "All"
                ? { archetype: undefined }
                : { archetype: value },
            )
          }
        />
        <FilterRow
          id="roster-topic-label"
          label="Topic"
          options={["All", ...TOPIC_OPTIONS]}
          current={currentTopic}
          onSelect={(value) =>
            update(value === "All" ? { topic: undefined } : { topic: value })
          }
        />
        <FilterRow
          id="roster-format-label"
          label="Format"
          options={["All", ...FORMAT_OPTIONS]}
          current={currentFormat}
          onSelect={(value) =>
            update(
              value === "All" ? { format: undefined } : { format: value },
            )
          }
        />
      </div>
    </div>
  );
}

function FilterRow({
  id,
  label,
  options,
  current,
  onSelect,
}: {
  id: string;
  label: string;
  options: readonly string[];
  current?: string;
  onSelect: (value: string) => void;
}) {
  return (
    <div className="grid gap-3 py-5 first:pt-0 last:pb-0 md:grid-cols-[7.5rem_minmax(0,1fr)] md:items-start md:gap-6">
      <p
        id={id}
        className="pt-2 text-[11px] font-medium tracking-[0.16em] text-charcoal/50 uppercase"
      >
        {label}
      </p>
      <div
        role="group"
        aria-labelledby={id}
        className="flex flex-wrap gap-1.5 lg:flex-nowrap lg:gap-1.5"
      >
        {options.map((option) => {
          const isAll = option === "All";
          const active = isAll ? !current : current === option;

          return (
            <button
              key={option}
              type="button"
              aria-pressed={active}
              onClick={() => onSelect(option)}
              className={cn(
                "inline-flex shrink-0 cursor-pointer items-center justify-center rounded-sm border px-3 text-[0.8125rem] font-medium transition-colors lg:min-h-9 lg:px-3 lg:text-[0.75rem]",
                "min-h-9 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-forest",
                active
                  ? "border-forest bg-forest text-cream shadow-[0_4px_14px_rgba(52,91,71,0.35)] ring-2 ring-forest/25"
                  : "border-charcoal/15 bg-white/60 text-charcoal/70 hover:border-forest/35 hover:text-charcoal",
              )}
            >
              {option}
            </button>
          );
        })}
      </div>
    </div>
  );
}
