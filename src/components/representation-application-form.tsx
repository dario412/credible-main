"use client";

import Link from "next/link";
import { ArrowRight, Check } from "@phosphor-icons/react";
import { useActionState, useId, useRef } from "react";

import {
  submitRepresentationApplication,
  type FormState,
} from "@/lib/actions/leads";

const initial: FormState = { ok: false, message: "" };

const inputClass =
  "w-full rounded-sm border border-charcoal/15 bg-cream px-3 py-2 text-[0.8125rem] leading-snug text-charcoal outline-none transition-colors placeholder:text-charcoal/35 focus:border-forest focus:outline focus:outline-2 focus:outline-offset-[-2px] focus:outline-forest";
const labelClass =
  "block text-[0.625rem] font-medium tracking-[0.12em] text-charcoal/50 uppercase";

const PHONE_COUNTRY_CODES = [
  { code: "+44", label: "UK +44" },
  { code: "+1", label: "US +1" },
  { code: "+353", label: "IE +353" },
  { code: "+61", label: "AU +61" },
  { code: "+49", label: "DE +49" },
  { code: "+33", label: "FR +33" },
  { code: "+34", label: "ES +34" },
  { code: "+39", label: "IT +39" },
  { code: "+31", label: "NL +31" },
  { code: "+46", label: "SE +46" },
  { code: "+41", label: "CH +41" },
  { code: "+971", label: "AE +971" },
  { code: "+91", label: "IN +91" },
  { code: "+65", label: "SG +65" },
  { code: "+852", label: "HK +852" },
] as const;

function Field({
  id,
  name,
  label,
  required,
  type = "text",
  autoComplete,
  placeholder,
  className,
}: {
  id: string;
  name: string;
  label: string;
  required?: boolean;
  type?: string;
  autoComplete?: string;
  placeholder?: string;
  className?: string;
}) {
  return (
    <div className={className}>
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

export function RepresentationApplicationForm() {
  const [state, action, pending] = useActionState(
    submitRepresentationApplication,
    initial,
  );
  const formRef = useRef<HTMLFormElement>(null);
  const id = useId();

  function handleFormSubmit(event: React.FormEvent<HTMLFormElement>) {
    const form = formRef.current;
    if (!form) return;

    const linkedin = form.querySelector<HTMLInputElement>(
      'input[name="linkedinUrl"]',
    );
    if (linkedin && !/linkedin\.com/i.test(linkedin.value.trim())) {
      event.preventDefault();
      linkedin.setCustomValidity("Enter a LinkedIn profile URL");
      linkedin.reportValidity();
      linkedin.setCustomValidity("");
    }
  }

  if (state.ok) {
    return (
      <div className="h-full rounded-sm border border-charcoal/10 bg-[#FBF8F5] p-6 md:p-7">
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
      className="flex h-full flex-col rounded-sm border border-charcoal/10 bg-white p-5 shadow-[0_12px_40px_rgba(28,26,23,0.06)] md:p-6"
    >
      <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
        <p className="text-[0.68rem] font-medium tracking-[0.16em] text-charcoal/45 uppercase">
          Apply for representation
        </p>
        <p className="text-[0.75rem] text-charcoal/50">
          Fields marked * are required.
        </p>
      </div>

      <div className="mt-4 grid flex-1 gap-3 content-start">
        <Field
          id={`${id}-name`}
          name="name"
          label="Full name"
          required
          autoComplete="name"
        />

        <div className="grid gap-3 sm:grid-cols-2">
          <Field
            id={`${id}-email`}
            name="email"
            label="Email address"
            type="email"
            required
            autoComplete="email"
          />
          <div>
            <label htmlFor={`${id}-phone`} className={labelClass}>
              Phone number
            </label>
            <div className="mt-1 flex">
              <select
                id={`${id}-phone-code`}
                name="phoneCountryCode"
                defaultValue="+44"
                aria-label="Country code"
                className={`${inputClass} w-[5.75rem] shrink-0 rounded-r-none border-r-0 pr-1 pl-2`}
              >
                {PHONE_COUNTRY_CODES.map(({ code, label }) => (
                  <option key={code} value={code}>
                    {label}
                  </option>
                ))}
              </select>
              <input
                id={`${id}-phone`}
                name="phone"
                type="tel"
                autoComplete="tel-national"
                placeholder="7700 900123"
                className={`${inputClass} min-w-0 flex-1 rounded-l-none`}
              />
            </div>
          </div>
        </div>

        <Field
          id={`${id}-linkedin`}
          name="linkedinUrl"
          label="LinkedIn URL"
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
              type="url"
              placeholder="https://"
            />
            <Field
              id={`${id}-youtube`}
              name="youtubeUrl"
              label="YouTube URL"
              type="url"
              placeholder="https://"
            />
            <Field
              id={`${id}-tiktok`}
              name="tiktokUrl"
              label="TikTok URL"
              type="url"
              placeholder="https://"
            />
            <Field
              id={`${id}-podcast`}
              name="podcastUrl"
              label="Podcast URL"
              type="url"
              placeholder="https://"
            />
            <Field
              id={`${id}-newsletter`}
              name="newsletterUrl"
              label="Substack / Newsletter URL"
              type="url"
              placeholder="https://"
            />
            <Field
              id={`${id}-x`}
              name="xUrl"
              label="X.com URL"
              type="url"
              placeholder="https://"
            />
            <Field
              id={`${id}-facebook`}
              name="facebookUrl"
              label="Facebook URL"
              type="url"
              placeholder="https://"
            />
            <Field
              id={`${id}-website`}
              name="websiteUrl"
              label="Personal or Business website URL"
              type="url"
              placeholder="https://"
            />
          </div>
        </div>
      </div>

      {state.message && !state.ok ? (
        <p className="mt-3 text-sm text-danger" role="alert">
          {state.message}
        </p>
      ) : null}

      <div className="mt-4 shrink-0">
        <button
          type="submit"
          disabled={pending}
          className="inline-flex w-full items-center justify-center gap-2 rounded-sm bg-charcoal px-5 py-2.5 text-[0.8125rem] font-medium text-cream transition-colors hover:bg-charcoal/90 disabled:opacity-60"
        >
          {pending ? "Submitting…" : "Submit application"}
          <ArrowRight weight="bold" className="size-3.5" aria-hidden />
        </button>
        <p className="mt-2.5 text-[0.6875rem] leading-relaxed text-charcoal/45">
          By submitting, you agree we may contact you about representation. We
          don&apos;t share your details with brands without consent.
        </p>
      </div>
    </form>
  );
}
