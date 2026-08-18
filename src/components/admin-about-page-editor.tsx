"use client";

import { useState } from "react";

import { MediaField } from "@/components/media-library";
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

export function AboutPageEditorForm({
  initial,
  saveAction,
}: {
  initial: AboutPageSections;
  saveAction: typeof import("@/lib/actions/admin-cms").saveAboutPage;
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
            Overlay copy, stats, CTAs, and the stage image.
          </p>
        </div>
        <MediaField
          label="Background image"
          value={sections.hero.image}
          onChange={(image) =>
            setSections({
              ...sections,
              hero: { ...sections.hero, image },
            })
          }
        />
        <Field label="Eyebrow" id="about-hero-eyebrow">
          <TextInput
            id="about-hero-eyebrow"
            value={sections.hero.eyebrow}
            onChange={(e) =>
              setSections({
                ...sections,
                hero: { ...sections.hero, eyebrow: e.target.value },
              })
            }
          />
        </Field>
        <Field
          label="Headline"
          id="about-hero-headline"
          hint="Line breaks become new lines on the page."
        >
          <TextArea
            id="about-hero-headline"
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
        <Field label="Subhead" id="about-hero-subhead">
          <TextArea
            id="about-hero-subhead"
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
        {sections.hero.stats.map((stat, index) => (
          <div
            key={`about-stat-${index}`}
            className="space-y-3 rounded-sm border border-charcoal/10 p-4"
          >
            <div className="flex items-center justify-between gap-3">
              <p className="text-sm font-medium">Stat {index + 1}</p>
              <button
                type="button"
                onClick={() =>
                  setSections({
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
            <div className="grid gap-4 md:grid-cols-2">
              <Field label="Label" id={`about-stat-label-${index}`}>
                <TextInput
                  id={`about-stat-label-${index}`}
                  value={stat.label}
                  onChange={(e) => {
                    const stats = sections.hero.stats.map((row, i) =>
                      i === index ? { ...row, label: e.target.value } : row,
                    );
                    setSections({
                      ...sections,
                      hero: { ...sections.hero, stats },
                    });
                  }}
                />
              </Field>
              <Field label="Value" id={`about-stat-value-${index}`}>
                <TextInput
                  id={`about-stat-value-${index}`}
                  value={stat.value}
                  onChange={(e) => {
                    const stats = sections.hero.stats.map((row, i) =>
                      i === index ? { ...row, value: e.target.value } : row,
                    );
                    setSections({
                      ...sections,
                      hero: { ...sections.hero, stats },
                    });
                  }}
                />
              </Field>
            </div>
          </div>
        ))}
        <button
          type="button"
          onClick={() =>
            setSections({
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
        <div className="grid gap-4 md:grid-cols-2">
          <Field label="Primary button" id="about-hero-primary">
            <TextInput
              id="about-hero-primary"
              value={sections.hero.primaryCta}
              onChange={(e) =>
                setSections({
                  ...sections,
                  hero: { ...sections.hero, primaryCta: e.target.value },
                })
              }
            />
          </Field>
          <Field label="Primary URL" id="about-hero-primary-href">
            <TextInput
              id="about-hero-primary-href"
              value={sections.hero.primaryHref}
              onChange={(e) =>
                setSections({
                  ...sections,
                  hero: { ...sections.hero, primaryHref: e.target.value },
                })
              }
            />
          </Field>
          <Field label="Secondary button" id="about-hero-secondary">
            <TextInput
              id="about-hero-secondary"
              value={sections.hero.secondaryCta}
              onChange={(e) =>
                setSections({
                  ...sections,
                  hero: { ...sections.hero, secondaryCta: e.target.value },
                })
              }
            />
          </Field>
          <Field label="Secondary URL" id="about-hero-secondary-href">
            <TextInput
              id="about-hero-secondary-href"
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
      </section>

      <section className="space-y-4">
        <div>
          <h2 className="font-display text-xl">Thesis</h2>
        </div>
        <Field label="Eyebrow" id="about-thesis-eyebrow">
          <TextInput
            id="about-thesis-eyebrow"
            value={sections.thesis.eyebrow}
            onChange={(e) =>
              setSections({
                ...sections,
                thesis: { ...sections.thesis, eyebrow: e.target.value },
              })
            }
          />
        </Field>
        <Field label="Headline" id="about-thesis-headline">
          <TextArea
            id="about-thesis-headline"
            rows={2}
            value={sections.thesis.headline}
            onChange={(e) =>
              setSections({
                ...sections,
                thesis: { ...sections.thesis, headline: e.target.value },
              })
            }
          />
        </Field>
        <Field label="Body" id="about-thesis-body">
          <TextArea
            id="about-thesis-body"
            rows={4}
            value={sections.thesis.body}
            onChange={(e) =>
              setSections({
                ...sections,
                thesis: { ...sections.thesis, body: e.target.value },
              })
            }
          />
        </Field>
      </section>

      <section className="space-y-4">
        <div>
          <h2 className="font-display text-xl">Why we exist</h2>
          <p className="mt-1 text-sm text-muted">
            Main story, on-this-page links, and the brief card.
          </p>
        </div>
        <Field label="Eyebrow" id="about-why-eyebrow">
          <TextInput
            id="about-why-eyebrow"
            value={sections.why.eyebrow}
            onChange={(e) =>
              setSections({
                ...sections,
                why: { ...sections.why, eyebrow: e.target.value },
              })
            }
          />
        </Field>
        <Field label="Headline" id="about-why-headline">
          <TextArea
            id="about-why-headline"
            rows={3}
            value={sections.why.headline}
            onChange={(e) =>
              setSections({
                ...sections,
                why: { ...sections.why, headline: e.target.value },
              })
            }
          />
        </Field>
        <Field
          label="Body"
          id="about-why-body"
          hint="Separate paragraphs with a blank line."
        >
          <TextArea
            id="about-why-body"
            rows={10}
            value={paragraphsToText(sections.why.paragraphs)}
            onChange={(e) =>
              setSections({
                ...sections,
                why: {
                  ...sections.why,
                  paragraphs: textToParagraphs(e.target.value),
                },
              })
            }
          />
        </Field>
        <Field label="Nav eyebrow" id="about-jump-eyebrow">
          <TextInput
            id="about-jump-eyebrow"
            value={sections.why.jumpEyebrow}
            onChange={(e) =>
              setSections({
                ...sections,
                why: { ...sections.why, jumpEyebrow: e.target.value },
              })
            }
          />
        </Field>
        {sections.why.jumps.map((item, index) => (
          <div
            key={`about-jump-${index}`}
            className="space-y-3 rounded-sm border border-charcoal/10 p-4"
          >
            <div className="flex items-center justify-between gap-3">
              <p className="text-sm font-medium">Link {index + 1}</p>
              <button
                type="button"
                onClick={() =>
                  setSections({
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
            <div className="grid gap-4 md:grid-cols-2">
              <Field label="Label" id={`about-jump-label-${index}`}>
                <TextInput
                  id={`about-jump-label-${index}`}
                  value={item.label}
                  onChange={(e) => {
                    const jumps = sections.why.jumps.map((row, i) =>
                      i === index ? { ...row, label: e.target.value } : row,
                    );
                    setSections({
                      ...sections,
                      why: { ...sections.why, jumps },
                    });
                  }}
                />
              </Field>
              <Field label="URL" id={`about-jump-href-${index}`}>
                <TextInput
                  id={`about-jump-href-${index}`}
                  value={item.href}
                  onChange={(e) => {
                    const jumps = sections.why.jumps.map((row, i) =>
                      i === index ? { ...row, href: e.target.value } : row,
                    );
                    setSections({
                      ...sections,
                      why: { ...sections.why, jumps },
                    });
                  }}
                />
              </Field>
            </div>
          </div>
        ))}
        <button
          type="button"
          onClick={() =>
            setSections({
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
        <Field label="Card headline" id="about-aside-headline">
          <TextInput
            id="about-aside-headline"
            value={sections.why.asideHeadline}
            onChange={(e) =>
              setSections({
                ...sections,
                why: { ...sections.why, asideHeadline: e.target.value },
              })
            }
          />
        </Field>
        <Field label="Card body" id="about-aside-body">
          <TextArea
            id="about-aside-body"
            rows={3}
            value={sections.why.asideBody}
            onChange={(e) =>
              setSections({
                ...sections,
                why: { ...sections.why, asideBody: e.target.value },
              })
            }
          />
        </Field>
        <div className="grid gap-4 md:grid-cols-2">
          <Field label="Card link" id="about-aside-cta">
            <TextInput
              id="about-aside-cta"
              value={sections.why.asideCta}
              onChange={(e) =>
                setSections({
                  ...sections,
                  why: { ...sections.why, asideCta: e.target.value },
                })
              }
            />
          </Field>
          <Field label="Card URL" id="about-aside-href">
            <TextInput
              id="about-aside-href"
              value={sections.why.asideHref}
              onChange={(e) =>
                setSections({
                  ...sections,
                  why: { ...sections.why, asideHref: e.target.value },
                })
              }
            />
          </Field>
        </div>
      </section>

      <section className="space-y-4">
        <div>
          <h2 className="font-display text-xl">Operating model</h2>
        </div>
        <Field label="Headline" id="about-ledger-headline">
          <TextArea
            id="about-ledger-headline"
            rows={2}
            value={sections.ledger.headline}
            onChange={(e) =>
              setSections({
                ...sections,
                ledger: { ...sections.ledger, headline: e.target.value },
              })
            }
          />
        </Field>
        <Field label="Subhead" id="about-ledger-subhead">
          <TextArea
            id="about-ledger-subhead"
            rows={3}
            value={sections.ledger.subhead}
            onChange={(e) =>
              setSections({
                ...sections,
                ledger: { ...sections.ledger, subhead: e.target.value },
              })
            }
          />
        </Field>
        {sections.ledger.items.map((item, index) => (
          <div
            key={`about-ledger-${index}`}
            className="space-y-3 rounded-sm border border-charcoal/10 p-4"
          >
            <div className="flex items-center justify-between gap-3">
              <p className="text-sm font-medium">Row {index + 1}</p>
              <button
                type="button"
                onClick={() =>
                  setSections({
                    ...sections,
                    ledger: {
                      ...sections.ledger,
                      items: sections.ledger.items.filter((_, i) => i !== index),
                    },
                  })
                }
                className="text-xs font-medium text-danger hover:underline"
              >
                Remove
              </button>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <Field label="Value" id={`about-ledger-value-${index}`}>
                <TextInput
                  id={`about-ledger-value-${index}`}
                  value={item.value}
                  onChange={(e) => {
                    const items = sections.ledger.items.map((row, i) =>
                      i === index ? { ...row, value: e.target.value } : row,
                    );
                    setSections({
                      ...sections,
                      ledger: { ...sections.ledger, items },
                    });
                  }}
                />
              </Field>
              <Field label="Label" id={`about-ledger-label-${index}`}>
                <TextInput
                  id={`about-ledger-label-${index}`}
                  value={item.label}
                  onChange={(e) => {
                    const items = sections.ledger.items.map((row, i) =>
                      i === index ? { ...row, label: e.target.value } : row,
                    );
                    setSections({
                      ...sections,
                      ledger: { ...sections.ledger, items },
                    });
                  }}
                />
              </Field>
            </div>
            <Field label="Note" id={`about-ledger-note-${index}`}>
              <TextArea
                id={`about-ledger-note-${index}`}
                rows={2}
                value={item.note}
                onChange={(e) => {
                  const items = sections.ledger.items.map((row, i) =>
                    i === index ? { ...row, note: e.target.value } : row,
                  );
                  setSections({
                    ...sections,
                    ledger: { ...sections.ledger, items },
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
              ledger: {
                ...sections.ledger,
                items: [...sections.ledger.items, emptyAboutLedgerItem()],
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
          <h2 className="font-display text-xl">How we work</h2>
        </div>
        <Field label="Headline" id="about-model-headline">
          <TextArea
            id="about-model-headline"
            rows={2}
            value={sections.model.headline}
            onChange={(e) =>
              setSections({
                ...sections,
                model: { ...sections.model, headline: e.target.value },
              })
            }
          />
        </Field>
        <Field label="Subhead" id="about-model-subhead">
          <TextArea
            id="about-model-subhead"
            rows={3}
            value={sections.model.subhead}
            onChange={(e) =>
              setSections({
                ...sections,
                model: { ...sections.model, subhead: e.target.value },
              })
            }
          />
        </Field>
        {sections.model.items.map((item, index) => (
          <div
            key={`about-model-${index}`}
            className="space-y-3 rounded-sm border border-charcoal/10 p-4"
          >
            <div className="flex items-center justify-between gap-3">
              <p className="text-sm font-medium">Item {index + 1}</p>
              <button
                type="button"
                onClick={() =>
                  setSections({
                    ...sections,
                    model: {
                      ...sections.model,
                      items: sections.model.items.filter((_, i) => i !== index),
                    },
                  })
                }
                className="text-xs font-medium text-danger hover:underline"
              >
                Remove
              </button>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <Field label="Number" id={`about-model-n-${index}`}>
                <TextInput
                  id={`about-model-n-${index}`}
                  value={item.n}
                  onChange={(e) => {
                    const items = sections.model.items.map((row, i) =>
                      i === index ? { ...row, n: e.target.value } : row,
                    );
                    setSections({
                      ...sections,
                      model: { ...sections.model, items },
                    });
                  }}
                />
              </Field>
              <Field label="Title" id={`about-model-title-${index}`}>
                <TextInput
                  id={`about-model-title-${index}`}
                  value={item.title}
                  onChange={(e) => {
                    const items = sections.model.items.map((row, i) =>
                      i === index ? { ...row, title: e.target.value } : row,
                    );
                    setSections({
                      ...sections,
                      model: { ...sections.model, items },
                    });
                  }}
                />
              </Field>
            </div>
            <Field label="Body" id={`about-model-body-${index}`}>
              <TextArea
                id={`about-model-body-${index}`}
                rows={2}
                value={item.body}
                onChange={(e) => {
                  const items = sections.model.items.map((row, i) =>
                    i === index ? { ...row, body: e.target.value } : row,
                  );
                  setSections({
                    ...sections,
                    model: { ...sections.model, items },
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
              model: {
                ...sections.model,
                items: [...sections.model.items, emptyAboutModelItem()],
              },
            })
          }
          className="text-sm font-medium text-forest hover:text-forest-dark"
        >
          + Add item
        </button>
      </section>

      <section className="space-y-4">
        <div>
          <h2 className="font-display text-xl">Roster</h2>
          <p className="mt-1 text-sm text-muted">
            Intro copy and the scrolling archetype rail.
          </p>
        </div>
        <Field label="Eyebrow" id="about-roster-eyebrow">
          <TextInput
            id="about-roster-eyebrow"
            value={sections.roster.eyebrow}
            onChange={(e) =>
              setSections({
                ...sections,
                roster: { ...sections.roster, eyebrow: e.target.value },
              })
            }
          />
        </Field>
        <Field label="Headline" id="about-roster-headline">
          <TextArea
            id="about-roster-headline"
            rows={2}
            value={sections.roster.headline}
            onChange={(e) =>
              setSections({
                ...sections,
                roster: { ...sections.roster, headline: e.target.value },
              })
            }
          />
        </Field>
        <Field label="Subhead" id="about-roster-subhead">
          <TextArea
            id="about-roster-subhead"
            rows={4}
            value={sections.roster.subhead}
            onChange={(e) =>
              setSections({
                ...sections,
                roster: { ...sections.roster, subhead: e.target.value },
              })
            }
          />
        </Field>
        {sections.roster.lanes.map((lane, index) => (
          <div
            key={`about-lane-${index}`}
            className="space-y-3 rounded-sm border border-charcoal/10 p-4"
          >
            <div className="flex items-center justify-between gap-3">
              <p className="text-sm font-medium">Lane {index + 1}</p>
              <button
                type="button"
                onClick={() =>
                  setSections({
                    ...sections,
                    roster: {
                      ...sections.roster,
                      lanes: sections.roster.lanes.filter((_, i) => i !== index),
                    },
                  })
                }
                className="text-xs font-medium text-danger hover:underline"
              >
                Remove
              </button>
            </div>
            <Field label="Title" id={`about-lane-title-${index}`}>
              <TextInput
                id={`about-lane-title-${index}`}
                value={lane.title}
                onChange={(e) => {
                  const lanes = sections.roster.lanes.map((row, i) =>
                    i === index ? { ...row, title: e.target.value } : row,
                  );
                  setSections({
                    ...sections,
                    roster: { ...sections.roster, lanes },
                  });
                }}
              />
            </Field>
            <Field label="Body" id={`about-lane-body-${index}`}>
              <TextArea
                id={`about-lane-body-${index}`}
                rows={2}
                value={lane.body}
                onChange={(e) => {
                  const lanes = sections.roster.lanes.map((row, i) =>
                    i === index ? { ...row, body: e.target.value } : row,
                  );
                  setSections({
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
                setSections({
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
            setSections({
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
      </section>

      <section className="space-y-4">
        <div>
          <h2 className="font-display text-xl">Two ways in</h2>
        </div>
        <Field label="Eyebrow" id="about-cta-eyebrow">
          <TextInput
            id="about-cta-eyebrow"
            value={sections.cta.eyebrow}
            onChange={(e) =>
              setSections({
                ...sections,
                cta: { ...sections.cta, eyebrow: e.target.value },
              })
            }
          />
        </Field>
        <Field
          label="Headline"
          id="about-cta-headline"
          hint="Line breaks become new lines on the page."
        >
          <TextArea
            id="about-cta-headline"
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
        <Field label="Body" id="about-cta-body">
          <TextArea
            id="about-cta-body"
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
        {sections.cta.faces.map((face, index) => (
          <div
            key={`about-face-${index}`}
            className="space-y-3 rounded-sm border border-charcoal/10 p-4"
          >
            <div className="flex items-center justify-between gap-3">
              <p className="text-sm font-medium">Portrait {index + 1}</p>
              <button
                type="button"
                onClick={() =>
                  setSections({
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
                setSections({
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
            setSections({
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
        <div className="grid gap-4 md:grid-cols-2">
          <Field label="Faces label" id="about-cta-faces-label">
            <TextInput
              id="about-cta-faces-label"
              value={sections.cta.facesLabel}
              onChange={(e) =>
                setSections({
                  ...sections,
                  cta: { ...sections.cta, facesLabel: e.target.value },
                })
              }
            />
          </Field>
          <Field label="Faces note" id="about-cta-faces-note">
            <TextInput
              id="about-cta-faces-note"
              value={sections.cta.facesNote}
              onChange={(e) =>
                setSections({
                  ...sections,
                  cta: { ...sections.cta, facesNote: e.target.value },
                })
              }
            />
          </Field>
          <Field label="Primary button" id="about-cta-primary">
            <TextInput
              id="about-cta-primary"
              value={sections.cta.primaryCta}
              onChange={(e) =>
                setSections({
                  ...sections,
                  cta: { ...sections.cta, primaryCta: e.target.value },
                })
              }
            />
          </Field>
          <Field label="Primary URL" id="about-cta-primary-href">
            <TextInput
              id="about-cta-primary-href"
              value={sections.cta.primaryHref}
              onChange={(e) =>
                setSections({
                  ...sections,
                  cta: { ...sections.cta, primaryHref: e.target.value },
                })
              }
            />
          </Field>
          <Field label="Secondary button" id="about-cta-secondary">
            <TextInput
              id="about-cta-secondary"
              value={sections.cta.secondaryCta}
              onChange={(e) =>
                setSections({
                  ...sections,
                  cta: { ...sections.cta, secondaryCta: e.target.value },
                })
              }
            />
          </Field>
          <Field label="Secondary URL" id="about-cta-secondary-href">
            <TextInput
              id="about-cta-secondary-href"
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
          {pending ? "Saving…" : "Save About"}
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
