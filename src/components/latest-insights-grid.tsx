"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

import { cn } from "@/lib/utils";

type InsightCard = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  cover: string | null;
  mins: number;
};

export function LatestInsightsGrid({ insights }: { insights: InsightCard[] }) {
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
      { threshold: 0.2 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <ul
      ref={listRef}
      className="mt-10 grid gap-8 sm:grid-cols-2 md:mt-12 lg:grid-cols-3 lg:gap-10"
    >
      {insights.map((insight, index) => (
        <li
          key={insight.id}
          className={cn(
            "transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]",
            visible
              ? "translate-y-0 opacity-100"
              : "translate-y-8 opacity-0",
          )}
          style={{ transitionDelay: visible ? `${index * 140}ms` : "0ms" }}
        >
          <Link
            href={`/insights/${insight.slug}`}
            className="group block cursor-pointer"
          >
            <div className="relative aspect-16/10 overflow-hidden rounded-sm bg-[#E4EBE6]">
              {insight.cover ? (
                <Image
                  src={insight.cover}
                  alt=""
                  fill
                  sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                  className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03]"
                />
              ) : (
                <span
                  aria-hidden
                  className="absolute inset-0 flex items-center justify-center font-display text-5xl leading-none text-charcoal/20"
                >
                  {insight.title.charAt(0)}
                </span>
              )}
            </div>

            <p className="mt-4 text-xs text-charcoal/55">
              {insight.mins} min read
            </p>

            <h3 className="mt-2 max-w-sm font-display text-[1.2rem] leading-snug tracking-tight text-charcoal transition-colors group-hover:text-forest md:text-[1.3rem]">
              {insight.title}
            </h3>

            <p className="mt-2 max-w-sm text-[0.8125rem] leading-relaxed text-charcoal/60 md:text-[0.875rem]">
              {insight.excerpt}
            </p>
          </Link>
        </li>
      ))}
    </ul>
  );
}
