import Link from "next/link";
import {
  Check,
  ClipboardText,
  Handshake,
  VideoCamera,
} from "@phosphor-icons/react/ssr";

import { RepresentationApplyCta } from "@/components/representation-apply-cta";

const EYEBROW =
  "text-[0.68rem] font-medium tracking-[0.18em] text-charcoal/45 uppercase";

const STEPS = [
  {
    icon: ClipboardText,
    phase: "Step 1 · ~5 minutes",
    title: "Submit your application",
    body: "Share where you publish, who follows you, and which formats you want to monetise. Link a profile and a few recent pieces — no deck, no fee.",
    outcome: "You're in the queue for the next fortnightly review.",
  },
  {
    icon: VideoCamera,
    phase: "Step 2 · Within 2 weeks",
    title: "Fit call with a manager",
    body: "Our talent team reads every application. Shortlisted creators get a 30-minute call to align on audience, commercial goals, and roster fit.",
    outcome: "A clear yes, no, or follow-up — never silence.",
  },
  {
    icon: Handshake,
    phase: "Step 3 · If aligned",
    title: "Onboard and take briefs",
    body: "We set representation terms, publish your roster profile, and start routing qualified inbound — partnerships, speaking, live events, and ambassador work.",
    outcome: "Deals scoped and priced for you. You keep the voice.",
  },
] as const;

const REASSURANCE = [
  "Free to apply — no upfront cost",
  "Selective roster, considered replies",
  "Operators only — B2B audiences",
] as const;

export function RepresentationHowItWorks() {
  return (
    <section className="border-y border-charcoal/8 bg-[#FBF8F5] px-6 py-16 md:px-10 md:py-20 lg:px-12 lg:py-24">
      <div className="mx-auto grid max-w-352 items-start gap-12 lg:grid-cols-[minmax(0,0.88fr)_minmax(0,1.12fr)] lg:gap-16 xl:gap-20">
        <div className="lg:sticky lg:top-28 lg:self-start">
          <p className={EYEBROW}>How it works</p>
          <h2 className="mt-3 font-display text-[1.85rem] leading-[1.1] tracking-tight text-charcoal md:text-[2.25rem]">
            From application to managed briefs
          </h2>
          <p className="mt-4 max-w-md text-[0.9375rem] leading-relaxed text-charcoal/65">
            A straight path — no portal login, no follower minimum on the form,
            no pay-to-apply. If your audience is B2B and your work is real, tell
            us in five minutes.
          </p>

          <ul className="mt-6 space-y-2.5">
            {REASSURANCE.map((item) => (
              <li
                key={item}
                className="flex items-start gap-2.5 text-[0.8125rem] leading-snug text-charcoal/70"
              >
                <Check
                  weight="bold"
                  className="mt-0.5 size-3.5 shrink-0 text-forest"
                  aria-hidden
                />
                {item}
              </li>
            ))}
          </ul>

          <div className="mt-8 hidden flex-col items-start gap-2 lg:flex">
            <RepresentationApplyCta surface="light">
              Start application
            </RepresentationApplyCta>
            <p className="text-[0.75rem] text-charcoal/45">
              Or{" "}
              <Link
                href="/roster"
                className="font-medium text-forest hover:text-forest-dark"
              >
                browse the roster
              </Link>{" "}
              first to see who we represent.
            </p>
          </div>
        </div>

        <ol className="border-t border-charcoal/12">
          {STEPS.map((step, index) => (
            <li
              key={step.title}
              className="relative border-b border-charcoal/12 py-8 md:py-10"
            >
              {index < STEPS.length - 1 ? (
                <span
                  aria-hidden
                  className="absolute top-[3.25rem] left-[0.6875rem] hidden h-[calc(100%-1.5rem)] w-px bg-charcoal/12 md:block"
                />
              ) : null}

              <div className="flex items-start gap-5 md:gap-6">
                <span className="relative flex size-6 shrink-0 items-center justify-center rounded-full border border-forest/30 bg-cream md:size-7">
                  <step.icon
                    weight="duotone"
                    className="size-3.5 text-forest md:size-4"
                    aria-hidden
                  />
                </span>

                <div className="min-w-0 flex-1">
                  <p className="text-[0.65rem] font-medium tracking-[0.14em] text-forest uppercase">
                    {step.phase}
                  </p>
                  <h3 className="mt-1.5 font-display text-[1.35rem] leading-snug tracking-tight text-charcoal md:text-[1.5rem]">
                    {step.title}
                  </h3>
                  <p className="mt-3 text-[0.875rem] leading-relaxed text-charcoal/60">
                    {step.body}
                  </p>
                  <p className="mt-4 inline-flex rounded-sm border border-forest/15 bg-forest/5 px-3 py-2 text-[0.8125rem] leading-snug text-charcoal/75">
                    <span className="font-medium text-forest">Outcome · </span>
                    {step.outcome}
                  </p>
                </div>
              </div>
            </li>
          ))}
        </ol>

        <div className="flex flex-col items-start gap-2 lg:hidden">
          <RepresentationApplyCta surface="light" className="w-full sm:w-auto">
            Start application
          </RepresentationApplyCta>
          <p className="text-[0.75rem] text-charcoal/45">
            Or{" "}
            <Link
              href="/roster"
              className="font-medium text-forest hover:text-forest-dark"
            >
              browse the roster
            </Link>{" "}
            first.
          </p>
        </div>
      </div>
    </section>
  );
}
