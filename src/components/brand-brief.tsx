"use client";

import Image from "next/image";
import Link from "next/link";
import { useActionState, useId, type ReactNode } from "react";
import { ArrowRight, CaretDown } from "@phosphor-icons/react/ssr";

import { CreatorFacesMarquee } from "@/components/creator-faces-marquee";
import { Home2WaveField } from "@/components/home-2/home-2-wave-field";
import { PatternField } from "@/components/pattern-field";
import { inputClassName } from "@/components/ui";
import { submitBrief, type FormState } from "@/lib/actions/leads";
import { cn } from "@/lib/utils";

const initial: FormState = { ok: false, message: "" };
const CREAM_RGB = { r: 249, g: 243, b: 239 };

function SectionEyebrow({ children }: { children: ReactNode }) {
  return (
    <p className="text-[0.68rem] font-medium tracking-[0.16em] text-cream/60 uppercase">
      {children}
    </p>
  );
}

const BRIEF_LOGOS = [
  { name: "Stripe", src: "/brand/clients/stripe-wordmark-white.svg" },
  { name: "Figma", src: "/brand/clients/figma-wordmark-white.svg" },
  { name: "Notion", src: "/brand/clients/notion-wordmark-white.png" },
  { name: "Linear", src: "/brand/clients/linear-wordmark-white.svg" },
  { name: "Vercel", src: "/brand/clients/vercel-wordmark-white.svg" },
] as const;

const formats = [
  "Brand partnership",
  "Ambassador program",
  "Speaking engagement",
  "Live event",
  "Not sure yet",
] as const;

function ArrowIcon({ className }: { className?: string }) {
  return <ArrowRight weight="bold" aria-hidden className={className} />;
}

function CreatorCta({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-sm bg-rust",
        className,
      )}
    >
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <PatternField
          color={CREAM_RGB}
          className="opacity-[0.13]"
          mask="linear-gradient(to left, black 0%, rgba(0,0,0,0.4) 45%, transparent 88%)"
        />
      </div>

      <div className="relative z-2 p-7">
        <div className="grid gap-9 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)] lg:items-end lg:gap-16">
          <div>
            <SectionEyebrow>For creators</SectionEyebrow>

            <h2 className="mt-4 max-w-xl font-display text-[1.75rem] leading-[1.1] tracking-tight text-cream sm:text-[2.1rem] md:text-[2.4rem]">
              Your audience is already a business. Run it like one.
            </h2>

            <p className="mt-4 max-w-lg text-[0.95rem] leading-relaxed text-cream/75">
              We represent 24 founders, operators and investors. You keep the
              voice. We handle the inbound, the pricing and the delivery.
            </p>

            <div className="mt-7 flex flex-wrap items-center gap-x-5 gap-y-3">
              <CreatorFacesMarquee />
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
                <p className="text-[0.8125rem] text-cream/70">
                  24 creators represented
                </p>
                <span
                  aria-hidden
                  className="hidden h-3.5 w-px bg-cream/25 sm:block"
                />
                <p className="text-[0.8125rem] text-cream/70">
                  Applications reviewed fortnightly
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-3 sm:max-w-xs lg:ml-auto lg:w-full">
            <Link
              href="/contact?type=creator"
              className="group inline-flex w-full items-center justify-center gap-2 rounded-sm bg-cream px-6 py-3.5 text-[0.9rem] font-medium text-charcoal transition-colors hover:bg-cream-dark active:translate-y-px"
            >
              Apply for representation
              <ArrowIcon className="size-3.5 shrink-0 transition-transform duration-300 group-hover:translate-x-0.5" />
            </Link>
            <Link
              href="/what-we-do"
              className="inline-flex w-full items-center justify-center gap-2 rounded-sm border border-cream/35 px-6 py-3.5 text-[0.9rem] font-medium text-cream transition-colors hover:border-cream hover:bg-cream/10"
            >
              What we offer creators
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

