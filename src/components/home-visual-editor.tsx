"use client";

import { useEffect, useId, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";

import { BrandBrief } from "@/components/brand-brief";
import { CaseStudyLinkField } from "@/components/case-study-link-field";
import { EditableHit } from "@/components/editable-hit";
import { FadeUp } from "@/components/fade-up";
import { useHomeCms, useSiteChrome } from "@/components/home-cms-context";
import {
  Home2Hero,
  heroPropsFromSections,
} from "@/components/home-2/home-2-hero";
import type { HeroCastMember } from "@/components/home-2/hero-cast";
import { RosterPreviewSection } from "@/components/home-2/roster-preview-section";
import { WaysInAccordion } from "@/components/home-2/ways-in-accordion";
import {
  CtaStyleControls,
  HeadlineStyleControls,
  TextStyleControls,
} from "@/components/home-style-controls";
import { MediaField } from "@/components/media-library";
import {
  EYEBROW,
  PAGE_SHELL,
} from "@/components/inner-page";
import { KeyStudy } from "@/components/key-study";
import { RepresentationFaq } from "@/components/representation-faq";
import type { RosterCardExpert } from "@/components/roster-card";
import { RosterFeaturedSlotsField } from "@/components/roster-featured-slots-field";
import { TrustedBy } from "@/components/trusted-by";
import { Button, Field, TextArea, TextInput } from "@/components/ui";
import type { HomePageSections } from "@/lib/cms";
import { DEFAULT_HOME_SECTIONS, emptyHomeFaqItem } from "@/lib/cms";
import { selectRosterPreviewCards } from "@/lib/roster-preview";
import type { SiteChromeSections } from "@/lib/site-chrome";
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
  | "roster.featured"
  | "impact.headline"
  | `impact.stat.${number}`
  | "keyStudy.logo"
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
  | "brandBrief.formFootnote"
  | "creatorCta.eyebrow"
  | "creatorCta.headline"
  | "creatorCta.subhead"
  | "creatorCta.stats"
  | "creatorCta.buttons"
  | "faq"
  | "trustedBy.introLine"
  | `trustedBy.client.${number}`
  | "footer.tagline"
  | "footer.companyLine"
  | "footer.companyLineHref"
  | "footer.companyLineLinkLabel"
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
    "roster.featured": "Roster preview creators",
    "impact.headline": "Impact headline",
    "keyStudy.logo": "Case study logo",
    "keyStudy.headline": "Case study headline",
    "keyStudy.summary": "Case study summary",
    "keyStudy.meta": "Case study meta",
    "keyStudy.cta": "Case study button",
    "brandBrief.eyebrow": "Brief eyebrow",
    "brandBrief.headline": "Brief headline",
    "brandBrief.subhead": "Brief supporting line",
    "brandBrief.quote": "Brief quote",
    "brandBrief.formTitle": "Brief form title",
    "brandBrief.formFootnote": "Brief form footnote",
    "creatorCta.eyebrow": "Creators eyebrow",
    "creatorCta.headline": "Creators headline",
    "creatorCta.subhead": "Creators supporting line",
    "creatorCta.stats": "Creators stats strip",
    "creatorCta.buttons": "Creators buttons",
    faq: "FAQ",
    "trustedBy.introLine": "Trusted by intro",
    "footer.tagline": "Footer tagline",
    "footer.companyLine": "Footer company line",
    "footer.companyLineHref": "Footer company link URL",
    "footer.companyLineLinkLabel": "Footer company linked word",
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
    return `Homepage logo ${Number(target.split(".")[2]) + 1}`;
  }
  return map[target] ?? "Edit";
}

