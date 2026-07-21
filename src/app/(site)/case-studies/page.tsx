import Image from "next/image";
import Link from "next/link";
import { ArrowDown } from "@phosphor-icons/react/ssr";

import {
  CaseStudyArchiveCard,
  CaseStudyClientMark,
} from "@/components/case-study-archive-card";
import { CaseStudyFilters } from "@/components/case-study-filters";
import { ImpactStats } from "@/components/impact-stats";
import {
  featuredCaseStudy,
  filterCaseStudies,
  secondaryCaseStudies,
} from "@/lib/case-studies";
import { createMetadata } from "@/lib/seo";

export const metadata = createMetadata({
  title: "Case studies",
  description:
    "Work that ran — deals Credible structured, delivered, and measured across content, brand, speaking, and live events.",
  path: "/case-studies",
});

type SearchParams = Promise<{
  clientType?: string;
  pillar?: string;
  q?: string;
}>;

export default async function CaseStudiesPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const params = await searchParams;
  const clientType = params.clientType?.trim();
  const pillar = params.pillar?.trim();
  const q = params.q?.trim();

  const featured = featuredCaseStudy();
  const secondary = secondaryCaseStudies();
  const stories = filterCaseStudies({ clientType, pillar, q });

  return (
    <>
      <section className="mx-auto max-w-352 px-6 pt-16 pb-12 md:px-10 md:pt-20 md:pb-14 lg:px-12 lg:pt-24 lg:pb-16">
        <h1 className="max-w-[16ch] font-display text-[2.6rem] leading-[1.05] tracking-tight text-charcoal sm:text-[3.25rem] md:text-[3.75rem] lg:text-[4.15rem]">
          Work that ran, and
          <br />
          what happened <span className="text-forest">next.</span>
        </h1>
        <p className="mt-6 max-w-xl text-[1.05rem] leading-relaxed text-charcoal/65 md:text-[1.125rem]">
          Not decks or promises — deals we structured, delivered, and measured
          with expert creators your buyers already trust.
        </p>
      </section>

      <section className="mx-auto max-w-352 px-6 pb-16 md:px-10 md:pb-20 lg:px-12 lg:pb-24">
        <div className="grid items-start gap-5 lg:grid-cols-2 lg:gap-6 xl:gap-7">
          <div className="lg:sticky lg:top-6 lg:self-start lg:h-[calc(100dvh-3rem)]">
            <Link
              href={`/case-studies/${featured.slug}`}
              className="group relative block min-h-[28rem] overflow-hidden rounded-sm md:min-h-[34rem] lg:h-full lg:min-h-0"
            >
              <Image
                src={featured.coverImage}
                alt=""
                fill
                priority
                sizes="(min-width: 1024px) 45vw, 100vw"
                className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.03]"
              />
              <div className="absolute inset-0 bg-linear-to-t from-charcoal/85 via-charcoal/35 to-charcoal/15" />

              <div className="absolute inset-0 flex flex-col justify-between p-6 md:p-8 lg:p-9">
                <CaseStudyClientMark client={featured.client} />

                <div>
                  <h2 className="max-w-lg font-display text-[1.65rem] leading-[1.12] tracking-tight text-cream sm:text-[1.9rem] md:text-[2.15rem]">
                    {featured.title}
                  </h2>
                  <p className="mt-5 text-[10px] font-medium tracking-[0.14em] text-cream/55 uppercase">
                    {featured.pillar}
                  </p>
                </div>
              </div>
            </Link>
          </div>

          <div className="flex flex-col gap-5 lg:gap-6">
            <ul className="grid gap-5 sm:grid-cols-2 sm:gap-5 lg:gap-6">
              {secondary.map((study) => (
                <li key={study.slug}>
                  <Link
                    href={`/case-studies/${study.slug}`}
                    className="group block cursor-pointer"
                  >
                    <div className="relative aspect-3/4 overflow-hidden rounded-sm bg-[#E4EBE6]">
                      <Image
                        src={study.coverImage}
                        alt=""
                        fill
                        sizes="(min-width: 1024px) 22vw, (min-width: 640px) 45vw, 100vw"
                        className="object-cover transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.03]"
                      />
                      <div className="absolute top-3 left-3">
                        <CaseStudyClientMark client={study.client} />
                      </div>
                    </div>
                    <h3 className="mt-3.5 font-display text-[1.15rem] leading-snug tracking-tight text-charcoal transition-colors group-hover:text-forest md:text-[1.25rem]">
                      {study.title}
                    </h3>
                    <p className="mt-2 text-[10px] font-medium tracking-[0.12em] text-charcoal/45 uppercase">
                      {study.pillar}
                    </p>
                  </Link>
                </li>
              ))}
            </ul>

            <Link
              href="#all-case-studies"
              className="flex w-full items-center justify-center gap-2 rounded-sm bg-cream-dark px-6 py-4 text-[0.875rem] font-medium text-charcoal transition-colors hover:bg-[#E4EBE6]"
            >
              <ArrowDown weight="bold" className="size-3.5" aria-hidden />
              Read all case studies
            </Link>
          </div>
        </div>
      </section>

      <ImpactStats />

      <section
        id="all-case-studies"
        className="scroll-mt-8 bg-cream"
      >
        <div className="mx-auto max-w-352 px-6 py-16 md:px-10 md:py-20 lg:px-12 lg:py-24">
          <h2 className="font-display text-[2rem] leading-[1.12] tracking-tight text-charcoal sm:text-[2.4rem] md:text-[2.75rem]">
            All stories
          </h2>

          <div className="mt-8 md:mt-10">
            <CaseStudyFilters
              currentClientType={clientType}
              currentPillar={pillar}
              currentQuery={q}
            />
          </div>

          {stories.length > 0 ? (
            <ul className="mt-10 grid gap-8 sm:grid-cols-2 md:mt-12 lg:grid-cols-3 lg:gap-10">
              {stories.map((study) => (
                <li key={study.slug}>
                  <CaseStudyArchiveCard study={study} />
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-10 text-sm text-charcoal/50 md:mt-12">
              No case studies match these filters.
            </p>
          )}
        </div>
      </section>
    </>
  );
}
