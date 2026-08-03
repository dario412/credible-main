"use client";

import { useEffect, useRef, useState } from "react";

import type {
  ExpertAudienceSlice,
  ExpertTopicShare,
} from "@/lib/expert-profiles";
import { cn } from "@/lib/utils";

export function AudienceShareList({
  title,
  items,
  delay = 0,
  className,
}: {
  title: string;
  items: ExpertAudienceSlice[];
  delay?: number;
  className?: string;
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
      { threshold: 0.25 },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={cn(
        "rounded-sm bg-[#FBF8F5] px-4 py-5 transition-[opacity,transform] duration-[1200ms] ease-[cubic-bezier(0.22,1,0.36,1)] md:px-5 md:py-5",
        visible ? "translate-y-0 opacity-100" : "translate-y-7 opacity-0",
        className,
      )}
      style={{ transitionDelay: visible ? `${delay}ms` : "0ms" }}
    >
      <p className="text-[0.65rem] font-medium tracking-[0.14em] text-charcoal/45 uppercase">
        {title}
      </p>
      <ul className="mt-4 divide-y divide-charcoal/8">
        {items.map((item) => (
          <li key={item.label} className="py-2.5 first:pt-0 last:pb-0">
            <span className="text-[0.875rem] leading-snug text-charcoal/75">
              {item.label}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function TopicMixPie({
  topics,
  className,
}: {
  topics: ExpertTopicShare[];
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const ranked = [...topics].sort((a, b) => b.percent - a.percent);

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
      { threshold: 0.25 },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={cn(
        "rounded-sm bg-cream-dark px-4 py-5 transition-[opacity,transform] duration-[1200ms] ease-[cubic-bezier(0.22,1,0.36,1)] md:px-5 md:py-5",
        visible ? "translate-y-0 opacity-100" : "translate-y-7 opacity-0",
        className,
      )}
    >
      <p className="text-[0.65rem] font-medium tracking-[0.14em] text-charcoal/45 uppercase">
        Topic mix
      </p>
      <ul className="mt-4 divide-y divide-charcoal/8">
        {ranked.map((topic, index) => (
          <li
            key={topic.label}
            className={cn(
              "py-2.5 transition-[opacity,transform] duration-[1100ms] ease-[cubic-bezier(0.22,1,0.36,1)] first:pt-0 last:pb-0",
              visible
                ? "translate-y-0 opacity-100"
                : "translate-y-4 opacity-0",
            )}
            style={{
              transitionDelay: visible ? `${120 + index * 80}ms` : "0ms",
            }}
          >
            <p className="text-[0.875rem] leading-snug text-charcoal/80">
              {topic.label}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}
