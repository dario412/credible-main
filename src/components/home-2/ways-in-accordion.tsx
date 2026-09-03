import Link from "next/link";
import {
  ArrowUpRight,
  Handshake,
  Microphone,
  SealCheck,
  Ticket,
} from "@phosphor-icons/react/ssr";
import type { ReactNode } from "react";

import { MultilineText } from "@/components/editable-hit";
import { WAYS } from "@/components/ways-in";
import type { HomePageSections } from "@/lib/cms";

const WAY_ICONS = {
  partnerships: Handshake,
  ambassadors: SealCheck,
  speaking: Microphone,
  live: Ticket,
} as const;

export function WaysInAccordion({
  content,
  editSlots,
}: {
  content: HomePageSections["waysIn"];
  editSlots?: {
    headline?: (node: ReactNode) => ReactNode;
    subhead?: (node: ReactNode) => ReactNode;
    item?: (index: number, node: ReactNode) => ReactNode;
  };
}) {
  const headlineNode = (
    <MultilineText
      as="h2"
      text={content.headline}
      className="font-display text-[2.6rem] leading-[1.08] tracking-tight text-charcoal sm:text-[3.15rem] md:text-[3.65rem]"
    />
  );
  const subheadNode = (
    <p className="mt-6 max-w-md text-[0.9rem] leading-relaxed text-charcoal/70 md:text-[0.95rem]">
      {content.subhead}
    </p>
  );

  return (
    <section className="bg-cream px-6 py-16 md:px-10 md:py-20 lg:px-12">
      <div className="mx-auto grid max-w-352 gap-12 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:items-start lg:gap-16 xl:gap-24">
        <div className="lg:sticky lg:top-28">
          {editSlots?.headline ? editSlots.headline(headlineNode) : headlineNode}
          {editSlots?.subhead ? editSlots.subhead(subheadNode) : subheadNode}
        </div>

        <ul className="border-t border-charcoal/12">
          {WAYS.map((way, index) => {
            const Icon = WAY_ICONS[way.visual];
            const item = content.items[index] ?? {
              title: way.title,
              body: way.body,
            };

            const itemNode = (
              <li className="flex items-start gap-5 border-b border-charcoal/12 py-8 md:gap-7 md:py-10">
                <Icon
                  weight="light"
                  aria-hidden
                  className="mt-0.5 size-6 shrink-0 text-forest md:size-7"
                />

                <div className="min-w-0 flex-1">
                  <h3 className="font-display text-[1.4rem] leading-tight tracking-tight md:text-[1.75rem]">
                    <Link
                      href="/how-we-work"
                      className="group inline-flex items-center gap-2.5 text-charcoal transition-colors hover:text-forest"
                    >
                      {item.title}
                      <ArrowUpRight
                        weight="bold"
                        aria-hidden
                        className="size-4 shrink-0 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:rotate-45 md:size-5"
                      />
                    </Link>
                  </h3>

                  <p className="mt-5 max-w-lg text-[1rem] leading-relaxed text-charcoal/70 md:mt-6 md:text-[1.0625rem]">
                    {item.body}
                  </p>
                </div>
              </li>
            );

            return (
              <div key={way.index}>
                {editSlots?.item ? editSlots.item(index, itemNode) : itemNode}
              </div>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
