"use client";

import Link from "next/link";
import { useEffect, useId, useRef, useState } from "react";
import { useRouter } from "next/navigation";

import { EditableHit } from "@/components/editable-hit";
import { MediaField } from "@/components/media-library";
import { Button, Field, TextArea, TextInput } from "@/components/ui";
import {
  emptyContactLogo,
  emptyContactStep,
  type ContactPageSections,
} from "@/lib/contact-page";
import { TRUSTED_BY_LOGO_HINT } from "@/lib/trusted-by";

type ContactEditTarget = "briefedBy" | "nextSteps";

function ContactAside({
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
  const steps = sections.nextSteps.steps.filter(
    (step) => step.title.trim() || step.body.trim(),
  );
  const showBriefedBy =
    editing || sections.briefedBy.label.trim() || logos.length > 0;
  const showNextSteps =
    editing ||
    sections.nextSteps.eyebrow.trim() ||
    steps.length > 0 ||
    sections.nextSteps.footnote.trim() ||
    sections.nextSteps.browseLabel.trim() ||
    sections.nextSteps.emailLabel.trim();

  return (
    <aside className="flex flex-col gap-5 lg:sticky lg:top-32">
      {showBriefedBy ? (
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
      ) : null}

      {showNextSteps ? (
        <EditableHit
          active={editing}
          selected={selected === "nextSteps"}
          onSelect={() => onSelect("nextSteps")}
          label="What happens next"
          block
          ringOffset="ring-offset-cream"
        >
          <div className="rounded-sm border border-charcoal/10 bg-[#FBF8F5] p-6 md:p-7">
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
                className={`border-t border-charcoal/8 pt-5 text-[0.8125rem] leading-relaxed text-charcoal/60 ${
                  steps.length > 0 ||
                  sections.nextSteps.eyebrow.trim() ||
                  editing
                    ? "mt-2"
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
      ) : null}
    </aside>
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

  return (
    <div
      ref={panelRef}
      role="dialog"
      aria-labelledby={titleId}
      className="fixed top-20 right-4 z-50 w-[min(100vw-2rem,24rem)] rounded-sm border border-charcoal/10 bg-white p-4 shadow-[0_18px_50px_rgba(28,26,23,0.16)]"
    >
      <div className="mb-3 flex items-center justify-between gap-3">
        <h2 id={titleId} className="font-display text-lg text-charcoal">
          {target === "briefedBy" ? "Briefed-by logos" : "What happens next"}
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
      </div>
    </div>
  );
}

export function ContactVisualEditor({
  initial,
  canEdit,
  saveAction,
}: {
  initial: ContactPageSections;
  canEdit: boolean;
  saveAction: typeof import("@/lib/actions/admin-cms").saveContactPage;
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
      <ContactAside
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
