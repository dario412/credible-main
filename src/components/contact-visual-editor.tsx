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
  emptyContactStep,
  primaryContactEmail,
  type ContactPageSections,
} from "@/lib/contact-page";
import { TRUSTED_BY_LOGO_HINT } from "@/lib/trusted-by";

const EYEBROW =
  "text-[0.7rem] font-medium tracking-[0.16em] text-charcoal/45 uppercase";

type ContactEditTarget =
  | "hero"
  | "briefedBy"
  | "nextSteps"
  | "directEmail"
  | "londonOffice"
  | "nyOffice";

function targetTitle(target: ContactEditTarget): string {
  const map: Record<ContactEditTarget, string> = {
    hero: "Page intro",
    briefedBy: "Briefed-by logos",
    nextSteps: "What happens next",
    directEmail: "Direct email",
    londonOffice: "London office",
    nyOffice: "NY office",
  };
  return map[target];
}

function telHref(number: string, tel: string) {
  return `tel:${tel.trim() || number.replace(/\s/g, "")}`;
}

function FooterContactCard({
  eyebrow,
  value,
  body,
  href,
  editing,
  selected,
  onSelect,
  editLabel,
  placeholderEyebrow,
  placeholderValue,
  placeholderBody,
}: {
  eyebrow: string;
  value: string;
  body: string;
  href?: string;
  editing: boolean;
  selected: boolean;
  onSelect: () => void;
  editLabel: string;
  placeholderEyebrow: string;
  placeholderValue: string;
  placeholderBody: string;
}) {
  const cardClass =
    "flex h-full flex-col rounded-sm border border-charcoal/10 bg-[#FBF8F5] p-5 md:p-6";
  const valueClass =
    "mt-4 font-display text-[1.15rem] leading-tight tracking-tight text-charcoal md:text-[1.25rem]";

  const inner = (
    <>
      {eyebrow.trim() ? (
        <span className={EYEBROW}>{eyebrow}</span>
      ) : editing ? (
        <span className={`${EYEBROW} text-charcoal/30`}>{placeholderEyebrow}</span>
      ) : null}
      {value.trim() ? (
        <span className={valueClass}>{value}</span>
      ) : editing ? (
        <span className={`${valueClass} text-charcoal/35`}>{placeholderValue}</span>
      ) : null}
      {body.trim() ? (
        <span className="mt-2.5 text-[0.8125rem] leading-relaxed text-charcoal/55">
          {body}
        </span>
      ) : editing ? (
        <span className="mt-2.5 text-[0.8125rem] text-charcoal/35">
          {placeholderBody}
        </span>
      ) : null}
    </>
  );

  return (
    <EditableHit
      active={editing}
      selected={selected}
      onSelect={onSelect}
      label={editLabel}
      block
      ringOffset="ring-offset-cream"
    >
      {editing || !href ? (
        <div className={cardClass}>{inner}</div>
      ) : (
        <a
          href={href}
          className={`group ${cardClass} transition-colors hover:border-forest/45`}
        >
          <span className="flex items-center justify-between gap-3">
            {eyebrow.trim() ? (
              <span className={EYEBROW}>{eyebrow}</span>
            ) : null}
            <ArrowUpRight
              weight="bold"
              aria-hidden
              className="size-3 shrink-0 text-charcoal/25 transition-colors group-hover:text-forest"
            />
          </span>
          <span
            className={`${valueClass} transition-colors group-hover:text-forest`}
          >
            {value}
          </span>
          {body.trim() ? (
            <span className="mt-2.5 text-[0.8125rem] leading-relaxed text-charcoal/55">
              {body}
            </span>
          ) : null}
        </a>
      )}
    </EditableHit>
  );
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
      ringOffset="ring-offset-cream"
    >
      <div className="flex flex-col rounded-sm border border-charcoal/10 bg-[#FBF8F5] p-6 md:p-7">
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
            sections.nextSteps.email.trim() ||
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
                (sections.nextSteps.emailLabel.trim() ||
                  sections.nextSteps.email.trim())
                  ? " · "
                  : null}
                {sections.nextSteps.emailLabel.trim() ||
                sections.nextSteps.email.trim() ? (
                  editing ? (
                    <span className="font-medium text-forest">
                      {sections.nextSteps.email.trim() ||
                        sections.nextSteps.emailLabel}
                    </span>
                  ) : (
                    <a
                      href={`mailto:${sections.nextSteps.email.trim() || "hello@crediblecreators.com"}`}
                      className="font-medium text-forest transition-colors hover:text-forest-dark"
                    >
                      {sections.nextSteps.email.trim() ||
                        "hello@crediblecreators.com"}
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
  const email = primaryContactEmail(footer);
  const showFooter =
    editing ||
    email.label.trim() ||
    email.address.trim() ||
    footer.office.eyebrow.trim() ||
    footer.phone.number.trim() ||
    footer.office.body.trim() ||
    footer.office.usEyebrow.trim() ||
    footer.phone.usNumber.trim() ||
    footer.office.usBody.trim();

  if (!showFooter) return null;

  return (
    <section className="mt-16 border-t border-charcoal/10 pt-12 md:mt-20 md:pt-14">
      <div className="grid items-stretch gap-4 lg:grid-cols-3">
        <FooterContactCard
          eyebrow={email.label}
          value={email.address}
          body={email.body}
          href={email.address.trim() ? `mailto:${email.address}` : undefined}
          editing={editing}
          selected={selected === "directEmail"}
          onSelect={() => onSelect("directEmail")}
          editLabel="Direct email"
          placeholderEyebrow="Direct email"
          placeholderValue="hello@crediblecreators.com"
          placeholderBody="Short description"
        />
        <FooterContactCard
          eyebrow={footer.office.eyebrow}
          value={footer.phone.number}
          body={footer.office.body}
          href={
            footer.phone.number.trim()
              ? telHref(footer.phone.number, footer.phone.tel)
              : undefined
          }
          editing={editing}
          selected={selected === "londonOffice"}
          onSelect={() => onSelect("londonOffice")}
          editLabel="London office"
          placeholderEyebrow="London office"
          placeholderValue="+44 20 7946 0018"
          placeholderBody="Office address"
        />
        <FooterContactCard
          eyebrow={footer.office.usEyebrow}
          value={footer.phone.usNumber}
          body={footer.office.usBody}
          href={
            footer.phone.usNumber.trim()
              ? telHref(footer.phone.usNumber, footer.phone.usTel)
              : undefined
          }
          editing={editing}
          selected={selected === "nyOffice"}
          onSelect={() => onSelect("nyOffice")}
          editLabel="NY office"
          placeholderEyebrow="NY office"
          placeholderValue="+1 646 794 6018"
          placeholderBody="Office address"
        />
      </div>
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

        {target === "directEmail" ? (
          <>
            <Field label="Label" id="ve-ct-direct-email-label">
              <TextInput
                id="ve-ct-direct-email-label"
                value={primaryContactEmail(sections.footer).label}
                onChange={(e) => {
                  const channels = [...sections.footer.channels];
                  const current = channels[0] ?? emptyContactChannel();
                  channels[0] = { ...current, label: e.target.value };
                  setFooter({ ...sections.footer, channels });
                }}
              />
            </Field>
            <Field label="Email address" id="ve-ct-direct-email-address">
              <TextInput
                id="ve-ct-direct-email-address"
                value={primaryContactEmail(sections.footer).address}
                onChange={(e) => {
                  const channels = [...sections.footer.channels];
                  const current = channels[0] ?? emptyContactChannel();
                  channels[0] = { ...current, address: e.target.value };
                  setFooter({ ...sections.footer, channels });
                }}
              />
            </Field>
            <Field label="Description" id="ve-ct-direct-email-body">
              <TextArea
                id="ve-ct-direct-email-body"
                rows={2}
                value={primaryContactEmail(sections.footer).body}
                onChange={(e) => {
                  const channels = [...sections.footer.channels];
                  const current = channels[0] ?? emptyContactChannel();
                  channels[0] = { ...current, body: e.target.value };
                  setFooter({ ...sections.footer, channels });
                }}
              />
            </Field>
          </>
        ) : null}

        {target === "londonOffice" ? (
          <>
            <Field label="London eyebrow" id="ve-ct-office-eyebrow">
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
            <Field label="London phone" id="ve-ct-phone-number">
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
              label="London tel link"
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
            <Field label="London address" id="ve-ct-office-body">
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

        {target === "nyOffice" ? (
          <>
            <Field label="NY eyebrow" id="ve-ct-office-us-eyebrow">
              <TextInput
                id="ve-ct-office-us-eyebrow"
                value={sections.footer.office.usEyebrow}
                onChange={(e) =>
                  setFooter({
                    ...sections.footer,
                    office: {
                      ...sections.footer.office,
                      usEyebrow: e.target.value,
                    },
                  })
                }
              />
            </Field>
            <Field label="NY phone" id="ve-ct-phone-us-number">
              <TextInput
                id="ve-ct-phone-us-number"
                value={sections.footer.phone.usNumber}
                onChange={(e) =>
                  setFooter({
                    ...sections.footer,
                    phone: {
                      ...sections.footer.phone,
                      usNumber: e.target.value,
                    },
                  })
                }
              />
            </Field>
            <Field
              label="NY tel link"
              id="ve-ct-phone-us-tel"
              hint="Digits only, e.g. +16467946018"
            >
              <TextInput
                id="ve-ct-phone-us-tel"
                value={sections.footer.phone.usTel}
                onChange={(e) =>
                  setFooter({
                    ...sections.footer,
                    phone: {
                      ...sections.footer.phone,
                      usTel: e.target.value,
                    },
                  })
                }
              />
            </Field>
            <Field label="NY address" id="ve-ct-office-us-body">
              <TextArea
                id="ve-ct-office-us-body"
                rows={2}
                value={sections.footer.office.usBody}
                onChange={(e) =>
                  setFooter({
                    ...sections.footer,
                    office: {
                      ...sections.footer.office,
                      usBody: e.target.value,
                    },
                  })
                }
              />
            </Field>
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

      <div className="mt-10 grid items-start gap-8 md:mt-12 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] lg:gap-12">
        <div className="min-h-0">{form}</div>
        <aside className="flex flex-col gap-5 lg:sticky lg:top-28 lg:self-start">
          <ContactBriefedBy
            sections={sections}
            editing={editing && canEdit}
            selected={target}
            onSelect={setTarget}
          />
          <ContactNextSteps
            sections={sections}
            editing={editing && canEdit}
            selected={target}
            onSelect={setTarget}
          />
        </aside>
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
