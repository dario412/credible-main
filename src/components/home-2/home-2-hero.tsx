"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState, type ReactNode } from "react";

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

import type { HeroCastMember } from "./hero-cast";
import { Home2WaveField } from "./home-2-wave-field";

export type { HeroCastMember };

const PATTERN_LINE_COUNT = 64;
const WAVE = { r: 42, g: 58, b: 48 };
const EASE = "cubic-bezier(0.22, 1, 0.36, 1)";
const MOTION = "420ms";
const MOTION_IMAGE = "650ms";

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

function CastCard({
  member,
  active,
  dimmed,
  reduceMotion,
  onActivate,
}: {
  member: HeroCastMember;
  active: boolean;
  dimmed: boolean;
  reduceMotion: boolean;
  onActivate: () => void;
}) {
  const imageSrc = member.image?.trim() || "/images/creator-placeholder.png";

  return (
    <Link
      href={`/roster/${member.slug}`}
      onMouseEnter={onActivate}
      onFocus={onActivate}
      className={cn(
        "group relative block w-[11.5rem] shrink-0 sm:w-[12.5rem] lg:w-[13.5rem]",
        "origin-bottom will-change-transform",
        "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-forest",
      )}
      style={{
        transitionProperty: "transform, opacity, filter",
        transitionDuration: MOTION,
        transitionTimingFunction: EASE,
        transform: active
          ? "translate3d(0, -14px, 0) scale(1.025)"
          : dimmed
            ? "translate3d(0, 4px, 0) scale(0.985)"
            : "translate3d(0, 0, 0) scale(1)",
        opacity: dimmed ? 0.62 : 1,
        filter: dimmed ? "saturate(0.82) brightness(0.94)" : "none",
        zIndex: active ? 12 : 1,
      }}
      aria-label={`${member.name}${member.role ? `, ${member.role}` : ""}`}
    >
      <span
        className="relative block aspect-3/4 overflow-hidden rounded-sm bg-cream-dark"
        style={{
          transitionProperty: "box-shadow",
          transitionDuration: MOTION,
          transitionTimingFunction: EASE,
          boxShadow: active
            ? "0 26px 52px rgba(28,26,23,0.2), 0 8px 20px rgba(28,26,23,0.1)"
            : "0 16px 40px rgba(28,26,23,0.12)",
        }}
      >
        <Image
          src={imageSrc}
          alt=""
          fill
          sizes="220px"
          className={cn(
            "object-cover object-[center_16%]",
            active && !reduceMotion && "cast-drift",
          )}
          style={{
            transitionProperty: "transform",
            transitionDuration: MOTION_IMAGE,
            transitionTimingFunction: EASE,
            transform: active ? "scale(1.06)" : "scale(1)",
          }}
        />

        <span
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background: active
              ? "linear-gradient(to top, rgba(28,26,23,0.78) 0%, rgba(28,26,23,0.22) 42%, rgba(28,26,23,0.08) 100%)"
              : "linear-gradient(to top, rgba(28,26,23,0.62) 0%, rgba(28,26,23,0.12) 38%, transparent 70%)",
          }}
        />
        <span
          aria-hidden
          className="pointer-events-none absolute inset-0 rounded-sm ring-1 ring-inset"
          style={{
            boxShadow: active
              ? "inset 0 0 0 1px rgba(249,243,239,0.32)"
              : "inset 0 0 0 1px rgba(249,243,239,0.16)",
          }}
        />

        <span className="absolute inset-x-0 bottom-0 z-2 px-3.5 pb-3.5 pt-10 md:px-4 md:pb-4">
          <span className="block font-display text-[1rem] leading-snug tracking-tight text-cream md:text-[1.0625rem]">
            {member.name}
          </span>
          {member.role ? (
            <span
              className="mt-1 block text-[0.6875rem] leading-snug text-cream/70"
              style={{
                transition: `opacity ${MOTION} ${EASE}, transform ${MOTION} ${EASE}, max-height ${MOTION} ${EASE}`,
                opacity: active ? 1 : 0,
                transform: active ? "translate3d(0,0,0)" : "translate3d(0,6px,0)",
                maxHeight: active ? "2.5rem" : "0",
                overflow: "hidden",
              }}
            >
              {member.role}
            </span>
          ) : null}
        </span>
      </span>
    </Link>
  );
}

/** Enough portraits that one marquee half always fills a wide desktop. */
function marqueeBase(cast: HeroCastMember[]) {
  if (cast.length === 0) return [];
  let base = [...cast];
  while (base.length < 8) {
    base = [...base, ...cast];
  }
  return base;
}

function CastRow({ cast }: { cast: HeroCastMember[] }) {
  const [hovered, setHovered] = useState<number | null>(null);
  const [reduceMotion, setReduceMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReduceMotion(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  const base = marqueeBase(cast);
  // Two identical halves → seamless loop at -50%.
  const loop = [...base, ...base];
  const hasFocus = hovered !== null;

  if (base.length === 0) return null;

  return (
    <div
      className={cn(
        "cast-marquee-window relative z-10 w-full overflow-hidden py-8 md:py-10",
      )}
      aria-label="Featured creators"
      onMouseLeave={() => setHovered(null)}
      onBlurCapture={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node)) {
          setHovered(null);
        }
      }}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-y-0 left-0 z-20 w-12 bg-linear-to-r from-cream via-cream/80 to-transparent md:w-20 lg:w-28"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-y-0 right-0 z-20 w-12 bg-linear-to-l from-cream via-cream/80 to-transparent md:w-20 lg:w-28"
      />
      <div
        className={cn(
          "flex w-max items-stretch gap-3.5 sm:gap-4",
          !reduceMotion && "cast-marquee-track",
        )}
      >
        {loop.map((member, index) => (
          <CastCard
            key={`${member.id}-${index}`}
            member={member}
            active={hovered === index}
            dimmed={hasFocus && hovered !== index}
            reduceMotion={reduceMotion}
            onActivate={() => setHovered(index)}
          />
        ))}
      </div>
    </div>
  );
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
    <section className="relative overflow-hidden bg-cream" data-site-hero>
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

      {/* Bottom dissolve into next cream section — sits above cast so portraits ease out */}
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 z-20 h-40 md:h-48 lg:h-56"
        aria-hidden
        style={{
          background:
            "linear-gradient(to top, #F9F3EF 0%, rgba(249,243,239,0.92) 22%, rgba(249,243,239,0.55) 48%, rgba(249,243,239,0.18) 72%, transparent 100%)",
        }}
      />

      <div className="relative z-10 mx-auto max-w-3xl px-6 pb-8 pt-16 text-center md:px-10 md:pb-10 md:pt-20 lg:pt-24">
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

      <div className="relative z-10 w-full pb-20 pt-10 md:pb-24 md:pt-14">
        {cast.length > 0 ? <CastRow cast={cast} /> : null}
      </div>
    </section>
  );
}
