import {
  Briefcase,
  ChartLineUp,
  Check,
  EnvelopeSimple,
  Microphone,
  X,
} from "@phosphor-icons/react/ssr";

import { FadeUp } from "@/components/fade-up";
import {
  EYEBROW,
  EYEBROW_MUTED,
  EYEBROW_ON_DARK,
  PAGE_SHELL,
  PageGhostLink,
  PagePrimaryLink,
} from "@/components/inner-page";
import { RepresentationApplyCta } from "@/components/representation-apply-cta";
import { RepresentationApplicationForm } from "@/components/representation-application-form";
import { RepresentationFaq } from "@/components/representation-faq";
import { createMetadata } from "@/lib/seo";

export const metadata = createMetadata({
  title: "Apply for representation",
  description:
    "Apply to join Credible Creators — commercial management for founders, operators, and expert voices with real B2B audiences.",
  path: "/apply-for-representation",
});

const NEXT = [
  "A manager checks audience fit and commercial readiness.",
  "Qualified applicants get a fit call, not a generic sequence.",
  "If it is not right, the response is clear so you can move on.",
] as const;

const AUTHORITY = [
  {
    value: "24",
    label: "signed voices",
    note: "Selective enough to keep deal quality high.",
  },
  {
    value: "4",
    label: "commercial formats",
    note: "Partnerships, speaking, events, and ambassador work.",
  },
  {
    value: "14d",
    label: "review window",
    note: "Qualified applications get a clear next step quickly.",
  },
  {
    value: "1:1",
    label: "named manager",
    note: "A real operator handles fit, pricing, and scope.",
  },
] as const;

const FIT = [
  "B2B audience of buyers, builders, or decision-makers",
  "Consistent body of work brands can evaluate",
  "Interested in repeat commercial work, not one-off posts",
] as const;

const NOT_FIT = [
  "Consumer entertainment or lifestyle-first reach",
  "No consistent publishing, speaking, or hosting yet",
  "Looking only for a directory listing or passive discovery",
] as const;

const PATH = [
  {
    n: "01",
    phase: "Step 01 · 5 min",
    title: "Submit the essentials",
    body: "Audience, platform, expertise, formats, and recent work. No deck, no fee, no portal login.",
    outcome: "Queued for review",
    filled: false,
  },
  {
    n: "02",
    phase: "Step 02 · 14 days",
    title: "Get a human read",
    body: "A manager reviews your fit against audience, category authority, and commercial potential.",
    outcome: "Yes, no, or more context",
    filled: false,
  },
  {
    n: "03",
    phase: "Step 03 · if aligned",
    title: "Start representation",
    body: "Terms, roster profile, deal packaging, and qualified inbound handled by a named manager.",
    outcome: "Managed commercial work",
    filled: true,
  },
] as const;

const BENEFITS = [
  {
    icon: EnvelopeSimple,
    title: "Managed inbound",
    body: "Filter briefs, negotiate scope, and keep poor-fit asks off your calendar.",
  },
  {
    icon: Briefcase,
    title: "Brand partnerships",
    body: "Series, newsletters, and considered integrations built around your voice.",
  },
  {
    icon: Microphone,
    title: "Speaking & events",
    body: "Keynotes, firesides, and hosted programming backed by PepTalk infrastructure.",
  },
  {
    icon: ChartLineUp,
    title: "Commercial strategy",
    body: "Pricing, packaging, and format mix for repeat revenue instead of ad hoc gigs.",
  },
] as const;

const FAQ = [
  {
    q: "Is there a follower minimum?",
    a: "No fixed threshold. We care about professional trust, audience relevance, and evidence of category authority.",
  },
  {
    q: "What are the requirements?",
    a: "There is no fixed follower count. We look for operator credibility, an engaged professional audience, a body of published or spoken work, and genuine commercial ambition. Micro-audiences with high trust can qualify if the fit is strong.",
  },
  {
    q: "Do you take everyone who applies?",
    a: "No. We cap the roster so every signed creator gets real manager attention. Applications receive a clear yes, no, or request for more context — not silence.",
  },
  {
    q: "What does representation cost?",
    a: "Standard agency terms on commercial work we originate or manage. No fee to apply. We walk through the model on a fit call before anything is signed.",
  },
  {
    q: "How long until I hear back?",
    a: "Applications are reviewed every two weeks. Qualified profiles typically hear within 14 days of the review window.",
  },
  {
    q: "Can I keep existing partners?",
    a: "Yes, in most cases. We ask for transparency on existing representation and exclusivity only where a specific deal requires it.",
  },
] as const;

