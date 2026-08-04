"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type ReactNode } from "react";

import type {
  CtaStyle,
  HeadlineStyle,
  HomePageSections,
  TextStyle,
} from "@/lib/cms";
import { DEFAULT_HOME_SECTIONS } from "@/lib/cms";
import {
  ctaClassName,
  headlineClassName,
  subheadClassName,
} from "@/lib/home-styles";
import { cn } from "@/lib/utils";

import { HOME_2_SPEAKERS } from "./home-2-speakers";
import { Home2WaveField } from "./home-2-wave-field";

const PATTERN_LINE_COUNT = 84;
const SPEAKER_COUNT = 8;
const CHARCOAL = { r: 28, g: 26, b: 23 };
/** Card height plus breathing room, used to keep cards inside the field */
const CARD_HEIGHT = 268;
const CARD_MARGIN = 18;

export type Home2HeroProps = {
  headline?: string;
  subhead?: string;
  primaryCta?: string;
  primaryHref?: string;
  secondaryCta?: string;
  secondaryHref?: string;
  headlineStyle?: HeadlineStyle;
  subheadStyle?: TextStyle;
  primaryCtaStyle?: CtaStyle;
  secondaryCtaStyle?: CtaStyle;
  /** When set, editable regions wrap headline/subhead/CTAs instead of plain markup. */
  editSlots?: {
    headline?: (node: ReactNode) => ReactNode;
    subhead?: (node: ReactNode) => ReactNode;
    primaryCta?: (node: ReactNode) => ReactNode;
    secondaryCta?: (node: ReactNode) => ReactNode;
  };
  /** Disable CTA navigation (edit mode). */
  disableCtaLinks?: boolean;
};

export function heroPropsFromSections(hero: HomePageSections["hero"]): Home2HeroProps {
  return {
    headline: hero.headline,
    subhead: hero.subhead,
    primaryCta: hero.primaryCta,
    primaryHref: hero.primaryHref,
    secondaryCta: hero.secondaryCta,
    secondaryHref: hero.secondaryHref,
    headlineStyle: hero.headlineStyle,
    subheadStyle: hero.subheadStyle,
    primaryCtaStyle: hero.primaryCtaStyle,
    secondaryCtaStyle: hero.secondaryCtaStyle,
  };
}

