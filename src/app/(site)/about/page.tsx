import Link from "next/link";
import { ArrowRight } from "@phosphor-icons/react/ssr";

import { AboutRosterRail } from "@/components/about-roster-rail";
import { FadeUp } from "@/components/fade-up";
import {
  EYEBROW,
  EYEBROW_MUTED,
  EYEBROW_ON_DARK,
  PAGE_SHELL,
  PageGhostLink,
  PagePrimaryLink,
} from "@/components/inner-page";
import { PatternField } from "@/components/pattern-field";
import { SiteImage } from "@/components/site-image";
import { createMetadata } from "@/lib/seo";

export const metadata = createMetadata({
  title: "About",
  description:
    "Credible Creators is a management agency for founders, operators and trusted voices in the expert economy.",
  path: "/about",
});

const MODEL = [
  {
    n: "01",
    title: "Talent management",
    body: "Named managers protect positioning, bandwidth, and deal quality.",
  },
  {
    n: "02",
    title: "Brand strategy",
    body: "Briefs are shaped around audience trust, not forced into generic creator formats.",
  },
  {
    n: "03",
    title: "Commercial operations",
    body: "Scope, pricing, contracts, timelines, and delivery stay managed end to end.",
  },
  {
    n: "04",
    title: "PepTalk infrastructure",
    body: "Backed by the same team placing expert voices into high-stakes brand and event moments.",
  },
] as const;

const LEDGER = [
  {
    value: "24",
    label: "represented expert voices",
    note: "Founders, operators, investors, and category specialists.",
  },
  {
    value: "4",
    label: "formats managed end to end",
    note: "The work is packaged around trust, not inventory.",
  },
  {
    value: "B2B",
    label: "audiences and buyer contexts",
    note: "Built for professional decisions, not passive reach.",
  },
  {
    value: "1:1",
    label: "manager attention",
    note: "No self-serve listings, no marketplace inbox.",
  },
] as const;

const JUMP = [
  { href: "#why", label: "Why we exist" },
  { href: "#ledger", label: "Operating model" },
  { href: "#model", label: "How we work" },
  { href: "#roster", label: "The roster" },
] as const;

const FACES = [
  "/images/experts/alex-lieberman.png",
  "/images/experts/amara-chen.jpg",
  "/images/experts/daniel-park.jpg",
] as const;

