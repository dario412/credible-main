"use client";

import Link from "next/link";
import { ArrowRight } from "@phosphor-icons/react";

import { useCaseStudyArticleEdit } from "@/components/case-study-article-editor";
import { CreatorFacesMarquee } from "@/components/creator-faces-marquee";
import { EditableHit } from "@/components/editable-hit";
import { PatternField } from "@/components/pattern-field";
import { useSiteChrome } from "@/components/site-chrome-context";
import { applyProfileRailTemplate } from "@/lib/site-chrome";
import { cn } from "@/lib/utils";

export function CaseStudyCreatorCta({
  creatorName,
  expert,
  className,
  editing: editingProp,
  selected: selectedProp,
  onSelect: onSelectProp,
}: {
  creatorName: string;
  expert: { slug: string; name: string };
  className?: string;
  editing?: boolean;
  selected?: boolean;
  onSelect?: () => void;
}) {
  const caseStudyEdit = useCaseStudyArticleEdit();
  const { chrome } = useSiteChrome();
  const copy = chrome.caseStudyCreatorCta;
  const first = creatorName.split(" ")[0] ?? creatorName;
  const vars = { first, name: creatorName, slug: expert.slug };
  const eyebrow = applyProfileRailTemplate(copy.eyebrow, vars);
  const headline = applyProfileRailTemplate(copy.headline, vars);
  const description = applyProfileRailTemplate(copy.description, vars);
  const primaryHref = applyProfileRailTemplate(copy.primaryCtaHref, vars);
  const secondaryHref = applyProfileRailTemplate(copy.secondaryCtaHref, vars);
  const secondaryLabel = applyProfileRailTemplate(copy.secondaryCtaLabel, vars);

  const editing = editingProp ?? caseStudyEdit?.editing ?? false;
  const selected =
    selectedProp ?? caseStudyEdit?.target === "creatorCta";
  const onSelect =
    onSelectProp ??
    (caseStudyEdit ? () => caseStudyEdit.onSelect("creatorCta") : undefined);

  const showStats =
    editing ||
    copy.showFacesMarquee ||
    copy.stat1.trim() ||
    copy.stat2.trim();

  const showPrimary = editing || copy.primaryCtaLabel.trim();
  const showSecondary = editing || copy.secondaryCtaLabel.trim();

  const card = (
    <section
      className={cn("scroll-mt-24", className)}
      aria-labelledby="case-study-creator-cta"
    >
      <div className="relative overflow-hidden rounded-sm bg-rust">
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <PatternField
            color={{ r: 249, g: 243, b: 239 }}
            className="opacity-[0.13]"
            mask="linear-gradient(to left, black 0%, rgba(0,0,0,0.4) 45%, transparent 88%)"
          />
        </div>

        <div className="relative z-2 p-7 md:p-8">
          <div className="grid gap-9 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)] lg:items-end lg:gap-16">
            <div>
              {eyebrow.trim() ? (
                <p className="text-[0.68rem] font-medium tracking-[0.16em] text-cream/60 uppercase">
                  {eyebrow}
                </p>
              ) : editing ? (
                <p className="text-[0.68rem] font-medium tracking-[0.16em] text-cream/40 uppercase">
                  Eyebrow
                </p>
              ) : null}

              {headline.trim() ? (
                <h2
                  id="case-study-creator-cta"
                  className="mt-4 max-w-xl font-display text-[1.75rem] leading-[1.1] tracking-tight text-cream sm:text-[2.1rem] md:text-[2.4rem]"
                >
                  {headline}
                </h2>
              ) : editing ? (
                <h2 className="mt-4 max-w-xl font-display text-[1.75rem] leading-[1.1] tracking-tight text-cream/40 sm:text-[2.1rem] md:text-[2.4rem]">
                  Headline
                </h2>
              ) : null}

              {description.trim() ? (
                <p className="mt-4 max-w-lg text-[0.95rem] leading-relaxed text-cream/75">
                  {description}
                </p>
              ) : editing ? (
                <p className="mt-4 max-w-lg text-[0.95rem] leading-relaxed text-cream/45">
                  Description…
                </p>
              ) : null}

              {showStats ? (
                <div className="mt-7 flex flex-wrap items-center gap-x-5 gap-y-3">
                  {copy.showFacesMarquee ? <CreatorFacesMarquee /> : null}
                  {copy.stat1.trim() || copy.stat2.trim() ? (
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
                      {copy.stat1.trim() ? (
                        <p className="text-[0.8125rem] text-cream/70">
                          {copy.stat1}
                        </p>
                      ) : null}
                      {copy.stat1.trim() && copy.stat2.trim() ? (
                        <span
                          aria-hidden
                          className="hidden h-3.5 w-px bg-cream/25 sm:block"
                        />
                      ) : null}
                      {copy.stat2.trim() ? (
                        <p className="text-[0.8125rem] text-cream/70">
                          {copy.stat2}
                        </p>
                      ) : null}
                    </div>
                  ) : editing ? (
                    <p className="text-[0.8125rem] text-cream/45">Stats…</p>
                  ) : null}
                </div>
              ) : null}
            </div>

            {showPrimary || showSecondary ? (
              <div className="flex flex-col gap-3 sm:max-w-xs lg:ml-auto lg:w-full">
                {showPrimary ? (
                  editing ? (
                    <span className="inline-flex w-full items-center justify-center gap-2 rounded-sm bg-cream px-6 py-3.5 text-[0.9rem] font-medium text-charcoal">
                      {copy.primaryCtaLabel.trim() || "Primary button"}
                      <ArrowRight weight="bold" className="size-3.5 shrink-0" />
                    </span>
                  ) : (
                    <Link
                      href={primaryHref || "/contact"}
                      className="group inline-flex w-full items-center justify-center gap-2 rounded-sm bg-cream px-6 py-3.5 text-[0.9rem] font-medium text-charcoal transition-colors hover:bg-cream-dark active:translate-y-px"
                    >
                      {copy.primaryCtaLabel}
                      <ArrowRight
                        weight="bold"
                        className="size-3.5 shrink-0 transition-transform duration-300 group-hover:translate-x-0.5"
                        aria-hidden
                      />
                    </Link>
                  )
                ) : null}
                {showSecondary ? (
                  editing ? (
                    <span className="inline-flex w-full items-center justify-center gap-2 rounded-sm border border-cream/35 px-6 py-3.5 text-[0.9rem] font-medium text-cream">
                      {secondaryLabel.trim() || "Secondary button"}
                    </span>
                  ) : (
                    <Link
                      href={secondaryHref || `/roster/${expert.slug}`}
                      className="inline-flex w-full items-center justify-center gap-2 rounded-sm border border-cream/35 px-6 py-3.5 text-[0.9rem] font-medium text-cream transition-colors hover:border-cream hover:bg-cream/10"
                    >
                      {secondaryLabel}
                    </Link>
                  )
                ) : null}
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );

  if (!onSelect) return card;

  return (
    <EditableHit
      active={editing}
      selected={selected}
      onSelect={onSelect}
      label="Creator CTA"
      block
      ringOffset="ring-offset-cream"
    >
      {card}
    </EditableHit>
  );
}
