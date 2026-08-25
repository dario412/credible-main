"use client";

import Link from "next/link";
import type { ReactNode } from "react";

import { AboutRosterRail } from "@/components/about-roster-rail";
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

import type { HeroCastMember } from "./hero-cast";
import { Home2WaveField } from "./home-2-wave-field";

export type { HeroCastMember };

const PATTERN_LINE_COUNT = 64;
const WAVE = { r: 42, g: 58, b: 48 };

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
  cast?: HeroCastMember[];
  editSlots?: {
    headline?: (node: ReactNode) => ReactNode;
    subhead?: (node: ReactNode) => ReactNode;
    primaryCta?: (node: ReactNode) => ReactNode;
    secondaryCta?: (node: ReactNode) => ReactNode;
  };
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
  cast = [],
  editSlots,
  disableCtaLinks = false,
}: Home2HeroProps) {
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

  // Soft peak mid-band, dissolve into cream at both top and bottom
  const waveMask =
    "linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.04) 12%, rgba(0,0,0,0.14) 28%, rgba(0,0,0,0.38) 48%, rgba(0,0,0,0.55) 62%, rgba(0,0,0,0.42) 76%, rgba(0,0,0,0.18) 88%, transparent 100%)";

  return (
    <section
      className="relative -mt-[7.25rem] overflow-hidden bg-cream md:-mt-[5.5rem]"
      data-site-hero
    >
      {/* Wave stage — forest-tinted, soft mid-band presence */}
      <div
        className="pointer-events-none absolute inset-0 z-0"
        aria-hidden
        style={{
          opacity: 0.22,
          maskImage: waveMask,
          WebkitMaskImage: waveMask,
        }}
      >
        <Home2WaveField
          lineCount={PATTERN_LINE_COUNT}
          color={WAVE}
          baseWidth={1.85}
          edgeFade
        />
      </div>

      <div className="relative z-10 mx-auto max-w-3xl px-6 pb-8 pt-28 text-center md:px-10 md:pb-10 md:pt-32 lg:pt-36">
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

      <div className="relative z-10 w-full pt-8 pb-10 md:pt-10 md:pb-14">
        {cast.length > 0 ? (
          <AboutRosterRail
            members={cast}
            sizeScale="subtle"
            className="pt-4 pb-2 md:pt-5 md:pb-3"
          />
        ) : null}
      </div>
    </section>
  );
}