export function Home2Hero({
  headline = DEFAULT_HOME_SECTIONS.hero.headline,
  subhead = DEFAULT_HOME_SECTIONS.hero.subhead,
  primaryCta = DEFAULT_HOME_SECTIONS.hero.primaryCta,
  primaryHref = DEFAULT_HOME_SECTIONS.hero.primaryHref,
  secondaryCta = DEFAULT_HOME_SECTIONS.hero.secondaryCta,
  secondaryHref = DEFAULT_HOME_SECTIONS.hero.secondaryHref,
  headlineStyle = DEFAULT_HOME_SECTIONS.hero.headlineStyle,
  subheadStyle = DEFAULT_HOME_SECTIONS.hero.subheadStyle,
  primaryCtaStyle = DEFAULT_HOME_SECTIONS.hero.primaryCtaStyle,
  secondaryCtaStyle = DEFAULT_HOME_SECTIONS.hero.secondaryCtaStyle,
  editSlots,
  disableCtaLinks = false,
}: Home2HeroProps) {
  const router = useRouter();
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [cardBottom, setCardBottom] = useState<number | null>(null);

  /** Anchor the card just above the point the pointer entered on */
  function handleEnter(index: number, event: React.MouseEvent<HTMLButtonElement>) {
    const field = event.currentTarget.getBoundingClientRect();
    const pointerY = event.clientY - field.top;
    const maxBottom = Math.max(CARD_MARGIN, field.height - CARD_HEIGHT - CARD_MARGIN);

    setCardBottom(
      Math.min(Math.max(field.height - pointerY + CARD_MARGIN, CARD_MARGIN), maxBottom),
    );
    setHoveredIndex(index);
  }

  const headlineNode = (
    <h1 className={headlineClassName(headlineStyle)}>{headline}</h1>
  );
  const subheadNode = (
    <p className={subheadClassName(subheadStyle)}>{subhead}</p>
  );

  const primaryInner = (
    <span className={ctaClassName(primaryCtaStyle)}>{primaryCta}</span>
  );
  const secondaryInner = (
    <span className={ctaClassName(secondaryCtaStyle)}>{secondaryCta}</span>
  );

  const primaryCtaNode = disableCtaLinks ? (
    <span className="inline-flex">{primaryInner}</span>
  ) : (
    <Link href={primaryHref} className="inline-flex">
      {primaryInner}
    </Link>
  );

  const secondaryCtaNode = disableCtaLinks ? (
    <span className="inline-flex">{secondaryInner}</span>
  ) : (
    <Link href={secondaryHref} className="inline-flex">
      {secondaryInner}
    </Link>
  );

  return (
    <section className="relative bg-cream" data-site-hero>
      <div className="relative z-10 mx-auto max-w-3xl px-6 pb-10 pt-16 text-center md:px-10 md:pb-12 md:pt-20 lg:pt-24">
        {editSlots?.headline ? editSlots.headline(headlineNode) : headlineNode}
        {editSlots?.subhead ? editSlots.subhead(subheadNode) : subheadNode}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          {editSlots?.primaryCta
            ? editSlots.primaryCta(primaryCtaNode)
            : primaryCtaNode}
          {editSlots?.secondaryCta
            ? editSlots.secondaryCta(secondaryCtaNode)
            : secondaryCtaNode}
        </div>
      </div>

      <div className="relative mx-auto h-75 max-w-352 md:h-95 lg:h-105">
        <Home2WaveField
          lineCount={PATTERN_LINE_COUNT}
          color={CHARCOAL}
          baseWidth={2.1}
        />

        <div
          className="pointer-events-none absolute inset-x-0 top-0 z-10 h-20 bg-linear-to-b from-cream to-transparent"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-12 bg-linear-to-t from-cream to-transparent"
          aria-hidden
        />

        <div className="absolute inset-0 z-20 hidden md:block">
          {HOME_2_SPEAKERS.slice(0, SPEAKER_COUNT).map((speaker, index) => {
            const active = hoveredIndex === index;
            // Spread 24 hotspots evenly across denser pattern columns
            const left = ((index + 0.5) / SPEAKER_COUNT) * 100;
            const edge =
              index === 0
                ? "left"
                : index === SPEAKER_COUNT - 1
                  ? "right"
                  : "center";

            return (
              <button
                key={speaker.id}
                type="button"
                className={cn(
                  "pointer-events-auto absolute top-0 bottom-0 w-[12%] -translate-x-1/2 bg-transparent",
                  active && "z-30",
                )}
                style={{ left: `${left}%` }}
                onMouseEnter={(event) => handleEnter(index, event)}
                onMouseLeave={() =>
                  setHoveredIndex((current) =>
                    current === index ? null : current,
                  )
                }
                onClick={() => router.push(`/roster/${speaker.slug}`)}
                aria-label={`${speaker.name}, ${speaker.title}`}
              >
                <span
                  style={
                    active && cardBottom !== null
                      ? { bottom: `${cardBottom}px` }
                      : undefined
                  }
                  className={cn(
                    "pointer-events-none absolute bottom-[54%] z-40 w-58 overflow-hidden rounded-sm bg-cream text-left shadow-[0_22px_54px_rgba(28,26,23,0.16)] ring-1 ring-charcoal/8 transition-[opacity,transform] duration-[1250ms] ease-[cubic-bezier(0.22,0.61,0.36,1)]",
                    edge === "left" && "left-0",
                    edge === "right" && "right-0",
                    edge === "center" && "left-1/2 -translate-x-1/2",
                    active
                      ? "translate-y-0 scale-100 opacity-100"
                      : "translate-y-1 scale-[0.992] opacity-0",
                  )}
                >
                  <span className="relative block h-38 w-full overflow-hidden bg-cream-dark">
                    <Image
                      src="/images/creator-placeholder.png"
                      alt=""
                      fill
                      sizes="232px"
                      className={cn(
                        "object-cover object-[center_18%] transition-transform duration-[1500ms] ease-[cubic-bezier(0.22,0.61,0.36,1)]",
                        active ? "scale-100" : "scale-[1.03]",
                      )}
                    />
                  </span>
                  <span className="block px-3.5 py-3">
                    <span className="block font-display text-[0.95rem] leading-tight text-charcoal">
                      {speaker.name}
                    </span>
                    <span className="mt-0.5 block text-[0.7rem] text-charcoal/55">
                      {speaker.title}
                    </span>
                    <span className="mt-2 block text-[0.72rem] leading-snug text-forest">
                      {speaker.prompt}
                    </span>
                  </span>
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
