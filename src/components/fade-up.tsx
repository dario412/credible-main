"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

import { cn } from "@/lib/utils";

/** Shared in-view fade-up used across expert profile surfaces. */
export function FadeUp({
  children,
  className,
  delay = 0,
  duration = 1100,
  y = 28,
  threshold = 0.2,
  rootMargin = "0px 0px -10% 0px",
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  duration?: number;
  y?: number;
  threshold?: number;
  rootMargin?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries[0]?.isIntersecting) return;
        setVisible(true);
        observer.disconnect();
      },
      { threshold, rootMargin },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold, rootMargin]);

  return (
    <div
      ref={ref}
      className={cn(
        "transition-[opacity,transform] ease-[cubic-bezier(0.22,1,0.36,1)]",
        visible ? "translate-y-0 opacity-100" : "opacity-0",
        className,
      )}
      style={{
        transitionDuration: `${duration}ms`,
        transitionDelay: visible ? `${delay}ms` : "0ms",
        transform: visible ? "translateY(0)" : `translateY(${y}px)`,
      }}
    >
      {children}
    </div>
  );
}
