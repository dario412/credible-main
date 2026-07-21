import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "@phosphor-icons/react/ssr";

import { PatternField } from "@/components/pattern-field";
import type { RosterCardExpert } from "@/components/roster-card";
import { cn } from "@/lib/utils";

const CREAM_RGB = { r: 249, g: 243, b: 239 };

function possessiveFirstName(name: string) {
  const first = name.split(" ")[0] ?? name;
  return first.endsWith("s") ? `${first}'` : `${first}'s`;
}

export function CaseStudyCreatorCta({
  creatorName,
  expert,
  className,
}: {
  creatorName: string;
  expert: RosterCardExpert;
  className?: string;
}) {
  const firstName = creatorName.split(" ")[0] ?? creatorName;
  const imageSrc = expert.image ?? "/images/creator-placeholder.png";

  return (
    <section
      className={cn("scroll-mt-24", className)}
      aria-labelledby="case-study-creator-cta"
    >
      <div className="relative rounded-sm bg-rust px-5 py-7 md:px-7 md:py-8 lg:px-8">
        <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-sm">
          <PatternField
            color={CREAM_RGB}
            className="opacity-[0.12]"
            mask="linear-gradient(to left, black 0%, rgba(0,0,0,0.45) 45%, transparent 88%)"
          />
        </div>

        <div className="relative z-2 grid items-center gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,15rem)] lg:gap-16 xl:gap-20">
          <div className="flex min-w-0 max-w-md flex-col">
            <h2
              id="case-study-creator-cta"
              className="font-display text-[1.45rem] leading-[1.12] tracking-tight text-cream md:text-[1.7rem]"
            >
              Interested in working with {firstName} or a similar creator?
            </h2>

            <p className="mt-3 max-w-lg text-[0.925rem] leading-relaxed text-cream/72 md:text-[0.98rem]">
              Tell us the brief — audience, format, and goal. We&apos;ll come
              back with {firstName} or a shortlist of operators who fit the
              same profile.
            </p>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
              <Link
                href="/contact"
                className="inline-flex flex-1 items-center justify-center gap-2 rounded-sm bg-cream px-5 py-3 text-[0.9rem] font-medium text-charcoal transition-colors hover:bg-cream-dark"
              >
                Send a brief
                <ArrowRight weight="bold" className="size-4" aria-hidden />
              </Link>

              <Link
                href="/roster"
                className="inline-flex flex-1 items-center justify-center gap-2 rounded-sm border border-cream/40 px-5 py-3 text-[0.9rem] font-medium text-cream transition-colors hover:border-cream hover:bg-cream/10"
              >
                Browse similar creators
                <ArrowRight weight="bold" className="size-3.5" aria-hidden />
              </Link>
            </div>

            <div className="mt-5 flex items-center gap-3 border-t border-cream/15 pt-5">
              <div className="flex -space-x-2" aria-hidden>
                {[
                  "/images/experts/amara-chen.jpg",
                  "/images/experts/sofia-martinez.jpg",
                  "/images/experts/lena-weiss.jpg",
                  "/images/experts/daniel-park.jpg",
                ].map((src) => (
                  <span
                    key={src}
                    className="relative size-7 overflow-hidden rounded-full border-2 border-rust"
                  >
                    <Image
                      src={src}
                      alt=""
                      fill
                      sizes="28px"
                      className="object-cover object-top"
                    />
                  </span>
                ))}
              </div>

              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="flex gap-0.5" aria-label="5 out of 5 stars">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <svg
                        key={i}
                        viewBox="0 0 20 20"
                        className="size-3 fill-cream"
                        aria-hidden
                      >
                        <path d="M10 1.5l2.35 5.1 5.55.6-4.15 3.8 1.2 5.4L10 13.9l-4.95 2.5 1.2-5.4L2.1 7.2l5.55-.6L10 1.5z" />
                      </svg>
                    ))}
                  </span>
                  <span className="text-[0.75rem] font-medium text-cream/85">
                    4.9 from brand partners
                  </span>
                </div>
                <p className="mt-0.5 text-[0.7rem] leading-snug text-cream/50">
                  60+ brands briefed · reply in 2 business days
                </p>
              </div>
            </div>
          </div>

          <article className="mx-auto w-full max-w-[15rem] rounded-sm border border-cream/15 bg-[#FBF8F5] p-3 lg:mx-0 lg:justify-self-end">
            <div className="relative aspect-4/3 overflow-hidden rounded-sm bg-[#E4EBE6]">
              <Image
                src={imageSrc}
                alt={expert.name}
                fill
                sizes="240px"
                className="object-cover object-center"
              />
              {expert.role ? (
                <span className="absolute right-2 bottom-2 rounded-sm border border-cream/20 bg-forest/70 px-2 py-0.5 text-[9px] font-medium tracking-[0.12em] text-cream uppercase backdrop-blur-md">
                  {expert.role}
                </span>
              ) : null}
            </div>

            <div className="px-1 pt-3.5 pb-1">
              <h3 className="font-display text-[1.15rem] leading-tight tracking-tight text-charcoal">
                {expert.name}
              </h3>
              {expert.shortBio ? (
                <p className="mt-1.5 line-clamp-2 text-[0.78rem] leading-snug text-charcoal/60">
                  {expert.shortBio}
                </p>
              ) : null}

              <Link
                href={`/roster/${expert.slug}`}
                className="mt-4 inline-flex w-full items-center justify-center rounded-sm border border-forest bg-forest px-3 py-2.5 text-[0.8125rem] font-medium text-cream transition-colors hover:border-forest-dark hover:bg-forest-dark"
              >
                View {possessiveFirstName(creatorName)} profile
              </Link>
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}
