import type { ReactNode } from "react";

import { EYEBROW, PAGE_SHELL } from "@/components/inner-page";
import type { WhatWeDoPageSections, WhatWeDoService } from "@/lib/what-we-do";

const ROW =
  "grid items-start gap-5 py-8 md:py-10 lg:grid-cols-[4rem_minmax(0,1.2fr)_minmax(0,0.75fr)_minmax(0,0.95fr)] lg:gap-8 lg:py-11";

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
    <div className="max-w-2xl">
      <p className={EYEBROW}>{content.eyebrow}</p>
      <h2 className="mt-3 font-display text-[2.15rem] leading-[1.08] tracking-tight text-charcoal md:text-[2.65rem]">
        {content.headline}
      </h2>
      <p className="mt-5 text-[0.9375rem] leading-relaxed text-charcoal/60">
        {content.subhead}
      </p>
    </div>
  );

  return (
    <section
      id="services"
      className="scroll-mt-28 bg-cream px-6 pb-20 md:px-10 md:pb-24 lg:px-12 lg:pb-28"
    >
      <div className={PAGE_SHELL}>
        {wrapHeader(headline)}

        <div className="mt-12">
          <div
            className={`${ROW} hidden border-b border-charcoal/15 py-0 pb-3 lg:grid lg:py-0 lg:pb-3`}
            aria-hidden
          >
            <span />
            <p className="text-[0.8125rem] text-charcoal/40">Service</p>
            <p className="text-[0.8125rem] text-charcoal/40">Formats</p>
            <p className="text-[0.8125rem] text-charcoal/40">Best for</p>
          </div>

          <ul className="border-t border-charcoal/15 lg:border-t-0">
            {content.cards.map((service, index) => (
              <li
                key={`${service.n}-${index}`}
                className="border-b border-charcoal/15"
              >
                {wrapItem(index, <ServiceRow service={service} />)}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

function ServiceRow({ service }: { service: WhatWeDoService }) {
  const formats = service.formats.filter((format) => format.trim());

  return (
    <article className={ROW}>
      <p className="font-display text-[1.85rem] leading-none tracking-tight text-forest/40 md:text-[2.1rem]">
        {service.n}
      </p>

      <div className="min-w-0">
        <h3 className="font-display text-[1.45rem] leading-[1.12] tracking-tight text-charcoal md:text-[1.65rem]">
          {service.title}
        </h3>
        {service.lane.trim() ? (
          <p className="mt-1.5 text-[0.875rem] text-charcoal/45">{service.lane}</p>
        ) : null}
        <p className="mt-3 max-w-md text-[0.9375rem] leading-relaxed text-charcoal/65">
          {service.body}
        </p>
      </div>

      <div className="min-w-0 border-t border-charcoal/10 pt-4 lg:border-t-0 lg:pt-0">
        <p className="text-[0.8125rem] text-charcoal/40 lg:sr-only">Formats</p>
        {formats.length > 0 ? (
          <ul className="mt-2 flex flex-wrap gap-2 lg:mt-0">
            {formats.map((format) => (
              <li
                key={format}
                className="rounded-full bg-charcoal/6 px-3 py-1.5 text-[0.8125rem] leading-none text-charcoal/80"
              >
                {format}
              </li>
            ))}
          </ul>
        ) : null}
      </div>

      <div className="min-w-0 border-t border-charcoal/10 pt-4 lg:border-t-0 lg:pt-0">
        <p className="text-[0.8125rem] text-charcoal/40 lg:sr-only">Best for</p>
        {service.bestFor.trim() ? (
          <p className="mt-2 text-[0.9375rem] leading-relaxed text-charcoal/65 lg:mt-0">
            {service.bestFor}
          </p>
        ) : null}
      </div>
    </article>
  );
}