function BriefForm({ surface = "dark" }: { surface?: "dark" | "light" }) {
  const [state, action, pending] = useActionState(submitBrief, initial);
  const light = surface === "light";
  const id = useId();

  const inputClass = light
    ? cn(inputClassName, "rounded-sm bg-[#FBF8F5]")
    : "w-full rounded-sm border border-cream/25 bg-cream/5 px-4 py-3 text-sm text-cream outline-none transition-colors placeholder:text-cream/35 focus:border-cream focus:outline focus:outline-2 focus:outline-offset-[-2px] focus:outline-cream";

  const labelClass = light
    ? "block text-[0.8125rem] font-medium text-charcoal"
    : "block text-[0.8125rem] font-medium text-cream/75";

  return (
    <form action={action} className="space-y-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <div className="space-y-1.5">
          <label htmlFor={`${id}-name`} className={labelClass}>
            Your name
          </label>
          <input
            id={`${id}-name`}
            name="name"
            required
            autoComplete="name"
            placeholder="First and last"
            className={inputClass}
          />
        </div>
        <div className="space-y-1.5">
          <label htmlFor={`${id}-email`} className={labelClass}>
            Work email
          </label>
          <input
            id={`${id}-email`}
            name="email"
            type="email"
            required
            autoComplete="email"
            placeholder="you@company.com"
            className={inputClass}
          />
        </div>
      </div>

      <div className="space-y-1.5">
        <label htmlFor={`${id}-company`} className={labelClass}>
          Company
        </label>
        <input
          id={`${id}-company`}
          name="company"
          autoComplete="organization"
          placeholder="Where you're briefing from"
          className={inputClass}
        />
      </div>

      <div className="space-y-1.5">
        <label htmlFor={`${id}-format`} className={labelClass}>
          What are you building?
        </label>
        <div className="relative">
          <select
            id={`${id}-format`}
            name="format"
            required
            defaultValue=""
            className={cn(
              inputClass,
              "appearance-none pr-10",
              light ? "invalid:text-charcoal/45" : "invalid:text-cream/35",
            )}
          >
            <option value="" disabled>
              Choose a format
            </option>
            {formats.map((format) => (
              <option key={format} value={format} className="text-charcoal">
                {format}
              </option>
            ))}
          </select>
          <CaretDown
            weight="bold"
            aria-hidden
            className={cn(
              "pointer-events-none absolute top-1/2 right-3.5 size-3.5 -translate-y-1/2",
              light ? "text-charcoal/45" : "text-cream/50",
            )}
          />
        </div>
      </div>

      <div className="space-y-1.5">
        <label htmlFor={`${id}-message`} className={labelClass}>
          The brief (short version)
        </label>
        <textarea
          id={`${id}-message`}
          name="brief"
          required
          rows={3}
          placeholder="Audience, ambition, deadline, budget shape."
          className={cn(inputClass, "min-h-22 resize-none")}
        />
      </div>

      <div className={cn(light && "pt-1")}>
        <button
          type="submit"
          disabled={pending}
          className={cn(
            "inline-flex w-full items-center justify-center gap-2 rounded-sm border px-7 py-3.5 text-[0.875rem] font-medium transition-colors disabled:opacity-60",
            light
              ? "border-forest bg-forest text-cream hover:border-forest-dark hover:bg-forest-dark"
              : "border-cream bg-cream text-charcoal hover:bg-cream-dark",
          )}
        >
          {pending ? "Sending…" : "Send brief"}
          <ArrowIcon className="size-3.5 shrink-0" />
        </button>
        {light ? (
          <p className="mt-3 text-center text-[0.72rem] leading-snug text-charcoal/45">
            Shortlist within 48 hours · no pitch deck required
          </p>
        ) : null}
      </div>

      {state.message ? (
        <p
          role="status"
          className={cn(
            "text-sm",
            state.ok
              ? light
                ? "text-forest"
                : "text-[#E4EBE6]"
              : "text-danger",
          )}
        >
          {state.message}
        </p>
      ) : null}
    </form>
  );
}

function BriefBody({
  formInCard = false,
}: {
  formInCard?: boolean;
}) {
  return (
    <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:items-center lg:gap-16 xl:gap-20">
      <div>
        <SectionEyebrow>For brands &amp; agencies</SectionEyebrow>

        <h2 className="mt-4 max-w-xl font-display text-[2.1rem] leading-[1.08] tracking-tight text-cream sm:text-[2.6rem] md:text-[3rem]">
          Reach B2B audiences through the people they{" "}
          <em className="font-display italic text-[#E4EBE6]">already trust.</em>
        </h2>

        <p className="mt-6 max-w-md text-[0.9rem] leading-relaxed text-cream/70 md:text-base">
          Whether you&apos;re an in-house team briefing direct, or an agency
          briefing us in on behalf of a client — send us the ambition and
          we&apos;ll come back with a shortlist within 48 hours.
        </p>

        <Link
          href="/what-we-do"
          className="mt-8 inline-flex items-center gap-2 rounded-sm border border-cream/30 px-5 py-2.5 text-[0.8125rem] font-medium text-cream transition-colors hover:border-cream hover:bg-cream hover:text-charcoal"
        >
          How we work with brands
          <ArrowIcon className="size-3 shrink-0" />
        </Link>
      </div>

      {formInCard ? (
        <div className="rounded-sm bg-cream px-5 py-6 sm:px-7 sm:py-8 md:px-8 md:py-9">
          <BriefForm surface="light" />
        </div>
      ) : (
        <BriefForm surface="dark" />
      )}
    </div>
  );
}

