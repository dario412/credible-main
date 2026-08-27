import type { ReactNode } from "react";
import Link from "next/link";
import { ArrowRight } from "@phosphor-icons/react/ssr";

import { RosterPreviewGrid } from "@/components/home-2/roster-preview-grid";
import type { RosterCardExpert } from "@/components/roster-card";
import type { HomePageSections } from "@/lib/cms";

export function RosterPreviewSection({
  content,
  cards,
  editSlots,
  disableCtaLink = false,
}: {
  content: HomePageSections["roster"];
  cards: RosterCardExpert[];
  editSlots?: {
    headline?: (node: ReactNode) => ReactNode;
    subhead?: (node: ReactNode) => ReactNode;
    cta?: (node: ReactNode) => ReactNode;
    grid?: (node: ReactNode) => ReactNode;
  };
  disableCtaLink?: boolean;
}) {
  if (cards.length === 0) return null;

  const headlineNode = (
    <h2 className="max-w-3xl font-display text-[2.6rem] leading-[1.08] tracking-tight text-charcoal sm:text-[3.15rem] md:text-[3.65rem]">
      {content.headline}
    </h2>
  );
  const subheadNode = (
    <p className="mt-5 max-w-xl text-[0.9rem] leading-relaxed text-charcoal/65 md:text-[0.95rem]">
      {content.subhead}
    </p>
  );
  const ctaInner = (
    <span className="group inline-flex items-center justify-center gap-2 rounded-sm bg-forest px-6 py-3.5 text-[0.875rem] font-medium text-cream transition-colors hover:bg-forest-dark">
      {content.ctaLabel}
      <ArrowRight
        weight="bold"
        aria-hidden
        className="size-3.5 shrink-0 transition-transform duration-300 group-hover:translate-x-0.5"
      />
    </span>
  );
  const ctaNode = disableCtaLink ? (
    ctaInner
  ) : (
    <Link href={content.ctaHref} className="mt-8 inline-flex">
      {ctaInner}
    </Link>
  );

  const gridNode = <RosterPreviewGrid cards={cards} />;

  return (
    <section className="bg-cream px-6 py-16 md:px-10 md:py-20 lg:px-12">
      <div className="mx-auto max-w-352">
        <div className="flex flex-col items-center text-center">
          {editSlots?.headline ? editSlots.headline(headlineNode) : headlineNode}
          {editSlots?.subhead ? editSlots.subhead(subheadNode) : subheadNode}
          <div className="mt-8">
            {editSlots?.cta ? editSlots.cta(ctaNode) : ctaNode}
          </div>
        </div>

        {editSlots?.grid ? editSlots.grid(gridNode) : gridNode}
      </div>
    </section>
  );
}
