"use client";

import { useState } from "react";

import { Button, Field, TextArea, TextInput } from "@/components/ui";
import {
  APPLY_BENEFIT_ICONS,
  emptyApplyAuthorityItem,
  emptyApplyBenefit,
  emptyApplyFaqItem,
  emptyApplyPathStep,
  linesToList,
  listToLines,
  type ApplyBenefitIcon,
  type ApplyPageSections,
} from "@/lib/apply-page";

const ICON_LABEL: Record<ApplyBenefitIcon, string> = {
  envelope: "Envelope",
  briefcase: "Briefcase",
  microphone: "Microphone",
  chart: "Chart",
};

function LinesField({
  id,
  label,
  value,
  onChange,
  rows = 4,
}: {
  id: string;
  label: string;
  value: string[];
  onChange: (next: string[]) => void;
  rows?: number;
}) {
  return (
    <Field label={label} id={id} hint="One item per line.">
      <TextArea
        id={id}
        rows={rows}
        value={listToLines(value)}
        onChange={(e) => onChange(linesToList(e.target.value))}
      />
    </Field>
  );
}

export function ApplyPageEditorForm({
  initial,
  saveAction,
}: {
  initial: ApplyPageSections;
  saveAction: typeof import("@/lib/actions/admin-cms").saveApplyPage;
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
          <h2 className="font-display text-xl">Apply intro</h2>
          <p className="mt-1 text-sm text-muted">
            Copy to the left of the application form.
          </p>
        </div>
        <Field label="Badge" id="apply-badge">
          <TextInput
            id="apply-badge"
            value={sections.hero.badge}
            onChange={(e) =>
              setSections({
                ...sections,
                hero: { ...sections.hero, badge: e.target.value },
              })
            }
          />
        </Field>
        <Field
          label="Headline"
          id="apply-headline"
          hint="Line breaks become new lines on the page."
        >
          <TextArea
            id="apply-headline"
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
        <Field label="Subhead" id="apply-subhead">
          <TextArea
            id="apply-subhead"
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
        <LinesField
          id="apply-assurances"
          label="Assurances"
          value={sections.hero.assurances}
          onChange={(assurances) =>
            setSections({
              ...sections,
              hero: { ...sections.hero, assurances },
            })
          }
          rows={3}
        />
        <Field label="Next eyebrow" id="apply-next-eyebrow">
          <TextInput
            id="apply-next-eyebrow"
            value={sections.hero.nextEyebrow}
            onChange={(e) =>
              setSections({
                ...sections,
                hero: { ...sections.hero, nextEyebrow: e.target.value },
              })
            }
          />
        </Field>
        <LinesField
          id="apply-next"
          label="What happens next"
          value={sections.hero.next}
          onChange={(next) =>
            setSections({
              ...sections,
              hero: { ...sections.hero, next },
            })
          }
        />
      </section>

      <section className="space-y-4">
        <div>
          <h2 className="font-display text-xl">Authority</h2>
        </div>
        <Field label="Headline" id="apply-authority-headline">
          <TextArea
            id="apply-authority-headline"
            rows={2}
            value={sections.authority.headline}
            onChange={(e) =>
              setSections({
                ...sections,
                authority: { ...sections.authority, headline: e.target.value },
              })
            }
          />
        </Field>
        {sections.authority.items.map((item, index) => (
          <div
            key={`apply-auth-${index}`}
            className="space-y-3 rounded-sm border border-charcoal/10 p-4"
          >
            <div className="flex items-center justify-between gap-3">
              <p className="text-sm font-medium">Stat {index + 1}</p>
              <button
                type="button"
                onClick={() =>
                  setSections({
                    ...sections,
                    authority: {
                      ...sections.authority,
                      items: sections.authority.items.filter(
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
            <div className="grid gap-4 md:grid-cols-2">
              <Field label="Value" id={`apply-auth-value-${index}`}>
                <TextInput
                  id={`apply-auth-value-${index}`}
                  value={item.value}
                  onChange={(e) => {
                    const items = sections.authority.items.map((row, i) =>
                      i === index ? { ...row, value: e.target.value } : row,
                    );
                    setSections({
                      ...sections,
                      authority: { ...sections.authority, items },
                    });
                  }}
                />
              </Field>
              <Field label="Label" id={`apply-auth-label-${index}`}>
                <TextInput
                  id={`apply-auth-label-${index}`}
                  value={item.label}
                  onChange={(e) => {
                    const items = sections.authority.items.map((row, i) =>
                      i === index ? { ...row, label: e.target.value } : row,
                    );
                    setSections({
                      ...sections,
                      authority: { ...sections.authority, items },
                    });
                  }}
                />
              </Field>
            </div>
            <Field label="Note" id={`apply-auth-note-${index}`}>
              <TextArea
                id={`apply-auth-note-${index}`}
                rows={2}
                value={item.note}
                onChange={(e) => {
                  const items = sections.authority.items.map((row, i) =>
                    i === index ? { ...row, note: e.target.value } : row,
                  );
                  setSections({
                    ...sections,
                    authority: { ...sections.authority, items },
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
              authority: {
                ...sections.authority,
                items: [...sections.authority.items, emptyApplyAuthorityItem()],
              },
            })
          }
          className="text-sm font-medium text-forest hover:text-forest-dark"
        >
          + Add stat
        </button>
      </section>

      <section className="space-y-4">
        <div>
          <h2 className="font-display text-xl">Self qualify</h2>
        </div>
        <Field label="Eyebrow" id="apply-qualify-eyebrow">
          <TextInput
            id="apply-qualify-eyebrow"
            value={sections.qualify.eyebrow}
            onChange={(e) =>
              setSections({
                ...sections,
                qualify: { ...sections.qualify, eyebrow: e.target.value },
              })
            }
          />
        </Field>
        <Field label="Headline" id="apply-qualify-headline">
          <TextArea
            id="apply-qualify-headline"
            rows={2}
            value={sections.qualify.headline}
            onChange={(e) =>
              setSections({
                ...sections,
                qualify: { ...sections.qualify, headline: e.target.value },
              })
            }
          />
        </Field>
        <Field label="Subhead" id="apply-qualify-subhead">
          <TextArea
            id="apply-qualify-subhead"
            rows={3}
            value={sections.qualify.subhead}
            onChange={(e) =>
              setSections({
                ...sections,
                qualify: { ...sections.qualify, subhead: e.target.value },
              })
            }
          />
        </Field>
        <Field label="Fit eyebrow" id="apply-fit-eyebrow">
          <TextInput
            id="apply-fit-eyebrow"
            value={sections.qualify.fitEyebrow}
            onChange={(e) =>
              setSections({
                ...sections,
                qualify: { ...sections.qualify, fitEyebrow: e.target.value },
              })
            }
          />
        </Field>
        <LinesField
          id="apply-fit"
          label="Likely a fit"
          value={sections.qualify.fit}
          onChange={(fit) =>
            setSections({
              ...sections,
              qualify: { ...sections.qualify, fit },
            })
          }
        />
        <Field label="Not-fit eyebrow" id="apply-notfit-eyebrow">
          <TextInput
            id="apply-notfit-eyebrow"
            value={sections.qualify.notFitEyebrow}
            onChange={(e) =>
              setSections({
                ...sections,
                qualify: { ...sections.qualify, notFitEyebrow: e.target.value },
              })
            }
          />
        </Field>
        <LinesField
          id="apply-notfit"
          label="Probably not a fit"
          value={sections.qualify.notFit}
          onChange={(notFit) =>
            setSections({
              ...sections,
              qualify: { ...sections.qualify, notFit },
            })
          }
        />
      </section>

      <section className="space-y-4">
        <div>
          <h2 className="font-display text-xl">The path</h2>
        </div>
        <Field label="Eyebrow" id="apply-path-eyebrow">
          <TextInput
            id="apply-path-eyebrow"
            value={sections.path.eyebrow}
            onChange={(e) =>
              setSections({
                ...sections,
                path: { ...sections.path, eyebrow: e.target.value },
              })
            }
          />
        </Field>
        <Field label="Headline" id="apply-path-headline">
          <TextArea
            id="apply-path-headline"
            rows={2}
            value={sections.path.headline}
            onChange={(e) =>
              setSections({
                ...sections,
                path: { ...sections.path, headline: e.target.value },
              })
            }
          />
        </Field>
        <Field label="Subhead" id="apply-path-subhead">
          <TextArea
            id="apply-path-subhead"
            rows={3}
            value={sections.path.subhead}
            onChange={(e) =>
              setSections({
                ...sections,
                path: { ...sections.path, subhead: e.target.value },
              })
            }
          />
        </Field>
        {sections.path.steps.map((step, index) => (
          <div
            key={`apply-path-${index}`}
            className="space-y-3 rounded-sm border border-charcoal/10 p-4"
          >
            <div className="flex items-center justify-between gap-3">
              <p className="text-sm font-medium">Step {index + 1}</p>
              <button
                type="button"
                onClick={() =>
                  setSections({
                    ...sections,
                    path: {
                      ...sections.path,
                      steps: sections.path.steps.filter((_, i) => i !== index),
                    },
                  })
                }
                className="text-xs font-medium text-danger hover:underline"
              >
                Remove
              </button>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <Field label="Number" id={`apply-path-n-${index}`}>
                <TextInput
                  id={`apply-path-n-${index}`}
                  value={step.n}
                  onChange={(e) => {
                    const steps = sections.path.steps.map((row, i) =>
                      i === index ? { ...row, n: e.target.value } : row,
                    );
                    setSections({
                      ...sections,
                      path: { ...sections.path, steps },
                    });
                  }}
                />
              </Field>
              <Field label="Phase" id={`apply-path-phase-${index}`}>
                <TextInput
                  id={`apply-path-phase-${index}`}
                  value={step.phase}
                  onChange={(e) => {
                    const steps = sections.path.steps.map((row, i) =>
                      i === index ? { ...row, phase: e.target.value } : row,
                    );
                    setSections({
                      ...sections,
                      path: { ...sections.path, steps },
                    });
                  }}
                />
              </Field>
            </div>
            <Field label="Title" id={`apply-path-title-${index}`}>
              <TextInput
                id={`apply-path-title-${index}`}
                value={step.title}
                onChange={(e) => {
                  const steps = sections.path.steps.map((row, i) =>
                    i === index ? { ...row, title: e.target.value } : row,
                  );
                  setSections({
                    ...sections,
                    path: { ...sections.path, steps },
                  });
                }}
              />
            </Field>
            <Field label="Body" id={`apply-path-body-${index}`}>
              <TextArea
                id={`apply-path-body-${index}`}
                rows={3}
                value={step.body}
                onChange={(e) => {
                  const steps = sections.path.steps.map((row, i) =>
                    i === index ? { ...row, body: e.target.value } : row,
                  );
                  setSections({
                    ...sections,
                    path: { ...sections.path, steps },
                  });
                }}
              />
            </Field>
            <Field label="Outcome" id={`apply-path-outcome-${index}`}>
              <TextInput
                id={`apply-path-outcome-${index}`}
                value={step.outcome}
                onChange={(e) => {
                  const steps = sections.path.steps.map((row, i) =>
                    i === index ? { ...row, outcome: e.target.value } : row,
                  );
                  setSections({
                    ...sections,
                    path: { ...sections.path, steps },
                  });
                }}
              />
            </Field>
            <label className="flex items-center gap-2 text-sm text-charcoal">
              <input
                type="checkbox"
                checked={step.filled}
                onChange={(e) => {
                  const steps = sections.path.steps.map((row, i) =>
                    i === index ? { ...row, filled: e.target.checked } : row,
                  );
                  setSections({
                    ...sections,
                    path: { ...sections.path, steps },
                  });
                }}
              />
              Filled outcome pill
            </label>
          </div>
        ))}
        <button
          type="button"
          onClick={() =>
            setSections({
              ...sections,
              path: {
                ...sections.path,
                steps: [...sections.path.steps, emptyApplyPathStep()],
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
          <h2 className="font-display text-xl">What you get</h2>
        </div>
        <Field label="Eyebrow" id="apply-benefits-eyebrow">
          <TextInput
            id="apply-benefits-eyebrow"
            value={sections.benefits.eyebrow}
            onChange={(e) =>
              setSections({
                ...sections,
                benefits: { ...sections.benefits, eyebrow: e.target.value },
              })
            }
          />
        </Field>
        <Field label="Headline" id="apply-benefits-headline">
          <TextArea
            id="apply-benefits-headline"
            rows={2}
            value={sections.benefits.headline}
            onChange={(e) =>
              setSections({
                ...sections,
                benefits: { ...sections.benefits, headline: e.target.value },
              })
            }
          />
        </Field>
        <Field label="Subhead" id="apply-benefits-subhead">
          <TextArea
            id="apply-benefits-subhead"
            rows={3}
            value={sections.benefits.subhead}
            onChange={(e) =>
              setSections({
                ...sections,
                benefits: { ...sections.benefits, subhead: e.target.value },
              })
            }
          />
        </Field>
        {sections.benefits.items.map((item, index) => (
          <div
            key={`apply-benefit-${index}`}
            className="space-y-3 rounded-sm border border-charcoal/10 p-4"
          >
            <div className="flex items-center justify-between gap-3">
              <p className="text-sm font-medium">Benefit {index + 1}</p>
              <button
                type="button"
                onClick={() =>
                  setSections({
                    ...sections,
                    benefits: {
                      ...sections.benefits,
                      items: sections.benefits.items.filter(
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
            <Field label="Icon" id={`apply-benefit-icon-${index}`}>
              <select
                id={`apply-benefit-icon-${index}`}
                className="w-full border border-forest/40 bg-transparent px-4 py-3 text-sm text-charcoal outline-none focus:border-forest"
                value={item.icon}
                onChange={(e) => {
                  const icon = e.target.value as ApplyBenefitIcon;
                  const items = sections.benefits.items.map((row, i) =>
                    i === index ? { ...row, icon } : row,
                  );
                  setSections({
                    ...sections,
                    benefits: { ...sections.benefits, items },
                  });
                }}
              >
                {APPLY_BENEFIT_ICONS.map((icon) => (
                  <option key={icon} value={icon}>
                    {ICON_LABEL[icon]}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Title" id={`apply-benefit-title-${index}`}>
              <TextInput
                id={`apply-benefit-title-${index}`}
                value={item.title}
                onChange={(e) => {
                  const items = sections.benefits.items.map((row, i) =>
                    i === index ? { ...row, title: e.target.value } : row,
                  );
                  setSections({
                    ...sections,
                    benefits: { ...sections.benefits, items },
                  });
                }}
              />
            </Field>
            <Field label="Body" id={`apply-benefit-body-${index}`}>
              <TextArea
                id={`apply-benefit-body-${index}`}
                rows={2}
                value={item.body}
                onChange={(e) => {
                  const items = sections.benefits.items.map((row, i) =>
                    i === index ? { ...row, body: e.target.value } : row,
                  );
                  setSections({
                    ...sections,
                    benefits: { ...sections.benefits, items },
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
              benefits: {
                ...sections.benefits,
                items: [...sections.benefits.items, emptyApplyBenefit()],
              },
            })
          }
          className="text-sm font-medium text-forest hover:text-forest-dark"
        >
          + Add benefit
        </button>
      </section>

      <section className="space-y-4">
        <div>
          <h2 className="font-display text-xl">FAQ</h2>
        </div>
        <Field label="Eyebrow" id="apply-faq-eyebrow">
          <TextInput
            id="apply-faq-eyebrow"
            value={sections.faq.eyebrow}
            onChange={(e) =>
              setSections({
                ...sections,
                faq: { ...sections.faq, eyebrow: e.target.value },
              })
            }
          />
        </Field>
        <Field label="Headline" id="apply-faq-headline">
          <TextArea
            id="apply-faq-headline"
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
        <Field label="Subhead" id="apply-faq-subhead">
          <TextArea
            id="apply-faq-subhead"
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
            key={`apply-faq-${index}`}
            className="space-y-3 rounded-sm border border-charcoal/10 p-4"
          >
            <div className="flex items-center justify-between gap-3">
              <p className="text-sm font-medium">Question {index + 1}</p>
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
            <Field label="Question" id={`apply-faq-q-${index}`}>
              <TextInput
                id={`apply-faq-q-${index}`}
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
            <Field label="Answer" id={`apply-faq-a-${index}`}>
              <TextArea
                id={`apply-faq-a-${index}`}
                rows={3}
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
                items: [...sections.faq.items, emptyApplyFaqItem()],
              },
            })
          }
          className="text-sm font-medium text-forest hover:text-forest-dark"
        >
          + Add question
        </button>
      </section>

      <section className="space-y-4">
        <div>
          <h2 className="font-display text-xl">Start application</h2>
        </div>
        <Field label="Eyebrow" id="apply-cta-eyebrow">
          <TextInput
            id="apply-cta-eyebrow"
            value={sections.cta.eyebrow}
            onChange={(e) =>
              setSections({
                ...sections,
                cta: { ...sections.cta, eyebrow: e.target.value },
              })
            }
          />
        </Field>
        <Field label="Headline" id="apply-cta-headline">
          <TextArea
            id="apply-cta-headline"
            rows={2}
            value={sections.cta.headline}
            onChange={(e) =>
              setSections({
                ...sections,
                cta: { ...sections.cta, headline: e.target.value },
              })
            }
          />
        </Field>
        <Field label="Body" id="apply-cta-body">
          <TextArea
            id="apply-cta-body"
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
          <Field label="Primary button" id="apply-cta-primary">
            <TextInput
              id="apply-cta-primary"
              value={sections.cta.primaryCta}
              onChange={(e) =>
                setSections({
                  ...sections,
                  cta: { ...sections.cta, primaryCta: e.target.value },
                })
              }
            />
          </Field>
          <Field label="Primary URL" id="apply-cta-primary-href">
            <TextInput
              id="apply-cta-primary-href"
              value={sections.cta.primaryHref}
              onChange={(e) =>
                setSections({
                  ...sections,
                  cta: { ...sections.cta, primaryHref: e.target.value },
                })
              }
            />
          </Field>
          <Field label="Secondary button" id="apply-cta-secondary">
            <TextInput
              id="apply-cta-secondary"
              value={sections.cta.secondaryCta}
              onChange={(e) =>
                setSections({
                  ...sections,
                  cta: { ...sections.cta, secondaryCta: e.target.value },
                })
              }
            />
          </Field>
          <Field label="Secondary URL" id="apply-cta-secondary-href">
            <TextInput
              id="apply-cta-secondary-href"
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

      <div className="flex flex-wrap items-center gap-3 border-t border-charcoal/10 pt-6">
        <Button type="submit" disabled={pending}>
          {pending ? "Saving…" : "Save Apply page"}
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
