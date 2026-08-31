import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";

import { PatternField } from "@/components/pattern-field";
import { StatCounter } from "@/components/stat-counter";
import type { HomePageSections } from "@/lib/cms";
import { DEFAULT_HOME_SECTIONS } from "@/lib/cms";
import { projectHref } from "@/lib/case-studies";
import { cn } from "@/lib/utils";

const CREAM_RGB = { r: 249, g: 243, b: 239 };

const boxedMetrics = [
  {
    label: "Episodes shipped",
    value: "12",
    caption: "Video + audio + written",
  },
  {
    label: "Total downloads",
    value: "4.1M",
    caption: "Across all channels",
  },
  {
    label: "Pipeline attributed",
    value: "$18.4M",
    caption: "Notion, first-touch attribution",
  },
  {
    label: "Partnership term",
    value: "22mo",
    caption: "Currently renewed through 2027",
  },
] as const;

const CASE_STUDY_HREF = projectHref("notion-founders-journal");

function ArrowIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 256 256"
      fill="currentColor"
      aria-hidden
      className={className}
    >
      <path d="M221.66,133.66l-72,72a8,8,0,0,1-11.32-11.32L196.69,136H40a8,8,0,0,1,0-16H196.69L138.34,61.66a8,8,0,0,1,11.32-11.32l72,72A8,8,0,0,1,221.66,133.66Z" />
    </svg>
  );
}

function CaseStudyCta({
  className,
  tone = "cream",
  label = "Read the full project",
  href = CASE_STUDY_HREF,
}: {
  className?: string;
  tone?: "cream" | "solid" | "charcoal";
  label?: string;
  href?: string;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "inline-flex shrink-0 items-center justify-center gap-2 rounded-sm px-5 py-2.5 text-[0.8125rem] font-medium transition-colors",
        tone === "charcoal"
          ? "bg-charcoal text-cream hover:bg-forest"
          : tone === "solid"
            ? "bg-cream text-charcoal hover:bg-cream-dark"
            : "border border-cream/30 text-cream hover:border-cream hover:bg-cream hover:text-charcoal",
        className,
      )}
    >
      {label}
      <ArrowIcon className="size-3 shrink-0" />
    </Link>
  );
}