function BoxedBrief() {
  return (
    <section className="bg-cream-dark px-6 pb-8 pt-0 md:px-10 md:pb-10 lg:px-12">
      <div className="relative mx-auto max-w-352 overflow-hidden rounded-sm bg-forest-dark shadow-[0_24px_60px_rgba(28,26,23,0.18)]">
        <Home2WaveField
          color={CREAM_RGB}
          lineCount={64}
          baseWidth={2.1}
          className="opacity-[0.14]"
        />
        <div
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(42,73,57,0.5)_0%,transparent_70%)]"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute inset-0 bg-linear-to-b from-forest-dark/35 via-transparent to-forest-dark/50"
          aria-hidden
        />

        <div className="relative z-10 px-4 py-7 sm:px-5 md:px-6 lg:px-7">
          <div className="grid gap-8 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:items-stretch lg:gap-10 xl:gap-12">
            <div className="flex max-w-xl flex-col justify-between gap-10 lg:min-h-full lg:gap-0">
              <div>
                <SectionEyebrow>For brands &amp; agencies</SectionEyebrow>

                <h2 className="mt-4 font-display text-[2.15rem] leading-[1.06] tracking-tight text-cream sm:text-[2.65rem] md:text-[3.1rem]">
                  Reach buyers through the voices they{" "}
                  <em className="font-display italic text-[#E4EBE6]">
                    already trust.
                  </em>
                </h2>

                <p className="mt-6 max-w-lg text-[1.05rem] leading-relaxed text-cream/72 sm:text-[1.125rem] md:text-[1.2rem] md:leading-relaxed">
                  In-house or agency — send the ambition. We&apos;ll return a
                  shortlist within 48 hours.
                </p>
              </div>

              <figure className="rounded-sm bg-[#3E6D55] px-5 py-5 md:px-6 md:py-6">
                <blockquote>
                  <p className="text-[0.9rem] leading-relaxed text-cream/85 md:text-[0.95rem] md:leading-relaxed">
                    “Credible turned a single keynote into a year-long advisory
                    partnership — exactly the kind of credibility our buyers
                    trust.”
                  </p>
                </blockquote>
                <figcaption className="mt-4 flex items-center gap-3">
                  <div className="relative h-11 w-9 shrink-0 overflow-hidden rounded-sm bg-cream/15 md:h-12 md:w-10">
                    <Image
                      src="/images/experts/amara-chen.jpg"
                      alt=""
                      fill
                      sizes="40px"
                      className="object-cover object-top"
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[0.9rem] font-medium leading-tight text-cream">
                      Maya Chen
                    </p>
                    <p className="mt-0.5 truncate text-[0.75rem] leading-tight text-cream/60">
                      Head of Brand Partnerships, Stripe
                    </p>
                  </div>
                  <img
                    src="/brand/clients/stripe-wordmark-white.svg"
                    alt="Stripe"
                    className="h-4 w-auto shrink-0 object-contain md:h-[1.1rem]"
                  />
                </figcaption>
              </figure>
            </div>

            <div className="rounded-sm bg-cream px-5 py-6 shadow-[0_20px_50px_rgba(28,26,23,0.22)] sm:px-6 sm:py-7 md:px-7 md:py-8">
              <p className="mb-5 font-display text-[1.15rem] leading-tight tracking-tight text-charcoal md:text-[1.25rem]">
                Send a brief
              </p>
              <BriefForm surface="light" />

              <div className="mt-7 flex flex-wrap items-center gap-x-4 gap-y-2.5 border-t border-charcoal/10 pt-5">
                <p className="shrink-0 text-[0.68rem] font-medium tracking-[0.12em] text-charcoal/40 uppercase">
                  Briefed by teams at
                </p>
                <ul className="flex flex-wrap items-center gap-x-5 gap-y-3">
                  {BRIEF_LOGOS.map((brand) => (
                    <li key={brand.name} className="flex h-4 items-center">
                      <span className="sr-only">{brand.name}</span>
                      <img
                        src={brand.src}
                        alt=""
                        className="h-[0.95rem] w-auto object-contain brightness-0 opacity-55 md:h-[1.05rem]"
                      />
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto mt-4 max-w-352 md:mt-5">
        <CreatorCta />
      </div>
    </section>
  );
}

export function BrandBrief({
  variant = "full",
}: {
  variant?: "full" | "boxed";
}) {
  if (variant === "boxed") {
    return <BoxedBrief />;
  }

  return (
    <section className="bg-charcoal px-6 py-16 md:px-10 md:py-20 lg:px-12 lg:py-24">
      <div className="mx-auto max-w-352">
        <BriefBody />
        <CreatorCta className="mt-14 md:mt-16" />
      </div>
    </section>
  );
}
