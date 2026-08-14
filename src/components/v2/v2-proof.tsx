import Image from "next/image";
import Link from "next/link";
import { Handshake } from "@phosphor-icons/react/ssr";

import { V2BriefForm, V2ShortlistHint } from "@/components/v2/v2-brief-form";
import { ArrowRightIcon, V2ViewMoreLink } from "@/components/v2/v2-icons";
import type { CaseStudyCard } from "@/lib/case-studies";
import type { HomePageSections } from "@/lib/cms";
import { cn } from "@/lib/utils";

function CaseStudyBlock({
  study,
  fallback,
}: {
  study: CaseStudyCard | undefined;
  fallback: HomePageSections["keyStudy"];
}) {
  const quote = study?.quote?.text?.trim() || fallback.summary;
  const name = study?.quote?.name?.trim() || "";
  const role = study?.quote?.role?.trim() || "";
  const photo = study?.quote?.image || study?.coverImage || "";
  const logo = study?.logo || "";
  const pillar =
    study?.pillars?.[0] ||
    study?.pillar ||
    fallback.meta.find((item) => item.label.toLowerCase() === "pillar")?.value ||
    "";
  const metrics =
    study?.results && study.results.length > 0
      ? study.results.slice(0, 3).map((result) => ({
          value: result.value,
          label: result.caption || result.label || "",
        }))
      : fallback.metrics.slice(0, 3).map((metric) => ({
          value: metric.value,
          label: metric.label,
        }));
  const href = fallback.ctaHref || (study ? `/case-studies/${study.slug}` : "/case-studies");
  const cta = fallback.ctaLabel || "Read the case study";

  return (
    <article className="flex min-h-[620px] w-full flex-col overflow-hidden rounded-[20px] bg-[var(--v2-timberline)] lg:flex-row">
      <div className="relative h-[320px] w-full shrink-0 overflow-hidden bg-[var(--v2-surface)] lg:h-auto lg:w-[534px]">
        {photo ? (
          <Image
            src={photo}
            alt={name || study?.client || "Case study"}
            fill
            sizes="(min-width: 1024px) 534px, 100vw"
            className="object-cover object-top grayscale"
          />
        ) : null}
        <div
          aria-hidden
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to top, rgba(14,26,20,0.88) 0%, rgba(14,26,20,0.15) 46%, transparent 72%)",
          }}
        />
        {(name || role) ? (
          <div className="absolute bottom-8 left-8">
            {name ? (
              <p className="text-[16px] leading-6 font-medium text-[var(--v2-snow)]">
                {name}
              </p>
            ) : null}
            {role ? (
              <p className="text-[15px] leading-[22px] text-[var(--v2-on-dark-muted)]">
                {role}
              </p>
            ) : null}
          </div>
        ) : null}
      </div>

      <div className="flex flex-1 flex-col justify-between p-8 md:p-14">
        <div className="flex flex-col gap-9">
          <div className="flex items-center justify-between gap-4">
            {logo ? (
              <Image
                src={logo}
                alt={study?.client || ""}
                width={148}
                height={26}
                className="max-w-[148px] object-contain brightness-0 invert"
                style={{ width: "auto", height: 26 }}
              />
            ) : (
              <p className="v2-display text-[24px] text-[var(--v2-snow)]">
                {study?.client || "Case study"}
              </p>
            )}
            {pillar ? (
              <span className="inline-flex items-center gap-2 rounded-full bg-[var(--v2-surface)] px-3.5 py-1.5">
                <Handshake
                  weight="fill"
                  className="size-3.5 text-[var(--v2-ember)]"
                  aria-hidden
                />
                <span className="text-[12px] leading-4 font-medium tracking-[0.06em] text-[var(--v2-on-dark)] uppercase">
                  {pillar}
                </span>
              </span>
            ) : null}
          </div>
          <div className="h-px bg-[var(--v2-rule-dark)]" />
          <p className="v2-display text-[32px] leading-10 tracking-[-0.01em] text-[var(--v2-snow)]">
            {quote.startsWith("“") || quote.startsWith('"') ? quote : `“${quote}”`}
          </p>
        </div>

        <div className="mt-10 flex flex-col gap-9">
          <div className="h-px bg-[var(--v2-rule-dark)]" />
          {metrics.length > 0 ? (
            <div className="grid grid-cols-1 gap-7 sm:grid-cols-3">
              {metrics.map((metric, index) => (
                <div key={`${metric.value}-${index}`}>
                  <p
                    className={cn(
                      "v2-display text-[44px] leading-[48px] tracking-[-0.03em]",
                      index === 1
                        ? "text-[var(--v2-ember)]"
                        : "text-[var(--v2-snow)]",
                    )}
                  >
                    {metric.value}
                  </p>
                  <p className="mt-2.5 text-[14px] leading-[21px] text-[var(--v2-on-dark-muted)]">
                    {metric.label}
                  </p>
                </div>
              ))}
            </div>
          ) : null}
          <div className="flex flex-col gap-4 border-t border-[var(--v2-rule-dark)] pt-8 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-[15px] leading-[22px] text-[var(--v2-on-dark-muted)]">
              Full breakdown: brief, creator, and results.
            </p>
            {fallback.showCta !== false ? (
              <Link
                href={href}
                className="group inline-flex shrink-0 items-center gap-3.5 text-[16px] leading-5 font-medium text-[var(--v2-snow)]"
              >
                {cta}
                <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-[var(--v2-ember)]">
                  <span
                    aria-hidden
                    className="relative inline-flex size-[17px] overflow-hidden"
                  >
                    <ArrowRightIcon className="size-[17px] transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-[120%]" />
                    <ArrowRightIcon className="absolute inset-0 size-[17px] -translate-x-[120%] transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-0" />
                  </span>
                </span>
              </Link>
            ) : null}
          </div>
        </div>
      </div>
    </article>
  );
}

