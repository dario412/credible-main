"use client";

import { CaretDown, X } from "@phosphor-icons/react";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useId, useRef, useState, useTransition } from "react";

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

type OpenMenu = "archetype" | "topic" | "format" | null;

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
  const [open, setOpen] = useState<OpenMenu>(null);
  const barRef = useRef<HTMLDivElement>(null);
  const searchId = useId();

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

  useEffect(() => {
    if (!open) return;

    function onPointerDown(event: MouseEvent) {
      if (!barRef.current?.contains(event.target as Node)) {
        setOpen(null);
      }
    }

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(null);
    }

    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  function update(patch: FilterPatch) {
    const params = new URLSearchParams();
    const archetype = "archetype" in patch ? patch.archetype : currentArchetype;
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

  function clearAll() {
    setQuery("");
    setOpen(null);
    startTransition(() => router.push(pathname));
  }

  const hasFilters = Boolean(
    currentArchetype || currentTopic || currentFormat || query,
  );

  return (
    <>
      <div
        ref={barRef}
        className={cn(
          "rounded-sm border border-charcoal/8 bg-[#FBF8F5] shadow-[0_10px_28px_rgba(28,26,23,0.06)] transition-opacity",
          // The menus are absolutely positioned below the bar, so they need to escape it.
          open ? "overflow-visible" : "overflow-hidden",
          pending && "opacity-70",
        )}
      >
        <div className="flex flex-col lg:flex-row lg:items-stretch">
          <label
            htmlFor={searchId}
            className={cn(
              "group/search relative flex min-w-0 flex-1 cursor-text flex-col justify-center gap-0.5 px-4 py-3 transition-colors",
              "hover:bg-cream/70 focus-within:bg-cream/70",
              "lg:px-5",
            )}
          >
            <span className="text-[10px] font-medium tracking-[0.14em] text-charcoal uppercase">
              Search
            </span>
            <span className="relative flex items-center">
              <input
                id={searchId}
                type="search"
                placeholder="Search experts"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full bg-transparent pr-7 text-[0.8125rem] text-charcoal outline-none placeholder:text-charcoal/40"
              />
              {query ? (
                <button
                  type="button"
                  onClick={() => setQuery("")}
                  className="absolute right-0 cursor-pointer text-charcoal/40 transition-colors hover:text-charcoal"
                  aria-label="Clear search"
                >
                  <X weight="bold" className="size-3.5" aria-hidden />
                </button>
              ) : null}
            </span>
          </label>

          <FilterSegment
            label="Archetype"
            value={currentArchetype}
            placeholder="All archetypes"
            options={ARCHETYPE_OPTIONS}
            open={open === "archetype"}
            onToggle={() =>
              setOpen((current) =>
                current === "archetype" ? null : "archetype",
              )
            }
            onSelect={(value) => {
              update({ archetype: value });
              setOpen(null);
            }}
            onClear={() => {
              update({ archetype: undefined });
              setOpen(null);
            }}
          />

          <FilterSegment
            label="Topic"
            value={currentTopic}
            placeholder="All topics"
            options={TOPIC_OPTIONS}
            open={open === "topic"}
            onToggle={() =>
              setOpen((current) => (current === "topic" ? null : "topic"))
            }
            onSelect={(value) => {
              update({ topic: value });
              setOpen(null);
            }}
            onClear={() => {
              update({ topic: undefined });
              setOpen(null);
            }}
          />

          <FilterSegment
            label="Format"
            value={currentFormat}
            placeholder="All formats"
            options={FORMAT_OPTIONS}
            open={open === "format"}
            onToggle={() =>
              setOpen((current) => (current === "format" ? null : "format"))
            }
            onSelect={(value) => {
              update({ format: value });
              setOpen(null);
            }}
            onClear={() => {
              update({ format: undefined });
              setOpen(null);
            }}
            isLast
          />
        </div>
      </div>

      {hasFilters ? (
        <div className="mt-3 flex justify-end">
          <button
            type="button"
            onClick={clearAll}
            className="inline-flex cursor-pointer items-center gap-1.5 text-[0.75rem] font-medium text-charcoal/55 transition-colors hover:text-forest"
          >
            <X weight="bold" className="size-3" aria-hidden />
            Clear all filters
          </button>
        </div>
      ) : null}
    </>
  );
}

function FilterSegment({
  label,
  value,
  placeholder,
  options,
  open,
  onToggle,
  onSelect,
  onClear,
  isLast = false,
}: {
  label: string;
  value?: string;
  placeholder: string;
  options: readonly string[];
  open: boolean;
  onToggle: () => void;
  onSelect: (value: string) => void;
  onClear: () => void;
  isLast?: boolean;
}) {
  const listId = useId();

  return (
    <div
      className={cn(
        "relative border-t border-charcoal/8 lg:border-t-0 lg:border-l lg:border-charcoal/10",
        !isLast && "lg:min-w-[10rem]",
        isLast && "lg:min-w-[9.5rem]",
      )}
    >
      <button
        type="button"
        aria-expanded={open}
        aria-haspopup="listbox"
        aria-controls={listId}
        onClick={onToggle}
        className={cn(
          "flex w-full cursor-pointer flex-col gap-0.5 px-4 py-3 text-left transition-colors",
          "hover:bg-cream/70 focus-visible:bg-cream/70 focus-visible:outline-none",
          open && "bg-cream/70",
          isLast && "lg:pr-4",
        )}
      >
        <span className="text-[10px] font-medium tracking-[0.14em] text-charcoal uppercase">
          {label}
        </span>
        <span className="flex items-center gap-2">
          <span
            className={cn(
              "min-w-0 flex-1 truncate text-[0.8125rem]",
              value ? "font-medium text-charcoal" : "text-charcoal/40",
            )}
          >
            {value ?? placeholder}
          </span>
          <CaretDown
            weight="bold"
            aria-hidden
            className={cn(
              "size-3.5 shrink-0 text-charcoal/40 transition-transform duration-300",
              open && "rotate-180",
            )}
          />
        </span>
      </button>

      {open ? (
        <ul
          id={listId}
          role="listbox"
          aria-label={label}
          className="absolute top-[calc(100%+0.4rem)] right-0 left-0 z-30 overflow-hidden rounded-sm border border-charcoal/10 bg-[#FBF8F5] py-1.5 shadow-[0_16px_36px_rgba(28,26,23,0.12)]"
        >
          <li role="option" aria-selected={!value}>
            <button
              type="button"
              onClick={onClear}
              className={cn(
                "flex w-full cursor-pointer px-3.5 py-2.5 text-left text-[0.8125rem] transition-colors",
                !value
                  ? "bg-forest/10 font-medium text-forest"
                  : "text-charcoal hover:bg-cream",
              )}
            >
              {placeholder}
            </button>
          </li>
          {options.map((option) => {
            const active = value === option;
            return (
              <li key={option} role="option" aria-selected={active}>
                <button
                  type="button"
                  onClick={() => onSelect(option)}
                  className={cn(
                    "flex w-full cursor-pointer px-3.5 py-2.5 text-left text-[0.8125rem] transition-colors",
                    active
                      ? "bg-forest/10 font-medium text-forest"
                      : "text-charcoal hover:bg-cream",
                  )}
                >
                  {option}
                </button>
              </li>
            );
          })}
        </ul>
      ) : null}
    </div>
  );
}
