"use client";

import { useEffect, useId, useRef, useState } from "react";
import { useRouter } from "next/navigation";

import { BrandBrief } from "@/components/brand-brief";
import { EditableHit } from "@/components/editable-hit";
import { useHomeCms } from "@/components/home-cms-context";
import {
  Home2Hero,
  heroPropsFromSections,
} from "@/components/home-2/home-2-hero";
import { RosterPreviewSection } from "@/components/home-2/roster-preview-section";
import { WaysInAccordion } from "@/components/home-2/ways-in-accordion";
import {
  CtaStyleControls,
  HeadlineStyleControls,
  TextStyleControls,
} from "@/components/home-style-controls";
import { MediaField } from "@/components/media-library";
import { ImpactStats } from "@/components/impact-stats";
import { KeyStudy } from "@/components/key-study";
import type { RosterCardExpert } from "@/components/roster-card";
import { TrustedBy } from "@/components/trusted-by";
import { Button, Field, TextArea, TextInput } from "@/components/ui";
import type { HomePageSections } from "@/lib/cms";
import {
  TRUSTED_BY_LOGO_HINT,
  emptyTrustedByClient,
  emptyTrustedByTestimonial,
  type TrustedByClient,
} from "@/lib/trusted-by";

type EditTarget =
  | "hero.headline"
  | "hero.subhead"
  | "hero.primaryCta"
  | "hero.secondaryCta"
  | "waysIn.headline"
  | "waysIn.subhead"
  | `waysIn.item.${number}`
  | "roster.headline"
  | "roster.subhead"
  | "roster.cta"
  | "impact.headline"
  | `impact.stat.${number}`
  | "keyStudy.headline"
  | "keyStudy.summary"
  | "keyStudy.meta"
  | "keyStudy.cta"
  | `keyStudy.metric.${number}`
  | "brandBrief.eyebrow"
  | "brandBrief.headline"
  | "brandBrief.subhead"
  | "brandBrief.quote"
  | "brandBrief.formTitle"
  | `trustedBy.client.${number}`
  | "footer.tagline"
  | "footer.companyLine"
  | "footer.email";

function targetTitle(target: EditTarget): string {
  const map: Record<string, string> = {
    "hero.headline": "Hero headline",
    "hero.subhead": "Hero supporting line",
    "hero.primaryCta": "Primary button",
    "hero.secondaryCta": "Secondary button",
    "waysIn.headline": "Ways in headline",
    "waysIn.subhead": "Ways in supporting line",
    "roster.headline": "Roster headline",
    "roster.subhead": "Roster supporting line",
    "roster.cta": "Roster button",
    "impact.headline": "Impact headline",
    "keyStudy.headline": "Case study headline",
    "keyStudy.summary": "Case study summary",
    "keyStudy.meta": "Case study meta",
    "keyStudy.cta": "Case study button",
    "brandBrief.eyebrow": "Brief eyebrow",
    "brandBrief.headline": "Brief headline",
    "brandBrief.subhead": "Brief supporting line",
    "brandBrief.quote": "Brief quote",
    "brandBrief.formTitle": "Brief form title",
    "footer.tagline": "Footer tagline",
    "footer.companyLine": "Footer company line",
    "footer.email": "Footer email",
  };
  if (target.startsWith("waysIn.item.")) {
    return `Ways in item ${Number(target.split(".")[2]) + 1}`;
  }
  if (target.startsWith("impact.stat.")) {
    return `Impact stat ${Number(target.split(".")[2]) + 1}`;
  }
  if (target.startsWith("keyStudy.metric.")) {
    return `Case study metric ${Number(target.split(".")[2]) + 1}`;
  }
  if (target.startsWith("trustedBy.client.")) {
    return `Trusted by logo ${Number(target.split(".")[2]) + 1}`;
  }
  return map[target] ?? "Edit";
}

