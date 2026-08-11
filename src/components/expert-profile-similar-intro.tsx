"use client";

import { ProfileEditHit } from "@/components/use-profile-edit-hit";
import { useSiteChrome } from "@/components/site-chrome-context";
import { ViewMoreLink } from "@/components/view-more-link";

export function ExpertProfileSimilarIntro() {
  const { chrome } = useSiteChrome();
  const copy = chrome.profileCta;

  return (
    <ProfileEditHit field="profileCta.similar" label="similar creators strip" block>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <h2 className="font-display text-[1.75rem] leading-[1.08] tracking-tight text-charcoal md:text-[2rem]">
          {copy.similarHeadline}
        </h2>
        <ViewMoreLink href={copy.similarLinkHref}>{copy.similarLinkLabel}</ViewMoreLink>
      </div>
    </ProfileEditHit>
  );
}
