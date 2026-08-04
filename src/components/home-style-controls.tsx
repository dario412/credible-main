"use client";

import {
  BRAND_COLORS,
  type BrandColor,
  type CtaStyle,
  type HeadlineSize,
  type HeadlineStyle,
  type Radius,
  type TextSize,
  type TextStyle,
} from "@/lib/cms";
import { BRAND_COLOR_SWATCH } from "@/lib/home-styles";
import { cn } from "@/lib/utils";

function ChipRow({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <p className="text-[0.7rem] font-medium tracking-[0.08em] text-charcoal/50 uppercase">
        {label}
      </p>
      <div className="flex flex-wrap gap-1.5">{children}</div>
    </div>
  );
}

function Chip({
  active,
  onClick,
  children,
  title,
  className,
}: {
  active: boolean;
  onClick: () => void;
  children?: React.ReactNode;
  title?: string;
  className?: string;
}) {
  return (
    <button
      type="button"
      title={title}
      onClick={onClick}
      className={cn(
        "inline-flex h-7 min-w-7 items-center justify-center rounded-sm border px-2 text-[0.7rem] font-medium transition-colors",
        active
          ? "border-charcoal bg-charcoal text-cream"
          : "border-charcoal/15 bg-white text-charcoal/70 hover:border-charcoal/40",
        className,
      )}
    >
      {children}
    </button>
  );
}

function ColorChip({
  color,
  active,
  onClick,
  allowNone,
  isNone,
}: {
  color?: BrandColor;
  active: boolean;
  onClick: () => void;
  allowNone?: boolean;
  isNone?: boolean;
}) {
  if (allowNone && isNone) {
    return (
      <Chip active={active} onClick={onClick} title="None">
        None
      </Chip>
    );
  }
  if (!color) return null;
  return (
    <button
      type="button"
      title={color}
      onClick={onClick}
      className={cn(
        "h-7 w-7 rounded-sm border-2 transition-transform",
        active ? "scale-105 border-charcoal" : "border-charcoal/15 hover:border-charcoal/40",
      )}
      style={{ backgroundColor: BRAND_COLOR_SWATCH[color] }}
      aria-label={color}
    />
  );
}

export function HeadlineStyleControls({
  value,
  onChange,
}: {
  value: HeadlineStyle;
  onChange: (next: HeadlineStyle) => void;
}) {
  return (
    <div className="space-y-3">
      <ChipRow label="Color">
        {BRAND_COLORS.map((color) => (
          <ColorChip
            key={color}
            color={color}
            active={value.color === color}
            onClick={() => onChange({ ...value, color })}
          />
        ))}
      </ChipRow>
      <ChipRow label="Size">
        {(["md", "lg", "xl"] as HeadlineSize[]).map((size) => (
          <Chip
            key={size}
            active={value.size === size}
            onClick={() => onChange({ ...value, size })}
          >
            {size.toUpperCase()}
          </Chip>
        ))}
      </ChipRow>
    </div>
  );
}

export function TextStyleControls({
  value,
  onChange,
}: {
  value: TextStyle;
  onChange: (next: TextStyle) => void;
}) {
  return (
    <div className="space-y-3">
      <ChipRow label="Color">
        {BRAND_COLORS.map((color) => (
          <ColorChip
            key={color}
            color={color}
            active={value.color === color}
            onClick={() => onChange({ ...value, color })}
          />
        ))}
      </ChipRow>
      <ChipRow label="Size">
        {(["sm", "md", "lg"] as TextSize[]).map((size) => (
          <Chip
            key={size}
            active={value.size === size}
            onClick={() => onChange({ ...value, size })}
          >
            {size.toUpperCase()}
          </Chip>
        ))}
      </ChipRow>
    </div>
  );
}

export function CtaStyleControls({
  value,
  onChange,
}: {
  value: CtaStyle;
  onChange: (next: CtaStyle) => void;
}) {
  return (
    <div className="space-y-3">
      <ChipRow label="Background">
        {BRAND_COLORS.map((color) => (
          <ColorChip
            key={color}
            color={color}
            active={value.bg === color}
            onClick={() => onChange({ ...value, bg: color })}
          />
        ))}
      </ChipRow>
      <ChipRow label="Text">
        {BRAND_COLORS.map((color) => (
          <ColorChip
            key={color}
            color={color}
            active={value.text === color}
            onClick={() => onChange({ ...value, text: color })}
          />
        ))}
      </ChipRow>
      <ChipRow label="Border">
        <ColorChip
          allowNone
          isNone
          active={value.border === "none"}
          onClick={() => onChange({ ...value, border: "none" })}
        />
        {BRAND_COLORS.map((color) => (
          <ColorChip
            key={color}
            color={color}
            active={value.border === color}
            onClick={() => onChange({ ...value, border: color })}
          />
        ))}
      </ChipRow>
      <ChipRow label="Size">
        {(["sm", "md", "lg"] as TextSize[]).map((size) => (
          <Chip
            key={size}
            active={value.size === size}
            onClick={() => onChange({ ...value, size })}
          >
            {size.toUpperCase()}
          </Chip>
        ))}
      </ChipRow>
      <ChipRow label="Radius">
        {(["none", "sm", "md"] as Radius[]).map((radius) => (
          <Chip
            key={radius}
            active={value.radius === radius}
            onClick={() => onChange({ ...value, radius })}
          >
            {radius}
          </Chip>
        ))}
      </ChipRow>
    </div>
  );
}