function EditorPopover({
  target,
  sections,
  trustedClients,
  onChange,
  onTrustedClientsChange,
  onClose,
}: {
  target: EditTarget;
  sections: HomePageSections;
  trustedClients: TrustedByClient[];
  onChange: (next: HomePageSections) => void;
  onTrustedClientsChange: (next: TrustedByClient[]) => void;
  onClose: () => void;
}) {
  const titleId = useId();
  const panelRef = useRef<HTMLDivElement>(null);
  const hero = sections.hero;

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

  function patch<K extends keyof HomePageSections>(
    key: K,
    value: HomePageSections[K],
  ) {
    onChange({ ...sections, [key]: value });
  }

  const waysItemMatch = target.match(/^waysIn\.item\.(\d+)$/);
  const impactStatMatch = target.match(/^impact\.stat\.(\d+)$/);
  const keyMetricMatch = target.match(/^keyStudy\.metric\.(\d+)$/);
  const trustedClientMatch = target.match(/^trustedBy\.client\.(\d+)$/);

  return (
    <div
      ref={panelRef}
      role="dialog"
      aria-labelledby={titleId}
      className="fixed top-20 right-4 z-50 w-[min(100vw-2rem,22rem)] rounded-sm border border-charcoal/10 bg-white p-4 shadow-[0_18px_50px_rgba(28,26,23,0.16)]"
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
        {target === "hero.headline" ? (
          <>
            <Field label="Text" id="live-headline">
              <TextArea
                id="live-headline"
                rows={3}
                value={hero.headline}
                onChange={(e) =>
                  patch("hero", { ...hero, headline: e.target.value })
                }
              />
            </Field>
            <HeadlineStyleControls
              value={hero.headlineStyle}
              onChange={(headlineStyle) =>
                patch("hero", { ...hero, headlineStyle })
              }
            />
          </>
        ) : null}

        {target === "hero.subhead" ? (
          <>
            <Field label="Text" id="live-subhead">
              <TextArea
                id="live-subhead"
                rows={3}
                value={hero.subhead}
                onChange={(e) =>
                  patch("hero", { ...hero, subhead: e.target.value })
                }
              />
            </Field>
            <TextStyleControls
              value={hero.subheadStyle}
              onChange={(subheadStyle) =>
                patch("hero", { ...hero, subheadStyle })
              }
            />
          </>
        ) : null}

        {target === "hero.primaryCta" ? (
          <>
            <Field label="Label" id="live-primary-cta">
              <TextInput
                id="live-primary-cta"
                value={hero.primaryCta}
                onChange={(e) =>
                  patch("hero", { ...hero, primaryCta: e.target.value })
                }
              />
            </Field>
            <Field label="Link" id="live-primary-href">
              <TextInput
                id="live-primary-href"
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
          </>
        ) : null}

        {target === "hero.secondaryCta" ? (
          <>
            <Field label="Label" id="live-secondary-cta">
              <TextInput
                id="live-secondary-cta"
                value={hero.secondaryCta}
                onChange={(e) =>
                  patch("hero", { ...hero, secondaryCta: e.target.value })
                }
              />
            </Field>
            <Field label="Link" id="live-secondary-href">
              <TextInput
                id="live-secondary-href"
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
          </>
        ) : null}

        {target === "waysIn.headline" ? (
          <Field label="Text (use line breaks)" id="ways-headline">
            <TextArea
              id="ways-headline"
              rows={3}
              value={sections.waysIn.headline}
              onChange={(e) =>
                patch("waysIn", {
                  ...sections.waysIn,
                  headline: e.target.value,
                })
              }
            />
          </Field>
        ) : null}

        {target === "waysIn.subhead" ? (
          <Field label="Text" id="ways-subhead">
            <TextArea
              id="ways-subhead"
              rows={4}
              value={sections.waysIn.subhead}
              onChange={(e) =>
                patch("waysIn", {
                  ...sections.waysIn,
                  subhead: e.target.value,
                })
              }
            />
          </Field>
        ) : null}

        {waysItemMatch ? (
          <>
            <Field label="Title" id="ways-item-title">
              <TextInput
                id="ways-item-title"
                value={
                  sections.waysIn.items[Number(waysItemMatch[1])]?.title ?? ""
                }
                onChange={(e) => {
                  const i = Number(waysItemMatch[1]);
                  const items = sections.waysIn.items.map((item, idx) =>
                    idx === i ? { ...item, title: e.target.value } : item,
                  );
                  patch("waysIn", { ...sections.waysIn, items });
                }}
              />
            </Field>
            <Field label="Body" id="ways-item-body">
              <TextArea
                id="ways-item-body"
                rows={4}
                value={
                  sections.waysIn.items[Number(waysItemMatch[1])]?.body ?? ""
                }
                onChange={(e) => {
                  const i = Number(waysItemMatch[1]);
                  const items = sections.waysIn.items.map((item, idx) =>
                    idx === i ? { ...item, body: e.target.value } : item,
                  );
                  patch("waysIn", { ...sections.waysIn, items });
                }}
              />
            </Field>
          </>
        ) : null}

        {target === "roster.headline" ? (
          <Field label="Text" id="roster-headline">
            <TextInput
              id="roster-headline"
              value={sections.roster.headline}
              onChange={(e) =>
                patch("roster", {
                  ...sections.roster,
                  headline: e.target.value,
                })
              }
            />
          </Field>
        ) : null}

        {target === "roster.subhead" ? (
          <Field label="Text" id="roster-subhead">
            <TextArea
              id="roster-subhead"
              rows={3}
              value={sections.roster.subhead}
              onChange={(e) =>
                patch("roster", {
                  ...sections.roster,
                  subhead: e.target.value,
                })
              }
            />
          </Field>
        ) : null}

        {target === "roster.cta" ? (
          <>
            <Field label="Label" id="roster-cta">
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
            <Field label="Link" id="roster-href">
              <TextInput
                id="roster-href"
                value={sections.roster.ctaHref}
                onChange={(e) =>
                  patch("roster", {
                    ...sections.roster,
                    ctaHref: e.target.value,
                  })
                }
              />
            </Field>
          </>
        ) : null}

        {target === "impact.headline" ? (
          <Field label="Text (use line breaks)" id="impact-headline">
            <TextArea
              id="impact-headline"
              rows={3}
              value={sections.impact.headline}
              onChange={(e) =>
                patch("impact", {
                  ...sections.impact,
                  headline: e.target.value,
                })
              }
            />
          </Field>
        ) : null}

        {impactStatMatch ? (
          <>
            <Field label="Value" id="impact-value">
              <TextInput
                id="impact-value"
                value={
                  sections.impact.stats[Number(impactStatMatch[1])]?.value ?? ""
                }
                onChange={(e) => {
                  const i = Number(impactStatMatch[1]);
                  const stats = sections.impact.stats.map((stat, idx) =>
                    idx === i ? { ...stat, value: e.target.value } : stat,
                  );
                  patch("impact", { ...sections.impact, stats });
                }}
              />
            </Field>
            <Field label="Detail" id="impact-detail">
              <TextArea
                id="impact-detail"
                rows={2}
                value={
                  sections.impact.stats[Number(impactStatMatch[1])]?.detail ??
                  ""
                }
                onChange={(e) => {
                  const i = Number(impactStatMatch[1]);
                  const stats = sections.impact.stats.map((stat, idx) =>
                    idx === i ? { ...stat, detail: e.target.value } : stat,
                  );
                  patch("impact", { ...sections.impact, stats });
                }}
              />
            </Field>
          </>
        ) : null}

        {target === "keyStudy.headline" ? (
          <>
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
          </>
        ) : null}

        {target === "keyStudy.summary" ? (
          <Field label="Summary" id="ks-summary">
            <TextArea
              id="ks-summary"
              rows={4}
              value={sections.keyStudy.summary}
              onChange={(e) =>
                patch("keyStudy", {
                  ...sections.keyStudy,
                  summary: e.target.value,
                })
              }
            />
          </Field>
        ) : null}

        {target === "keyStudy.meta" ? (
          <>
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
          </>
        ) : null}

        {target === "keyStudy.cta" ? (
          <>
            <Field label="Label" id="ks-cta">
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
            <Field label="Link" id="ks-href">
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
          </>
        ) : null}

        {keyMetricMatch ? (
          <>
            <Field label="Value" id="ks-metric-value">
              <TextInput
                id="ks-metric-value"
                value={
                  sections.keyStudy.metrics[Number(keyMetricMatch[1])]
                    ?.value ?? ""
                }
                onChange={(e) => {
                  const i = Number(keyMetricMatch[1]);
                  const metrics = sections.keyStudy.metrics.map((m, idx) =>
                    idx === i ? { ...m, value: e.target.value } : m,
                  );
                  patch("keyStudy", { ...sections.keyStudy, metrics });
                }}
              />
            </Field>
            <Field label="Label" id="ks-metric-label">
              <TextArea
                id="ks-metric-label"
                rows={2}
                value={
                  sections.keyStudy.metrics[Number(keyMetricMatch[1])]
                    ?.label ?? ""
                }
                onChange={(e) => {
                  const i = Number(keyMetricMatch[1]);
                  const metrics = sections.keyStudy.metrics.map((m, idx) =>
                    idx === i ? { ...m, label: e.target.value } : m,
                  );
                  patch("keyStudy", { ...sections.keyStudy, metrics });
                }}
              />
            </Field>
            <Field label="Note (optional)" id="ks-metric-note">
              <TextInput
                id="ks-metric-note"
                value={
                  sections.keyStudy.metrics[Number(keyMetricMatch[1])]
                    ?.note ?? ""
                }
                onChange={(e) => {
                  const i = Number(keyMetricMatch[1]);
                  const metrics = sections.keyStudy.metrics.map((m, idx) =>
                    idx === i ? { ...m, note: e.target.value } : m,
                  );
                  patch("keyStudy", { ...sections.keyStudy, metrics });
                }}
              />
            </Field>
          </>
        ) : null}

        {target === "brandBrief.eyebrow" ? (
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
        ) : null}

        {target === "brandBrief.headline" ? (
          <>
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
          </>
        ) : null}

        {target === "brandBrief.subhead" ? (
          <Field label="Text" id="bb-subhead">
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
        ) : null}

        {target === "brandBrief.quote" ? (
          <>
            <Field label="Quote" id="bb-quote">
              <TextArea
                id="bb-quote"
                rows={4}
                value={sections.brandBrief.quote}
                onChange={(e) =>
                  patch("brandBrief", {
                    ...sections.brandBrief,
                    quote: e.target.value,
                  })
                }
              />
            </Field>
            <Field label="Name" id="bb-name">
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
            <Field label="Role" id="bb-role">
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
          </>
        ) : null}

        {target === "brandBrief.formTitle" ? (
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
        ) : null}

        {trustedClientMatch ? (
          (() => {
            const i = Number(trustedClientMatch[1]);
            const client = trustedClients[i];
            if (!client) return null;
            const hasStory = Boolean(client.testimonial);

            function updateClient(next: Partial<TrustedByClient>) {
              onTrustedClientsChange(
                trustedClients.map((row, idx) =>
                  idx === i ? { ...row, ...next } : row,
                ),
              );
            }

            return (
              <>
                <p className="text-[0.7rem] leading-relaxed text-charcoal/55">
                  {TRUSTED_BY_LOGO_HINT} Managed as a shared CMS resource — also
                  editable under Admin → Trusted by.
                </p>
                <Field label="Client name" id="tb-name">
                  <TextInput
                    id="tb-name"
                    value={client.name}
                    onChange={(e) => updateClient({ name: e.target.value })}
                  />
                </Field>
                <MediaField
                  label="Logo"
                  hint={TRUSTED_BY_LOGO_HINT}
                  value={client.logoSrc}
                  onChange={(logoSrc) => updateClient({ logoSrc })}
                />
                <Field
                  label="Case study slug (optional)"
                  id="tb-slug"
                  hint="Powers the Customer story link, e.g. stage-to-boardroom"
                >
                  <TextInput
                    id="tb-slug"
                    value={client.caseStudySlug}
                    onChange={(e) =>
                      updateClient({ caseStudySlug: e.target.value })
                    }
                  />
                </Field>

                <div className="flex items-center justify-between gap-3 border-t border-charcoal/10 pt-3">
                  <p className="text-sm font-medium text-charcoal">
                    Customer story hover
                  </p>
                  <Button
                    type="button"
                    variant={hasStory ? "secondary" : "primary"}
                    className="px-3! py-1.5! text-xs"
                    onClick={() =>
                      updateClient({
                        testimonial: hasStory
                          ? null
                          : emptyTrustedByTestimonial(),
                      })
                    }
                  >
                    {hasStory ? "Remove story" : "Add story"}
                  </Button>
                </div>

                {client.testimonial ? (
                  <>
                    <Field label="Testimonial" id="tb-quote">
                      <TextArea
                        id="tb-quote"
                        rows={4}
                        value={client.testimonial.quote}
                        onChange={(e) =>
                          updateClient({
                            testimonial: {
                              ...client.testimonial!,
                              quote: e.target.value,
                            },
                          })
                        }
                      />
                    </Field>
                    <Field label="Person name" id="tb-person">
                      <TextInput
                        id="tb-person"
                        value={client.testimonial.name}
                        onChange={(e) =>
                          updateClient({
                            testimonial: {
                              ...client.testimonial!,
                              name: e.target.value,
                            },
                          })
                        }
                      />
                    </Field>
                    <Field label="Position / title" id="tb-title">
                      <TextInput
                        id="tb-title"
                        value={client.testimonial.title}
                        onChange={(e) =>
                          updateClient({
                            testimonial: {
                              ...client.testimonial!,
                              title: e.target.value,
                            },
                          })
                        }
                      />
                    </Field>
                    <MediaField
                      label="Person photo"
                      hint="Square photo works best"
                      value={client.testimonial.imageSrc}
                      onChange={(imageSrc) =>
                        updateClient({
                          testimonial: {
                            ...client.testimonial!,
                            imageSrc,
                          },
                        })
                      }
                    />
                  </>
                ) : (
                  <p className="text-[0.75rem] leading-relaxed text-charcoal/50">
                    No story — logo only, like the empty cells in the grid.
                  </p>
                )}

                <div className="flex flex-wrap gap-2 border-t border-charcoal/10 pt-3">
                  <Button
                    type="button"
                    variant="ghost"
                    className="px-3! py-1.5! text-xs"
                    onClick={() => {
                      onTrustedClientsChange([
                        ...trustedClients,
                        emptyTrustedByClient(),
                      ]);
                    }}
                  >
                    Add logo
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    className="px-3! py-1.5! text-xs text-danger"
                    onClick={() => {
                      onTrustedClientsChange(
                        trustedClients.filter((_, idx) => idx !== i),
                      );
                      onClose();
                    }}
                  >
                    Remove this logo
                  </Button>
                  <a
                    href="/admin/trusted-by"
                    className="px-2 text-xs font-medium text-charcoal/55 hover:text-charcoal"
                  >
                    Open Trusted by CMS
                  </a>
                </div>
              </>
            );
          })()
        ) : null}

        {target === "footer.tagline" ? (
          <Field label="Tagline" id="ft-tagline">
            <TextArea
              id="ft-tagline"
              rows={2}
              value={sections.footer.tagline}
              onChange={(e) =>
                patch("footer", {
                  ...sections.footer,
                  tagline: e.target.value,
                })
              }
            />
          </Field>
        ) : null}

        {target === "footer.companyLine" ? (
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
        ) : null}

        {target === "footer.email" ? (
          <Field label="Email" id="ft-email">
            <TextInput
              id="ft-email"
              value={sections.footer.email}
              onChange={(e) =>
                patch("footer", {
                  ...sections.footer,
                  email: e.target.value,
                })
              }
            />
          </Field>
        ) : null}
      </div>
    </div>
  );
}