export default function AboutPage() {
  return (
    <>
      <section
        className="relative isolate -mt-[7.25rem] min-h-[min(88vh,47.7rem)] overflow-hidden bg-charcoal text-cream md:-mt-[5.5rem]"
        data-site-hero-overlay
      >
        <SiteImage
          src="/images/experts/alex-lieberman-stage.png"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover object-[68%_18%]"
        />
        <div
          aria-hidden
          className="absolute inset-0 bg-linear-to-r from-charcoal via-charcoal/82 to-charcoal/20"
        />
        <div
          aria-hidden
          className="absolute inset-0 bg-linear-to-t from-charcoal/70 via-transparent to-charcoal/35"
        />

        <div
          className={`${PAGE_SHELL} relative z-10 flex min-h-[min(88vh,47.7rem)] flex-col justify-end px-6 pb-12 pt-32 md:px-10 md:pb-16 md:pt-36 lg:px-12 lg:pb-20`}
        >
          <FadeUp y={18} duration={1000} threshold={0.05} rootMargin="0px">
            <p className={EYEBROW_ON_DARK}>A PepTalk company</p>
            <h1 className="mt-4 max-w-[16ch] font-display text-[2.6rem] leading-[1.05] tracking-tight text-cream sm:text-[3.25rem] md:text-[4rem] lg:text-[4.4rem]">
              We represent the people buyers already trust.
            </h1>
            <p className="mt-5 max-w-[38rem] text-[1rem] leading-relaxed text-cream/72 md:text-[1.0625rem]">
              Credible Creators is a management agency for the expert economy:
              founders, operators, investors, and specialists whose voices shape
              how professional audiences think, buy, and build.
            </p>
          </FadeUp>

          <FadeUp delay={140} y={16} duration={1000} threshold={0.05} rootMargin="0px">
            <div className="mt-10 flex flex-col gap-6 border-t border-cream/15 pt-6 sm:flex-row sm:items-end sm:justify-between">
              <div className="flex gap-10">
                <div>
                  <p className="text-[0.68rem] font-medium tracking-[0.16em] text-cream/50 uppercase">
                    Roster
                  </p>
                  <p className="mt-1 font-display text-[1.35rem] leading-tight text-cream">
                    24 expert voices
                  </p>
                </div>
                <div>
                  <p className="text-[0.68rem] font-medium tracking-[0.16em] text-cream/50 uppercase">
                    Backed by
                  </p>
                  <p className="mt-1 font-display text-[1.35rem] leading-tight text-cream">
                    PepTalk
                  </p>
                </div>
              </div>
              <div className="flex flex-wrap gap-3">
                <PagePrimaryLink href="/roster" tone="cream">
                  Work with our roster
                </PagePrimaryLink>
                <PageGhostLink href="/apply-for-representation" onDark>
                  Apply for representation
                </PageGhostLink>
              </div>
            </div>
          </FadeUp>
        </div>
      </section>

      <section className="bg-cream px-6 py-20 md:px-10 md:py-24 lg:px-12 lg:py-28">
        <FadeUp className="mx-auto max-w-[62.5rem] text-center">
          <p className={EYEBROW}>The thesis</p>
          <h2 className="mt-4 font-display text-[2rem] leading-[1.12] tracking-tight text-charcoal md:text-[2.75rem] lg:text-[3.2rem]">
            Expertise is the new distribution.
          </h2>
          <p className="mx-auto mt-5 max-w-[45rem] text-[1.05rem] leading-relaxed text-charcoal/65">
            Reach is easy to buy. Credibility is not. We help brands work with
            operators who already have trust in the room, and help creators turn
            that trust into durable commercial work.
          </p>
        </FadeUp>
      </section>

      <section
        id="why"
        className="scroll-mt-28 bg-cream px-6 pb-20 md:px-10 md:pb-24 lg:px-12 lg:pb-28"
      >
        <div className={`${PAGE_SHELL} grid gap-12 lg:grid-cols-[minmax(0,1.15fr)_minmax(16rem,0.55fr)] lg:gap-20`}>
          <FadeUp>
            <article>
              <p className={EYEBROW}>Why we exist</p>
              <h2 className="mt-4 max-w-[18ch] font-display text-[2rem] leading-[1.12] tracking-tight text-charcoal md:text-[2.65rem]">
                The creator economy grew up. Representation has to grow up with
                it.
              </h2>
              <div className="mt-8 max-w-[45rem] space-y-5 text-[1rem] leading-relaxed text-charcoal/68">
                <p>
                  The most valuable creators in B2B are not entertainers chasing
                  attention. They are practitioners with judgment: people who have
                  built companies, led functions, allocated capital, or shaped a
                  category.
                </p>
                <p>
                  That kind of trust deserves a different commercial model.
                  Credible gives expert voices the management layer they need —
                  strategy, pricing, negotiation, delivery, and brand fit —
                  without turning them into a marketplace profile.
                </p>
                <p>
                  For brands, it means access to voices their buyers already
                  respect. For creators, it means commercial work that compounds
                  instead of interrupting the work that made them credible.
                </p>
              </div>
            </article>
          </FadeUp>

          <FadeUp delay={120}>
            <aside className="lg:pt-10">
            <p className={EYEBROW_MUTED}>On this page</p>
            <nav className="mt-4 border-t border-charcoal/10" aria-label="On this page">
              {JUMP.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  className="flex items-center justify-between border-b border-charcoal/10 py-3.5 text-[0.9375rem] text-charcoal transition-colors hover:text-forest"
                >
                  {item.label}
                  <ArrowRight className="size-3.5 text-charcoal/35" aria-hidden />
                </a>
              ))}
            </nav>
            <div className="mt-6 rounded-sm bg-forest-dark p-7 text-cream">
              <p className="font-display text-[1.25rem] leading-snug tracking-tight">
                Ready to brief an expert?
              </p>
              <p className="mt-2 text-[0.875rem] leading-relaxed text-cream/70">
                Browse operators by topic, format, and archetype — then send a
                brief.
              </p>
              <Link
                href="/roster"
                className="mt-5 inline-flex items-center gap-2 text-[0.875rem] font-medium text-cream hover:text-cream/80"
              >
                Browse the roster
                <ArrowRight className="size-3.5" aria-hidden />
              </Link>
            </div>
          </aside>
          </FadeUp>
        </div>
      </section>

      <section id="ledger" className="scroll-mt-28 bg-charcoal px-6 py-20 text-cream md:px-10 md:py-24 lg:px-12 lg:py-28">
        <div className={PAGE_SHELL}>
          <FadeUp>
            <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,22rem)] lg:items-end">
              <h2 className="max-w-[16ch] font-display text-[2rem] leading-[1.12] tracking-tight md:text-[2.65rem]">
                Credible gives expert voices commercial leverage.
              </h2>
              <p className="text-[0.9375rem] leading-relaxed text-cream/65">
                A smaller roster creates better fit, better pricing, and more
                credible work for both sides of the market.
              </p>
            </div>
          </FadeUp>

          <ul className="mt-12">
            {LEDGER.map((row, index) => (
              <li key={row.label}>
                <FadeUp delay={index * 90} y={20} threshold={0.15}>
                  <div className="grid gap-3 border-t border-cream/12 py-8 md:grid-cols-[8rem_minmax(0,16rem)_minmax(0,1fr)] md:items-baseline md:gap-10">
                    <p className="font-display text-[2.75rem] leading-none tracking-tight text-cream md:text-[3.25rem]">
                      {row.value}
                    </p>
                    <p className="text-[1.05rem] leading-snug text-cream">{row.label}</p>
                    <p className="text-[0.9375rem] leading-relaxed text-cream/60">
                      {row.note}
                    </p>
                  </div>
                </FadeUp>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section
        id="model"
        className="scroll-mt-28 bg-cream-dark px-6 py-20 md:px-10 md:py-24 lg:px-12 lg:py-28"
      >
        <div className={PAGE_SHELL}>
          <FadeUp>
            <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,22rem)] lg:items-end">
              <h2 className="max-w-[14ch] font-display text-[2rem] leading-[1.12] tracking-tight text-charcoal md:text-[2.65rem]">
                Selective by design, commercial by default.
              </h2>
              <p className="text-[0.9375rem] leading-relaxed text-charcoal/60">
                The business case is simple: a smaller roster creates better fit,
                better pricing, and better delivery.
              </p>
            </div>
          </FadeUp>
          <ul className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
            {MODEL.map((item, index) => (
              <li key={item.n}>
                <FadeUp delay={index * 90} y={20} threshold={0.15}>
                  <div className="border-t border-charcoal/12 pt-5">
                    <p className="text-[0.68rem] font-medium tracking-[0.16em] text-forest uppercase">
                      {item.n}
                    </p>
                    <h3 className="mt-3 font-display text-[1.25rem] leading-snug tracking-tight text-charcoal">
                      {item.title}
                    </h3>
                    <p className="mt-3 text-[0.875rem] leading-relaxed text-charcoal/60">
                      {item.body}
                    </p>
                  </div>
                </FadeUp>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section
        id="roster"
        className="scroll-mt-28 overflow-hidden bg-cream py-20 md:py-24 lg:py-28"
      >
        <div className={`${PAGE_SHELL} px-6 md:px-10 lg:px-12`}>
          <FadeUp>
            <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,24rem)] lg:items-end">
              <div>
                <p className={EYEBROW}>How credibility compounds</p>
                <h2 className="mt-3 max-w-[16ch] font-display text-[2rem] leading-[1.12] tracking-tight text-charcoal md:text-[2.65rem]">
                  A roster with range, managed with restraint.
                </h2>
              </div>
              <p className="text-[0.9375rem] leading-relaxed text-charcoal/60">
                The agency only works if the roster stays credible. Every
                partnership, stage, and content program has to protect the
                expert&apos;s point of view while making the commercial
                opportunity easier to execute.
              </p>
            </div>
          </FadeUp>
        </div>

        <AboutRosterRail />
      </section>

      <section className="px-6 py-16 md:px-10 md:py-20 lg:px-12 lg:py-24">
        <div className={PAGE_SHELL}>
          <FadeUp>
            <div className="relative overflow-hidden rounded-sm bg-rust text-cream">
            <div className="pointer-events-none absolute inset-0 overflow-hidden">
              <PatternField
                color={{ r: 249, g: 243, b: 239 }}
                className="opacity-[0.13]"
                mask="linear-gradient(to left, black 0%, rgba(0,0,0,0.4) 45%, transparent 88%)"
              />
            </div>
            <div className="relative z-2 grid items-end gap-10 px-8 py-10 md:grid-cols-[minmax(0,1.4fr)_minmax(0,18rem)] md:px-12 md:py-14 lg:px-16 lg:py-16">
              <div>
                <p className="text-[0.68rem] font-medium tracking-[0.16em] text-cream/60 uppercase">
                  Two ways in
                </p>
                <h2 className="mt-3 max-w-[18ch] font-display text-[2rem] leading-[1.12] tracking-tight md:text-[2.5rem]">
                  Find the voice your buyers already believe — or become one of
                  them.
                </h2>
                <p className="mt-4 max-w-[32rem] text-[0.9375rem] leading-relaxed text-cream/72">
                  Brands turn expert trust into campaigns, content, speaking, and
                  live moments. Creators turn authority into managed opportunity.
                </p>
                <div className="mt-6 flex flex-wrap items-center gap-3">
                  <div className="flex -space-x-2">
                    {FACES.map((src) => (
                      <span
                        key={src}
                        className="relative size-9 overflow-hidden rounded-full border-2 border-rust"
                      >
                        <SiteImage src={src} alt="" fill sizes="36px" className="object-cover" />
                      </span>
                    ))}
                  </div>
                  <p className="text-[0.8125rem] text-cream/75">
                    24 creators represented
                    <span className="mx-2 text-cream/35">·</span>
                    Actively recruiting
                  </p>
                </div>
              </div>
              <div className="flex flex-col gap-3">
                <PagePrimaryLink href="/contact" tone="cream" className="w-full">
                  Send a brand brief
                </PagePrimaryLink>
                <PageGhostLink
                  href="/apply-for-representation"
                  onDark
                  className="w-full"
                >
                  Apply for representation
                </PageGhostLink>
              </div>
            </div>
          </div>
          </FadeUp>
        </div>
      </section>
    </>
  );
}
