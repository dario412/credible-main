"use client";

import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

export function EditableHit({
  active,
  selected,
  onSelect,
  children,
  label,
  block = false,
  ringOffset = "ring-offset-cream",
  className,
}: {
  active: boolean;
  selected: boolean;
  onSelect: () => void;
  children: ReactNode;
  label: string;
  block?: boolean;
  ringOffset?: string;
  className?: string;
}) {
  if (!active) {
    return (
      <div className={cn(block && "block w-full", className)}>{children}</div>
    );
  }

  return (
    <div
      className={cn(
        "relative max-w-full",
        block ? "block w-full" : "inline-block",
        className,
      )}
    >
      <button
        type="button"
        aria-label={`Edit ${label}`}
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          onSelect();
        }}
        className={cn(
          "absolute inset-0 z-20 cursor-pointer rounded-sm ring-2 ring-offset-2 transition-shadow",
          ringOffset,
          selected ? "ring-forest" : "ring-transparent hover:ring-forest/50",
        )}
      />
      <div className={cn(selected && "relative z-10")}>{children}</div>
    </div>
  );
}

/** Render CMS strings that may contain explicit newlines. */
export function MultilineText({
  text,
  as: Tag = "span",
  className,
}: {
  text: string;
  as?: "span" | "h2" | "h1" | "p";
  className?: string;
}) {
  const lines = text.split("\n");
  return (
    <Tag className={className}>
      {lines.map((line, i) => (
        <span key={`${i}-${line.slice(0, 12)}`}>
          {i > 0 ? <br /> : null}
          {line}
        </span>
      ))}
    </Tag>
  );
}
