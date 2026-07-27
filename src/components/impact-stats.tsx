"use client";

import { useEffect, useRef, useState } from "react";

import { StatCounter } from "@/components/stat-counter";
import { cn } from "@/lib/utils";

const stats = [
  {
    value: "24",
    detail: "Signed creators across 4 archetypes",
  },
  {
    value: "18.4M",
    detail: "Combined reach across channels",
  },
  {
    value: "60+",
    detail: "Brand partners booked with Credible",
  },
  {
    value: "142",
    detail: "Stages and sessions delivered",
  },
] as const;

export function ImpactStats() {
  const listRef = useRef<HTMLUListElement>(null);
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
    <section className="bg-cream px-6 py-16 md:px-10 md:py-20 lg:px-12">
      <div className="mx-auto max-w-352">
        <h2 className="max-w-2xl font-display text-[2rem] leading-[1.12] tracking-tight text-charcoal sm:text-[2.4rem] md:text-[2.75rem]">
          Credible gives your brand
          <br />
          an unfair advantage.
        </h2>

        <ul
          ref={listRef}
          className="mt-10 grid gap-3 sm:grid-cols-2 md:mt-12 md:gap-4 lg:grid-cols-4"
        >
          {stats.map((stat, index) => (
            <li
              key={stat.detail}
              className={cn(
                "flex min-h-44 flex-col justify-between rounded-sm bg-cream-dark px-6 pb-6 pt-7 transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] md:min-h-50 md:px-7",
                visible
                  ? "translate-y-0 opacity-100"
                  : "translate-y-10 opacity-0",
              )}
              style={{ transitionDelay: visible ? `${index * 140}ms` : "0ms" }}
            >
              <p className="font-display text-[3.25rem] leading-none tracking-tight text-charcoal md:text-[3.85rem]">
                <StatCounter
                  value={stat.value}
                  delay={index * 140}
                  duration={1400 + index * 80}
                />
              </p>
              <p className="mt-8 text-[0.95rem] leading-snug text-charcoal/70">
                {stat.detail}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
