"use client";

import { useEffect, useRef, useState } from "react";

import { StatCounter } from "@/components/stat-counter";
import { cn } from "@/lib/utils";

export function V2ImpactStats({
  stats,
}: {
  stats: { value: string; detail: string }[];
}) {
  const listRef = useRef<HTMLDListElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = listRef.current;
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
      { threshold: 0.25 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <dl
      ref={listRef}
      className="grid grid-cols-2 gap-8 lg:grid-cols-4 lg:gap-8"
    >
      {stats.map((stat, index) => (
        <div
          key={`${stat.value}-${index}`}
          className={cn(
            "flex flex-col gap-4 transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]",
            visible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0",
          )}
          style={{
            transitionDelay: visible ? `${index * 140}ms` : "0ms",
          }}
        >
          <dt className="sr-only">{stat.detail}</dt>
          <dd
            className={cn(
              "v2-display text-[clamp(2.4rem,4vw,4.5rem)] leading-[1.03] tracking-[-0.03em]",
              index === 1
                ? "text-[var(--v2-ember)]"
                : "text-[var(--v2-timberline)]",
            )}
          >
            <StatCounter
              value={stat.value}
              delay={index * 140}
              duration={1400 + index * 80}
            />
          </dd>
          <p className="text-[15px] leading-6 text-[var(--v2-lichen)]">
            {stat.detail}
          </p>
        </div>
      ))}
    </dl>
  );
}
