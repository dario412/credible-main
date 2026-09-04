"use client";

import {
  Briefcase,
  ChartLineUp,
  Check,
  EnvelopeSimple,
  Microphone,
  X,
} from "@phosphor-icons/react";
import { useEffect, useId, useRef, useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";

import { EditableHit, MultilineText } from "@/components/editable-hit";
import { FadeUp } from "@/components/fade-up";
import {
  EYEBROW,
  EYEBROW_MUTED,
  EYEBROW_ON_DARK,
  PAGE_SHELL,
  PageGhostLink,
} from "@/components/inner-page";
import { RepresentationApplyCta } from "@/components/representation-apply-cta";
import { RepresentationApplicationForm } from "@/components/representation-application-form";
import { RepresentationFaq } from "@/components/representation-faq";
import { Button, Field, TextArea, TextInput } from "@/components/ui";
import {
  APPLY_BENEFIT_ICONS,
  emptyApplyBenefit,
  emptyApplyFaqItem,
  emptyApplyPathStep,
  linesToList,
  listToLines,
  type ApplyBenefitIcon,
  type ApplyPageSections,
} from "@/lib/apply-page";

const BENEFIT_ICON = {
  envelope: EnvelopeSimple,
  briefcase: Briefcase,
  microphone: Microphone,
  chart: ChartLineUp,
} as const;

const BENEFIT_ICON_LABEL: Record<ApplyBenefitIcon, string> = {
  envelope: "Envelope",
  briefcase: "Briefcase",
  microphone: "Microphone",
  chart: "Chart",
};

type EditTarget =
  | "hero"
  | "qualify"
  | "fit"
  | "notFit"
  | "path"
  | `path.${number}`
  | "benefits"
  | `benefit.${number}`
  | "faq"
  | "cta";

function targetTitle(target: EditTarget): string {
  if (target.startsWith("path.")) {
    return `Path step ${Number(target.split(".")[1]) + 1}`;
  }
  if (target.startsWith("benefit.")) {
    return `Benefit ${Number(target.split(".")[1]) + 1}`;
  }
  const map: Record<string, string> = {
    hero: "Apply intro",
    qualify: "Self qualify",
    fit: "Likely a fit",
    notFit: "Probably not a fit",
    path: "The path",
    benefits: "What you get",
    faq: "FAQ",
    cta: "Start application",
  };
  return map[target] ?? "Edit";
}

function hit(
  editing: boolean,
  target: EditTarget,
  selected: EditTarget | null,
  onSelect: (target: EditTarget) => void,
  label: string,
  children: ReactNode,
  opts?: { block?: boolean; ringOffset?: string },
) {
  return (
    <EditableHit
      active={editing}
      selected={selected === target}
      onSelect={() => onSelect(target)}
      label={label}
      block={opts?.block}
      ringOffset={opts?.ringOffset}
    >
      {children}
    </EditableHit>
  );
}

function LinesField({
  id,
  label,
  hint,
  value,
  onChange,
  rows = 4,
}: {
  id: string;
  label: string;
  hint?: string;
  value: string[];
  onChange: (next: string[]) => void;
  rows?: number;
}) {
  return (
    <Field label={label} id={id} hint={hint ?? "One item per line."}>
      <TextArea
        id={id}
        rows={rows}
        value={listToLines(value)}
        onChange={(e) => onChange(linesToList(e.target.value))}
      />
    </Field>
  );
}

function EditorPopover({
  target,
  sections,
  onChange,
  onClose,
}: {
  target: EditTarget;
  sections: ApplyPageSections;
  onChange: (next: ApplyPageSections) => void;
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

  const pathIndex = target.startsWith("path.")
    ? Number(target.split(".")[1])
    : -1;
  const benefitIndex = target.startsWith("benefit.")
    ? Number(target.split(".")[1])
    : -1;
  const pathStep = pathIndex >= 0 ? sections.path.steps[pathIndex] : null;
  const benefit = benefitIndex >= 0 ? sections.benefits.items[benefitIndex] : null;

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
            <Field label="Badge" id="ve-apply-badge">
              <TextInput
                id="ve-apply-badge"
                value={sections.hero.badge}
                onChange={(e) =>
                  onChange({
                    ...sections,
                    hero: { ...sections.hero, badge: e.target.value },
                  })
                }
              />
            </Field>
            <Field
              label="Headline"
              id="ve-apply-headline"
              hint="Line breaks become new lines on the page."
            >
              <TextArea
                id="ve-apply-headline"
                rows={3}
                value={sections.hero.headline}
                onChange={(e) =>
                  onChange({
                    ...sections,
                    hero: { ...sections.hero, headline: e.target.value },
                  })
                }
              />
            </Field>
            <Field label="Subhead" id="ve-apply-subhead">
              <TextArea
                id="ve-apply-subhead"
                rows={4}
                value={sections.hero.subhead}
                onChange={(e) =>
                  onChange({
                    ...sections,
                    hero: { ...sections.hero, subhead: e.target.value },
                  })
                }
              />
            </Field>
            <LinesField
              id="ve-apply-assurances"
              label="Assurances"
              value={sections.hero.assurances}
              onChange={(assurances) =>
                onChange({
                  ...sections,
                  hero: { ...sections.hero, assurances },
                })
              }
              rows={3}
            />
            <Field label="Next eyebrow" id="ve-apply-next-eyebrow">
              <TextInput
                id="ve-apply-next-eyebrow"
                value={sections.hero.nextEyebrow}
                onChange={(e) =>
                  onChange({
                    ...sections,
                    hero: { ...sections.hero, nextEyebrow: e.target.value },
                  })
                }
              />
            </Field>
            <LinesField
              id="ve-apply-next"
              label="What happens next"
              value={sections.hero.next}
              onChange={(next) =>
                onChange({
                  ...sections,
                  hero: { ...sections.hero, next },
                })
              }
              rows={4}
            />
          </>
        ) : null}

        {target === "qualify" ? (
          <>
            <Field label="Eyebrow" id="ve-apply-qualify-eyebrow">
              <TextInput
                id="ve-apply-qualify-eyebrow"
                value={sections.qualify.eyebrow}
                onChange={(e) =>
                  onChange({
                    ...sections,
                    qualify: { ...sections.qualify, eyebrow: e.target.value },
                  })
                }
              />
            </Field>
            <Field label="Headline" id="ve-apply-qualify-headline">
              <TextArea
                id="ve-apply-qualify-headline"
                rows={3}
                value={sections.qualify.headline}
                onChange={(e) =>
                  onChange({
                    ...sections,
                    qualify: { ...sections.qualify, headline: e.target.value },
                  })
                }
              />
            </Field>
            <Field label="Subhead" id="ve-apply-qualify-subhead">
              <TextArea
                id="ve-apply-qualify-subhead"
                rows={3}
                value={sections.qualify.subhead}
                onChange={(e) =>
                  onChange({
                    ...sections,
                    qualify: { ...sections.qualify, subhead: e.target.value },
                  })
                }
              />
            </Field>
          </>
        ) : null}

        {target === "fit" ? (
          <>
            <Field label="Eyebrow" id="ve-apply-fit-eyebrow">
              <TextInput
                id="ve-apply-fit-eyebrow"
                value={sections.qualify.fitEyebrow}
                onChange={(e) =>
                  onChange({
                    ...sections,
                    qualify: {
                      ...sections.qualify,
                      fitEyebrow: e.target.value,
                    },
                  })
                }
              />
            </Field>
            <LinesField
              id="ve-apply-fit"
              label="Likely a fit"
              value={sections.qualify.fit}
              onChange={(fit) =>
                onChange({
                  ...sections,
                  qualify: { ...sections.qualify, fit },
                })
              }
              rows={5}
            />
          </>
        ) : null}

        {target === "notFit" ? (
          <>
            <Field label="Eyebrow" id="ve-apply-notfit-eyebrow">
              <TextInput
                id="ve-apply-notfit-eyebrow"
                value={sections.qualify.notFitEyebrow}
                onChange={(e) =>
                  onChange({
                    ...sections,
                    qualify: {
                      ...sections.qualify,
                      notFitEyebrow: e.target.value,
                    },
                  })
                }
              />
            </Field>
            <LinesField
              id="ve-apply-notfit"
              label="Probably not a fit"
              value={sections.qualify.notFit}
              onChange={(notFit) =>
                onChange({
                  ...sections,
                  qualify: { ...sections.qualify, notFit },
                })
              }
              rows={5}
            />
          </>
        ) : null}

        {target === "path" ? (
          <>
            <Field label="Eyebrow" id="ve-apply-path-eyebrow">
              <TextInput
                id="ve-apply-path-eyebrow"
                value={sections.path.eyebrow}
                onChange={(e) =>
                  onChange({
                    ...sections,
                    path: { ...sections.path, eyebrow: e.target.value },
                  })
                }
              />
            </Field>
            <Field label="Headline" id="ve-apply-path-headline">
              <TextArea
                id="ve-apply-path-headline"
                rows={3}
                value={sections.path.headline}
                onChange={(e) =>
                  onChange({
                    ...sections,
                    path: { ...sections.path, headline: e.target.value },
                  })
                }
              />
            </Field>
            <Field label="Subhead" id="ve-apply-path-subhead">
              <TextArea
                id="ve-apply-path-subhead"
                rows={3}
                value={sections.path.subhead}
                onChange={(e) =>
                  onChange({
                    ...sections,
                    path: { ...sections.path, subhead: e.target.value },
                  })
                }
              />
            </Field>
          </>
        ) : null}

        {pathStep ? (
          <>
            <Field label="Number" id="ve-apply-path-n">
              <TextInput
                id="ve-apply-path-n"
                value={pathStep.n}
                onChange={(e) => {
                  const steps = sections.path.steps.map((row, i) =>
                    i === pathIndex ? { ...row, n: e.target.value } : row,
                  );
                  onChange({
                    ...sections,
                    path: { ...sections.path, steps },
                  });
                }}
              />
            </Field>
            <Field label="Phase" id="ve-apply-path-phase">
              <TextInput
                id="ve-apply-path-phase"
                value={pathStep.phase}
                onChange={(e) => {
                  const steps = sections.path.steps.map((row, i) =>
                    i === pathIndex ? { ...row, phase: e.target.value } : row,
                  );
                  onChange({
                    ...sections,
                    path: { ...sections.path, steps },
                  });
                }}
              />
            </Field>
            <Field label="Title" id="ve-apply-path-title">
              <TextInput
                id="ve-apply-path-title"
                value={pathStep.title}
                onChange={(e) => {
                  const steps = sections.path.steps.map((row, i) =>
                    i === pathIndex ? { ...row, title: e.target.value } : row,
                  );
                  onChange({
                    ...sections,
                    path: { ...sections.path, steps },
                  });
                }}
              />
            </Field>
            <Field label="Body" id="ve-apply-path-body">
              <TextArea
                id="ve-apply-path-body"
                rows={3}
                value={pathStep.body}
                onChange={(e) => {
                  const steps = sections.path.steps.map((row, i) =>
                    i === pathIndex ? { ...row, body: e.target.value } : row,
                  );
                  onChange({
                    ...sections,
                    path: { ...sections.path, steps },
                  });
                }}
              />
            </Field>
            <Field label="Outcome" id="ve-apply-path-outcome">
              <TextInput
                id="ve-apply-path-outcome"
                value={pathStep.outcome}
                onChange={(e) => {
                  const steps = sections.path.steps.map((row, i) =>
                    i === pathIndex ? { ...row, outcome: e.target.value } : row,
                  );
                  onChange({
                    ...sections,
                    path: { ...sections.path, steps },
                  });
                }}
              />
            </Field>
            <label className="flex items-center gap-2 text-sm text-charcoal">
              <input
                type="checkbox"
                checked={pathStep.filled}
                onChange={(e) => {
                  const steps = sections.path.steps.map((row, i) =>
                    i === pathIndex ? { ...row, filled: e.target.checked } : row,
                  );
                  onChange({
                    ...sections,
                    path: { ...sections.path, steps },
                  });
                }}
              />
              Filled outcome pill
            </label>
            <button
              type="button"
              onClick={() => {
                onChange({
                  ...sections,
                  path: {
                    ...sections.path,
                    steps: sections.path.steps.filter((_, i) => i !== pathIndex),
                  },
                });
                onClose();
              }}
              className="text-sm font-medium text-danger hover:underline"
            >
              Remove this step
            </button>
          </>
        ) : null}

        {target === "benefits" ? (
          <>
            <Field label="Eyebrow" id="ve-apply-benefits-eyebrow">
              <TextInput
                id="ve-apply-benefits-eyebrow"
                value={sections.benefits.eyebrow}
                onChange={(e) =>
                  onChange({
                    ...sections,
                    benefits: { ...sections.benefits, eyebrow: e.target.value },
                  })
                }
              />
            </Field>
            <Field label="Headline" id="ve-apply-benefits-headline">
              <TextArea
                id="ve-apply-benefits-headline"
                rows={3}
                value={sections.benefits.headline}
                onChange={(e) =>
                  onChange({
                    ...sections,
                    benefits: {
                      ...sections.benefits,
                      headline: e.target.value,
                    },
                  })
                }
              />
            </Field>
            <Field label="Subhead" id="ve-apply-benefits-subhead">
              <TextArea
                id="ve-apply-benefits-subhead"
                rows={3}
                value={sections.benefits.subhead}
                onChange={(e) =>
                  onChange({
                    ...sections,
                    benefits: { ...sections.benefits, subhead: e.target.value },
                  })
                }
              />
            </Field>
          </>
        ) : null}

        {benefit ? (
          <>
            <Field label="Icon" id="ve-apply-benefit-icon">
              <select
                id="ve-apply-benefit-icon"
                className="w-full border border-forest/40 bg-transparent px-4 py-3 text-sm text-charcoal outline-none focus:border-forest"
                value={benefit.icon}
                onChange={(e) => {
                  const icon = e.target.value as ApplyBenefitIcon;
                  const items = sections.benefits.items.map((row, i) =>
                    i === benefitIndex ? { ...row, icon } : row,
                  );
                  onChange({
                    ...sections,
                    benefits: { ...sections.benefits, items },
                  });
                }}
              >
                {APPLY_BENEFIT_ICONS.map((icon) => (
                  <option key={icon} value={icon}>
                    {BENEFIT_ICON_LABEL[icon]}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Title" id="ve-apply-benefit-title">
              <TextInput
                id="ve-apply-benefit-title"
                value={benefit.title}
                onChange={(e) => {
                  const items = sections.benefits.items.map((row, i) =>
                    i === benefitIndex
                      ? { ...row, title: e.target.value }
                      : row,
                  );
                  onChange({
                    ...sections,
                    benefits: { ...sections.benefits, items },
                  });
                }}
              />
            </Field>
            <Field label="Body" id="ve-apply-benefit-body">
              <TextArea
                id="ve-apply-benefit-body"
                rows={3}
                value={benefit.body}
                onChange={(e) => {
                  const items = sections.benefits.items.map((row, i) =>
                    i === benefitIndex ? { ...row, body: e.target.value } : row,
                  );
                  onChange({
                    ...sections,
                    benefits: { ...sections.benefits, items },
                  });
                }}
              />
            </Field>
            <button
              type="button"
              onClick={() => {
                onChange({
                  ...sections,
                  benefits: {
                    ...sections.benefits,
                    items: sections.benefits.items.filter(
                      (_, i) => i !== benefitIndex,
                    ),
                  },
                });
                onClose();
              }}
              className="text-sm font-medium text-danger hover:underline"
            >
              Remove this benefit
            </button>
          </>
        ) : null}

        {target === "faq" ? (
          <>
            <Field label="Eyebrow" id="ve-apply-faq-eyebrow">
              <TextInput
                id="ve-apply-faq-eyebrow"
                value={sections.faq.eyebrow}
                onChange={(e) =>
                  onChange({
                    ...sections,
                    faq: { ...sections.faq, eyebrow: e.target.value },
                  })
                }
              />
            </Field>
            <Field label="Headline" id="ve-apply-faq-headline">
              <TextArea
                id="ve-apply-faq-headline"
                rows={2}
                value={sections.faq.headline}
                onChange={(e) =>
                  onChange({
                    ...sections,
                    faq: { ...sections.faq, headline: e.target.value },
                  })
                }
              />
            </Field>
            <Field label="Subhead" id="ve-apply-faq-subhead">
              <TextArea
                id="ve-apply-faq-subhead"
                rows={3}
                value={sections.faq.subhead}
                onChange={(e) =>
                  onChange({
                    ...sections,
                    faq: { ...sections.faq, subhead: e.target.value },
                  })
                }
              />
            </Field>
            {sections.faq.items.map((item, index) => (
              <div
                key={`ve-apply-faq-${index}`}
                className="space-y-3 rounded-sm border border-charcoal/10 p-3"
              >
                <div className="flex items-center justify-between gap-3">
                  <p className="text-sm font-medium">Question {index + 1}</p>
                  <button
                    type="button"
                    onClick={() =>
                      onChange({
                        ...sections,
                        faq: {
                          ...sections.faq,
                          items: sections.faq.items.filter((_, i) => i !== index),
                        },
                      })
                    }
                    className="text-xs font-medium text-danger hover:underline"
                  >
                    Remove
                  </button>
                </div>
                <Field label="Question" id={`ve-apply-faq-q-${index}`}>
                  <TextInput
                    id={`ve-apply-faq-q-${index}`}
                    value={item.q}
                    onChange={(e) => {
                      const items = sections.faq.items.map((row, i) =>
                        i === index ? { ...row, q: e.target.value } : row,
                      );
                      onChange({
                        ...sections,
                        faq: { ...sections.faq, items },
                      });
                    }}
                  />
                </Field>
                <Field label="Answer" id={`ve-apply-faq-a-${index}`}>
                  <TextArea
                    id={`ve-apply-faq-a-${index}`}
                    rows={3}
                    value={item.a}
                    onChange={(e) => {
                      const items = sections.faq.items.map((row, i) =>
                        i === index ? { ...row, a: e.target.value } : row,
                      );
                      onChange({
                        ...sections,
                        faq: { ...sections.faq, items },
                      });
                    }}
                  />
                </Field>
              </div>
            ))}
            <button
              type="button"
              onClick={() =>
                onChange({
                  ...sections,
                  faq: {
                    ...sections.faq,
                    items: [...sections.faq.items, emptyApplyFaqItem()],
                  },
                })
              }
              className="text-sm font-medium text-forest hover:text-forest-dark"
            >
              + Add question
            </button>
          </>
        ) : null}

        {target === "cta" ? (
          <>
            <Field label="Eyebrow" id="ve-apply-cta-eyebrow">
              <TextInput
                id="ve-apply-cta-eyebrow"
                value={sections.cta.eyebrow}
                onChange={(e) =>
                  onChange({
                    ...sections,
                    cta: { ...sections.cta, eyebrow: e.target.value },
                  })
                }
              />
            </Field>
            <Field label="Headline" id="ve-apply-cta-headline">
              <TextArea
                id="ve-apply-cta-headline"
                rows={2}
                value={sections.cta.headline}
                onChange={(e) =>
                  onChange({
                    ...sections,
                    cta: { ...sections.cta, headline: e.target.value },
                  })
                }
              />
            </Field>
            <Field label="Body" id="ve-apply-cta-body">
              <TextArea
                id="ve-apply-cta-body"
                rows={3}
                value={sections.cta.body}
                onChange={(e) =>
                  onChange({
                    ...sections,
                    cta: { ...sections.cta, body: e.target.value },
                  })
                }
              />
            </Field>
            <Field label="Primary button" id="ve-apply-cta-primary">
              <TextInput
                id="ve-apply-cta-primary"
                value={sections.cta.primaryCta}
                onChange={(e) =>
                  onChange({
                    ...sections,
                    cta: { ...sections.cta, primaryCta: e.target.value },
                  })
                }
              />
            </Field>
            <Field label="Primary URL" id="ve-apply-cta-primary-href">
              <TextInput
                id="ve-apply-cta-primary-href"
                value={sections.cta.primaryHref}
                onChange={(e) =>
                  onChange({
                    ...sections,
                    cta: { ...sections.cta, primaryHref: e.target.value },
                  })
                }
              />
            </Field>
            <Field label="Secondary button" id="ve-apply-cta-secondary">
              <TextInput
                id="ve-apply-cta-secondary"
                value={sections.cta.secondaryCta}
                onChange={(e) =>
                  onChange({
                    ...sections,
                    cta: { ...sections.cta, secondaryCta: e.target.value },
                  })
                }
              />
            </Field>
            <Field label="Secondary URL" id="ve-apply-cta-secondary-href">
              <TextInput
                id="ve-apply-cta-secondary-href"
                value={sections.cta.secondaryHref}
                onChange={(e) =>
                  onChange({
                    ...sections,
                    cta: { ...sections.cta, secondaryHref: e.target.value },
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

function ApplyView({
  sections,
  editing,
  selected,
  onSelect,
}: {
  sections: ApplyPageSections;
  editing: boolean;
  selected: EditTarget | null;
  onSelect: (target: EditTarget) => void;
}) {
  const nextItems = sections.hero.next.filter((item) => item.trim());
  const fitItems = sections.qualify.fit.filter((item) => item.trim());
  const notFitItems = sections.qualify.notFit.filter((item) => item.trim());
  const faqItems = sections.faq.items.filter(
    (item) => item.q.trim() || item.a.trim(),
  );

  return (
    <>
      <section
        id="apply"
        className="scroll-mt-24 bg-cream px-6 pt-8 pb-12 md:px-10 md:pt-10 md:pb-16 lg:px-12 lg:pt-12 lg:pb-20"
      >
        <div
          className={`${PAGE_SHELL} grid gap-6 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)] lg:items-stretch lg:gap-8`}
        >
          <FadeUp
            y={18}
            duration={1000}
            threshold={0.05}
            rootMargin="0px"
            className="h-full"
          >
            {hit(
              editing,
              "hero",
              selected,
              onSelect,
              "apply intro",
              <div className="flex h-full flex-col rounded-sm border border-charcoal/10 bg-white p-5 shadow-[0_12px_40px_rgba(28,26,23,0.06)] md:p-6">
                <div>
                  {sections.hero.badge.trim() ? (
                    <p className="inline-flex items-center gap-2 rounded-full border border-charcoal/20 px-3 py-1 text-[0.6875rem] font-medium text-charcoal">
                      <span
                        className="size-1.5 rounded-full bg-forest"
                        aria-hidden
                      />
                      {sections.hero.badge}
                    </p>
                  ) : null}
                  <MultilineText
                    as="h1"
                    text={sections.hero.headline}
                    className="mt-4 max-w-[15ch] font-display text-[1.85rem] leading-[1.08] tracking-tight text-charcoal sm:text-[2.15rem] md:text-[2.35rem]"
                  />
                  <p className="mt-3 max-w-[32rem] text-[0.9375rem] leading-relaxed text-charcoal/65">
                    {sections.hero.subhead}
                  </p>
                </div>

                {nextItems.length > 0 ? (
                  <div className="mt-auto border-t border-charcoal/10 pt-4">
                    <p className={EYEBROW_MUTED}>{sections.hero.nextEyebrow}</p>
                    <ol className="mt-3 space-y-2">
                      {nextItems.map((item, i) => (
                        <li
                          key={`${item}-${i}`}
                          className="flex items-start gap-3"
                        >
                          <span className="w-5 shrink-0 pt-px text-[0.6875rem] font-medium tracking-[0.1em] text-forest">
                            {String(i + 1).padStart(2, "0")}
                          </span>
                          <span className="text-[0.8125rem] leading-snug text-charcoal/65">
                            {item}
                          </span>
                        </li>
                      ))}
                    </ol>
                  </div>
                ) : null}
              </div>,
              { block: true, ringOffset: "ring-offset-white" },
            )}
          </FadeUp>

          <FadeUp
            delay={140}
            y={18}
            duration={1000}
            threshold={0.05}
            rootMargin="0px"
            className="h-full"
          >
            <RepresentationApplicationForm />
          </FadeUp>
        </div>
      </section>

      <section className="bg-cream px-6 pt-0 pb-16 md:px-10 md:pb-20 lg:px-12 lg:pb-24">
        <div className={PAGE_SHELL}>
          <FadeUp>
            {hit(
              editing,
              "benefits",
              selected,
              onSelect,
              "what you get",
              <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,24rem)] lg:items-end">
                <div>
                  <p className={EYEBROW}>{sections.benefits.eyebrow}</p>
                  <h2 className="mt-3 max-w-[16ch] font-display text-[2rem] leading-[1.12] tracking-tight text-charcoal md:text-[2.5rem]">
                    {sections.benefits.headline}
                  </h2>
                </div>
                <p className="text-[0.9375rem] leading-relaxed text-charcoal/60">
                  {sections.benefits.subhead}
                </p>
              </div>,
              { block: true },
            )}
          </FadeUp>
          <ul className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {sections.benefits.items.map((item, index) => {
              const Icon = BENEFIT_ICON[item.icon] ?? EnvelopeSimple;
              return (
                <li key={`${item.title}-${index}`}>
                  <FadeUp
                    delay={index * 80}
                    y={18}
                    threshold={0.15}
                    className="h-full"
                  >
                    {hit(
                      editing,
                      `benefit.${index}`,
                      selected,
                      onSelect,
                      item.title || `benefit ${index + 1}`,
                      <div className="flex h-full min-h-[13.75rem] flex-col rounded-sm bg-cream-dark p-7">
                        <Icon
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
                      </div>,
                      { block: true, ringOffset: "ring-offset-cream-dark" },
                    )}
                  </FadeUp>
                </li>
              );
            })}
          </ul>
        </div>
      </section>

      <section className="bg-white px-6 py-16 md:px-10 md:py-20 lg:px-12 lg:py-24">
        <div className={PAGE_SHELL}>
          <FadeUp>
            {hit(
              editing,
              "qualify",
              selected,
              onSelect,
              "self qualify",
              <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,24rem)] lg:items-end">
                <div>
                  <p className={EYEBROW}>{sections.qualify.eyebrow}</p>
                  <h2 className="mt-3 max-w-[16ch] font-display text-[2rem] leading-[1.12] tracking-tight text-charcoal md:text-[2.5rem]">
                    {sections.qualify.headline}
                  </h2>
                </div>
                <p className="text-[0.9375rem] leading-relaxed text-charcoal/60">
                  {sections.qualify.subhead}
                </p>
              </div>,
              { block: true },
            )}
          </FadeUp>

          <div className="mt-12 grid gap-4 lg:grid-cols-2">
            <FadeUp>
              {hit(
                editing,
                "fit",
                selected,
                onSelect,
                "likely a fit",
                <div className="rounded-sm bg-forest-dark p-8 text-cream md:p-10">
                  <p className={EYEBROW_ON_DARK}>{sections.qualify.fitEyebrow}</p>
                  <ul className="mt-6">
                    {fitItems.map((item) => (
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
                </div>,
                { block: true, ringOffset: "ring-offset-forest-dark" },
              )}
            </FadeUp>
            <FadeUp delay={100}>
              {hit(
                editing,
                "notFit",
                selected,
                onSelect,
                "probably not a fit",
                <div className="rounded-sm bg-cream-dark p-8 md:p-10">
                  <p className={EYEBROW_MUTED}>
                    {sections.qualify.notFitEyebrow}
                  </p>
                  <ul className="mt-6">
                    {notFitItems.map((item) => (
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
                </div>,
                { block: true, ringOffset: "ring-offset-cream-dark" },
              )}
            </FadeUp>
          </div>
        </div>
      </section>

      <section className="bg-charcoal px-6 py-16 text-cream md:px-10 md:py-20 lg:px-12 lg:py-24">
        <div className={PAGE_SHELL}>
          <FadeUp>
            {hit(
              editing,
              "path",
              selected,
              onSelect,
              "the path",
              <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,22rem)] lg:items-end">
                <div>
                  <p className={EYEBROW_ON_DARK}>{sections.path.eyebrow}</p>
                  <h2 className="mt-3 max-w-[18ch] font-display text-[2rem] leading-[1.12] tracking-tight md:text-[2.65rem]">
                    {sections.path.headline}
                  </h2>
                </div>
                <p className="text-[0.9375rem] leading-relaxed text-cream/60">
                  {sections.path.subhead}
                </p>
              </div>,
              { block: true, ringOffset: "ring-offset-charcoal" },
            )}
          </FadeUp>

          <ol className="mt-12">
            {sections.path.steps.map((step, index) => (
              <li key={`${step.n}-${index}`}>
                <FadeUp delay={index * 80} y={18} threshold={0.15}>
                  {hit(
                    editing,
                    `path.${index}`,
                    selected,
                    onSelect,
                    step.title || `step ${index + 1}`,
                    <div
                      className={`grid gap-4 py-8 md:grid-cols-[5.5rem_minmax(0,16rem)_minmax(0,1fr)] md:items-start md:gap-8 lg:grid-cols-[7rem_minmax(0,18rem)_minmax(0,1fr)] ${
                        index === sections.path.steps.length - 1
                          ? "border-y border-cream/12"
                          : "border-t border-cream/12"
                      }`}
                    >
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
                          <span
                            className="size-1.5 rounded-full bg-cream"
                            aria-hidden
                          />
                          {step.outcome}
                        </p>
                      </div>
                    </div>,
                    { block: true, ringOffset: "ring-offset-charcoal" },
                  )}
                </FadeUp>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="bg-cream px-6 pt-16 pb-8 md:px-10 md:pt-20 md:pb-10 lg:px-12 lg:pt-24 lg:pb-12">
        <div className={PAGE_SHELL}>
          <FadeUp>
            {hit(
              editing,
              "faq",
              selected,
              onSelect,
              "FAQ",
              <div className="mx-auto max-w-[52.5rem] text-center">
                <p className={EYEBROW}>{sections.faq.eyebrow}</p>
                <h2 className="mt-4 font-display text-[2rem] leading-[1.1] tracking-tight text-charcoal md:text-[3.25rem]">
                  {sections.faq.headline}
                </h2>
                <p className="mx-auto mt-5 max-w-[32.5rem] text-[1.0625rem] leading-relaxed text-charcoal/70">
                  {sections.faq.subhead}
                </p>
              </div>,
              { block: true },
            )}
          </FadeUp>
          <div className="mt-14">
            {hit(
              editing,
              "faq",
              selected,
              onSelect,
              "FAQ items",
              <RepresentationFaq items={faqItems} />,
              { block: true },
            )}
          </div>
        </div>
      </section>

      <section className="bg-cream px-6 py-16 md:px-10 md:py-20 lg:px-12 lg:py-24">
        <div className={PAGE_SHELL}>
          <FadeUp>
            {hit(
              editing,
              "cta",
              selected,
              onSelect,
              "start application",
              <div className="grid items-end gap-10 rounded-sm bg-forest-dark px-8 py-10 text-cream md:grid-cols-[minmax(0,1.4fr)_minmax(0,17rem)] md:px-12 md:py-14">
                <div>
                  <p className={EYEBROW_ON_DARK}>{sections.cta.eyebrow}</p>
                  <h2 className="mt-3 font-display text-[2rem] leading-[1.12] tracking-tight md:text-[2.5rem]">
                    {sections.cta.headline}
                  </h2>
                  <p className="mt-4 max-w-[32rem] text-[0.9375rem] leading-relaxed text-cream/70">
                    {sections.cta.body}
                  </p>
                </div>
                <div className="flex flex-col gap-3">
                  {sections.cta.primaryHref.trim() === "#apply" ||
                  !sections.cta.primaryHref.trim() ? (
                    <RepresentationApplyCta surface="dark" className="w-full">
                      {sections.cta.primaryCta}
                    </RepresentationApplyCta>
                  ) : (
                    <a
                      href={sections.cta.primaryHref}
                      className="inline-flex w-full items-center justify-center gap-2 rounded-sm bg-cream px-6 py-3.5 text-[0.875rem] font-medium text-charcoal shadow-[0_8px_28px_rgba(28,26,23,0.18)] transition-colors hover:bg-cream-dark"
                    >
                      {sections.cta.primaryCta}
                    </a>
                  )}
                  <PageGhostLink
                    href={sections.cta.secondaryHref || "/roster"}
                    onDark
                    className="w-full"
                  >
                    {sections.cta.secondaryCta}
                  </PageGhostLink>
                </div>
              </div>,
              { block: true, ringOffset: "ring-offset-forest-dark" },
            )}
          </FadeUp>
        </div>
      </section>
    </>
  );
}

export function ApplyVisualEditor({
  initial,
  canEdit,
  saveAction,
}: {
  initial: ApplyPageSections;
  canEdit: boolean;
  saveAction: typeof import("@/lib/actions/admin-cms").saveApplyPage;
}) {
  const router = useRouter();
  const [editing, setEditing] = useState(false);
  const [sections, setSections] = useState(initial);
  const [baseline, setBaseline] = useState(initial);
  const [target, setTarget] = useState<EditTarget | null>(null);
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
    setMessage(result.ok ? "Apply page saved." : result.message);
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
      <ApplyView
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
                href="/admin/pages/apply-for-representation"
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
