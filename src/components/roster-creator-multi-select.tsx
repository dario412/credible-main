"use client";

import Image from "next/image";
import { MagnifyingGlass, X } from "@phosphor-icons/react/ssr";
import { useEffect, useId, useMemo, useRef, useState } from "react";

import { portraitAltFor } from "@/lib/image-alt";
import type { RosterFormOption } from "@/lib/roster-form-options";
import { cn } from "@/lib/utils";

const PLACEHOLDER = "/images/creator-placeholder.png";
const MAX_RESULTS = 6;

function CreatorAvatar({
  option,
  className,
}: {
  option: Pick<RosterFormOption, "name" | "image" | "role">;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "relative size-7 shrink-0 overflow-hidden rounded-sm bg-forest/10",
        className,
      )}
    >
      <Image
        src={option.image?.trim() || PLACEHOLDER}
        alt={portraitAltFor(option.name, option.role)}
        fill
        sizes="28px"
        className="object-cover object-top"
      />
    </div>
  );
}

export function RosterCreatorMultiSelect({
  id,
  options,
  selectedSlugs,
  onSelectedChange,
  surface = "light",
  spacious = false,
  inputName = "creators",
}: {
  id?: string;
  options: RosterFormOption[];
  selectedSlugs: string[];
  onSelectedChange: (slugs: string[]) => void;
  surface?: "dark" | "light";
  spacious?: boolean;
  inputName?: string;
}) {
  const light = surface === "light";
  const listboxId = useId();
  const inputId = id ?? listboxId;
  const rootRef = useRef<HTMLDivElement>(null);
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);

  const optionBySlug = useMemo(
    () => new Map(options.map((option) => [option.slug, option])),
    [options],
  );

  const selected = selectedSlugs
    .map((slug) => optionBySlug.get(slug))
    .filter((option): option is RosterFormOption => Boolean(option));

  const hiddenValue = selected.map((option) => option.name).join(", ");

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();
    if (!needle) return [];

    return options
      .filter((option) => {
        if (selectedSlugs.includes(option.slug)) return false;
        const haystack = [option.name, option.role]
          .filter(Boolean)
          .join(" ")
          .toLowerCase();
        return haystack.includes(needle);
      })
      .slice(0, MAX_RESULTS);
  }, [options, query, selectedSlugs]);

  useEffect(() => {
    function onPointerDown(event: MouseEvent) {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, []);

  function add(slug: string) {
    if (selectedSlugs.includes(slug)) return;
    onSelectedChange([...selectedSlugs, slug]);
    setQuery("");
    setOpen(false);
  }

  function remove(slug: string) {
    onSelectedChange(selectedSlugs.filter((item) => item !== slug));
  }

  const fieldShell = light
    ? "border-forest/40 bg-white text-charcoal placeholder:text-charcoal/45 focus-within:border-forest focus-within:outline focus-within:outline-2 focus-within:outline-offset-[-2px] focus-within:outline-forest"
    : "border-cream/25 bg-cream/5 text-cream placeholder:text-cream/35 focus-within:border-cream focus-within:outline focus-within:outline-2 focus-within:outline-offset-[-2px] focus-within:outline-cream";

  const chipClass = light
    ? "border-forest/15 bg-white text-charcoal"
    : "border-cream/20 bg-cream/10 text-cream";

  const listClass = light
    ? "absolute z-20 mt-1 max-h-44 w-full overflow-auto rounded-sm border border-forest/20 bg-white py-1 shadow-[0_10px_24px_rgba(28,26,23,0.1)]"
    : "absolute z-20 mt-1 max-h-44 w-full overflow-auto rounded-sm border border-cream/20 bg-forest-dark py-1 shadow-[0_10px_24px_rgba(0,0,0,0.3)]";

  const optionClass = light
    ? "flex w-full items-center gap-2.5 px-3 py-2 text-left text-[0.875rem] text-charcoal hover:bg-forest/8"
    : "flex w-full items-center gap-2.5 px-3 py-2 text-left text-[0.875rem] text-cream hover:bg-cream/10";

  const showResults = open && query.trim().length > 0;

  return (
    <div ref={rootRef} className="space-y-2">
      <input type="hidden" name={inputName} value={hiddenValue} />

      {selected.length > 0 ? (
        <div className="flex flex-wrap gap-1.5">
          {selected.map((option) => (
            <span
              key={option.slug}
              className={cn(
                "inline-flex max-w-full items-center gap-1.5 rounded-sm border py-1 pr-1 pl-1 text-[0.8125rem]",
                chipClass,
              )}
            >
              <CreatorAvatar option={option} />
              <span className="truncate font-medium">{option.name}</span>
              <button
                type="button"
                onClick={() => remove(option.slug)}
                className={cn(
                  "inline-flex shrink-0 cursor-pointer rounded-sm p-0.5 transition-colors",
                  light
                    ? "text-charcoal/45 hover:text-charcoal"
                    : "text-cream/55 hover:text-cream",
                )}
                aria-label={`Remove ${option.name}`}
              >
                <X weight="bold" className="size-3" aria-hidden />
              </button>
            </span>
          ))}
        </div>
      ) : null}

      <div className="relative">
        <label htmlFor={inputId} className="sr-only">
          Search creators on the roster
        </label>
        <div
          className={cn(
            fieldShell,
            "flex w-full items-center gap-2 rounded-sm border px-3",
            spacious ? "h-12" : "h-11",
          )}
        >
          <MagnifyingGlass
            weight="bold"
            aria-hidden
            className={cn(
              "size-4 shrink-0",
              light ? "text-charcoal/40" : "text-cream/40",
            )}
          />
          <input
            id={inputId}
            type="text"
            value={query}
            onChange={(event) => {
              setQuery(event.target.value);
              setOpen(true);
            }}
            onFocus={() => setOpen(true)}
            placeholder="Search the roster…"
            role="combobox"
            aria-expanded={showResults && filtered.length > 0}
            aria-controls={listboxId}
            aria-autocomplete="list"
            className="min-w-0 flex-1 bg-transparent text-[0.9375rem] outline-none"
          />
        </div>

        {showResults && filtered.length > 0 ? (
          <ul id={listboxId} role="listbox" className={listClass}>
            {filtered.map((option) => (
              <li key={option.slug} role="option">
                <button
                  type="button"
                  className={optionClass}
                  onMouseDown={(event) => event.preventDefault()}
                  onClick={() => add(option.slug)}
                >
                  <CreatorAvatar option={option} />
                  <span className="min-w-0 flex-1 truncate">{option.name}</span>
                  {option.role ? (
                    <span
                      className={cn(
                        "shrink-0 truncate text-[0.75rem]",
                        light ? "text-charcoal/45" : "text-cream/50",
                      )}
                    >
                      {option.role}
                    </span>
                  ) : null}
                </button>
              </li>
            ))}
          </ul>
        ) : null}

        {showResults && filtered.length === 0 ? (
          <p
            className={cn(
              "absolute z-20 mt-1 w-full rounded-sm border px-3 py-2 text-[0.8125rem]",
              light
                ? "border-forest/20 bg-white text-charcoal/55"
                : "border-cream/20 bg-forest-dark text-cream/55",
            )}
          >
            No matches.
          </p>
        ) : null}
      </div>
    </div>
  );
}
