import Link from "next/link";

import { CaseStudyClientMark } from "@/components/case-study-archive-card";
import { SiteImage } from "@/components/site-image";
import type { CaseStudyCard } from "@/lib/case-studies";
import { formatCaseStudyPillars } from "@/lib/case-studies";

/**
 * Featured catalogue hero on /case-studies.
 * - "pair": two equal features (current — thin catalogue)
 * - "featured-rail": large sticky feature + 4 secondary cards (restore when ready)
 */
export type CaseStudiesFeaturedLayout = "pair" | "featured-rail";

/** Flip to "featured-rail" when there are 5+ case studies to lead with. */
export const CASE_STUDIES_FEATURED_LAYOUT: CaseStudiesFeaturedLayout = "pair";

function FeaturedCoverCard({
  study,
  sizes,
  className,
  priority,
}: {
  study: CaseStudyCard;
  sizes: string;
  className?: string;
  priority?: boolean;
}) {
  return (
    <Link
      href={`/case-studies/${study.slug}`}
      className={
        className ??
        "group relative block min-h-[28rem] overflow-hidden rounded-sm md:min-h-[34rem]"
      }
    >
      <SiteImage
        src={study.coverImage}
        alt=""
        fill
        priority={priority}
        sizes={sizes}
        className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.03]"
      />
      <div className="absolute inset-0 bg-linear-to-t from-charcoal/85 via-charcoal/35 to-charcoal/15" />

      <div className="absolute inset-0 flex flex-col justify-between p-6 md:p-8 lg:p-9">
        <CaseStudyClientMark client={study.client} logo={study.logo} />

        <div>
          <h2 className="max-w-lg font-display text-[1.65rem] leading-[1.12] tracking-tight text-cream sm:text-[1.9rem] md:text-[2.15rem]">
            {study.title}
          </h2>
          <p className="mt-5 text-[10px] font-medium tracking-[0.14em] text-cream/55 uppercase">
            {formatCaseStudyPillars(study)}
          </p>
        </div>
      </div>
    </Link>
  );
}

function SecondaryCard({ study }: { study: CaseStudyCard }) {
  return (
    <Link
      href={`/case-studies/${study.slug}`}
      className="group block cursor-pointer"
    >
      <div className="relative aspect-3/4 overflow-hidden rounded-sm bg-[#E4EBE6]">
        <SiteImage
          src={study.coverImage}
          alt=""
          fill
          sizes="(min-width: 1024px) 22vw, (min-width: 640px) 45vw, 100vw"
          className="object-cover transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.03]"
        />
        <div className="absolute top-3 left-3">
          <CaseStudyClientMark client={study.client} logo={study.logo} />
        </div>
      </div>
      <h3 className="mt-3.5 font-display text-[1.15rem] leading-snug tracking-tight text-charcoal transition-colors group-hover:text-forest md:text-[1.25rem]">
        {study.title}
      </h3>
      <p className="mt-2 text-[10px] font-medium tracking-[0.12em] text-charcoal/45 uppercase">
        {formatCaseStudyPillars(study)}
      </p>
    </Link>
  );
}

/** Current thin-catalogue layout: two equal featured covers. */
function PairFeatured({ studies }: { studies: CaseStudyCard[] }) {
  const pair = studies.slice(0, 2);

  return (
    <div className="mx-auto grid max-w-352 items-stretch gap-5 sm:grid-cols-2 lg:gap-6 xl:gap-7">
      {pair.map((study, index) => (
        <FeaturedCoverCard
          key={study.slug}
          study={study}
          priority={index === 0}
          sizes="(min-width: 1024px) 45vw, (min-width: 640px) 50vw, 100vw"
          className="group relative block min-h-[26rem] overflow-hidden rounded-sm md:min-h-[32rem] lg:min-h-[36rem]"
        />
      ))}
    </div>
  );
}

/**
 * Full catalogue hero: sticky featured + four secondary cards.
 * Kept for when the client has enough stories to lead with five.
 */
function FeaturedRail({
  featured,
  secondary,
}: {
  featured: CaseStudyCard;
  secondary: CaseStudyCard[];
}) {
  return (
    <div className="mx-auto grid max-w-352 items-start gap-5 lg:grid-cols-2 lg:gap-6 xl:gap-7">
      <div className="lg:sticky lg:top-6 lg:h-[calc(100dvh-3rem)] lg:self-start">
        <FeaturedCoverCard
          study={featured}
          priority
          sizes="(min-width: 1024px) 45vw, 100vw"
          className="group relative block min-h-[28rem] overflow-hidden rounded-sm md:min-h-[34rem] lg:h-full lg:min-h-0"
        />
      </div>

      <div className="flex flex-col gap-5 lg:gap-6">
        <ul className="grid gap-5 sm:grid-cols-2 sm:gap-5 lg:gap-6">
          {secondary.map((study) => (
            <li key={study.slug}>
              <SecondaryCard study={study} />
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export function CaseStudiesFeatured({
  studies,
  layout = CASE_STUDIES_FEATURED_LAYOUT,
}: {
  /** Ordered catalogue from CMS — first items lead the hero. */
  studies: CaseStudyCard[];
  layout?: CaseStudiesFeaturedLayout;
}) {
  if (studies.length === 0) return null;

  if (layout === "featured-rail") {
    return (
      <FeaturedRail
        featured={studies[0]!}
        secondary={studies.slice(1, 5)}
      />
    );
  }

  return <PairFeatured studies={studies.slice(0, 2)} />;
}
