"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ListChecks, X } from "@phosphor-icons/react";
import { useEffect, useRef, useState } from "react";

import {
  briefAllHref,
  clearShortlist,
  removeFromShortlist,
  useShortlist,
} from "@/lib/shortlist";
import { cn } from "@/lib/utils";

export function ShortlistMenu({ inverted = false }: { inverted?: boolean }) {
  const entries = useShortlist();
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;

    function onPointerDown(event: MouseEvent) {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
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

  return (
    <div ref={rootRef} className="relative flex">
      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        aria-expanded={open}
        aria-label={
          entries.length === 1
            ? "Shortlist, 1 creator"
            : `Shortlist, ${entries.length} creators`
        }
        className={cn(
          "inline-flex cursor-pointer items-center justify-center rounded-sm border px-4 transition-colors",
          open
            ? "border-charcoal bg-charcoal text-cream"
            : inverted
              ? "border-cream/35 bg-forest text-cream hover:border-cream/55"
              : "border-charcoal/20 bg-cream text-charcoal hover:border-charcoal/45",
        )}
      >
        <span className="relative">
          <ListChecks className="size-5" aria-hidden />
          {entries.length > 0 ? (
            <span className="absolute -top-1.5 -right-2.5 inline-flex min-w-4 justify-center rounded-full bg-forest px-1 text-[0.625rem] leading-4 font-medium text-cream">
              {entries.length}
            </span>
          ) : null}
        </span>
      </button>

      {open ? (
        <div className="absolute top-[calc(100%+0.5rem)] right-0 w-[min(21rem,calc(100vw-2rem))] overflow-hidden rounded-sm border border-charcoal/10 bg-[#FBF8F5] text-left shadow-[0_18px_44px_rgba(28,26,23,0.16)]">
          <div className="flex items-center justify-between gap-3 border-b border-charcoal/8 px-4 py-3">
            <p className="text-[0.8125rem] font-medium text-charcoal">
              Shortlist
              {entries.length > 0 ? (
                <span className="text-charcoal/45"> · {entries.length}</span>
              ) : null}
            </p>
            {entries.length > 0 ? (
              <button
                type="button"
                onClick={clearShortlist}
                className="cursor-pointer text-[0.6875rem] font-medium text-charcoal/50 transition-colors hover:text-forest"
              >
                Clear all
              </button>
            ) : null}
          </div>

          {entries.length === 0 ? (
            <div className="px-4 py-6">
              <p className="text-[0.8125rem] leading-relaxed text-charcoal/60">
                No creators yet. Add them from the roster and brief the whole
                shortlist in one go.
              </p>
              <Link
                href="/roster"
                onClick={() => setOpen(false)}
                className="mt-4 inline-flex items-center gap-1.5 text-[0.75rem] font-medium text-forest transition-colors hover:text-forest-dark"
              >
                Browse the roster
                <ArrowRight weight="bold" className="size-3" aria-hidden />
              </Link>
            </div>
          ) : (
            <>
              <ul className="max-h-72 overflow-y-auto">
                {entries.map((entry) => (
                  <li
                    key={entry.slug}
                    className="flex items-center gap-3 border-b border-charcoal/6 px-4 py-2.5 last:border-b-0"
                  >
                    <div className="relative size-9 shrink-0 overflow-hidden rounded-sm bg-[#E4EBE6]">
                      {entry.image ? (
                        <Image
                          src={entry.image}
                          alt=""
                          fill
                          sizes="36px"
                          className="object-cover object-top"
                        />
                      ) : null}
                    </div>

                    <Link
                      href={`/roster/${entry.slug}`}
                      onClick={() => setOpen(false)}
                      className="min-w-0 flex-1"
                    >
                      <span className="block truncate text-[0.8125rem] font-medium text-charcoal transition-colors hover:text-forest">
                        {entry.name}
                      </span>
                      {entry.role ? (
                        <span className="block truncate text-[0.6875rem] text-charcoal/50">
                          {entry.role}
                        </span>
                      ) : null}
                    </Link>

                    <button
                      type="button"
                      onClick={() => removeFromShortlist(entry.slug)}
                      aria-label={`Remove ${entry.name} from shortlist`}
                      className="shrink-0 cursor-pointer p-1 text-charcoal/35 transition-colors hover:text-charcoal"
                    >
                      <X weight="bold" className="size-3.5" aria-hidden />
                    </button>
                  </li>
                ))}
              </ul>

              <div className="border-t border-charcoal/8 p-3">
                <Link
                  href={briefAllHref(entries)}
                  onClick={() => setOpen(false)}
                  className="group flex items-center justify-center gap-2 rounded-sm bg-forest px-4 py-3 text-[0.8125rem] font-medium text-cream transition-colors hover:bg-forest-dark"
                >
                  Send brief for all {entries.length}
                  <ArrowRight
                    weight="bold"
                    aria-hidden
                    className="size-3.5 transition-transform duration-300 group-hover:translate-x-0.5"
                  />
                </Link>
              </div>
            </>
          )}
        </div>
      ) : null}
    </div>
  );
}
