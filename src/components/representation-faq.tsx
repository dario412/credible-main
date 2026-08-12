"use client";

import { CaretDown } from "@phosphor-icons/react";
import { useId, useState } from "react";

import { cn } from "@/lib/utils";

export function RepresentationFaq({
  items,
}: {
  items: readonly { q: string; a: string }[];
}) {
  const baseId = useId();
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <dl className="divide-y divide-charcoal/10 rounded-sm border border-charcoal/10 bg-white">
      {items.map((item, index) => {
        const open = openIndex === index;
        const panelId = `${baseId}-panel-${index}`;
        const buttonId = `${baseId}-button-${index}`;

        return (
          <div key={item.q}>
            <dt>
              <button
                id={buttonId}
                type="button"
                aria-expanded={open}
                aria-controls={panelId}
                onClick={() => setOpenIndex(open ? null : index)}
                className="flex w-full items-start justify-between gap-4 px-5 py-5 text-left transition-colors hover:bg-cream/40 md:px-6 md:py-6"
              >
                <span className="font-display text-[1.05rem] leading-snug tracking-tight text-charcoal md:text-[1.1rem]">
                  {item.q}
                </span>
                <CaretDown
                  weight="bold"
                  aria-hidden
                  className={cn(
                    "mt-1 size-4 shrink-0 text-charcoal/40 transition-transform duration-200",
                    open && "rotate-180",
                  )}
                />
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
                <p className="px-5 pb-5 text-[0.875rem] leading-relaxed text-charcoal/65 md:px-6 md:pb-6">
                  {item.a}
                </p>
              </div>
            </dd>
          </div>
        );
      })}
    </dl>
  );
}
