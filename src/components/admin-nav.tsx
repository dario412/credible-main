"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const icons: Record<string, React.ReactNode> = {
  "/admin": (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
      <rect x="1.5" y="1.5" width="5.5" height="5.5" stroke="currentColor" strokeWidth="1.25" />
      <rect x="9" y="1.5" width="5.5" height="5.5" stroke="currentColor" strokeWidth="1.25" />
      <rect x="1.5" y="9" width="5.5" height="5.5" stroke="currentColor" strokeWidth="1.25" />
      <rect x="9" y="9" width="5.5" height="5.5" stroke="currentColor" strokeWidth="1.25" />
    </svg>
  ),
  "/admin/leads": (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
      <path d="M3 4.5h10M3 8h10M3 11.5h6" stroke="currentColor" strokeWidth="1.25" strokeLinecap="square" />
    </svg>
  ),
  "/admin/users": (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
      <circle cx="8" cy="5" r="2.25" stroke="currentColor" strokeWidth="1.25" />
      <path d="M3.5 13c.6-2.2 2.2-3.25 4.5-3.25S11.9 10.8 12.5 13" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" />
    </svg>
  ),
  "/admin/style-guide": (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
      <path d="M4 3.5h8v9H4z" stroke="currentColor" strokeWidth="1.25" />
      <path d="M6 6h4M6 8.5h4M6 11h2.5" stroke="currentColor" strokeWidth="1.25" />
    </svg>
  ),
};

export function AdminNav({
  items,
}: {
  items: Array<{ href: string; label: string }>;
}) {
  const pathname = usePathname();

  return (
    <nav className="flex w-full flex-col gap-0.5 px-3 py-4" aria-label="Admin">
      <p className="mb-2 px-3 text-[10px] font-semibold uppercase tracking-[0.14em] text-muted">
        Menu
      </p>
      {items.map((item) => {
        const active =
          item.href === "/admin"
            ? pathname === "/admin"
            : pathname.startsWith(item.href);

        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "relative flex h-10 w-full shrink-0 items-center gap-3 rounded-md px-3 text-sm transition-colors",
              active
                ? "bg-forest/8 font-medium text-forest"
                : "text-charcoal/70 hover:bg-charcoal/4 hover:text-charcoal",
            )}
          >
            <span
              className={cn(
                "absolute left-0 top-1/2 h-5 w-0.5 -translate-y-1/2 rounded-full transition-opacity",
                active ? "bg-forest opacity-100" : "opacity-0",
              )}
              aria-hidden
            />
            <span className="flex h-4 w-4 shrink-0 items-center justify-center">
              {icons[item.href] ?? null}
            </span>
            <span className="truncate">{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
