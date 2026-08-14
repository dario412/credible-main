"use client";

import Link from "next/link";
import { List, X } from "@phosphor-icons/react";
import { useState } from "react";

import { ArrowRightIcon, ChevronRightIcon } from "@/components/v2/v2-icons";
import { V2Shortlist } from "@/components/v2/v2-shortlist";
import { V2Wordmark } from "@/components/v2/v2-wordmark";
import type { NavLink } from "@/lib/site-chrome";
import { cn } from "@/lib/utils";

function SlideCta({
  href,
  label,
  className,
  onClick,
}: {
  href: string;
  label: string;
  className?: string;
  onClick?: () => void;
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className={cn(
        "group inline-flex items-center overflow-hidden rounded-full bg-[var(--v2-timberline)] px-[22px] py-[13px] text-[14px] leading-[18px] font-medium text-[var(--v2-snow)] transition-transform active:scale-[0.98]",
        className,
      )}
    >
      <span className="relative inline-flex items-center overflow-hidden">
        <span className="invisible inline-flex items-center gap-2">
          <span className="whitespace-nowrap">{label}</span>
          <ArrowRightIcon className="size-[15px] shrink-0" />
        </span>
        <span className="absolute inset-y-0 left-0 inline-flex items-center gap-2 transition-transform duration-200 ease-[cubic-bezier(0.22,1,0.36,1)] -translate-x-[calc(15px+0.5rem)] group-hover:translate-x-0 group-focus-visible:translate-x-0">
          <ArrowRightIcon className="size-[15px] shrink-0" />
          <span className="whitespace-nowrap">{label}</span>
          <ArrowRightIcon className="size-[15px] shrink-0" />
        </span>
      </span>
    </Link>
  );
}

export function V2Nav({
  links,
  ctaLabel,
  creatorCount,
}: {
  links: NavLink[];
  ctaLabel: string;
  creatorCount: number;
}) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Link
        href="/roster"
        className="flex items-center justify-center gap-2 bg-[var(--v2-ember)] py-1.5 pr-2 pl-3"
      >
        <span className="size-1.5 shrink-0 rounded-full bg-[var(--v2-on-ember)]" />
        <span className="text-[13px] leading-4 font-medium text-[var(--v2-on-ember)]">
          New: {creatorCount}+ creators with Q3 availability
        </span>
        <span className="flex size-5 items-center justify-center rounded-full bg-[var(--v2-snow)] text-[var(--v2-ember)]">
          <ChevronRightIcon className="size-3" />
        </span>
      </Link>
      <header className="sticky top-0 z-50 bg-[var(--v2-snow)]">
      <div className="v2-container pt-4 pb-2">
      <div className="v2-nav-pill flex w-full items-center justify-between gap-3 rounded-full border border-[#E1E7E3] bg-[#FFFFFFEB] py-[11px] pr-[11px] pl-7 shadow-[0_8px_28px_rgba(14,26,20,0.07)] backdrop-blur-md">
        <V2Wordmark className="text-[25px] leading-none" />

        <nav className="hidden items-center gap-0.5 lg:flex" aria-label="Primary">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-full px-[18px] py-2.5 text-[15px] leading-[18px] font-medium text-[var(--v2-timberline)] transition-colors hover:bg-[var(--v2-glacier)]"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <SlideCta href="#brief" label={ctaLabel} className="hidden sm:inline-flex" />
          <V2Shortlist />
          <button
            type="button"
            className="flex size-11 cursor-pointer items-center justify-center rounded-full text-[var(--v2-timberline)] lg:hidden"
            aria-expanded={open}
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen((current) => !current)}
          >
            {open ? <X className="size-5" weight="bold" /> : <List className="size-5" weight="bold" />}
          </button>
        </div>
      </div>

      {open ? (
        <div className="mt-2 rounded-[20px] border border-[var(--v2-rule-glacier)] bg-[var(--v2-snow)] p-4 shadow-[0_12px_32px_rgba(14,26,20,0.1)] lg:hidden">
          <nav className="flex flex-col gap-1" aria-label="Mobile">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="rounded-full px-4 py-3 text-[15px] font-medium text-[var(--v2-timberline)] hover:bg-[var(--v2-glacier)]"
              >
                {link.label}
              </Link>
            ))}
            <SlideCta
              href="#brief"
              label={ctaLabel}
              onClick={() => setOpen(false)}
              className="mt-2 justify-center px-5 py-3.5"
            />
          </nav>
        </div>
      ) : null}
      </div>
    </header>
    </>
  );
}