function hit(
  editing: boolean,
  target: EditTarget,
  selected: EditTarget | null,
  setTarget: (t: EditTarget) => void,
  label: string,
  node: React.ReactNode,
  block = false,
  ringOffset?: string,
) {
  return (
    <EditableHit
      active={editing}
      selected={selected === target}
      label={label}
      block={block}
      ringOffset={ringOffset}
      onSelect={() => setTarget(target)}
    >
      {node}
    </EditableHit>
  );
}

export function HomeVisualEditor({
  initial,
  initialTrustedClients,
  canEdit,
  rosterCards,
  saveAction,
  saveTrustedByAction,
}: {
  initial: HomePageSections;
  initialTrustedClients: TrustedByClient[];
  canEdit: boolean;
  rosterCards: RosterCardExpert[];
  saveAction: typeof import("@/lib/actions/admin-cms").saveHomePage;
  saveTrustedByAction: typeof import("@/lib/actions/admin-trusted-by").saveTrustedClientsList;
}) {
  const router = useRouter();
  const {
    setCanEdit,
    setEditing: setCmsEditing,
    setSelected,
    setFooter,
    setOnSelectFooterField,
  } = useHomeCms();
  const [editing, setEditing] = useState(false);
  const [sections, setSections] = useState(initial);
  const [baseline, setBaseline] = useState(initial);
  const [trustedClients, setTrustedClients] = useState(initialTrustedClients);
  const [trustedBaseline, setTrustedBaseline] = useState(initialTrustedClients);
  const [target, setTarget] = useState<EditTarget | null>(null);
  const [pending, setPending] = useState(false);
  const [message, setMessage] = useState("");
  const [ok, setOk] = useState(false);

  const dirty =
    JSON.stringify(sections) !== JSON.stringify(baseline) ||
    JSON.stringify(trustedClients) !== JSON.stringify(trustedBaseline);

  useEffect(() => {
    setCanEdit(canEdit);
  }, [canEdit, setCanEdit]);

  useEffect(() => {
    setCmsEditing(editing);
    setSelected(target);
  }, [editing, target, setCmsEditing, setSelected]);

  useEffect(() => {
    setFooter(sections.footer);
  }, [sections.footer, setFooter]);

  useEffect(() => {
    setOnSelectFooterField((field) => {
      setTarget(`footer.${field}`);
    });
    return () => setOnSelectFooterField(null);
  }, [setOnSelectFooterField]);

  async function save() {
    setPending(true);
    const homeDirty = JSON.stringify(sections) !== JSON.stringify(baseline);
    const trustedDirty =
      JSON.stringify(trustedClients) !== JSON.stringify(trustedBaseline);

    let homeResult: { ok: boolean; message: string } = {
      ok: true,
      message: "Home page saved.",
    };
    let trustedResult: { ok: boolean; message: string } = {
      ok: true,
      message: "Trusted by logos saved.",
    };

    if (homeDirty) homeResult = await saveAction(sections);
    if (trustedDirty) trustedResult = await saveTrustedByAction(trustedClients);

    const success = homeResult.ok && trustedResult.ok;
    setOk(success);
    setMessage(
      success
        ? homeDirty && trustedDirty
          ? "Home page and Trusted by saved."
          : homeDirty
            ? homeResult.message
            : trustedResult.message
        : !homeResult.ok
          ? homeResult.message
          : trustedResult.message,
    );
    setPending(false);
    if (success) {
      if (homeDirty) setBaseline(sections);
      if (trustedDirty) setTrustedBaseline(trustedClients);
      router.refresh();
    }
  }

  function discard() {
    setSections(baseline);
    setTrustedClients(trustedBaseline);
    setTarget(null);
    setMessage("");
  }

  const heroProps = heroPropsFromSections(sections.hero);

  return (
    <>
      <Home2Hero
        {...heroProps}
        disableCtaLinks={editing}
        editSlots={
          editing
            ? {
                headline: (node) =>
                  hit(editing, "hero.headline", target, setTarget, "headline", node, true),
                subhead: (node) =>
                  hit(
                    editing,
                    "hero.subhead",
                    target,
                    setTarget,
                    "supporting line",
                    node,
                    true,
                  ),
                primaryCta: (node) =>
                  hit(
                    editing,
                    "hero.primaryCta",
                    target,
                    setTarget,
                    "primary button",
                    node,
                  ),
                secondaryCta: (node) =>
                  hit(
                    editing,
                    "hero.secondaryCta",
                    target,
                    setTarget,
                    "secondary button",
                    node,
                  ),
              }
            : undefined
        }
      />

      <TrustedBy
        clients={trustedClients}
        disableStoryLinks={editing}
        editSlots={
          editing
            ? {
                client: (index, node) =>
                  hit(
                    editing,
                    `trustedBy.client.${index}`,
                    target,
                    setTarget,
                    `trusted by logo ${index + 1}`,
                    node,
                    true,
                    "ring-offset-charcoal",
                  ),
              }
            : undefined
        }
      />

      <WaysInAccordion
        content={sections.waysIn}
        editSlots={
          editing
            ? {
                headline: (node) =>
                  hit(
                    editing,
                    "waysIn.headline",
                    target,
                    setTarget,
                    "ways in headline",
                    node,
                    true,
                  ),
                subhead: (node) =>
                  hit(
                    editing,
                    "waysIn.subhead",
                    target,
                    setTarget,
                    "ways in supporting line",
                    node,
                    true,
                  ),
                item: (index, node) =>
                  hit(
                    editing,
                    `waysIn.item.${index}`,
                    target,
                    setTarget,
                    `ways in item ${index + 1}`,
                    node,
                    true,
                  ),
              }
            : undefined
        }
      />

      <RosterPreviewSection
        content={sections.roster}
        cards={rosterCards}
        disableCtaLink={editing}
        editSlots={
          editing
            ? {
                headline: (node) =>
                  hit(
                    editing,
                    "roster.headline",
                    target,
                    setTarget,
                    "roster headline",
                    node,
                    true,
                  ),
                subhead: (node) =>
                  hit(
                    editing,
                    "roster.subhead",
                    target,
                    setTarget,
                    "roster supporting line",
                    node,
                    true,
                  ),
                cta: (node) =>
                  hit(
                    editing,
                    "roster.cta",
                    target,
                    setTarget,
                    "roster button",
                    node,
                  ),
              }
            : undefined
        }
      />

      <ImpactStats
        content={sections.impact}
        editSlots={
          editing
            ? {
                headline: (node) =>
                  hit(
                    editing,
                    "impact.headline",
                    target,
                    setTarget,
                    "impact headline",
                    node,
                    true,
                  ),
                stat: (index, node) =>
                  hit(
                    editing,
                    `impact.stat.${index}`,
                    target,
                    setTarget,
                    `impact stat ${index + 1}`,
                    node,
                    true,
                  ),
              }
            : undefined
        }
      />

      <KeyStudy
        variant="full"
        content={sections.keyStudy}
        editSlots={
          editing
            ? {
                headline: (node) =>
                  hit(
                    editing,
                    "keyStudy.headline",
                    target,
                    setTarget,
                    "case study headline",
                    node,
                    true,
                  ),
                summary: (node) =>
                  hit(
                    editing,
                    "keyStudy.summary",
                    target,
                    setTarget,
                    "case study summary",
                    node,
                    true,
                  ),
                meta: (node) =>
                  hit(
                    editing,
                    "keyStudy.meta",
                    target,
                    setTarget,
                    "case study meta",
                    node,
                    true,
                  ),
                cta: (node) =>
                  hit(
                    editing,
                    "keyStudy.cta",
                    target,
                    setTarget,
                    "case study button",
                    node,
                  ),
                metric: (index, node) =>
                  hit(
                    editing,
                    `keyStudy.metric.${index}`,
                    target,
                    setTarget,
                    `case study metric ${index + 1}`,
                    node,
                    true,
                  ),
              }
            : undefined
        }
      />

      <BrandBrief
        variant="boxed"
        content={sections.brandBrief}
        editSlots={
          editing
            ? {
                eyebrow: (node) =>
                  hit(
                    editing,
                    "brandBrief.eyebrow",
                    target,
                    setTarget,
                    "brief eyebrow",
                    node,
                    true,
                    "ring-offset-forest-dark",
                  ),
                headline: (node) =>
                  hit(
                    editing,
                    "brandBrief.headline",
                    target,
                    setTarget,
                    "brief headline",
                    node,
                    true,
                    "ring-offset-forest-dark",
                  ),
                subhead: (node) =>
                  hit(
                    editing,
                    "brandBrief.subhead",
                    target,
                    setTarget,
                    "brief supporting line",
                    node,
                    true,
                    "ring-offset-forest-dark",
                  ),
                quote: (node) =>
                  hit(
                    editing,
                    "brandBrief.quote",
                    target,
                    setTarget,
                    "brief quote",
                    node,
                    true,
                    "ring-offset-forest-dark",
                  ),
                formTitle: (node) =>
                  hit(
                    editing,
                    "brandBrief.formTitle",
                    target,
                    setTarget,
                    "brief form title",
                    node,
                    true,
                  ),
              }
            : undefined
        }
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
              <Button
                  type="button"
                  variant="ghost"
                  className="px-3! py-2! text-xs"
                  onClick={() => {
                    setTrustedClients((prev) => {
                      const next = [...prev, emptyTrustedByClient()];
                      setTarget(`trustedBy.client.${next.length - 1}`);
                      return next;
                    });
                  }}
                >
                  Add logo
                </Button>
              <a
                href="/admin/trusted-by"
                className="px-2 text-xs font-medium text-charcoal/55 hover:text-charcoal"
              >
                Trusted by CMS
              </a>
              <a
                href="/admin/pages/home"
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

      {editing && target ? (
        <EditorPopover
          target={target}
          sections={sections}
          trustedClients={trustedClients}
          onChange={setSections}
          onTrustedClientsChange={setTrustedClients}
          onClose={() => setTarget(null)}
        />
      ) : null}
    </>
  );
}
