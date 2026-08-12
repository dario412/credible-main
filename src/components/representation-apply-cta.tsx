import { ArrowRight } from "@phosphor-icons/react/ssr";

import { cn } from "@/lib/utils";

/** Background the CTA sits on — picks contrasting button colours. */
export type ApplyCtaSurface = "dark" | "light" | "accent";

const SURFACE_CLASS: Record<ApplyCtaSurface, string> = {
  /** Forest hero, charcoal footer */
  dark: "bg-cream text-charcoal hover:bg-cream-dark shadow-[0_8px_28px_rgba(28,26,23,0.18)]",
  /** Cream, cream-dark, off-white sections */
  light:
    "bg-charcoal text-cream hover:bg-charcoal/90 shadow-[0_8px_28px_rgba(28,26,23,0.14)]",
  /** Cream page sections — brand primary */
  accent:
    "bg-forest text-cream hover:bg-forest-dark shadow-[0_8px_28px_rgba(42,73,57,0.22)]",
};

const BASE =
  "inline-flex items-center justify-center gap-2 rounded-sm px-6 py-3.5 text-[0.875rem] font-medium transition-colors";

export function RepresentationApplyCta({
  surface = "light",
  children = "Apply now",
  className,
}: {
  surface?: ApplyCtaSurface;
  children?: React.ReactNode;
  className?: string;
}) {
  return (
    <a
      href="#apply"
      className={cn(BASE, SURFACE_CLASS[surface], className)}
    >
      {children}
      <ArrowRight weight="bold" className="size-3.5" aria-hidden />
    </a>
  );
}

export function RepresentationSecondaryCta({
  surface = "dark",
  href,
  children,
  className,
}: {
  surface?: "dark" | "light";
  href: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <a
      href={href}
      className={cn(
        BASE,
        surface === "dark"
          ? "border border-cream/35 bg-transparent text-cream hover:border-cream hover:bg-cream/10"
          : "border border-charcoal/20 bg-transparent text-charcoal hover:border-charcoal/40 hover:bg-charcoal/5",
        className,
      )}
    >
      {children}
    </a>
  );
}
