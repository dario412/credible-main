import Link from "next/link";
import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

export function V2PrimaryLink({
  href,
  children,
  className,
}: {
  href: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "inline-flex h-14 items-center justify-center rounded-full bg-[var(--v2-evergreen)] px-[34px] text-[16px] leading-5 font-medium text-[var(--v2-snow)] shadow-[0_1px_2px_rgba(14,26,20,0.08),0_8px_28px_rgba(14,26,20,0.12)] transition-transform active:scale-[0.98]",
        className,
      )}
    >
      {children}
    </Link>
  );
}

export function V2GhostLink({
  href,
  children,
  className,
}: {
  href: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "inline-flex h-14 items-center justify-center rounded-full border border-[var(--v2-border)] bg-[var(--v2-snow)] px-8 text-[16px] leading-5 font-medium text-[var(--v2-timberline)] shadow-[0_1px_2px_rgba(14,26,20,0.06),0_8px_22px_rgba(14,26,20,0.08)] transition-transform active:scale-[0.98]",
        className,
      )}
    >
      {children}
    </Link>
  );
}

export function V2Eyebrow({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <p
      className={cn(
        "text-[13px] leading-4 font-semibold tracking-[0.08em] text-[var(--v2-ember)] uppercase",
        className,
      )}
    >
      {children}
    </p>
  );
}

export function V2PageHero({
  badge,
  live = false,
  headline,
  headlineClassName,
  subhead,
  actions,
  aside,
}: {
  badge: string;
  live?: boolean;
  headline: ReactNode;
  headlineClassName?: string;
  subhead: string;
  actions: ReactNode;
  aside: ReactNode;
}) {
  return (
    <section className="bg-white pt-28 pb-[120px]">
      <div className="v2-container grid items-end gap-12 lg:grid-cols-[1fr_minmax(20rem,26rem)] lg:gap-[88px]">
        <div className="flex flex-col gap-8">
          <span className="inline-flex w-max items-center gap-2.5 rounded-full border border-[var(--v2-rule-light)] bg-[var(--v2-glacier)] px-3 py-2">
            <span
              className={cn(
                "size-2 shrink-0 rounded-full",
                live ? "bg-[var(--v2-live)]" : "bg-[var(--v2-snow)]",
              )}
            />
            <span className="text-[13px] leading-[18px] font-medium text-[var(--v2-evergreen-deep)]">
              {badge}
            </span>
          </span>
          <h1
            className={cn(
              "v2-display max-w-[54rem] leading-[1.1] text-[var(--v2-timberline)]",
              headlineClassName ?? "text-[clamp(2.6rem,6vw,5rem)]",
            )}
          >
            {headline}
          </h1>
          <p className="max-w-[46rem] text-[20px] leading-8 text-[var(--v2-lichen)]">
            {subhead}
          </p>
          {actions}
        </div>
        {aside}
      </div>
    </section>
  );
}

export function V2AsideCard({
  label,
  title,
  children,
}: {
  label: string;
  title: string;
  children: ReactNode;
}) {
  return (
    <aside className="flex flex-col overflow-hidden rounded-[16px] bg-[var(--v2-evergreen)] shadow-[0_1px_2px_rgba(14,26,20,0.06),0_16px_40px_rgba(14,26,20,0.08)]">
      <div className="border-b border-[var(--v2-rule-evergreen)] p-7">
        <p className="text-[13px] leading-[18px] font-medium tracking-[0.08em] text-[var(--v2-on-dark-muted)] uppercase">
          {label}
        </p>
        <p className="v2-display mt-3.5 text-[32px] leading-10 tracking-[-0.02em] text-[var(--v2-snow)]">
          {title}
        </p>
      </div>
      <div className="px-7 pt-2.5 pb-7">{children}</div>
    </aside>
  );
}
