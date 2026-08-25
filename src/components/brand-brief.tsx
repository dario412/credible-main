"use client";

import Image from "next/image";
import Link from "next/link";
import { type ReactNode } from "react";
import { ArrowRight } from "@phosphor-icons/react/ssr";

import { CreatorFacesMarquee } from "@/components/creator-faces-marquee";
import { BriefForm } from "@/components/brief-form";
import { Home2WaveField } from "@/components/home-2/home-2-wave-field";
import { PatternField } from "@/components/pattern-field";
import {
  DEFAULT_HOME_SECTIONS,
  type HomePageSections,
} from "@/lib/cms";
import { cn } from "@/lib/utils";

const CREAM_RGB = { r: 249, g: 243, b: 239 };

function SectionEyebrow({ children }: { children: ReactNode }) {
  return (
    <p className="text-[0.68rem] font-medium tracking-[0.16em] text-cream/60 uppercase">
      {children}
    </p>
  );
}

function ArrowIcon({ className }: { className?: string }) {
  return <ArrowRight weight="bold" aria-hidden className={className} />;
}

function CreatorCta({
  className,
  content = DEFAULT_HOME_SECTIONS.creatorCta,
  editSlots,
}: {
  className?: string;
  content?: HomePageSections["creatorCta"];
  editSlots?: {
    eyebrow?: (node: ReactNode) => ReactNode;
    headline?: (node: ReactNode) => ReactNode;
    subhead?: (node: ReactNode) => ReactNode;
    stats?: (node: ReactNode) => ReactNode;
    buttons?: (node: ReactNode) => ReactNode;
  };
}) {
  const eyebrowNode = <SectionEyebrow>{content.eyebrow}</SectionEyebrow>;
  const headlineNode = (
    <h2 className="mt-4 max-w-xl font-display text-[1.75rem] leading-[1.1] tracking-tight text-cream sm:text-[2.1rem] md:text-[2.4rem]">
      {content.headline}
    </h2>
  );
  const subheadNode = (
    <p className="mt-4 max-w-lg text-[0.95rem] leading-relaxed text-cream/75">
      {content.subhead}
    </p>
  );
  const showStats =
    content.showFacesMarquee ||
    content.stat1.trim() ||
    content.stat2.trim();
  const statsNode = showStats ? (
    <div className="mt-7 flex flex-wrap items-center gap-x-5 gap-y-3">
      {content.showFacesMarquee ? <CreatorFacesMarquee /> : null}
      {content.stat1.trim() || content.stat2.trim() ? (
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
          {content.stat1.trim() ? (
            <p className="text-[0.8125rem] text-cream/70">{content.stat1}</p>
          ) : null}
          {content.stat1.trim() && content.stat2.trim() ? (
            <span
              aria-hidden
              className="hidden h-3.5 w-px bg-cream/25 sm:block"
            />
          ) : null}
          {content.stat2.trim() ? (
            <p className="text-[0.8125rem] text-cream/70">{content.stat2}</p>
          ) : null}
        </div>
      ) : null}
    </div>
  ) : editSlots?.stats ? (
    <p className="mt-7 rounded-sm border border-dashed border-cream/25 px-4 py-3 text-[0.8125rem] text-cream/45">
      Stats strip hidden
    </p>
  ) : null;
  const primaryCtaNode = content.primaryCtaLabel.trim() ? (
    <Link
      href={content.primaryCtaHref}
      onClick={(e) => {
        if (editSlots?.buttons) e.preventDefault();
      }}
      className="group inline-flex w-full items-center justify-center gap-2 rounded-sm bg-cream px-6 py-3.5 text-[0.9rem] font-medium text-charcoal transition-colors hover:bg-cream-dark active:translate-y-px"
    >
      {content.primaryCtaLabel}
      <ArrowIcon className="size-3.5 shrink-0 transition-transform duration-300 group-hover:translate-x-0.5" />
    </Link>
  ) : editSlots?.buttons ? (
    <p className="rounded-sm border border-dashed border-cream/25 px-4 py-3 text-center text-[0.8125rem] text-cream/45">
      Primary button hidden
    </p>
  ) : null;
  const secondaryCtaNode = content.secondaryCtaLabel.trim() ? (
    <Link
      href={content.secondaryCtaHref}
      onClick={(e) => {
        if (editSlots?.buttons) e.preventDefault();
      }}
      className="inline-flex w-full items-center justify-center gap-2 rounded-sm border border-cream/35 px-6 py-3.5 text-[0.9rem] font-medium text-cream transition-colors hover:border-cream hover:bg-cream/10"
    >
      {content.secondaryCtaLabel}
    </Link>
  ) : editSlots?.buttons ? (
    <p className="rounded-sm border border-dashed border-cream/25 px-4 py-3 text-center text-[0.8125rem] text-cream/45">
      Secondary button hidden
    </p>
  ) : null;
  const buttonsNode =
    primaryCtaNode || secondaryCtaNode ? (
      <div className="flex flex-col gap-3 sm:max-w-xs lg:ml-auto lg:w-full">
        {primaryCtaNode}
        {secondaryCtaNode}
      </div>
    ) : null;

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-sm bg-rust",
        className,
      )}
    >
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <PatternField
          color={CREAM_RGB}
          className="opacity-[0.13]"
          mask="linear-gradient(to left, black 0%, rgba(0,0,0,0.4) 45%, transparent 88%)"
        />
      </div>

      <div className="relative z-2 p-7">
        <div className="grid gap-9 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)] lg:items-end lg:gap-16">
          <div>
            {editSlots?.eyebrow ? editSlots.eyebrow(eyebrowNode) : eyebrowNode}
            {editSlots?.headline
              ? editSlots.headline(headlineNode)
              : headlineNode}
            {editSlots?.subhead ? editSlots.subhead(subheadNode) : subheadNode}
            {editSlots?.stats && statsNode
              ? editSlots.stats(statsNode)
              : showStats
                ? statsNode
                : null}
          </div>

          {editSlots?.buttons && buttonsNode
            ? editSlots.buttons(buttonsNode)
            : buttonsNode}
        </div>
      </div>
    </div>
  );
}

