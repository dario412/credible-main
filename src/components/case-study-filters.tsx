"use client";

import { useRouter, usePathname } from "next/navigation";
import { CaretDown, MagnifyingGlass } from "@phosphor-icons/react";
import { useEffect, useId, useRef, useState, useTransition } from "react";

import { cn } from "@/lib/utils";
import {
  CASE_STUDY_CLIENT_TYPES,
  CASE_STUDY_PILLARS,
} from "@/lib/case-studies";

export function CaseStudyFilters({
  currentClientType,
  currentPillar,
  currentQuery,
}: {
  currentClientType?: string;
  currentPillar?: string;
  currentQuery?: string;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [pending, startTransition] = useTransition();
  const [query, setQuery] = useState(currentQuery ?? "");
  const [clientOpen, setClientOpen] = useState(false);
  const [pillarOpen, setPillarOpen] = useState(false);
  const clientRef = useRef<HTMLDivElement>(null);
  const pillarRef = useRef<HTMLDivElement>(null);
  const clientListId = useId();
  const pillarListId = useId();

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
    if (!clientOpen && !pillarOpen) return;

    function onPointerDown(event: MouseEvent) {
      const target = event.target as Node;
      if (clientOpen && !clientRef.current?.contains(target)) {
        setClientOpen(false);
      }
      if (pillarOpen && !pillarRef.current?.contains(target)) {
        setPillarOpen(false);
      }
    }

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setClientOpen(false);
        setPillarOpen(false);
      }
    }

    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [clientOpen, pillarOpen]);

  function push(patch: {
    clientType?: string;
    pillar?: string;
    q?: string;
  }) {
    const params = new URLSearchParams();
    const clientType =
      "clientType" in patch ? patch.clientType : currentClientType;
    const pillar = "pillar" in patch ? patch.pillar : currentPillar;
    const q = "q" in patch ? patch.q : currentQuery;
    if (clientType) params.set("clientType", clientType);
    if (pillar) params.set("pillar", pillar);
    if (q) params.set("q", q);
    const qs = params.toString();
    startTransition(() => {
      router.push(
        qs
          ? `${pathname}?${qs}#all-case-studies`
          : `${pathname}#all-case-studies`,
      );
    });
  }

  return (
    <div
      className={cn(
        "flex flex-col gap-3 transition-opacity sm:flex-row sm:items-stretch",
        pending && "opacity-70",
      )}
    >
      <label className="relative min-w-0 flex-1">
        <span className="sr-only">Search case studies</span>
        <MagnifyingGlass
          weight="bold"
          className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-charcoal/40"
          aria-hidden
        />
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search"
          className="min-h-11 w-full rounded-sm border border-charcoal/15 bg-white py-2.5 pr-3.5 pl-10 text-[0.875rem] text-charcoal outline-none placeholder:text-charcoal/40 focus:border-forest"
        />
      </label>

      <FilterDropdown
        ref={clientRef}
        listId={clientListId}
        label="Client type"
        value={currentClientType}
        open={clientOpen}
        onOpenChange={(open) => {
          setClientOpen(open);
          if (open) setPillarOpen(false);
        }}
        options={["All", ...CASE_STUDY_CLIENT_TYPES]}
        onSelect={(value) => {
          setClientOpen(false);
          push({ clientType: value === "All" ? undefined : value });
        }}
      />

      <FilterDropdown
        ref={pillarRef}
        listId={pillarListId}
        label="Pillar"
        value={currentPillar}
        open={pillarOpen}
        onOpenChange={(open) => {
          setPillarOpen(open);
          if (open) setClientOpen(false);
        }}
        options={["All", ...CASE_STUDY_PILLARS]}
        onSelect={(value) => {
          setPillarOpen(false);
          push({ pillar: value === "All" ? undefined : value });
        }}
      />
    </div>
  );
}

function FilterDropdown({
  ref,
  listId,
  label,
  value,
  open,
  onOpenChange,
  options,
  onSelect,
}: {
  ref: React.RefObject<HTMLDivElement | null>;
  listId: string;
  label: string;
  value?: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  options: readonly string[];
  onSelect: (value: string) => void;
}) {
  const triggerLabel = value ?? label;

  return (
    <div className="relative sm:min-w-[11.5rem]" ref={ref}>
      <button
        type="button"
        aria-expanded={open}
        aria-haspopup="listbox"
        aria-controls={listId}
        onClick={() => onOpenChange(!open)}
        className={cn(
          "inline-flex h-11 w-full cursor-pointer items-center justify-between gap-3 rounded-sm border px-3.5 text-left text-[0.8125rem] font-medium transition-colors",
          "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-forest",
          open || value
            ? "border-forest text-forest"
            : "border-charcoal/15 bg-white text-charcoal hover:border-forest/40",
        )}
      >
        <span className="truncate">{triggerLabel}</span>
        <CaretDown
          weight="bold"
          className={cn(
            "size-3 shrink-0 transition-transform duration-300",
            open && "rotate-180",
          )}
          aria-hidden
        />
      </button>

      {open ? (
        <ul
          id={listId}
          role="listbox"
          aria-label={label}
          className="absolute top-[calc(100%+0.35rem)] right-0 left-0 z-30 overflow-hidden rounded-sm border border-charcoal/10 bg-[#FBF8F5] py-1.5 shadow-[0_16px_36px_rgba(28,26,23,0.12)]"
        >
          {options.map((option) => {
            const isAll = option === "All";
            const active = isAll ? !value : value === option;

            return (
              <li key={option} role="option" aria-selected={active}>
                <button
                  type="button"
                  onClick={() => onSelect(option)}
                  className={cn(
                    "flex w-full cursor-pointer items-center px-3.5 py-2.5 text-left text-[0.8125rem] transition-colors",
                    active
                      ? "bg-forest/10 font-medium text-forest"
                      : "text-charcoal/75 hover:bg-charcoal/[0.04] hover:text-charcoal",
                  )}
                >
                  {isAll ? `All ${label.toLowerCase()}s` : option}
                </button>
              </li>
            );
          })}
        </ul>
      ) : null}
    </div>
  );
}
