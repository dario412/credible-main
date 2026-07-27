"use client";

import { useEffect, useRef, useState } from "react";

import { RosterCard, type RosterCardExpert } from "@/components/roster-card";
import { cn } from "@/lib/utils";

export function RosterPreviewGrid({ cards }: { cards: RosterCardExpert[] }) {
  const gridRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = gridRef.current;
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
    <div
      ref={gridRef}
      className="mt-10 grid items-stretch gap-x-5 gap-y-10 overflow-visible sm:grid-cols-2 md:mt-12 lg:grid-cols-4"
    >
      {cards.map((expert, index) => (
        <div
          key={expert.id}
          className={cn(
            "transition-all duration-1000 ease-[cubic-bezier(0.22,1,0.36,1)]",
            visible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0",
          )}
          style={{ transitionDelay: visible ? `${index * 200}ms` : "0ms" }}
        >
          <RosterCard expert={expert} />
        </div>
      ))}
    </div>
  );
}
