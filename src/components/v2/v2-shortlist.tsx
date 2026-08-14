"use client";

import Image from "next/image";
import Link from "next/link";
import { ListChecks, X } from "@phosphor-icons/react";
import { useEffect, useRef, useState } from "react";

import {
  briefAllHref,
  clearShortlist,
  removeFromShortlist,
  useShortlist,
} from "@/lib/shortlist";
import { cn } from "@/lib/utils";

export function V2Shortlist() {
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
    <div ref={rootRef} className="relative flex shrink-0">
      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        aria-expanded={open}
        aria-label={
          entries.length === 1
            ? "Shortlist, 1 creator"
            : `Shortlist, ${entries.length} creators`
        }
        className="relative flex size-11 cursor-pointer items-center justify-center rounded-full bg-[var(--v2-evergreen)] text-[var(--v2-snow)] transition-transform active:scale-[0.98]"
      >
        <ListChecks className="size-[18px]" weight="bold" aria-hidden />
        {entries.length > 0 ? (
          <span className="absolute -top-0.5 -right-0.5 flex size-[19px] items-center justify-center rounded-full border-2 border-[var(--v2-snow)] bg-[var(--v2-ember)] text-[10px] leading-none font-semibold text-[var(--v2-snow)]">
            {entries.length}
          </span>
        ) : null}
      </button>

      {open ? (
        <div className="absolute top-[calc(100%+0.6rem)] right-0 z-50 w-[min(21rem,calc(100vw-2rem))] overflow-hidden rounded-[16px] border border-[var(--v2-rule-glacier)] bg-[var(--v2-snow)] shadow-[0_18px_44px_rgba(14,26,20,0.16)]">
          <div className="flex items-center justify-between gap-3 border-b border-[var(--v2-rule-light)] px-4 py-3">
            <p className="text-[13px] font-medium text-[var(--v2-timberline)]">
              Shortlist
              {entries.length > 0 ? (
                <span className="text-[var(--v2-lichen)]"> {entries.length}</span>
              ) : null}
            </p>
            {entries.length > 0 ? (
              <button
                type="button"
                onClick={() => clearShortlist()}
                className="cursor-pointer text-[12px] font-medium text-[var(--v2-lichen)] hover:text-[var(--v2-timberline)]"
              >
                Clear
              </button>
            ) : null}
          </div>
          {entries.length === 0 ? (
            <p className="px-4 py-6 text-[13px] leading-relaxed text-[var(--v2-lichen)]">
              Shortlist creators from the roster, then send one brief.
            </p>
          ) : (
            <ul className="max-h-72 overflow-auto py-1">
              {entries.map((entry) => (
                <li
                  key={entry.slug}
                  className="flex items-center gap-3 px-4 py-2"
                >
                  <div className="relative size-9 shrink-0 overflow-hidden rounded-full bg-[var(--v2-glacier)]">
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
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[13px] font-medium text-[var(--v2-timberline)]">
                      {entry.name}
                    </p>
                    {entry.role ? (
                      <p className="truncate text-[12px] text-[var(--v2-lichen)]">
                        {entry.role}
                      </p>
                    ) : null}
                  </div>
                  <button
                    type="button"
                    onClick={() => removeFromShortlist(entry.slug)}
                    aria-label={`Remove ${entry.name}`}
                    className="cursor-pointer rounded-full p-1 text-[var(--v2-lichen)] hover:text-[var(--v2-timberline)]"
                  >
                    <X className="size-4" weight="bold" />
                  </button>
                </li>
              ))}
            </ul>
          )}
          {entries.length > 0 ? (
            <div className="border-t border-[var(--v2-rule-light)] p-3">
              <Link
                href={briefAllHref(entries)}
                onClick={() => setOpen(false)}
                className="flex h-11 items-center justify-center rounded-full bg-[var(--v2-evergreen)] text-[14px] font-medium text-[var(--v2-snow)]"
              >
                Send brief with shortlist
              </Link>
            </div>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
