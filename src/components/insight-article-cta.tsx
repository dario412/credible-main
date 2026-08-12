"use client";

import Link from "next/link";
import { ArrowRight } from "@phosphor-icons/react";

import { useArticleCtaEdit } from "@/components/article-sidebar-cta-editor";
import { useCaseStudyArticleEdit } from "@/components/case-study-article-editor";
import { EditableHit } from "@/components/editable-hit";
import { PatternField } from "@/components/pattern-field";
import { useSiteChrome } from "@/components/site-chrome-context";

const CREAM_RGB = { r: 249, g: 243, b: 239 };

function CtaContent({
  cta,
  editing,
}: {
  cta: {
    headline: string;
    description: string;
    ctaLabel: string;
  };
  editing: boolean;
}) {
  return (
    <div className="relative z-2">
      {cta.headline.trim() ? (
        <p className="font-display text-[1.35rem] leading-[1.12] tracking-tight text-cream md:text-[1.45rem]">
          {cta.headline}
        </p>
      ) : editing ? (
        <p className="font-display text-[1.35rem] leading-[1.12] tracking-tight text-cream/40 md:text-[1.45rem]">
          Headline
        </p>
      ) : null}
      {cta.description.trim() ? (
        <p
          className={`text-[0.8125rem] leading-relaxed text-cream/70 ${
            cta.headline.trim() || editing ? "mt-2" : ""
          }`}
        >
          {cta.description}
        </p>
      ) : editing ? (
        <p className="mt-2 text-[0.8125rem] leading-relaxed text-cream/45">
          Description…
        </p>
      ) : null}

      {cta.ctaLabel.trim() ? (
        <span
          className={`inline-flex items-center gap-1.5 text-[0.875rem] font-medium text-cream ${
            cta.headline.trim() || cta.description.trim() || editing
              ? "mt-5"
              : ""
          }`}
        >
          {cta.ctaLabel}
          <ArrowRight
            weight="bold"
            className="size-3.5 transition-transform duration-300 group-hover:translate-x-0.5"
            aria-hidden
          />
        </span>
      ) : editing ? (
        <span className="mt-5 inline-flex items-center gap-1.5 text-[0.875rem] font-medium text-cream/45">
          CTA label
          <ArrowRight weight="bold" className="size-3.5" aria-hidden />
        </span>
      ) : null}
    </div>
  );
}

export type ArticleSidebarCtaEditProps = {
  editing?: boolean;
  selected?: boolean;
  onSelect?: () => void;
};

/** Compact roster CTA — insight & case study article sidebars. */
export function InsightArticleCta({
  editing: editingProp,
  selected: selectedProp,
  onSelect: onSelectProp,
}: ArticleSidebarCtaEditProps = {}) {
  const articleEdit = useArticleCtaEdit();
  const caseStudyEdit = useCaseStudyArticleEdit();
  const { chrome } = useSiteChrome();
  const cta = chrome.articleSidebarCta;
  const editing =
    editingProp ?? articleEdit?.editing ?? caseStudyEdit?.editing ?? false;
  const selected =
    selectedProp ??
    articleEdit?.selected ??
    caseStudyEdit?.target === "sidebarCta";
  const onSelect =
    onSelectProp ??
    articleEdit?.onSelect ??
    (caseStudyEdit ? () => caseStudyEdit.onSelect("sidebarCta") : undefined);

  const showCard =
    editing ||
    Boolean(cta.headline.trim() || cta.description.trim() || cta.ctaLabel.trim());

  if (!showCard) return null;

  const cardClassName =
    "group relative flex flex-col justify-between overflow-hidden rounded-sm bg-forest px-5 py-6 transition-colors hover:bg-forest-dark md:px-6 md:py-7";

  const inner = (
    <>
      <PatternField
        color={CREAM_RGB}
        className="opacity-[0.12]"
        mask="linear-gradient(to left, black 0%, rgba(0,0,0,0.45) 40%, transparent 85%)"
      />
      <CtaContent cta={cta} editing={editing} />
    </>
  );

  const node = editing ? (
    <div className={cardClassName}>{inner}</div>
  ) : (
    <Link href={cta.ctaHref.trim() || "/roster"} className={cardClassName}>
      {inner}
    </Link>
  );

  if (!onSelect) return node;

  return (
    <EditableHit
      active={editing}
      selected={selected}
      onSelect={onSelect}
      label="Sidebar CTA"
      block
      ringOffset="ring-offset-cream"
    >
      {node}
    </EditableHit>
  );
}
