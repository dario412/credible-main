"use client";

import { useEffect, useRef } from "react";

const FOREST = { r: 52, g: 91, b: 71 };

export function Home2WaveField({
  className = "",
  lineCount = 56,
  color = FOREST,
  baseWidth = 4.25,
  edgeFade = true,
}: {
  className?: string;
  lineCount?: number;
  color?: { r: number; g: number; b: number };
  baseWidth?: number;
  edgeFade?: boolean;
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
      const instance = new PatternCanvas(canvas, container, {
        color,
        lineCount,
        drawOnMobile: true,
        baseWidth,
        edgeFade,
      });
      instance.mount();
      instanceRef.current = instance;
    });

    return () => {
      cancelled = true;
      instanceRef.current?.destroy();
      instanceRef.current = null;
    };
  }, [color, lineCount, baseWidth, edgeFade]);

  return (
    <div
      ref={containerRef}
      className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}
      aria-hidden="true"
    >
      <canvas ref={canvasRef} className="block h-full w-full" />
    </div>
  );
}
