"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

import { V2ViewMoreLink } from "@/components/v2/v2-icons";
import { cn } from "@/lib/utils";

export type V2InsightCard = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  cover: string | null;
  mins: number;
  category: string;
};

export function V2Insights({ insights }: { insights: V2InsightCard[] }) {
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

  if (insights.length === 0) return null;

  return (
    <section className="bg-[var(--v2-snow)] py-[60px] pb-16">
      <div className="v2-container flex flex-col gap-16">
      <div className="flex items-end justify-between gap-6">
        <h2 className="v2-display text-[clamp(2.2rem,4vw,3.5rem)] leading-[1.07] text-[var(--v2-timberline)]">
          What we are learning
        </h2>
        <V2ViewMoreLink href="/insights">All insights</V2ViewMoreLink>
      </div>
      <ul
        ref={listRef}
        className="grid gap-12 md:grid-cols-2 lg:grid-cols-3 lg:gap-12"
      >
        {insights.map((insight, index) => (
          <li
            key={insight.id}
            className={cn(
              "transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]",
              visible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0",
            )}
            style={{
              transitionDelay: visible ? `${index * 140}ms` : "0ms",
            }}
          >
            <Link href={`/insights/${insight.slug}`} className="group flex flex-col gap-6">
              <div className="relative h-[240px] overflow-hidden rounded-[16px] bg-[var(--v2-glacier)]">
                {insight.cover ? (
                  <Image
                    src={insight.cover}
                    alt=""
                    fill
                    sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                  />
                ) : (
                  <span className="v2-display absolute inset-0 flex items-center justify-center text-6xl text-[var(--v2-timberline)]/20">
                    {insight.title.charAt(0)}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-3">
                <span className="text-[13px] leading-4 font-medium tracking-[0.08em] text-[var(--v2-ember)] uppercase">
                  {insight.category}
                </span>
                <span className="text-[13px] leading-4 text-[var(--v2-lichen)]">
                  {insight.mins} min read
                </span>
              </div>
              <h3 className="v2-display text-[24px] leading-[30px] tracking-[-0.01em] text-[var(--v2-timberline)]">
                {insight.title}
              </h3>
              <p className="text-[15px] leading-[25px] text-[var(--v2-lichen)]">
                {insight.excerpt}
              </p>
            </Link>
          </li>
        ))}
      </ul>
      </div>
    </section>
  );
}
