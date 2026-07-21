"use client";

import { useRouter, usePathname } from "next/navigation";
import { CaretDown } from "@phosphor-icons/react";
import { useEffect, useId, useRef, useState, useTransition } from "react";

import { cn } from "@/lib/utils";
import { INSIGHT_TOPICS } from "@/lib/insight-topics";

export { INSIGHT_TOPICS };

export function InsightsToolbar({
  currentCategory,
  currentQuery,
}: {
  currentCategory?: string;
  currentQuery?: string;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [pending, startTransition] = useTransition();
  const [topicsOpen, setTopicsOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(Boolean(currentQuery));
  const [query, setQuery] = useState(currentQuery ?? "");
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const listboxId = useId();

  useEffect(() => {
    setQuery(currentQuery ?? "");
  }, [currentQuery]);

  useEffect(() => {
    if (!searchOpen) return;
    const handle = setTimeout(() => {
      if ((currentQuery ?? "") === query) return;
      push({ q: query || undefined });
    }, 300);
    return () => clearTimeout(handle);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query]);

  useEffect(() => {
    if (!searchOpen) return;
    const id = requestAnimationFrame(() => inputRef.current?.focus());
    return () => cancelAnimationFrame(id);
  }, [searchOpen]);

  useEffect(() => {
    if (!topicsOpen && !searchOpen) return;

    function onPointerDown(event: MouseEvent) {
      const target = event.target as Node;
      if (topicsOpen && !dropdownRef.current?.contains(target)) {
        setTopicsOpen(false);
      }
      if (
        searchOpen &&
        !searchRef.current?.contains(target) &&
        !query
      ) {
        setSearchOpen(false);
      }
    }

    function onKeyDown(event: KeyboardEvent) {
      if (event.key !== "Escape") return;
      if (topicsOpen) setTopicsOpen(false);
      if (searchOpen) {
        setSearchOpen(false);
        if (!query && currentQuery) push({ q: undefined });
      }
    }

    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [topicsOpen, searchOpen, query, currentQuery]);

  function push(patch: { category?: string; q?: string }) {
    const params = new URLSearchParams();
    const category =
      "category" in patch ? patch.category : currentCategory;
    const q = "q" in patch ? patch.q : currentQuery;
    if (category) params.set("category", category);
    if (q) params.set("q", q);
    const qs = params.toString();
    startTransition(() => {
      router.push(qs ? `${pathname}?${qs}` : pathname);
    });
  }

  function selectTopic(option: string) {
    setTopicsOpen(false);
    if (option === "All topics") {
      push({ category: undefined });
      return;
    }
    push({ category: option });
  }

  const options = ["All topics", ...INSIGHT_TOPICS];
  const triggerLabel = currentCategory ?? "Explore topics";

  return (
    <div className={cn(pending && "opacity-70")}>
      <div className="flex flex-wrap items-center justify-end gap-2">
        <div ref={searchRef} className="flex items-center">
          <div
            className={cn(
              "overflow-hidden transition-[max-width,opacity,margin] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]",
              searchOpen
                ? "mr-2 max-w-56 opacity-100 sm:max-w-64"
                : "max-w-0 opacity-0",
            )}
          >
            <label htmlFor="insights-search" className="sr-only">
              Search insights
            </label>
            <input
              ref={inputRef}
              id="insights-search"
              type="search"
              placeholder="Search insights…"
              value={query}
              tabIndex={searchOpen ? 0 : -1}
              aria-hidden={!searchOpen}
              onChange={(e) => setQuery(e.target.value)}
              className="h-10 w-56 border-b border-charcoal/15 bg-transparent px-1 text-sm text-charcoal placeholder:text-charcoal/40 focus:border-forest focus:outline-none sm:w-64"
            />
          </div>

          <button
            type="button"
            aria-label={searchOpen ? "Close search" : "Search insights"}
            aria-expanded={searchOpen}
            onClick={() => {
              setSearchOpen((open) => {
                const next = !open;
                if (!next && !query && currentQuery) {
                  push({ q: undefined });
                }
                return next;
              });
              setTopicsOpen(false);
            }}
            className={cn(
              "inline-flex size-10 shrink-0 cursor-pointer items-center justify-center rounded-sm border transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-forest",
              searchOpen
                ? "border-forest text-forest"
                : "border-charcoal/20 text-charcoal hover:border-forest hover:text-forest",
            )}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 256 256"
              fill="currentColor"
              aria-hidden
              className="size-[1.125rem]"
            >
              <path d="M229.66,218.34l-50.07-50.06a88.11,88.11,0,1,0-11.31,11.31l50.06,50.07a8,8,0,0,0,11.32-11.32ZM40,112a72,72,0,1,1,72,72A72.08,72.08,0,0,1,40,112Z" />
            </svg>
          </button>
        </div>

        <div className="relative" ref={dropdownRef}>
          <button
            type="button"
            aria-expanded={topicsOpen}
            aria-haspopup="listbox"
            aria-controls={listboxId}
            onClick={() => {
              setTopicsOpen((open) => !open);
              if (!query) setSearchOpen(false);
            }}
            className={cn(
              "inline-flex h-10 cursor-pointer items-center justify-center gap-2 rounded-sm border px-4 text-[0.8125rem] font-medium transition-colors",
              "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-forest",
              topicsOpen || currentCategory
                ? "border-forest text-forest"
                : "border-charcoal/20 text-charcoal hover:border-forest hover:text-forest",
            )}
          >
            {triggerLabel}
            <CaretDown
              weight="bold"
              className={cn(
                "size-3 shrink-0 transition-transform duration-300",
                topicsOpen && "rotate-180",
              )}
              aria-hidden
            />
          </button>

          {topicsOpen ? (
            <ul
              id={listboxId}
              role="listbox"
              aria-label="Filter insights by topic"
              className="absolute top-[calc(100%+0.4rem)] right-0 z-30 min-w-[12.5rem] overflow-hidden rounded-sm border border-charcoal/10 bg-[#FBF8F5] py-1.5 shadow-[0_16px_36px_rgba(28,26,23,0.12)]"
            >
              {options.map((option) => {
                const isAll = option === "All topics";
                const active = isAll
                  ? !currentCategory
                  : currentCategory === option;

                return (
                  <li key={option} role="option" aria-selected={active}>
                    <button
                      type="button"
                      onClick={() => selectTopic(option)}
                      className={cn(
                        "flex w-full cursor-pointer items-center px-3.5 py-2.5 text-left text-[0.8125rem] transition-colors",
                        active
                          ? "bg-forest/10 font-medium text-forest"
                          : "text-charcoal/75 hover:bg-charcoal/[0.04] hover:text-charcoal",
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
      </div>
    </div>
  );
}
