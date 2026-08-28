"use client";

import { useEffect, useId, useRef } from "react";

import { MediaField } from "@/components/media-library";

export function ImageAltEditorPopover({
  title,
  imageLabel,
  imageValue,
  altValue,
  suggestedAlt,
  altHint = "Describe the image for screen readers.",
  onImageChange,
  onAltChange,
  onClose,
}: {
  title: string;
  imageLabel: string;
  imageValue: string;
  altValue: string;
  suggestedAlt?: string;
  altHint?: string;
  onImageChange: (url: string) => void;
  onAltChange: (alt: string) => void;
  onClose: () => void;
}) {
  const titleId = useId();
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    function onPointer(e: MouseEvent) {
      if (!panelRef.current?.contains(e.target as Node)) onClose();
    }
    window.addEventListener("keydown", onKey);
    const t = window.setTimeout(() => {
      window.addEventListener("mousedown", onPointer);
    }, 0);
    return () => {
      window.clearTimeout(t);
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("mousedown", onPointer);
    };
  }, [onClose]);

  return (
    <div
      ref={panelRef}
      role="dialog"
      aria-labelledby={titleId}
      className="fixed top-20 right-4 z-[60] w-[min(100vw-2rem,24rem)] rounded-sm border border-charcoal/10 bg-white p-4 shadow-[0_18px_50px_rgba(28,26,23,0.16)]"
    >
      <div className="mb-3 flex items-center justify-between gap-3">
        <h2 id={titleId} className="font-display text-lg text-charcoal">
          {title}
        </h2>
        <button
          type="button"
          onClick={onClose}
          className="text-sm text-charcoal/50 hover:text-charcoal"
        >
          Close
        </button>
      </div>
      <div className="max-h-[70vh] space-y-4 overflow-y-auto pr-1">
        <MediaField
          label={imageLabel}
          value={imageValue}
          onChange={onImageChange}
          alt={altValue}
          onAltChange={onAltChange}
          suggestedAlt={suggestedAlt}
          altHint={altHint}
        />
      </div>
    </div>
  );
}
