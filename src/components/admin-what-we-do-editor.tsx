"use client";

import { useState } from "react";

import { MediaField } from "@/components/media-library";
import { Button, Field, TextArea, TextInput } from "@/components/ui";
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

export function WhatWeDoPageEditorForm({
  initial,
  saveAction,
}: {
  initial: WhatWeDoPageSections;
  saveAction: typeof import("@/lib/actions/admin-cms").saveWhatWeDoPage;
}) {
  const [sections, setSections] = useState(initial);
  const [message, setMessage] = useState("");
  const [ok, setOk] = useState(false);
  const [pending, setPending] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setPending(true);
    const result = await saveAction(sections);
    setOk(result.ok);
    setMessage(result.message);
    setPending(false);
  }

  return (
    <form onSubmit={onSubmit} className="space-y-12">
      <section className="space-y-4">
        <div>
          <h2 className="font-display text-xl">Hero</h2>
          <p className="mt-1 text-sm text-muted">
            Opening copy, CTAs, and the two proof lines.
          </p>
        </div>
        <Field
          label="Headline"
          id="wwd-hero-headline"
          hint="Line breaks become new lines on the page."
        >
          <TextArea
            id="wwd-hero-headline"
            rows={3}
            value={sections.hero.headline}
            onChange={(e) =>
              setSections({
                ...sections,
                hero: { ...sections.hero, headline: e.target.value },
              })
            }
          />
        </Field>
        <Field label="Subhead" id="wwd-hero-subhead">
          <TextArea
            id="wwd-hero-subhead"
            rows={4}
            value={sections.hero.subhead}
            onChange={(e) =>
              setSections({
                ...sections,
                hero: { ...sections.hero, subhead: e.target.value },
              })
            }
          />
        </Field>
        <div className="grid gap-4 md:grid-cols-2">
          <Field label="Primary button" id="wwd-hero-primary">
            <TextInput
              id="wwd-hero-primary"
              value={sections.hero.primaryCta}
              onChange={(e) =>
                setSections({
                  ...sections,
                  hero: { ...sections.hero, primaryCta: e.target.value },
                })
              }
            />
          </Field>
          <Field label="Primary URL" id="wwd-hero-primary-href">
            <TextInput
              id="wwd-hero-primary-href"
              value={sections.hero.primaryHref}
              onChange={(e) =>
                setSections({
                  ...sections,
                  hero: { ...sections.hero, primaryHref: e.target.value },
                })
              }
            />
          </Field>
          <Field label="Secondary button" id="wwd-hero-secondary">
            <TextInput
              id="wwd-hero-secondary"
              value={sections.hero.secondaryCta}
              onChange={(e) =>
                setSections({
                  ...sections,
                  hero: { ...sections.hero, secondaryCta: e.target.value },
                })
              }
            />
          </Field>
          <Field label="Secondary URL" id="wwd-hero-secondary-href">
            <TextInput
              id="wwd-hero-secondary-href"
              value={sections.hero.secondaryHref}
              onChange={(e) =>
                setSections({
                  ...sections,
                  hero: { ...sections.hero, secondaryHref: e.target.value },
                })
              }
            />
          </Field>
        </div>
        {sections.hero.proofs.map((proof, index) => (
          <div
            key={`wwd-proof-${index}`}
            className="space-y-3 rounded-sm border border-charcoal/10 p-4"
          >
            <div className="flex items-center justify-between gap-3">
              <p className="text-sm font-medium">Proof {index + 1}</p>
              <button
                type="button"
                onClick={() =>
                  setSections({
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
            <Field label="Title" id={`wwd-proof-title-${index}`}>
              <TextInput
                id={`wwd-proof-title-${index}`}
                value={proof.title}
                onChange={(e) => {
                  const proofs = sections.hero.proofs.map((row, i) =>
                    i === index ? { ...row, title: e.target.value } : row,
                  );
                  setSections({
                    ...sections,
                    hero: { ...sections.hero, proofs },
                  });
                }}
              />
            </Field>
            <Field label="Body" id={`wwd-proof-body-${index}`}>
              <TextArea
                id={`wwd-proof-body-${index}`}
                rows={2}
                value={proof.body}
                onChange={(e) => {
                  const proofs = sections.hero.proofs.map((row, i) =>
                    i === index ? { ...row, body: e.target.value } : row,
                  );
                  setSections({
                    ...sections,
                    hero: { ...sections.hero, proofs },
                  });
                }}
              />
            </Field>
          </div>
        ))}
        <button
          type="button"
          onClick={() =>
            setSections({
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
      </section>

      <section className="space-y-4">
        <div>
          <h2 className="font-display text-xl">Hero image panel</h2>
          <p className="mt-1 text-sm text-muted">
            Photograph on the right of the hero.
          </p>
        </div>
        <MediaField
          label="Panel image"
          value={sections.hero.system.image}
          onChange={(image) =>
            setSections({
              ...sections,
              hero: {
                ...sections.hero,
                system: { ...sections.hero.system, image },
              },
            })
          }
        />
      </section>

      <section className="space-y-4">
        <div>
          <h2 className="font-display text-xl">Business moments</h2>
          <p className="mt-1 text-sm text-muted">Charcoal panel under the hero.</p>
        </div>
        <Field
          label="Headline"
          id="wwd-moments-headline"
          hint="Line breaks become new lines on the page."
        >
          <TextArea
            id="wwd-moments-headline"
            rows={3}
            value={sections.moments.headline}
            onChange={(e) =>
              setSections({
                ...sections,
                moments: { ...sections.moments, headline: e.target.value },
              })
            }
          />
        </Field>
        <Field label="Subhead" id="wwd-moments-subhead">
          <TextArea
            id="wwd-moments-subhead"
            rows={3}
            value={sections.moments.subhead}
            onChange={(e) =>
              setSections({
                ...sections,
                moments: { ...sections.moments, subhead: e.target.value },
              })
            }
          />
        </Field>
        {sections.moments.items.map((item, index) => (
          <div
            key={`wwd-moment-${index}`}
            className="space-y-3 rounded-sm border border-charcoal/10 p-4"
          >
            <div className="flex items-center justify-between gap-3">
              <p className="text-sm font-medium">Moment {index + 1}</p>
              <button
                type="button"
                onClick={() =>
                  setSections({
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
            <Field label="Eyebrow" id={`wwd-moment-eyebrow-${index}`}>
              <TextInput
                id={`wwd-moment-eyebrow-${index}`}
                value={item.eyebrow}
                onChange={(e) => {
                  const items = sections.moments.items.map((row, i) =>
                    i === index ? { ...row, eyebrow: e.target.value } : row,
                  );
                  setSections({
                    ...sections,
                    moments: { ...sections.moments, items },
                  });
                }}
              />
            </Field>
            <Field label="Title" id={`wwd-moment-title-${index}`}>
              <TextInput
                id={`wwd-moment-title-${index}`}
                value={item.title}
                onChange={(e) => {
                  const items = sections.moments.items.map((row, i) =>
                    i === index ? { ...row, title: e.target.value } : row,
                  );
                  setSections({
                    ...sections,
                    moments: { ...sections.moments, items },
                  });
                }}
              />
            </Field>
            <Field label="Body" id={`wwd-moment-body-${index}`}>
              <TextArea
                id={`wwd-moment-body-${index}`}
                rows={3}
                value={item.body}
                onChange={(e) => {
                  const items = sections.moments.items.map((row, i) =>
                    i === index ? { ...row, body: e.target.value } : row,
                  );
                  setSections({
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
            setSections({
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
      </section>

      <section className="space-y-4">
        <div>
          <h2 className="font-display text-xl">Services</h2>
          <p className="mt-1 text-sm text-muted">
            Intro copy and the four service cards. Formats are one per line.
          </p>
        </div>
        <Field label="Eyebrow" id="wwd-services-eyebrow">
          <TextInput
            id="wwd-services-eyebrow"
            value={sections.services.eyebrow}
            onChange={(e) =>
              setSections({
                ...sections,
                services: { ...sections.services, eyebrow: e.target.value },
              })
            }
          />
        </Field>
        <Field label="Headline" id="wwd-services-headline">
          <TextArea
            id="wwd-services-headline"
            rows={3}
            value={sections.services.headline}
            onChange={(e) =>
              setSections({
                ...sections,
                services: { ...sections.services, headline: e.target.value },
              })
            }
          />
        </Field>
        <Field label="Subhead" id="wwd-services-subhead">
          <TextArea
            id="wwd-services-subhead"
            rows={3}
            value={sections.services.subhead}
            onChange={(e) =>
              setSections({
                ...sections,
                services: { ...sections.services, subhead: e.target.value },
              })
            }
          />
        </Field>
        {sections.services.cards.map((card, index) => (
          <div
            key={`wwd-service-${index}`}
            className="space-y-3 rounded-sm border border-charcoal/10 p-4"
          >
            <div className="flex items-center justify-between gap-3">
              <p className="text-sm font-medium">Service {index + 1}</p>
              <button
                type="button"
                onClick={() =>
                  setSections({
                    ...sections,
                    services: {
                      ...sections.services,
                      cards: sections.services.cards.filter((_, i) => i !== index),
                    },
                  })
                }
                className="text-xs font-medium text-danger hover:underline"
              >
                Remove
              </button>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <Field label="Number" id={`wwd-service-n-${index}`}>
                <TextInput
                  id={`wwd-service-n-${index}`}
                  value={card.n}
                  onChange={(e) => {
                    const cards = sections.services.cards.map((row, i) =>
                      i === index ? { ...row, n: e.target.value } : row,
                    );
                    setSections({
                      ...sections,
                      services: { ...sections.services, cards },
                    });
                  }}
                />
              </Field>
              <Field label="Lane" id={`wwd-service-lane-${index}`}>
                <TextInput
                  id={`wwd-service-lane-${index}`}
                  value={card.lane}
                  onChange={(e) => {
                    const cards = sections.services.cards.map((row, i) =>
                      i === index ? { ...row, lane: e.target.value } : row,
                    );
                    setSections({
                      ...sections,
                      services: { ...sections.services, cards },
                    });
                  }}
                />
              </Field>
            </div>
            <Field label="Title" id={`wwd-service-title-${index}`}>
              <TextInput
                id={`wwd-service-title-${index}`}
                value={card.title}
                onChange={(e) => {
                  const cards = sections.services.cards.map((row, i) =>
                    i === index ? { ...row, title: e.target.value } : row,
                  );
                  setSections({
                    ...sections,
                    services: { ...sections.services, cards },
                  });
                }}
              />
            </Field>
            <Field label="Body" id={`wwd-service-body-${index}`}>
              <TextArea
                id={`wwd-service-body-${index}`}
                rows={3}
                value={card.body}
                onChange={(e) => {
                  const cards = sections.services.cards.map((row, i) =>
                    i === index ? { ...row, body: e.target.value } : row,
                  );
                  setSections({
                    ...sections,
                    services: { ...sections.services, cards },
                  });
                }}
              />
            </Field>
            <Field
              label="Formats"
              id={`wwd-service-formats-${index}`}
              hint="One format per line."
            >
              <TextArea
                id={`wwd-service-formats-${index}`}
                rows={5}
                value={formatsToText(card.formats)}
                onChange={(e) => {
                  const cards = sections.services.cards.map((row, i) =>
                    i === index
                      ? { ...row, formats: textToFormats(e.target.value) }
                      : row,
                  );
                  setSections({
                    ...sections,
                    services: { ...sections.services, cards },
                  });
                }}
              />
            </Field>
            <Field label="Best for" id={`wwd-service-best-${index}`}>
              <TextArea
                id={`wwd-service-best-${index}`}
                rows={2}
                value={card.bestFor}
                onChange={(e) => {
                  const cards = sections.services.cards.map((row, i) =>
                    i === index ? { ...row, bestFor: e.target.value } : row,
                  );
                  setSections({
                    ...sections,
                    services: { ...sections.services, cards },
                  });
                }}
              />
            </Field>
          </div>
        ))}
        <button
          type="button"
          onClick={() =>
            setSections({
              ...sections,
              services: {
                ...sections.services,
                cards: [...sections.services.cards, emptyWhatWeDoService()],
              },
            })
          }
          className="text-sm font-medium text-forest hover:text-forest-dark"
        >
          + Add service
        </button>
      </section>

      <section className="space-y-4">
        <div>
          <h2 className="font-display text-xl">Process</h2>
          <p className="mt-1 text-sm text-muted">
            Left-column copy and the timeline steps.
          </p>
        </div>
        <Field label="Headline" id="wwd-process-headline">
          <TextArea
            id="wwd-process-headline"
            rows={2}
            value={sections.process.headline}
            onChange={(e) =>
              setSections({
                ...sections,
                process: { ...sections.process, headline: e.target.value },
              })
            }
          />
        </Field>
        <Field label="Body" id="wwd-process-body">
          <TextArea
            id="wwd-process-body"
            rows={3}
            value={sections.process.body}
            onChange={(e) =>
              setSections({
                ...sections,
                process: { ...sections.process, body: e.target.value },
              })
            }
          />
        </Field>
        <Field label="Footnote" id="wwd-process-footnote">
          <TextArea
            id="wwd-process-footnote"
            rows={3}
            value={sections.process.footnote}
            onChange={(e) =>
              setSections({
                ...sections,
                process: { ...sections.process, footnote: e.target.value },
              })
            }
          />
        </Field>
        <div className="grid gap-4 md:grid-cols-2">
          <Field label="Button" id="wwd-process-cta">
            <TextInput
              id="wwd-process-cta"
              value={sections.process.ctaLabel}
              onChange={(e) =>
                setSections({
                  ...sections,
                  process: { ...sections.process, ctaLabel: e.target.value },
                })
              }
            />
          </Field>
          <Field label="Button URL" id="wwd-process-cta-href">
            <TextInput
              id="wwd-process-cta-href"
              value={sections.process.ctaHref}
              onChange={(e) =>
                setSections({
                  ...sections,
                  process: { ...sections.process, ctaHref: e.target.value },
                })
              }
            />
          </Field>
        </div>
        {sections.process.steps.map((step, index) => (
          <div
            key={`wwd-step-${index}`}
            className="space-y-3 rounded-sm border border-charcoal/10 p-4"
          >
            <div className="flex items-center justify-between gap-3">
              <p className="text-sm font-medium">Step {index + 1}</p>
              <button
                type="button"
                onClick={() =>
                  setSections({
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
            <div className="grid gap-4 md:grid-cols-2">
              <Field label="Number" id={`wwd-step-n-${index}`}>
                <TextInput
                  id={`wwd-step-n-${index}`}
                  value={step.n}
                  onChange={(e) => {
                    const steps = sections.process.steps.map((row, i) =>
                      i === index ? { ...row, n: e.target.value } : row,
                    );
                    setSections({
                      ...sections,
                      process: { ...sections.process, steps },
                    });
                  }}
                />
              </Field>
              <Field label="Title" id={`wwd-step-title-${index}`}>
                <TextInput
                  id={`wwd-step-title-${index}`}
                  value={step.title}
                  onChange={(e) => {
                    const steps = sections.process.steps.map((row, i) =>
                      i === index ? { ...row, title: e.target.value } : row,
                    );
                    setSections({
                      ...sections,
                      process: { ...sections.process, steps },
                    });
                  }}
                />
              </Field>
            </div>
            <Field label="Body" id={`wwd-step-body-${index}`}>
              <TextArea
                id={`wwd-step-body-${index}`}
                rows={2}
                value={step.body}
                onChange={(e) => {
                  const steps = sections.process.steps.map((row, i) =>
                    i === index ? { ...row, body: e.target.value } : row,
                  );
                  setSections({
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
            setSections({
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
      </section>

      <section className="space-y-4">
        <div>
          <h2 className="font-display text-xl">How to choose</h2>
          <p className="mt-1 text-sm text-muted">
            Matrix intro, column labels, and each business-moment row.
          </p>
        </div>
        <Field label="Eyebrow" id="wwd-choose-eyebrow">
          <TextInput
            id="wwd-choose-eyebrow"
            value={sections.choose.eyebrow}
            onChange={(e) =>
              setSections({
                ...sections,
                choose: { ...sections.choose, eyebrow: e.target.value },
              })
            }
          />
        </Field>
        <Field label="Headline" id="wwd-choose-headline">
          <TextArea
            id="wwd-choose-headline"
            rows={3}
            value={sections.choose.headline}
            onChange={(e) =>
              setSections({
                ...sections,
                choose: { ...sections.choose, headline: e.target.value },
              })
            }
          />
        </Field>
        <Field label="Subhead" id="wwd-choose-subhead">
          <TextArea
            id="wwd-choose-subhead"
            rows={3}
            value={sections.choose.subhead}
            onChange={(e) =>
              setSections({
                ...sections,
                choose: { ...sections.choose, subhead: e.target.value },
              })
            }
          />
        </Field>
        <div className="grid gap-4 md:grid-cols-2">
          <Field label="Moment column label" id="wwd-choose-col-moment">
            <TextInput
              id="wwd-choose-col-moment"
              value={sections.choose.colMoment}
              onChange={(e) =>
                setSections({
                  ...sections,
                  choose: { ...sections.choose, colMoment: e.target.value },
                })
              }
            />
          </Field>
          <Field label="Becomes column label" id="wwd-choose-col-becomes">
            <TextInput
              id="wwd-choose-col-becomes"
              value={sections.choose.colBecomes}
              onChange={(e) =>
                setSections({
                  ...sections,
                  choose: { ...sections.choose, colBecomes: e.target.value },
                })
              }
            />
          </Field>
        </div>
        <Field
          label="Lane labels"
          id="wwd-choose-lanes"
          hint="One label per line. Marks on each row follow this order."
        >
          <TextArea
            id="wwd-choose-lanes"
            rows={4}
            value={sections.choose.laneLabels.join("\n")}
            onChange={(e) => {
              const laneLabels = e.target.value
                .split("\n")
                .map((line) => line.trimEnd())
                .filter((line, i, arr) => line.trim() || i === arr.length - 1);
              const labels = laneLabels.filter((line) => line.trim());
              const rows = sections.choose.rows.map((row) => ({
                ...row,
                lanes: Array.from(
                  { length: Math.max(labels.length, 1) },
                  (_, i) => row.lanes[i] ?? false,
                ),
              }));
              setSections({
                ...sections,
                choose: {
                  ...sections.choose,
                  laneLabels: labels.length > 0 ? labels : laneLabels,
                  rows,
                },
              });
            }}
          />
        </Field>
        {sections.choose.rows.map((row, index) => (
          <div
            key={`wwd-choose-${index}`}
            className="space-y-3 rounded-sm border border-charcoal/10 p-4"
          >
            <div className="flex items-center justify-between gap-3">
              <p className="text-sm font-medium">Row {index + 1}</p>
              <button
                type="button"
                onClick={() =>
                  setSections({
                    ...sections,
                    choose: {
                      ...sections.choose,
                      rows: sections.choose.rows.filter((_, i) => i !== index),
                    },
                  })
                }
                className="text-xs font-medium text-danger hover:underline"
              >
                Remove
              </button>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <Field label="Number" id={`wwd-choose-n-${index}`}>
                <TextInput
                  id={`wwd-choose-n-${index}`}
                  value={row.n}
                  onChange={(e) => {
                    const rows = sections.choose.rows.map((item, i) =>
                      i === index ? { ...item, n: e.target.value } : item,
                    );
                    setSections({
                      ...sections,
                      choose: { ...sections.choose, rows },
                    });
                  }}
                />
              </Field>
              <Field label="Moment" id={`wwd-choose-moment-${index}`}>
                <TextInput
                  id={`wwd-choose-moment-${index}`}
                  value={row.moment}
                  onChange={(e) => {
                    const rows = sections.choose.rows.map((item, i) =>
                      i === index ? { ...item, moment: e.target.value } : item,
                    );
                    setSections({
                      ...sections,
                      choose: { ...sections.choose, rows },
                    });
                  }}
                />
              </Field>
            </div>
            <Field label="What it becomes" id={`wwd-choose-becomes-${index}`}>
              <TextArea
                id={`wwd-choose-becomes-${index}`}
                rows={3}
                value={row.becomes}
                onChange={(e) => {
                  const rows = sections.choose.rows.map((item, i) =>
                    i === index ? { ...item, becomes: e.target.value } : item,
                  );
                  setSections({
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
                    checked={Boolean(row.lanes[laneIndex])}
                    onChange={(e) => {
                      const rows = sections.choose.rows.map((item, i) => {
                        if (i !== index) return item;
                        const lanes = sections.choose.laneLabels.map(
                          (_, li) =>
                            li === laneIndex
                              ? e.target.checked
                              : Boolean(item.lanes[li]),
                        );
                        return { ...item, lanes };
                      });
                      setSections({
                        ...sections,
                        choose: { ...sections.choose, rows },
                      });
                    }}
                  />
                  {label}
                </label>
              ))}
            </fieldset>
          </div>
        ))}
        <button
          type="button"
          onClick={() =>
            setSections({
              ...sections,
              choose: {
                ...sections.choose,
                rows: [
                  ...sections.choose.rows,
                  emptyWhatWeDoMatrixRow(sections.choose.laneLabels.length),
                ],
              },
            })
          }
          className="text-sm font-medium text-forest hover:text-forest-dark"
        >
          + Add row
        </button>
      </section>

      <section className="space-y-4">
        <div>
          <h2 className="font-display text-xl">Closing CTA</h2>
        </div>
        <Field
          label="Headline"
          id="wwd-cta-headline"
          hint="Line breaks become new lines on the page."
        >
          <TextArea
            id="wwd-cta-headline"
            rows={3}
            value={sections.cta.headline}
            onChange={(e) =>
              setSections({
                ...sections,
                cta: { ...sections.cta, headline: e.target.value },
              })
            }
          />
        </Field>
        <Field label="Body" id="wwd-cta-body">
          <TextArea
            id="wwd-cta-body"
            rows={3}
            value={sections.cta.body}
            onChange={(e) =>
              setSections({
                ...sections,
                cta: { ...sections.cta, body: e.target.value },
              })
            }
          />
        </Field>
        <div className="grid gap-4 md:grid-cols-2">
          <Field label="Primary button" id="wwd-cta-primary">
            <TextInput
              id="wwd-cta-primary"
              value={sections.cta.primaryCta}
              onChange={(e) =>
                setSections({
                  ...sections,
                  cta: { ...sections.cta, primaryCta: e.target.value },
                })
              }
            />
          </Field>
          <Field label="Primary URL" id="wwd-cta-primary-href">
            <TextInput
              id="wwd-cta-primary-href"
              value={sections.cta.primaryHref}
              onChange={(e) =>
                setSections({
                  ...sections,
                  cta: { ...sections.cta, primaryHref: e.target.value },
                })
              }
            />
          </Field>
          <Field label="Secondary button" id="wwd-cta-secondary">
            <TextInput
              id="wwd-cta-secondary"
              value={sections.cta.secondaryCta}
              onChange={(e) =>
                setSections({
                  ...sections,
                  cta: { ...sections.cta, secondaryCta: e.target.value },
                })
              }
            />
          </Field>
          <Field label="Secondary URL" id="wwd-cta-secondary-href">
            <TextInput
              id="wwd-cta-secondary-href"
              value={sections.cta.secondaryHref}
              onChange={(e) =>
                setSections({
                  ...sections,
                  cta: { ...sections.cta, secondaryHref: e.target.value },
                })
              }
            />
          </Field>
        </div>
      </section>

      <section className="space-y-4">
        <div>
          <h2 className="font-display text-xl">FAQ</h2>
          <p className="mt-1 text-sm text-muted">
            Accordion below the closing CTA on /what-we-do.
          </p>
        </div>
        <Field label="Eyebrow" id="wwd-faq-eyebrow">
          <TextInput
            id="wwd-faq-eyebrow"
            value={sections.faq.eyebrow}
            onChange={(e) =>
              setSections({
                ...sections,
                faq: { ...sections.faq, eyebrow: e.target.value },
              })
            }
          />
        </Field>
        <Field label="Headline" id="wwd-faq-headline">
          <TextArea
            id="wwd-faq-headline"
            rows={2}
            value={sections.faq.headline}
            onChange={(e) =>
              setSections({
                ...sections,
                faq: { ...sections.faq, headline: e.target.value },
              })
            }
          />
        </Field>
        <Field label="Subhead" id="wwd-faq-subhead">
          <TextArea
            id="wwd-faq-subhead"
            rows={3}
            value={sections.faq.subhead}
            onChange={(e) =>
              setSections({
                ...sections,
                faq: { ...sections.faq, subhead: e.target.value },
              })
            }
          />
        </Field>
        {sections.faq.items.map((item, index) => (
          <div
            key={`wwd-faq-${index}`}
            className="space-y-3 rounded-sm border border-charcoal/10 p-4"
          >
            <div className="flex items-center justify-between gap-3">
              <p className="text-sm font-medium text-charcoal">
                Question {index + 1}
              </p>
              <button
                type="button"
                onClick={() =>
                  setSections({
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
            <Field label="Question" id={`wwd-faq-q-${index}`}>
              <TextInput
                id={`wwd-faq-q-${index}`}
                value={item.q}
                onChange={(e) => {
                  const items = sections.faq.items.map((row, i) =>
                    i === index ? { ...row, q: e.target.value } : row,
                  );
                  setSections({
                    ...sections,
                    faq: { ...sections.faq, items },
                  });
                }}
              />
            </Field>
            <Field label="Answer" id={`wwd-faq-a-${index}`}>
              <TextArea
                id={`wwd-faq-a-${index}`}
                rows={4}
                value={item.a}
                onChange={(e) => {
                  const items = sections.faq.items.map((row, i) =>
                    i === index ? { ...row, a: e.target.value } : row,
                  );
                  setSections({
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
            setSections({
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
      </section>

      <div className="flex flex-wrap items-center gap-3 border-t border-charcoal/10 pt-6">
        <Button type="submit" disabled={pending}>
          {pending ? "Saving…" : "Save What we do"}
        </Button>
        {message ? (
          <p className={`text-sm ${ok ? "text-forest" : "text-danger"}`}>
            {message}
          </p>
        ) : null}
      </div>
    </form>
  );
}