export function V2Proof({
  keyStudy,
  featured,
  brandBrief,
  creatorCta,
}: {
  keyStudy: HomePageSections["keyStudy"];
  featured: CaseStudyCard | undefined;
  brandBrief: HomePageSections["brandBrief"];
  creatorCta: HomePageSections["creatorCta"];
}) {
  return (
    <section
      className="pt-28 pb-[60px]"
      style={{
        backgroundImage:
          "linear-gradient(180deg, #F4E2D7 0%, #F8EDE6 22%, #FFFFFF 44%)",
      }}
    >
      <div className="v2-container flex flex-col gap-8">
      <div className="flex items-end justify-between gap-6 pb-6">
        <h2 className="v2-display text-[clamp(2.2rem,4vw,3.5rem)] leading-[1.07] text-[var(--v2-timberline)]">
          Proof, not promises
        </h2>
        <V2ViewMoreLink href="/case-studies" className="pb-1.5">
          All case studies
        </V2ViewMoreLink>
      </div>

      <div>
        <CaseStudyBlock study={featured} fallback={keyStudy} />
      </div>

      <div
        id="brief"
        className="flex scroll-mt-28 flex-col gap-12 rounded-[20px] bg-[var(--v2-evergreen-deep)] p-8 md:p-14"
      >
        <div className="flex flex-col gap-14 lg:flex-row lg:items-stretch">
          <div className="flex flex-1 flex-col justify-between gap-12">
            <div className="flex flex-col gap-7">
              <p className="text-[13px] leading-4 font-medium tracking-[0.08em] text-[var(--v2-on-dark-muted)] uppercase">
                {brandBrief.eyebrow}
              </p>
              <h2 className="v2-display text-[clamp(2rem,4vw,3.5rem)] leading-[1.07] text-[var(--v2-snow)]">
                {brandBrief.headline}{" "}
                <span className="text-[#E4EBE7]">{brandBrief.headlineEmphasis}</span>
              </h2>
              <p className="text-[17px] leading-7 text-[var(--v2-on-dark)]">
                {brandBrief.subhead}
              </p>
            </div>
            {brandBrief.quote.trim() ? (
              <figure className="flex flex-col gap-5 rounded-[16px] bg-[#2A4A3A] p-6">
                <blockquote className="text-[16px] leading-[27px] text-[#E4EBE7]">
                  “{brandBrief.quote}”
                </blockquote>
                <figcaption className="flex items-center justify-between gap-3">
                  <div className="flex min-w-0 items-center gap-3">
                    {brandBrief.quotePhoto.trim() ? (
                      <div className="relative size-[38px] shrink-0 overflow-hidden rounded-full">
                        <Image
                          src={brandBrief.quotePhoto}
                          alt=""
                          fill
                          sizes="38px"
                          className="object-cover object-top"
                        />
                      </div>
                    ) : null}
                    <div className="min-w-0">
                      <p className="truncate text-[14px] leading-5 font-semibold text-[var(--v2-snow)]">
                        {brandBrief.quoteName}
                      </p>
                      <p className="truncate text-[13px] leading-[18px] text-[var(--v2-on-dark-muted)]">
                        {brandBrief.quoteRole}
                      </p>
                    </div>
                  </div>
                  {brandBrief.quoteLogo.trim() ? (
                    <Image
                      src={brandBrief.quoteLogo}
                      alt={brandBrief.quoteLogoName}
                      width={74}
                      height={20}
                      className="max-w-[74px] object-contain"
                      style={{ width: "auto", height: 20 }}
                    />
                  ) : null}
                </figcaption>
              </figure>
            ) : null}
          </div>

          <div className="flex w-full shrink-0 flex-col gap-4 rounded-[16px] bg-[var(--v2-snow)] p-7 lg:w-[568px]">
            <div className="flex items-center justify-between gap-3">
              <p className="v2-display text-[24px] leading-[30px] tracking-[-0.01em] text-[var(--v2-timberline)]">
                {brandBrief.formTitle}
              </p>
              <V2ShortlistHint />
            </div>
            <V2BriefForm footnote={brandBrief.formFootnote} />
            {brandBrief.briefedByLogos.length > 0 ? (
              <div className="mt-1 flex items-center justify-between gap-4 rounded-[12px] bg-[var(--v2-timberline)] px-4 py-3">
                <p className="shrink-0 text-[10px] leading-3 font-semibold tracking-[0.08em] text-[var(--v2-on-dark-muted)] uppercase">
                  {brandBrief.briefedByLabel}
                </p>
                <div className="flex min-w-0 flex-wrap items-center justify-end gap-3.5">
                  {brandBrief.briefedByLogos.slice(0, 4).map((logo) => (
                    <Image
                      key={logo.name}
                      src={logo.src}
                      alt={logo.name}
                      width={70}
                      height={16}
                      className="max-w-[77px] object-contain"
                      style={{ width: "auto", height: 16 }}
                    />
                  ))}
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-11 rounded-[20px] bg-[var(--v2-ember)] p-8 md:p-14">
        <div className="flex flex-col gap-10 lg:flex-row lg:items-start lg:justify-between lg:gap-16">
          <div className="flex max-w-[640px] flex-col gap-7">
            <p className="text-[13px] leading-4 font-medium tracking-[0.08em] text-[var(--v2-on-ember-muted)] uppercase">
              {creatorCta.eyebrow}
            </p>
            <h2 className="v2-display text-[clamp(2rem,4vw,3.5rem)] leading-[1.07] text-[var(--v2-snow)]">
              {creatorCta.headline}
            </h2>
            <p className="text-[17px] leading-7 text-[var(--v2-on-ember)]">
              {creatorCta.subhead}
            </p>
          </div>
          <div className="flex w-full max-w-[400px] shrink-0 flex-col gap-3 lg:pt-11">
            {creatorCta.primaryCtaLabel.trim() ? (
              <Link
                href={creatorCta.primaryCtaHref}
                className="inline-flex items-center justify-center gap-2.5 rounded-full bg-[var(--v2-snow)] py-[19px] text-[16px] leading-5 font-medium text-[var(--v2-ember)] transition-transform active:scale-[0.98]"
              >
                {creatorCta.primaryCtaLabel}
                <ArrowRightIcon className="size-[17px]" />
              </Link>
            ) : null}
            {creatorCta.secondaryCtaLabel.trim() ? (
              <Link
                href={creatorCta.secondaryCtaHref}
                className="inline-flex items-center justify-center rounded-full border border-[#E0A98C] py-[19px] text-[16px] leading-5 font-medium text-[var(--v2-snow)]"
              >
                {creatorCta.secondaryCtaLabel}
              </Link>
            ) : null}
            {creatorCta.stat2.trim() ? (
              <p className="pt-1.5 text-center text-[13px] leading-4 text-[var(--v2-on-ember-muted)]">
                {creatorCta.stat2}
              </p>
            ) : null}
          </div>
        </div>
        <div className="grid gap-8 md:grid-cols-3">
          <div className="flex flex-col gap-2.5">
            <p className="v2-display text-[20px] leading-[26px] text-[var(--v2-snow)]">
              You keep the voice
            </p>
            <p className="text-[15px] leading-6 text-[var(--v2-on-ember)]">
              No scripts, no approvals queue. We never post as you or dilute what
              your audience follows you for.
            </p>
          </div>
          <div className="flex flex-col gap-2.5">
            <p className="v2-display text-[20px] leading-[26px] text-[var(--v2-snow)]">
              We handle the commercials
            </p>
            <p className="text-[15px] leading-6 text-[var(--v2-on-ember)]">
              Inbound triage, rate card, negotiation, contracts and chasing
              invoices. You stop being your own agent.
            </p>
          </div>
          <div className="flex flex-col gap-2.5">
            <p className="v2-display text-[20px] leading-[26px] text-[var(--v2-snow)]">
              Briefs worth taking
            </p>
            <p className="text-[15px] leading-6 text-[var(--v2-on-ember)]">
              We turn down more than we bring you. Every brief that lands has
              budget, a real timeline and a fit.
            </p>
          </div>
        </div>
      </div>
      </div>
    </section>
  );
}
