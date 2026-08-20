"use client";

import { useEffect, useRef, useState } from "react";

import { FadeUp } from "@/components/fade-up";
import { cn } from "@/lib/utils";

type Step = {
  n: string;
  title: string;
  body: string;
};

export function ProcessTimeline({ steps }: { steps: readonly Step[] }) {
  const rootRef = useRef<HTMLOListElement>(null);
  const trackRef = useRef<HTMLSpanElement>(null);
  const fillRef = useRef<HTMLSpanElement>(null);
  const dotRefs = useRef<Array<HTMLSpanElement | null>>([]);
  const [active, setActive] = useState(0);

  useEffect(() => {
    const root = rootRef.current;
    const track = trackRef.current;
    const fill = fillRef.current;
    if (!root || !track || !fill) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");

    const update = () => {
      const dots = dotRefs.current.filter(Boolean) as HTMLSpanElement[];
      if (dots.length === 0) return;

      const first = dots[0].getBoundingClientRect();
      const last = dots[dots.length - 1].getBoundingClientRect();
      const rootBox = root.getBoundingClientRect();
      const start = first.top + first.height / 2 - rootBox.top;
      const end = last.top + last.height / 2 - rootBox.top;
      const length = Math.max(end - start, 1);

      track.style.top = `${start}px`;
      track.style.height = `${length}px`;
      fill.style.top = `${start}px`;
      fill.style.height = `${length}px`;

      if (reduce.matches) {
        fill.style.transform = "scaleY(1)";
        setActive(dots.length - 1);
        return;
      }

      const trigger = window.innerHeight * 0.46;
      const firstCenter = first.top + first.height / 2;
      const lastCenter = last.top + last.height / 2;
      const progress = Math.min(
        1,
        Math.max(0, (trigger - firstCenter) / (lastCenter - firstCenter)),
      );

      fill.style.transform = `scaleY(${progress})`;

      let next = 0;
      dots.forEach((dot, index) => {
        const center = dot.getBoundingClientRect().top + dot.offsetHeight / 2;
        if (center <= trigger + 8) next = index;
      });
      setActive(next);
    };

    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    reduce.addEventListener("change", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
      reduce.removeEventListener("change", update);
    };
  }, [steps.length]);

  return (
    <ol ref={rootRef} className="relative">
      <span
        ref={trackRef}
        aria-hidden
        className="absolute left-[6.5px] w-px bg-charcoal/15"
      />
      <span
        ref={fillRef}
        aria-hidden
        className="absolute left-[6px] w-0.5 origin-top bg-forest"
        style={{ transform: "scaleY(0)", willChange: "transform" }}
      />

      {steps.map((step, index) => {
        const on = index <= active;
        return (
          <li key={step.n} className="flex gap-6 md:gap-10">
            <div className="relative z-1 flex w-3.5 shrink-0 justify-center pt-10">
              <span
                ref={(node) => {
                  dotRefs.current[index] = node;
                }}
                className={cn(
                  "size-3.5 shrink-0 rounded-full border-2 transition-colors duration-300",
                  on
                    ? "border-forest bg-forest"
                    : "border-charcoal/25 bg-cream-dark",
                )}
              />
            </div>
            <FadeUp
              delay={index * 60}
              y={18}
              threshold={0.12}
              className={index === steps.length - 1 ? "mb-0 min-w-0 flex-1" : "mb-5 min-w-0 flex-1"}
            >
              <div className="relative rounded-sm border border-charcoal/8 bg-white px-6 py-8 md:px-10 md:py-11">
                <p
                  aria-hidden
                  className={cn(
                    "pointer-events-none absolute top-5 right-5 font-display text-[4rem] leading-none tracking-tight transition-colors duration-300 md:top-6 md:right-7 md:text-[5.5rem]",
                    on ? "text-forest" : "text-charcoal/18",
                  )}
                >
                  {step.n}
                </p>
                <h3 className="relative max-w-[12ch] font-display text-[1.75rem] leading-[1.12] tracking-tight text-charcoal md:max-w-[13ch] md:text-[2.15rem]">
                  <span className="sr-only">{step.n}. </span>
                  {step.title}
                </h3>
                <p className="relative mt-3 max-w-md text-[0.9375rem] leading-relaxed text-charcoal/60">
                  {step.body}
                </p>
              </div>
            </FadeUp>
          </li>
        );
      })}
    </ol>
  );
}
