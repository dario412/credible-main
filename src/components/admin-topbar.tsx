"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { cn } from "@/lib/utils";

export function AdminTopbar({
  email,
  name,
  items,
}: {
  email: string;
  name?: string | null;
  items: Array<{ href: string; label: string }>;
}) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const current =
    items.find((item) =>
      item.href === "/admin"
        ? pathname === "/admin"
        : pathname.startsWith(item.href),
    )?.label ?? "Admin";

  return (
    <header className="sticky top-0 z-20 flex h-14 shrink-0 items-center justify-between gap-4 border-b border-charcoal/10 bg-white/90 px-5 backdrop-blur-sm md:px-7">
      <div className="flex min-w-0 items-center gap-3">
        <button
          type="button"
          className="flex h-8 w-8 items-center justify-center rounded-md border border-charcoal/10 text-charcoal md:hidden"
          aria-expanded={open}
          aria-label="Open menu"
          onClick={() => setOpen((v) => !v)}
        >
          <span className="sr-only">Menu</span>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
            <path d="M2.5 4.5h11M2.5 8h11M2.5 11.5h11" stroke="currentColor" strokeWidth="1.25" />
          </svg>
        </button>
        <div className="min-w-0">
          <p className="truncate text-sm font-medium">{current}</p>
          <p className="hidden text-[11px] text-muted sm:block">
            Credible Creators admin
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <Link
          href="/"
          className="hidden text-xs text-muted transition-colors hover:text-forest sm:inline"
        >
          View site
        </Link>
        <div className="hidden h-4 w-px bg-charcoal/10 sm:block" />
        <p className="truncate text-xs text-muted">{email}</p>
      </div>

      {open ? (
        <div className="absolute left-0 right-0 top-14 border-b border-charcoal/10 bg-white p-3 md:hidden">
          <nav className="flex flex-col gap-0.5">
            {items.map((item) => {
              const active =
                item.href === "/admin"
                  ? pathname === "/admin"
                  : pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className={cn(
                    "flex h-10 items-center rounded-md px-3 text-sm",
                    active
                      ? "bg-forest/8 font-medium text-forest"
                      : "text-charcoal/75",
                  )}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
          <p className="mt-3 px-3 text-xs text-muted">
            Signed in as {name ?? email}
          </p>
        </div>
      ) : null}
    </header>
  );
}
