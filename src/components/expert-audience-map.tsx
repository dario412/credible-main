"use client";

import { useEffect, useRef, useState } from "react";

import { TopicAudienceListItem } from "@/components/topic-audience-icon";
import type {
  ExpertAudienceSlice,
  ExpertTopicShare,
} from "@/lib/expert-profiles";
import type { TopicAudienceIconComponent } from "@/lib/topic-audience-icons";
import { cn } from "@/lib/utils";

export function AudienceShareList({
  title,
  items,
  iconMap,
  iconContext = "audience",
  delay = 0,
  className,
}: {
  title: string;
  items: ExpertAudienceSlice[];
  iconMap?: Map<string, TopicAudienceIconComponent>;
  iconContext?: "audience" | "industry";
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
          <TopicAudienceListItem
            key={item.label}
            label={item.label}
            context={iconContext}
            iconMap={iconMap}
          />
        ))}
      </ul>
    </div>
  );
}

export function TopicMixPie({
  topics,
  iconMap,
  className,
}: {
  topics: ExpertTopicShare[];
  iconMap?: Map<string, TopicAudienceIconComponent>;
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
        Talks About
      </p>
      <ul className="mt-4 divide-y divide-charcoal/8">
        {ranked.map((topic, index) => (
          <TopicAudienceListItem
            key={topic.label}
            label={topic.label}
            context="topic"
            iconMap={iconMap}
            animate
            visible={visible}
            delayMs={120 + index * 80}
          />
        ))}
      </ul>
    </div>
  );
}
