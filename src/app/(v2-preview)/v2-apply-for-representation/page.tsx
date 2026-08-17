import { V2ApplyForm } from "@/components/v2/v2-apply-form";
import { V2Chrome } from "@/components/v2/v2-chrome";
import {
  V2AsideCard,
  V2Eyebrow,
  V2GhostLink,
  V2PageHero,
  V2PrimaryLink,
} from "@/components/v2/v2-page-ui";
import { createMetadata } from "@/lib/seo";
import { V2_APPLY } from "@/lib/v2-links";

export const dynamic = "force-dynamic";

export const metadata = createMetadata({
  title: "Apply for representation v2",
  path: V2_APPLY,
  noIndex: true,
  description:
    "Apply to join Credible Creators — commercial management for founders, operators, and expert voices with real B2B audiences.",
});

const STATS = [
  {
    value: "24",
    accent: false,
    title: "signed expert voices",
    note: "Selective enough to keep deal quality high.",
  },
  {
    value: "4",
    accent: true,
    title: "commercial formats",
    note: "Partnerships, speaking, events, and ambassador work.",
  },
  {
    value: "14d",
    accent: false,
    title: "typical review window",
    note: "Qualified applications get a clear next step quickly.",
  },
  {
    value: "1:1",
    accent: false,
    title: "named manager model",
    note: "A real operator handles fit, pricing, and scope.",
  },
];

const STEPS = [
  {
    label: "Step 01 · 5 min",
    title: "Submit the essentials",
    body: "Audience, platform, expertise, formats, and recent work. No deck, no fee, no portal login.",
    outcome: "Outcome: queued for review",
  },
  {
    label: "Step 02 · 14 days",
    title: "Get a human read",
    body: "A manager reviews your fit against audience, category authority, and commercial potential.",
    outcome: "Outcome: yes, no, or more context",
  },
  {
    label: "Step 03 · If aligned",
    title: "Start representation",
    body: "Terms, roster profile, deal packaging, and qualified inbound handled by a named manager.",
    outcome: "Outcome: managed commercial work",
  },
];

const PERKS = [
  {
    title: "Managed inbound",
    body: "Filter briefs, negotiate scope, and keep poor-fit asks off your calendar.",
  },
  {
    title: "Brand partnerships",
    body: "Series, newsletters, and considered integrations built around your voice.",
  },
  {
    title: "Speaking & events",
    body: "Keynotes, firesides, and hosted programming backed by PepTalk infrastructure.",
  },
  {
    title: "Commercial strategy",
    body: "Pricing, packaging, and format mix for repeat revenue instead of ad hoc gigs.",
  },
];

const FAQS = [
  {
    q: "Is there a follower minimum?",
    a: "No fixed threshold. We care about professional trust, audience relevance, and evidence of category authority.",
  },
  {
    q: "What does representation cost?",
    a: "There is no fee to apply. Agency terms are discussed on a fit call before anything is signed.",
  },
  {
    q: "Can I keep existing partners?",
    a: "Usually, yes. We ask for transparency and only discuss exclusivity where a specific deal requires it.",
  },
];

