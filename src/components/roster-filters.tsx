"use client";

import { CaretDown, Check, X } from "@phosphor-icons/react";
import { useRouter, usePathname } from "next/navigation";
import {
  useEffect,
  useId,
  useRef,
  useState,
  useTransition,
  type ComponentProps,
} from "react";

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

export const CHANNEL_FILTER_OPTIONS = [
  { label: "LinkedIn", value: "linkedin" },
  { label: "X", value: "x" },
  { label: "TikTok", value: "tiktok" },
  { label: "YouTube", value: "youtube" },
  { label: "Podcast", value: "podcast" },
] as const;

type FilterPatch = {
  archetype?: string;
  topic?: string;
  channels?: string[];
  q?: string;
};

type OpenMenu = "archetype" | "topic" | "channels" | null;

/** Sticky under the site header; expands to full content width only once stuck. */
export function StickyRosterFilters(
  props: ComponentProps<typeof RosterFilters>,
) {
  const sentinelRef = useRef<HTMLDivElement>(null);
  const [stuck, setStuck] = useState(false);

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;

    // IntersectionObserver rootMargin only accepts px/% (not rem).
    // Match sticky offsets: top-20 (5rem) / md:top-24 (6rem).
    const remPx =
      parseFloat(getComputedStyle(document.documentElement).fontSize) || 16;
    const topOffsetPx =
      (window.matchMedia("(min-width: 768px)").matches ? 6 : 5) * remPx;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setStuck(!entry?.isIntersecting);
      },
      {
        threshold: 0,
        rootMargin: `-${topOffsetPx}px 0px 0px 0px`,
      },
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, []);

  return (
    <>
      <div ref={sentinelRef} className="h-px w-full" aria-hidden />
      <div className="sticky top-20 z-40 mt-8 md:top-24 md:mt-10">
        <div
          aria-hidden
          className={cn(
            // Reach up through the header→filter gap so that strip is frosted too.
            "pointer-events-none absolute inset-x-0 -top-8 -bottom-4 -z-10 transition-opacity duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] md:-top-6 md:-bottom-5",
            stuck ? "opacity-100" : "opacity-0",
          )}
          style={{
            background:
              "linear-gradient(to bottom, rgba(249,243,239,0.94) 0%, rgba(249,243,239,0.9) 55%, rgba(249,243,239,0.55) 100%)",
            backdropFilter: "blur(22px)",
            WebkitBackdropFilter: "blur(22px)",
          }}
        />
        <div
          className={cn(
            "mx-auto transition-[max-width] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] will-change-[max-width]",
            stuck ? "max-w-352" : "max-w-4xl",
          )}
        >
          <RosterFilters {...props} elevated={stuck} />
        </div>
      </div>
    </>
  );
}

