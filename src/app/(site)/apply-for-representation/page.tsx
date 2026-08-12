import {
  Briefcase,
  CalendarCheck,
  ChartLineUp,
  Handshake,
  Megaphone,
  Microphone,
} from "@phosphor-icons/react/ssr";

import { RepresentationApplyCta, RepresentationSecondaryCta } from "@/components/representation-apply-cta";

import { CreatorFacesMarquee } from "@/components/creator-faces-marquee";
import { RepresentationApplicationForm } from "@/components/representation-application-form";
import { RepresentationFaq } from "@/components/representation-faq";
import { RepresentationHowItWorks } from "@/components/representation-how-it-works";
import { RepresentationProgramFacts } from "@/components/representation-program-facts";
import { RepresentationWhoWeLookFor } from "@/components/representation-who-we-look-for";
import { PatternField } from "@/components/pattern-field";
import { createMetadata } from "@/lib/seo";

export const metadata = createMetadata({
  title: "Apply for representation",
  description:
    "Apply to join Credible Creators — commercial management for founders, operators, and expert voices with real B2B audiences.",
  path: "/apply-for-representation",
});

const EYEBROW =
  "text-[0.68rem] font-medium tracking-[0.18em] text-charcoal/45 uppercase";

const PERKS = [
  {
    icon: Handshake,
    title: "Managed inbound",
    body: "We filter briefs, negotiate scope and pricing, and protect your calendar — you stay focused on the work.",
  },
  {
    icon: Briefcase,
    title: "Brand partnerships",
    body: "Long-form series, newsletters, and considered integrations — not one-post drops.",
  },
  {
    icon: Microphone,
    title: "Speaking & events",
    body: "Keynotes, firesides, and hosted programming with the same team that books Fortune 500 stages.",
  },
  {
    icon: CalendarCheck,
    title: "Dedicated manager",
    body: "Selective roster by design. Every signed creator gets a named manager — not a shared inbox.",
  },
  {
    icon: ChartLineUp,
    title: "Commercial strategy",
    body: "Pricing, packaging, and format mix — built for operators who want repeat revenue, not ad-hoc gigs.",
  },
  {
    icon: Megaphone,
    title: "Roster visibility",
    body: "Featured on crediblecreators.com where brands search by topic, format, and archetype before they brief.",
  },
] as const;

const TESTIMONIALS = [
  {
    quote:
      "Credible turned inbound from a distraction into a pipeline. I still write in my voice — they handle everything commercial.",
    name: "Alex Lieberman",
    role: "Founder · Morning Brew",
  },
  {
    quote:
      "It's the first agency that treated me like an operator, not an influencer. Briefs are scoped, priced, and worth my time.",
    name: "Amara Chen",
    role: "Founder & keynote speaker",
  },
  {
    quote:
      "Same-day acknowledgements, clear terms, and brands that actually fit. That's rare in creator management.",
    name: "Daniel Park",
    role: "Innovation keynote",
  },
] as const;

const FAQ = [
  {
    q: "Who should apply?",
    a: "Founders, operators, investors, and subject-matter experts with established B2B audiences — especially on LinkedIn, podcasts, newsletters, and YouTube. We represent credibility in a category, not reach for its own sake.",
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
    q: "Can I keep working with other partners?",
    a: "Yes, in most cases. We ask for transparency on existing representation and exclusivity only where a specific deal requires it.",
  },
] as const;