function BriefBody({
  formInCard = false,
}: {
  formInCard?: boolean;
}) {
  return (
    <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:items-center lg:gap-16 xl:gap-20">
      <div>
        <SectionEyebrow>For brands &amp; agencies</SectionEyebrow>

        <h2 className="mt-4 max-w-xl font-display text-[2.1rem] leading-[1.08] tracking-tight text-cream sm:text-[2.6rem] md:text-[3rem]">
          Reach B2B audiences through the people they{" "}
          <em className="font-display italic text-[#E4EBE6]">already trust.</em>
        </h2>

        <p className="mt-6 max-w-md text-[0.9rem] leading-relaxed text-cream/70 md:text-base">
          Whether you&apos;re an in-house team briefing direct, or an agency
          briefing us in on behalf of a client — send us the ambition and
          we&apos;ll come back with a shortlist within 48 hours.
        </p>

        <Link
          href="/what-we-do"
          className="mt-8 inline-flex items-center gap-2 rounded-sm border border-cream/30 px-5 py-2.5 text-[0.8125rem] font-medium text-cream transition-colors hover:border-cream hover:bg-cream hover:text-charcoal"
        >
          How we work with brands
          <ArrowIcon className="size-3 shrink-0" />
        </Link>
      </div>

      {formInCard ? (
        <div className="rounded-sm bg-cream px-5 py-6 sm:px-7 sm:py-8 md:px-8 md:py-9">
          <BriefForm surface="light" />
        </div>
      ) : (
        <BriefForm surface="dark" />
      )}
    </div>
  );
}

