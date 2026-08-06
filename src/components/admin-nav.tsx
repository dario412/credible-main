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
  "/admin/insights": (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
      <path d="M3 3.5h10v9H3z" stroke="currentColor" strokeWidth="1.25" />
      <path d="M5.5 6.5h5M5.5 9h3.5" stroke="currentColor" strokeWidth="1.25" />
    </svg>
  ),
  "/admin/case-studies": (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
      <path d="M3.5 4.5h9v8h-9z" stroke="currentColor" strokeWidth="1.25" />
      <path d="M5.5 2.5h5v2h-5z" stroke="currentColor" strokeWidth="1.25" />
    </svg>
  ),
  "/admin/trusted-by": (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
      <path d="M2.5 8h11M8 2.5v11" stroke="currentColor" strokeWidth="1.25" />
      <circle cx="8" cy="8" r="5.25" stroke="currentColor" strokeWidth="1.25" />
    </svg>
  ),
  "/admin/media": (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
      <path d="M2.5 3.5h11v9H2.5z" stroke="currentColor" strokeWidth="1.25" />
      <circle cx="5.5" cy="6.25" r="1.1" fill="currentColor" />
      <path d="M2.5 10.5 6 7.5l2.2 2 2-2.5 3.3 3.5" stroke="currentColor" strokeWidth="1.25" strokeLinejoin="round" />
    </svg>
  ),
  "/admin/roster": (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
      <circle cx="5.5" cy="5" r="2" stroke="currentColor" strokeWidth="1.25" />
      <circle cx="10.5" cy="5" r="2" stroke="currentColor" strokeWidth="1.25" />
      <path d="M2.5 13c.5-2 1.8-3 3-3s2.5 1 3 3M7.5 13c.5-2 1.8-3 3-3s2.5 1 3 3" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" />
    </svg>
  ),
  "/admin/pages": (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
      <path d="M4 2.5h5.5L12 5v8.5H4z" stroke="currentColor" strokeWidth="1.25" />
      <path d="M9.5 2.5V5H12" stroke="currentColor" strokeWidth="1.25" />
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
