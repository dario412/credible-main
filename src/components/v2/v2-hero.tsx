import Image from "next/image";
import Link from "next/link";
import { Handshake } from "@phosphor-icons/react/ssr";

import { ArrowRightIcon } from "@/components/v2/v2-icons";
import type { HomePageSections } from "@/lib/cms";
import { visiblePortrait } from "@/lib/trusted-by";
import { cn } from "@/lib/utils";

export type V2CastMember = {
  id: string;
  slug: string;
  name: string;
  image: string | null;
  role: string | null;
  combinedReach: string | null;
};

export type V2ProofStory = {
  quote: string;
  name: string;
  title: string;
  imageSrc: string;
  metric?: { value: string; label: string };
};

export function TwoToneDisplay({
  text,
  as: Tag = "h1",
  className,
}: {
  text: string;
  as?: "h1" | "h2";
  className?: string;
}) {
  const lines = text
    .split(/\n/)
    .map((line) => line.trim())
    .filter(Boolean);

  if (lines.length >= 2) {
    return (
      <Tag className={cn("v2-display", className)}>
        <span className="block text-[var(--v2-timberline)]">{lines[0]}</span>
        <span className="block text-[var(--v2-evergreen)]">
          {lines.slice(1).join(" ")}
        </span>
      </Tag>
    );
  }

  const words = text.trim().split(/\s+/);
  if (words.length > 3) {
    const line1 = words.slice(0, -3).join(" ");
    const lead = words[words.length - 3];
    const tail = words.slice(-2).join(" ");
    return (
      <Tag className={cn("v2-display", className)}>
        <span className="block text-[var(--v2-timberline)]">{line1}</span>
        <span className="block">
          <span className="text-[var(--v2-timberline)]">{lead} </span>
          <span className="text-[var(--v2-evergreen)]">{tail}</span>
        </span>
      </Tag>
    );
  }

  return <Tag className={cn("v2-display text-[var(--v2-timberline)]", className)}>{text}</Tag>;
}

const CAST_WIDTHS = [300, 420, 280, 300, 440, 300];

export function V2Hero({
  hero,
  cast,
  bookerImage,
  proof,
  creatorCount,
}: {
  hero: HomePageSections["hero"];
  cast: V2CastMember[];
  bookerImage: string | null;
  proof: V2ProofStory | null;
  creatorCount: number;
}) {
  const ctaImage = visiblePortrait(proof?.imageSrc, visiblePortrait(bookerImage));
  const storyImage = visiblePortrait(
    bookerImage,
    visiblePortrait(proof?.imageSrc),
  );

  return (
    <>
      <section className="bg-[var(--v2-snow)] pt-16 md:pt-[72px]">
        <div className="v2-container flex flex-col gap-6">
        <TwoToneDisplay
          text={hero.headline}
          className="text-[clamp(2.6rem,7vw,5rem)] leading-[1.1]"
        />

        <div className="flex w-full flex-col gap-10 pb-16 lg:flex-row lg:items-stretch lg:justify-between lg:gap-[108px]">
          <div className="flex max-w-[620px] flex-1 flex-col justify-between gap-8">
            {hero.subhead.trim() ? (
              <p className="text-[20px] leading-8 text-[var(--v2-timberline)]">
                {hero.subhead}
              </p>
            ) : null}

            <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-3">
              {hero.primaryCta.trim() ? (
                <Link
                  href={hero.primaryHref || "#brief"}
                  className="inline-flex items-center justify-center rounded-full bg-[var(--v2-evergreen)] px-[34px] py-[19px] text-[16px] leading-5 font-medium whitespace-nowrap text-[var(--v2-snow)] transition-transform active:scale-[0.98]"
                >
                  {hero.primaryCta}
                </Link>
              ) : null}
              {hero.secondaryCta.trim() ? (
                <Link
                  href={hero.secondaryHref || "/contact"}
                  className="inline-flex items-center gap-3 rounded-full border border-[var(--v2-border)] bg-[var(--v2-snow)] py-[7px] pr-6 pl-[7px] text-[16px] leading-5 font-medium whitespace-nowrap text-[var(--v2-timberline)] transition-transform active:scale-[0.98]"
                >
                  <span className="relative size-[38px] shrink-0">
                    <span className="relative block size-[38px] overflow-hidden rounded-full bg-[var(--v2-glacier)]">
                      {ctaImage ? (
                        <Image
                          src={ctaImage}
                          alt=""
                          fill
                          sizes="38px"
                          className="object-cover object-top"
                        />
                      ) : null}
                    </span>
                    <span className="absolute right-0 bottom-0 size-[11px] rounded-full border-2 border-[var(--v2-snow)] bg-[var(--v2-live)]" />
                  </span>
                  {hero.secondaryCta}
                </Link>
              ) : null}
            </div>

            <p className="text-[14px] leading-[22px] text-[var(--v2-lichen)]">
              Campaign by campaign. No retainer, no lock-in. Most briefs are matched within 48 hours.
            </p>
            </div>
          </div>

          {proof ? (
            <aside className="flex w-full max-w-[520px] flex-col justify-between gap-7 self-stretch rounded-[16px] bg-[var(--v2-glacier)] p-9">
              <div className="flex items-center gap-2">
                <Handshake
                  weight="fill"
                  className="size-3.5 text-[var(--v2-ember)]"
                  aria-hidden
                />
                <p className="text-[12px] leading-4 font-medium tracking-[0.08em] text-[var(--v2-evergreen)] uppercase">
                  Client story
                </p>
              </div>
              <p className="v2-display text-[24px] leading-[30px] tracking-[-0.01em] text-[var(--v2-timberline)]">
                “{proof.quote}”
              </p>
              <div className="flex items-center justify-between gap-4 border-t border-[var(--v2-rule-glacier)] pt-6">
                <div className="flex min-w-0 items-center gap-3.5">
                  <div className="relative size-11 shrink-0 overflow-hidden rounded-full bg-[var(--v2-snow)]">
                    {storyImage ? (
                      <Image
                        src={storyImage}
                        alt=""
                        fill
                        sizes="44px"
                        className="object-cover object-top"
                      />
                    ) : null}
                  </div>
                  <div className="min-w-0">
                    <p className="truncate text-[15px] leading-5 font-medium text-[var(--v2-timberline)]">
                      {proof.name}
                    </p>
                    <p className="truncate text-[14px] leading-5 text-[var(--v2-lichen)]">
                      {proof.title}
                    </p>
                  </div>
                </div>
                {proof.metric ? (
                  <div className="shrink-0 text-right">
                    <p className="v2-display text-[32px] leading-10 tracking-[-0.02em] text-[var(--v2-ember)]">
                      {proof.metric.value}
                    </p>
                    <p className="text-[13px] leading-[18px] text-[var(--v2-lichen)]">
                      {proof.metric.label}
                    </p>
                  </div>
                ) : null}
              </div>
            </aside>
          ) : null}
        </div>
        </div>
      </section>

      {cast.length > 0 ? <V2CastMarquee cast={cast} creatorCount={creatorCount} /> : null}
    </>
  );
}

