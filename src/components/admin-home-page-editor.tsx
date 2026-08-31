"use client";

import { useState } from "react";

import {
  CtaStyleControls,
  HeadlineStyleControls,
  TextStyleControls,
} from "@/components/home-style-controls";
import { RosterFeaturedSlotsField } from "@/components/roster-featured-slots-field";
import { Button, Field, TextArea, TextInput } from "@/components/ui";
import { MediaField } from "@/components/media-library";
import type { HomePageSections } from "@/lib/cms";
import { DEFAULT_HOME_SECTIONS, emptyHomeFaqItem } from "@/lib/cms";
import { TRUSTED_BY_LOGO_HINT } from "@/lib/trusted-by";
import { cn } from "@/lib/utils";

export function HomePageEditorForm({
  initial,
  rosterOptions = [],
  saveAction,
}: {
  initial: HomePageSections;
  rosterOptions?: Array<{ slug: string; name: string }>;
  saveAction: typeof import("@/lib/actions/admin-cms").saveHomePage;
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

  function patch<K extends keyof HomePageSections>(
    key: K,
    value: HomePageSections[K],
  ) {
    setSections({ ...sections, [key]: value });
  }

  const hero = sections.hero;

  return (
    <form onSubmit={onSubmit} className="space-y-10">
      <section className="space-y-4">
        <h2 className="font-display text-xl">Hero</h2>
        <Field label="Headline" id="headline">
          <TextArea
            id="headline"
            rows={2}
            value={hero.headline}
            onChange={(e) => patch("hero", { ...hero, headline: e.target.value })}
            required
          />
        </Field>
        <HeadlineStyleControls
          value={hero.headlineStyle}
          onChange={(headlineStyle) => patch("hero", { ...hero, headlineStyle })}
        />
        <Field label="Supporting line" id="subhead">
          <TextArea
            id="subhead"
            rows={3}
            value={hero.subhead}
            onChange={(e) => patch("hero", { ...hero, subhead: e.target.value })}
            required
          />
        </Field>
        <TextStyleControls
          value={hero.subheadStyle}
          onChange={(subheadStyle) => patch("hero", { ...hero, subheadStyle })}
        />
        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-4 rounded-sm border border-charcoal/10 p-4">
            <p className="text-sm font-medium">Primary CTA</p>
            <Field label="Label" id="primaryCta">
              <TextInput
                id="primaryCta"
                value={hero.primaryCta}
                onChange={(e) =>
                  patch("hero", { ...hero, primaryCta: e.target.value })
                }
              />
            </Field>
            <Field label="Link" id="primaryHref">
              <TextInput
                id="primaryHref"
                value={hero.primaryHref}
                onChange={(e) =>
                  patch("hero", { ...hero, primaryHref: e.target.value })
                }
              />
            </Field>
            <CtaStyleControls
              value={hero.primaryCtaStyle}
              onChange={(primaryCtaStyle) =>
                patch("hero", { ...hero, primaryCtaStyle })
              }
            />
          </div>
          <div className="space-y-4 rounded-sm border border-charcoal/10 p-4">
            <p className="text-sm font-medium">Secondary CTA</p>
            <Field label="Label" id="secondaryCta">
              <TextInput
                id="secondaryCta"
                value={hero.secondaryCta}
                onChange={(e) =>
                  patch("hero", { ...hero, secondaryCta: e.target.value })
                }
              />
            </Field>
            <Field label="Link" id="secondaryHref">
              <TextInput
                id="secondaryHref"
                value={hero.secondaryHref}
                onChange={(e) =>
                  patch("hero", { ...hero, secondaryHref: e.target.value })
                }
              />
            </Field>
            <CtaStyleControls
              value={hero.secondaryCtaStyle}
              onChange={(secondaryCtaStyle) =>
                patch("hero", { ...hero, secondaryCtaStyle })
              }
            />
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <div>
          <h2 className="font-display text-xl">Trusted by</h2>
          <p className="mt-1 text-sm text-muted">
            Intro line above the logo grid. Logos are managed in{" "}
            <a
              href="/admin/trusted-by"
              className="font-medium text-forest hover:text-forest-dark"
            >
              Homepage logos
            </a>
            .
          </p>
        </div>
        <Field label="Intro line" id="tb-intro">
          <TextInput
            id="tb-intro"
            value={sections.trustedBy.introLine}
            onChange={(e) =>
              patch("trustedBy", {
                ...sections.trustedBy,
                introLine: e.target.value,
              })
            }
          />
        </Field>
      </section>

      <section className="space-y-4">
        <h2 className="font-display text-xl">Ways in</h2>
        <Field label="Headline (line breaks allowed)" id="ways-headline">
          <TextArea
            id="ways-headline"
            rows={2}
            value={sections.waysIn.headline}
            onChange={(e) =>
              patch("waysIn", { ...sections.waysIn, headline: e.target.value })
            }
          />
        </Field>
        <Field label="Supporting line" id="ways-subhead">
          <TextArea
            id="ways-subhead"
            rows={3}
            value={sections.waysIn.subhead}
            onChange={(e) =>
              patch("waysIn", { ...sections.waysIn, subhead: e.target.value })
            }
          />
        </Field>
        {sections.waysIn.items.map((item, index) => (
          <div
            key={index}
            className="space-y-3 rounded-sm border border-charcoal/10 p-4"
          >
            <p className="text-sm font-medium">Item {index + 1}</p>
            <Field label="Title" id={`ways-title-${index}`}>
              <TextInput
                id={`ways-title-${index}`}
                value={item.title}
                onChange={(e) => {
                  const items = sections.waysIn.items.map((row, i) =>
                    i === index ? { ...row, title: e.target.value } : row,
                  );
                  patch("waysIn", { ...sections.waysIn, items });
                }}
              />
            </Field>
            <Field label="Body" id={`ways-body-${index}`}>
              <TextArea
                id={`ways-body-${index}`}
                rows={3}
                value={item.body}
                onChange={(e) => {
                  const items = sections.waysIn.items.map((row, i) =>
                    i === index ? { ...row, body: e.target.value } : row,
                  );
                  patch("waysIn", { ...sections.waysIn, items });
                }}
              />
            </Field>
          </div>
        ))}
      </section>

      <section className="space-y-4">
        <h2 className="font-display text-xl">Roster preview</h2>
        <Field label="Headline" id="roster-headline">
          <TextInput
            id="roster-headline"
            value={sections.roster.headline}
            onChange={(e) =>
              patch("roster", { ...sections.roster, headline: e.target.value })
            }
          />
        </Field>
        <Field label="Supporting line" id="roster-subhead">
          <TextArea
            id="roster-subhead"
            rows={3}
            value={sections.roster.subhead}
            onChange={(e) =>
              patch("roster", { ...sections.roster, subhead: e.target.value })
            }
          />
        </Field>
        <div className="grid gap-4 md:grid-cols-2">
          <Field label="CTA label" id="roster-cta">
            <TextInput
              id="roster-cta"
              value={sections.roster.ctaLabel}
              onChange={(e) =>
                patch("roster", {
                  ...sections.roster,
                  ctaLabel: e.target.value,
                })
              }
            />
          </Field>
          <Field label="CTA link" id="roster-href">
            <TextInput
              id="roster-href"
              value={sections.roster.ctaHref}
              onChange={(e) =>
                patch("roster", { ...sections.roster, ctaHref: e.target.value })
              }
            />
          </Field>
        </div>
        <div className="rounded-sm border border-charcoal/10 p-4">
          <h3 className="mb-3 text-sm font-medium text-charcoal">
            Featured creators
          </h3>
          <RosterFeaturedSlotsField
            options={rosterOptions}
            value={sections.roster.featuredSlugs}
            fallbackSlugs={rosterOptions.slice(0, 4).map((o) => o.slug)}
            onChange={(featuredSlugs) =>
              patch("roster", { ...sections.roster, featuredSlugs })
            }
          />
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="font-display text-xl">Impact stats</h2>
        <Field label="Headline (line breaks allowed)" id="impact-headline">
          <TextArea
            id="impact-headline"
            rows={2}
            value={sections.impact.headline}
            onChange={(e) =>
              patch("impact", { ...sections.impact, headline: e.target.value })
            }
          />
        </Field>
        {sections.impact.stats.map((stat, index) => (
          <div
            key={index}
            className="grid gap-3 rounded-sm border border-charcoal/10 p-4 md:grid-cols-2"
          >
            <Field label="Value" id={`impact-value-${index}`}>
              <TextInput
                id={`impact-value-${index}`}
                value={stat.value}
                onChange={(e) => {
                  const stats = sections.impact.stats.map((row, i) =>
                    i === index ? { ...row, value: e.target.value } : row,
                  );
                  patch("impact", { ...sections.impact, stats });
                }}
              />
            </Field>
            <Field label="Detail" id={`impact-detail-${index}`}>
              <TextInput
                id={`impact-detail-${index}`}
                value={stat.detail}
                onChange={(e) => {
                  const stats = sections.impact.stats.map((row, i) =>
                    i === index ? { ...row, detail: e.target.value } : row,
                  );
                  patch("impact", { ...sections.impact, stats });
                }}
              />
            </Field>
          </div>
        ))}
      </section>

      <section className="space-y-4">
        <h2 className="font-display text-xl">Key case study</h2>
        <MediaField
          label="Client logo"
          hint={TRUSTED_BY_LOGO_HINT}
          value={sections.keyStudy.logoSrc}
          onChange={(logoSrc) =>
            patch("keyStudy", {
              ...sections.keyStudy,
              logoSrc,
            })
          }
        />
        <Field label="Logo name (alt text)" id="ks-logo-alt">
          <TextInput
            id="ks-logo-alt"
            value={sections.keyStudy.logoAlt}
            onChange={(e) =>
              patch("keyStudy", {
                ...sections.keyStudy,
                logoAlt: e.target.value,
              })
            }
          />
        </Field>
        <Field label="Headline" id="ks-headline">
          <TextArea
            id="ks-headline"
            rows={2}
            value={sections.keyStudy.headline}
            onChange={(e) =>
              patch("keyStudy", {
                ...sections.keyStudy,
                headline: e.target.value,
              })
            }
          />
        </Field>
        <Field label="Accent" id="ks-accent">
          <TextInput
            id="ks-accent"
            value={sections.keyStudy.headlineAccent}
            onChange={(e) =>
              patch("keyStudy", {
                ...sections.keyStudy,
                headlineAccent: e.target.value,
              })
            }
          />
        </Field>
        <Field label="Summary" id="ks-summary">
          <TextArea
            id="ks-summary"
            rows={3}
            value={sections.keyStudy.summary}
            onChange={(e) =>
              patch("keyStudy", {
                ...sections.keyStudy,
                summary: e.target.value,
              })
            }
          />
        </Field>
        <div className="space-y-4">
          <div>
            <p className="text-sm font-medium">Meta line</p>
            <p className="mt-1 text-sm text-muted">
              Label and value pairs shown under the summary (e.g. Pillar, Lead, Term).
            </p>
          </div>
          {sections.keyStudy.meta.map((item, index) => (
            <div
              key={`ks-meta-${index}`}
              className="space-y-3 rounded-sm border border-charcoal/10 p-4"
            >
              <div className="flex items-center justify-between gap-3">
                <p className="text-sm font-medium">Item {index + 1}</p>
                <button
                  type="button"
                  onClick={() =>
                    patch("keyStudy", {
                      ...sections.keyStudy,
                      meta: sections.keyStudy.meta.filter((_, i) => i !== index),
                    })
                  }
                  className="text-xs font-medium text-danger hover:underline"
                >
                  Remove
                </button>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <Field label="Title" id={`ks-meta-label-${index}`}>
                  <TextInput
                    id={`ks-meta-label-${index}`}
                    value={item.label}
                    onChange={(e) => {
                      const meta = sections.keyStudy.meta.map((row, i) =>
                        i === index ? { ...row, label: e.target.value } : row,
                      );
                      patch("keyStudy", { ...sections.keyStudy, meta });
                    }}
                  />
                </Field>
                <Field label="Value" id={`ks-meta-value-${index}`}>
                  <TextInput
                    id={`ks-meta-value-${index}`}
                    value={item.value}
                    onChange={(e) => {
                      const meta = sections.keyStudy.meta.map((row, i) =>
                        i === index ? { ...row, value: e.target.value } : row,
                      );
                      patch("keyStudy", { ...sections.keyStudy, meta });
                    }}
                  />
                </Field>
              </div>
            </div>
          ))}
          <button
            type="button"
            onClick={() =>
              patch("keyStudy", {
                ...sections.keyStudy,
                meta: [...sections.keyStudy.meta, { label: "", value: "" }],
              })
            }
            className="text-sm font-medium text-forest hover:text-forest-dark"
          >
            + Add meta item
          </button>
        </div>
        {sections.keyStudy.showCta ? (
          <div className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <Field label="CTA label" id="ks-cta">
                <TextInput
                  id="ks-cta"
                  value={sections.keyStudy.ctaLabel}
                  onChange={(e) =>
                    patch("keyStudy", {
                      ...sections.keyStudy,
                      ctaLabel: e.target.value,
                    })
                  }
                />
              </Field>
              <Field label="CTA link" id="ks-href">
                <TextInput
                  id="ks-href"
                  value={sections.keyStudy.ctaHref}
                  onChange={(e) =>
                    patch("keyStudy", {
                      ...sections.keyStudy,
                      ctaHref: e.target.value,
                    })
                  }
                />
              </Field>
            </div>
            <button
              type="button"
              onClick={() =>
                patch("keyStudy", {
                  ...sections.keyStudy,
                  showCta: false,
                })
              }
              className="text-sm font-medium text-danger hover:underline"
            >
              Remove button
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => {
              const defaults = DEFAULT_HOME_SECTIONS.keyStudy;
              patch("keyStudy", {
                ...sections.keyStudy,
                showCta: true,
                ctaLabel: sections.keyStudy.ctaLabel.trim()
                  ? sections.keyStudy.ctaLabel
                  : defaults.ctaLabel,
                ctaHref: sections.keyStudy.ctaHref.trim()
                  ? sections.keyStudy.ctaHref
                  : defaults.ctaHref,
              });
            }}
            className="text-sm font-medium text-forest hover:text-forest-dark"
          >
            + Add case study button
          </button>
        )}
        {sections.keyStudy.metrics.map((metric, index) => (
          <div
            key={index}
            className="space-y-3 rounded-sm border border-charcoal/10 p-4"
          >
            <p className="text-sm font-medium">Metric {index + 1}</p>
            <Field label="Value" id={`ks-m-value-${index}`}>
              <TextInput
                id={`ks-m-value-${index}`}
                value={metric.value}
                onChange={(e) => {
                  const metrics = sections.keyStudy.metrics.map((row, i) =>
                    i === index ? { ...row, value: e.target.value } : row,
                  );
                  patch("keyStudy", { ...sections.keyStudy, metrics });
                }}
              />
            </Field>
            <Field label="Label" id={`ks-m-label-${index}`}>
              <TextInput
                id={`ks-m-label-${index}`}
                value={metric.label}
                onChange={(e) => {
                  const metrics = sections.keyStudy.metrics.map((row, i) =>
                    i === index ? { ...row, label: e.target.value } : row,
                  );
                  patch("keyStudy", { ...sections.keyStudy, metrics });
                }}
              />
            </Field>
            <Field label="Note" id={`ks-m-note-${index}`}>
              <TextInput
                id={`ks-m-note-${index}`}
                value={metric.note}
                onChange={(e) => {
                  const metrics = sections.keyStudy.metrics.map((row, i) =>
                    i === index ? { ...row, note: e.target.value } : row,
                  );
                  patch("keyStudy", { ...sections.keyStudy, metrics });
                }}
              />
            </Field>
          </div>
        ))}
      </section>

      <section className="space-y-4">
        <h2 className="font-display text-xl">Brand brief</h2>
        <Field label="Eyebrow" id="bb-eyebrow">
          <TextInput
            id="bb-eyebrow"
            value={sections.brandBrief.eyebrow}
            onChange={(e) =>
              patch("brandBrief", {
                ...sections.brandBrief,
                eyebrow: e.target.value,
              })
            }
          />
        </Field>
        <Field label="Headline" id="bb-headline">
          <TextArea
            id="bb-headline"
            rows={2}
            value={sections.brandBrief.headline}
            onChange={(e) =>
              patch("brandBrief", {
                ...sections.brandBrief,
                headline: e.target.value,
              })
            }
          />
        </Field>
        <Field label="Emphasis" id="bb-emphasis">
          <TextInput
            id="bb-emphasis"
            value={sections.brandBrief.headlineEmphasis}
            onChange={(e) =>
              patch("brandBrief", {
                ...sections.brandBrief,
                headlineEmphasis: e.target.value,
              })
            }
          />
        </Field>
        <Field label="Supporting line" id="bb-subhead">
          <TextArea
            id="bb-subhead"
            rows={3}
            value={sections.brandBrief.subhead}
            onChange={(e) =>
              patch("brandBrief", {
                ...sections.brandBrief,
                subhead: e.target.value,
              })
            }
          />
        </Field>
        <Field label="Quote" id="bb-quote">
          <TextArea
            id="bb-quote"
            rows={3}
            value={sections.brandBrief.quote}
            onChange={(e) =>
              patch("brandBrief", {
                ...sections.brandBrief,
                quote: e.target.value,
              })
            }
          />
        </Field>
        <div className="grid gap-4 md:grid-cols-2">
          <Field label="Quote name" id="bb-name">
            <TextInput
              id="bb-name"
              value={sections.brandBrief.quoteName}
              onChange={(e) =>
                patch("brandBrief", {
                  ...sections.brandBrief,
                  quoteName: e.target.value,
                })
              }
            />
          </Field>
          <Field label="Quote role" id="bb-role">
            <TextInput
              id="bb-role"
              value={sections.brandBrief.quoteRole}
              onChange={(e) =>
                patch("brandBrief", {
                  ...sections.brandBrief,
                  quoteRole: e.target.value,
                })
              }
            />
          </Field>
        </div>
        <MediaField
          label="Person photo"
          value={sections.brandBrief.quotePhoto}
          onChange={(quotePhoto) =>
            patch("brandBrief", {
              ...sections.brandBrief,
              quotePhoto,
            })
          }
        />
        <MediaField
          label="Company logo"
          hint={TRUSTED_BY_LOGO_HINT}
          value={sections.brandBrief.quoteLogo}
          onChange={(quoteLogo) =>
            patch("brandBrief", {
              ...sections.brandBrief,
              quoteLogo,
            })
          }
        />
        <Field label="Logo name (alt text)" id="bb-quote-logo-name">
          <TextInput
            id="bb-quote-logo-name"
            value={sections.brandBrief.quoteLogoName}
            onChange={(e) =>
              patch("brandBrief", {
                ...sections.brandBrief,
                quoteLogoName: e.target.value,
              })
            }
          />
        </Field>
        <Field label="Form title" id="bb-form">
          <TextInput
            id="bb-form"
            value={sections.brandBrief.formTitle}
            onChange={(e) =>
              patch("brandBrief", {
                ...sections.brandBrief,
                formTitle: e.target.value,
              })
            }
          />
        </Field>
        <Field label="Form footnote" id="bb-footnote">
          <TextInput
            id="bb-footnote"
            value={sections.brandBrief.formFootnote}
            onChange={(e) =>
              patch("brandBrief", {
                ...sections.brandBrief,
                formFootnote: e.target.value,
              })
            }
          />
        </Field>
        <div className="space-y-4">
          <div>
            <p className="text-sm font-medium">Briefed-by strip</p>
            <p className="mt-1 text-sm text-muted">
              Label and client logos shown below the form.
            </p>
          </div>
          <Field label="Label" id="bb-briefed-label">
            <TextInput
              id="bb-briefed-label"
              value={sections.brandBrief.briefedByLabel}
              onChange={(e) =>
                patch("brandBrief", {
                  ...sections.brandBrief,
                  briefedByLabel: e.target.value,
                })
              }
            />
          </Field>
          {sections.brandBrief.briefedByLogos.map((logo, index) => (
            <div
              key={`bb-logo-${index}`}
              className="space-y-3 rounded-sm border border-charcoal/10 p-4"
            >
              <div className="flex items-center justify-between gap-3">
                <p className="text-sm font-medium">Logo {index + 1}</p>
                <button
                  type="button"
                  onClick={() =>
                    patch("brandBrief", {
                      ...sections.brandBrief,
                      briefedByLogos: sections.brandBrief.briefedByLogos.filter(
                        (_, i) => i !== index,
                      ),
                    })
                  }
                  className="text-xs font-medium text-danger hover:underline"
                >
                  Remove
                </button>
              </div>
              <Field label="Name" id={`bb-logo-name-${index}`}>
                <TextInput
                  id={`bb-logo-name-${index}`}
                  value={logo.name}
                  onChange={(e) => {
                    const briefedByLogos = sections.brandBrief.briefedByLogos.map(
                      (row, i) =>
                        i === index ? { ...row, name: e.target.value } : row,
                    );
                    patch("brandBrief", {
                      ...sections.brandBrief,
                      briefedByLogos,
                    });
                  }}
                />
              </Field>
              <MediaField
                label="Logo image"
                hint={TRUSTED_BY_LOGO_HINT}
                value={logo.src}
                onChange={(src) => {
                  const briefedByLogos = sections.brandBrief.briefedByLogos.map(
                    (row, i) => (i === index ? { ...row, src } : row),
                  );
                  patch("brandBrief", {
                    ...sections.brandBrief,
                    briefedByLogos,
                  });
                }}
              />
            </div>
          ))}
          <button
            type="button"
            onClick={() =>
              patch("brandBrief", {
                ...sections.brandBrief,
                briefedByLogos: [
                  ...sections.brandBrief.briefedByLogos,
                  { name: "", src: "" },
                ],
              })
            }
            className="text-sm font-medium text-forest hover:text-forest-dark"
          >
            + Add logo
          </button>
        </div>
      </section>

      <section className="space-y-4">
        <div>
          <h2 className="font-display text-xl">FAQ</h2>
          <p className="mt-1 text-sm text-muted">
            Accordion below the brand brief on the homepage.
          </p>
        </div>
        <Field label="Eyebrow" id="home-faq-eyebrow">
          <TextInput
            id="home-faq-eyebrow"
            value={sections.faq.eyebrow}
            onChange={(e) =>
              patch("faq", { ...sections.faq, eyebrow: e.target.value })
            }
          />
        </Field>
        <Field label="Headline" id="home-faq-headline">
          <TextInput
            id="home-faq-headline"
            value={sections.faq.headline}
            onChange={(e) =>
              patch("faq", { ...sections.faq, headline: e.target.value })
            }
          />
        </Field>
        <Field label="Subhead" id="home-faq-subhead">
          <TextArea
            id="home-faq-subhead"
            rows={3}
            value={sections.faq.subhead}
            onChange={(e) =>
              patch("faq", { ...sections.faq, subhead: e.target.value })
            }
          />
        </Field>
        {sections.faq.items.map((item, index) => (
          <div
            key={`home-faq-${index}`}
            className="space-y-3 rounded-sm border border-charcoal/10 p-4"
          >
            <div className="flex items-center justify-between gap-3">
              <p className="text-sm font-medium">Question {index + 1}</p>
              <button
                type="button"
                onClick={() =>
                  patch("faq", {
                    ...sections.faq,
                    items: sections.faq.items.filter((_, i) => i !== index),
                  })
                }
                className="text-xs font-medium text-danger hover:underline"
              >
                Remove
              </button>
            </div>
            <Field label="Question" id={`home-faq-q-${index}`}>
              <TextInput
                id={`home-faq-q-${index}`}
                value={item.q}
                onChange={(e) => {
                  const items = sections.faq.items.map((row, i) =>
                    i === index ? { ...row, q: e.target.value } : row,
                  );
                  patch("faq", { ...sections.faq, items });
                }}
              />
            </Field>
            <Field label="Answer" id={`home-faq-a-${index}`}>
              <TextArea
                id={`home-faq-a-${index}`}
                rows={3}
                value={item.a}
                onChange={(e) => {
                  const items = sections.faq.items.map((row, i) =>
                    i === index ? { ...row, a: e.target.value } : row,
                  );
                  patch("faq", { ...sections.faq, items });
                }}
              />
            </Field>
          </div>
        ))}
        <button
          type="button"
          onClick={() =>
            patch("faq", {
              ...sections.faq,
              items: [...sections.faq.items, emptyHomeFaqItem()],
            })
          }
          className="text-sm font-medium text-forest hover:text-forest-dark"
        >
          + Add question
        </button>
      </section>

      <section className="space-y-4">
        <h2 className="font-display text-xl">Creators CTA</h2>
        <Field label="Eyebrow" id="cc-eyebrow">
          <TextInput
            id="cc-eyebrow"
            value={sections.creatorCta.eyebrow}
            onChange={(e) =>
              patch("creatorCta", {
                ...sections.creatorCta,
                eyebrow: e.target.value,
              })
            }
          />
        </Field>
        <Field label="Headline" id="cc-headline">
          <TextArea
            id="cc-headline"
            rows={2}
            value={sections.creatorCta.headline}
            onChange={(e) =>
              patch("creatorCta", {
                ...sections.creatorCta,
                headline: e.target.value,
              })
            }
          />
        </Field>
        <Field label="Supporting line" id="cc-subhead">
          <TextArea
            id="cc-subhead"
            rows={3}
            value={sections.creatorCta.subhead}
            onChange={(e) =>
              patch("creatorCta", {
                ...sections.creatorCta,
                subhead: e.target.value,
              })
            }
          />
        </Field>
        <label className="flex items-center gap-2 text-sm text-charcoal">
          <input
            type="checkbox"
            checked={sections.creatorCta.showFacesMarquee}
            onChange={(e) =>
              patch("creatorCta", {
                ...sections.creatorCta,
                showFacesMarquee: e.target.checked,
              })
            }
            className="rounded-sm border-charcoal/20"
          />
          Show creator faces marquee
        </label>
        <div className="grid gap-4 md:grid-cols-2">
          <Field label="Stat 1" id="cc-stat1">
            <TextInput
              id="cc-stat1"
              value={sections.creatorCta.stat1}
              onChange={(e) =>
                patch("creatorCta", {
                  ...sections.creatorCta,
                  stat1: e.target.value,
                })
              }
            />
          </Field>
          <Field label="Stat 2" id="cc-stat2">
            <TextInput
              id="cc-stat2"
              value={sections.creatorCta.stat2}
              onChange={(e) =>
                patch("creatorCta", {
                  ...sections.creatorCta,
                  stat2: e.target.value,
                })
              }
            />
          </Field>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <Field label="Primary button label" id="cc-primary-label">
            <TextInput
              id="cc-primary-label"
              value={sections.creatorCta.primaryCtaLabel}
              onChange={(e) =>
                patch("creatorCta", {
                  ...sections.creatorCta,
                  primaryCtaLabel: e.target.value,
                })
              }
            />
          </Field>
          <Field label="Primary button link" id="cc-primary-href">
            <TextInput
              id="cc-primary-href"
              value={sections.creatorCta.primaryCtaHref}
              onChange={(e) =>
                patch("creatorCta", {
                  ...sections.creatorCta,
                  primaryCtaHref: e.target.value,
                })
              }
            />
          </Field>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <Field label="Secondary button label" id="cc-secondary-label">
            <TextInput
              id="cc-secondary-label"
              value={sections.creatorCta.secondaryCtaLabel}
              onChange={(e) =>
                patch("creatorCta", {
                  ...sections.creatorCta,
                  secondaryCtaLabel: e.target.value,
                })
              }
            />
          </Field>
          <Field label="Secondary button link" id="cc-secondary-href">
            <TextInput
              id="cc-secondary-href"
              value={sections.creatorCta.secondaryCtaHref}
              onChange={(e) =>
                patch("creatorCta", {
                  ...sections.creatorCta,
                  secondaryCtaHref: e.target.value,
                })
              }
            />
          </Field>
        </div>
      </section>

      <section className="rounded-sm border border-charcoal/10 bg-cream/50 px-4 py-4 text-sm text-muted">
        Header, footer copy, nav links, socials, and columns are edited in{" "}
        <a
          href="/admin/pages/site"
          className="font-medium text-forest hover:text-forest-dark"
        >
          Header & footer
        </a>
        .
      </section>

      <div
        className={cn(
          "sticky bottom-4 z-10 flex flex-wrap items-center gap-3 rounded-sm border border-charcoal/10 bg-white/95 px-4 py-3 shadow-[0_10px_30px_rgba(28,26,23,0.08)] backdrop-blur",
        )}
      >
        <Button type="submit" variant="primary" disabled={pending}>
          {pending ? "Saving…" : "Save home page"}
        </Button>
        <a
          href="/"
          target="_blank"
          rel="noreferrer"
          className="text-sm font-medium text-charcoal/60 hover:text-charcoal"
        >
          Edit on site ↗
        </a>
        {message ? (
          <p className={`text-sm ${ok ? "text-success" : "text-danger"}`}>
            {message}
          </p>
        ) : null}
      </div>
    </form>
  );
}
