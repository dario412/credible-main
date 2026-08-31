"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, CaretLeft, CaretRight } from "@phosphor-icons/react";
import { useEffect, useState } from "react";

import { getCaseStudy, projectSlugFromHref } from "@/lib/case-studies";
import type { ExpertRecentWork } from "@/lib/expert-profiles";
import { coverAltFor } from "@/lib/image-alt";
import { cn } from "@/lib/utils";

export type ExpertTestimonial = {
  quote: string;
  name: string;
  title: string;
  company?: string;
};

const WORK_TONE: Record<ExpertRecentWork["tone"], string> = {
  forest: "bg-[#345B47] text-cream",
  rust: "bg-rust text-cream",
  sage: "bg-[#D8E2DC] text-charcoal",
};

function workTypeLabel(meta: string) {
  return meta
    .replace(/\s*[·•]\s*\d{4}(?:[–-]\d{2,4})?\s*$/u, "")
    .trim();
}

function workCover(item: ExpertRecentWork): string | null {
  if (item.coverImage?.trim()) return item.coverImage.trim();
  const slug = projectSlugFromHref(item.href);
  if (!slug) return null;
  return getCaseStudy(slug)?.coverImage ?? null;
}

function initials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

function PreviewLabel({ children }: { children: string }) {
  return (
    <p className="text-[0.65rem] font-medium tracking-[0.14em] text-charcoal/40 uppercase">
      {children}
    </p>
  );
}

function CtaArrow({ className }: { className?: string }) {
  return (
    <span
      aria-hidden
      className={cn(
        "relative inline-flex size-3.5 shrink-0 overflow-hidden",
        className,
      )}
    >
      <ArrowRight
        weight="bold"
        className="size-3.5 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-[120%]"
      />
      <ArrowRight
        weight="bold"
        className="absolute inset-0 size-3.5 -translate-x-[120%] transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-0"
      />
    </span>
  );
}

/** Full-width featured case — image left, story + CTA right. */
export function FeaturedCaseStudyCard({
  item,
}: {
  item: ExpertRecentWork;
}) {
  const typeLabel = workTypeLabel(item.meta);
  const cover = workCover(item);
  const body = (
    <article className="overflow-hidden rounded-sm bg-[#FBF8F5] transition-[box-shadow,transform] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:shadow-[0_18px_44px_rgba(28,26,23,0.08)]">
      <div className="grid md:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)]">
        <div
          className={cn(
            "relative aspect-4/3 overflow-hidden md:aspect-auto md:min-h-64 lg:min-h-72",
            !cover && WORK_TONE[item.tone],
          )}
        >
          {cover ? (
            <>
              <Image
                src={cover}
                alt={coverAltFor(`${item.client} project`)}
                fill
                sizes="(min-width: 1024px) 28rem, (min-width: 768px) 50vw, 100vw"
                className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.03]"
              />
              <div
                aria-hidden
                className="absolute inset-0 bg-linear-to-t from-charcoal/25 via-transparent to-transparent opacity-80"
              />
            </>
          ) : (
            <div className="flex h-full min-h-52 items-center justify-center px-6">
              <span className="font-display text-[1.65rem] tracking-tight md:text-[1.85rem]">
                {item.client}
              </span>
            </div>
          )}
          {typeLabel ? (
            <span className="absolute top-4 left-4 z-10 rounded-sm border border-cream/25 bg-charcoal/40 px-2.5 py-1 text-[0.625rem] font-medium tracking-[0.12em] text-cream uppercase shadow-[0_6px_18px_rgba(28,26,23,0.18)] backdrop-blur-md">
              {typeLabel}
            </span>
          ) : null}
        </div>

        <div className="flex min-w-0 flex-col justify-center px-6 py-7 md:px-8 md:py-9 lg:px-10 lg:py-10">
          <p className="text-[0.65rem] font-medium tracking-[0.14em] text-forest uppercase">
            {item.client}
          </p>
          <h3 className="mt-3 font-display text-[1.45rem] leading-[1.15] tracking-tight text-charcoal transition-colors duration-300 group-hover:text-forest md:text-[1.65rem]">
            {item.title}
          </h3>
          <p className="mt-3 max-w-md text-[0.925rem] leading-relaxed text-charcoal/55">
            {item.description}
          </p>
          {item.href ? (
            <span className="mt-7 inline-flex w-fit items-center gap-2 rounded-sm bg-forest px-5 py-2.5 text-[0.8125rem] font-medium text-cream transition-colors duration-300 group-hover:bg-forest-dark">
              Read the project
              <CtaArrow className="text-cream" />
            </span>
          ) : null}
        </div>
      </div>
    </article>
  );

  if (item.href) {
    return (
      <Link href={item.href} className="group block">
        {body}
      </Link>
    );
  }

  return body;
}