function V2CastMarquee({
  cast,
  creatorCount,
}: {
  cast: V2CastMember[];
  creatorCount: number;
}) {
  const cards = (
    <>
      {cast.map((member, index) => {
        const width = CAST_WIDTHS[index % CAST_WIDTHS.length] ?? 300;
        return (
          <Link
            key={`${member.id}-${index}`}
            href={`/roster/${member.slug}`}
            className="relative h-[400px] shrink-0 overflow-hidden rounded-[16px] bg-[#D6DED8]"
            style={{ width }}
          >
            {member.image ? (
              <Image
                src={member.image}
                alt={member.name}
                fill
                sizes={`${width}px`}
                className="object-cover object-top"
              />
            ) : null}
            <span
              aria-hidden
              className="absolute inset-x-0 bottom-0 h-[148px]"
              style={{
                background:
                  "linear-gradient(to top, rgba(14,26,20,0.94) 0%, rgba(14,26,20,0.52) 34%, transparent 100%)",
              }}
            />
            {index === 1 ? (
              <span className="absolute top-[18px] left-[18px] inline-flex items-center gap-2 rounded-full bg-[#FFFFFFE6] px-[13px] py-[7px]">
                <span className="size-1.5 rounded-full bg-[var(--v2-live)]" />
                <span className="text-[11px] leading-[14px] font-semibold tracking-[0.06em] text-[var(--v2-evergreen)] uppercase">
                  Available this quarter
                </span>
              </span>
            ) : null}
            <span className="absolute bottom-[18px] left-[18px] flex flex-col gap-0.5">
              <span className="v2-display text-[20px] leading-[26px] text-[var(--v2-snow)]">
                {member.name}
              </span>
              <span className="text-[13px] leading-[19px] text-[var(--v2-on-dark)]">
                {[member.role, member.combinedReach].filter(Boolean).join(" · ")}
              </span>
            </span>
          </Link>
        );
      })}
      <Link
        href="/roster"
        className="flex h-[400px] w-[320px] shrink-0 flex-col justify-between rounded-[16px] bg-[var(--v2-timberline)] p-8"
      >
        <div className="flex flex-col gap-4">
          <p className="text-[11px] leading-[14px] font-semibold tracking-[0.08em] text-[var(--v2-on-dark-faint)] uppercase">
            Browse the roster
          </p>
          <p className="v2-display text-[28px] leading-9 text-[var(--v2-snow)]">
            Filter by audience, channel and category.
          </p>
        </div>
        <div className="flex flex-col gap-[22px]">
          <div>
            <p className="v2-display text-[44px] leading-[46px] text-[var(--v2-snow)]">
              {creatorCount}+
            </p>
            <p className="text-[14px] leading-[18px] text-[var(--v2-on-dark-muted)]">
              Creators, exclusively represented.
            </p>
          </div>
          <span className="inline-flex items-center gap-3 text-[15px] font-medium text-[var(--v2-snow)]">
            See all creators
            <span className="flex size-8 items-center justify-center rounded-full border border-[var(--v2-rule-dark)]">
              <ArrowRightIcon className="size-[15px]" />
            </span>
          </span>
        </div>
      </Link>
    </>
  );

  return (
    <section className="v2-marquee v2-bleed-start relative bg-[var(--v2-snow)] pb-20">
      <div className="v2-marquee-track">
        <div className="flex gap-4">{cards}</div>
        <div className="flex gap-4" aria-hidden>
          {cards}
        </div>
      </div>
      <div
        aria-hidden
        className="pointer-events-none absolute inset-y-0 left-0 w-[110px] bg-linear-to-r from-[var(--v2-snow)] to-transparent"
      />
    </section>
  );
}
