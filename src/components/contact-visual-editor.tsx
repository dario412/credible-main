"use client";

import Link from "next/link";
import { ArrowUpRight } from "@phosphor-icons/react";
import { useEffect, useId, useRef, useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";

import { EditableHit } from "@/components/editable-hit";
import { MediaField } from "@/components/media-library";
import { Button, Field, TextArea, TextInput } from "@/components/ui";
import {
  emptyContactChannel,
  emptyContactLogo,
  emptyContactSocial,
  emptyContactStep,
  type ContactPageSections,
} from "@/lib/contact-page";
import { TRUSTED_BY_LOGO_HINT } from "@/lib/trusted-by";

const EYEBROW =
  "text-[0.7rem] font-medium tracking-[0.16em] text-charcoal/45 uppercase";

type ContactEditTarget =
  | "hero"
  | "briefedBy"
  | "nextSteps"
  | "channels"
  | "office"
  | "phone"
  | "socials";

function targetTitle(target: ContactEditTarget): string {
  const map: Record<ContactEditTarget, string> = {
    hero: "Page intro",
    briefedBy: "Briefed-by logos",
    nextSteps: "What happens next",
    channels: "Email channels",
    office: "London office",
    phone: "By phone",
    socials: "Follow along",
  };
  return map[target];
}

function ContactHero({
  sections,
  editing,
  selected,
  onSelect,
}: {
  sections: ContactPageSections;
  editing: boolean;
  selected: ContactEditTarget | null;
  onSelect: (target: ContactEditTarget) => void;
}) {
  const { headline, headlineAccent, subhead } = sections.hero;

  return (
    <div className="mx-auto max-w-3xl text-center">
      <EditableHit
        active={editing}
        selected={selected === "hero"}
        onSelect={() => onSelect("hero")}
        label="Page intro"
        block
        ringOffset="ring-offset-cream"
      >
        <h1 className="font-display text-[2.6rem] leading-[1.06] tracking-tight text-charcoal sm:text-[3.15rem] md:text-[3.5rem]">
          {headline.trim() ? (
            <>
              {headline}
              {headlineAccent.trim() ? (
                <>
                  {" "}
                  <span className="text-forest">{headlineAccent}</span>
                </>
              ) : null}
            </>
          ) : headlineAccent.trim() ? (
            <span className="text-forest">{headlineAccent}</span>
          ) : editing ? (
            "Contact headline"
          ) : null}
        </h1>
        {subhead.trim() || editing ? (
          <p className="mx-auto mt-5 max-w-xl text-[0.95rem] leading-relaxed text-charcoal/65 md:text-base">
            {subhead.trim() || (editing ? "Supporting line…" : null)}
          </p>
        ) : null}
      </EditableHit>
    </div>
  );
}

function ContactBriefedBy({
  sections,
  editing,
  selected,
  onSelect,
}: {
  sections: ContactPageSections;
  editing: boolean;
  selected: ContactEditTarget | null;
  onSelect: (target: ContactEditTarget) => void;
}) {
  const logos = sections.briefedBy.logos.filter((logo) => logo.src.trim());
  const showBriefedBy =
    editing || sections.briefedBy.label.trim() || logos.length > 0;

  if (!showBriefedBy) return null;

  return (
    <EditableHit
      active={editing}
      selected={selected === "briefedBy"}
      onSelect={() => onSelect("briefedBy")}
      label="Briefed-by logos"
      block
      ringOffset="ring-offset-cream"
    >
      <div className="rounded-sm bg-charcoal p-6 md:p-7">
        {sections.briefedBy.label.trim() ? (
          <p className="text-[0.7rem] font-medium tracking-[0.16em] text-cream/55 uppercase">
            {sections.briefedBy.label}
          </p>
        ) : editing ? (
          <p className="text-[0.7rem] font-medium tracking-[0.16em] text-cream/35 uppercase">
            Briefed-by label
          </p>
        ) : null}
        {logos.length > 0 ? (
          <ul
            className={`grid grid-cols-3 items-center gap-x-6 gap-y-5 ${
              sections.briefedBy.label.trim() || editing ? "mt-5" : ""
            }`}
          >
            {logos.map((logo) => {
              const image = (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={logo.src}
                  alt={logo.name}
                  className="h-5 w-auto max-w-full object-contain object-left brightness-0 invert md:h-5.5"
                />
              );
              return (
                <li key={`${logo.name}-${logo.src}`}>
                  {logo.href.trim() && !editing ? (
                    <a
                      href={logo.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block transition-opacity hover:opacity-80"
                    >
                      {image}
                    </a>
                  ) : (
                    image
                  )}
                </li>
              );
            })}
          </ul>
        ) : editing ? (
          <p className="mt-5 text-[0.8125rem] text-cream/45">
            Add logos in the editor…
          </p>
        ) : null}
      </div>
    </EditableHit>
  );
}

function ContactNextSteps({
  sections,
  editing,
  selected,
  onSelect,
}: {
  sections: ContactPageSections;
  editing: boolean;
  selected: ContactEditTarget | null;
  onSelect: (target: ContactEditTarget) => void;
}) {
  const steps = sections.nextSteps.steps.filter(
    (step) => step.title.trim() || step.body.trim(),
  );
  const showNextSteps =
    editing ||
    sections.nextSteps.eyebrow.trim() ||
    steps.length > 0 ||
    sections.nextSteps.footnote.trim() ||
    sections.nextSteps.browseLabel.trim() ||
    sections.nextSteps.emailLabel.trim();

  if (!showNextSteps) return null;

  return (
    <EditableHit
      active={editing}
      selected={selected === "nextSteps"}
      onSelect={() => onSelect("nextSteps")}
      label="What happens next"
      block
      className="h-full"
      ringOffset="ring-offset-cream"
    >
      <div className="flex h-full flex-col rounded-sm border border-charcoal/10 bg-[#FBF8F5] p-6 md:p-7">
            {sections.nextSteps.eyebrow.trim() ? (
              <p className="text-[0.7rem] font-medium tracking-[0.16em] text-charcoal/45 uppercase">
                {sections.nextSteps.eyebrow}
              </p>
            ) : editing ? (
              <p className="text-[0.7rem] font-medium tracking-[0.16em] text-charcoal/30 uppercase">
                What happens next
              </p>
            ) : null}
            {steps.length > 0 ? (
              <ol
                className={
                  sections.nextSteps.eyebrow.trim() || editing
                    ? "mt-6"
                    : undefined
                }
              >
                {steps.map((step, index) => (
                  <li
                    key={`${index}-${step.title}`}
                    className="relative flex gap-4 pb-6 last:pb-0"
                  >
                    {index < steps.length - 1 ? (
                      <span
                        aria-hidden
                        className="absolute top-7 bottom-0 left-2.75 w-px bg-charcoal/12"
                      />
                    ) : null}
                    <span className="relative inline-flex size-6 shrink-0 items-center justify-center rounded-full border border-forest/25 bg-forest/8 font-display text-[0.6875rem] leading-none text-forest">
                      {index + 1}
                    </span>
                    <div className="-mt-1">
                      {step.title.trim() ? (
                        <p className="font-display text-[1.0625rem] leading-snug tracking-tight text-charcoal">
                          {step.title}
                        </p>
                      ) : null}
                      {step.body.trim() ? (
                        <p
                          className={`text-[0.8125rem] leading-relaxed text-charcoal/60 ${
                            step.title.trim() ? "mt-1.5" : ""
                          }`}
                        >
                          {step.body}
                        </p>
                      ) : null}
                    </div>
                  </li>
                ))}
              </ol>
            ) : editing ? (
              <p className="mt-6 text-[0.8125rem] text-charcoal/45">
                Add steps in the editor…
              </p>
            ) : null}

            {sections.nextSteps.footnote.trim() ||
            sections.nextSteps.browseLabel.trim() ||
            sections.nextSteps.emailLabel.trim() ||
            editing ? (
              <p
                className={`mt-auto border-t border-charcoal/8 pt-5 text-[0.8125rem] leading-relaxed text-charcoal/60 ${
                  steps.length > 0 ||
                  sections.nextSteps.eyebrow.trim() ||
                  editing
                    ? "mt-6"
                    : ""
                }`}
              >
                {sections.nextSteps.footnote.trim()
                  ? `${sections.nextSteps.footnote} `
                  : null}
                {sections.nextSteps.browseLabel.trim() ? (
                  editing ? (
                    <span className="font-medium text-forest">
                      {sections.nextSteps.browseLabel}
                    </span>
                  ) : (
                    <Link
                      href={sections.nextSteps.browseHref.trim() || "/roster"}
                      className="font-medium text-forest transition-colors hover:text-forest-dark"
                    >
                      {sections.nextSteps.browseLabel}
                    </Link>
                  )
                ) : null}
                {sections.nextSteps.browseLabel.trim() &&
                sections.nextSteps.emailLabel.trim()
                  ? " · "
                  : null}
                {sections.nextSteps.emailLabel.trim() ? (
                  editing ? (
                    <span className="font-medium text-forest">
                      {sections.nextSteps.emailLabel}
                    </span>
                  ) : (
                    <a
                      href={`mailto:${sections.nextSteps.email.trim() || "hello@crediblecreators.com"}`}
                      className="font-medium text-forest transition-colors hover:text-forest-dark"
                    >
                      {sections.nextSteps.emailLabel}
                    </a>
                  )
                ) : null}
              </p>
            ) : null}
          </div>
        </EditableHit>
  );
}

function ContactFooter({
  sections,
  editing,
  selected,
  onSelect,
}: {
  sections: ContactPageSections;
  editing: boolean;
  selected: ContactEditTarget | null;
  onSelect: (target: ContactEditTarget) => void;
}) {
  const { footer } = sections;
  const channels = footer.channels.filter(
    (channel) =>
      channel.label.trim() || channel.address.trim() || channel.body.trim(),
  );
  const socials = footer.socials.items.filter(
    (item) => item.label.trim() || item.handle.trim() || item.href.trim(),
  );
  const showOffice =
    editing ||
    footer.office.eyebrow.trim() ||
    footer.office.title.trim() ||
    footer.office.body.trim();
  const showPhone =
    editing ||
    footer.phone.eyebrow.trim() ||
    footer.phone.number.trim() ||
    footer.phone.body.trim();
  const showSocials =
    editing || footer.socials.eyebrow.trim() || socials.length > 0;
  const showChannels = editing || channels.length > 0;
  const showFooter =
    showChannels || showOffice || showPhone || showSocials;

  if (!showFooter) return null;

  return (
    <section className="mt-16 border-t border-charcoal/10 pt-12 md:mt-20 md:pt-14">
      {showChannels ? (
        <EditableHit
          active={editing}
          selected={selected === "channels"}
          onSelect={() => onSelect("channels")}
          label="Email channels"
          block
          ringOffset="ring-offset-cream"
        >
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {channels.map((channel, index) =>
              editing ? (
                <div
                  key={`channel-${index}-${channel.address}`}
                  className="flex flex-col rounded-sm border border-charcoal/10 bg-[#FBF8F5] p-5 md:p-6"
                >
                  {channel.label.trim() ? (
                    <span className={EYEBROW}>{channel.label}</span>
                  ) : (
                    <span className={`${EYEBROW} text-charcoal/30`}>
                      Channel label
                    </span>
                  )}
                  <span className="mt-4 font-display text-[1.15rem] leading-tight tracking-tight text-charcoal md:text-[1.25rem]">
                    {channel.address.trim() || "email@company.com"}
                  </span>
                  {channel.body.trim() ? (
                    <span className="mt-2.5 text-[0.8125rem] leading-relaxed text-charcoal/55">
                      {channel.body}
                    </span>
                  ) : null}
                </div>
              ) : (
                <a
                  key={`channel-${index}-${channel.address}`}
                  href={`mailto:${channel.address}`}
                  className="group flex flex-col rounded-sm border border-charcoal/10 bg-[#FBF8F5] p-5 transition-colors hover:border-forest/45 md:p-6"
                >
                  <span className="flex items-center justify-between gap-3">
                    <span className={EYEBROW}>{channel.label}</span>
                    <ArrowUpRight
                      weight="bold"
                      aria-hidden
                      className="size-3 shrink-0 text-charcoal/25 transition-colors group-hover:text-forest"
                    />
                  </span>
                  <span className="mt-4 font-display text-[1.15rem] leading-tight tracking-tight text-charcoal transition-colors group-hover:text-forest md:text-[1.25rem]">
                    {channel.address}
                  </span>
                  <span className="mt-2.5 text-[0.8125rem] leading-relaxed text-charcoal/55">
                    {channel.body}
                  </span>
                </a>
              ),
            )}
            {editing && channels.length === 0 ? (
              <p className="rounded-sm border border-dashed border-charcoal/20 px-4 py-6 text-sm text-charcoal/45">
                Add email channels in the editor…
              </p>
            ) : null}
          </div>
        </EditableHit>
      ) : null}

      {showOffice || showPhone || showSocials ? (
        <div
          className={
            showChannels ? "mt-4 grid gap-4 lg:grid-cols-3" : "grid gap-4 lg:grid-cols-3"
          }
        >
          {showOffice ? (
            <EditableHit
              active={editing}
              selected={selected === "office"}
              onSelect={() => onSelect("office")}
              label="London office"
              block
              ringOffset="ring-offset-cream"
            >
              <div className="rounded-sm border border-charcoal/10 p-5 md:p-6">
                {footer.office.eyebrow.trim() ? (
                  <p className={EYEBROW}>{footer.office.eyebrow}</p>
                ) : editing ? (
                  <p className={`${EYEBROW} text-charcoal/30`}>Office eyebrow</p>
                ) : null}
                {footer.office.title.trim() ? (
                  <p className="mt-4 font-display text-[1.15rem] leading-snug tracking-tight text-charcoal">
                    {footer.office.title}
                  </p>
                ) : editing ? (
                  <p className="mt-4 font-display text-[1.15rem] text-charcoal/35">
                    Company name
                  </p>
                ) : null}
                {footer.office.body.trim() ? (
                  <p className="mt-1.5 text-[0.8125rem] leading-relaxed text-charcoal/55">
                    {footer.office.body}
                  </p>
                ) : editing ? (
                  <p className="mt-1.5 text-[0.8125rem] text-charcoal/35">
                    Address
                  </p>
                ) : null}
              </div>
            </EditableHit>
          ) : null}

          {showPhone ? (
            <EditableHit
              active={editing}
              selected={selected === "phone"}
              onSelect={() => onSelect("phone")}
              label="By phone"
              block
              ringOffset="ring-offset-cream"
            >
              <div className="rounded-sm border border-charcoal/10 p-5 md:p-6">
                {footer.phone.eyebrow.trim() ? (
                  <p className={EYEBROW}>{footer.phone.eyebrow}</p>
                ) : editing ? (
                  <p className={`${EYEBROW} text-charcoal/30`}>Phone eyebrow</p>
                ) : null}
                {footer.phone.number.trim() ? (
                  editing ? (
                    <p className="mt-4 font-display text-[1.15rem] leading-snug tracking-tight text-charcoal">
                      {footer.phone.number}
                    </p>
                  ) : (
                    <a
                      href={`tel:${footer.phone.tel.trim() || footer.phone.number.replace(/\s/g, "")}`}
                      className="mt-4 inline-block font-display text-[1.15rem] leading-snug tracking-tight text-charcoal transition-colors hover:text-forest"
                    >
                      {footer.phone.number}
                    </a>
                  )
                ) : editing ? (
                  <p className="mt-4 font-display text-[1.15rem] text-charcoal/35">
                    Phone number
                  </p>
                ) : null}
                {footer.phone.body.trim() ? (
                  <p className="mt-1.5 text-[0.8125rem] leading-relaxed text-charcoal/55">
                    {footer.phone.body}
                  </p>
                ) : editing ? (
                  <p className="mt-1.5 text-[0.8125rem] text-charcoal/35">
                    Hours
                  </p>
                ) : null}
              </div>
            </EditableHit>
          ) : null}

          {showSocials ? (
            <EditableHit
              active={editing}
              selected={selected === "socials"}
              onSelect={() => onSelect("socials")}
              label="Follow along"
              block
              ringOffset="ring-offset-cream"
            >
              <div className="rounded-sm border border-charcoal/10 p-5 md:p-6">
                {footer.socials.eyebrow.trim() ? (
                  <p className={EYEBROW}>{footer.socials.eyebrow}</p>
                ) : editing ? (
                  <p className={`${EYEBROW} text-charcoal/30`}>
                    Socials eyebrow
                  </p>
                ) : null}
                {socials.length > 0 ? (
                  <ul className="mt-4 space-y-2">
                    {socials.map((social, index) => (
                      <li key={`${social.label}-${index}`}>
                        {editing ? (
                          <div className="flex items-center justify-between gap-3 rounded-sm border border-charcoal/12 px-3.5 py-2.5">
                            <span className="text-[0.8125rem] font-medium text-charcoal">
                              {social.label.trim() || "Network"}
                            </span>
                            <span className="text-[0.6875rem] text-charcoal/40">
                              {social.handle.trim() || "Handle"}
                            </span>
                          </div>
                        ) : (
                          <a
                            href={social.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group flex items-center justify-between gap-3 rounded-sm border border-charcoal/12 px-3.5 py-2.5 transition-colors hover:border-charcoal hover:bg-charcoal"
                          >
                            <span className="text-[0.8125rem] font-medium text-charcoal transition-colors group-hover:text-cream">
                              {social.label}
                            </span>
                            <span className="text-[0.6875rem] text-charcoal/40 transition-colors group-hover:text-cream/70">
                              {social.handle}
                            </span>
                          </a>
                        )}
                      </li>
                    ))}
                  </ul>
                ) : editing ? (
                  <p className="mt-4 text-[0.8125rem] text-charcoal/45">
                    Add social links in the editor…
                  </p>
                ) : null}
              </div>
            </EditableHit>
          ) : null}
        </div>
      ) : null}
    </section>
  );
}

function EditorPopover({
  target,
  sections,
  onChange,
  onClose,
}: {
  target: ContactEditTarget;
  sections: ContactPageSections;
  onChange: (next: ContactPageSections) => void;
  onClose: () => void;
}) {
  const titleId = useId();
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    function onPointer(e: MouseEvent) {
      if (!panelRef.current?.contains(e.target as Node)) onClose();
    }
    window.addEventListener("keydown", onKey);
    const t = window.setTimeout(() => {
      window.addEventListener("mousedown", onPointer);
    }, 0);
    return () => {
      window.clearTimeout(t);
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("mousedown", onPointer);
    };
  }, [onClose]);

  function setBriefedBy(briefedBy: ContactPageSections["briefedBy"]) {
    onChange({ ...sections, briefedBy });
  }

  function setNextSteps(nextSteps: ContactPageSections["nextSteps"]) {
    onChange({ ...sections, nextSteps });
  }

  function setHero(hero: ContactPageSections["hero"]) {
    onChange({ ...sections, hero });
  }

  function setFooter(footer: ContactPageSections["footer"]) {
    onChange({ ...sections, footer });
  }

  return (
    <div
      ref={panelRef}
      role="dialog"
      aria-labelledby={titleId}
      className="fixed top-20 right-4 z-50 w-[min(100vw-2rem,24rem)] rounded-sm border border-charcoal/10 bg-white p-4 shadow-[0_18px_50px_rgba(28,26,23,0.16)]"
    >
      <div className="mb-3 flex items-center justify-between gap-3">
        <h2 id={titleId} className="font-display text-lg text-charcoal">
          {targetTitle(target)}
        </h2>
        <button
          type="button"
          onClick={onClose}
          className="text-sm text-charcoal/50 hover:text-charcoal"
        >
          Close
        </button>
      </div>

      <div className="max-h-[70vh] space-y-4 overflow-y-auto pr-1">
        {target === "hero" ? (
          <>
            <Field
              label="Headline"
              id="ve-ct-hero-headline"
              hint="First line, before the accent."
            >
              <TextInput
                id="ve-ct-hero-headline"
                value={sections.hero.headline}
                onChange={(e) =>
                  setHero({ ...sections.hero, headline: e.target.value })
                }
              />
            </Field>
            <Field
              label="Headline accent"
              id="ve-ct-hero-headline-accent"
              hint="Shown in forest green."
            >
              <TextInput
                id="ve-ct-hero-headline-accent"
                value={sections.hero.headlineAccent}
                onChange={(e) =>
                  setHero({ ...sections.hero, headlineAccent: e.target.value })
                }
              />
            </Field>
            <Field label="Supporting line" id="ve-ct-hero-subhead">
              <TextArea
                id="ve-ct-hero-subhead"
                rows={3}
                value={sections.hero.subhead}
                onChange={(e) =>
                  setHero({ ...sections.hero, subhead: e.target.value })
                }
              />
            </Field>
          </>
        ) : null}

        {target === "briefedBy" ? (
          <>
            <Field label="Label" id="ve-ct-briefed-label">
              <TextInput
                id="ve-ct-briefed-label"
                value={sections.briefedBy.label}
                onChange={(e) =>
                  setBriefedBy({
                    ...sections.briefedBy,
                    label: e.target.value,
                  })
                }
              />
            </Field>
            {sections.briefedBy.logos.map((logo, index) => (
              <div
                key={`ve-ct-logo-${index}`}
                className="space-y-3 rounded-sm border border-charcoal/10 p-3"
              >
                <div className="flex items-center justify-between gap-3">
                  <p className="text-sm font-medium">Logo {index + 1}</p>
                  <button
                    type="button"
                    onClick={() =>
                      setBriefedBy({
                        ...sections.briefedBy,
                        logos: sections.briefedBy.logos.filter(
                          (_, i) => i !== index,
                        ),
                      })
                    }
                    className="text-xs font-medium text-danger hover:underline"
                  >
                    Remove
                  </button>
                </div>
                <Field label="Name" id={`ve-ct-logo-name-${index}`}>
                  <TextInput
                    id={`ve-ct-logo-name-${index}`}
                    value={logo.name}
                    onChange={(e) => {
                      const logos = sections.briefedBy.logos.map((row, i) =>
                        i === index ? { ...row, name: e.target.value } : row,
                      );
                      setBriefedBy({ ...sections.briefedBy, logos });
                    }}
                  />
                </Field>
                <MediaField
                  label="Logo image"
                  hint={TRUSTED_BY_LOGO_HINT}
                  value={logo.src}
                  onChange={(src) => {
                    const logos = sections.briefedBy.logos.map((row, i) =>
                      i === index ? { ...row, src } : row,
                    );
                    setBriefedBy({ ...sections.briefedBy, logos });
                  }}
                />
                <Field label="Link URL" id={`ve-ct-logo-href-${index}`}>
                  <TextInput
                    id={`ve-ct-logo-href-${index}`}
                    value={logo.href}
                    onChange={(e) => {
                      const logos = sections.briefedBy.logos.map((row, i) =>
                        i === index ? { ...row, href: e.target.value } : row,
                      );
                      setBriefedBy({ ...sections.briefedBy, logos });
                    }}
                    placeholder="https://…"
                  />
                </Field>
              </div>
            ))}
            <button
              type="button"
              onClick={() =>
                setBriefedBy({
                  ...sections.briefedBy,
                  logos: [...sections.briefedBy.logos, emptyContactLogo()],
                })
              }
              className="text-sm font-medium text-forest hover:text-forest-dark"
            >
              + Add logo
            </button>
          </>
        ) : null}

        {target === "nextSteps" ? (
          <>
            <Field label="Eyebrow" id="ve-ct-steps-eyebrow">
              <TextInput
                id="ve-ct-steps-eyebrow"
                value={sections.nextSteps.eyebrow}
                onChange={(e) =>
                  setNextSteps({
                    ...sections.nextSteps,
                    eyebrow: e.target.value,
                  })
                }
              />
            </Field>
            {sections.nextSteps.steps.map((step, index) => (
              <div
                key={`ve-ct-step-${index}`}
                className="space-y-3 rounded-sm border border-charcoal/10 p-3"
              >
                <div className="flex items-center justify-between gap-3">
                  <p className="text-sm font-medium">Step {index + 1}</p>
                  <button
                    type="button"
                    onClick={() =>
                      setNextSteps({
                        ...sections.nextSteps,
                        steps: sections.nextSteps.steps.filter(
                          (_, i) => i !== index,
                        ),
                      })
                    }
                    className="text-xs font-medium text-danger hover:underline"
                  >
                    Remove
                  </button>
                </div>
                <Field label="Title" id={`ve-ct-step-title-${index}`}>
                  <TextInput
                    id={`ve-ct-step-title-${index}`}
                    value={step.title}
                    onChange={(e) => {
                      const steps = sections.nextSteps.steps.map((row, i) =>
                        i === index ? { ...row, title: e.target.value } : row,
                      );
                      setNextSteps({ ...sections.nextSteps, steps });
                    }}
                  />
                </Field>
                <Field label="Body" id={`ve-ct-step-body-${index}`}>
                  <TextArea
                    id={`ve-ct-step-body-${index}`}
                    rows={2}
                    value={step.body}
                    onChange={(e) => {
                      const steps = sections.nextSteps.steps.map((row, i) =>
                        i === index ? { ...row, body: e.target.value } : row,
                      );
                      setNextSteps({ ...sections.nextSteps, steps });
                    }}
                  />
                </Field>
              </div>
            ))}
            <button
              type="button"
              onClick={() =>
                setNextSteps({
                  ...sections.nextSteps,
                  steps: [...sections.nextSteps.steps, emptyContactStep()],
                })
              }
              className="text-sm font-medium text-forest hover:text-forest-dark"
            >
              + Add step
            </button>
            <Field label="Footnote lead-in" id="ve-ct-footnote">
              <TextInput
                id="ve-ct-footnote"
                value={sections.nextSteps.footnote}
                onChange={(e) =>
                  setNextSteps({
                    ...sections.nextSteps,
                    footnote: e.target.value,
                  })
                }
              />
            </Field>
            <Field label="Browse link label" id="ve-ct-browse-label">
              <TextInput
                id="ve-ct-browse-label"
                value={sections.nextSteps.browseLabel}
                onChange={(e) =>
                  setNextSteps({
                    ...sections.nextSteps,
                    browseLabel: e.target.value,
                  })
                }
              />
            </Field>
            <Field label="Browse link URL" id="ve-ct-browse-href">
              <TextInput
                id="ve-ct-browse-href"
                value={sections.nextSteps.browseHref}
                onChange={(e) =>
                  setNextSteps({
                    ...sections.nextSteps,
                    browseHref: e.target.value,
                  })
                }
              />
            </Field>
            <Field label="Email link label" id="ve-ct-email-label">
              <TextInput
                id="ve-ct-email-label"
                value={sections.nextSteps.emailLabel}
                onChange={(e) =>
                  setNextSteps({
                    ...sections.nextSteps,
                    emailLabel: e.target.value,
                  })
                }
              />
            </Field>
            <Field label="Email address" id="ve-ct-email">
              <TextInput
                id="ve-ct-email"
                value={sections.nextSteps.email}
                onChange={(e) =>
                  setNextSteps({
                    ...sections.nextSteps,
                    email: e.target.value,
                  })
                }
              />
            </Field>
          </>
        ) : null}

        {target === "channels" ? (
          <>
            {sections.footer.channels.map((channel, index) => (
              <div
                key={`ve-ct-channel-${index}`}
                className="space-y-3 rounded-sm border border-charcoal/10 p-3"
              >
                <div className="flex items-center justify-between gap-3">
                  <p className="text-sm font-medium">Channel {index + 1}</p>
                  <button
                    type="button"
                    onClick={() =>
                      setFooter({
                        ...sections.footer,
                        channels: sections.footer.channels.filter(
                          (_, i) => i !== index,
                        ),
                      })
                    }
                    className="text-xs font-medium text-danger hover:underline"
                  >
                    Remove
                  </button>
                </div>
                <Field label="Label" id={`ve-ct-channel-label-${index}`}>
                  <TextInput
                    id={`ve-ct-channel-label-${index}`}
                    value={channel.label}
                    onChange={(e) => {
                      const channels = sections.footer.channels.map((row, i) =>
                        i === index ? { ...row, label: e.target.value } : row,
                      );
                      setFooter({ ...sections.footer, channels });
                    }}
                  />
                </Field>
                <Field label="Email address" id={`ve-ct-channel-address-${index}`}>
                  <TextInput
                    id={`ve-ct-channel-address-${index}`}
                    value={channel.address}
                    onChange={(e) => {
                      const channels = sections.footer.channels.map((row, i) =>
                        i === index ? { ...row, address: e.target.value } : row,
                      );
                      setFooter({ ...sections.footer, channels });
                    }}
                  />
                </Field>
                <Field label="Description" id={`ve-ct-channel-body-${index}`}>
                  <TextArea
                    id={`ve-ct-channel-body-${index}`}
                    rows={2}
                    value={channel.body}
                    onChange={(e) => {
                      const channels = sections.footer.channels.map((row, i) =>
                        i === index ? { ...row, body: e.target.value } : row,
                      );
                      setFooter({ ...sections.footer, channels });
                    }}
                  />
                </Field>
              </div>
            ))}
            <button
              type="button"
              onClick={() =>
                setFooter({
                  ...sections.footer,
                  channels: [
                    ...sections.footer.channels,
                    emptyContactChannel(),
                  ],
                })
              }
              className="text-sm font-medium text-forest hover:text-forest-dark"
            >
              + Add channel
            </button>
          </>
        ) : null}

        {target === "office" ? (
          <>
            <Field label="Eyebrow" id="ve-ct-office-eyebrow">
              <TextInput
                id="ve-ct-office-eyebrow"
                value={sections.footer.office.eyebrow}
                onChange={(e) =>
                  setFooter({
                    ...sections.footer,
                    office: {
                      ...sections.footer.office,
                      eyebrow: e.target.value,
                    },
                  })
                }
              />
            </Field>
            <Field label="Title" id="ve-ct-office-title">
              <TextInput
                id="ve-ct-office-title"
                value={sections.footer.office.title}
                onChange={(e) =>
                  setFooter({
                    ...sections.footer,
                    office: {
                      ...sections.footer.office,
                      title: e.target.value,
                    },
                  })
                }
              />
            </Field>
            <Field label="Address" id="ve-ct-office-body">
              <TextArea
                id="ve-ct-office-body"
                rows={2}
                value={sections.footer.office.body}
                onChange={(e) =>
                  setFooter({
                    ...sections.footer,
                    office: {
                      ...sections.footer.office,
                      body: e.target.value,
                    },
                  })
                }
              />
            </Field>
          </>
        ) : null}

        {target === "phone" ? (
          <>
            <Field label="Eyebrow" id="ve-ct-phone-eyebrow">
              <TextInput
                id="ve-ct-phone-eyebrow"
                value={sections.footer.phone.eyebrow}
                onChange={(e) =>
                  setFooter({
                    ...sections.footer,
                    phone: {
                      ...sections.footer.phone,
                      eyebrow: e.target.value,
                    },
                  })
                }
              />
            </Field>
            <Field label="Display number" id="ve-ct-phone-number">
              <TextInput
                id="ve-ct-phone-number"
                value={sections.footer.phone.number}
                onChange={(e) =>
                  setFooter({
                    ...sections.footer,
                    phone: {
                      ...sections.footer.phone,
                      number: e.target.value,
                    },
                  })
                }
              />
            </Field>
            <Field
              label="Tel link"
              id="ve-ct-phone-tel"
              hint="Digits only, e.g. +442079460018"
            >
              <TextInput
                id="ve-ct-phone-tel"
                value={sections.footer.phone.tel}
                onChange={(e) =>
                  setFooter({
                    ...sections.footer,
                    phone: { ...sections.footer.phone, tel: e.target.value },
                  })
                }
              />
            </Field>
            <Field label="Hours / note" id="ve-ct-phone-body">
              <TextArea
                id="ve-ct-phone-body"
                rows={2}
                value={sections.footer.phone.body}
                onChange={(e) =>
                  setFooter({
                    ...sections.footer,
                    phone: { ...sections.footer.phone, body: e.target.value },
                  })
                }
              />
            </Field>
          </>
        ) : null}

        {target === "socials" ? (
          <>
            <Field label="Eyebrow" id="ve-ct-socials-eyebrow">
              <TextInput
                id="ve-ct-socials-eyebrow"
                value={sections.footer.socials.eyebrow}
                onChange={(e) =>
                  setFooter({
                    ...sections.footer,
                    socials: {
                      ...sections.footer.socials,
                      eyebrow: e.target.value,
                    },
                  })
                }
              />
            </Field>
            {sections.footer.socials.items.map((social, index) => (
              <div
                key={`ve-ct-social-${index}`}
                className="space-y-3 rounded-sm border border-charcoal/10 p-3"
              >
                <div className="flex items-center justify-between gap-3">
                  <p className="text-sm font-medium">Link {index + 1}</p>
                  <button
                    type="button"
                    onClick={() =>
                      setFooter({
                        ...sections.footer,
                        socials: {
                          ...sections.footer.socials,
                          items: sections.footer.socials.items.filter(
                            (_, i) => i !== index,
                          ),
                        },
                      })
                    }
                    className="text-xs font-medium text-danger hover:underline"
                  >
                    Remove
                  </button>
                </div>
                <Field label="Network" id={`ve-ct-social-label-${index}`}>
                  <TextInput
                    id={`ve-ct-social-label-${index}`}
                    value={social.label}
                    onChange={(e) => {
                      const items = sections.footer.socials.items.map(
                        (row, i) =>
                          i === index ? { ...row, label: e.target.value } : row,
                      );
                      setFooter({
                        ...sections.footer,
                        socials: { ...sections.footer.socials, items },
                      });
                    }}
                  />
                </Field>
                <Field label="Handle" id={`ve-ct-social-handle-${index}`}>
                  <TextInput
                    id={`ve-ct-social-handle-${index}`}
                    value={social.handle}
                    onChange={(e) => {
                      const items = sections.footer.socials.items.map(
                        (row, i) =>
                          i === index ? { ...row, handle: e.target.value } : row,
                      );
                      setFooter({
                        ...sections.footer,
                        socials: { ...sections.footer.socials, items },
                      });
                    }}
                  />
                </Field>
                <Field label="URL" id={`ve-ct-social-href-${index}`}>
                  <TextInput
                    id={`ve-ct-social-href-${index}`}
                    value={social.href}
                    onChange={(e) => {
                      const items = sections.footer.socials.items.map(
                        (row, i) =>
                          i === index ? { ...row, href: e.target.value } : row,
                      );
                      setFooter({
                        ...sections.footer,
                        socials: { ...sections.footer.socials, items },
                      });
                    }}
                    placeholder="https://…"
                  />
                </Field>
              </div>
            ))}
            <button
              type="button"
              onClick={() =>
                setFooter({
                  ...sections.footer,
                  socials: {
                    ...sections.footer.socials,
                    items: [
                      ...sections.footer.socials.items,
                      emptyContactSocial(),
                    ],
                  },
                })
              }
              className="text-sm font-medium text-forest hover:text-forest-dark"
            >
              + Add link
            </button>
          </>
        ) : null}
      </div>
    </div>
  );
}

export function ContactVisualEditor({
  initial,
  canEdit,
  saveAction,
  form,
}: {
  initial: ContactPageSections;
  canEdit: boolean;
  saveAction: typeof import("@/lib/actions/admin-cms").saveContactPage;
  form: ReactNode;
}) {
  const router = useRouter();
  const [editing, setEditing] = useState(false);
  const [sections, setSections] = useState(initial);
  const [baseline, setBaseline] = useState(initial);
  const [target, setTarget] = useState<ContactEditTarget | null>(null);
  const [pending, setPending] = useState(false);
  const [message, setMessage] = useState("");
  const [ok, setOk] = useState(false);

  const dirty = JSON.stringify(sections) !== JSON.stringify(baseline);

  useEffect(() => {
    setSections(initial);
    setBaseline(initial);
  }, [initial]);

  async function save() {
    setPending(true);
    const result = await saveAction(sections);
    setOk(result.ok);
    setMessage(result.ok ? "Contact page saved." : result.message);
    setPending(false);
    if (result.ok) {
      setBaseline(sections);
      router.refresh();
    }
  }

  function discard() {
    setSections(baseline);
    setTarget(null);
    setMessage("");
  }

  return (
    <>
      <ContactHero
        sections={sections}
        editing={editing && canEdit}
        selected={target}
        onSelect={setTarget}
      />

      <div className="mt-10 flex flex-col gap-5 md:mt-12">
        <ContactBriefedBy
          sections={sections}
          editing={editing && canEdit}
          selected={target}
          onSelect={setTarget}
        />

        <div className="grid items-stretch gap-8 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] lg:gap-12">
          <div className="h-full min-h-0">{form}</div>
          <ContactNextSteps
            sections={sections}
            editing={editing && canEdit}
            selected={target}
            onSelect={setTarget}
          />
        </div>
      </div>

      <ContactFooter
        sections={sections}
        editing={editing && canEdit}
        selected={target}
        onSelect={setTarget}
      />

      {canEdit ? (
        <div className="fixed bottom-4 left-1/2 z-50 flex -translate-x-1/2 flex-wrap items-center justify-center gap-2 rounded-sm border border-charcoal/10 bg-white/95 px-3 py-2 shadow-[0_12px_40px_rgba(28,26,23,0.14)] backdrop-blur">
          <Button
            type="button"
            variant={editing ? "secondary" : "primary"}
            className="px-4! py-2! text-xs"
            onClick={() => {
              setEditing((v) => !v);
              setTarget(null);
              setMessage("");
            }}
          >
            {editing ? "Done editing" : "Edit page"}
          </Button>
          {editing ? (
            <>
              <Button
                type="button"
                variant="primary"
                className="px-4! py-2! text-xs"
                disabled={!dirty || pending}
                onClick={() => void save()}
              >
                {pending ? "Saving…" : "Save"}
              </Button>
              <Button
                type="button"
                variant="ghost"
                className="px-3! py-2! text-xs"
                disabled={!dirty || pending}
                onClick={discard}
              >
                Discard
              </Button>
              <a
                href="/admin/pages/contact"
                className="px-2 text-xs font-medium text-charcoal/55 hover:text-charcoal"
              >
                Admin form
              </a>
            </>
          ) : null}
          {message ? (
            <p className={`text-xs ${ok ? "text-success" : "text-danger"}`}>
              {message}
            </p>
          ) : null}
        </div>
      ) : null}

      {editing && canEdit && target ? (
        <EditorPopover
          target={target}
          sections={sections}
          onChange={setSections}
          onClose={() => setTarget(null)}
        />
      ) : null}
    </>
  );
}
