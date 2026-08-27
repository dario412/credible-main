"use client";

import Image from "next/image";
import Link from "next/link";
import { Minus, Plus } from "@phosphor-icons/react";
import { type ReactNode } from "react";

import { StatCounter } from "@/components/stat-counter";
import { ProfileEditHit } from "@/components/use-profile-edit-hit";
import { useSiteChrome } from "@/components/site-chrome-context";
import {
  applyProfileRailTemplate,
  buildProfileNav,
  type NavLink,
} from "@/lib/site-chrome";
import {
  expertInitials,
  firstName,
  formatTopicLabel,
  type ExpertProfileStat,
} from "@/lib/expert-profiles";
import { toggleShortlist, useIsShortlisted } from "@/lib/shortlist";
import { cn } from "@/lib/utils";

export type ExpertProfileNavItem = NavLink;

export type ExpertProfileShellProps = {
  slug: string;
  name: string;
  title: string;
  image: string | null;
  archetype: string | null;
  topics: string[];
  based?: string;
  languages?: string[];
  representationStatus?: "SIGNED" | "AVAILABLE";
  stats: ExpertProfileStat[];
  nav?: ExpertProfileNavItem[];
  navSections?: {
    hasChannels: boolean;
    hasTopics: boolean;
    hasFormats: boolean;
    hasWork: boolean;
  };
  children: ReactNode;
};

