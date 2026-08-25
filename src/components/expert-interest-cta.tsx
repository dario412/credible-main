"use client";

import Link from "next/link";
import { ArrowRight } from "@phosphor-icons/react";

import { FadeUp } from "@/components/fade-up";
import { ProfileEditHit } from "@/components/use-profile-edit-hit";
import { useSiteChrome } from "@/components/site-chrome-context";
import { applyProfileRailTemplate } from "@/lib/site-chrome";
import { firstName } from "@/lib/expert-profiles";

export function ExpertInterestCta({
  name,
  slug,
}: {
  name: string;
  slug: string;
}) {
  const { chrome } = useSiteChrome();
  const copy = chrome.profileCta;
  const first = firstName(name);
  const vars = { first, name, slug };
  const headline = applyProfileRailTemplate(copy.headline, vars);
  const description = applyProfileRailTemplate(copy.description, vars);
  const primaryHref = applyProfileRailTemplate(copy.primaryCtaHref, vars);

  return (
    <div className="relative">
      <FadeUp duration={1200} y={22} threshold={0.3}>
        <ProfileEditHit
          field="profileCta.headline"
          label="footer CTA headline"
          block
          ringOffset="ring-offset-charcoal"
        >
          <h2 className="mx-auto max-w-[14ch] font-display text-[2rem] leading-[1.05] tracking-tight text-cream sm:text-[2.4rem] md:text-[2.75rem]">
            {headline}
          </h2>
        </ProfileEditHit>
      </FadeUp>

      {description.trim() ? (
        <FadeUp delay={160} duration={1200} y={22} threshold={0.3}>
          <ProfileEditHit
            field="profileCta.description"
            label="footer CTA description"
            block
            ringOffset="ring-offset-charcoal"
          >
            <p className="mx-auto mt-5 max-w-lg text-[1rem] leading-relaxed text-cream/70 md:mt-6">
              {description}
            </p>
          </ProfileEditHit>
        </FadeUp>
      ) : null}

      <FadeUp delay={320} duration={1200} y={22} threshold={0.3}>
        <div className="mt-9 flex w-full flex-col gap-3 sm:mx-auto sm:max-w-md sm:flex-row sm:justify-center">
          {copy.primaryCtaLabel.trim() ? (
            <ProfileEditHit
              field="profileCta.primaryCta"
              label="footer primary button"
              block
              className="w-full sm:flex-1"
              ringOffset="ring-offset-charcoal"
            >
              <Link
                href={primaryHref}
                className="group flex w-full items-center justify-center gap-2 rounded-sm bg-cream px-6 py-3.5 text-[0.9375rem] font-medium text-charcoal transition-colors hover:bg-cream-dark"
              >
                {copy.primaryCtaLabel}
                <ArrowRight
                  weight="bold"
                  className="size-3.5 transition-transform duration-300 group-hover:translate-x-0.5"
                  aria-hidden
                />
              </Link>
            </ProfileEditHit>
          ) : null}
          {copy.secondaryCtaLabel.trim() ? (
            <ProfileEditHit
              field="profileCta.secondaryCta"
              label="footer secondary button"
              block
              className="w-full sm:flex-1"
              ringOffset="ring-offset-charcoal"
            >
              <Link
                href={copy.secondaryCtaHref}
                className="flex w-full items-center justify-center gap-2 rounded-sm border border-cream/25 bg-charcoal/20 px-6 py-3.5 text-[0.9375rem] font-medium text-cream backdrop-blur-sm transition-colors hover:border-cream/50 hover:bg-cream/10"
              >
                {copy.secondaryCtaLabel}
              </Link>
            </ProfileEditHit>
          ) : null}
        </div>
      </FadeUp>
    </div>
  );
}