function FullKeyStudy({
  content,
  editSlots,
}: {
  content: HomePageSections["keyStudy"];
  editSlots?: {
    logo?: (node: ReactNode) => ReactNode;
    headline?: (node: ReactNode) => ReactNode;
    summary?: (node: ReactNode) => ReactNode;
    meta?: (node: ReactNode) => ReactNode;
    cta?: (node: ReactNode) => ReactNode;
    metric?: (index: number, node: ReactNode) => ReactNode;
  };
}) {
  const logoSrc = content.logoSrc.trim();
  const logoNode = logoSrc ? (
    <img
      src={logoSrc}
      alt={content.logoAlt.trim() || "Client"}
      className="h-7 w-auto object-contain md:h-8"
    />
  ) : editSlots?.logo ? (
    <p className="rounded-sm border border-dashed border-charcoal/20 px-4 py-3 text-[0.8125rem] text-charcoal/45">
      Client logo hidden
    </p>
  ) : null;
  const headlineNode = (
    <h2 className="font-display text-[1.85rem] leading-[1.08] tracking-tight text-charcoal sm:text-[2.15rem] md:text-[2.45rem]">
      {content.headline}{" "}
      <span className="text-forest">{content.headlineAccent}</span>
    </h2>
  );
  const summaryNode = (
    <p className="mt-4 max-w-xl text-[0.925rem] leading-relaxed text-charcoal/70 md:text-[0.975rem]">
      {content.summary}
    </p>
  );
  const metaNode = (
    <dl className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 text-[0.8125rem] md:gap-x-6">
      {content.meta
        .filter((item) => item.label.trim() || item.value.trim())
        .map((item, index) => (
        <div key={`${item.label}-${index}`} className="contents">
          {index > 0 ? (
            <span
              aria-hidden
              className="hidden h-3.5 w-px bg-charcoal/20 sm:block"
            />
          ) : null}
          <div className="flex items-baseline gap-2">
            <dt className="font-medium text-charcoal/50">{item.label}</dt>
            <dd className="font-medium text-charcoal">{item.value}</dd>
          </div>
        </div>
      ))}
    </dl>
  );
  const ctaNode = content.showCta ? (
    <CaseStudyCta
      tone="charcoal"
      className="mt-8"
      label={content.ctaLabel}
      href={content.ctaHref}
    />
  ) : editSlots?.cta ? (
    <p className="mt-8 rounded-sm border border-dashed border-charcoal/20 px-4 py-3 text-[0.8125rem] text-charcoal/45">
      Case study button hidden
    </p>
  ) : null;

  return (
    <section className="bg-cream-dark px-6 py-12 md:px-10 md:py-14 lg:px-12 lg:py-16">
      <div className="mx-auto max-w-352">
        {editSlots?.logo && logoNode
          ? editSlots.logo(logoNode)
          : logoNode}

        <div className="mt-7 grid gap-10 border-b border-charcoal/12 pb-10 md:mt-8 md:gap-12 md:pb-12 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] lg:items-start lg:gap-14 xl:gap-20">
          <div className="max-w-2xl">
            {editSlots?.headline ? editSlots.headline(headlineNode) : headlineNode}
            {editSlots?.summary ? editSlots.summary(summaryNode) : summaryNode}
            {editSlots?.meta ? editSlots.meta(metaNode) : metaNode}
            {editSlots?.cta && ctaNode
              ? editSlots.cta(ctaNode)
              : content.showCta
                ? ctaNode
                : null}
          </div>

          <ul className="min-w-0">
            {content.metrics.map((metric, index) => {
              const row = (
                <div className="flex items-baseline gap-4 sm:gap-5 md:gap-6">
                  <p className="shrink-0 font-display text-[2.5rem] leading-none tracking-tight text-charcoal sm:text-[2.85rem] md:text-[3.25rem]">
                    <StatCounter
                      value={metric.value}
                      duration={1400}
                      delay={index * 100}
                    />
                  </p>
                  <div className="min-w-0">
                    <p className="text-[0.9rem] leading-snug font-medium text-charcoal md:text-[0.95rem]">
                      {metric.label}
                    </p>
                    {metric.note ? (
                      <p className="mt-1 text-[0.75rem] leading-snug text-charcoal/55">
                        ({metric.note})
                      </p>
                    ) : null}
                  </div>
                </div>
              );

              return (
                <li
                  key={`${metric.value}-${metric.label}-${index}`}
                  className="border-b border-charcoal/12 py-5 first:pt-0 last:border-b-0 last:pb-0 md:py-6"
                >
                  {editSlots?.metric ? editSlots.metric(index, row) : row}
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </section>
  );
}

function BoxedKeyStudy() {
  return (
    <section className="bg-cream px-6 py-8 md:px-10 md:py-10 lg:px-12">
      <div className="relative mx-auto max-w-352 overflow-hidden rounded-sm bg-forest px-6 py-14 md:px-10 md:py-16 lg:px-12 lg:py-20">
        <PatternField
          color={CREAM_RGB}
          className="opacity-[0.14]"
          mask="linear-gradient(to left, black 0%, rgba(0,0,0,0.55) 35%, rgba(0,0,0,0.12) 65%, transparent 85%)"
        />

        <div className="relative z-2 grid gap-10 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:items-end lg:gap-14 xl:gap-16">
          <div>
            <Image
              src="/brand/notion-logo.png"
              alt="Notion"
              width={200}
              height={200}
              className="size-12 object-contain brightness-0 invert md:size-14"
            />

            <p className="mt-6 text-[0.7rem] font-medium tracking-[0.18em] text-cream/55 uppercase">
              Project
            </p>

            <h2 className="mt-3 max-w-2xl font-display text-[2.3rem] leading-[1.06] tracking-tight text-cream sm:text-[2.8rem] md:text-[3.25rem]">
              How Notion built B2B&apos;s defining founder series —{" "}
              <em className="font-display italic text-[#E4EBE6]">
                without a studio.
              </em>
            </h2>

            <p className="mt-6 max-w-lg text-[0.9rem] leading-relaxed text-cream/75 md:text-base">
              One trusted voice, twelve episodes, zero production overhead. We
              paired Notion with Alex Lieberman as editorial lead and ran
              everything end-to-end — casting, format, distribution.
              Twenty-two months in, it&apos;s the highest-performing brand
              series in its category.
            </p>

            <CaseStudyCta className="mt-8" />
          </div>

          <ul className="grid grid-cols-2 gap-3 md:gap-4">
            {boxedMetrics.map((metric) => (
              <li
                key={metric.label}
                className="flex min-h-36 flex-col justify-between rounded-sm bg-cream/95 px-5 pb-5 pt-6 md:min-h-40 md:px-6 md:pb-6 md:pt-7"
              >
                <div>
                  <p className="text-sm font-medium text-charcoal/65">
                    {metric.label}
                  </p>
                  <p className="mt-3 font-display text-[2.15rem] leading-none tracking-tight text-charcoal md:text-[2.5rem]">
                    <StatCounter value={metric.value} />
                  </p>
                </div>
                <p className="mt-4 text-[0.75rem] leading-relaxed text-charcoal/65">
                  {metric.caption}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

export function KeyStudy({
  variant = "boxed",
  content = DEFAULT_HOME_SECTIONS.keyStudy,
  editSlots,
}: {
  variant?: "boxed" | "full";
  content?: HomePageSections["keyStudy"];
  editSlots?: {
    logo?: (node: ReactNode) => ReactNode;
    headline?: (node: ReactNode) => ReactNode;
    summary?: (node: ReactNode) => ReactNode;
    meta?: (node: ReactNode) => ReactNode;
    cta?: (node: ReactNode) => ReactNode;
    metric?: (index: number, node: ReactNode) => ReactNode;
  };
}) {
  if (variant === "full") {
    return <FullKeyStudy content={content} editSlots={editSlots} />;
  }
  return <BoxedKeyStudy />;
}
