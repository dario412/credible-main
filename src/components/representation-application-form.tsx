"use client";

import Link from "next/link";
import { ArrowLeft, ArrowRight, Check } from "@phosphor-icons/react";
import { useActionState, useId, useRef, useState } from "react";

import {
  submitRepresentationApplication,
  type FormState,
} from "@/lib/actions/leads";

const initial: FormState = { ok: false, message: "" };

const STEPS = [
  { title: "About you", description: "Contact details and main channels" },
  { title: "More channels", description: "Anywhere else you publish" },
] as const;

const inputClass =
  "w-full rounded-sm border border-charcoal/15 bg-cream px-3 py-2 text-[0.8125rem] leading-snug text-charcoal outline-none transition-colors placeholder:text-charcoal/35 focus:border-forest focus:outline focus:outline-2 focus:outline-offset-[-2px] focus:outline-forest";
const labelClass =
  "block text-[0.625rem] font-medium tracking-[0.12em] text-charcoal/50 uppercase";

function Field({
  id,
  name,
  label,
  required,
  step,
  type = "text",
  autoComplete,
  placeholder,
  className,
}: {
  id: string;
  name: string;
  label: string;
  required?: boolean;
  step: 1 | 2;
  type?: string;
  autoComplete?: string;
  placeholder?: string;
  className?: string;
}) {
  return (
    <div className={className} data-step={step}>
      <label htmlFor={id} className={labelClass}>
        {label}
        {required ? " *" : ""}
      </label>
      <input
        id={id}
        name={name}
        type={type}
        required={required}
        autoComplete={autoComplete}
        placeholder={placeholder}
        className={`${inputClass} mt-1`}
      />
    </div>
  );
}

function StepIndicator({ step }: { step: 1 | 2 }) {
  return (
    <div className="flex items-center gap-2">
      {STEPS.map((item, index) => {
        const stepNumber = (index + 1) as 1 | 2;
        const isActive = stepNumber === step;
        const isComplete = stepNumber < step;

        return (
          <div key={item.title} className="flex flex-1 items-center gap-2">
            <span
              className={`inline-flex size-6 shrink-0 items-center justify-center rounded-full text-[0.6875rem] font-medium transition-colors ${
                isActive
                  ? "bg-forest text-cream"
                  : isComplete
                    ? "bg-forest/15 text-forest"
                    : "bg-charcoal/8 text-charcoal/40"
              }`}
              aria-hidden
            >
              {isComplete ? (
                <Check weight="bold" className="size-3" />
              ) : (
                stepNumber
              )}
            </span>
            <div className="min-w-0">
              <p
                className={`truncate text-[0.6875rem] font-medium tracking-[0.08em] uppercase ${
                  isActive ? "text-charcoal" : "text-charcoal/45"
                }`}
              >
                {item.title}
              </p>
            </div>
            {index < STEPS.length - 1 ? (
              <span
                className={`mx-1 hidden h-px flex-1 sm:block ${
                  isComplete ? "bg-forest/30" : "bg-charcoal/10"
                }`}
                aria-hidden
              />
            ) : null}
          </div>
        );
      })}
    </div>
  );
}

