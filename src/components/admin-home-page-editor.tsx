"use client";

import { useState } from "react";

import {
  CtaStyleControls,
  HeadlineStyleControls,
  TextStyleControls,
} from "@/components/home-style-controls";
import { Button, Field, TextArea, TextInput } from "@/components/ui";
import type { HomePageSections } from "@/lib/cms";
import { cn } from "@/lib/utils";

export function HomePageEditorForm({
  initial,
  saveAction,
}: {
  initial: HomePageSections;
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
        <div className="grid gap-4 md:grid-cols-3">
          <Field label="Pillar" id="ks-pillar">
            <TextInput
              id="ks-pillar"
              value={sections.keyStudy.pillar}
              onChange={(e) =>
                patch("keyStudy", {
                  ...sections.keyStudy,
                  pillar: e.target.value,
                })
              }
            />
          </Field>
          <Field label="Lead" id="ks-lead">
            <TextInput
              id="ks-lead"
              value={sections.keyStudy.lead}
              onChange={(e) =>
                patch("keyStudy", {
                  ...sections.keyStudy,
                  lead: e.target.value,
                })
              }
            />
          </Field>
          <Field label="Term" id="ks-term">
            <TextInput
              id="ks-term"
              value={sections.keyStudy.term}
              onChange={(e) =>
                patch("keyStudy", {
                  ...sections.keyStudy,
                  term: e.target.value,
                })
              }
            />
          </Field>
        </div>
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
      </section>

      <section className="space-y-4">
        <h2 className="font-display text-xl">Footer</h2>
        <Field label="Tagline" id="ft-tagline">
          <TextArea
            id="ft-tagline"
            rows={2}
            value={sections.footer.tagline}
            onChange={(e) =>
              patch("footer", { ...sections.footer, tagline: e.target.value })
            }
          />
        </Field>
        <Field label="Company line" id="ft-company">
          <TextInput
            id="ft-company"
            value={sections.footer.companyLine}
            onChange={(e) =>
              patch("footer", {
                ...sections.footer,
                companyLine: e.target.value,
              })
            }
          />
        </Field>
        <Field label="Email" id="ft-email">
          <TextInput
            id="ft-email"
            value={sections.footer.email}
            onChange={(e) =>
              patch("footer", { ...sections.footer, email: e.target.value })
            }
          />
        </Field>
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
