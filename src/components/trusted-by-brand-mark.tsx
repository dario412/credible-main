"use client";

import { useEffect, useState } from "react";

import { isMediaAssetUrl } from "@/lib/media";
import { logoAltFor } from "@/lib/image-alt";
import { cn } from "@/lib/utils";

/**
 * Measure the non-empty (non-near-black) content box so padded logo uploads
 * can be scaled up to match tight wordmarks in the Trusted-by grid.
 */
function contentFillRatio(img: HTMLImageElement): number | null {
  try {
    const w = img.naturalWidth;
    const h = img.naturalHeight;
    if (!w || !h) return null;

    const canvas = document.createElement("canvas");
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    if (!ctx) return null;

    ctx.drawImage(img, 0, 0);
    const { data } = ctx.getImageData(0, 0, w, h);

    let minY = h;
    let maxY = 0;
    for (let y = 0; y < h; y++) {
      for (let x = 0; x < w; x++) {
        const i = (y * w + x) * 4;
        const a = data[i + 3] ?? 0;
        if (a < 24) continue;
        const brightness =
          ((data[i] ?? 0) + (data[i + 1] ?? 0) + (data[i + 2] ?? 0)) / 3;
        // Treat near-black canvas padding as empty.
        if (brightness < 28) continue;
        minY = Math.min(minY, y);
        maxY = Math.max(maxY, y);
      }
    }

    if (maxY < minY) return null;
    return (maxY - minY + 1) / h;
  } catch {
    // Tainted canvas / decode failure — leave scale at 1.
    return null;
  }
}

export function TrustedByBrandMark({
  name,
  logoSrc,
  tone,
}: {
  name: string;
  logoSrc: string;
  tone: "light" | "dark";
}) {
  const [scale, setScale] = useState(1);
  // Only media uploads need padding compensation. Curated /brand SVGs already
  // fill their viewBox; measuring them via canvas invents false letterboxing.
  const shouldCompensate = isMediaAssetUrl(logoSrc);

  useEffect(() => {
    if (!shouldCompensate) {
      setScale(1);
      return;
    }

    let cancelled = false;
    const img = new window.Image();
    img.decoding = "async";
    img.onload = () => {
      if (cancelled) return;
      const fill = contentFillRatio(img);
      if (fill == null || fill >= 0.58) {
        setScale(1);
        return;
      }
      // Grow until content uses ~70% of the slot; cap so extremes stay civil.
      setScale(Math.min(3.5, 0.7 / fill));
    };
    img.onerror = () => {
      if (!cancelled) setScale(1);
    };
    img.src = logoSrc;
    return () => {
      cancelled = true;
    };
  }, [logoSrc, shouldCompensate]);

  return (
    <img
      src={logoSrc}
      alt={logoAltFor(name)}
      className={cn(
        "h-full w-auto max-w-full object-contain object-center transition-[opacity,transform] duration-200",
        tone === "dark" ? "brightness-0 invert" : "brightness-0",
      )}
      style={scale === 1 ? undefined : { transform: `scale(${scale})` }}
    />
  );
}
