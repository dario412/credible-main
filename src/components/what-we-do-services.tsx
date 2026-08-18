"use client";

import {
  Handshake,
  Microphone,
  NewspaperClipping,
  Ticket,
} from "@phosphor-icons/react";
import type { ReactNode } from "react";

import { EYEBROW, PAGE_SHELL } from "@/components/inner-page";
import { cn } from "@/lib/utils";
import type { WhatWeDoPageSections, WhatWeDoService } from "@/lib/what-we-do";

const SERVICE_ICONS = [NewspaperClipping, Handshake, Microphone, Ticket];

export function WhatWeDoServices({
  content,
  wrapHeader,
  wrapItem,
}: {
  content: WhatWeDoPageSections["services"];
  wrapHeader: (node: ReactNode) => ReactNode;
  wrapItem: (index: number, node: ReactNode) => ReactNode;
}) {
  const headline = (
    <div>
      <p className={EYEBROW}>{content.eyebrow}</p>
      <h2 className="mt-3 font-display text-[2.15rem] leading-[1.08] tracking-tight text-charcoal md:text-[2.65rem] lg:text-[3rem]">
        {content.headline}
      </h2>
      <p className="mt-5 max-w-sm text-[0.9375rem] leading-relaxed text-charcoal/60">
        {content.subhead}
      </p>
    </div>
  );

  return (
    <section
      id="services"
      className="scroll-mt-28 bg-cream px-6 pb-20 md:px-10 md:pb-24 lg:px-12 lg:pb-28"
    >
      <div
        className={`${PAGE_SHELL} grid items-start gap-10 lg:grid-cols-3 lg:gap-12 xl:gap-16`}
      >
        <div className="lg:sticky lg:top-28">{wrapHeader(headline)}</div>

        <div className="lg:col-span-2">
          <div className="h-px bg-charcoal" />
          {content.cards.map((service, index) => (
            <div key={`${service.n}-${index}`}>
              {wrapItem(index, <ServiceRow service={service} index={index} />)}
              <div className="h-px bg-charcoal" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function ServiceRow({
  service,
  index,
}: {
  service: WhatWeDoService;
  index: number;
}) {
  const Icon = SERVICE_ICONS[index % SERVICE_ICONS.length];
  const formats = service.formats.filter((format) => format.trim());

  return (
    <article
      className={cn(
        "group flex flex-col rounded-sm px-5 py-8 transition-colors duration-300",
        "md:px-7 md:py-10 motion-reduce:transition-none motion-reduce:**:transition-none",
        "hover:bg-forest focus-within:bg-forest",
      )}
    >
      <div className="flex items-start gap-6 md:gap-8">
        <Icon
          weight="light"
          aria-hidden
          className="size-12 shrink-0 text-charcoal transition-colors duration-300 group-hover:text-cream group-focus-within:text-cream md:size-14"
        />
        <div className="min-w-0 pt-0.5">
          {service.lane.trim() ? (
            <p className="text-[0.68rem] font-medium tracking-[0.16em] text-forest uppercase transition-colors duration-300 group-hover:text-cream/60 group-focus-within:text-cream/60">
              {service.lane}
            </p>
          ) : null}
          <h3 className="mt-1.5 font-display text-[1.5rem] leading-[1.1] tracking-tight text-charcoal transition-colors duration-300 group-hover:text-cream group-focus-within:text-cream md:text-[1.85rem] lg:text-[1.95rem]">
            {service.title}
          </h3>
        </div>
      </div>

      <div className="mt-10 max-w-sm md:mt-16 md:ml-auto lg:mt-20">
        <p className="text-[1.0625rem] leading-snug text-charcoal/70 transition-colors duration-300 group-hover:text-cream group-focus-within:text-cream">
          {service.body}
        </p>
        {formats.length > 0 ? (
          <p className="mt-4 text-[0.8125rem] leading-relaxed text-charcoal/50 transition-colors duration-300 group-hover:text-cream/70 group-focus-within:text-cream/70">
            {formats.join(", ")}
          </p>
        ) : null}
        {service.bestFor.trim() ? (
          <p className="mt-3 text-[0.875rem] leading-relaxed text-charcoal/58 transition-colors duration-300 group-hover:text-cream/80 group-focus-within:text-cream/80">
            {service.bestFor}
          </p>
        ) : null}
      </div>
    </article>
  );
}
