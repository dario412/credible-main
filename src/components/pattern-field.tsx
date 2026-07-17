"use client";

import { useEffect, useRef } from "react";

const DEFAULT_MASK =
  "linear-gradient(to right, transparent 0%, rgba(0,0,0,0.08) 12%, rgba(0,0,0,0.45) 35%, black 65%)";

export function PatternField({
  className = "",
  color,
  mask = DEFAULT_MASK,
}: {
  className?: string;
  color?: { r: number; g: number; b: number };
  mask?: string;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const instanceRef = useRef<{ destroy: () => void } | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    let cancelled = false;

    import("@/lib/pattern.js").then(({ PatternCanvas }) => {
      if (cancelled) return;
      const instance = new PatternCanvas(canvas, container, { color });
      instance.mount();
      instanceRef.current = instance;
    });

    return () => {
      cancelled = true;
      instanceRef.current?.destroy();
      instanceRef.current = null;
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className={`pointer-events-none absolute inset-y-0 right-0 z-1 hidden w-[58%] overflow-hidden md:block ${className}`}
      style={{
        WebkitMaskImage: mask,
        maskImage: mask,
      }}
      aria-hidden="true"
    >
      <canvas ref={canvasRef} className="block h-full w-full" />
    </div>
  );
}
