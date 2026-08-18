"use client";

import Link from "next/link";
import { ArrowRight } from "@phosphor-icons/react";
import { useEffect, useId, useRef, useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";

import { AboutRosterRail } from "@/components/about-roster-rail";
import { EditableHit, MultilineText } from "@/components/editable-hit";
import { FadeUp } from "@/components/fade-up";
import {
  EYEBROW,
  EYEBROW_MUTED,
  EYEBROW_ON_DARK,
  PAGE_SHELL,
  PageGhostLink,
  PagePrimaryLink,
} from "@/components/inner-page";
import { MediaField } from "@/components/media-library";
import { PatternField } from "@/components/pattern-field";
import { SiteImage } from "@/components/site-image";
import { Button, Field, TextArea, TextInput } from "@/components/ui";
import {
  emptyAboutFace,
  emptyAboutHeroStat,
  emptyAboutJumpLink,
  emptyAboutLedgerItem,
  emptyAboutModelItem,
  emptyAboutRosterLane,
  paragraphsToText,
  textToParagraphs,
  type AboutPageSections,
} from "@/lib/about-page";

type EditTarget =
  | "hero"
  | "thesis"
  | "why"
  | "whyAside"
  | "ledger"
  | `ledger.${number}`
  | "model"
  | `model.${number}`
  | "roster"
  | "rosterLanes"
  | "cta";

function targetTitle(target: EditTarget): string {
  if (target.startsWith("ledger.")) {
    return `Ledger ${Number(target.split(".")[1]) + 1}`;
  }
  if (target.startsWith("model.")) {
    return `How we work ${Number(target.split(".")[1]) + 1}`;
  }
  const map: Record<string, string> = {
    hero: "Hero",
    thesis: "Thesis",
    why: "Why we exist",
    whyAside: "On this page",
    ledger: "Operating model intro",
    model: "How we work intro",
    roster: "Roster intro",
    rosterLanes: "Roster rail",
    cta: "Two ways in",
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

function EditorPopover({
  target,
  sections,
  onChange,
  onClose,
}: {
  target: EditTarget;
  sections: AboutPageSections;
  onChange: (next: AboutPageSections) => void;
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

  const ledgerIndex = target.startsWith("ledger.")
    ? Number(target.split(".")[1])
    : -1;
  const modelIndex = target.startsWith("model.")
    ? Number(target.split(".")[1])
    : -1;
  const ledgerItem =
    ledgerIndex >= 0 ? sections.ledger.items[ledgerIndex] : null;
  const modelItem = modelIndex >= 0 ? sections.model.items[modelIndex] : null;

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
            <MediaField
              label="Background image"
              value={sections.hero.image}
              onChange={(image) =>
                onChange({
                  ...sections,
                  hero: { ...sections.hero, image },
                })
              }
            />
            <Field label="Eyebrow" id="ve-about-hero-eyebrow">
              <TextInput
                id="ve-about-hero-eyebrow"
                value={sections.hero.eyebrow}
                onChange={(e) =>
                  onChange({
                    ...sections,
                    hero: { ...sections.hero, eyebrow: e.target.value },
                  })
                }
              />
            </Field>
            <Field
              label="Headline"
              id="ve-about-hero-headline"
              hint="Line breaks become new lines on the page."
            >
              <TextArea
                id="ve-about-hero-headline"
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
            <Field label="Subhead" id="ve-about-hero-subhead">
              <TextArea
                id="ve-about-hero-subhead"
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
            {sections.hero.stats.map((stat, index) => (
              <div
                key={`ve-about-stat-${index}`}
                className="space-y-3 rounded-sm border border-charcoal/10 p-3"
              >
                <div className="flex items-center justify-between gap-3">
                  <p className="text-sm font-medium">Stat {index + 1}</p>
                  <button
                    type="button"
                    onClick={() =>
                      onChange({
                        ...sections,
                        hero: {
                          ...sections.hero,
                          stats: sections.hero.stats.filter((_, i) => i !== index),
                        },
                      })
                    }
                    className="text-xs font-medium text-danger hover:underline"
                  >
                    Remove
                  </button>
                </div>
                <Field label="Label" id={`ve-about-stat-label-${index}`}>
                  <TextInput
                    id={`ve-about-stat-label-${index}`}
                    value={stat.label}
                    onChange={(e) => {
                      const stats = sections.hero.stats.map((row, i) =>
                        i === index ? { ...row, label: e.target.value } : row,
                      );
                      onChange({
                        ...sections,
                        hero: { ...sections.hero, stats },
                      });
                    }}
                  />
                </Field>
                <Field label="Value" id={`ve-about-stat-value-${index}`}>
                  <TextInput
                    id={`ve-about-stat-value-${index}`}
                    value={stat.value}
                    onChange={(e) => {
                      const stats = sections.hero.stats.map((row, i) =>
                        i === index ? { ...row, value: e.target.value } : row,
                      );
                      onChange({
                        ...sections,
                        hero: { ...sections.hero, stats },
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
                  hero: {
                    ...sections.hero,
                    stats: [...sections.hero.stats, emptyAboutHeroStat()],
                  },
                })
              }
              className="text-sm font-medium text-forest hover:text-forest-dark"
            >
              + Add stat
            </button>
            <Field label="Primary button" id="ve-about-hero-primary">
              <TextInput
                id="ve-about-hero-primary"
                value={sections.hero.primaryCta}
                onChange={(e) =>
                  onChange({
                    ...sections,
                    hero: { ...sections.hero, primaryCta: e.target.value },
                  })
                }
              />
            </Field>
            <Field label="Primary URL" id="ve-about-hero-primary-href">
              <TextInput
                id="ve-about-hero-primary-href"
                value={sections.hero.primaryHref}
                onChange={(e) =>
                  onChange({
                    ...sections,
                    hero: { ...sections.hero, primaryHref: e.target.value },
                  })
                }
              />
            </Field>
            <Field label="Secondary button" id="ve-about-hero-secondary">
              <TextInput
                id="ve-about-hero-secondary"
                value={sections.hero.secondaryCta}
                onChange={(e) =>
                  onChange({
                    ...sections,
                    hero: { ...sections.hero, secondaryCta: e.target.value },
                  })
                }
              />
            </Field>
            <Field label="Secondary URL" id="ve-about-hero-secondary-href">
              <TextInput
                id="ve-about-hero-secondary-href"
                value={sections.hero.secondaryHref}
                onChange={(e) =>
                  onChange({
                    ...sections,
                    hero: { ...sections.hero, secondaryHref: e.target.value },
                  })
                }
              />
            </Field>
          </>
        ) : null}

        {target === "thesis" ? (
          <>
            <Field label="Eyebrow" id="ve-about-thesis-eyebrow">
              <TextInput
                id="ve-about-thesis-eyebrow"
                value={sections.thesis.eyebrow}
                onChange={(e) =>
                  onChange({
                    ...sections,
                    thesis: { ...sections.thesis, eyebrow: e.target.value },
                  })
                }
              />
            </Field>
            <Field label="Headline" id="ve-about-thesis-headline">
              <TextArea
                id="ve-about-thesis-headline"
                rows={2}
                value={sections.thesis.headline}
                onChange={(e) =>
                  onChange({
                    ...sections,
                    thesis: { ...sections.thesis, headline: e.target.value },
                  })
                }
              />
            </Field>
            <Field label="Body" id="ve-about-thesis-body">
              <TextArea
                id="ve-about-thesis-body"
                rows={4}
                value={sections.thesis.body}
                onChange={(e) =>
                  onChange({
                    ...sections,
                    thesis: { ...sections.thesis, body: e.target.value },
                  })
                }
              />
            </Field>
          </>
        ) : null}

        {target === "why" ? (
          <>
            <Field label="Eyebrow" id="ve-about-why-eyebrow">
              <TextInput
                id="ve-about-why-eyebrow"
                value={sections.why.eyebrow}
                onChange={(e) =>
                  onChange({
                    ...sections,
                    why: { ...sections.why, eyebrow: e.target.value },
                  })
                }
              />
            </Field>
            <Field label="Headline" id="ve-about-why-headline">
              <TextArea
                id="ve-about-why-headline"
                rows={3}
                value={sections.why.headline}
                onChange={(e) =>
                  onChange({
                    ...sections,
                    why: { ...sections.why, headline: e.target.value },
                  })
                }
              />
            </Field>
            <Field
              label="Body"
              id="ve-about-why-body"
              hint="Separate paragraphs with a blank line."
            >
              <TextArea
                id="ve-about-why-body"
                rows={10}
                value={paragraphsToText(sections.why.paragraphs)}
                onChange={(e) =>
                  onChange({
                    ...sections,
                    why: {
                      ...sections.why,
                      paragraphs: textToParagraphs(e.target.value),
                    },
                  })
                }
              />
            </Field>
          </>
        ) : null}

        {target === "whyAside" ? (
          <>
            <Field label="Nav eyebrow" id="ve-about-jump-eyebrow">
              <TextInput
                id="ve-about-jump-eyebrow"
                value={sections.why.jumpEyebrow}
                onChange={(e) =>
                  onChange({
                    ...sections,
                    why: { ...sections.why, jumpEyebrow: e.target.value },
                  })
                }
              />
            </Field>
            {sections.why.jumps.map((item, index) => (
              <div
                key={`ve-about-jump-${index}`}
                className="space-y-3 rounded-sm border border-charcoal/10 p-3"
              >
                <div className="flex items-center justify-between gap-3">
                  <p className="text-sm font-medium">Link {index + 1}</p>
                  <button
                    type="button"
                    onClick={() =>
                      onChange({
                        ...sections,
                        why: {
                          ...sections.why,
                          jumps: sections.why.jumps.filter((_, i) => i !== index),
                        },
                      })
                    }
                    className="text-xs font-medium text-danger hover:underline"
                  >
                    Remove
                  </button>
                </div>
                <Field label="Label" id={`ve-about-jump-label-${index}`}>
                  <TextInput
                    id={`ve-about-jump-label-${index}`}
                    value={item.label}
                    onChange={(e) => {
                      const jumps = sections.why.jumps.map((row, i) =>
                        i === index ? { ...row, label: e.target.value } : row,
                      );
                      onChange({
                        ...sections,
                        why: { ...sections.why, jumps },
                      });
                    }}
                  />
                </Field>
                <Field label="URL" id={`ve-about-jump-href-${index}`}>
                  <TextInput
                    id={`ve-about-jump-href-${index}`}
                    value={item.href}
                    onChange={(e) => {
                      const jumps = sections.why.jumps.map((row, i) =>
                        i === index ? { ...row, href: e.target.value } : row,
                      );
                      onChange({
                        ...sections,
                        why: { ...sections.why, jumps },
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
                  why: {
                    ...sections.why,
                    jumps: [...sections.why.jumps, emptyAboutJumpLink()],
                  },
                })
              }
              className="text-sm font-medium text-forest hover:text-forest-dark"
            >
              + Add link
            </button>
            <Field label="Card headline" id="ve-about-aside-headline">
              <TextInput
                id="ve-about-aside-headline"
                value={sections.why.asideHeadline}
                onChange={(e) =>
                  onChange({
                    ...sections,
                    why: { ...sections.why, asideHeadline: e.target.value },
                  })
                }
              />
            </Field>
            <Field label="Card body" id="ve-about-aside-body">
              <TextArea
                id="ve-about-aside-body"
                rows={3}
                value={sections.why.asideBody}
                onChange={(e) =>
                  onChange({
                    ...sections,
                    why: { ...sections.why, asideBody: e.target.value },
                  })
                }
              />
            </Field>
            <Field label="Card link" id="ve-about-aside-cta">
              <TextInput
                id="ve-about-aside-cta"
                value={sections.why.asideCta}
                onChange={(e) =>
                  onChange({
                    ...sections,
                    why: { ...sections.why, asideCta: e.target.value },
                  })
                }
              />
            </Field>
            <Field label="Card URL" id="ve-about-aside-href">
              <TextInput
                id="ve-about-aside-href"
                value={sections.why.asideHref}
                onChange={(e) =>
                  onChange({
                    ...sections,
                    why: { ...sections.why, asideHref: e.target.value },
                  })
                }
              />
            </Field>
          </>
        ) : null}

        {target === "ledger" ? (
          <>
            <Field label="Headline" id="ve-about-ledger-headline">
              <TextArea
                id="ve-about-ledger-headline"
                rows={3}
                value={sections.ledger.headline}
                onChange={(e) =>
                  onChange({
                    ...sections,
                    ledger: { ...sections.ledger, headline: e.target.value },
                  })
                }
              />
            </Field>
            <Field label="Subhead" id="ve-about-ledger-subhead">
              <TextArea
                id="ve-about-ledger-subhead"
                rows={3}
                value={sections.ledger.subhead}
                onChange={(e) =>
                  onChange({
                    ...sections,
                    ledger: { ...sections.ledger, subhead: e.target.value },
                  })
                }
              />
            </Field>
          </>
        ) : null}

        {ledgerItem ? (
          <>
            <Field label="Value" id="ve-about-ledger-value">
              <TextInput
                id="ve-about-ledger-value"
                value={ledgerItem.value}
                onChange={(e) => {
                  const items = sections.ledger.items.map((row, i) =>
                    i === ledgerIndex ? { ...row, value: e.target.value } : row,
                  );
                  onChange({
                    ...sections,
                    ledger: { ...sections.ledger, items },
                  });
                }}
              />
            </Field>
            <Field label="Label" id="ve-about-ledger-label">
              <TextInput
                id="ve-about-ledger-label"
                value={ledgerItem.label}
                onChange={(e) => {
                  const items = sections.ledger.items.map((row, i) =>
                    i === ledgerIndex ? { ...row, label: e.target.value } : row,
                  );
                  onChange({
                    ...sections,
                    ledger: { ...sections.ledger, items },
                  });
                }}
              />
            </Field>
            <Field label="Note" id="ve-about-ledger-note">
              <TextArea
                id="ve-about-ledger-note"
                rows={2}
                value={ledgerItem.note}
                onChange={(e) => {
                  const items = sections.ledger.items.map((row, i) =>
                    i === ledgerIndex ? { ...row, note: e.target.value } : row,
                  );
                  onChange({
                    ...sections,
                    ledger: { ...sections.ledger, items },
                  });
                }}
              />
            </Field>
            <button
              type="button"
              onClick={() => {
                onChange({
                  ...sections,
                  ledger: {
                    ...sections.ledger,
                    items: sections.ledger.items.filter(
                      (_, i) => i !== ledgerIndex,
                    ),
                  },
                });
                onClose();
              }}
              className="text-sm font-medium text-danger hover:underline"
            >
              Remove this row
            </button>
          </>
        ) : null}

        {target === "model" ? (
          <>
            <Field label="Headline" id="ve-about-model-headline">
              <TextArea
                id="ve-about-model-headline"
                rows={3}
                value={sections.model.headline}
                onChange={(e) =>
                  onChange({
                    ...sections,
                    model: { ...sections.model, headline: e.target.value },
                  })
                }
              />
            </Field>
            <Field label="Subhead" id="ve-about-model-subhead">
              <TextArea
                id="ve-about-model-subhead"
                rows={3}
                value={sections.model.subhead}
                onChange={(e) =>
                  onChange({
                    ...sections,
                    model: { ...sections.model, subhead: e.target.value },
                  })
                }
              />
            </Field>
          </>
        ) : null}

        {modelItem ? (
          <>
            <Field label="Number" id="ve-about-model-n">
              <TextInput
                id="ve-about-model-n"
                value={modelItem.n}
                onChange={(e) => {
                  const items = sections.model.items.map((row, i) =>
                    i === modelIndex ? { ...row, n: e.target.value } : row,
                  );
                  onChange({
                    ...sections,
                    model: { ...sections.model, items },
                  });
                }}
              />
            </Field>
            <Field label="Title" id="ve-about-model-title">
              <TextInput
                id="ve-about-model-title"
                value={modelItem.title}
                onChange={(e) => {
                  const items = sections.model.items.map((row, i) =>
                    i === modelIndex ? { ...row, title: e.target.value } : row,
                  );
                  onChange({
                    ...sections,
                    model: { ...sections.model, items },
                  });
                }}
              />
            </Field>
            <Field label="Body" id="ve-about-model-body">
              <TextArea
                id="ve-about-model-body"
                rows={3}
                value={modelItem.body}
                onChange={(e) => {
                  const items = sections.model.items.map((row, i) =>
                    i === modelIndex ? { ...row, body: e.target.value } : row,
                  );
                  onChange({
                    ...sections,
                    model: { ...sections.model, items },
                  });
                }}
              />
            </Field>
            <button
              type="button"
              onClick={() => {
                onChange({
                  ...sections,
                  model: {
                    ...sections.model,
                    items: sections.model.items.filter((_, i) => i !== modelIndex),
                  },
                });
                onClose();
              }}
              className="text-sm font-medium text-danger hover:underline"
            >
              Remove this item
            </button>
          </>
        ) : null}

        {target === "roster" ? (
          <>
            <Field label="Eyebrow" id="ve-about-roster-eyebrow">
              <TextInput
                id="ve-about-roster-eyebrow"
                value={sections.roster.eyebrow}
                onChange={(e) =>
                  onChange({
                    ...sections,
                    roster: { ...sections.roster, eyebrow: e.target.value },
                  })
                }
              />
            </Field>
            <Field label="Headline" id="ve-about-roster-headline">
              <TextArea
                id="ve-about-roster-headline"
                rows={3}
                value={sections.roster.headline}
                onChange={(e) =>
                  onChange({
                    ...sections,
                    roster: { ...sections.roster, headline: e.target.value },
                  })
                }
              />
            </Field>
            <Field label="Subhead" id="ve-about-roster-subhead">
              <TextArea
                id="ve-about-roster-subhead"
                rows={4}
                value={sections.roster.subhead}
                onChange={(e) =>
                  onChange({
                    ...sections,
                    roster: { ...sections.roster, subhead: e.target.value },
                  })
                }
              />
            </Field>
          </>
        ) : null}

        {target === "rosterLanes" ? (
          <>
            {sections.roster.lanes.map((lane, index) => (
              <div
                key={`ve-about-lane-${index}`}
                className="space-y-3 rounded-sm border border-charcoal/10 p-3"
              >
                <div className="flex items-center justify-between gap-3">
                  <p className="text-sm font-medium">Lane {index + 1}</p>
                  <button
                    type="button"
                    onClick={() =>
                      onChange({
                        ...sections,
                        roster: {
                          ...sections.roster,
                          lanes: sections.roster.lanes.filter(
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
                <Field label="Title" id={`ve-about-lane-title-${index}`}>
                  <TextInput
                    id={`ve-about-lane-title-${index}`}
                    value={lane.title}
                    onChange={(e) => {
                      const lanes = sections.roster.lanes.map((row, i) =>
                        i === index ? { ...row, title: e.target.value } : row,
                      );
                      onChange({
                        ...sections,
                        roster: { ...sections.roster, lanes },
                      });
                    }}
                  />
                </Field>
                <Field label="Body" id={`ve-about-lane-body-${index}`}>
                  <TextArea
                    id={`ve-about-lane-body-${index}`}
                    rows={2}
                    value={lane.body}
                    onChange={(e) => {
                      const lanes = sections.roster.lanes.map((row, i) =>
                        i === index ? { ...row, body: e.target.value } : row,
                      );
                      onChange({
                        ...sections,
                        roster: { ...sections.roster, lanes },
                      });
                    }}
                  />
                </Field>
                <MediaField
                  label="Image"
                  value={lane.image}
                  onChange={(image) => {
                    const lanes = sections.roster.lanes.map((row, i) =>
                      i === index ? { ...row, image } : row,
                    );
                    onChange({
                      ...sections,
                      roster: { ...sections.roster, lanes },
                    });
                  }}
                />
              </div>
            ))}
            <button
              type="button"
              onClick={() =>
                onChange({
                  ...sections,
                  roster: {
                    ...sections.roster,
                    lanes: [...sections.roster.lanes, emptyAboutRosterLane()],
                  },
                })
              }
              className="text-sm font-medium text-forest hover:text-forest-dark"
            >
              + Add lane
            </button>
          </>
        ) : null}

        {target === "cta" ? (
          <>
            <Field label="Eyebrow" id="ve-about-cta-eyebrow">
              <TextInput
                id="ve-about-cta-eyebrow"
                value={sections.cta.eyebrow}
                onChange={(e) =>
                  onChange({
                    ...sections,
                    cta: { ...sections.cta, eyebrow: e.target.value },
                  })
                }
              />
            </Field>
            <Field
              label="Headline"
              id="ve-about-cta-headline"
              hint="Line breaks become new lines on the page."
            >
              <TextArea
                id="ve-about-cta-headline"
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
            <Field label="Body" id="ve-about-cta-body">
              <TextArea
                id="ve-about-cta-body"
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
            {sections.cta.faces.map((face, index) => (
              <div
                key={`ve-about-face-${index}`}
                className="space-y-3 rounded-sm border border-charcoal/10 p-3"
              >
                <div className="flex items-center justify-between gap-3">
                  <p className="text-sm font-medium">Portrait {index + 1}</p>
                  <button
                    type="button"
                    onClick={() =>
                      onChange({
                        ...sections,
                        cta: {
                          ...sections.cta,
                          faces: sections.cta.faces.filter((_, i) => i !== index),
                        },
                      })
                    }
                    className="text-xs font-medium text-danger hover:underline"
                  >
                    Remove
                  </button>
                </div>
                <MediaField
                  label="Image"
                  value={face.src}
                  onChange={(src) => {
                    const faces = sections.cta.faces.map((row, i) =>
                      i === index ? { ...row, src } : row,
                    );
                    onChange({
                      ...sections,
                      cta: { ...sections.cta, faces },
                    });
                  }}
                />
              </div>
            ))}
            <button
              type="button"
              onClick={() =>
                onChange({
                  ...sections,
                  cta: {
                    ...sections.cta,
                    faces: [...sections.cta.faces, emptyAboutFace()],
                  },
                })
              }
              className="text-sm font-medium text-forest hover:text-forest-dark"
            >
              + Add portrait
            </button>
            <Field label="Faces label" id="ve-about-cta-faces-label">
              <TextInput
                id="ve-about-cta-faces-label"
                value={sections.cta.facesLabel}
                onChange={(e) =>
                  onChange({
                    ...sections,
                    cta: { ...sections.cta, facesLabel: e.target.value },
                  })
                }
              />
            </Field>
            <Field label="Faces note" id="ve-about-cta-faces-note">
              <TextInput
                id="ve-about-cta-faces-note"
                value={sections.cta.facesNote}
                onChange={(e) =>
                  onChange({
                    ...sections,
                    cta: { ...sections.cta, facesNote: e.target.value },
                  })
                }
              />
            </Field>
            <Field label="Primary button" id="ve-about-cta-primary">
              <TextInput
                id="ve-about-cta-primary"
                value={sections.cta.primaryCta}
                onChange={(e) =>
                  onChange({
                    ...sections,
                    cta: { ...sections.cta, primaryCta: e.target.value },
                  })
                }
              />
            </Field>
            <Field label="Primary URL" id="ve-about-cta-primary-href">
              <TextInput
                id="ve-about-cta-primary-href"
                value={sections.cta.primaryHref}
                onChange={(e) =>
                  onChange({
                    ...sections,
                    cta: { ...sections.cta, primaryHref: e.target.value },
                  })
                }
              />
            </Field>
            <Field label="Secondary button" id="ve-about-cta-secondary">
              <TextInput
                id="ve-about-cta-secondary"
                value={sections.cta.secondaryCta}
                onChange={(e) =>
                  onChange({
                    ...sections,
                    cta: { ...sections.cta, secondaryCta: e.target.value },
                  })
                }
              />
            </Field>
            <Field label="Secondary URL" id="ve-about-cta-secondary-href">
              <TextInput
                id="ve-about-cta-secondary-href"
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

function AboutView({
  sections,
  editing,
  selected,
  onSelect,
}: {
  sections: AboutPageSections;
  editing: boolean;
  selected: EditTarget | null;
  onSelect: (target: EditTarget) => void;
}) {
  const heroImage = sections.hero.image.trim();
  const faces = sections.cta.faces.filter((face) => face.src.trim());

  return (
    <>
      <section
        className="relative isolate -mt-[7.25rem] min-h-[min(88vh,47.7rem)] overflow-hidden bg-charcoal text-cream md:-mt-[5.5rem]"
        data-site-hero-overlay
      >
        {heroImage ? (
          <SiteImage
            src={heroImage}
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-cover object-[68%_18%]"
          />
        ) : null}
        <div
          aria-hidden
          className="absolute inset-0 bg-linear-to-r from-charcoal via-charcoal/82 to-charcoal/20"
        />
        <div
          aria-hidden
          className="absolute inset-0 bg-linear-to-t from-charcoal/70 via-transparent to-charcoal/35"
        />

        <div
          className={`${PAGE_SHELL} relative z-10 flex min-h-[min(88vh,47.7rem)] flex-col justify-end px-6 pb-12 pt-32 md:px-10 md:pb-16 md:pt-36 lg:px-12 lg:pb-20`}
        >
          {hit(
            editing,
            "hero",
            selected,
            onSelect,
            "hero",
            <div>
              <FadeUp y={18} duration={1000} threshold={0.05} rootMargin="0px">
                <p className={EYEBROW_ON_DARK}>{sections.hero.eyebrow}</p>
                <MultilineText
                  as="h1"
                  text={sections.hero.headline}
                  className="mt-4 max-w-[16ch] font-display text-[2.6rem] leading-[1.05] tracking-tight text-cream sm:text-[3.25rem] md:text-[4rem] lg:text-[4.4rem]"
                />
                <p className="mt-5 max-w-[38rem] text-[1rem] leading-relaxed text-cream/72 md:text-[1.0625rem]">
                  {sections.hero.subhead}
                </p>
              </FadeUp>

              <FadeUp
                delay={140}
                y={16}
                duration={1000}
                threshold={0.05}
                rootMargin="0px"
              >
                <div className="mt-10 flex flex-col gap-6 border-t border-cream/15 pt-6 sm:flex-row sm:items-end sm:justify-between">
                  <div className="flex gap-10">
                    {sections.hero.stats.map((stat) => (
                      <div key={`${stat.label}-${stat.value}`}>
                        <p className="text-[0.68rem] font-medium tracking-[0.16em] text-cream/50 uppercase">
                          {stat.label}
                        </p>
                        <p className="mt-1 font-display text-[1.35rem] leading-tight text-cream">
                          {stat.value}
                        </p>
                      </div>
                    ))}
                  </div>
                  <div className="flex flex-wrap gap-3">
                    <PagePrimaryLink
                      href={sections.hero.primaryHref || "/roster"}
                      tone="cream"
                    >
                      {sections.hero.primaryCta}
                    </PagePrimaryLink>
                    <PageGhostLink
                      href={
                        sections.hero.secondaryHref ||
                        "/apply-for-representation"
                      }
                      onDark
                    >
                      {sections.hero.secondaryCta}
                    </PageGhostLink>
                  </div>
                </div>
              </FadeUp>
            </div>,
            { block: true, ringOffset: "ring-offset-charcoal" },
          )}
        </div>
      </section>

      <section className="bg-cream px-6 py-20 md:px-10 md:py-24 lg:px-12 lg:py-28">
        <FadeUp className="mx-auto max-w-[62.5rem] text-center">
          {hit(
            editing,
            "thesis",
            selected,
            onSelect,
            "thesis",
            <div>
              <p className={EYEBROW}>{sections.thesis.eyebrow}</p>
              <h2 className="mt-4 font-display text-[2rem] leading-[1.12] tracking-tight text-charcoal md:text-[2.75rem] lg:text-[3.2rem]">
                {sections.thesis.headline}
              </h2>
              <p className="mx-auto mt-5 max-w-[45rem] text-[1.05rem] leading-relaxed text-charcoal/65">
                {sections.thesis.body}
              </p>
            </div>,
            { block: true },
          )}
        </FadeUp>
      </section>

      <section
        id="why"
        className="scroll-mt-28 bg-cream px-6 pb-20 md:px-10 md:pb-24 lg:px-12 lg:pb-28"
      >
        <div
          className={`${PAGE_SHELL} grid gap-12 lg:grid-cols-[minmax(0,1.15fr)_minmax(16rem,0.55fr)] lg:gap-20`}
        >
          <FadeUp>
            {hit(
              editing,
              "why",
              selected,
              onSelect,
              "why we exist",
              <article>
                <p className={EYEBROW}>{sections.why.eyebrow}</p>
                <h2 className="mt-4 max-w-[18ch] font-display text-[2rem] leading-[1.12] tracking-tight text-charcoal md:text-[2.65rem]">
                  {sections.why.headline}
                </h2>
                <div className="mt-8 max-w-[45rem] space-y-5 text-[1rem] leading-relaxed text-charcoal/68">
                  {sections.why.paragraphs
                    .filter((paragraph) => paragraph.trim())
                    .map((paragraph, index) => (
                      <p key={`${index}-${paragraph.slice(0, 24)}`}>{paragraph}</p>
                    ))}
                </div>
              </article>,
              { block: true },
            )}
          </FadeUp>

          <FadeUp delay={120}>
            {hit(
              editing,
              "whyAside",
              selected,
              onSelect,
              "on this page",
              <aside className="lg:pt-10">
                <p className={EYEBROW_MUTED}>{sections.why.jumpEyebrow}</p>
                <nav
                  className="mt-4 border-t border-charcoal/10"
                  aria-label="On this page"
                >
                  {sections.why.jumps
                    .filter((item) => item.label.trim())
                    .map((item) => (
                      <a
                        key={`${item.href}-${item.label}`}
                        href={item.href || "#"}
                        className="flex items-center justify-between border-b border-charcoal/10 py-3.5 text-[0.9375rem] text-charcoal transition-colors hover:text-forest"
                      >
                        {item.label}
                        <ArrowRight
                          className="size-3.5 text-charcoal/35"
                          aria-hidden
                        />
                      </a>
                    ))}
                </nav>
                <div className="mt-6 rounded-sm bg-forest-dark p-7 text-cream">
                  <p className="font-display text-[1.25rem] leading-snug tracking-tight">
                    {sections.why.asideHeadline}
                  </p>
                  <p className="mt-2 text-[0.875rem] leading-relaxed text-cream/70">
                    {sections.why.asideBody}
                  </p>
                  {editing ? (
                    <span className="mt-5 inline-flex items-center gap-2 text-[0.875rem] font-medium text-cream">
                      {sections.why.asideCta}
                      <ArrowRight className="size-3.5" aria-hidden />
                    </span>
                  ) : (
                    <Link
                      href={sections.why.asideHref || "/roster"}
                      className="mt-5 inline-flex items-center gap-2 text-[0.875rem] font-medium text-cream hover:text-cream/80"
                    >
                      {sections.why.asideCta}
                      <ArrowRight className="size-3.5" aria-hidden />
                    </Link>
                  )}
                </div>
              </aside>,
              { block: true },
            )}
          </FadeUp>
        </div>
      </section>

      <section
        id="ledger"
        className="scroll-mt-28 bg-charcoal px-6 py-20 text-cream md:px-10 md:py-24 lg:px-12 lg:py-28"
      >
        <div className={PAGE_SHELL}>
          <FadeUp>
            {hit(
              editing,
              "ledger",
              selected,
              onSelect,
              "operating model intro",
              <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,22rem)] lg:items-end">
                <h2 className="max-w-[16ch] font-display text-[2rem] leading-[1.12] tracking-tight md:text-[2.65rem]">
                  {sections.ledger.headline}
                </h2>
                <p className="text-[0.9375rem] leading-relaxed text-cream/65">
                  {sections.ledger.subhead}
                </p>
              </div>,
              { block: true, ringOffset: "ring-offset-charcoal" },
            )}
          </FadeUp>

          <ul className="mt-12">
            {sections.ledger.items.map((row, index) => (
              <li key={`${row.label}-${index}`}>
                <FadeUp delay={index * 90} y={20} threshold={0.15}>
                  {hit(
                    editing,
                    `ledger.${index}`,
                    selected,
                    onSelect,
                    row.label || `ledger ${index + 1}`,
                    <div className="grid gap-3 border-t border-cream/12 py-8 md:grid-cols-[8rem_minmax(0,16rem)_minmax(0,1fr)] md:items-baseline md:gap-10">
                      <p className="font-display text-[2.75rem] leading-none tracking-tight text-cream md:text-[3.25rem]">
                        {row.value}
                      </p>
                      <p className="text-[1.05rem] leading-snug text-cream">
                        {row.label}
                      </p>
                      <p className="text-[0.9375rem] leading-relaxed text-cream/60">
                        {row.note}
                      </p>
                    </div>,
                    { block: true, ringOffset: "ring-offset-charcoal" },
                  )}
                </FadeUp>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section
        id="model"
        className="scroll-mt-28 bg-cream-dark px-6 py-20 md:px-10 md:py-24 lg:px-12 lg:py-28"
      >
        <div className={PAGE_SHELL}>
          <FadeUp>
            {hit(
              editing,
              "model",
              selected,
              onSelect,
              "how we work intro",
              <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,22rem)] lg:items-end">
                <h2 className="max-w-[14ch] font-display text-[2rem] leading-[1.12] tracking-tight text-charcoal md:text-[2.65rem]">
                  {sections.model.headline}
                </h2>
                <p className="text-[0.9375rem] leading-relaxed text-charcoal/60">
                  {sections.model.subhead}
                </p>
              </div>,
              { block: true, ringOffset: "ring-offset-cream-dark" },
            )}
          </FadeUp>
          <ul className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
            {sections.model.items.map((item, index) => (
              <li key={`${item.n}-${index}`}>
                <FadeUp delay={index * 90} y={20} threshold={0.15}>
                  {hit(
                    editing,
                    `model.${index}`,
                    selected,
                    onSelect,
                    item.title || `model ${index + 1}`,
                    <div className="border-t border-charcoal/12 pt-5">
                      <p className="text-[0.68rem] font-medium tracking-[0.16em] text-forest uppercase">
                        {item.n}
                      </p>
                      <h3 className="mt-3 font-display text-[1.25rem] leading-snug tracking-tight text-charcoal">
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
            ))}
          </ul>
        </div>
      </section>

      <section
        id="roster"
        className="scroll-mt-28 overflow-hidden bg-cream py-20 md:py-24 lg:py-28"
      >
        <div className={`${PAGE_SHELL} px-6 md:px-10 lg:px-12`}>
          <FadeUp>
            {hit(
              editing,
              "roster",
              selected,
              onSelect,
              "roster intro",
              <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,24rem)] lg:items-end">
                <div>
                  <p className={EYEBROW}>{sections.roster.eyebrow}</p>
                  <h2 className="mt-3 max-w-[16ch] font-display text-[2rem] leading-[1.12] tracking-tight text-charcoal md:text-[2.65rem]">
                    {sections.roster.headline}
                  </h2>
                </div>
                <p className="text-[0.9375rem] leading-relaxed text-charcoal/60">
                  {sections.roster.subhead}
                </p>
              </div>,
              { block: true },
            )}
          </FadeUp>
        </div>

        {hit(
          editing,
          "rosterLanes",
          selected,
          onSelect,
          "roster rail",
          <AboutRosterRail lanes={sections.roster.lanes} />,
          { block: true },
        )}
      </section>

      <section className="px-6 py-16 md:px-10 md:py-20 lg:px-12 lg:py-24">
        <div className={PAGE_SHELL}>
          <FadeUp>
            {hit(
              editing,
              "cta",
              selected,
              onSelect,
              "two ways in",
              <div className="relative overflow-hidden rounded-sm bg-rust text-cream">
                <div className="pointer-events-none absolute inset-0 overflow-hidden">
                  <PatternField
                    color={{ r: 249, g: 243, b: 239 }}
                    className="opacity-[0.13]"
                    mask="linear-gradient(to left, black 0%, rgba(0,0,0,0.4) 45%, transparent 88%)"
                  />
                </div>
                <div className="relative z-2 grid items-end gap-10 px-8 py-10 md:grid-cols-[minmax(0,1.4fr)_minmax(0,18rem)] md:px-12 md:py-14 lg:px-16 lg:py-16">
                  <div>
                    <p className="text-[0.68rem] font-medium tracking-[0.16em] text-cream/60 uppercase">
                      {sections.cta.eyebrow}
                    </p>
                    <MultilineText
                      as="h2"
                      text={sections.cta.headline}
                      className="mt-3 max-w-[18ch] font-display text-[2rem] leading-[1.12] tracking-tight md:text-[2.5rem]"
                    />
                    <p className="mt-4 max-w-[32rem] text-[0.9375rem] leading-relaxed text-cream/72">
                      {sections.cta.body}
                    </p>
                    <div className="mt-6 flex flex-wrap items-center gap-3">
                      {faces.length > 0 ? (
                        <div className="flex -space-x-2">
                          {faces.map((face) => (
                            <span
                              key={face.src}
                              className="relative size-9 overflow-hidden rounded-full border-2 border-rust"
                            >
                              <SiteImage
                                src={face.src}
                                alt=""
                                fill
                                sizes="36px"
                                className="object-cover"
                              />
                            </span>
                          ))}
                        </div>
                      ) : null}
                      <p className="text-[0.8125rem] text-cream/75">
                        {sections.cta.facesLabel}
                        {sections.cta.facesLabel.trim() &&
                        sections.cta.facesNote.trim() ? (
                          <span className="mx-2 text-cream/35">·</span>
                        ) : null}
                        {sections.cta.facesNote}
                      </p>
                    </div>
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
                      href={
                        sections.cta.secondaryHref ||
                        "/apply-for-representation"
                      }
                      onDark
                      className="w-full"
                    >
                      {sections.cta.secondaryCta}
                    </PageGhostLink>
                  </div>
                </div>
              </div>,
              { block: true, ringOffset: "ring-offset-rust" },
            )}
          </FadeUp>
        </div>
      </section>
    </>
  );
}

export function AboutVisualEditor({
  initial,
  canEdit,
  saveAction,
}: {
  initial: AboutPageSections;
  canEdit: boolean;
  saveAction: typeof import("@/lib/actions/admin-cms").saveAboutPage;
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
    setMessage(result.ok ? "About page saved." : result.message);
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
      <AboutView
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
                href="/admin/pages/about"
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
