"use client";

import { Check, Minus } from "@phosphor-icons/react";
import { useEffect, useId, useRef, useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";

import { EditableHit, MultilineText } from "@/components/editable-hit";
import { FadeUp } from "@/components/fade-up";
import {
  EYEBROW,
  EYEBROW_MUTED,
  PAGE_SHELL,
  PageGhostLink,
  PagePrimaryLink,
} from "@/components/inner-page";
import { MediaField } from "@/components/media-library";
import { PatternField } from "@/components/pattern-field";
import { ProcessTimeline } from "@/components/process-timeline";
import { RepresentationFaq } from "@/components/representation-faq";
import { SiteImage } from "@/components/site-image";
import { Button, Field, TextArea, TextInput } from "@/components/ui";
import { WhatWeDoServices } from "@/components/what-we-do-services";
import {
  emptyWhatWeDoFaqItem,
  emptyWhatWeDoMatrixRow,
  emptyWhatWeDoMoment,
  emptyWhatWeDoProof,
  emptyWhatWeDoService,
  emptyWhatWeDoStep,
  formatsToText,
  textToFormats,
  type WhatWeDoPageSections,
} from "@/lib/what-we-do";

type EditTarget =
  | "hero"
  | "system"
  | "moments"
  | "servicesHeader"
  | `service.${number}`
  | "process"
  | "chooseHeader"
  | `choose.${number}`
  | "cta"
  | "faq";

function targetTitle(target: EditTarget): string {
  if (target.startsWith("service.")) {
    return `Service ${Number(target.split(".")[1]) + 1}`;
  }
  if (target.startsWith("choose.")) {
    return `Moment ${Number(target.split(".")[1]) + 1}`;
  }
  const map: Record<string, string> = {
    hero: "Hero",
    system: "Service system",
    moments: "Business moments",
    servicesHeader: "Services intro",
    process: "Process",
    chooseHeader: "How to choose",
    cta: "Closing CTA",
    faq: "FAQ",
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

function LaneMark({ on }: { on: boolean }) {
  return (
    <span
      className={`inline-flex size-7 items-center justify-center rounded-sm ${
        on ? "bg-forest-dark text-cream" : "bg-charcoal/8 text-charcoal/30"
      }`}
    >
      {on ? (
        <Check weight="bold" className="size-3.5" aria-hidden />
      ) : (
        <Minus weight="bold" className="size-3.5" aria-hidden />
      )}
    </span>
  );
}

function EditorPopover({
  target,
  sections,
  onChange,
  onClose,
}: {
  target: EditTarget;
  sections: WhatWeDoPageSections;
  onChange: (next: WhatWeDoPageSections) => void;
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

  const serviceIndex = target.startsWith("service.")
    ? Number(target.split(".")[1])
    : -1;
  const chooseIndex = target.startsWith("choose.")
    ? Number(target.split(".")[1])
    : -1;
  const service = serviceIndex >= 0 ? sections.services.cards[serviceIndex] : null;
  const chooseRow = chooseIndex >= 0 ? sections.choose.rows[chooseIndex] : null;

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
              id="ve-wwd-hero-headline"
              hint="Line breaks become new lines on the page."
            >
              <TextArea
                id="ve-wwd-hero-headline"
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
            <Field label="Subhead" id="ve-wwd-hero-subhead">
              <TextArea
                id="ve-wwd-hero-subhead"
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
            <Field label="Primary button" id="ve-wwd-hero-primary">
              <TextInput
                id="ve-wwd-hero-primary"
                value={sections.hero.primaryCta}
                onChange={(e) =>
                  onChange({
                    ...sections,
                    hero: { ...sections.hero, primaryCta: e.target.value },
                  })
                }
              />
            </Field>
            <Field label="Primary URL" id="ve-wwd-hero-primary-href">
              <TextInput
                id="ve-wwd-hero-primary-href"
                value={sections.hero.primaryHref}
                onChange={(e) =>
                  onChange({
                    ...sections,
                    hero: { ...sections.hero, primaryHref: e.target.value },
                  })
                }
              />
            </Field>
            <Field label="Secondary button" id="ve-wwd-hero-secondary">
              <TextInput
                id="ve-wwd-hero-secondary"
                value={sections.hero.secondaryCta}
                onChange={(e) =>
                  onChange({
                    ...sections,
                    hero: { ...sections.hero, secondaryCta: e.target.value },
                  })
                }
              />
            </Field>
            <Field label="Secondary URL" id="ve-wwd-hero-secondary-href">
              <TextInput
                id="ve-wwd-hero-secondary-href"
                value={sections.hero.secondaryHref}
                onChange={(e) =>
                  onChange({
                    ...sections,
                    hero: { ...sections.hero, secondaryHref: e.target.value },
                  })
                }
              />
            </Field>
            {sections.hero.proofs.map((proof, index) => (
              <div
                key={`ve-wwd-proof-${index}`}
                className="space-y-3 rounded-sm border border-charcoal/10 p-3"
              >
                <div className="flex items-center justify-between gap-3">
                  <p className="text-sm font-medium">Proof {index + 1}</p>
                  <button
                    type="button"
                    onClick={() =>
                      onChange({
                        ...sections,
                        hero: {
                          ...sections.hero,
                          proofs: sections.hero.proofs.filter((_, i) => i !== index),
                        },
                      })
                    }
                    className="text-xs font-medium text-danger hover:underline"
                  >
                    Remove
                  </button>
                </div>
                <Field label="Title" id={`ve-wwd-proof-title-${index}`}>
                  <TextInput
                    id={`ve-wwd-proof-title-${index}`}
                    value={proof.title}
                    onChange={(e) => {
                      const proofs = sections.hero.proofs.map((row, i) =>
                        i === index ? { ...row, title: e.target.value } : row,
                      );
                      onChange({ ...sections, hero: { ...sections.hero, proofs } });
                    }}
                  />
                </Field>
                <Field label="Body" id={`ve-wwd-proof-body-${index}`}>
                  <TextArea
                    id={`ve-wwd-proof-body-${index}`}
                    rows={2}
                    value={proof.body}
                    onChange={(e) => {
                      const proofs = sections.hero.proofs.map((row, i) =>
                        i === index ? { ...row, body: e.target.value } : row,
                      );
                      onChange({ ...sections, hero: { ...sections.hero, proofs } });
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
                  hero: {
                    ...sections.hero,
                    proofs: [...sections.hero.proofs, emptyWhatWeDoProof()],
                  },
                })
              }
              className="text-sm font-medium text-forest hover:text-forest-dark"
            >
              + Add proof
            </button>
          </>
        ) : null}

        {target === "system" ? (
          <>
            <MediaField
              label="Panel image"
              value={sections.hero.system.image}
              onChange={(image) =>
                onChange({
                  ...sections,
                  hero: {
                    ...sections.hero,
                    system: { ...sections.hero.system, image },
                  },
                })
              }
            />
          </>
        ) : null}

        {target === "moments" ? (
          <>
            <Field
              label="Headline"
              id="ve-wwd-moments-headline"
              hint="Line breaks become new lines on the page."
            >
              <TextArea
                id="ve-wwd-moments-headline"
                rows={3}
                value={sections.moments.headline}
                onChange={(e) =>
                  onChange({
                    ...sections,
                    moments: { ...sections.moments, headline: e.target.value },
                  })
                }
              />
            </Field>
            <Field label="Subhead" id="ve-wwd-moments-subhead">
              <TextArea
                id="ve-wwd-moments-subhead"
                rows={3}
                value={sections.moments.subhead}
                onChange={(e) =>
                  onChange({
                    ...sections,
                    moments: { ...sections.moments, subhead: e.target.value },
                  })
                }
              />
            </Field>
            {sections.moments.items.map((item, index) => (
              <div
                key={`ve-wwd-moment-${index}`}
                className="space-y-3 rounded-sm border border-charcoal/10 p-3"
              >
                <div className="flex items-center justify-between gap-3">
                  <p className="text-sm font-medium">Moment {index + 1}</p>
                  <button
                    type="button"
                    onClick={() =>
                      onChange({
                        ...sections,
                        moments: {
                          ...sections.moments,
                          items: sections.moments.items.filter((_, i) => i !== index),
                        },
                      })
                    }
                    className="text-xs font-medium text-danger hover:underline"
                  >
                    Remove
                  </button>
                </div>
                <Field label="Eyebrow" id={`ve-wwd-moment-eyebrow-${index}`}>
                  <TextInput
                    id={`ve-wwd-moment-eyebrow-${index}`}
                    value={item.eyebrow}
                    onChange={(e) => {
                      const items = sections.moments.items.map((row, i) =>
                        i === index ? { ...row, eyebrow: e.target.value } : row,
                      );
                      onChange({
                        ...sections,
                        moments: { ...sections.moments, items },
                      });
                    }}
                  />
                </Field>
                <Field label="Title" id={`ve-wwd-moment-title-${index}`}>
                  <TextInput
                    id={`ve-wwd-moment-title-${index}`}
                    value={item.title}
                    onChange={(e) => {
                      const items = sections.moments.items.map((row, i) =>
                        i === index ? { ...row, title: e.target.value } : row,
                      );
                      onChange({
                        ...sections,
                        moments: { ...sections.moments, items },
                      });
                    }}
                  />
                </Field>
                <Field label="Body" id={`ve-wwd-moment-body-${index}`}>
                  <TextArea
                    id={`ve-wwd-moment-body-${index}`}
                    rows={3}
                    value={item.body}
                    onChange={(e) => {
                      const items = sections.moments.items.map((row, i) =>
                        i === index ? { ...row, body: e.target.value } : row,
                      );
                      onChange({
                        ...sections,
                        moments: { ...sections.moments, items },
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
                  moments: {
                    ...sections.moments,
                    items: [...sections.moments.items, emptyWhatWeDoMoment()],
                  },
                })
              }
              className="text-sm font-medium text-forest hover:text-forest-dark"
            >
              + Add moment
            </button>
          </>
        ) : null}

        {target === "servicesHeader" ? (
          <>
            <Field label="Eyebrow" id="ve-wwd-services-eyebrow">
              <TextInput
                id="ve-wwd-services-eyebrow"
                value={sections.services.eyebrow}
                onChange={(e) =>
                  onChange({
                    ...sections,
                    services: { ...sections.services, eyebrow: e.target.value },
                  })
                }
              />
            </Field>
            <Field label="Headline" id="ve-wwd-services-headline">
              <TextArea
                id="ve-wwd-services-headline"
                rows={3}
                value={sections.services.headline}
                onChange={(e) =>
                  onChange({
                    ...sections,
                    services: { ...sections.services, headline: e.target.value },
                  })
                }
              />
            </Field>
            <Field label="Subhead" id="ve-wwd-services-subhead">
              <TextArea
                id="ve-wwd-services-subhead"
                rows={3}
                value={sections.services.subhead}
                onChange={(e) =>
                  onChange({
                    ...sections,
                    services: { ...sections.services, subhead: e.target.value },
                  })
                }
              />
            </Field>
          </>
        ) : null}

        {service ? (
          <>
            <Field label="Number" id="ve-wwd-service-n">
              <TextInput
                id="ve-wwd-service-n"
                value={service.n}
                onChange={(e) => {
                  const cards = sections.services.cards.map((row, i) =>
                    i === serviceIndex ? { ...row, n: e.target.value } : row,
                  );
                  onChange({
                    ...sections,
                    services: { ...sections.services, cards },
                  });
                }}
              />
            </Field>
            <Field label="Lane" id="ve-wwd-service-lane">
              <TextInput
                id="ve-wwd-service-lane"
                value={service.lane}
                onChange={(e) => {
                  const cards = sections.services.cards.map((row, i) =>
                    i === serviceIndex ? { ...row, lane: e.target.value } : row,
                  );
                  onChange({
                    ...sections,
                    services: { ...sections.services, cards },
                  });
                }}
              />
            </Field>
            <Field label="Title" id="ve-wwd-service-title">
              <TextInput
                id="ve-wwd-service-title"
                value={service.title}
                onChange={(e) => {
                  const cards = sections.services.cards.map((row, i) =>
                    i === serviceIndex ? { ...row, title: e.target.value } : row,
                  );
                  onChange({
                    ...sections,
                    services: { ...sections.services, cards },
                  });
                }}
              />
            </Field>
            <Field label="Body" id="ve-wwd-service-body">
              <TextArea
                id="ve-wwd-service-body"
                rows={4}
                value={service.body}
                onChange={(e) => {
                  const cards = sections.services.cards.map((row, i) =>
                    i === serviceIndex ? { ...row, body: e.target.value } : row,
                  );
                  onChange({
                    ...sections,
                    services: { ...sections.services, cards },
                  });
                }}
              />
            </Field>
            <Field
              label="Formats"
              id="ve-wwd-service-formats"
              hint="One format per line."
            >
              <TextArea
                id="ve-wwd-service-formats"
                rows={5}
                value={formatsToText(service.formats)}
                onChange={(e) => {
                  const cards = sections.services.cards.map((row, i) =>
                    i === serviceIndex
                      ? { ...row, formats: textToFormats(e.target.value) }
                      : row,
                  );
                  onChange({
                    ...sections,
                    services: { ...sections.services, cards },
                  });
                }}
              />
            </Field>
            <Field label="Best for" id="ve-wwd-service-best">
              <TextArea
                id="ve-wwd-service-best"
                rows={3}
                value={service.bestFor}
                onChange={(e) => {
                  const cards = sections.services.cards.map((row, i) =>
                    i === serviceIndex
                      ? { ...row, bestFor: e.target.value }
                      : row,
                  );
                  onChange({
                    ...sections,
                    services: { ...sections.services, cards },
                  });
                }}
              />
            </Field>
            <button
              type="button"
              onClick={() => {
                onChange({
                  ...sections,
                  services: {
                    ...sections.services,
                    cards: sections.services.cards.filter(
                      (_, i) => i !== serviceIndex,
                    ),
                  },
                });
                onClose();
              }}
              className="text-sm font-medium text-danger hover:underline"
            >
              Remove this service
            </button>
          </>
        ) : null}

        {target === "process" ? (
          <>
            <Field label="Headline" id="ve-wwd-process-headline">
              <TextArea
                id="ve-wwd-process-headline"
                rows={2}
                value={sections.process.headline}
                onChange={(e) =>
                  onChange({
                    ...sections,
                    process: { ...sections.process, headline: e.target.value },
                  })
                }
              />
            </Field>
            <Field label="Body" id="ve-wwd-process-body">
              <TextArea
                id="ve-wwd-process-body"
                rows={4}
                value={sections.process.body}
                onChange={(e) =>
                  onChange({
                    ...sections,
                    process: { ...sections.process, body: e.target.value },
                  })
                }
              />
            </Field>
            <Field label="Footnote" id="ve-wwd-process-footnote">
              <TextArea
                id="ve-wwd-process-footnote"
                rows={3}
                value={sections.process.footnote}
                onChange={(e) =>
                  onChange({
                    ...sections,
                    process: { ...sections.process, footnote: e.target.value },
                  })
                }
              />
            </Field>
            <Field label="Button" id="ve-wwd-process-cta">
              <TextInput
                id="ve-wwd-process-cta"
                value={sections.process.ctaLabel}
                onChange={(e) =>
                  onChange({
                    ...sections,
                    process: { ...sections.process, ctaLabel: e.target.value },
                  })
                }
              />
            </Field>
            <Field label="Button URL" id="ve-wwd-process-cta-href">
              <TextInput
                id="ve-wwd-process-cta-href"
                value={sections.process.ctaHref}
                onChange={(e) =>
                  onChange({
                    ...sections,
                    process: { ...sections.process, ctaHref: e.target.value },
                  })
                }
              />
            </Field>
            {sections.process.steps.map((step, index) => (
              <div
                key={`ve-wwd-step-${index}`}
                className="space-y-3 rounded-sm border border-charcoal/10 p-3"
              >
                <div className="flex items-center justify-between gap-3">
                  <p className="text-sm font-medium">Step {index + 1}</p>
                  <button
                    type="button"
                    onClick={() =>
                      onChange({
                        ...sections,
                        process: {
                          ...sections.process,
                          steps: sections.process.steps.filter((_, i) => i !== index),
                        },
                      })
                    }
                    className="text-xs font-medium text-danger hover:underline"
                  >
                    Remove
                  </button>
                </div>
                <Field label="Number" id={`ve-wwd-step-n-${index}`}>
                  <TextInput
                    id={`ve-wwd-step-n-${index}`}
                    value={step.n}
                    onChange={(e) => {
                      const steps = sections.process.steps.map((row, i) =>
                        i === index ? { ...row, n: e.target.value } : row,
                      );
                      onChange({
                        ...sections,
                        process: { ...sections.process, steps },
                      });
                    }}
                  />
                </Field>
                <Field label="Title" id={`ve-wwd-step-title-${index}`}>
                  <TextInput
                    id={`ve-wwd-step-title-${index}`}
                    value={step.title}
                    onChange={(e) => {
                      const steps = sections.process.steps.map((row, i) =>
                        i === index ? { ...row, title: e.target.value } : row,
                      );
                      onChange({
                        ...sections,
                        process: { ...sections.process, steps },
                      });
                    }}
                  />
                </Field>
                <Field label="Body" id={`ve-wwd-step-body-${index}`}>
                  <TextArea
                    id={`ve-wwd-step-body-${index}`}
                    rows={2}
                    value={step.body}
                    onChange={(e) => {
                      const steps = sections.process.steps.map((row, i) =>
                        i === index ? { ...row, body: e.target.value } : row,
                      );
                      onChange({
                        ...sections,
                        process: { ...sections.process, steps },
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
                  process: {
                    ...sections.process,
                    steps: [...sections.process.steps, emptyWhatWeDoStep()],
                  },
                })
              }
              className="text-sm font-medium text-forest hover:text-forest-dark"
            >
              + Add step
            </button>
          </>
        ) : null}

        {target === "chooseHeader" ? (
          <>
            <Field label="Eyebrow" id="ve-wwd-choose-eyebrow">
              <TextInput
                id="ve-wwd-choose-eyebrow"
                value={sections.choose.eyebrow}
                onChange={(e) =>
                  onChange({
                    ...sections,
                    choose: { ...sections.choose, eyebrow: e.target.value },
                  })
                }
              />
            </Field>
            <Field label="Headline" id="ve-wwd-choose-headline">
              <TextArea
                id="ve-wwd-choose-headline"
                rows={3}
                value={sections.choose.headline}
                onChange={(e) =>
                  onChange({
                    ...sections,
                    choose: { ...sections.choose, headline: e.target.value },
                  })
                }
              />
            </Field>
            <Field label="Subhead" id="ve-wwd-choose-subhead">
              <TextArea
                id="ve-wwd-choose-subhead"
                rows={3}
                value={sections.choose.subhead}
                onChange={(e) =>
                  onChange({
                    ...sections,
                    choose: { ...sections.choose, subhead: e.target.value },
                  })
                }
              />
            </Field>
            <Field label="Moment column label" id="ve-wwd-choose-col-moment">
              <TextInput
                id="ve-wwd-choose-col-moment"
                value={sections.choose.colMoment}
                onChange={(e) =>
                  onChange({
                    ...sections,
                    choose: { ...sections.choose, colMoment: e.target.value },
                  })
                }
              />
            </Field>
            <Field label="Becomes column label" id="ve-wwd-choose-col-becomes">
              <TextInput
                id="ve-wwd-choose-col-becomes"
                value={sections.choose.colBecomes}
                onChange={(e) =>
                  onChange({
                    ...sections,
                    choose: { ...sections.choose, colBecomes: e.target.value },
                  })
                }
              />
            </Field>
            <Field
              label="Lane labels"
              id="ve-wwd-choose-lanes"
              hint="One label per line. Marks on each row follow this order."
            >
              <TextArea
                id="ve-wwd-choose-lanes"
                rows={4}
                value={sections.choose.laneLabels.join("\n")}
                onChange={(e) => {
                  const laneLabels = textToFormats(e.target.value);
                  const rows = sections.choose.rows.map((row) => ({
                    ...row,
                    lanes: Array.from(
                      { length: laneLabels.length },
                      (_, i) => row.lanes[i] ?? false,
                    ),
                  }));
                  onChange({
                    ...sections,
                    choose: { ...sections.choose, laneLabels, rows },
                  });
                }}
              />
            </Field>
          </>
        ) : null}

        {chooseRow ? (
          <>
            <Field label="Number" id="ve-wwd-choose-n">
              <TextInput
                id="ve-wwd-choose-n"
                value={chooseRow.n}
                onChange={(e) => {
                  const rows = sections.choose.rows.map((row, i) =>
                    i === chooseIndex ? { ...row, n: e.target.value } : row,
                  );
                  onChange({
                    ...sections,
                    choose: { ...sections.choose, rows },
                  });
                }}
              />
            </Field>
            <Field label="Moment" id="ve-wwd-choose-moment">
              <TextInput
                id="ve-wwd-choose-moment"
                value={chooseRow.moment}
                onChange={(e) => {
                  const rows = sections.choose.rows.map((row, i) =>
                    i === chooseIndex ? { ...row, moment: e.target.value } : row,
                  );
                  onChange({
                    ...sections,
                    choose: { ...sections.choose, rows },
                  });
                }}
              />
            </Field>
            <Field label="What it becomes" id="ve-wwd-choose-becomes">
              <TextArea
                id="ve-wwd-choose-becomes"
                rows={3}
                value={chooseRow.becomes}
                onChange={(e) => {
                  const rows = sections.choose.rows.map((row, i) =>
                    i === chooseIndex ? { ...row, becomes: e.target.value } : row,
                  );
                  onChange({
                    ...sections,
                    choose: { ...sections.choose, rows },
                  });
                }}
              />
            </Field>
            <fieldset className="space-y-2">
              <legend className="text-xs font-medium tracking-wide text-charcoal/55 uppercase">
                Starting lanes
              </legend>
              {sections.choose.laneLabels.map((label, laneIndex) => (
                <label
                  key={`${label}-${laneIndex}`}
                  className="flex items-center gap-2 text-sm text-charcoal"
                >
                  <input
                    type="checkbox"
                    checked={Boolean(chooseRow.lanes[laneIndex])}
                    onChange={(e) => {
                      const rows = sections.choose.rows.map((row, i) => {
                        if (i !== chooseIndex) return row;
                        const lanes = sections.choose.laneLabels.map(
                          (_, li) =>
                            li === laneIndex
                              ? e.target.checked
                              : Boolean(row.lanes[li]),
                        );
                        return { ...row, lanes };
                      });
                      onChange({
                        ...sections,
                        choose: { ...sections.choose, rows },
                      });
                    }}
                  />
                  {label}
                </label>
              ))}
            </fieldset>
            <button
              type="button"
              onClick={() => {
                onChange({
                  ...sections,
                  choose: {
                    ...sections.choose,
                    rows: sections.choose.rows.filter((_, i) => i !== chooseIndex),
                  },
                });
                onClose();
              }}
              className="text-sm font-medium text-danger hover:underline"
            >
              Remove this moment
            </button>
          </>
        ) : null}

        {target === "cta" ? (
          <>
            <Field
              label="Headline"
              id="ve-wwd-cta-headline"
              hint="Line breaks become new lines on the page."
            >
              <TextArea
                id="ve-wwd-cta-headline"
                rows={3}
                value={sections.cta.headline}
                onChange={(e) =>
                  onChange({
                    ...sections,
                    cta: { ...sections.cta, headline: e.target.value },
                  })
                }
              />
            </Field>
            <Field label="Body" id="ve-wwd-cta-body">
              <TextArea
                id="ve-wwd-cta-body"
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
            <Field label="Primary button" id="ve-wwd-cta-primary">
              <TextInput
                id="ve-wwd-cta-primary"
                value={sections.cta.primaryCta}
                onChange={(e) =>
                  onChange({
                    ...sections,
                    cta: { ...sections.cta, primaryCta: e.target.value },
                  })
                }
              />
            </Field>
            <Field label="Primary URL" id="ve-wwd-cta-primary-href">
              <TextInput
                id="ve-wwd-cta-primary-href"
                value={sections.cta.primaryHref}
                onChange={(e) =>
                  onChange({
                    ...sections,
                    cta: { ...sections.cta, primaryHref: e.target.value },
                  })
                }
              />
            </Field>
            <Field label="Secondary button" id="ve-wwd-cta-secondary">
              <TextInput
                id="ve-wwd-cta-secondary"
                value={sections.cta.secondaryCta}
                onChange={(e) =>
                  onChange({
                    ...sections,
                    cta: { ...sections.cta, secondaryCta: e.target.value },
                  })
                }
              />
            </Field>
            <Field label="Secondary URL" id="ve-wwd-cta-secondary-href">
              <TextInput
                id="ve-wwd-cta-secondary-href"
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

        {target === "faq" ? (
          <>
            <Field label="Eyebrow" id="ve-wwd-faq-eyebrow">
              <TextInput
                id="ve-wwd-faq-eyebrow"
                value={sections.faq.eyebrow}
                onChange={(e) =>
                  onChange({
                    ...sections,
                    faq: { ...sections.faq, eyebrow: e.target.value },
                  })
                }
              />
            </Field>
            <Field label="Headline" id="ve-wwd-faq-headline">
              <TextArea
                id="ve-wwd-faq-headline"
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
            <Field label="Subhead" id="ve-wwd-faq-subhead">
              <TextArea
                id="ve-wwd-faq-subhead"
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
                key={`ve-wwd-faq-${index}`}
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
                <Field label="Question" id={`ve-wwd-faq-q-${index}`}>
                  <TextInput
                    id={`ve-wwd-faq-q-${index}`}
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
                <Field label="Answer" id={`ve-wwd-faq-a-${index}`}>
                  <TextArea
                    id={`ve-wwd-faq-a-${index}`}
                    rows={4}
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
                    items: [...sections.faq.items, emptyWhatWeDoFaqItem()],
                  },
                })
              }
              className="text-sm font-medium text-forest hover:text-forest-dark"
            >
              + Add question
            </button>
          </>
        ) : null}
      </div>
    </div>
  );
}

function WhatWeDoView({
  sections,
  editing,
  selected,
  onSelect,
}: {
  sections: WhatWeDoPageSections;
  editing: boolean;
  selected: EditTarget | null;
  onSelect: (target: EditTarget) => void;
}) {
  const showHowToChoose = false;
  const laneCount = Math.max(sections.choose.laneLabels.length, 1);
  const matrixTemplate = `14rem minmax(0,1fr) repeat(${laneCount}, 5.5rem)`;
  const faqItems = sections.faq.items.filter(
    (item) => item.q.trim() || item.a.trim(),
  );

  return (
    <>
      <section className="bg-cream px-6 pt-10 pb-16 md:px-10 md:pt-14 md:pb-20 lg:px-12 lg:pt-16 lg:pb-24">
        <div
          className={`${PAGE_SHELL} grid items-stretch gap-8 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:gap-12`}
        >
          <FadeUp
            className="flex flex-col justify-between py-2"
            y={18}
            duration={1000}
            threshold={0.05}
            rootMargin="0px"
          >
            {hit(
              editing,
              "hero",
              selected,
              onSelect,
              "hero",
              <div>
                <MultilineText
                  as="h1"
                  text={sections.hero.headline}
                  className="max-w-[14ch] font-display text-[2.6rem] leading-[1.06] tracking-tight text-charcoal sm:text-[3.25rem] md:text-[3.75rem] lg:text-[4rem]"
                />
                <p className="mt-5 max-w-[34rem] text-[1.05rem] leading-relaxed text-charcoal/65">
                  {sections.hero.subhead}
                </p>
                <div className="mt-8 flex flex-wrap gap-3">
                  <PagePrimaryLink href={sections.hero.primaryHref || "/contact"}>
                    {sections.hero.primaryCta}
                  </PagePrimaryLink>
                  <PageGhostLink href={sections.hero.secondaryHref || "#services"}>
                    {sections.hero.secondaryCta}
                  </PageGhostLink>
                </div>
                <dl className="mt-12 grid gap-6 border-t border-charcoal/10 pt-6 sm:grid-cols-2">
                  {sections.hero.proofs.map((proof) => (
                    <div key={proof.title || proof.body}>
                      <dt className="font-display text-[1.15rem] leading-snug text-charcoal">
                        {proof.title}
                      </dt>
                      <dd className="mt-1.5 text-[0.875rem] leading-relaxed text-charcoal/58">
                        {proof.body}
                      </dd>
                    </div>
                  ))}
                </dl>
              </div>,
              { block: true },
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
            {hit(
              editing,
              "system",
              selected,
              onSelect,
              "service system",
              <div className="relative h-full min-h-[28rem] overflow-hidden rounded-sm bg-forest-dark md:min-h-[32rem]">
                {sections.hero.system.image.trim() ? (
                  <SiteImage
                    src={sections.hero.system.image}
                    alt=""
                    fill
                    sizes="(min-width: 1024px) 42vw, 100vw"
                    className="object-cover object-[center_35%]"
                  />
                ) : null}
              </div>,
              { block: true, ringOffset: "ring-offset-forest-dark" },
            )}
          </FadeUp>
        </div>
      </section>

      <section className="px-6 pb-16 md:px-10 md:pb-20 lg:px-12 lg:pb-24">
        <div className={PAGE_SHELL}>
          <FadeUp>
            {hit(
              editing,
              "moments",
              selected,
              onSelect,
              "business moments",
              <div className="rounded-sm bg-charcoal px-8 py-10 text-cream md:px-12 md:py-14">
                <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,26rem)] lg:items-end">
                  <MultilineText
                    as="h2"
                    text={sections.moments.headline}
                    className="max-w-[28ch] font-display text-[2rem] leading-[1.12] tracking-tight md:text-[2.5rem]"
                  />
                  <p className="text-[0.9375rem] leading-relaxed text-cream/65">
                    {sections.moments.subhead}
                  </p>
                </div>
                <ul className="mt-10 grid items-stretch gap-4 md:grid-cols-3">
                  {sections.moments.items.map((moment, index) => (
                    <li
                      key={`${moment.title}-${index}`}
                      className="flex h-full flex-col rounded-sm border border-cream/14 bg-cream/[0.07] p-6 md:p-7"
                    >
                      <p className="text-[0.68rem] font-medium tracking-[0.16em] text-cream/50 uppercase">
                        {moment.eyebrow}
                      </p>
                      <h3 className="mt-3 font-display text-[1.35rem] leading-snug tracking-tight">
                        {moment.title}
                      </h3>
                      <p className="mt-3 text-[0.875rem] leading-relaxed text-cream/65">
                        {moment.body}
                      </p>
                    </li>
                  ))}
                </ul>
              </div>,
              { block: true, ringOffset: "ring-offset-charcoal" },
            )}
          </FadeUp>
        </div>
      </section>

      <WhatWeDoServices
        content={sections.services}
        wrapHeader={(node) => (
          <FadeUp>
            {hit(
              editing,
              "servicesHeader",
              selected,
              onSelect,
              "services intro",
              node,
              { block: true },
            )}
          </FadeUp>
        )}
        wrapItem={(index, node) => (
          <FadeUp delay={index * 60} y={16} threshold={0.12}>
            {hit(
              editing,
              `service.${index}`,
              selected,
              onSelect,
              sections.services.cards[index]?.title || `service ${index + 1}`,
              node,
              { block: true },
            )}
          </FadeUp>
        )}
      />

      <section className="bg-cream-dark px-6 py-20 md:px-10 md:py-24 lg:px-12 lg:py-28">
        <div
          className={`${PAGE_SHELL} grid items-start gap-12 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:gap-16`}
        >
          <FadeUp className="lg:sticky lg:top-28">
            {hit(
              editing,
              "process",
              selected,
              onSelect,
              "process",
              <div>
                <h2 className="max-w-[18ch] font-display text-[2rem] leading-[1.12] tracking-tight text-charcoal md:text-[2.5rem]">
                  {sections.process.headline}
                </h2>
                <p className="mt-4 max-w-md text-[0.9375rem] leading-relaxed text-charcoal/62">
                  {sections.process.body}
                </p>
                <p className="mt-6 border-t border-charcoal/12 pt-6 text-[0.875rem] leading-relaxed text-charcoal/55">
                  {sections.process.footnote}
                </p>
                <PagePrimaryLink
                  href={sections.process.ctaHref || "/contact"}
                  className="mt-8"
                >
                  {sections.process.ctaLabel}
                </PagePrimaryLink>
              </div>,
              { block: true, ringOffset: "ring-offset-cream-dark" },
            )}
          </FadeUp>

          {hit(
            editing,
            "process",
            selected,
            onSelect,
            "process steps",
            <ProcessTimeline
              key={sections.process.steps
                .map((step) => `${step.n}:${step.title}`)
                .join("|")}
              steps={sections.process.steps}
            />,
            { block: true, ringOffset: "ring-offset-cream-dark" },
          )}
        </div>
      </section>

      {showHowToChoose ? (
      <section className="bg-cream px-6 py-20 md:px-10 md:py-24 lg:px-12 lg:py-28">
        <div className={PAGE_SHELL}>
          <FadeUp>
            {hit(
              editing,
              "chooseHeader",
              selected,
              onSelect,
              "how to choose",
              <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,22rem)] lg:items-end">
                <div>
                  <p className={EYEBROW}>{sections.choose.eyebrow}</p>
                  <h2 className="mt-3 max-w-[16ch] font-display text-[2rem] leading-[1.12] tracking-tight text-charcoal md:text-[2.65rem]">
                    {sections.choose.headline}
                  </h2>
                </div>
                <p className="text-[0.9375rem] leading-relaxed text-charcoal/60">
                  {sections.choose.subhead}
                </p>
              </div>,
              { block: true },
            )}
          </FadeUp>

          <FadeUp delay={80}>
            <div className="mt-12 hidden overflow-hidden rounded-sm border border-charcoal/10 lg:block">
              <div
                className="grid border-b border-charcoal/10 bg-cream-dark px-6 py-4 text-[0.68rem] font-medium tracking-[0.16em] text-charcoal/45 uppercase"
                style={{ gridTemplateColumns: matrixTemplate }}
              >
                <p>{sections.choose.colMoment}</p>
                <p>{sections.choose.colBecomes}</p>
                {sections.choose.laneLabels.map((label) => (
                  <p key={label} className="text-center">
                    {label}
                  </p>
                ))}
              </div>
              {sections.choose.rows.map((row, index) => (
                <div key={`${row.n}-${index}`}>
                  {hit(
                    editing,
                    `choose.${index}`,
                    selected,
                    onSelect,
                    row.moment || `moment ${index + 1}`,
                    <div
                      className={`grid items-center px-6 py-7 ${
                        index === sections.choose.rows.length - 1
                          ? ""
                          : "border-b border-charcoal/8"
                      }`}
                      style={{ gridTemplateColumns: matrixTemplate }}
                    >
                      <div>
                        <p className={EYEBROW_MUTED}>{row.n}</p>
                        <p className="mt-1 font-display text-[1.15rem] leading-snug text-charcoal">
                          {row.moment}
                        </p>
                      </div>
                      <p className="pr-8 text-[0.875rem] leading-relaxed text-charcoal/62">
                        {row.becomes}
                      </p>
                      {sections.choose.laneLabels.map((label, i) => (
                        <div key={`${label}-${i}`} className="flex justify-center">
                          <LaneMark on={Boolean(row.lanes[i])} />
                        </div>
                      ))}
                    </div>,
                    { block: true },
                  )}
                </div>
              ))}
            </div>
          </FadeUp>

          <ul className="mt-10 space-y-4 lg:hidden">
            {sections.choose.rows.map((row, index) => (
              <li key={`${row.n}-${index}`}>
                <FadeUp delay={index * 80}>
                  {hit(
                    editing,
                    `choose.${index}`,
                    selected,
                    onSelect,
                    row.moment || `moment ${index + 1}`,
                    <div className="rounded-sm border border-charcoal/10 bg-white p-5">
                      <p className={EYEBROW_MUTED}>{row.n}</p>
                      <h3 className="mt-1 font-display text-[1.25rem] leading-snug text-charcoal">
                        {row.moment}
                      </h3>
                      <p className="mt-2 text-[0.875rem] leading-relaxed text-charcoal/62">
                        {row.becomes}
                      </p>
                      <dl className="mt-4 grid gap-2 border-t border-charcoal/8 pt-4"
                        style={{
                          gridTemplateColumns: `repeat(${laneCount}, minmax(0, 1fr))`,
                        }}
                      >
                        {sections.choose.laneLabels.map((label, i) => (
                          <div
                            key={`${label}-${i}`}
                            className="flex flex-col items-center gap-2"
                          >
                            <LaneMark on={Boolean(row.lanes[i])} />
                            <dt className="text-[0.65rem] tracking-[0.08em] text-charcoal/45 uppercase">
                              {label}
                            </dt>
                          </div>
                        ))}
                      </dl>
                    </div>,
                    { block: true, ringOffset: "ring-offset-white" },
                  )}
                </FadeUp>
              </li>
            ))}
          </ul>
        </div>
      </section>
      ) : null}

      <section className="px-6 pt-10 pb-0 md:px-10 md:pt-12 lg:px-12 lg:pt-14">
        <div className={PAGE_SHELL}>
          <FadeUp>
            {hit(
              editing,
              "cta",
              selected,
              onSelect,
              "closing CTA",
              <div className="relative overflow-hidden rounded-sm bg-forest-dark text-cream">
                <div className="pointer-events-none absolute inset-0 overflow-hidden">
                  <PatternField
                    color={{ r: 249, g: 243, b: 239 }}
                    className="opacity-[0.13]"
                    mask="linear-gradient(to left, black 0%, rgba(0,0,0,0.4) 45%, transparent 88%)"
                  />
                </div>
                <div className="relative z-2 grid items-end gap-10 px-8 py-10 md:grid-cols-[minmax(0,1.4fr)_minmax(0,16rem)] md:px-12 md:py-14">
                  <div>
                    <MultilineText
                      as="h2"
                      text={sections.cta.headline}
                      className="font-display text-[2rem] leading-[1.12] tracking-tight md:text-[2.5rem]"
                    />
                    <p className="mt-4 max-w-[34rem] text-[0.9375rem] leading-relaxed text-cream/70">
                      {sections.cta.body}
                    </p>
                  </div>
                  <div className="flex flex-col gap-3">
                    <PagePrimaryLink
                      href={sections.cta.primaryHref || "/contact"}
                      tone="cream"
                      className="w-full"
                    >
                      {sections.cta.primaryCta}
                    </PagePrimaryLink>
                    <PageGhostLink
                      href={sections.cta.secondaryHref || "/roster"}
                      onDark
                      className="w-full"
                    >
                      {sections.cta.secondaryCta}
                    </PageGhostLink>
                  </div>
                </div>
              </div>,
              { block: true, ringOffset: "ring-offset-forest-dark" },
            )}
          </FadeUp>
        </div>
      </section>

      {faqItems.length > 0 ? (
        <section className="bg-cream px-6 pt-16 pb-10 md:px-10 md:pt-20 md:pb-12 lg:px-12 lg:pb-14">
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
            <div className="mx-auto mt-14 max-w-[47.5rem]">
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
      ) : null}
    </>
  );
}

export function WhatWeDoVisualEditor({
  initial,
  canEdit,
  saveAction,
}: {
  initial: WhatWeDoPageSections;
  canEdit: boolean;
  saveAction: typeof import("@/lib/actions/admin-cms").saveWhatWeDoPage;
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
    setMessage(result.ok ? "What we do page saved." : result.message);
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
      <WhatWeDoView
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
              <button
                type="button"
                className="px-2 text-xs font-medium text-charcoal/55 hover:text-charcoal"
                onClick={() => {
                  setSections({
                    ...sections,
                    services: {
                      ...sections.services,
                      cards: [...sections.services.cards, emptyWhatWeDoService()],
                    },
                  });
                  setTarget(`service.${sections.services.cards.length}`);
                }}
              >
                Add service
              </button>
              <button
                type="button"
                className="px-2 text-xs font-medium text-charcoal/55 hover:text-charcoal"
                onClick={() => {
                  setSections({
                    ...sections,
                    choose: {
                      ...sections.choose,
                      rows: [
                        ...sections.choose.rows,
                        emptyWhatWeDoMatrixRow(sections.choose.laneLabels.length),
                      ],
                    },
                  });
                  setTarget(`choose.${sections.choose.rows.length}`);
                }}
              >
                Add moment
              </button>
              <a
                href="/admin/pages/what-we-do"
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
