"use client";

import { useEffect, useRef, useState } from "react";

import { RosterCard, type RosterCardExpert } from "@/components/roster-card";
import { cn } from "@/lib/utils";

export function SimilarCreatorsGrid({
  experts,
}: {
  experts: RosterCardExpert[];
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
      { threshold: 0.15 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <ul
      ref={listRef}
      className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8"
    >
      {experts.map((expert, index) => (
        <li
          key={expert.id}
          className={cn(
            "transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]",
            visible
              ? "translate-y-0 opacity-100"
              : "translate-y-8 opacity-0",
          )}
          style={{ transitionDelay: visible ? `${index * 140}ms` : "0ms" }}
        >
          <RosterCard expert={expert} />
        </li>
      ))}
    </ul>
  );
}
