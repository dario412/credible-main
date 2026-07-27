import Link from "next/link";
import { ArrowRight } from "@phosphor-icons/react/ssr";

import { CreatorFacesMarquee } from "@/components/creator-faces-marquee";
import { PatternField } from "@/components/pattern-field";
import { cn } from "@/lib/utils";

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
  expert: { slug: string; name: string };
  className?: string;
}) {
  const firstName = creatorName.split(" ")[0] ?? creatorName;

  return (
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
              <p className="text-[0.68rem] font-medium tracking-[0.16em] text-cream/60 uppercase">
                Work with {firstName}
              </p>

              <h2
                id="case-study-creator-cta"
                className="mt-4 max-w-xl font-display text-[1.75rem] leading-[1.1] tracking-tight text-cream sm:text-[2.1rem] md:text-[2.4rem]"
              >
                Interested in working with {firstName} or a similar creator?
              </h2>

              <p className="mt-4 max-w-lg text-[0.95rem] leading-relaxed text-cream/75">
                Tell us the brief — audience, format, and goal. We&apos;ll come
                back with {firstName} or a shortlist of operators who fit the
                same profile.
              </p>

              <div className="mt-7 flex flex-wrap items-center gap-x-5 gap-y-3">
                <CreatorFacesMarquee />
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
                  <p className="text-[0.8125rem] text-cream/70">
                    60+ brands briefed
                  </p>
                  <span
                    aria-hidden
                    className="hidden h-3.5 w-px bg-cream/25 sm:block"
                  />
                  <p className="text-[0.8125rem] text-cream/70">
                    Reply in 2 business days
                  </p>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-3 sm:max-w-xs lg:ml-auto lg:w-full">
              <Link
                href="/contact"
                className="group inline-flex w-full items-center justify-center gap-2 rounded-sm bg-cream px-6 py-3.5 text-[0.9rem] font-medium text-charcoal transition-colors hover:bg-cream-dark active:translate-y-px"
              >
                Send a brief
                <ArrowRight
                  weight="bold"
                  className="size-3.5 shrink-0 transition-transform duration-300 group-hover:translate-x-0.5"
                  aria-hidden
                />
              </Link>
              <Link
                href={`/roster/${expert.slug}`}
                className="inline-flex w-full items-center justify-center gap-2 rounded-sm border border-cream/35 px-6 py-3.5 text-[0.9rem] font-medium text-cream transition-colors hover:border-cream hover:bg-cream/10"
              >
                View {possessiveFirstName(creatorName)} profile
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
