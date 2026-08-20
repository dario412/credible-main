import { ArrowRight } from "@phosphor-icons/react/ssr";
import Link from "next/link";
import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

const LINK_EASE = "duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]";

function LinkArrow() {
  return (
    <span
      aria-hidden
      className="relative inline-flex size-3.5 shrink-0 overflow-hidden"
    >
      <ArrowRight
        weight="bold"
        className={cn(
          "size-3.5 transition-transform",
          LINK_EASE,
          "group-hover:translate-x-[120%] group-focus-visible:translate-x-[120%]",
        )}
      />
      <ArrowRight
        weight="bold"
        className={cn(
          "absolute inset-0 size-3.5 -translate-x-[120%] transition-transform",
          LINK_EASE,
          "group-hover:translate-x-0 group-focus-visible:translate-x-0",
        )}
      />
    </span>
  );
}

export const PAGE_SHELL = "mx-auto max-w-352";

export const EYEBROW =
  "text-[0.68rem] font-medium tracking-[0.16em] text-forest uppercase";

export const EYEBROW_MUTED =
  "text-[0.68rem] font-medium tracking-[0.16em] text-charcoal/45 uppercase";

export const EYEBROW_ON_DARK =
  "text-[0.68rem] font-medium tracking-[0.16em] text-cream/60 uppercase";

export function PagePrimaryLink({
  href,
  children,
  className,
  tone = "charcoal",
}: {
  href: string;
  children: ReactNode;
  className?: string;
  tone?: "charcoal" | "cream" | "forest";
}) {
  const tones = {
    charcoal:
      "bg-charcoal text-cream hover:bg-forest hover:text-cream hover:shadow-[0_12px_28px_rgba(42,73,57,0.28)]",
    cream:
      "bg-cream text-charcoal hover:bg-forest hover:text-cream hover:shadow-[0_12px_28px_rgba(42,73,57,0.32)]",
    forest:
      "bg-forest text-cream hover:bg-cream hover:text-charcoal hover:shadow-[0_12px_28px_rgba(28,26,23,0.16)]",
  };
  return (
    <Link
      href={href}
      className={cn(
        "group relative inline-flex items-center justify-center gap-2 rounded-sm px-[22px] py-[13px] text-[0.8125rem] font-medium whitespace-nowrap",
        "transition-[color,background-color,box-shadow,transform]",
        LINK_EASE,
        "hover:-translate-y-px active:translate-y-0 active:scale-[0.98]",
        "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-forest",
        "motion-reduce:transition-none motion-reduce:hover:translate-y-0 motion-reduce:active:scale-100",
        tones[tone],
        className,
      )}
    >
      <span className="relative">{children}</span>
      <LinkArrow />
    </Link>
  );
}

export function PageGhostLink({
  href,
  children,
  className,
  onDark = false,
}: {
  href: string;
  children: ReactNode;
  className?: string;
  onDark?: boolean;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "group relative inline-flex items-center justify-center gap-2 rounded-sm border px-[22px] py-[13px] text-[0.8125rem] font-medium whitespace-nowrap",
        "transition-[color,background-color,border-color,box-shadow,transform]",
        LINK_EASE,
        "hover:-translate-y-px active:translate-y-0 active:scale-[0.98]",
        "focus-visible:outline-2 focus-visible:outline-offset-2",
        "motion-reduce:transition-none motion-reduce:hover:translate-y-0 motion-reduce:active:scale-100",
        onDark
          ? "border-cream/35 text-cream hover:border-cream hover:bg-cream hover:text-charcoal hover:shadow-[0_12px_28px_rgba(249,243,239,0.18)] focus-visible:outline-cream"
          : "border-charcoal/20 text-charcoal hover:border-charcoal hover:bg-charcoal hover:text-cream hover:shadow-[0_12px_28px_rgba(28,26,23,0.16)] focus-visible:outline-forest",
        className,
      )}
    >
      <span className="relative">{children}</span>
      <LinkArrow />
    </Link>
  );
}