export default function ApplyForRepresentationPage() {
  return (
    <>
      {/* Hero — full-bleed program intro (Claude / Adobe pattern) */}
      <section
        className="relative isolate -mt-[7.25rem] overflow-hidden bg-forest text-cream md:-mt-[5.5rem]"
        data-site-hero-overlay
      >
        <PatternField
          color={{ r: 249, g: 243, b: 239 }}
          className="opacity-[0.14] md:w-[52%]"
          mask="linear-gradient(to left, black 0%, rgba(0,0,0,0.5) 45%, transparent 90%)"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-linear-to-b from-charcoal/25 via-transparent to-charcoal/40"
        />

        <div className="relative z-10 mx-auto max-w-352 px-6 pt-28 md:px-10 md:pt-32 lg:px-12 lg:pt-36">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-[0.68rem] font-medium tracking-[0.2em] text-cream/55 uppercase">
              Representation program
            </p>
            <h1 className="mt-4 font-display text-[2.5rem] leading-[1.05] tracking-tight text-cream sm:text-[3rem] md:text-[3.5rem] lg:text-[3.75rem]">
              Apply for representation
            </h1>
            <p className="mx-auto mt-5 max-w-2xl text-[1rem] leading-relaxed text-cream/75 md:text-[1.0625rem]">
              Join a management agency built for the expert economy. You keep
              the voice — we handle inbound, pricing, and delivery for brand
              partnerships, speaking, and live programming.
            </p>
            <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
              <RepresentationApplyCta surface="dark" />
              <RepresentationSecondaryCta surface="dark" href="/roster">
                Meet the roster
              </RepresentationSecondaryCta>
            </div>
          </div>

        </div>

        <div className="relative z-10 mt-12 w-full pb-16 md:mt-16 md:pb-20 lg:pb-24">
          <CreatorFacesMarquee variant="wide" tone="cream" limit={14} />
          <p className="mt-5 text-center text-[0.75rem] tracking-wide text-cream/50 uppercase">
            24 founders, operators & investors represented
          </p>
        </div>
      </section>

      <RepresentationProgramFacts />

      {/* About the program */}
      <section className="px-6 py-16 md:px-10 md:py-20 lg:px-12 lg:py-24">
        <div className="mx-auto max-w-352">
          <div className="relative overflow-hidden rounded-sm bg-rust px-8 py-10 md:px-12 md:py-14 lg:px-16 lg:py-16">
            <PatternField
              color={{ r: 249, g: 243, b: 239 }}
              className="opacity-[0.13]"
              mask="linear-gradient(to left, black 0%, rgba(0,0,0,0.4) 45%, transparent 88%)"
            />
            <div className="relative z-2 grid items-start gap-8 lg:grid-cols-2 lg:gap-16">
              <div>
                <p className="text-[0.68rem] font-medium tracking-[0.18em] text-cream/55 uppercase">
                  About the program
                </p>
                <h2 className="mt-3 font-display text-[1.85rem] leading-tight tracking-tight text-cream md:text-[2.25rem]">
                  Operator credibility, managed commercially
                </h2>
              </div>
              <div className="space-y-4 text-[0.95rem] leading-relaxed text-cream/75 md:text-base">
                <p>
                  Credible Creators represents founders, operators, and trusted
                  voices in the expert economy — the people buyers already cite
                  in sales calls. We are not a marketplace or a self-serve
                  platform.
                </p>
                <p>
                  When you join the roster, a dedicated manager filters inbound,
                  structures deals, and protects your time. You publish and
                  perform in your voice; we handle the commercial layer that most
                  creators never get right on their own.
                </p>
                <p className="text-cream/60">
                  A PepTalk company — same infrastructure that puts expert voices
                  on stage for Fortune 500 briefs worldwide.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <RepresentationHowItWorks />

      <RepresentationWhoWeLookFor />

      {/* Benefits — Adobe perks grid */}
      <section className="border-t border-charcoal/8 bg-forest px-6 py-16 text-cream md:px-10 md:py-20 lg:px-12 lg:py-24">
        <div className="mx-auto max-w-352">
          <div className="max-w-2xl">
            <p className="text-[0.68rem] font-medium tracking-[0.18em] text-cream/50 uppercase">
              What you get
            </p>
            <h2 className="mt-3 font-display text-[1.85rem] leading-tight tracking-tight text-cream md:text-[2.25rem]">
              Representation that scales with your career
            </h2>
            <p className="mt-4 text-[0.95rem] leading-relaxed text-cream/70">
              More than a listing — a commercial partner for the formats that
              matter in B2B.
            </p>
          </div>
          <ul className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {PERKS.map((perk) => (
              <li
                key={perk.title}
                className="rounded-sm border border-cream/12 bg-cream/5 p-6 md:p-7"
              >
                <perk.icon
                  weight="duotone"
                  className="size-7 text-cream/90"
                  aria-hidden
                />
                <h3 className="mt-4 font-display text-[1.1rem] leading-snug tracking-tight text-cream">
                  {perk.title}
                </h3>
                <p className="mt-2.5 text-[0.8125rem] leading-relaxed text-cream/65">
                  {perk.body}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Testimonials — Fever social proof */}
      <section className="px-6 py-16 md:px-10 md:py-20 lg:px-12 lg:py-24">
        <div className="mx-auto max-w-352">
          <div className="mx-auto max-w-2xl text-center">
            <p className={EYEBROW}>From the roster</p>
            <h2 className="mt-3 font-display text-[1.85rem] leading-tight tracking-tight text-charcoal md:text-[2.25rem]">
              What represented creators say
            </h2>
          </div>
          <ul className="mt-12 grid gap-5 md:grid-cols-3">
            {TESTIMONIALS.map((item) => (
              <li
                key={item.name}
                className="flex flex-col rounded-sm border border-charcoal/8 bg-[#FBF8F5] p-6 md:p-7"
              >
                <p className="flex-1 text-[0.9375rem] leading-relaxed text-charcoal/75">
                  &ldquo;{item.quote}&rdquo;
                </p>
                <footer className="mt-6 border-t border-charcoal/8 pt-5">
                  <p className="text-[0.875rem] font-medium text-charcoal">
                    {item.name}
                  </p>
                  <p className="mt-0.5 text-[0.75rem] text-charcoal/50">
                    {item.role}
                  </p>
                </footer>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* FAQ */}
      <section className="border-t border-charcoal/8 bg-cream-dark px-6 py-16 md:px-10 md:py-20 lg:px-12 lg:py-24">
        <div className="mx-auto max-w-352">
          <div className="grid gap-10 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:gap-16">
            <div>
              <p className={EYEBROW}>FAQ</p>
              <h2 className="mt-3 font-display text-[1.85rem] leading-tight tracking-tight text-charcoal md:text-[2.25rem]">
                Common questions
              </h2>
              <p className="mt-4 text-[0.9375rem] leading-relaxed text-charcoal/65">
                Still unsure? Read the roster, browse case studies, or email{" "}
                <a
                  href="mailto:hello@crediblecreators.com"
                  className="font-medium text-forest hover:text-forest-dark"
                >
                  hello@crediblecreators.com
                </a>
                .
              </p>
              <div className="mt-8 hidden lg:block">
                <RepresentationApplyCta surface="light" />
              </div>
            </div>
            <RepresentationFaq items={FAQ} />
          </div>
        </div>
      </section>

      {/* Application form — Sandisk "Start your application" */}
      <section
        id="apply"
        className="scroll-mt-24 border-t border-charcoal/8 px-6 py-16 md:px-10 md:py-20 lg:px-12 lg:py-24"
      >
        <div className="mx-auto max-w-352">
          <div className="mx-auto max-w-2xl text-center">
            <p className={EYEBROW}>Start your application</p>
            <h2 className="mt-3 font-display text-[1.85rem] leading-tight tracking-tight text-charcoal md:text-[2.25rem]">
              Tell us about your audience
            </h2>
            <p className="mt-4 text-[0.9375rem] leading-relaxed text-charcoal/65">
              Complete the form below. We review submissions fortnightly and
              reply to every qualified application.
            </p>
          </div>
          <div className="mx-auto mt-10 max-w-2xl">
            <RepresentationApplicationForm />
          </div>

          <div className="mx-auto mt-16 max-w-xl border-t border-charcoal/8 pt-10 text-center md:mt-20 md:pt-12">
            <p className="font-display text-[1.35rem] leading-snug tracking-tight text-charcoal md:text-[1.5rem]">
              Your audience is already a business.
            </p>
            <p className="mt-2 text-[0.875rem] leading-relaxed text-charcoal/60 md:text-[0.9375rem]">
              Run it like one — with a team that understands B2B creators.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