export default function V2ApplyPage() {
  return (
    <V2Chrome>
      <V2PageHero
        badge="Applications reviewed every two weeks"
        live
        headline="Turn your expert audience into managed commercial work."
        subhead="Credible represents founders, operators, investors, and specialist voices with B2B audiences. You keep the voice. We qualify inbound, price opportunities, negotiate scope, and manage delivery."
        actions={
          <div className="flex flex-col gap-6">
            <div className="flex flex-wrap items-center gap-3.5">
              <V2PrimaryLink href="#apply">Start the 5-minute application</V2PrimaryLink>
              <V2GhostLink href="/roster">See who we represent</V2GhostLink>
            </div>
            <div className="flex flex-wrap gap-6 text-[14px] leading-[21px] text-[var(--v2-lichen)]">
              <span>No fee to apply</span>
              <span>Clear response</span>
              <span>Selective roster</span>
            </div>
          </div>
        }
        aside={
          <V2AsideCard
            label="Fit check"
            title="Is your audience already buying from your judgment?"
          >
            {[
              "You publish, speak, host, or advise in a professional category.",
              "Brands could evaluate your point of view before they brief you.",
              "Commercial opportunities should be scoped, priced, and protected.",
            ].map((item, index) => (
              <div
                key={item}
                className="grid grid-cols-[34px_1fr] gap-3 border-b border-[var(--v2-rule-evergreen)] py-[18px] last:border-b-0"
              >
                <p className="text-[20px] leading-6 font-semibold text-[var(--v2-snow)]">
                  0{index + 1}
                </p>
                <p className="text-[15px] leading-[23px] text-[var(--v2-on-dark)]">
                  {item}
                </p>
              </div>
            ))}
          </V2AsideCard>
        }
      />

      <section className="bg-[var(--v2-snow)] pt-28 pb-[118px]">
        <div className="v2-container flex flex-col gap-[74px]">
          <div className="grid items-end gap-12 lg:grid-cols-[minmax(0,760px)_minmax(320px,408px)] lg:gap-20">
            <h2 className="v2-display max-w-[760px] text-[clamp(2.2rem,4vw,4rem)] leading-[1.03] text-[var(--v2-timberline)]">
              Authority is easier to sell{" "}
              <span className="text-[var(--v2-evergreen)]">when it is managed.</span>
            </h2>
            <div className="border-t border-[var(--v2-border)] pt-[26px]">
              <p className="text-[11px] leading-[14px] font-bold tracking-[0.08em] text-[var(--v2-ember)] uppercase">
                Why this converts
              </p>
              <p className="mt-3.5 text-[18px] leading-7 font-medium text-[var(--v2-evergreen)]">
                The section answers the first objections before the form: fit, formats, timing, and how hands-on representation really is.
              </p>
            </div>
          </div>
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {STATS.map((stat) => (
              <div
                key={stat.title}
                className="flex min-h-[190px] flex-col border-t border-[var(--v2-rule-light)] pt-7 pr-8"
              >
                <p
                  className={`v2-display text-[76px] leading-none tracking-[-0.02em] ${stat.accent ? "text-[var(--v2-ember)]" : "text-[var(--v2-timberline)]"}`}
                >
                  {stat.value}
                </p>
                <p className="mt-[18px] max-w-[250px] text-[15px] leading-[22px] font-semibold text-[var(--v2-timberline)]">
                  {stat.title}
                </p>
                <p className="mt-2 max-w-[250px] text-[13px] leading-5 text-[var(--v2-lichen)]">
                  {stat.note}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[var(--v2-cream)] pb-[150px]">
        <div className="v2-container grid items-start gap-12 lg:grid-cols-[440px_1fr] lg:gap-24">
          <div className="flex flex-col gap-[22px]">
            <V2Eyebrow>Self qualify</V2Eyebrow>
            <h2 className="v2-display text-[32px] leading-10 tracking-[-0.02em] text-[var(--v2-timberline)]">
              Built for expert voices brands already trust.
            </h2>
            <p className="text-[18px] leading-[30px] text-[var(--v2-lichen)]">
              The best applicants have authority in a category, not just attention. This page makes that distinction obvious before someone reaches the form.
            </p>
          </div>
          <div className="grid gap-5 md:grid-cols-2">
            <div className="flex flex-col gap-[18px] rounded-[16px] border border-[var(--v2-rule-light)] bg-[var(--v2-glacier)] p-7 shadow-[0_1px_2px_rgba(14,26,20,0.06),0_16px_40px_rgba(14,26,20,0.08)]">
              <p className="text-[15px] leading-[22px] font-bold text-[var(--v2-timberline)]">
                Likely a fit
              </p>
              {[
                "B2B audience of buyers, builders, or decision-makers",
                "Consistent body of work brands can evaluate",
                "Interested in repeat commercial work, not one-off posts",
              ].map((item) => (
                <div key={item} className="grid grid-cols-[24px_1fr] items-start gap-3">
                  <span className="text-[15px] leading-6 text-[var(--v2-ember)]">✓</span>
                  <p className="text-[15px] leading-6 text-[var(--v2-evergreen-deep)]">{item}</p>
                </div>
              ))}
            </div>
            <div className="flex flex-col gap-[18px] rounded-[16px] border border-[var(--v2-rule-light)] bg-[var(--v2-snow)] p-7 shadow-[0_1px_2px_rgba(14,26,20,0.06),0_16px_40px_rgba(14,26,20,0.08)]">
              <p className="text-[15px] leading-[22px] font-bold text-[var(--v2-timberline)]">
                Probably not a fit
              </p>
              {[
                "Consumer entertainment or lifestyle-first reach",
                "No consistent publishing, speaking, or hosting yet",
                "Looking only for a directory listing or passive discovery",
              ].map((item) => (
                <div key={item} className="grid grid-cols-[24px_1fr] items-start gap-3">
                  <span className="text-[15px] leading-6 text-[var(--v2-lichen)]">—</span>
                  <p className="text-[15px] leading-6 text-[var(--v2-lichen)]">{item}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[var(--v2-timberline)] py-[130px]">
        <div className="v2-container flex flex-col gap-[54px]">
          <div className="grid items-end gap-10 lg:grid-cols-[1fr_460px] lg:gap-[90px]">
            <h2 className="v2-display text-[clamp(2.2rem,4vw,4rem)] leading-[1.03] text-[var(--v2-snow)]">
              A straight path from application to managed briefs.
            </h2>
            <p className="text-[18px] leading-[30px] text-[var(--v2-on-dark)]">
              Reduce uncertainty by showing time, action, and outcome for each step before asking for detailed information.
            </p>
          </div>
          <div className="grid overflow-hidden rounded-[16px] border border-[var(--v2-rule-evergreen)] bg-[var(--v2-rule-evergreen)] md:grid-cols-3">
            {STEPS.map((step) => (
              <div
                key={step.title}
                className="flex flex-col gap-[22px] bg-[var(--v2-surface)] p-8"
              >
                <p className="text-[13px] leading-4 font-semibold tracking-[0.08em] text-[var(--v2-snow)] uppercase">
                  {step.label}
                </p>
                <p className="text-[26px] leading-8 font-semibold text-[var(--v2-snow)]">
                  {step.title}
                </p>
                <p className="text-[15px] leading-[25px] text-[var(--v2-on-dark)]">
                  {step.body}
                </p>
                <p className="mt-auto text-[13px] leading-5 text-[var(--v2-on-dark-muted)]">
                  {step.outcome}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[var(--v2-snow)] py-[150px]">
        <div className="v2-container grid items-start gap-16 lg:grid-cols-[460px_1fr] lg:gap-[100px]">
          <div className="flex flex-col gap-[22px]">
            <V2Eyebrow>What you get</V2Eyebrow>
            <h2 className="v2-display text-[clamp(2.2rem,4vw,4rem)] leading-[1.03] text-[var(--v2-timberline)]">
              Representation that protects the work and grows the business.
            </h2>
            <p className="text-[18px] leading-[30px] text-[var(--v2-lichen)]">
              The offer is deliberately concrete: fewer vague promises, more explicit management value.
            </p>
          </div>
          <div className="grid gap-[18px] sm:grid-cols-2">
            {PERKS.map((perk) => (
              <div key={perk.title} className="border-t border-[var(--v2-rule-light)] p-[26px]">
                <p className="text-[22px] leading-7 font-semibold text-[var(--v2-timberline)]">
                  {perk.title}
                </p>
                <p className="mt-3 text-[15px] leading-[25px] text-[var(--v2-lichen)]">
                  {perk.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="apply" className="scroll-mt-28 bg-[var(--v2-snow)] pb-[150px]">
        <div className="v2-container grid items-start gap-8 lg:grid-cols-[1fr_408px]">
          <V2ApplyForm />
          <aside className="flex flex-col gap-7 rounded-[16px] border border-[var(--v2-rule-light)] bg-[var(--v2-glacier)] p-[30px] shadow-[0_1px_2px_rgba(14,26,20,0.06),0_16px_40px_rgba(14,26,20,0.08)]">
            <div>
              <V2Eyebrow>What happens next</V2Eyebrow>
              <p className="v2-display mt-3 text-[32px] leading-10 tracking-[-0.02em] text-[var(--v2-timberline)]">
                You will know where you stand.
              </p>
            </div>
            {[
              "A manager checks audience fit and commercial readiness.",
              "Qualified applicants get a fit call, not a generic sequence.",
              "If it is not right, the response is clear so you can move on.",
            ].map((item, index) => (
              <div
                key={item}
                className="grid grid-cols-[26px_1fr] gap-3.5 border-t border-[var(--v2-rule-light)] py-[18px]"
              >
                <p className="text-[16px] leading-5 text-[var(--v2-ember)]">0{index + 1}</p>
                <p className="text-[15px] leading-6 text-[var(--v2-evergreen-deep)]">{item}</p>
              </div>
            ))}
          </aside>
        </div>
      </section>

      <section className="bg-[var(--v2-glacier)] py-[130px]">
        <div className="v2-container grid items-start gap-16 lg:grid-cols-[430px_1fr] lg:gap-[110px]">
          <div>
            <V2Eyebrow>FAQ</V2Eyebrow>
            <h2 className="v2-display mt-3.5 text-[clamp(2.2rem,4vw,4rem)] leading-[1.03] text-[var(--v2-timberline)]">
              Common reasons people hesitate.
            </h2>
            <p className="mt-6 text-[18px] leading-[30px] text-[var(--v2-lichen)]">
              Answer objections close to the form instead of sending motivated applicants away to find clarity.
            </p>
          </div>
          <div className="border-t border-[var(--v2-rule-glacier)]">
            {FAQS.map((item) => (
              <div
                key={item.q}
                className="grid grid-cols-[1fr_28px] gap-6 border-b border-[var(--v2-rule-glacier)] py-[26px]"
              >
                <div>
                  <p className="text-[20px] leading-7 font-semibold text-[var(--v2-timberline)]">
                    {item.q}
                  </p>
                  <p className="mt-2.5 text-[15px] leading-[25px] text-[var(--v2-lichen)]">
                    {item.a}
                  </p>
                </div>
                <p className="text-[24px] leading-[30px] text-[var(--v2-ember)]">+</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </V2Chrome>
  );
}
