"use client";

import { useEffect, useRef, useState } from "react";

/** Splits a stat like "$18.4M" into prefix ("$"), number ("18.4"), suffix ("M"). */
const STAT_PATTERN = /^([^0-9]*)([\d.]+)(.*)$/;

export function StatCounter({
  value,
  duration = 1600,
  className,
}: {
  value: string;
  duration?: number;
  className?: string;
}) {
  const match = value.match(STAT_PATTERN);
  const target = match ? parseFloat(match[2]) : 0;
  const decimals = match ? (match[2].split(".")[1] ?? "").length : 0;

  const ref = useRef<HTMLSpanElement>(null);
  const [display, setDisplay] = useState(match ? (0).toFixed(decimals) : value);

  useEffect(() => {
    const el = ref.current;
    if (!el || !match) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setDisplay(match[2]);
      return;
    }

    let raf = 0;
    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries[0].isIntersecting) return;
        observer.disconnect();

        const start = performance.now();
        const tick = (now: number) => {
          const t = Math.min((now - start) / duration, 1);
          const eased = 1 - Math.pow(1 - t, 3);
          setDisplay((target * eased).toFixed(decimals));
          if (t < 1) raf = requestAnimationFrame(tick);
        };
        raf = requestAnimationFrame(tick);
      },
      { threshold: 0.4 },
    );
    observer.observe(el);

    return () => {
      observer.disconnect();
      cancelAnimationFrame(raf);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!match) {
    return <span className={className}>{value}</span>;
  }

  return (
    <span ref={ref} className={className}>
      {match[1]}
      {display}
      {match[3]}
    </span>
  );
}