function TestimonialCard({
  item,
  className,
  featured = false,
}: {
  item: ExpertTestimonial;
  className?: string;
  featured?: boolean;
}) {
  return (
    <figure
      className={cn(
        "flex h-full flex-col rounded-sm bg-[#FBF8F5]",
        featured ? "px-7 py-8 md:px-9 md:py-10" : "px-5 py-6 md:px-6 md:py-7",
        className,
      )}
    >
      <p className="text-[0.65rem] font-medium tracking-[0.14em] text-charcoal/40 uppercase">
        Brand partner
      </p>

      <blockquote
        className={cn(
          "mt-4 font-display tracking-tight text-charcoal",
          featured
            ? "text-[1.3rem] leading-[1.28] md:text-[1.5rem] md:leading-[1.26]"
            : "text-[1.05rem] leading-[1.32] md:text-[1.15rem] md:leading-[1.3]",
        )}
      >
        “{item.quote}”
      </blockquote>

      <figcaption className="mt-auto flex items-center gap-3 border-t border-charcoal/10 pt-5">
        <span
          className="inline-flex size-9 shrink-0 items-center justify-center rounded-full bg-forest/10 font-display text-[0.75rem] tracking-tight text-forest"
          aria-hidden
        >
          {initials(item.name)}
        </span>
        <div className="min-w-0">
          <p className="truncate text-[0.875rem] font-medium text-charcoal">
            {item.name}
          </p>
          <p className="truncate text-[0.78rem] text-charcoal/55">
            {item.title}
            {item.company ? ` · ${item.company}` : null}
          </p>
        </div>
      </figcaption>
    </figure>
  );
}

/** Single testimonial — used when an expert has no case studies. */
export function ExpertTestimonialSingle({
  item,
}: {
  item: ExpertTestimonial;
}) {
  return <TestimonialCard item={item} featured />;
}

/** Multi-card slider.
 *  2 quotes → both visible
 *  3 quotes → all three visible
 *  4+ → three in view, advance one card at a time
 */
