import { Check, Minus } from "@phosphor-icons/react/ssr";

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
import { ProcessTimeline } from "@/components/process-timeline";
import { createMetadata } from "@/lib/seo";

export const metadata = createMetadata({
  title: "What we do",
  description:
    "Four ways to put an expert voice behind your brand — content, brand partnerships, speaking, and live events.",
  path: "/what-we-do",
});

const LANES = [
  {
    n: "01",
    title: "Expert content",
    body: "Series, reports, webinars, and editorial programs buyers keep.",
  },
  {
    n: "02",
    title: "Brand partnerships",
    body: "Creator-led campaigns and integrations with credible fit.",
  },
  {
    n: "03",
    title: "Speaking & keynotes",
    body: "Keynotes, panels, firesides, and category briefings.",
  },
  {
    n: "04",
    title: "Live programming",
    body: "Roundtables, executive forums, launches, and hosted moments.",
  },
] as const;

const MOMENTS = [
  {
    eyebrow: "Launch or reposition",
    title: "Borrow category trust",
    body: "Use expert-led content and partnerships to make a new idea feel understood and credible.",
  },
  {
    eyebrow: "Educate buyers",
    title: "Create useful authority",
    body: "Build repeatable formats that help prospects think through problems before a sales conversation.",
  },
  {
    eyebrow: "Move a room",
    title: "Make live moments matter",
    body: "Use speakers, hosts, and programming to turn events into trusted buyer experiences.",
  },
] as const;

const SERVICES = [
  {
    n: "01",
    lane: "Content strategy",
    title: "Expert content series",
    body: "Use expert voices to build repeatable education that buyers save and share.",
    formats: [
      "Newsletters",
      "Video series",
      "Webinars",
      "Reports",
      "Editorial franchises",
    ],
    bestFor:
      "Category creation, pipeline nurture, and turning complex ideas into useful authority.",
  },
  {
    n: "02",
    lane: "Campaign fit",
    title: "Brand partnerships",
    body: "Attach a credible operator, founder, investor, or specialist to a message that needs trust transfer, not just reach.",
    formats: ["Creator-led campaigns", "Integrations", "Ambassador programs"],
    bestFor:
      "Launches, repositioning, sponsor programs, and thought-leadership campaigns.",
  },
  {
    n: "03",
    lane: "Room impact",
    title: "Speaking & keynotes",
    body: "Book expert voices for executive audience moments where the room needs practical authority.",
    formats: ["Keynotes", "Panels", "Firesides", "Category briefings"],
    bestFor: "Rooms that need practical authority, not generic inspiration.",
  },
  {
    n: "04",
    lane: "Live programming",
    title: "Live events & programming",
    body: "Design hosted moments around the expert, from private tables to full community programming.",
    formats: [
      "Roundtables",
      "Executive forums",
      "Salons",
      "Launches",
      "Community programming",
    ],
    bestFor:
      "Relationship-building, market education, and experiences people talk about after.",
  },
] as const;

const STEPS = [
  {
    n: "01",
    title: "Brief the moment",
    body: "Goal, audience, category, timing, and why an expert voice matters here.",
  },
  {
    n: "02",
    title: "Shape the service mix",
    body: "We recommend content, partnership, speaking, live, or a combined program.",
  },
  {
    n: "03",
    title: "Match the voice",
    body: "Shortlist credible experts by audience trust, authority, availability, and fit.",
  },
  {
    n: "04",
    title: "Manage delivery",
    body: "Scope, terms, production, approvals, timelines, and reporting stay handled.",
  },
] as const;

const MATRIX = [
  {
    n: "01",
    moment: "Launch or reposition",
    becomes:
      "Borrow category trust so a market understands why your point of view matters now.",
    lanes: [true, true, false, false],
  },
  {
    n: "02",
    moment: "Educate a buying committee",
    becomes:
      "Create useful authority when the sale depends on helping prospects think through a complex problem.",
    lanes: [true, false, true, false],
  },
  {
    n: "03",
    moment: "Move an executive room",
    becomes:
      "Make live moments matter when attention, credibility, and discussion need to happen in real time.",
    lanes: [false, false, true, true],
  },
  {
    n: "04",
    moment: "Build a repeat program",
    becomes:
      "Compound the relationship when one campaign should become an ongoing editorial, event, and partnership system.",
    lanes: [true, true, true, true],
  },
] as const;

const LANE_LABELS = ["Content", "Partners", "Speaking", "Live"] as const;