function BoxedBrief({
  content,
  editSlots,
}: {
  content: HomePageSections["brandBrief"];
  editSlots?: {
    eyebrow?: (node: ReactNode) => ReactNode;
    headline?: (node: ReactNode) => ReactNode;
    subhead?: (node: ReactNode) => ReactNode;
    quote?: (node: ReactNode) => ReactNode;
    formTitle?: (node: ReactNode) => ReactNode;
    formFootnote?: (node: ReactNode) => ReactNode;
  };
}) {
  const eyebrowNode = <SectionEyebrow>{content.eyebrow}</SectionEyebrow>;
  const headlineNode = (
    <h2 className="mt-4 font-display text-[2.15rem] leading-[1.06] tracking-tight text-cream sm:text-[2.65rem] md:text-[3.1rem]">
      {content.headline}{" "}
      <em className="font-display italic text-[#E4EBE6]">
        {content.headlineEmphasis}
      </em>
    </h2>
  );
  const subheadNode = (
    <p className="mt-6 max-w-lg text-[1.05rem] leading-relaxed text-cream/72 sm:text-[1.125rem] md:text-[1.2rem] md:leading-relaxed">
      {content.subhead}
    </p>
  );
  const quoteNode = (
    <figure className="rounded-sm bg-[#3E6D55] px-5 py-5 md:px-6 md:py-6">
      <blockquote>
        <p className="text-[0.9rem] leading-relaxed text-cream/85 md:text-[0.95rem] md:leading-relaxed">
          “{content.quote}”
        </p>
      </blockquote>
      <figcaption className="mt-4 flex items-center gap-3">
        {content.quotePhoto.trim() ? (
          <div className="relative h-11 w-9 shrink-0 overflow-hidden rounded-sm bg-cream/15 md:h-12 md:w-10">
            <Image
              src={content.quotePhoto}
              alt=""
              fill
              sizes="40px"
              className="object-cover object-top"
            />
          </div>
        ) : null}
        <div className="min-w-0 flex-1">
          <p className="truncate text-[0.9rem] font-medium leading-tight text-cream">
            {content.quoteName}
          </p>
          <p className="mt-0.5 truncate text-[0.75rem] leading-tight text-cream/60">
            {content.quoteRole}
          </p>
        </div>
        {content.quoteLogo.trim() ? (
          <img
            src={content.quoteLogo}
            alt={content.quoteLogoName}
            className="h-4 w-auto shrink-0 object-contain md:h-[1.1rem]"
          />
        ) : null}
      </figcaption>
    </figure>
  );
  const formTitleNode = (
    <p className="mb-5 font-display text-[1.15rem] leading-tight tracking-tight text-charcoal md:text-[1.25rem]">
      {content.formTitle}
    </p>
  );
  const formFootnoteNode = content.formFootnote.trim() ? (
    <p className="mt-3 text-center text-[0.72rem] leading-snug text-charcoal/45">
      {content.formFootnote}
    </p>
  ) : editSlots?.formFootnote ? (
    <p className="mt-3 rounded-sm border border-dashed border-charcoal/20 px-4 py-3 text-center text-[0.72rem] text-charcoal/45">
      Form footnote hidden
    </p>
  ) : null;

  return (
    <section className="bg-cream-dark px-6 pb-8 pt-0 md:px-10 md:pb-10 lg:px-12">
      <div className="relative mx-auto max-w-352 overflow-hidden rounded-sm bg-forest-dark shadow-[0_24px_60px_rgba(28,26,23,0.18)]">
        <Home2WaveField
          color={CREAM_RGB}
          lineCount={64}
          baseWidth={2.1}
          className="opacity-[0.14]"
        />
        <div
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(42,73,57,0.5)_0%,transparent_70%)]"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute inset-0 bg-linear-to-b from-forest-dark/35 via-transparent to-forest-dark/50"
          aria-hidden
        />

        <div className="relative z-10 px-4 py-7 sm:px-5 md:px-6 lg:px-7">
          <div className="grid gap-8 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:items-stretch lg:gap-10 xl:gap-12">
            <div className="flex max-w-xl flex-col justify-between gap-10 lg:min-h-full lg:gap-0">
              <div>
                {editSlots?.eyebrow ? editSlots.eyebrow(eyebrowNode) : eyebrowNode}
                {editSlots?.headline
                  ? editSlots.headline(headlineNode)
                  : headlineNode}
                {editSlots?.subhead ? editSlots.subhead(subheadNode) : subheadNode}
              </div>

              {editSlots?.quote ? editSlots.quote(quoteNode) : quoteNode}
            </div>

            <div className="rounded-sm bg-cream px-6 py-7 shadow-[0_20px_50px_rgba(28,26,23,0.22)] sm:px-7 sm:py-8 md:px-8 md:py-9">
              {editSlots?.formTitle
                ? editSlots.formTitle(formTitleNode)
                : formTitleNode}
              <BriefForm surface="light" omitFootnote />
              {editSlots?.formFootnote && formFootnoteNode
                ? editSlots.formFootnote(formFootnoteNode)
                : content.formFootnote.trim()
                  ? formFootnoteNode
                  : null}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export function BrandBrief({
  variant = "full",
  content,
  creatorCta,
  editSlots,
  creatorCtaEditSlots,
}: {
  variant?: "full" | "boxed";
  content?: HomePageSections["brandBrief"];
  creatorCta?: HomePageSections["creatorCta"];
  editSlots?: {
    eyebrow?: (node: ReactNode) => ReactNode;
    headline?: (node: ReactNode) => ReactNode;
    subhead?: (node: ReactNode) => ReactNode;
    quote?: (node: ReactNode) => ReactNode;
    formTitle?: (node: ReactNode) => ReactNode;
    formFootnote?: (node: ReactNode) => ReactNode;
  };
  creatorCtaEditSlots?: {
    eyebrow?: (node: ReactNode) => ReactNode;
    headline?: (node: ReactNode) => ReactNode;
    subhead?: (node: ReactNode) => ReactNode;
    stats?: (node: ReactNode) => ReactNode;
    buttons?: (node: ReactNode) => ReactNode;
  };
}) {
  if (variant === "boxed") {
    return (
      <BoxedBrief
        content={content ?? DEFAULT_HOME_SECTIONS.brandBrief}
        editSlots={editSlots}
      />
    );
  }

  return (
    <section className="bg-charcoal px-6 py-16 md:px-10 md:py-20 lg:px-12 lg:py-24">
      <div className="mx-auto max-w-352">
        <BriefBody />
        <CreatorCta
          className="mt-14 md:mt-16"
          content={creatorCta ?? DEFAULT_HOME_SECTIONS.creatorCta}
          editSlots={creatorCtaEditSlots}
        />
      </div>
    </section>
  );
}
