"use client";

import Link from "next/link";
import { ArrowRight } from "@phosphor-icons/react";

import { cn } from "@/lib/utils";

export function ViewMoreLink({
  href,
  children = "View more",
  className,
}: {
  href: string;
  children?: React.ReactNode;
  className?: string;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "group inline-flex items-center gap-1.5 text-[0.8125rem] font-medium text-charcoal/55 transition-colors duration-300 hover:text-charcoal",
        className,
      )}
    >
      {children}
      <span
        aria-hidden
        className="relative inline-flex size-3.5 shrink-0 overflow-hidden"
      >
        <ArrowRight
          weight="bold"
          className="size-3.5 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-[120%]"
        />
        <ArrowRight
          weight="bold"
          className="absolute inset-0 size-3.5 -translate-x-[120%] transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-0"
        />
      </span>
    </Link>
  );
}