function LaneMark({ on }: { on: boolean }) {
  return (
    <span
      className={`inline-flex size-7 items-center justify-center rounded-sm ${
        on ? "bg-forest-dark text-cream" : "bg-charcoal/8 text-charcoal/30"
      }`}
    >
      {on ? (
        <Check weight="bold" className="size-3.5" aria-hidden />
      ) : (
        <Minus weight="bold" className="size-3.5" aria-hidden />
      )}
    </span>
  );
}

export default function WhatWeDoPage() {
  return (
    <>
      <section className="bg-cream px-6 pt-10 pb-16 md:px-10 md:pt-14 md:pb-20 lg:px-12 lg:pt-16 lg:pb-24">
        <div className={`${PAGE_SHELL} grid items-stretch gap-8 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:gap-12`}>
          <FadeUp className="flex flex-col justify-between py-2" y={18} duration={1000} threshold={0.05} rootMargin="0px">
            <div>
              <p className={EYEBROW}>What we do</p>
              <h1 className="mt-4 max-w-[14ch] font-display text-[2.6rem] leading-[1.06] tracking-tight text-charcoal sm:text-[3.25rem] md:text-[3.75rem] lg:text-[4rem]">
                Expert-led growth, managed end to end.
              </h1>
              <p className="mt-5 max-w-[34rem] text-[1.05rem] leading-relaxed text-charcoal/65">
                Credible turns expert authority into content, partnerships,
                speaking, and live programs that B2B buyers actually trust.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <PagePrimaryLink href="/contact">Send a brand brief</PagePrimaryLink>
                <PageGhostLink href="#services">Compare services</PageGhostLink>
              </div>
            </div>
            <dl className="mt-12 grid gap-6 border-t border-charcoal/10 pt-6 sm:grid-cols-2">
              <div>
                <dt className="font-display text-[1.15rem] leading-snug text-charcoal">
                  Managed end to end
                </dt>
                <dd className="mt-1.5 text-[0.875rem] leading-relaxed text-charcoal/58">
                  Strategy, shortlist, scope, pricing, timelines, delivery.
                </dd>
              </div>
              <div>
                <dt className="font-display text-[1.15rem] leading-snug text-charcoal">
                  Built for B2B
                </dt>
                <dd className="mt-1.5 text-[0.875rem] leading-relaxed text-charcoal/58">
                  Buyer trust, category authority, and credible context.
                </dd>
              </div>
            </dl>
          </FadeUp>

          <FadeUp delay={140} y={18} duration={1000} threshold={0.05} rootMargin="0px" className="h-full">
            <div className="flex h-full flex-col justify-between rounded-sm bg-forest-dark p-8 text-cream md:p-10">
            <div className="flex items-start justify-between gap-6">
              <div>
                <p className={EYEBROW_ON_DARK}>Service system</p>
                <p className="mt-3 font-display text-[1.85rem] leading-[1.12] tracking-tight">
                  Four service lanes.
                  <br />
                  One managed system.
                </p>
              </div>
              <span className="flex size-14 shrink-0 items-center justify-center rounded-full border border-cream/20 font-display text-[1.35rem]">
                4
              </span>
            </div>
            <ol className="mt-8 border-t border-cream/15">
              {LANES.map((lane) => (
                <li
                  key={lane.n}
                  className="flex items-start gap-5 border-b border-cream/15 py-4"
                >
                  <span className="w-7 shrink-0 text-[0.75rem] font-medium tracking-[0.1em] text-cream/50">
                    {lane.n}
                  </span>
                  <div>
                    <p className="text-[1rem] font-medium leading-snug text-cream">
                      {lane.title}
                    </p>
                    <p className="mt-1 text-[0.8125rem] leading-relaxed text-cream/65">
                      {lane.body}
                    </p>
                  </div>
                </li>
              ))}
            </ol>
            <p className="mt-6 text-[0.8125rem] leading-relaxed text-cream/55">
              The buyer does not have to pick perfectly. We shape the mix from
              one brief.
            </p>
            </div>
          </FadeUp>
        </div>
      </section>

      <section className="px-6 pb-16 md:px-10 md:pb-20 lg:px-12 lg:pb-24">
        <div className={PAGE_SHELL}>
          <FadeUp>
            <div className="rounded-sm bg-charcoal px-8 py-10 text-cream md:px-12 md:py-14">
            <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,26rem)] lg:items-end">
              <h2 className="max-w-[28ch] font-display text-[2rem] leading-[1.12] tracking-tight md:text-[2.5rem]">
                Choose by business moment,
                <br />
                not by content format.
              </h2>
              <p className="text-[0.9375rem] leading-relaxed text-cream/65">
                The page should help a buyer recognize their goal first, then
                understand the right service mix.
              </p>
            </div>
            <ul className="mt-10 grid gap-8 md:grid-cols-3 md:gap-6">
              {MOMENTS.map((moment) => (
                <li key={moment.title} className="border-t border-cream/15 pt-5">
                  <p className="text-[0.68rem] font-medium tracking-[0.16em] text-cream/50 uppercase">
                    {moment.eyebrow}
                  </p>
                  <h3 className="mt-3 font-display text-[1.35rem] leading-snug tracking-tight">
                    {moment.title}
                  </h3>
                  <p className="mt-3 text-[0.875rem] leading-relaxed text-cream/65">
                    {moment.body}
                  </p>
                </li>
              ))}
            </ul>
            </div>
          </FadeUp>
        </div>
      </section>

      <section
        id="services"
        className="scroll-mt-28 bg-cream px-6 pb-20 md:px-10 md:pb-24 lg:px-12 lg:pb-28"
      >
        <div className={PAGE_SHELL}>
          <FadeUp>
            <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,22rem)] lg:items-end">
              <div>
                <p className={EYEBROW}>Services</p>
                <h2 className="mt-3 max-w-[16ch] font-display text-[2rem] leading-[1.12] tracking-tight text-charcoal md:text-[2.65rem]">
                  The right format depends on the business moment.
                </h2>
              </div>
              <p className="text-[0.9375rem] leading-relaxed text-charcoal/60">
                Four lanes, one managed system. Most strong programs combine more
                than one.
              </p>
            </div>
          </FadeUp>

          <ul className="mt-12 grid gap-4 lg:grid-cols-2">
            {SERVICES.map((service, index) => (
              <li key={service.n}>
                <FadeUp delay={(index % 2) * 90 + Math.floor(index / 2) * 80} y={22} threshold={0.12} className="h-full">
                  <div className="flex h-full flex-col overflow-hidden rounded-sm border border-charcoal/8 bg-white">
                <div className="flex flex-1 flex-col p-7 md:p-10">
                  <div className="flex items-baseline justify-between gap-4 border-b border-charcoal/10 pb-5">
                    <span className="text-[0.68rem] font-medium tracking-[0.16em] text-forest">
                      {service.n}
                    </span>
                    <span className="text-[0.68rem] font-medium tracking-[0.16em] text-forest uppercase">
                      {service.lane}
                    </span>
                  </div>
                  <h3 className="mt-7 font-display text-[1.65rem] leading-snug tracking-tight text-charcoal md:text-[2rem]">
                    {service.title}
                  </h3>
                  <p className="mt-3 text-[0.9375rem] leading-relaxed text-charcoal/62">
                    {service.body}
                  </p>
                  <p className="mt-8 text-[0.68rem] font-medium tracking-[0.16em] text-charcoal/45 uppercase">
                    Formats
                  </p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {service.formats.map((format) => (
                      <span
                        key={format}
                        className="rounded-full bg-cream-dark px-3.5 py-1.5 text-[0.8125rem] text-charcoal"
                      >
                        {format}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="flex min-h-[8.25rem] flex-col justify-center bg-forest-dark px-7 py-6 text-cream md:min-h-[7.5rem] md:px-10">
                  <p className="text-[0.68rem] font-medium tracking-[0.16em] text-cream/60 uppercase">
                    Best for
                  </p>
                  <p className="mt-1.5 text-[0.9375rem] leading-relaxed text-cream">
                    {service.bestFor}
                  </p>
                </div>
                  </div>
                </FadeUp>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="bg-cream-dark px-6 py-20 md:px-10 md:py-24 lg:px-12 lg:py-28">
        <div className={`${PAGE_SHELL} grid items-start gap-12 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:gap-16`}>
          <FadeUp className="lg:sticky lg:top-28">
            <p className={EYEBROW}>Process</p>
            <h2 className="mt-3 max-w-[12ch] font-display text-[2rem] leading-[1.12] tracking-tight text-charcoal md:text-[2.5rem]">
              From one brief to a managed program.
            </h2>
            <p className="mt-4 max-w-md text-[0.9375rem] leading-relaxed text-charcoal/62">
              Bring the business moment. We shape the right format, match the
              expert voice, and manage the work through delivery.
            </p>
            <p className="mt-6 border-t border-charcoal/12 pt-6 text-[0.875rem] leading-relaxed text-charcoal/55">
              You do not have to know the exact service before starting. The
              brief creates the path.
            </p>
            <PagePrimaryLink href="/contact" className="mt-8">
              Send a brand brief
            </PagePrimaryLink>
          </FadeUp>

          <ProcessTimeline steps={STEPS} />
        </div>
      </section>

      <section className="bg-cream px-6 py-20 md:px-10 md:py-24 lg:px-12 lg:py-28">
        <div className={PAGE_SHELL}>
          <FadeUp>
            <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,22rem)] lg:items-end">
              <div>
                <p className={EYEBROW}>How to choose</p>
                <h2 className="mt-3 max-w-[16ch] font-display text-[2rem] leading-[1.12] tracking-tight text-charcoal md:text-[2.65rem]">
                  Start with the business moment, not the format.
                </h2>
              </div>
              <p className="text-[0.9375rem] leading-relaxed text-charcoal/60">
                Find your moment on the left. The marked lanes are where we would
                start — most programs use more than one.
              </p>
            </div>
          </FadeUp>

          <FadeUp delay={80}>
            <div className="mt-12 hidden overflow-hidden rounded-sm border border-charcoal/10 lg:block">
            <div className="grid grid-cols-[14rem_minmax(0,1fr)_repeat(4,5.5rem)] border-b border-charcoal/10 bg-cream-dark px-6 py-4 text-[0.68rem] font-medium tracking-[0.16em] text-charcoal/45 uppercase">
              <p>Your business moment</p>
              <p>What it becomes</p>
              {LANE_LABELS.map((label) => (
                <p key={label} className="text-center">
                  {label}
                </p>
              ))}
            </div>
            {MATRIX.map((row) => (
              <div
                key={row.n}
                className="grid grid-cols-[14rem_minmax(0,1fr)_repeat(4,5.5rem)] items-center border-b border-charcoal/8 px-6 py-7 last:border-b-0"
              >
                <div>
                  <p className={EYEBROW_MUTED}>{row.n}</p>
                  <p className="mt-1 font-display text-[1.15rem] leading-snug text-charcoal">
                    {row.moment}
                  </p>
                </div>
                <p className="pr-8 text-[0.875rem] leading-relaxed text-charcoal/62">
                  {row.becomes}
                </p>
                {row.lanes.map((on, i) => (
                  <div key={LANE_LABELS[i]} className="flex justify-center">
                    <LaneMark on={on} />
                  </div>
                ))}
              </div>
            ))}
            </div>
          </FadeUp>

          <ul className="mt-10 space-y-4 lg:hidden">
            {MATRIX.map((row, index) => (
              <li key={row.n}>
                <FadeUp delay={index * 80}>
                  <div className="rounded-sm border border-charcoal/10 bg-white p-5">
                <p className={EYEBROW_MUTED}>{row.n}</p>
                <h3 className="mt-1 font-display text-[1.25rem] leading-snug text-charcoal">
                  {row.moment}
                </h3>
                <p className="mt-2 text-[0.875rem] leading-relaxed text-charcoal/62">
                  {row.becomes}
                </p>
                <dl className="mt-4 grid grid-cols-4 gap-2 border-t border-charcoal/8 pt-4">
                  {LANE_LABELS.map((label, i) => (
                    <div key={label} className="flex flex-col items-center gap-2">
                      <LaneMark on={row.lanes[i]} />
                      <dt className="text-[0.65rem] tracking-[0.08em] text-charcoal/45 uppercase">
                        {label}
                      </dt>
                    </div>
                  ))}
                </dl>
                  </div>
                </FadeUp>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="px-6 pb-16 md:px-10 md:pb-20 lg:px-12 lg:pb-24">
        <div className={PAGE_SHELL}>
          <FadeUp>
            <div className="relative overflow-hidden rounded-sm bg-forest-dark text-cream">
            <div className="pointer-events-none absolute inset-0 overflow-hidden">
              <PatternField
                color={{ r: 249, g: 243, b: 239 }}
                className="opacity-[0.13]"
                mask="linear-gradient(to left, black 0%, rgba(0,0,0,0.4) 45%, transparent 88%)"
              />
            </div>
            <div className="relative z-2 grid items-end gap-10 px-8 py-10 md:grid-cols-[minmax(0,1.4fr)_minmax(0,16rem)] md:px-12 md:py-14">
              <div>
                <p className={EYEBROW_ON_DARK}>Best next step</p>
                <h2 className="mt-3 max-w-[16ch] font-display text-[2rem] leading-[1.12] tracking-tight md:text-[2.5rem]">
                  Send one brief. We recommend the service mix.
                </h2>
                <p className="mt-4 max-w-[34rem] text-[0.9375rem] leading-relaxed text-cream/70">
                  You should not need to self-diagnose perfectly before starting.
                  Tell us the business moment and we will shape the rest.
                </p>
              </div>
              <div className="flex flex-col gap-3">
                <PagePrimaryLink href="/contact" tone="cream" className="w-full">
                  Send a brand brief
                </PagePrimaryLink>
                <PageGhostLink href="/roster" onDark className="w-full">
                  Explore the roster
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