export function ExpertTestimonialSlider({
  items,
}: {
  items: ExpertTestimonial[];
}) {
  const count = items.length;
  const [index, setIndex] = useState(0);
  const [perView, setPerView] = useState(1);

  useEffect(() => {
    const update = () => {
      if (window.matchMedia("(min-width: 1024px)").matches) {
        setPerView(count >= 3 ? 3 : count);
      } else if (window.matchMedia("(min-width: 640px)").matches) {
        setPerView(count >= 2 ? 2 : 1);
      } else {
        setPerView(1);
      }
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, [count]);

  const maxIndex = Math.max(0, count - perView);

  useEffect(() => {
    setIndex((i) => Math.min(i, maxIndex));
  }, [maxIndex]);

  if (count === 0) return null;

  const stepCount = maxIndex + 1;
  const safeIndex = Math.min(index, maxIndex);

  function go(delta: number) {
    setIndex((i) => {
      const next = i + delta;
      if (next < 0) return maxIndex;
      if (next > maxIndex) return 0;
      return next;
    });
  }

  const showControls = stepCount > 1;

  return (
    <div className="relative">
      <div className="overflow-hidden">
        <ul
          className="flex transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]"
          style={{
            transform: `translateX(-${safeIndex * (100 / perView)}%)`,
          }}
        >
          {items.map((item) => (
            <li
              key={item.name}
              className="shrink-0 px-1.5 first:pl-0 last:pr-0 sm:px-2"
              style={{ width: `${100 / perView}%` }}
            >
              <TestimonialCard item={item} className="h-full" />
            </li>
          ))}
        </ul>
      </div>

      {showControls ? (
        <div className="mt-6 flex items-center justify-between gap-4">
          <div
            className="flex items-center gap-2"
            role="tablist"
            aria-label="Testimonial position"
          >
            {Array.from({ length: stepCount }, (_, i) => (
              <button
                key={i}
                type="button"
                role="tab"
                aria-selected={i === safeIndex}
                aria-label={`Show from testimonial ${i + 1}`}
                onClick={() => setIndex(i)}
                className={cn(
                  "h-1.5 rounded-full transition-all duration-300",
                  i === safeIndex
                    ? "w-7 bg-forest"
                    : "w-1.5 bg-charcoal/20 hover:bg-charcoal/35",
                )}
              />
            ))}
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => go(-1)}
              aria-label="Previous testimonial"
              className="inline-flex size-9 items-center justify-center rounded-sm border border-charcoal/10 bg-cream text-charcoal transition-colors hover:border-charcoal/20 hover:bg-[#FBF8F5]"
            >
              <CaretLeft weight="bold" className="size-4" aria-hidden />
            </button>
            <button
              type="button"
              onClick={() => go(1)}
              aria-label="Next testimonial"
              className="inline-flex size-9 items-center justify-center rounded-sm border border-charcoal/10 bg-cream text-charcoal transition-colors hover:border-charcoal/20 hover:bg-[#FBF8F5]"
            >
              <CaretRight weight="bold" className="size-4" aria-hidden />
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}

/** Adaptive testimonials: one card if a single quote, otherwise multi-card slider. */
export function ExpertTestimonials({
  items,
}: {
  items: ExpertTestimonial[];
}) {
  if (items.length === 0) return null;
  if (items.length === 1) {
    return <ExpertTestimonialSingle item={items[0]!} />;
  }
  return <ExpertTestimonialSlider items={items} />;
}

const PREVIEW_TESTIMONIALS: ExpertTestimonial[] = [
  {
    quote:
      "Alex turned a product story into something operators actually finished — and then forwarded to their team.",
    name: "Priya Natarajan",
    title: "VP Brand",
    company: "Notion",
  },
  {
    quote:
      "The Year of Founders partnership felt editorial, not sponsored. That authenticity is why the room stayed with us.",
    name: "Marcus Wei",
    title: "Head of Partnerships",
    company: "Ramp",
  },
  {
    quote:
      "We briefed for a keynote and got a narrative our buyers already trusted. Pipeline followed the conversation.",
    name: "Elena Ortiz",
    title: "CMO",
    company: "HubSpot",
  },
  {
    quote:
      "Selective, considered, and on-brief — the kind of creator partnership that compounds instead of peaking once.",
    name: "Jordan Hale",
    title: "Director of Marketing",
    company: "Webflow",
  },
  {
    quote:
      "He made the category feel inevitable. That is rare — and exactly what we needed from the stage.",
    name: "Sam Okonkwo",
    title: "VP Marketing",
    company: "Airtable",
  },
];

function TestimonialsLayoutPreview() {
  const [mode, setMode] = useState<"one" | "two" | "three" | "slider">("three");
  const items =
    mode === "one"
      ? PREVIEW_TESTIMONIALS.slice(0, 1)
      : mode === "two"
        ? PREVIEW_TESTIMONIALS.slice(0, 2)
        : mode === "three"
          ? PREVIEW_TESTIMONIALS.slice(0, 3)
          : PREVIEW_TESTIMONIALS;

  const modes = [
    { id: "one" as const, label: "1 quote" },
    { id: "two" as const, label: "2 side by side" },
    { id: "three" as const, label: "3 side by side" },
    { id: "slider" as const, label: "5 · slide by 1" },
  ];

  return (
    <div className="rounded-sm border border-charcoal/8 bg-cream px-5 py-6 md:px-7 md:py-8">
      <PreviewLabel>Layout option · No case studies · Testimonials</PreviewLabel>
      <p className="mt-2 max-w-xl text-[0.875rem] leading-relaxed text-charcoal/50">
        One quote is a single card. Two or three sit side by side. More than
        three keeps three in view and advances one card at a time.
      </p>

      <div className="mt-5 flex flex-wrap gap-2">
        {modes.map((m) => (
          <button
            key={m.id}
            type="button"
            onClick={() => setMode(m.id)}
            className={cn(
              "rounded-sm px-3 py-1.5 text-[0.75rem] font-medium transition-colors",
              mode === m.id
                ? "bg-charcoal text-cream"
                : "bg-charcoal/6 text-charcoal/65 hover:bg-charcoal/10",
            )}
          >
            {m.label}
          </button>
        ))}
      </div>

      <div className="mt-6">
        <ExpertTestimonials key={mode} items={items} />
      </div>
    </div>
  );
}

/** Labeled layout options under Recent work — for client review. */
export function ExpertWorkLayoutPreviews({
  work,
}: {
  work: ExpertRecentWork[];
}) {
  const featured = work[0];
  if (!featured) return null;

  return (
    <div className="flex flex-col gap-14 border-t border-charcoal/10 pt-14 md:gap-16 md:pt-16">
      <div className="rounded-sm border border-charcoal/8 bg-cream px-5 py-6 md:px-7 md:py-8">
        <PreviewLabel>Layout option · Single case study</PreviewLabel>
        <p className="mt-2 mb-6 max-w-xl text-[0.875rem] leading-relaxed text-charcoal/50">
          When an expert has one featured case — full-width card with media on
          the left and story + CTA on the right.
        </p>
        <FeaturedCaseStudyCard item={featured} />
      </div>

      <TestimonialsLayoutPreview />
    </div>
  );
}
