"use client";

import { useEffect, useState, type ReactNode } from "react";

import { MultilineText } from "@/components/editable-hit";
import { FadeUp } from "@/components/fade-up";
import { cn } from "@/lib/utils";
import type { AboutPageSections } from "@/lib/about-page";

export function AboutModelStack({
  content,
  wrapHeader,
  wrapItem,
}: {
  content: AboutPageSections["model"];
  wrapHeader: (node: ReactNode) => ReactNode;
  wrapItem: (index: number, node: ReactNode) => ReactNode;
}) {
  const [reduceMotion, setReduceMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReduceMotion(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  const headline = (
    <div className="text-center">
      <MultilineText
        as="h2"
        text={
          content.headline.includes("\n")
            ? content.headline
            : content.headline.replace(", ", ",\n")
        }
        className="font-display text-[2rem] leading-[1.12] tracking-tight text-charcoal md:text-[2.65rem]"
      />
      <p className="mx-auto mt-5 max-w-md text-[0.9375rem] leading-relaxed text-charcoal/60">
        {content.subhead}
      </p>
    </div>
  );

  return (
    <section
      id="model"
      className="scroll-mt-28 bg-cream-dark px-6 py-20 md:px-10 md:py-24 lg:px-12 lg:py-28"
    >
      <div className="mx-auto w-full max-w-2xl">
        <FadeUp>{wrapHeader(headline)}</FadeUp>

        <div className="mt-12 flex flex-col gap-3 md:mt-16 md:gap-4">
          {content.items.map((item, index) => (
            <div
              key={`${item.n}-${index}`}
              className={cn(reduceMotion ? "relative" : "sticky top-28")}
              style={{ zIndex: 10 + index }}
            >
              {wrapItem(
                index,
                <article className="flex flex-col rounded-sm bg-cream p-7 md:p-9">
                  <h3 className="font-display text-[1.65rem] leading-snug tracking-tight text-charcoal md:text-[2rem]">
                    {item.title}
                  </h3>
                  <p className="mt-3 max-w-md text-[0.9375rem] leading-relaxed text-charcoal/60">
                    {item.body}
                  </p>
                </article>,
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
