"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

import { MultilineText } from "@/components/editable-hit";
import { StatCounter } from "@/components/stat-counter";
import { DEFAULT_HOME_SECTIONS, type HomePageSections } from "@/lib/cms";
import { cn } from "@/lib/utils";

export function ImpactStats({
  content = DEFAULT_HOME_SECTIONS.impact,
  editSlots,
}: {
  content?: HomePageSections["impact"];
  editSlots?: {
    headline?: (node: ReactNode) => ReactNode;
    stat?: (index: number, node: ReactNode) => ReactNode;
  };
}) {
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

  const headlineNode = (
    <MultilineText
      as="h2"
      text={content.headline}
      className="max-w-2xl font-display text-[2rem] leading-[1.12] tracking-tight text-charcoal sm:text-[2.4rem] md:text-[2.75rem]"
    />
  );

  return (
    <section className="bg-cream px-6 py-16 md:px-10 md:py-20 lg:px-12">
      <div className="mx-auto max-w-352">
        {editSlots?.headline ? editSlots.headline(headlineNode) : headlineNode}

        <ul
          ref={listRef}
          className="mt-10 grid gap-3 sm:grid-cols-2 md:mt-12 md:gap-4 lg:grid-cols-4"
        >
          {content.stats.map((stat, index) => {
            const node = (
              <li
                className={cn(
                  "flex min-h-44 flex-col justify-between rounded-sm bg-cream-dark px-6 pb-6 pt-7 transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] md:min-h-50 md:px-7",
                  visible
                    ? "translate-y-0 opacity-100"
                    : "translate-y-10 opacity-0",
                )}
                style={{
                  transitionDelay: visible ? `${index * 140}ms` : "0ms",
                }}
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
            );

            return (
              <div key={`${stat.value}-${stat.detail}`}>
                {editSlots?.stat ? editSlots.stat(index, node) : node}
              </div>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
