import type {
  BrandColor,
  CtaStyle,
  HeadlineSize,
  HeadlineStyle,
  Radius,
  TextSize,
  TextStyle,
} from "@/lib/cms";
import { cn } from "@/lib/utils";

const BG: Record<BrandColor, string> = {
  charcoal: "bg-charcoal",
  cream: "bg-cream",
  "cream-dark": "bg-cream-dark",
  forest: "bg-forest",
  "forest-dark": "bg-forest-dark",
};

const TEXT: Record<BrandColor, string> = {
  charcoal: "text-charcoal",
  cream: "text-cream",
  "cream-dark": "text-cream-dark",
  forest: "text-forest",
  "forest-dark": "text-forest-dark",
};

const BORDER: Record<BrandColor, string> = {
  charcoal: "border-charcoal/20",
  cream: "border-cream",
  "cream-dark": "border-cream-dark",
  forest: "border-forest",
  "forest-dark": "border-forest-dark",
};

const HEADLINE_SIZE: Record<HeadlineSize, string> = {
  md: "text-[2rem] sm:text-[2.5rem] md:text-[3rem] lg:text-[3.25rem]",
  lg: "text-[2.25rem] sm:text-[2.85rem] md:text-[3.35rem] lg:text-[3.75rem]",
  xl: "text-[2.5rem] sm:text-[3.25rem] md:text-[3.75rem] lg:text-[4.15rem]",
};

const SUBHEAD_SIZE: Record<TextSize, string> = {
  sm: "text-[0.85rem] md:text-[0.95rem]",
  md: "text-[0.95rem] md:text-[1.05rem]",
  lg: "text-[1.05rem] md:text-[1.15rem]",
};

const CTA_SIZE: Record<TextSize, string> = {
  sm: "px-4 py-2 text-[0.75rem]",
  md: "px-6 py-3 text-[0.8125rem]",
  lg: "px-7 py-3.5 text-[0.875rem]",
};

const RADIUS: Record<Radius, string> = {
  none: "rounded-none",
  sm: "rounded-sm",
  md: "rounded-md",
};

export function headlineClassName(style: HeadlineStyle) {
  return cn(
    "font-display leading-[1.06] tracking-tight",
    HEADLINE_SIZE[style.size],
    TEXT[style.color],
  );
}

export function subheadClassName(style: TextStyle) {
  const muted =
    style.color === "charcoal" ? "text-charcoal/65" : TEXT[style.color];
  return cn("mx-auto mt-6 max-w-xl leading-relaxed", SUBHEAD_SIZE[style.size], muted);
}

export function ctaClassName(style: CtaStyle) {
  const hasBorder = style.border !== "none";
  return cn(
    "inline-flex items-center justify-center font-medium transition-opacity hover:opacity-90",
    BG[style.bg],
    TEXT[style.text],
    CTA_SIZE[style.size],
    RADIUS[style.radius],
    hasBorder
      ? cn("border", BORDER[style.border as BrandColor])
      : "border border-transparent",
  );
}

export const BRAND_COLOR_SWATCH: Record<BrandColor, string> = {
  charcoal: "#1c1a17",
  cream: "#f9f3ef",
  "cream-dark": "#f0e9e3",
  forest: "#345b47",
  "forest-dark": "#2a4939",
};
