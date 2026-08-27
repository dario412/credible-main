"use client";

import { Minus, Plus } from "@phosphor-icons/react";
import { useId, useState } from "react";

import { FadeUp } from "@/components/fade-up";
import { cn } from "@/lib/utils";

export function RepresentationFaq({
  items,
}: {
  items: readonly { q: string; a: string }[];
}) {
  const baseId = useId();
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <dl className="flex flex-col gap-3">
      {items.map((item, index) => {
        const open = openIndex === index;
        const panelId = `${baseId}-panel-${index}`;
        const buttonId = `${baseId}-button-${index}`;

        return (
          <FadeUp key={item.q} delay={index * 70} y={16} threshold={0.12}>
            <div
              className="cursor-pointer rounded-sm bg-cream-dark px-6 py-7 md:px-10 md:py-8"
              onClick={() => setOpenIndex(open ? null : index)}
            >
            <dt>
              <button
                id={buttonId}
                type="button"
                aria-expanded={open}
                aria-controls={panelId}
                onClick={(e) => {
                  e.stopPropagation();
                  setOpenIndex(open ? null : index);
                }}
                className="flex w-full cursor-pointer items-center justify-between gap-6 text-left"
              >
                <span className="min-w-0 flex-1 font-display text-[1.25rem] leading-[1.3] tracking-tight text-charcoal md:text-[1.5rem]">
                  {item.q}
                </span>
                <span className="flex size-10 shrink-0 items-center justify-center text-charcoal">
                  {open ? (
                    <Minus weight="bold" className="size-4.5" aria-hidden />
                  ) : (
                    <Plus weight="bold" className="size-4.5" aria-hidden />
                  )}
                </span>
              </button>
            </dt>
            <dd
              id={panelId}
              role="region"
              aria-labelledby={buttonId}
              className={cn(
                "grid transition-[grid-template-rows] duration-200",
                open ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
              )}
            >
              <div className="overflow-hidden">
                <p className="max-w-[37.5rem] pt-4 text-[1.0625rem] leading-[1.68] text-charcoal/70">
                  {item.a}
                </p>
              </div>
            </dd>
            </div>
          </FadeUp>
        );
      })}
    </dl>
  );
}
