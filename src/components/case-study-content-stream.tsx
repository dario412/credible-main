"use client";

import type { ReactNode } from "react";

import { SiteImage } from "@/components/site-image";
import { StatCounter } from "@/components/stat-counter";
import { logoAltFor } from "@/lib/image-alt";
import type {
  CaseStudyBlock,
  CaseStudyTocItem,
} from "@/lib/case-study-content";
import { cn } from "@/lib/utils";

export function CaseStudyStoryToc({
  toc,
  className,
}: {
  toc: CaseStudyTocItem[];
  className?: string;
}) {
  if (toc.length === 0) return null;

  return (
    <nav aria-label="On this page" className={className}>
      <p className="font-display text-[1.05rem] font-medium leading-snug tracking-tight text-charcoal">
        In this project
      </p>
      <ol className="mt-3 space-y-2.5">
        {toc.map((item) => (
          <li key={item.id}>
            <a
              href={`#${item.id}`}
              className="block text-[0.8125rem] leading-snug text-charcoal/60 transition-colors hover:text-forest"
            >
              {item.text}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}

function QuoteFullBand({
  block,
}: {
  block: Extract<CaseStudyBlock, { type: "quoteFull" }>;
}) {
  return (
    <section className="bg-cream px-6 py-20 md:px-10 md:py-28 lg:px-12 lg:py-32">
      <div className="mx-auto flex max-w-352 flex-col items-center text-center">
        <blockquote className="max-w-[38rem] text-[1.35rem] leading-[1.35] font-medium tracking-tight text-charcoal sm:text-[1.55rem] md:text-[1.75rem] md:leading-[1.3]">
          “{block.text}”
        </blockquote>

        {block.name.trim() || block.role.trim() ? (
          <div className="mt-10 md:mt-12">
            {block.name.trim() ? (
              <p className="text-[0.95rem] font-medium tracking-tight text-charcoal">
                {block.name}
              </p>
            ) : null}
            {block.role.trim() ? (
              <p className="mt-1 text-[0.875rem] text-charcoal/50">{block.role}</p>
            ) : null}
          </div>
        ) : null}
      </div>
    </section>
  );
}

function StatsBlock({
  block,
}: {
  block: Extract<CaseStudyBlock, { type: "stats" }>;
}) {
  return (
    <div>
      {block.heading?.trim() ? (
        <h3 className="mb-6 font-display text-[1.35rem] leading-tight tracking-tight text-charcoal md:text-[1.5rem]">
          {block.heading}
        </h3>
      ) : null}
      <ul className="border-t border-charcoal/12">
        {block.items.map((result) => (
          <li
            key={result.value + (result.label ?? "") + result.caption}
            className="border-b border-charcoal/12 py-8 md:py-10"
          >
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between sm:gap-10">
              <p className="font-display text-[3.75rem] leading-none tracking-tight text-charcoal sm:text-[4.5rem] md:text-[5.25rem]">
                <StatCounter value={result.value} duration={1400} />
              </p>
              <div className="max-w-md sm:text-right">
                {result.label ? (
                  <p className="text-[1.05rem] leading-snug font-medium text-charcoal md:text-[1.2rem]">
                    {result.label}
                  </p>
                ) : null}
                <p
                  className={cn(
                    "text-sm leading-relaxed text-charcoal/55",
                    result.label ? "mt-1.5" : undefined,
                  )}
                >
                  {result.caption}
                </p>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

function DeliverablesBlock({
  block,
}: {
  block: Extract<CaseStudyBlock, { type: "deliverables" }>;
}) {
  return (
    <div>
      {block.heading?.trim() ? (
        <h3 className="font-display text-[1.35rem] leading-tight tracking-tight text-charcoal md:text-[1.5rem]">
          {block.heading}
        </h3>
      ) : null}

      {block.intro && block.intro.length > 0 ? (
        <div
          className={cn(
            "space-y-4 text-[0.98rem] leading-relaxed text-charcoal/65 md:text-[1.02rem]",
            block.heading?.trim() ? "mt-5" : undefined,
          )}
        >
          {block.intro.map((paragraph) => (
            <p key={paragraph.slice(0, 48)}>{paragraph}</p>
          ))}
        </div>
      ) : null}

      <ul
        className={cn(
          "grid gap-3 sm:grid-cols-2 md:gap-4 lg:grid-cols-3",
          block.heading?.trim() || (block.intro && block.intro.length > 0)
            ? "mt-8"
            : undefined,
        )}
      >
        {block.items.map((item) => (
          <li
            key={item.title}
            className="flex min-h-40 flex-col justify-between rounded-sm bg-cream-dark px-5 pt-6 pb-5 md:min-h-44 md:px-6 md:pt-7 md:pb-6"
          >
            <div>
              <SiteImage
                src={item.logo}
                alt={logoAltFor(item.label)}
                width={120}
                height={28}
                className="h-6 w-auto max-w-[7.5rem] object-contain object-left"
              />
              <p className="mt-4 font-display text-[1.15rem] leading-snug tracking-tight text-charcoal md:text-[1.25rem]">
                {item.title}
              </p>
            </div>
            <p className="mt-6 text-[0.875rem] leading-relaxed text-charcoal/70">
              {item.meta}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}

function ColumnBlock({
  block,
  isFirst,
}: {
  block: CaseStudyBlock;
  isFirst: boolean;
}) {
  const spacing = isFirst ? undefined : "mt-8 md:mt-10";

  switch (block.type) {
    case "h2":
      return (
        <h2
          id={block.id}
          className={cn(
            "scroll-mt-24 font-display text-[1.65rem] leading-tight tracking-tight text-charcoal md:text-[1.85rem]",
            spacing,
          )}
        >
          {block.text}
        </h2>
      );
    case "h3":
      return (
        <h3
          id={block.id}
          className={cn(
            "scroll-mt-24 font-display text-[1.35rem] leading-tight tracking-tight text-charcoal md:text-[1.5rem]",
            spacing,
          )}
        >
          {block.text}
        </h3>
      );
    case "p":
      return (
        <p
          className={cn(
            "text-[0.98rem] leading-relaxed text-charcoal/65 md:text-[1.02rem]",
            isFirst ? undefined : "mt-5",
          )}
        >
          {block.text}
        </p>
      );
    case "quoteInline":
      return (
        <blockquote
          className={cn(
            "border-l-2 border-forest/40 pl-5 text-[1.05rem] leading-relaxed font-medium tracking-tight text-charcoal md:text-[1.125rem]",
            spacing,
          )}
        >
          “{block.text}”
          {block.attribution?.trim() ? (
            <footer className="mt-3 text-[0.875rem] font-normal text-charcoal/55">
              — {block.attribution}
            </footer>
          ) : null}
        </blockquote>
      );
    case "ul":
      return (
        <ul
          className={cn(
            "list-disc space-y-2 pl-5 text-[0.98rem] leading-relaxed text-charcoal/65 md:text-[1.02rem]",
            spacing,
          )}
        >
          {block.items.map((item) => (
            <li key={item.slice(0, 40)}>{item}</li>
          ))}
        </ul>
      );
    case "stats":
      return (
        <div className={spacing}>
          <StatsBlock block={block} />
        </div>
      );
    case "deliverables":
      return (
        <div className={spacing}>
          <DeliverablesBlock block={block} />
        </div>
      );
    default:
      return null;
  }
}

/**
 * Split the block stream into full-bleed bands and column segments so
 * quoteFull can interrupt the article layout anywhere in the order.
 */
export function CaseStudyContentStream({
  blocks,
  toc,
  share,
  sidebarExtra,
  afterColumn,
}: {
  blocks: CaseStudyBlock[];
  toc: CaseStudyTocItem[];
  share: ReactNode;
  sidebarExtra?: ReactNode;
  afterColumn?: ReactNode;
}) {
  type Segment =
    | {
        kind: "quoteFull";
        block: Extract<CaseStudyBlock, { type: "quoteFull" }>;
      }
    | { kind: "column"; blocks: CaseStudyBlock[] };

  const segments: Segment[] = [];
  let columnBuffer: CaseStudyBlock[] = [];

  function flushColumn() {
    if (columnBuffer.length === 0) return;
    segments.push({ kind: "column", blocks: columnBuffer });
    columnBuffer = [];
  }

  for (const block of blocks) {
    if (block.type === "quoteFull") {
      flushColumn();
      segments.push({ kind: "quoteFull", block });
    } else {
      columnBuffer.push(block);
    }
  }
  flushColumn();

  const lastColumnIndex = (() => {
    for (let i = segments.length - 1; i >= 0; i--) {
      if (segments[i]?.kind === "column") return i;
    }
    return -1;
  })();

  let shareRendered = false;

  return (
    <>
      {segments.map((segment, segmentIndex) => {
        if (segment.kind === "quoteFull") {
          return (
            <QuoteFullBand
              key={`quote-${segmentIndex}-${segment.block.text.slice(0, 24)}`}
              block={segment.block}
            />
          );
        }

        const showChrome = !shareRendered;
        shareRendered = true;
        const isLastColumn = segmentIndex === lastColumnIndex;

        return (
          <div
            key={`col-${segmentIndex}`}
            className={cn(
              "bg-cream px-6 pb-0 md:px-10 lg:px-12",
              segmentIndex === 0 || segments[segmentIndex - 1]?.kind === "quoteFull"
                ? "pt-10 md:pt-12 lg:pt-14"
                : "pt-0",
            )}
          >
            <div className="mx-auto max-w-352">
              {showChrome ? (
                <>
                  <div className="mb-8 lg:hidden">{share}</div>
                  <CaseStudyStoryToc
                    toc={toc}
                    className="mb-8 rounded-sm border border-charcoal/8 bg-[#FBF8F5] px-5 py-5 md:mb-10 md:px-6 lg:hidden"
                  />
                </>
              ) : null}

              <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_18rem] lg:items-stretch lg:gap-12 xl:grid-cols-[minmax(0,1fr)_19rem] xl:gap-14">
                <div className="min-w-0 w-full">
                  {segment.blocks.map((block, i) => (
                    <ColumnBlock
                      key={`${block.type}-${i}-${"id" in block ? block.id : i}`}
                      block={block}
                      isFirst={i === 0}
                    />
                  ))}
                  {isLastColumn ? afterColumn : null}
                </div>

                {showChrome ? (
                  <aside className="hidden lg:block">
                    {share}
                    <div className="sticky top-28 mt-8 self-start">
                      <CaseStudyStoryToc toc={toc} />
                      {sidebarExtra ? (
                        <div className={toc.length > 0 ? "mt-8" : undefined}>
                          {sidebarExtra}
                        </div>
                      ) : null}
                    </div>
                  </aside>
                ) : (
                  <div className="hidden lg:block" aria-hidden />
                )}
              </div>
            </div>
          </div>
        );
      })}

      {lastColumnIndex < 0 && afterColumn ? (
        <div className="bg-cream px-6 pt-10 pb-0 md:px-10 md:pt-12 lg:px-12 lg:pt-14">
          <div className="mx-auto max-w-352">{afterColumn}</div>
        </div>
      ) : null}
    </>
  );
}