export function ExpertProfileShell({
  slug,
  name,
  title,
  image,
  archetype,
  topics,
  based,
  representationStatus = "SIGNED",
  stats,
  nav = [],
  navSections,
  children,
}: ExpertProfileShellProps) {
  const { chrome } = useSiteChrome();
  const rail = chrome.profileRail;
  const shortlisted = useIsShortlisted(slug);
  const initials = expertInitials(name);
  const first = firstName(name);
  const topicLine = topics.slice(0, 3).map(formatTopicLabel);
  const statsGridClass =
    stats.length === 1
      ? "grid-cols-1"
      : stats.length === 2
        ? "grid-cols-2"
        : stats.length === 3
          ? "grid-cols-3"
          : stats.length === 4
            ? "grid-cols-2"
            : "grid-cols-2";
  const templateVars = { first, name };
  const workWithTitle = applyProfileRailTemplate(
    rail.workWithTitle,
    templateVars,
  );
  const workWithDescription = applyProfileRailTemplate(
    rail.workWithDescription,
    templateVars,
  );
  const builtNav = navSections
    ? buildProfileNav(rail.nav, navSections, chrome.profileLayout.sectionOrder)
    : nav;

  return (
    <div className="bg-cream px-6 pt-8 pb-16 md:px-10 md:pt-12 md:pb-20 lg:px-12 lg:pt-14 lg:pb-24">
      <div className="mx-auto grid max-w-352 items-start gap-10 md:gap-12 lg:grid-cols-[minmax(0,18.5rem)_minmax(0,1fr)] lg:gap-12 xl:grid-cols-[minmax(0,19.5rem)_minmax(0,1fr)] xl:gap-14">
        {/* Premium agency talent card — sticky CRO rail */}
        <aside className="order-1 self-start lg:sticky lg:top-32">
          <div className="overflow-hidden rounded-sm border border-charcoal/10 bg-[#FBF8F5] shadow-[0_18px_44px_rgba(28,26,23,0.07)] lg:max-h-[calc(100vh-9rem)]">
            {/* Identity */}
            <div className="border-b border-charcoal/8 px-4 py-3.5">
              <ProfileEditHit
                field="profileRail.availabilityLabel"
                label="availability label"
                block
              >
                <div className="mb-3 flex items-center gap-2">
                  <span className="relative flex size-2 shrink-0">
                    <span className="absolute inset-0 animate-ping rounded-full bg-forest/55" />
                    <span className="relative size-2 rounded-full bg-forest" />
                  </span>
                  <span className="text-[0.625rem] font-medium tracking-[0.14em] text-forest uppercase">
                    {rail.availabilityLabel}
                  </span>
                </div>
              </ProfileEditHit>

              <div className="flex items-center gap-3">
                <div className="relative size-12 shrink-0 overflow-hidden rounded-sm bg-[#C9C8C3]">
                  {image ? (
                    <Image
                      src={image}
                      alt={name}
                      fill
                      priority
                      sizes="48px"
                      className="object-cover object-top"
                    />
                  ) : (
                    <div className="flex size-full items-center justify-center">
                      <span className="font-display text-base text-charcoal/30">
                        {initials}
                      </span>
                    </div>
                  )}
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <p className="truncate font-display text-[1.25rem] leading-none tracking-tight text-charcoal">
                      {name}
                    </p>
                    <ProfileEditHit
                      field="profileRail.badges"
                      label="signed and open badges"
                    >
                      <span
                        className={cn(
                          "shrink-0 rounded-sm px-1.5 py-0.5 text-[0.5rem] font-medium tracking-[0.1em] uppercase",
                          representationStatus === "SIGNED"
                            ? "bg-charcoal text-cream"
                            : "bg-forest/10 text-forest",
                        )}
                      >
                        {representationStatus === "SIGNED"
                          ? rail.signedBadgeLabel
                          : rail.openBadgeLabel}
                      </span>
                    </ProfileEditHit>
                  </div>
                  <p className="mt-1.5 truncate text-[0.75rem] leading-none text-charcoal/70">
                    {[archetype ?? title, based].filter(Boolean).join(" · ")}
                  </p>
                </div>
              </div>
            </div>

            {/* Proof */}
            {stats.length > 0 ? (
              <dl
                className={cn(
                  "grid gap-px border-b border-charcoal/8 bg-charcoal/8",
                  statsGridClass,
                )}
              >
                {stats.map((stat, index) => (
                  <div
                    key={`${stat.label}-${index}`}
                    className="bg-[#FBF8F5] px-4 py-3"
                  >
                    <dd
                      className={cn(
                        "text-[1.125rem] font-medium leading-none tracking-tight tabular-nums",
                        stat.accent === "forest"
                          ? "text-forest"
                          : "text-charcoal",
                      )}
                    >
                      <StatCounter value={stat.value} />
                    </dd>
                    {stat.label ? (
                      <dt className="mt-1 text-[0.5625rem] tracking-[0.1em] text-charcoal/55 uppercase">
                        {stat.label}
                      </dt>
                    ) : null}
                  </div>
                ))}
              </dl>
            ) : null}

            {/* Dossier nav */}
            {builtNav.length > 0 ? (
              <nav
                aria-label="On this profile"
                className="border-b border-charcoal/8 px-2 py-1.5"
              >
                <ul>
                  {builtNav.map((item) => {
                    const navKey = item.href.replace("#", "") as
                      | "overview"
                      | "channels"
                      | "topics"
                      | "formats"
                      | "work";
                    return (
                      <li key={item.href}>
                        <ProfileEditHit
                          field={`profileRail.nav.${navKey}`}
                          label={`nav ${item.label}`}
                          block
                        >
                          <a
                            href={item.href}
                            className="flex items-center justify-between gap-3 rounded-sm px-2.5 py-2.5 text-[0.8125rem] text-charcoal/80 transition-colors hover:bg-cream hover:text-charcoal"
                          >
                            <span>{item.label}</span>
                            <span
                              aria-hidden
                              className="text-[0.65rem] text-charcoal/40"
                            >
                              →
                            </span>
                          </a>
                        </ProfileEditHit>
                      </li>
                    );
                  })}
                </ul>
              </nav>
            ) : topicLine.length > 0 ? (
              <div className="border-b border-charcoal/8 px-4 py-3">
                <ProfileEditHit
                  field="profileRail.focusLabel"
                  label="focus label"
                  block
                >
                  <p className="text-[0.625rem] tracking-[0.14em] text-charcoal/55 uppercase">
                    {rail.focusLabel}
                  </p>
                </ProfileEditHit>
                <p className="mt-1.5 text-[0.8125rem] leading-snug text-charcoal/80">
                  {topicLine.join(" · ")}
                </p>
              </div>
            ) : null}

            {/* Conversion */}
            <div className="px-4 py-4">
              <ProfileEditHit
                field="profileRail.workWith"
                label="work-with block"
                block
              >
                <p className="text-[0.6875rem] font-medium tracking-[0.12em] text-charcoal/55 uppercase">
                  {workWithTitle}
                </p>
                <p className="mt-1.5 text-[0.75rem] leading-relaxed text-charcoal/70">
                  {workWithDescription}
                </p>
              </ProfileEditHit>

              <div className="mt-3.5 flex gap-2">
                <ProfileEditHit
                  field="profileRail.primaryCta"
                  label="get rates button"
                  block
                >
                  <Link
                    href={`/contact?expert=${encodeURIComponent(slug)}`}
                    className="inline-flex min-w-0 flex-[1.65] items-center justify-center rounded-sm border border-forest bg-forest px-3 py-2.5 text-[0.8125rem] font-medium text-cream transition-colors hover:border-forest-dark hover:bg-forest-dark"
                  >
                    {rail.primaryCtaLabel}
                  </Link>
                </ProfileEditHit>
                <ProfileEditHit
                  field="profileRail.shortlist"
                  label="shortlist buttons"
                >
                  <button
                    type="button"
                    onClick={() =>
                      toggleShortlist({ slug, name, image, role: archetype })
                    }
                    aria-pressed={shortlisted}
                    className={cn(
                      "group/shortlist inline-flex shrink-0 cursor-pointer items-center justify-center gap-1 rounded-sm border px-2.5 py-2.5 text-[0.75rem] font-medium transition-colors duration-300",
                      shortlisted
                        ? "border-charcoal bg-charcoal text-cream hover:border-charcoal/80 hover:bg-charcoal/85"
                        : "border-charcoal/25 bg-transparent text-charcoal hover:border-charcoal hover:bg-charcoal hover:text-cream",
                    )}
                  >
                    {shortlisted ? (
                      <>
                        <Minus weight="bold" className="size-3 shrink-0" aria-hidden />
                        {rail.shortlistedLabel}
                      </>
                    ) : (
                      <>
                        <Plus
                          weight="bold"
                          aria-hidden
                          className="size-3 shrink-0 transition-transform duration-700 ease-out group-hover/shortlist:rotate-180"
                        />
                        {rail.shortlistLabel}
                      </>
                    )}
                  </button>
                </ProfileEditHit>
              </div>

              {rail.footnote.trim() ? (
                <ProfileEditHit
                  field="profileRail.footnote"
                  label="rail footnote"
                  block
                >
                  <p className="mt-3 text-center text-[0.6875rem] leading-snug text-charcoal/60">
                    {rail.footnote}
                  </p>
                </ProfileEditHit>
              ) : null}
            </div>
          </div>
        </aside>

        <div className="order-2 min-w-0">{children}</div>
      </div>
    </div>
  );
}

/** @deprecated Use ExpertProfileShell */
export const ExpertProfileHero = ExpertProfileShell;
