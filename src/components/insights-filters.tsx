"use client";

import { CaretDown, X } from "@phosphor-icons/react";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useId, useRef, useState, useTransition } from "react";

import { INSIGHT_TOPICS } from "@/lib/insight-topics";
import { cn } from "@/lib/utils";

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
  const [query, setQuery] = useState(currentQuery ?? "");
  const [open, setOpen] = useState(false);
  const barRef = useRef<HTMLDivElement>(null);
  const searchId = useId();
  const listId = useId();

  useEffect(() => {
    setQuery(currentQuery ?? "");
  }, [currentQuery]);

  useEffect(() => {
    const handle = setTimeout(() => {
      if ((currentQuery ?? "") === query) return;
      push({ q: query || undefined });
    }, 300);
    return () => clearTimeout(handle);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query]);

  useEffect(() => {
    if (!open) return;

    function onPointerDown(event: MouseEvent) {
      if (!barRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }

    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

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

  function clearAll() {
    setQuery("");
    setOpen(false);
    startTransition(() => router.push(pathname));
  }

  const hasFilters = Boolean(currentCategory || query);

  return (
    <>
      <div
        ref={barRef}
        className={cn(
          "rounded-sm border border-charcoal/8 bg-[#FBF8F5] shadow-[0_10px_28px_rgba(28,26,23,0.06)] transition-opacity",
          open ? "overflow-visible" : "overflow-hidden",
          pending && "opacity-70",
        )}
      >
        <div className="flex flex-col lg:flex-row lg:items-stretch">
          <label
            htmlFor={searchId}
            className="relative flex min-w-0 flex-1 cursor-text flex-col justify-center gap-0.5 px-4 py-3 transition-colors hover:bg-cream/70 focus-within:bg-cream/70 lg:px-5"
          >
            <span className="text-[10px] font-medium tracking-[0.14em] text-charcoal uppercase">
              Search
            </span>
            <span className="relative flex items-center">
              <input
                id={searchId}
                type="search"
                placeholder="Search insights"
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

          <div className="relative border-t border-charcoal/8 lg:min-w-52 lg:border-t-0 lg:border-l lg:border-charcoal/10">
            <button
              type="button"
              aria-expanded={open}
              aria-haspopup="listbox"
              aria-controls={listId}
              onClick={() => setOpen((current) => !current)}
              className={cn(
                "flex w-full cursor-pointer flex-col gap-0.5 px-4 py-3 text-left transition-colors",
                "hover:bg-cream/70 focus-visible:bg-cream/70 focus-visible:outline-none",
                open && "bg-cream/70",
              )}
            >
              <span className="text-[10px] font-medium tracking-[0.14em] text-charcoal uppercase">
                Topic
              </span>
              <span className="flex items-center gap-2">
                <span
                  className={cn(
                    "min-w-0 flex-1 truncate text-[0.8125rem]",
                    currentCategory
                      ? "font-medium text-charcoal"
                      : "text-charcoal/40",
                  )}
                >
                  {currentCategory ?? "All topics"}
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
                aria-label="Topic"
                className="absolute top-[calc(100%+0.4rem)] right-0 left-0 z-30 overflow-hidden rounded-sm border border-charcoal/10 bg-[#FBF8F5] py-1.5 shadow-[0_16px_36px_rgba(28,26,23,0.12)]"
              >
                <li role="option" aria-selected={!currentCategory}>
                  <button
                    type="button"
                    onClick={() => {
                      push({ category: undefined });
                      setOpen(false);
                    }}
                    className={cn(
                      "flex w-full cursor-pointer px-3.5 py-2.5 text-left text-[0.8125rem] transition-colors",
                      !currentCategory
                        ? "bg-forest/10 font-medium text-forest"
                        : "text-charcoal hover:bg-cream",
                    )}
                  >
                    All topics
                  </button>
                </li>
                {INSIGHT_TOPICS.map((topic) => {
                  const active = currentCategory === topic;
                  return (
                    <li key={topic} role="option" aria-selected={active}>
                      <button
                        type="button"
                        onClick={() => {
                          push({ category: topic });
                          setOpen(false);
                        }}
                        className={cn(
                          "flex w-full cursor-pointer px-3.5 py-2.5 text-left text-[0.8125rem] transition-colors",
                          active
                            ? "bg-forest/10 font-medium text-forest"
                            : "text-charcoal hover:bg-cream",
                        )}
                      >
                        {topic}
                      </button>
                    </li>
                  );
                })}
              </ul>
            ) : null}
          </div>
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