export function RosterFilters({
  currentArchetype,
  currentTopic,
  currentChannels = [],
  currentQuery,
  elevated = false,
}: {
  currentArchetype?: string;
  currentTopic?: string;
  currentChannels?: string[];
  currentQuery?: string;
  elevated?: boolean;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [pending, startTransition] = useTransition();
  const [query, setQuery] = useState(currentQuery ?? "");
  const [selectedChannels, setSelectedChannels] = useState(currentChannels);
  const selectedChannelsRef = useRef(currentChannels);
  const [open, setOpen] = useState<OpenMenu>(null);
  const barRef = useRef<HTMLDivElement>(null);
  const searchId = useId();

  useEffect(() => {
    setQuery(currentQuery ?? "");
  }, [currentQuery]);

  useEffect(() => {
    selectedChannelsRef.current = currentChannels;
    setSelectedChannels(currentChannels);
  }, [currentChannels]);

  function setChannels(next: string[]) {
    selectedChannelsRef.current = next;
    setSelectedChannels(next);
    update({ channels: next });
  }

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
    const channels =
      "channels" in patch ? patch.channels : selectedChannelsRef.current;
    const q = "q" in patch ? patch.q : currentQuery;

    if (archetype) params.set("archetype", archetype);
    if (topic) params.set("topic", topic);
    if (channels?.length) params.set("channels", channels.join(","));
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

  const selectedChannelOptions = CHANNEL_FILTER_OPTIONS.filter((option) =>
    selectedChannels.includes(option.value),
  );

  const hasFilters = Boolean(
    currentArchetype || currentTopic || selectedChannels.length || query,
  );

  return (
    <>
      <div
        ref={barRef}
        className={cn(
          "rounded-sm border transition-[border-color,box-shadow,background-color] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]",
          elevated
            ? "border-charcoal/18 bg-white shadow-[0_16px_40px_rgba(28,26,23,0.14)]"
            : "border-charcoal/8 bg-[#FBF8F5] shadow-[0_10px_28px_rgba(28,26,23,0.06)]",
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

          <MultiFilterSegment
            label="Channels"
            options={CHANNEL_FILTER_OPTIONS}
            selectedValues={selectedChannels}
            open={open === "channels"}
            onToggle={() =>
              setOpen((current) => (current === "channels" ? null : "channels"))
            }
            onApply={(next) => {
              const same =
                next.length === selectedChannels.length &&
                next.every((value) => selectedChannels.includes(value));
              if (same) {
                setOpen(null);
                return;
              }
              setChannels(next);
              setOpen(null);
            }}
            isLast
          />
        </div>
      </div>

      {hasFilters ? (
        <div className="mt-3 flex flex-wrap items-center gap-2">
          {selectedChannelOptions.length > 0 ? (
            <ul className="flex min-w-0 flex-1 flex-wrap items-center gap-1.5">
              {selectedChannelOptions.map((option) => (
                <li key={option.value}>
                  <button
                    type="button"
                    onClick={() => {
                      setChannels(
                        selectedChannelsRef.current.filter(
                          (item) => item !== option.value,
                        ),
                      );
                    }}
                    className="inline-flex cursor-pointer items-center gap-1.5 rounded-sm border border-forest/20 bg-forest/8 px-2 py-1 text-[0.7rem] font-medium text-forest transition-colors hover:border-forest/35 hover:bg-forest/12"
                    aria-label={`Remove ${option.label} channel filter`}
                  >
                    {option.label}
                    <X weight="bold" className="size-2.5" aria-hidden />
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <span className="flex-1" aria-hidden />
          )}
          <button
            type="button"
            onClick={clearAll}
            className="inline-flex shrink-0 cursor-pointer items-center gap-1.5 text-[0.75rem] font-medium text-charcoal/55 transition-colors hover:text-forest"
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

function MultiFilterSegment({
  label,
  options,
  selectedValues,
  open,
  onToggle,
  onApply,
  isLast = false,
}: {
  label: string;
  options: readonly { label: string; value: string }[];
  selectedValues: string[];
  open: boolean;
  onToggle: () => void;
  onApply: (next: string[]) => void;
  isLast?: boolean;
}) {
  const listId = useId();
  const [draft, setDraft] = useState(selectedValues);
  const committedCount = selectedValues.length;
  const hasCommitted = committedCount > 0;
  const draftCount = draft.length;
  const hasDraft = draftCount > 0;

  useEffect(() => {
    if (open) setDraft(selectedValues);
  }, [open, selectedValues]);

  function toggleValue(value: string) {
    setDraft((prev) =>
      prev.includes(value)
        ? prev.filter((item) => item !== value)
        : [...prev, value],
    );
  }

  return (
    <div
      className={cn(
        "relative border-t border-charcoal/8 lg:border-t-0 lg:border-l lg:border-charcoal/10",
        "lg:min-w-44",
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
        <span className="flex items-center gap-1.5">
          <span className="text-[10px] font-medium tracking-[0.14em] text-charcoal uppercase">
            {label}
          </span>
          {hasCommitted ? (
            <span className="inline-flex min-w-4 items-center justify-center rounded-full bg-forest px-1 text-[0.625rem] leading-4 font-medium text-cream">
              {committedCount}
            </span>
          ) : null}
        </span>
        <span className="flex items-center gap-2">
          <span
            className={cn(
              "min-w-0 flex-1 truncate text-[0.8125rem]",
              hasCommitted ? "font-medium text-charcoal" : "text-charcoal/40",
            )}
          >
            {hasCommitted
              ? committedCount === 1
                ? (options.find((option) => option.value === selectedValues[0])
                    ?.label ?? "1 selected")
                : `${committedCount} selected`
              : "Any channel"}
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
        <div
          className={cn(
            "absolute top-[calc(100%+0.4rem)] z-30 w-[min(17.5rem,calc(100vw-2rem))] overflow-hidden rounded-sm border border-charcoal/10 bg-[#FBF8F5] shadow-[0_16px_36px_rgba(28,26,23,0.12)]",
            isLast ? "right-0 left-auto" : "left-0",
          )}
        >
          <div className="border-b border-charcoal/8 px-3.5 py-3">
            <p className="text-[0.8125rem] font-medium text-charcoal">
              Select channels
            </p>
            <p className="mt-0.5 text-[0.7rem] leading-snug text-charcoal/50">
              Choose one or more — results match any selected.
            </p>
          </div>

          <ul
            id={listId}
            role="listbox"
            aria-label={label}
            aria-multiselectable="true"
            className="max-h-64 overflow-y-auto py-1.5"
          >
            {options.map((option) => {
              const active = draft.includes(option.value);
              return (
                <li key={option.value} role="option" aria-selected={active}>
                  <button
                    type="button"
                    onClick={() => toggleValue(option.value)}
                    className={cn(
                      "flex w-full cursor-pointer items-center gap-3 px-3.5 py-2.5 text-left text-[0.8125rem] transition-colors",
                      active
                        ? "bg-forest/8 font-medium text-charcoal"
                        : "text-charcoal hover:bg-cream",
                    )}
                  >
                    <span
                      aria-hidden
                      className={cn(
                        "flex size-4 shrink-0 items-center justify-center rounded-[3px] border transition-colors",
                        active
                          ? "border-forest bg-forest text-cream"
                          : "border-charcoal/25 bg-transparent",
                      )}
                    >
                      {active ? (
                        <Check weight="bold" className="size-2.5" />
                      ) : null}
                    </span>
                    {option.label}
                  </button>
                </li>
              );
            })}
          </ul>

          <div className="flex items-center justify-between gap-3 border-t border-charcoal/8 px-3.5 py-2.5">
            {hasDraft ? (
              <button
                type="button"
                onClick={() => setDraft([])}
                className="cursor-pointer text-[0.75rem] font-medium text-charcoal/55 transition-colors hover:text-charcoal"
              >
                Clear
              </button>
            ) : (
              <span className="text-[0.75rem] text-charcoal/40">
                None selected
              </span>
            )}
            <button
              type="button"
              onClick={() => onApply(draft)}
              className="cursor-pointer rounded-sm bg-charcoal px-3 py-1.5 text-[0.75rem] font-medium text-cream transition-colors hover:bg-charcoal/85"
            >
              Done
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
