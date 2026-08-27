"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "@phosphor-icons/react/ssr";

import { ExpertHeroStats } from "@/components/expert-hero-stats";
import { useSiteChrome } from "@/components/site-chrome-context";
import { ProfileEditHit } from "@/components/use-profile-edit-hit";
import { brandsWithLogos } from "@/lib/brand-logos";
import { firstName, type ExpertProfileStat } from "@/lib/expert-profiles";
import { applyProfileRailTemplate } from "@/lib/site-chrome";
import { cn } from "@/lib/utils";

export function ExpertProfileStageHero({
  slug,
  name,
  title,
  archetype,
  based,
  stageImage,
  stageImagePosition,
  portraitImage,
  heroProof,
  trustedBy = [],
  stats,
}: {
  slug: string;
  name: string;
  title: string;
  archetype: string | null;
  based?: string;
  stageImage?: string;
  stageImagePosition?: string;
  portraitImage: string | null;
  heroProof?: string;
  trustedBy?: { name: string; logo?: string }[];
  stats: ExpertProfileStat[];
}) {
  const { chrome } = useSiteChrome();
  const first = firstName(name);
  const cover = stageImage ?? portraitImage ?? "/images/case-studies/notion.jpg";
  const proof =
    heroProof ?? [title, archetype, based].filter(Boolean).join(" · ");
  const briefLabel = applyProfileRailTemplate(
    chrome.profileLayout.heroBriefCtaLabel,
    { first, name, slug },
  );
  const trustedByLabel = chrome.profileLayout.trustedByLabel;

  // Tall Trusted-by hero only when we have real logos; otherwise compact new-creator layout
  const logoBrands = brandsWithLogos(trustedBy);
  const showTrustedBy = logoBrands.length > 0;

  return (
    <section
      className={cn(
        "relative isolate w-full overflow-hidden",
        "-mt-[7.25rem] md:-mt-[5.5rem]",
        showTrustedBy
          ? "min-h-[min(88vh,48rem)] md:min-h-[min(90vh,52rem)]"
          : "min-h-[min(72vh,40rem)] md:min-h-[min(76vh,44rem)]",
      )}
      aria-label={
        showTrustedBy ? undefined : "Creator profile hero without Trusted by"
      }
    >
      <Image
        src={cover}
        alt=""
        fill
        priority
        sizes="100vw"
        className="object-cover"
        style={
          stageImagePosition
            ? { objectPosition: stageImagePosition }
            : undefined
        }
      />
      <div
        aria-hidden
        className="absolute inset-0 bg-linear-to-t from-charcoal via-charcoal/78 to-charcoal/55"
      />
      <div
        aria-hidden
        className="absolute inset-0 bg-linear-to-r from-charcoal/85 via-charcoal/45 to-transparent"
      />
      <div
        aria-hidden
        className="absolute inset-x-0 top-0 h-[55%] backdrop-blur-[8px]"
        style={{
          maskImage:
            "linear-gradient(to bottom, black 0%, black 35%, transparent 100%)",
          WebkitMaskImage:
            "linear-gradient(to bottom, black 0%, black 35%, transparent 100%)",
        }}
      />

      <div
        className={cn(
          "relative flex flex-col px-6 pb-12 md:px-10 md:pb-14 lg:px-12 lg:pb-16",
          showTrustedBy
            ? "min-h-[min(88vh,48rem)] pt-48 md:min-h-[min(90vh,52rem)] md:pt-56"
            : "min-h-[min(72vh,40rem)] pt-28 md:min-h-[min(76vh,44rem)] md:pt-32",
        )}
      >
        <div
          className={cn(
            "mx-auto flex w-full max-w-352 flex-1 flex-col",
            showTrustedBy ? "justify-between" : "justify-end",
          )}
        >
          <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end lg:gap-16">
            <div className="max-w-3xl">
              <h1 className="max-w-[12ch] font-display text-[3rem] leading-[1.02] tracking-tight text-cream drop-shadow-[0_2px_24px_rgba(0,0,0,0.35)] sm:text-[3.75rem] md:text-[4.5rem] lg:text-[5rem]">
                {name}.
              </h1>

              <p className="mt-5 max-w-xl text-[1.1rem] leading-relaxed text-cream/90 md:mt-6 md:text-[1.2rem]">
                {proof}
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
                <ProfileEditHit
                  field="profileLayout.heroBriefCtaLabel"
                  label="Hero brief CTA"
                  ringOffset="ring-offset-charcoal"
                >
                  <Link
                    href={`/contact?expert=${encodeURIComponent(slug)}`}
                    className="group inline-flex items-center justify-center gap-2 rounded-sm bg-forest px-6 py-3.5 text-[0.875rem] font-medium text-cream transition-colors hover:bg-forest-dark"
                  >
                    {briefLabel}
                    <ArrowRight
                      weight="bold"
                      className="size-3.5 transition-transform duration-300 group-hover:translate-x-0.5"
                      aria-hidden
                    />
                  </Link>
                </ProfileEditHit>
              </div>
            </div>

            <ExpertHeroStats stats={stats} />
          </div>

          {showTrustedBy ? (
            <div className="mt-14 border-t border-cream/30 pt-8 md:mt-16">
              <ProfileEditHit
                field="profileLayout.trustedByLabel"
                label="Trusted by label"
                ringOffset="ring-offset-charcoal"
              >
                <p className="text-[0.7rem] font-medium tracking-[0.16em] text-cream/70 uppercase">
                  {trustedByLabel}
                </p>
              </ProfileEditHit>
              <ul className="mt-5 flex flex-wrap items-center justify-between gap-x-6 gap-y-5 md:gap-x-8">
                {logoBrands.map((brand) => (
                  <li key={brand.name} className="flex h-6 items-center md:h-7">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={brand.logo}
                      alt={brand.name}
                      className="h-5 w-auto object-contain brightness-0 invert md:h-6"
                    />
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}