export function RepresentationApplicationForm() {
  const [state, action, pending] = useActionState(
    submitRepresentationApplication,
    initial,
  );
  const [step, setStep] = useState<1 | 2>(1);
  const formRef = useRef<HTMLFormElement>(null);
  const id = useId();

  function validateStep(targetStep: 1 | 2) {
    const form = formRef.current;
    if (!form) return false;

    const inputs = form.querySelectorAll<HTMLInputElement>(
      `[data-step="${targetStep}"] input`,
    );

    for (const input of inputs) {
      if (!input.checkValidity()) {
        input.reportValidity();
        return false;
      }
    }

    if (targetStep === 1) {
      const linkedin = form.querySelector<HTMLInputElement>(
        'input[name="linkedinUrl"]',
      );
      if (linkedin && !/linkedin\.com/i.test(linkedin.value.trim())) {
        linkedin.setCustomValidity("Enter a LinkedIn profile URL");
        linkedin.reportValidity();
        linkedin.setCustomValidity("");
        return false;
      }
    }

    return true;
  }

  function handleContinue() {
    if (validateStep(1)) {
      setStep(2);
    }
  }

  function handleFormSubmit(event: React.FormEvent<HTMLFormElement>) {
    if (step !== 2) {
      event.preventDefault();
      handleContinue();
    }
  }

  if (state.ok) {
    return (
      <div className="rounded-sm border border-charcoal/10 bg-[#FBF8F5] p-6 md:p-7">
        <span className="inline-flex size-9 items-center justify-center rounded-full bg-forest/10 text-forest">
          <Check weight="bold" className="size-4" aria-hidden />
        </span>
        <h3 className="mt-4 font-display text-[1.45rem] leading-tight tracking-tight text-charcoal">
          Application received
        </h3>
        <p className="mt-2 text-[0.875rem] leading-relaxed text-charcoal/65">
          {state.message} If your profile is a fit, a manager will reach out
          within two weeks.
        </p>
        <div className="mt-5 flex flex-col gap-2 sm:flex-row">
          <Link
            href="/roster"
            className="inline-flex items-center justify-center gap-2 rounded-sm bg-forest px-5 py-2.5 text-[0.8125rem] font-medium text-cream transition-colors hover:bg-forest-dark"
          >
            Browse the roster
            <ArrowRight weight="bold" className="size-3.5" aria-hidden />
          </Link>
          <Link
            href="/insights"
            className="inline-flex items-center justify-center rounded-sm border border-charcoal/15 px-5 py-2.5 text-[0.8125rem] font-medium text-charcoal transition-colors hover:border-charcoal/30"
          >
            Read field notes
          </Link>
        </div>
      </div>
    );
  }

  return (
    <form
      ref={formRef}
      action={action}
      onSubmit={handleFormSubmit}
      className="rounded-sm border border-charcoal/10 bg-white p-5 shadow-[0_12px_40px_rgba(28,26,23,0.06)] md:p-6"
    >
      <StepIndicator step={step} />

      <div className="mt-4 flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
        <p className="text-[0.68rem] font-medium tracking-[0.16em] text-charcoal/45 uppercase">
          Step {step} of {STEPS.length} · {STEPS[step - 1].title}
        </p>
        <p className="text-[0.75rem] text-charcoal/50">
          {step === 1 ? "Fields marked * are required." : "All fields optional."}
        </p>
      </div>

      <div className={step === 1 ? "mt-4 grid gap-3" : "sr-only"} aria-hidden={step !== 1}>
        <Field
          id={`${id}-name`}
          name="name"
          label="Full name"
          step={1}
          required
          autoComplete="name"
        />

        <div className="grid gap-3 sm:grid-cols-2">
          <Field
            id={`${id}-email`}
            name="email"
            label="Email address"
            step={1}
            type="email"
            required
            autoComplete="email"
          />
          <Field
            id={`${id}-phone`}
            name="phone"
            label="Phone number"
            step={1}
            type="tel"
            autoComplete="tel"
          />
        </div>

        <Field
          id={`${id}-linkedin`}
          name="linkedinUrl"
          label="LinkedIn URL"
          step={1}
          type="url"
          required
          placeholder="https://www.linkedin.com/in/…"
        />

        <div className="border-t border-charcoal/10 pt-3">
          <p className="text-[0.6875rem] font-medium tracking-[0.08em] text-charcoal/45 uppercase">
            Other channels (optional)
          </p>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            <Field
              id={`${id}-instagram`}
              name="instagramUrl"
              label="Instagram URL"
              step={1}
              type="url"
              placeholder="https://"
            />
            <Field
              id={`${id}-youtube`}
              name="youtubeUrl"
              label="YouTube URL"
              step={1}
              type="url"
              placeholder="https://"
            />
          </div>
          <p className="mt-2.5 text-[0.75rem] leading-relaxed text-charcoal/50">
            Step 2 covers TikTok, podcast, newsletter, X, and more if you use
            them.
          </p>
        </div>
      </div>

      <div className={step === 2 ? "mt-4 grid gap-3" : "hidden"} aria-hidden={step !== 2}>
          <Field
            id={`${id}-tiktok`}
            name="tiktokUrl"
            label="TikTok URL"
            step={2}
            type="url"
            placeholder="https://"
          />
          <Field
            id={`${id}-podcast`}
            name="podcastUrl"
            label="Podcast URL"
            step={2}
            type="url"
            placeholder="https://"
          />
          <Field
            id={`${id}-newsletter`}
            name="newsletterUrl"
            label="Substack / Newsletter URL"
            step={2}
            type="url"
            placeholder="https://"
          />
          <Field
            id={`${id}-x`}
            name="xUrl"
            label="X.com URL"
            step={2}
            type="url"
            placeholder="https://"
          />
          <Field
            id={`${id}-facebook`}
            name="facebookUrl"
            label="Facebook URL"
            step={2}
            type="url"
            placeholder="https://"
          />
          <Field
            id={`${id}-website`}
            name="websiteUrl"
            label="Personal or Business website URL"
            step={2}
            type="url"
            placeholder="https://"
          />
      </div>

      {state.message && !state.ok ? (
        <p className="mt-3 text-sm text-danger" role="alert">
          {state.message}
        </p>
      ) : null}

      <div className="mt-4 flex flex-col-reverse gap-2 sm:flex-row sm:items-center">
        {step === 2 ? (
          <button
            type="button"
            onClick={() => setStep(1)}
            disabled={pending}
            className="inline-flex items-center justify-center gap-2 rounded-sm border border-charcoal/15 px-5 py-2.5 text-[0.8125rem] font-medium text-charcoal transition-colors hover:border-charcoal/30 disabled:opacity-60"
          >
            <ArrowLeft weight="bold" className="size-3.5" aria-hidden />
            Back
          </button>
        ) : null}

        {step === 1 ? (
          <button
            type="button"
            onClick={handleContinue}
            className="inline-flex w-full items-center justify-center gap-2 rounded-sm bg-charcoal px-5 py-2.5 text-[0.8125rem] font-medium text-cream transition-colors hover:bg-charcoal/90 sm:ml-auto sm:w-auto"
          >
            Continue
            <ArrowRight weight="bold" className="size-3.5" aria-hidden />
          </button>
        ) : (
          <button
            type="submit"
            disabled={pending}
            className="inline-flex w-full items-center justify-center gap-2 rounded-sm bg-charcoal px-5 py-2.5 text-[0.8125rem] font-medium text-cream transition-colors hover:bg-charcoal/90 disabled:opacity-60 sm:ml-auto sm:w-auto"
          >
            {pending ? "Submitting…" : "Submit application"}
            <ArrowRight weight="bold" className="size-3.5" aria-hidden />
          </button>
        )}
      </div>

      {step === 2 ? (
        <p className="mt-2.5 text-[0.6875rem] leading-relaxed text-charcoal/45">
          By submitting, you agree we may contact you about representation. We
          don&apos;t share your details with brands without consent.
        </p>
      ) : null}
    </form>
  );
}