export default function ApplyForRepresentationPage() {
  return (
    <>
      <section
        id="apply"
        className="scroll-mt-24 bg-cream-dark px-6 pt-8 pb-12 md:px-10 md:pt-10 md:pb-16 lg:px-12 lg:pt-12 lg:pb-20"
      >
        <div className={`${PAGE_SHELL} grid items-start gap-8 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)] lg:gap-10`}>
          <FadeUp y={18} duration={1000} threshold={0.05} rootMargin="0px">
            <p className="inline-flex items-center gap-2 rounded-full border border-charcoal/20 px-3.5 py-1.5 text-[0.75rem] font-medium text-charcoal">
              <span className="size-1.5 rounded-full bg-forest" aria-hidden />
              Applications reviewed every two weeks
            </p>
            <h1 className="mt-5 max-w-[14ch] font-display text-[2.25rem] leading-[1.05] tracking-tight text-charcoal sm:text-[2.85rem] md:text-[3.15rem]">
              Turn your expert audience into managed commercial work.
            </h1>
            <p className="mt-4 max-w-[34rem] text-[1rem] leading-relaxed text-charcoal/65">
              Credible represents founders, operators, investors, and specialist
              voices with B2B audiences. You keep the voice. We qualify inbound,
              price opportunities, negotiate scope, and manage delivery.
            </p>
            <p className="mt-7 flex flex-wrap items-center gap-x-4 gap-y-2 text-[0.8125rem] text-charcoal/55">
              <span>No fee to apply</span>
              <span className="hidden h-3 w-px bg-charcoal/20 sm:block" aria-hidden />
              <span>Clear response</span>
              <span className="hidden h-3 w-px bg-charcoal/20 sm:block" aria-hidden />
              <span>Selective roster</span>
            </p>
            <div className="mt-8 border-t border-charcoal/15 pt-5">
              <p className={EYEBROW_MUTED}>What happens next</p>
              <ol className="mt-4 space-y-2.5">
                {NEXT.map((item, i) => (
                  <li key={item} className="flex items-start gap-4">
                    <span className="w-6 shrink-0 text-[0.75rem] font-medium tracking-[0.1em] text-forest">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="text-[0.9375rem] leading-relaxed text-charcoal/65">
                      {item}
                    </span>
                  </li>
                ))}
              </ol>
            </div>
          </FadeUp>

          <FadeUp delay={140} y={18} duration={1000} threshold={0.05} rootMargin="0px">
            <RepresentationApplicationForm />
          </FadeUp>
        </div>
      </section>

      <section className="bg-cream px-6 py-16 md:px-10 md:py-20 lg:px-12 lg:py-24">
        <div className={PAGE_SHELL}>
          <FadeUp>
            <h2 className="max-w-[16ch] font-display text-[2rem] leading-[1.12] tracking-tight text-charcoal md:text-[2.5rem]">
              Authority is easier to sell when it is managed.
            </h2>
          </FadeUp>
          <ul className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {AUTHORITY.map((item, index) => (
              <li key={item.label}>
                <FadeUp delay={index * 80} y={18} threshold={0.15}>
                  <div className="border-t border-charcoal/10 pt-5">
                <p className="flex flex-wrap items-baseline gap-2">
                  <span className="font-display text-[2.5rem] leading-none tracking-tight text-charcoal">
                    {item.value}
                  </span>
                  <span className="text-[0.9375rem] text-charcoal/70">
                    {item.label}
                  </span>
                </p>
                <p className="mt-3 text-[0.875rem] leading-relaxed text-charcoal/55">
                    {item.note}
                  </p>
                  </div>
                </FadeUp>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="bg-cream px-6 pb-16 md:px-10 md:pb-20 lg:px-12 lg:pb-24">
        <div className={PAGE_SHELL}>
          <FadeUp>
            <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,24rem)] lg:items-end">
              <div>
                <p className={EYEBROW}>Self qualify</p>
                <h2 className="mt-3 max-w-[16ch] font-display text-[2rem] leading-[1.12] tracking-tight text-charcoal md:text-[2.5rem]">
                  Built for expert voices brands already trust.
                </h2>
              </div>
              <p className="text-[0.9375rem] leading-relaxed text-charcoal/60">
                The best applicants have authority in a category, not just
                attention. This page makes that distinction obvious before someone
                reaches the form.
              </p>
            </div>
          </FadeUp>

          <div className="mt-12 grid gap-4 lg:grid-cols-2">
            <FadeUp>
              <div className="rounded-sm bg-forest-dark p-8 text-cream md:p-10">
              <p className={EYEBROW_ON_DARK}>Likely a fit</p>
              <ul className="mt-6">
                {FIT.map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-4 border-t border-cream/15 py-5 last:border-b"
                  >
                    <Check
                      weight="bold"
                      className="mt-0.5 size-5 shrink-0 text-cream"
                      aria-hidden
                    />
                    <span className="text-[1rem] leading-snug text-cream">
                      {item}
                    </span>
                  </li>
                ))}
              </ul>
              </div>
            </FadeUp>
            <FadeUp delay={100}>
              <div className="rounded-sm bg-cream-dark p-8 md:p-10">
              <p className={EYEBROW_MUTED}>Probably not a fit</p>
              <ul className="mt-6">
                {NOT_FIT.map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-4 border-t border-charcoal/10 py-5 last:border-b"
                  >
                    <X
                      weight="bold"
                      className="mt-0.5 size-5 shrink-0 text-charcoal/35"
                      aria-hidden
                    />
                    <span className="text-[1rem] leading-snug text-charcoal/70">
                      {item}
                    </span>
                  </li>
                ))}
              </ul>
              </div>
            </FadeUp>
          </div>
        </div>
      </section>

      <section className="bg-charcoal px-6 py-20 text-cream md:px-10 md:py-24 lg:px-12 lg:py-28">
        <div className={PAGE_SHELL}>
          <FadeUp>
            <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,22rem)] lg:items-end">
              <div>
                <p className={EYEBROW_ON_DARK}>The path</p>
                <h2 className="mt-3 max-w-[18ch] font-display text-[2rem] leading-[1.12] tracking-tight md:text-[2.65rem]">
                  A straight path from application to managed briefs.
                </h2>
              </div>
              <p className="text-[0.9375rem] leading-relaxed text-cream/60">
                No deck, no fee, and no portal login. Every application gets a
                clear answer.
              </p>
            </div>
          </FadeUp>

          <ol className="mt-12">
            {PATH.map((step, index) => (
              <li key={step.n}>
                <FadeUp delay={index * 80} y={18} threshold={0.15}>
                  <div className="grid gap-4 border-t border-cream/12 py-8 last:border-b md:grid-cols-[5.5rem_minmax(0,16rem)_minmax(0,1fr)] md:items-start md:gap-8 lg:grid-cols-[7rem_minmax(0,18rem)_minmax(0,1fr)]">
                <p className="font-display text-[2.75rem] leading-none tracking-tight text-cream/20 md:text-[3.25rem]">
                  {step.n}
                </p>
                <div>
                  <p className="text-[0.68rem] font-medium tracking-[0.16em] text-cream/50 uppercase">
                    {step.phase}
                  </p>
                  <h3 className="mt-2 font-display text-[1.5rem] leading-snug tracking-tight text-cream md:text-[1.75rem]">
                    {step.title}
                  </h3>
                </div>
                <div>
                  <p className="max-w-xl text-[0.9375rem] leading-relaxed text-cream/65">
                    {step.body}
                  </p>
                  <p
                    className={
                      step.filled
                        ? "mt-5 inline-flex items-center gap-2.5 rounded-full bg-forest-dark px-4 py-2 text-[0.8125rem] font-medium text-cream"
                        : "mt-5 inline-flex items-center gap-2.5 rounded-full border border-cream/25 px-4 py-2 text-[0.8125rem] font-medium text-cream"
                    }
                  >
                    <span className="size-1.5 rounded-full bg-cream" aria-hidden />
                    {step.outcome}
                  </p>
                </div>
                  </div>
                </FadeUp>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="bg-cream px-6 py-20 md:px-10 md:py-24 lg:px-12 lg:py-28">
        <div className={PAGE_SHELL}>
          <FadeUp>
            <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,24rem)] lg:items-end">
              <div>
                <p className={EYEBROW}>What you get</p>
                <h2 className="mt-3 max-w-[16ch] font-display text-[2rem] leading-[1.12] tracking-tight text-charcoal md:text-[2.5rem]">
                  Representation that protects the work and grows the business.
                </h2>
              </div>
              <p className="text-[0.9375rem] leading-relaxed text-charcoal/60">
                The offer is deliberately concrete: fewer vague promises, more
                explicit management value.
              </p>
            </div>
          </FadeUp>
          <ul className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {BENEFITS.map((item, index) => (
              <li key={item.title}>
                <FadeUp delay={index * 80} y={18} threshold={0.15} className="h-full">
                  <div className="flex h-full min-h-[13.75rem] flex-col rounded-sm bg-cream-dark p-7">
                <item.icon
                  weight="regular"
                  className="size-6 text-forest"
                  aria-hidden
                />
                <h3 className="mt-6 font-display text-[1.25rem] leading-snug tracking-tight text-charcoal">
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

      <section className="bg-cream px-6 pb-16 md:px-10 md:pb-20 lg:px-12 lg:pb-24">
        <div className={PAGE_SHELL}>
          <FadeUp>
            <div className="mx-auto max-w-[52.5rem] text-center">
            <p className={EYEBROW}>FAQ</p>
            <h2 className="mt-4 font-display text-[2rem] leading-[1.1] tracking-tight text-charcoal md:text-[3.25rem]">
              Common reasons people hesitate.
            </h2>
            <p className="mx-auto mt-5 max-w-[32.5rem] text-[1.0625rem] leading-relaxed text-charcoal/70">
              Answers sit close to the form instead of sending motivated
              applicants away to find clarity.
            </p>
            </div>
          </FadeUp>
          <div className="mx-auto mt-14 max-w-[47.5rem]">
            <RepresentationFaq items={FAQ} />
          </div>
        </div>
      </section>

      <section className="px-6 pb-16 md:px-10 md:pb-20 lg:px-12 lg:pb-24">
        <div className={PAGE_SHELL}>
          <FadeUp>
            <div className="grid items-end gap-10 rounded-sm bg-forest-dark px-8 py-10 text-cream md:grid-cols-[minmax(0,1.4fr)_minmax(0,17rem)] md:px-12 md:py-14">
            <div>
              <p className={EYEBROW_ON_DARK}>Start application · 5 minutes</p>
              <h2 className="mt-3 font-display text-[2rem] leading-[1.12] tracking-tight md:text-[2.5rem]">
                Tell us about your audience.
              </h2>
              <p className="mt-4 max-w-[32rem] text-[0.9375rem] leading-relaxed text-cream/70">
                Five minutes, no deck, no fee. Applications are reviewed every
                two weeks and every one gets a clear answer.
              </p>
            </div>
            <div className="flex flex-col gap-3">
              <RepresentationApplyCta surface="dark" className="w-full">
                Start the application
              </RepresentationApplyCta>
              <PageGhostLink href="/roster" onDark className="w-full">
                See who we represent
              </PageGhostLink>
            </div>
          </div>
          </FadeUp>
        </div>
      </section>
    </>
  );
}
