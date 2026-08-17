import Link from "next/link";
import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

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
    charcoal: "bg-charcoal text-cream hover:bg-charcoal/90",
    cream: "bg-cream text-charcoal hover:bg-cream-dark",
    forest: "bg-forest text-cream hover:bg-forest-dark",
  };
  return (
    <Link
      href={href}
      className={cn(
        "inline-flex items-center justify-center rounded-sm px-[22px] py-[13px] text-[0.8125rem] font-medium transition-colors",
        tones[tone],
        className,
      )}
    >
      {children}
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
        "inline-flex items-center justify-center rounded-sm border px-[22px] py-[13px] text-[0.8125rem] font-medium transition-colors",
        onDark
          ? "border-cream/35 text-cream hover:border-cream/60"
          : "border-charcoal/20 text-charcoal hover:border-charcoal/40",
        className,
      )}
    >
      {children}
    </Link>
  );
}