function EditorPopover({
  target,
  sections,
  footer,
  trustedClients,
  rosterOptions,
  rosterFallbackSlugs,
  caseStudyOptions,
  onChange,
  onFooterChange,
  onTrustedClientsChange,
  onClose,
}: {
  target: EditTarget;
  sections: HomePageSections;
  footer: SiteChromeSections["footer"];
  trustedClients: TrustedByClient[];
  rosterOptions: Array<{ slug: string; name: string }>;
  rosterFallbackSlugs: string[];
  caseStudyOptions: Array<{ slug: string; label: string }>;
  onChange: (next: HomePageSections) => void;
  onFooterChange: (next: Partial<SiteChromeSections["footer"]>) => void;
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

        {target === "roster.featured" ? (
          <RosterFeaturedSlotsField
            options={rosterOptions}
            value={sections.roster.featuredSlugs}
            fallbackSlugs={rosterFallbackSlugs}
            onChange={(featuredSlugs) =>
              patch("roster", { ...sections.roster, featuredSlugs })
            }
          />
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

        {target === "keyStudy.logo" ? (
          <>
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
            <p className="text-sm text-muted">
              Edit titles and values. Add or remove items freely.
            </p>
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
          </>
        ) : null}

        {target === "keyStudy.cta" ? (
          sections.keyStudy.showCta ? (
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
            </>
          ) : (
            <>
              <p className="text-sm text-muted">
                The case study button is hidden on the live page.
              </p>
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
            </>
          )
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
            <Field label="Logo name (alt text)" id="bb-logo-name">
              <TextInput
                id="bb-logo-name"
                value={sections.brandBrief.quoteLogoName}
                onChange={(e) =>
                  patch("brandBrief", {
                    ...sections.brandBrief,
                    quoteLogoName: e.target.value,
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

        {target === "brandBrief.formFootnote" ? (
          <>
            <Field label="Footnote" id="bb-footnote">
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
            {sections.brandBrief.formFootnote.trim() ? (
              <button
                type="button"
                onClick={() =>
                  patch("brandBrief", {
                    ...sections.brandBrief,
                    formFootnote: "",
                  })
                }
                className="text-sm font-medium text-danger hover:underline"
              >
                Remove footnote
              </button>
            ) : (
              <button
                type="button"
                onClick={() =>
                  patch("brandBrief", {
                    ...sections.brandBrief,
                    formFootnote: DEFAULT_HOME_SECTIONS.brandBrief.formFootnote,
                  })
                }
                className="text-sm font-medium text-forest hover:text-forest-dark"
              >
                + Restore default footnote
              </button>
            )}
          </>
        ) : null}

        {target === "creatorCta.eyebrow" ? (
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
        ) : null}

        {target === "creatorCta.headline" ? (
          <Field label="Headline" id="cc-headline">
            <TextArea
              id="cc-headline"
              rows={3}
              value={sections.creatorCta.headline}
              onChange={(e) =>
                patch("creatorCta", {
                  ...sections.creatorCta,
                  headline: e.target.value,
                })
              }
            />
          </Field>
        ) : null}

        {target === "creatorCta.subhead" ? (
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
        ) : null}

        {target === "creatorCta.stats" ? (
          <>
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
          </>
        ) : null}

        {target === "creatorCta.buttons" ? (
          <>
            <p className="text-sm font-medium text-charcoal">Primary button</p>
            <Field label="Label" id="cc-primary-label">
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
            <Field label="Link" id="cc-primary-href">
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
            {sections.creatorCta.primaryCtaLabel.trim() ? (
              <button
                type="button"
                onClick={() =>
                  patch("creatorCta", {
                    ...sections.creatorCta,
                    primaryCtaLabel: "",
                  })
                }
                className="text-sm font-medium text-danger hover:underline"
              >
                Remove primary button
              </button>
            ) : (
              <button
                type="button"
                onClick={() =>
                  patch("creatorCta", {
                    ...sections.creatorCta,
                    primaryCtaLabel:
                      DEFAULT_HOME_SECTIONS.creatorCta.primaryCtaLabel,
                    primaryCtaHref:
                      DEFAULT_HOME_SECTIONS.creatorCta.primaryCtaHref,
                  })
                }
                className="text-sm font-medium text-forest hover:text-forest-dark"
              >
                + Add primary button
              </button>
            )}

            <p className="border-t border-charcoal/10 pt-3 text-sm font-medium text-charcoal">
              Secondary button
            </p>
            <Field label="Label" id="cc-secondary-label">
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
            <Field label="Link" id="cc-secondary-href">
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
            {sections.creatorCta.secondaryCtaLabel.trim() ? (
              <button
                type="button"
                onClick={() =>
                  patch("creatorCta", {
                    ...sections.creatorCta,
                    secondaryCtaLabel: "",
                  })
                }
                className="text-sm font-medium text-danger hover:underline"
              >
                Remove secondary button
              </button>
            ) : (
              <button
                type="button"
                onClick={() =>
                  patch("creatorCta", {
                    ...sections.creatorCta,
                    secondaryCtaLabel:
                      DEFAULT_HOME_SECTIONS.creatorCta.secondaryCtaLabel,
                    secondaryCtaHref:
                      DEFAULT_HOME_SECTIONS.creatorCta.secondaryCtaHref,
                  })
                }
                className="text-sm font-medium text-forest hover:text-forest-dark"
              >
                + Add secondary button
              </button>
            )}
          </>
        ) : null}

        {target === "faq" ? (
          <>
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
          </>
        ) : null}

        {target === "trustedBy.introLine" ? (
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
                  editable under Admin → Homepage logos.
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
                <CaseStudyLinkField
                  id="tb-case-study"
                  value={client.caseStudySlug}
                  options={caseStudyOptions}
                  onChange={(caseStudySlug) => updateClient({ caseStudySlug })}
                />

                <div className="flex items-center justify-between gap-3 border-t border-charcoal/10 pt-3">
                  <div>
                    <p className="text-sm font-medium text-charcoal">
                      Testimonial hover
                    </p>
                    <p className="mt-0.5 text-xs text-charcoal/50">
                      Optional. Shows the quote box on hover — separate from the
                      Customer story button.
                    </p>
                  </div>
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
                    {hasStory ? "Remove testimonial" : "Add testimonial"}
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
                    No hover quote. Add a case study above for a Customer story
                    button, or leave both empty for logo only.
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
                    Open Homepage logos CMS
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
              value={footer.tagline}
              onChange={(e) => onFooterChange({ tagline: e.target.value })}
            />
          </Field>
        ) : null}

        {target === "footer.companyLine" ||
        target === "footer.companyLineHref" ||
        target === "footer.companyLineLinkLabel" ? (
          <>
            <Field label="Company line" id="ft-company">
              <TextInput
                id="ft-company"
                value={footer.companyLine}
                onChange={(e) =>
                  onFooterChange({ companyLine: e.target.value })
                }
              />
            </Field>
            <Field label="Company link URL" id="ft-company-href">
              <TextInput
                id="ft-company-href"
                value={footer.companyLineHref}
                onChange={(e) =>
                  onFooterChange({ companyLineHref: e.target.value })
                }
              />
            </Field>
            <Field
              label="Linked word"
              id="ft-company-link-label"
              hint='Word in the company line that becomes the link (e.g. "PepTalk").'
            >
              <TextInput
                id="ft-company-link-label"
                value={footer.companyLineLinkLabel}
                onChange={(e) =>
                  onFooterChange({ companyLineLinkLabel: e.target.value })
                }
              />
            </Field>
          </>
        ) : null}

        {target === "footer.email" ? (
          <Field label="Email" id="ft-email">
            <TextInput
              id="ft-email"
              value={footer.email}
              onChange={(e) => onFooterChange({ email: e.target.value })}
            />
          </Field>
        ) : null}

        {target.startsWith("footer.") ? (
          <a
            href="/admin/pages/site"
            className="mt-2 block text-xs font-medium text-charcoal/55 hover:text-charcoal"
          >
            Edit full header & footer in admin →
          </a>
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
  initialChrome,
  initialTrustedClients,
  canEdit,
  rosterCards,
  heroCast,
  caseStudyOptions = [],
  saveAction,
  saveChromeAction,
  saveTrustedByAction,
}: {
  initial: HomePageSections;
  initialChrome: SiteChromeSections;
  initialTrustedClients: TrustedByClient[];
  canEdit: boolean;
  rosterCards: RosterCardExpert[];
  heroCast: HeroCastMember[];
  caseStudyOptions?: Array<{ slug: string; label: string }>;
  saveAction: typeof import("@/lib/actions/admin-cms").saveHomePage;
  saveChromeAction: typeof import("@/lib/actions/admin-cms").saveSiteChrome;
  saveTrustedByAction: typeof import("@/lib/actions/admin-trusted-by").saveTrustedClientsList;
}) {
  const router = useRouter();
  const {
    setCanEdit,
    setEditing: setCmsEditing,
    setSelected,
    setOnSelectFooterField,
  } = useHomeCms();
  const { chrome, setChrome } = useSiteChrome();
  const [editing, setEditing] = useState(false);
  const [sections, setSections] = useState(initial);
  const [baseline, setBaseline] = useState(initial);
  const [chromeBaseline, setChromeBaseline] = useState(initialChrome);
  const [trustedClients, setTrustedClients] = useState(initialTrustedClients);
  const [trustedBaseline, setTrustedBaseline] = useState(initialTrustedClients);
  const [target, setTarget] = useState<EditTarget | null>(null);
  const [pending, setPending] = useState(false);
  const [message, setMessage] = useState("");
  const [ok, setOk] = useState(false);

  const dirty =
    JSON.stringify(sections) !== JSON.stringify(baseline) ||
    JSON.stringify(chrome) !== JSON.stringify(chromeBaseline) ||
    JSON.stringify(trustedClients) !== JSON.stringify(trustedBaseline);

  const rosterPreviewCards = useMemo(
    () =>
      selectRosterPreviewCards(rosterCards, sections.roster.featuredSlugs),
    [rosterCards, sections.roster.featuredSlugs],
  );
  const rosterOptions = useMemo(
    () =>
      rosterCards.map((card) => ({
        slug: card.slug,
        name: card.name,
        image: card.image,
        role: card.role,
      })),
    [rosterCards],
  );
  const rosterFallbackSlugs = useMemo(
    () => rosterCards.slice(0, 4).map((card) => card.slug),
    [rosterCards],
  );
  const faqItems = sections.faq.items.filter(
    (item) => item.q.trim() || item.a.trim(),
  );

  useEffect(() => {
    setCanEdit(canEdit);
  }, [canEdit, setCanEdit]);

  useEffect(() => {
    setCmsEditing(editing);
    setSelected(target);
  }, [editing, target, setCmsEditing, setSelected]);

  useEffect(() => {
    setOnSelectFooterField((field) => {
      setTarget(`footer.${field}`);
    });
    return () => setOnSelectFooterField(null);
  }, [setOnSelectFooterField]);

  async function save() {
    setPending(true);
    const homeDirty = JSON.stringify(sections) !== JSON.stringify(baseline);
    const chromeDirty =
      JSON.stringify(chrome) !== JSON.stringify(chromeBaseline);
    const trustedDirty =
      JSON.stringify(trustedClients) !== JSON.stringify(trustedBaseline);

    let homeResult: { ok: boolean; message: string } = {
      ok: true,
      message: "Home page saved.",
    };
    let chromeResult: { ok: boolean; message: string } = {
      ok: true,
      message: "Header & footer saved.",
    };
    let trustedResult: { ok: boolean; message: string } = {
      ok: true,
      message: "Homepage logos saved.",
    };

    if (homeDirty) homeResult = await saveAction(sections);
    if (chromeDirty) chromeResult = await saveChromeAction(chrome);
    if (trustedDirty) trustedResult = await saveTrustedByAction(trustedClients);

    const success = homeResult.ok && chromeResult.ok && trustedResult.ok;
    setOk(success);
    const parts = [
      homeDirty ? "Home" : null,
      chromeDirty ? "footer" : null,
      trustedDirty ? "Homepage logos" : null,
    ].filter(Boolean);
    setMessage(
      success
        ? `${parts.join(" & ")} saved.`
        : !homeResult.ok
          ? homeResult.message
          : !chromeResult.ok
            ? chromeResult.message
            : trustedResult.message,
    );
    setPending(false);
    if (success) {
      if (homeDirty) setBaseline(sections);
      if (chromeDirty) setChromeBaseline(chrome);
      if (trustedDirty) setTrustedBaseline(trustedClients);
      router.refresh();
    }
  }

  function discard() {
    setSections(baseline);
    setChrome(chromeBaseline);
    setTrustedClients(trustedBaseline);
    setTarget(null);
    setMessage("");
  }

  const heroProps = heroPropsFromSections(sections.hero);

  return (
    <>
      <Home2Hero
        {...heroProps}
        cast={heroCast}
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
        introLine={sections.trustedBy.introLine}
        disableStoryLinks={editing}
        editSlots={
          editing
            ? {
                introLine: (node) =>
                  hit(
                    editing,
                    "trustedBy.introLine",
                    target,
                    setTarget,
                    "trusted by intro",
                    node,
                    true,
                    "ring-offset-charcoal",
                  ),
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
        cards={rosterPreviewCards}
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
                grid: (node) =>
                  hit(
                    editing,
                    "roster.featured",
                    target,
                    setTarget,
                    "roster preview creators",
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
                logo: (node) =>
                  hit(
                    editing,
                    "keyStudy.logo",
                    target,
                    setTarget,
                    "case study logo",
                    node,
                  ),
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
        creatorCta={sections.creatorCta}
        rosterOptions={rosterOptions}
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
                formFootnote: (node) =>
                  hit(
                    editing,
                    "brandBrief.formFootnote",
                    target,
                    setTarget,
                    "brief form footnote",
                    node,
                  ),
              }
            : undefined
        }
        creatorCtaEditSlots={
          editing
            ? {
                eyebrow: (node) =>
                  hit(
                    editing,
                    "creatorCta.eyebrow",
                    target,
                    setTarget,
                    "creators eyebrow",
                    node,
                    true,
                    "ring-offset-rust",
                  ),
                headline: (node) =>
                  hit(
                    editing,
                    "creatorCta.headline",
                    target,
                    setTarget,
                    "creators headline",
                    node,
                    true,
                    "ring-offset-rust",
                  ),
                subhead: (node) =>
                  hit(
                    editing,
                    "creatorCta.subhead",
                    target,
                    setTarget,
                    "creators supporting line",
                    node,
                    true,
                    "ring-offset-rust",
                  ),
                stats: (node) =>
                  hit(
                    editing,
                    "creatorCta.stats",
                    target,
                    setTarget,
                    "creators stats strip",
                    node,
                    true,
                    "ring-offset-rust",
                  ),
                buttons: (node) =>
                  hit(
                    editing,
                    "creatorCta.buttons",
                    target,
                    setTarget,
                    "creators buttons",
                    node,
                    true,
                    "ring-offset-rust",
                  ),
              }
            : undefined
        }
      />

      {faqItems.length > 0 ? (
        <section className="bg-cream px-6 pt-10 pb-10 md:px-10 md:pt-12 md:pb-12 lg:px-12 lg:pb-14">
          <div className={PAGE_SHELL}>
            <FadeUp>
              {hit(
                editing,
                "faq",
                target,
                setTarget,
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
                true,
              )}
            </FadeUp>
            <div className="mx-auto mt-14 max-w-[47.5rem]">
              {hit(
                editing,
                "faq",
                target,
                setTarget,
                "FAQ items",
                <RepresentationFaq items={faqItems} />,
                true,
              )}
            </div>
          </div>
        </section>
      ) : null}

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
                Homepage logos CMS
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
          footer={chrome.footer}
          trustedClients={trustedClients}
          rosterOptions={rosterOptions}
          rosterFallbackSlugs={rosterFallbackSlugs}
          caseStudyOptions={caseStudyOptions}
          onChange={setSections}
          onFooterChange={(patch) =>
            setChrome({
              ...chrome,
              footer: { ...chrome.footer, ...patch },
            })
          }
          onTrustedClientsChange={setTrustedClients}
          onClose={() => setTarget(null)}
        />
      ) : null}
    </>
  );
}
