"use client";

import { useState } from "react";

import { Button, Field, TextArea, TextInput } from "@/components/ui";
import {
  emptyFooterColumn,
  emptyNavLink,
  emptySocialLink,
  PROFILE_BODY_SECTION_LABELS,
  PROFILE_FOOTER_BLOCK_LABELS,
  PROFILE_FORMAT_KINDS,
  SOCIAL_NETWORKS,
  type FooterColumn,
  type NavLink,
  type ProfileBodySectionId,
  type ProfileFooterBlockId,
  type SiteChromeSections,
  type SocialLink,
  type SocialNetwork,
} from "@/lib/site-chrome";
import { cn } from "@/lib/utils";

function MoveButtons({
  index,
  total,
  onMove,
}: {
  index: number;
  total: number;
  onMove: (from: number, to: number) => void;
}) {
  return (
    <div className="flex gap-1">
      <button
        type="button"
        disabled={index === 0}
        onClick={() => onMove(index, index - 1)}
        className="rounded-sm border border-charcoal/15 px-2 py-0.5 text-xs text-charcoal/70 disabled:opacity-30"
        aria-label="Move up"
      >
        ↑
      </button>
      <button
        type="button"
        disabled={index >= total - 1}
        onClick={() => onMove(index, index + 1)}
        className="rounded-sm border border-charcoal/15 px-2 py-0.5 text-xs text-charcoal/70 disabled:opacity-30"
        aria-label="Move down"
      >
        ↓
      </button>
    </div>
  );
}

function NavLinkRows({
  links,
  onChange,
  idPrefix,
}: {
  links: NavLink[];
  onChange: (links: NavLink[]) => void;
  idPrefix: string;
}) {
  function move(from: number, to: number) {
    if (to < 0 || to >= links.length) return;
    const next = [...links];
    const [item] = next.splice(from, 1);
    next.splice(to, 0, item);
    onChange(next);
  }

  return (
    <div className="space-y-3">
      {links.map((link, index) => (
        <div
          key={`${idPrefix}-${index}`}
          className="flex flex-col gap-2 rounded-sm border border-charcoal/10 bg-cream/40 p-3 sm:flex-row sm:items-end"
        >
          <div className="flex-1">
            <Field label="Label" id={`${idPrefix}-label-${index}`}>
              <TextInput
                id={`${idPrefix}-label-${index}`}
                value={link.label}
                onChange={(e) => {
                  const next = [...links];
                  next[index] = { ...link, label: e.target.value };
                  onChange(next);
                }}
              />
            </Field>
          </div>
          <div className="flex-[1.4]">
            <Field label="URL" id={`${idPrefix}-href-${index}`}>
              <TextInput
                id={`${idPrefix}-href-${index}`}
                value={link.href}
                onChange={(e) => {
                  const next = [...links];
                  next[index] = { ...link, href: e.target.value };
                  onChange(next);
                }}
              />
            </Field>
          </div>
          <div className="flex items-center gap-2 pb-0.5">
            <MoveButtons index={index} total={links.length} onMove={move} />
            <button
              type="button"
              onClick={() => onChange(links.filter((_, i) => i !== index))}
              className="text-xs font-medium text-danger hover:underline"
            >
              Remove
            </button>
          </div>
        </div>
      ))}
      <button
        type="button"
        onClick={() => onChange([...links, emptyNavLink()])}
        className="text-sm font-medium text-forest hover:text-forest-dark"
      >
        + Add link
      </button>
    </div>
  );
}

export function SiteChromeEditorForm({
  initial,
  saveAction,
  focus = "all",
}: {
  initial: SiteChromeSections;
  saveAction: typeof import("@/lib/actions/admin-cms").saveSiteChrome;
  /** "profile" shows only creator-profile template fields. */
  focus?: "all" | "profile";
}) {
  const [sections, setSections] = useState(initial);
  const [message, setMessage] = useState("");
  const [ok, setOk] = useState(false);
  const [pending, setPending] = useState(false);
  const profileOnly = focus === "profile";

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setPending(true);
    const result = await saveAction(sections);
    setOk(result.ok);
    setMessage(result.message);
    setPending(false);
  }

  function setHeader(header: SiteChromeSections["header"]) {
    setSections({ ...sections, header });
  }

  function setProfileRail(profileRail: SiteChromeSections["profileRail"]) {
    setSections({ ...sections, profileRail });
  }

  function setProfileLayout(profileLayout: SiteChromeSections["profileLayout"]) {
    setSections({ ...sections, profileLayout });
  }

  function setProfileCta(profileCta: SiteChromeSections["profileCta"]) {
    setSections({ ...sections, profileCta });
  }

  function setProfileFormats(
    profileFormats: SiteChromeSections["profileFormats"],
  ) {
    setSections({ ...sections, profileFormats });
  }

  function setInsightsPromo(
    insightsPromo: SiteChromeSections["insightsPromo"],
  ) {
    setSections({ ...sections, insightsPromo });
  }

  function setArticleSidebarCta(
    articleSidebarCta: SiteChromeSections["articleSidebarCta"],
  ) {
    setSections({ ...sections, articleSidebarCta });
  }

  function setCaseStudyCreatorCta(
    caseStudyCreatorCta: SiteChromeSections["caseStudyCreatorCta"],
  ) {
    setSections({ ...sections, caseStudyCreatorCta });
  }

  function setFooter(footer: SiteChromeSections["footer"]) {
    setSections({ ...sections, footer });
  }

  function moveColumn(from: number, to: number) {
    const columns = [...sections.footer.columns];
    if (to < 0 || to >= columns.length) return;
    const [item] = columns.splice(from, 1);
    columns.splice(to, 0, item);
    setFooter({ ...sections.footer, columns });
  }

  function updateColumn(index: number, column: FooterColumn) {
    const columns = [...sections.footer.columns];
    columns[index] = column;
    setFooter({ ...sections.footer, columns });
  }

  function updateSocial(index: number, social: SocialLink) {
    const socials = [...sections.footer.socials];
    socials[index] = social;
    setFooter({ ...sections.footer, socials });
  }

  function moveSocial(from: number, to: number) {
    const socials = [...sections.footer.socials];
    if (to < 0 || to >= socials.length) return;
    const [item] = socials.splice(from, 1);
    socials.splice(to, 0, item);
    setFooter({ ...sections.footer, socials });
  }

  return (
    <form onSubmit={onSubmit} className="space-y-10">
      {!profileOnly ? (
      <section className="space-y-4">
        <div>
          <h2 className="font-display text-xl">Header</h2>
          <p className="mt-1 text-sm text-muted">
            Primary nav links and the green CTA. Add or remove links as needed.
          </p>
        </div>
        <NavLinkRows
          idPrefix="nav"
          links={sections.header.links}
          onChange={(links) => setHeader({ ...sections.header, links })}
        />
        <div className="grid gap-4 md:grid-cols-2">
          <Field label="CTA label" id="cta-label">
            <TextInput
              id="cta-label"
              value={sections.header.ctaLabel}
              onChange={(e) =>
                setHeader({ ...sections.header, ctaLabel: e.target.value })
              }
              required
            />
          </Field>
          <Field label="CTA URL" id="cta-href">
            <TextInput
              id="cta-href"
              value={sections.header.ctaHref}
              onChange={(e) =>
                setHeader({ ...sections.header, ctaHref: e.target.value })
              }
              required
            />
          </Field>
        </div>
      </section>
      ) : null}

      <section className="space-y-4">
        <div>
          <h2 className="font-display text-xl">Creator profile sidebar</h2>
          <p className="mt-1 text-sm text-muted">
            Sticky rail on every roster profile. Use {"{first}"} or {"{name}"}{" "}
            in titles and descriptions — they are replaced per creator.
          </p>
        </div>
        <Field label="Availability label" id="pr-availability">
          <TextInput
            id="pr-availability"
            value={sections.profileRail.availabilityLabel}
            onChange={(e) =>
              setProfileRail({
                ...sections.profileRail,
                availabilityLabel: e.target.value,
              })
            }
          />
        </Field>
        <div className="grid gap-4 md:grid-cols-2">
          <Field label="Signed badge" id="pr-signed">
            <TextInput
              id="pr-signed"
              value={sections.profileRail.signedBadgeLabel}
              onChange={(e) =>
                setProfileRail({
                  ...sections.profileRail,
                  signedBadgeLabel: e.target.value,
                })
              }
            />
          </Field>
          <Field label="Open badge" id="pr-open">
            <TextInput
              id="pr-open"
              value={sections.profileRail.openBadgeLabel}
              onChange={(e) =>
                setProfileRail({
                  ...sections.profileRail,
                  openBadgeLabel: e.target.value,
                })
              }
            />
          </Field>
        </div>
        <Field label="Focus label (when nav is hidden)" id="pr-focus">
          <TextInput
            id="pr-focus"
            value={sections.profileRail.focusLabel}
            onChange={(e) =>
              setProfileRail({
                ...sections.profileRail,
                focusLabel: e.target.value,
              })
            }
          />
        </Field>
        <div className="space-y-3 rounded-sm border border-charcoal/10 p-4">
          <p className="text-sm font-medium">On-page nav labels</p>
          <div className="grid gap-4 md:grid-cols-2">
            {(
              [
                ["overview", "Overview"],
                ["channels", "Channels"],
                ["topics", "Topics & audience"],
                ["formats", "Formats"],
                ["work", "Recent work"],
              ] as const
            ).map(([key, hint]) => (
              <Field key={key} label={hint} id={`pr-nav-${key}`}>
                <TextInput
                  id={`pr-nav-${key}`}
                  value={sections.profileRail.nav[key]}
                  onChange={(e) =>
                    setProfileRail({
                      ...sections.profileRail,
                      nav: {
                        ...sections.profileRail.nav,
                        [key]: e.target.value,
                      },
                    })
                  }
                />
              </Field>
            ))}
          </div>
        </div>
        <Field label="Work-with title" id="pr-work-title">
          <TextInput
            id="pr-work-title"
            value={sections.profileRail.workWithTitle}
            onChange={(e) =>
              setProfileRail({
                ...sections.profileRail,
                workWithTitle: e.target.value,
              })
            }
          />
        </Field>
        <Field label="Work-with description" id="pr-work-desc">
          <TextArea
            id="pr-work-desc"
            rows={2}
            value={sections.profileRail.workWithDescription}
            onChange={(e) =>
              setProfileRail({
                ...sections.profileRail,
                workWithDescription: e.target.value,
              })
            }
          />
        </Field>
        <div className="grid gap-4 md:grid-cols-2">
          <Field label="Primary button label" id="pr-primary-cta">
            <TextInput
              id="pr-primary-cta"
              value={sections.profileRail.primaryCtaLabel}
              onChange={(e) =>
                setProfileRail({
                  ...sections.profileRail,
                  primaryCtaLabel: e.target.value,
                })
              }
            />
          </Field>
          <Field label="Footnote" id="pr-footnote">
            <TextInput
              id="pr-footnote"
              value={sections.profileRail.footnote}
              onChange={(e) =>
                setProfileRail({
                  ...sections.profileRail,
                  footnote: e.target.value,
                })
              }
            />
          </Field>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <Field label="Shortlist button" id="pr-shortlist">
            <TextInput
              id="pr-shortlist"
              value={sections.profileRail.shortlistLabel}
              onChange={(e) =>
                setProfileRail({
                  ...sections.profileRail,
                  shortlistLabel: e.target.value,
                })
              }
            />
          </Field>
          <Field label="Shortlisted button" id="pr-shortlisted">
            <TextInput
              id="pr-shortlisted"
              value={sections.profileRail.shortlistedLabel}
              onChange={(e) =>
                setProfileRail({
                  ...sections.profileRail,
                  shortlistedLabel: e.target.value,
                })
              }
            />
          </Field>
        </div>
      </section>

      <section className="space-y-4">
        <div>
          <h2 className="font-display text-xl">Creator profile page layout</h2>
          <p className="mt-1 text-sm text-muted">
            Reorder body sections and closing blocks on every roster profile.
            Use {"{first}"} in headings and the hero CTA label.
          </p>
        </div>

        <div className="space-y-3 rounded-sm border border-charcoal/10 p-4">
          <p className="text-sm font-medium">Body section order</p>
          <p className="text-xs text-muted">
            Sections without creator content stay hidden; order still applies
            when they appear.
          </p>
          {sections.profileLayout.sectionOrder.map((id, index) => (
            <div
              key={id}
              className="flex items-center justify-between gap-3 rounded-sm border border-charcoal/8 bg-cream/40 px-3 py-2"
            >
              <p className="text-sm text-charcoal">
                {PROFILE_BODY_SECTION_LABELS[id]}
              </p>
              <MoveButtons
                index={index}
                total={sections.profileLayout.sectionOrder.length}
                onMove={(from, to) => {
                  const next = [...sections.profileLayout.sectionOrder];
                  const [item] = next.splice(from, 1);
                  next.splice(to, 0, item as ProfileBodySectionId);
                  setProfileLayout({
                    ...sections.profileLayout,
                    sectionOrder: next,
                  });
                }}
              />
            </div>
          ))}
        </div>

        <div className="space-y-3 rounded-sm border border-charcoal/10 p-4">
          <p className="text-sm font-medium">Closing block order</p>
          {sections.profileLayout.footerOrder.map((id, index) => (
            <div
              key={id}
              className="flex items-center justify-between gap-3 rounded-sm border border-charcoal/8 bg-cream/40 px-3 py-2"
            >
              <p className="text-sm text-charcoal">
                {PROFILE_FOOTER_BLOCK_LABELS[id]}
              </p>
              <MoveButtons
                index={index}
                total={sections.profileLayout.footerOrder.length}
                onMove={(from, to) => {
                  const next = [...sections.profileLayout.footerOrder];
                  const [item] = next.splice(from, 1);
                  next.splice(to, 0, item as ProfileFooterBlockId);
                  setProfileLayout({
                    ...sections.profileLayout,
                    footerOrder: next,
                  });
                }}
              />
            </div>
          ))}
        </div>

        <div className="space-y-3 rounded-sm border border-charcoal/10 p-4">
          <p className="text-sm font-medium">Section headings</p>
          {(
            [
              ["overview", "Overview heading"],
              ["overviewEyebrow", "Overview eyebrow"],
              ["channels", "Channels heading"],
              ["topics", "Topics heading"],
              ["formats", "Formats heading"],
              ["work", "Recent work heading"],
            ] as const
          ).map(([key, label]) => (
            <Field key={key} label={label} id={`pl-heading-${key}`}>
              <TextInput
                id={`pl-heading-${key}`}
                value={sections.profileLayout.headings[key]}
                onChange={(e) =>
                  setProfileLayout({
                    ...sections.profileLayout,
                    headings: {
                      ...sections.profileLayout.headings,
                      [key]: e.target.value,
                    },
                  })
                }
              />
            </Field>
          ))}
        </div>

        <Field
          label="Hero brief CTA"
          id="pl-hero-brief"
          hint="Use {first}. Shown on the full-bleed profile hero."
        >
          <TextInput
            id="pl-hero-brief"
            value={sections.profileLayout.heroBriefCtaLabel}
            onChange={(e) =>
              setProfileLayout({
                ...sections.profileLayout,
                heroBriefCtaLabel: e.target.value,
              })
            }
          />
        </Field>
        <Field label="Trusted by label" id="pl-trusted-by">
          <TextInput
            id="pl-trusted-by"
            value={sections.profileLayout.trustedByLabel}
            onChange={(e) =>
              setProfileLayout({
                ...sections.profileLayout,
                trustedByLabel: e.target.value,
              })
            }
          />
        </Field>
      </section>

      <section className="space-y-4">
        <div>
          <h2 className="font-display text-xl">Creator profile formats</h2>
          <p className="mt-1 text-sm text-muted">
            Left-side title and description on every roster profile. Use{" "}
            {"{first}"} or {"{name}"} — channel pills on the right come from
            Airtable.
          </p>
        </div>
        {PROFILE_FORMAT_KINDS.map(({ key, hint }) => (
          <div
            key={key}
            className="space-y-3 rounded-sm border border-charcoal/10 p-4"
          >
            <p className="text-sm font-medium">{hint}</p>
            <Field label="Title" id={`pf-title-${key}`}>
              <TextInput
                id={`pf-title-${key}`}
                value={sections.profileFormats[key].title}
                onChange={(e) =>
                  setProfileFormats({
                    ...sections.profileFormats,
                    [key]: {
                      ...sections.profileFormats[key],
                      title: e.target.value,
                    },
                  })
                }
              />
            </Field>
            <Field label="Description" id={`pf-desc-${key}`}>
              <TextArea
                id={`pf-desc-${key}`}
                rows={3}
                value={sections.profileFormats[key].description}
                onChange={(e) =>
                  setProfileFormats({
                    ...sections.profileFormats,
                    [key]: {
                      ...sections.profileFormats[key],
                      description: e.target.value,
                    },
                  })
                }
              />
            </Field>
          </div>
        ))}
      </section>

      <section className="space-y-4">
        <div>
          <h2 className="font-display text-xl">Creator profile footer CTA</h2>
          <p className="mt-1 text-sm text-muted">
            Charcoal closing block on every roster profile. Use {"{first}"},{" "}
            {"{name}"}, or {"{slug}"} in copy and links.
          </p>
        </div>
        <Field label="Headline" id="pc-headline">
          <TextInput
            id="pc-headline"
            value={sections.profileCta.headline}
            onChange={(e) =>
              setProfileCta({
                ...sections.profileCta,
                headline: e.target.value,
              })
            }
          />
        </Field>
        <Field label="Description" id="pc-description">
          <TextArea
            id="pc-description"
            rows={3}
            value={sections.profileCta.description}
            onChange={(e) =>
              setProfileCta({
                ...sections.profileCta,
                description: e.target.value,
              })
            }
          />
        </Field>
        <div className="grid gap-4 md:grid-cols-2">
          <Field label="Primary button label" id="pc-primary-label">
            <TextInput
              id="pc-primary-label"
              value={sections.profileCta.primaryCtaLabel}
              onChange={(e) =>
                setProfileCta({
                  ...sections.profileCta,
                  primaryCtaLabel: e.target.value,
                })
              }
            />
          </Field>
          <Field label="Primary button link" id="pc-primary-href">
            <TextInput
              id="pc-primary-href"
              value={sections.profileCta.primaryCtaHref}
              onChange={(e) =>
                setProfileCta({
                  ...sections.profileCta,
                  primaryCtaHref: e.target.value,
                })
              }
            />
          </Field>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <Field label="Secondary button label" id="pc-secondary-label">
            <TextInput
              id="pc-secondary-label"
              value={sections.profileCta.secondaryCtaLabel}
              onChange={(e) =>
                setProfileCta({
                  ...sections.profileCta,
                  secondaryCtaLabel: e.target.value,
                })
              }
            />
          </Field>
          <Field label="Secondary button link" id="pc-secondary-href">
            <TextInput
              id="pc-secondary-href"
              value={sections.profileCta.secondaryCtaHref}
              onChange={(e) =>
                setProfileCta({
                  ...sections.profileCta,
                  secondaryCtaHref: e.target.value,
                })
              }
            />
          </Field>
        </div>
        <div className="space-y-3 rounded-sm border border-charcoal/10 p-4">
          <p className="text-sm font-medium">Similar creators strip</p>
          <Field label="Headline" id="pc-similar-headline">
            <TextInput
              id="pc-similar-headline"
              value={sections.profileCta.similarHeadline}
              onChange={(e) =>
                setProfileCta({
                  ...sections.profileCta,
                  similarHeadline: e.target.value,
                })
              }
            />
          </Field>
          <div className="grid gap-4 md:grid-cols-2">
            <Field label="Link label" id="pc-similar-link-label">
              <TextInput
                id="pc-similar-link-label"
                value={sections.profileCta.similarLinkLabel}
                onChange={(e) =>
                  setProfileCta({
                    ...sections.profileCta,
                    similarLinkLabel: e.target.value,
                  })
                }
              />
            </Field>
            <Field label="Link URL" id="pc-similar-link-href">
              <TextInput
                id="pc-similar-link-href"
                value={sections.profileCta.similarLinkHref}
                onChange={(e) =>
                  setProfileCta({
                    ...sections.profileCta,
                    similarLinkHref: e.target.value,
                  })
                }
              />
            </Field>
          </div>
        </div>
      </section>

      {!profileOnly ? (
      <>
      <section className="space-y-4">
        <div>
          <h2 className="font-display text-xl">Insights page promos</h2>
          <p className="mt-1 text-sm text-muted">
            Newsletter and roster cards on /insights. Or edit live with{" "}
            <a
              href="/insights"
              className="font-medium text-forest hover:text-forest-dark"
            >
              Edit page
            </a>
            . Clear both sides to hide the strip.
          </p>
        </div>
        <div className="space-y-3 rounded-sm border border-charcoal/10 p-4">
          <p className="text-sm font-medium">Newsletter card</p>
          <div className="grid gap-4 md:grid-cols-2">
            <Field label="Eyebrow" id="ip-nl-eyebrow">
              <TextInput
                id="ip-nl-eyebrow"
                value={sections.insightsPromo.newsletter.eyebrow}
                onChange={(e) =>
                  setInsightsPromo({
                    ...sections.insightsPromo,
                    newsletter: {
                      ...sections.insightsPromo.newsletter,
                      eyebrow: e.target.value,
                    },
                  })
                }
              />
            </Field>
            <Field label="Button label" id="ip-nl-button">
              <TextInput
                id="ip-nl-button"
                value={sections.insightsPromo.newsletter.buttonLabel}
                onChange={(e) =>
                  setInsightsPromo({
                    ...sections.insightsPromo,
                    newsletter: {
                      ...sections.insightsPromo.newsletter,
                      buttonLabel: e.target.value,
                    },
                  })
                }
              />
            </Field>
          </div>
          <Field label="Headline" id="ip-nl-headline">
            <TextInput
              id="ip-nl-headline"
              value={sections.insightsPromo.newsletter.headline}
              onChange={(e) =>
                setInsightsPromo({
                  ...sections.insightsPromo,
                  newsletter: {
                    ...sections.insightsPromo.newsletter,
                    headline: e.target.value,
                  },
                })
              }
            />
          </Field>
          <Field label="Description" id="ip-nl-desc">
            <TextArea
              id="ip-nl-desc"
              rows={2}
              value={sections.insightsPromo.newsletter.description}
              onChange={(e) =>
                setInsightsPromo({
                  ...sections.insightsPromo,
                  newsletter: {
                    ...sections.insightsPromo.newsletter,
                    description: e.target.value,
                  },
                })
              }
            />
          </Field>
          <Field label="Email placeholder" id="ip-nl-placeholder">
            <TextInput
              id="ip-nl-placeholder"
              value={sections.insightsPromo.newsletter.emailPlaceholder}
              onChange={(e) =>
                setInsightsPromo({
                  ...sections.insightsPromo,
                  newsletter: {
                    ...sections.insightsPromo.newsletter,
                    emailPlaceholder: e.target.value,
                  },
                })
              }
            />
          </Field>
        </div>
        <div className="space-y-3 rounded-sm border border-charcoal/10 p-4">
          <p className="text-sm font-medium">Roster card</p>
          <div className="grid gap-4 md:grid-cols-2">
            <Field label="Eyebrow" id="ip-roster-eyebrow">
              <TextInput
                id="ip-roster-eyebrow"
                value={sections.insightsPromo.roster.eyebrow}
                onChange={(e) =>
                  setInsightsPromo({
                    ...sections.insightsPromo,
                    roster: {
                      ...sections.insightsPromo.roster,
                      eyebrow: e.target.value,
                    },
                  })
                }
              />
            </Field>
            <Field label="Button label" id="ip-roster-cta">
              <TextInput
                id="ip-roster-cta"
                value={sections.insightsPromo.roster.ctaLabel}
                onChange={(e) =>
                  setInsightsPromo({
                    ...sections.insightsPromo,
                    roster: {
                      ...sections.insightsPromo.roster,
                      ctaLabel: e.target.value,
                    },
                  })
                }
              />
            </Field>
          </div>
          <Field label="Headline" id="ip-roster-headline">
            <TextInput
              id="ip-roster-headline"
              value={sections.insightsPromo.roster.headline}
              onChange={(e) =>
                setInsightsPromo({
                  ...sections.insightsPromo,
                  roster: {
                    ...sections.insightsPromo.roster,
                    headline: e.target.value,
                  },
                })
              }
            />
          </Field>
          <Field label="Description" id="ip-roster-desc">
            <TextArea
              id="ip-roster-desc"
              rows={2}
              value={sections.insightsPromo.roster.description}
              onChange={(e) =>
                setInsightsPromo({
                  ...sections.insightsPromo,
                  roster: {
                    ...sections.insightsPromo.roster,
                    description: e.target.value,
                  },
                })
              }
            />
          </Field>
          <Field label="Button link" id="ip-roster-href">
            <TextInput
              id="ip-roster-href"
              value={sections.insightsPromo.roster.ctaHref}
              onChange={(e) =>
                setInsightsPromo({
                  ...sections.insightsPromo,
                  roster: {
                    ...sections.insightsPromo.roster,
                    ctaHref: e.target.value,
                  },
                })
              }
            />
          </Field>
        </div>
      </section>

      <section className="space-y-4">
        <div>
          <h2 className="font-display text-xl">Article sidebar CTA</h2>
          <p className="mt-1 text-sm text-muted">
            Forest card in the sidebar on insight and case study articles. Or
            edit live on any article with{" "}
            <span className="font-medium text-charcoal">Edit page</span>. Clear
            headline, description, and CTA label to hide it.
          </p>
        </div>
        <Field label="Headline" id="asc-headline">
          <TextInput
            id="asc-headline"
            value={sections.articleSidebarCta.headline}
            onChange={(e) =>
              setArticleSidebarCta({
                ...sections.articleSidebarCta,
                headline: e.target.value,
              })
            }
          />
        </Field>
        <Field label="Description" id="asc-description">
          <TextArea
            id="asc-description"
            rows={3}
            value={sections.articleSidebarCta.description}
            onChange={(e) =>
              setArticleSidebarCta({
                ...sections.articleSidebarCta,
                description: e.target.value,
              })
            }
          />
        </Field>
        <div className="grid gap-4 md:grid-cols-2">
          <Field label="CTA label" id="asc-cta-label">
            <TextInput
              id="asc-cta-label"
              value={sections.articleSidebarCta.ctaLabel}
              onChange={(e) =>
                setArticleSidebarCta({
                  ...sections.articleSidebarCta,
                  ctaLabel: e.target.value,
                })
              }
            />
          </Field>
          <Field label="CTA URL" id="asc-cta-href">
            <TextInput
              id="asc-cta-href"
              value={sections.articleSidebarCta.ctaHref}
              onChange={(e) =>
                setArticleSidebarCta({
                  ...sections.articleSidebarCta,
                  ctaHref: e.target.value,
                })
              }
            />
          </Field>
        </div>
      </section>

      <section className="space-y-4">
        <div>
          <h2 className="font-display text-xl">Case study creator CTA</h2>
          <p className="mt-1 text-sm text-muted">
            Rust closing block on case studies with a featured creator. Or edit
            live on any case study with{" "}
            <span className="font-medium text-charcoal">Edit page</span>. Use{" "}
            {"{first}"}, {"{name}"}, {"{slug}"}, or {"{possessive}"} in copy and
            links.
          </p>
        </div>
        <Field label="Eyebrow" id="cscc-eyebrow">
          <TextInput
            id="cscc-eyebrow"
            value={sections.caseStudyCreatorCta.eyebrow}
            onChange={(e) =>
              setCaseStudyCreatorCta({
                ...sections.caseStudyCreatorCta,
                eyebrow: e.target.value,
              })
            }
          />
        </Field>
        <Field label="Headline" id="cscc-headline">
          <TextInput
            id="cscc-headline"
            value={sections.caseStudyCreatorCta.headline}
            onChange={(e) =>
              setCaseStudyCreatorCta({
                ...sections.caseStudyCreatorCta,
                headline: e.target.value,
              })
            }
          />
        </Field>
        <Field label="Description" id="cscc-description">
          <TextArea
            id="cscc-description"
            rows={3}
            value={sections.caseStudyCreatorCta.description}
            onChange={(e) =>
              setCaseStudyCreatorCta({
                ...sections.caseStudyCreatorCta,
                description: e.target.value,
              })
            }
          />
        </Field>
        <label className="flex items-center gap-2 text-sm text-charcoal">
          <input
            type="checkbox"
            checked={sections.caseStudyCreatorCta.showFacesMarquee}
            onChange={(e) =>
              setCaseStudyCreatorCta({
                ...sections.caseStudyCreatorCta,
                showFacesMarquee: e.target.checked,
              })
            }
            className="size-4 rounded-sm border-charcoal/20"
          />
          Show creator faces marquee
        </label>
        <div className="grid gap-4 md:grid-cols-2">
          <Field label="Stat 1" id="cscc-stat1">
            <TextInput
              id="cscc-stat1"
              value={sections.caseStudyCreatorCta.stat1}
              onChange={(e) =>
                setCaseStudyCreatorCta({
                  ...sections.caseStudyCreatorCta,
                  stat1: e.target.value,
                })
              }
            />
          </Field>
          <Field label="Stat 2" id="cscc-stat2">
            <TextInput
              id="cscc-stat2"
              value={sections.caseStudyCreatorCta.stat2}
              onChange={(e) =>
                setCaseStudyCreatorCta({
                  ...sections.caseStudyCreatorCta,
                  stat2: e.target.value,
                })
              }
            />
          </Field>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <Field label="Primary button label" id="cscc-primary-label">
            <TextInput
              id="cscc-primary-label"
              value={sections.caseStudyCreatorCta.primaryCtaLabel}
              onChange={(e) =>
                setCaseStudyCreatorCta({
                  ...sections.caseStudyCreatorCta,
                  primaryCtaLabel: e.target.value,
                })
              }
            />
          </Field>
          <Field label="Primary button URL" id="cscc-primary-href">
            <TextInput
              id="cscc-primary-href"
              value={sections.caseStudyCreatorCta.primaryCtaHref}
              onChange={(e) =>
                setCaseStudyCreatorCta({
                  ...sections.caseStudyCreatorCta,
                  primaryCtaHref: e.target.value,
                })
              }
            />
          </Field>
          <Field label="Secondary button label" id="cscc-secondary-label">
            <TextInput
              id="cscc-secondary-label"
              value={sections.caseStudyCreatorCta.secondaryCtaLabel}
              onChange={(e) =>
                setCaseStudyCreatorCta({
                  ...sections.caseStudyCreatorCta,
                  secondaryCtaLabel: e.target.value,
                })
              }
            />
          </Field>
          <Field label="Secondary button URL" id="cscc-secondary-href">
            <TextInput
              id="cscc-secondary-href"
              value={sections.caseStudyCreatorCta.secondaryCtaHref}
              onChange={(e) =>
                setCaseStudyCreatorCta({
                  ...sections.caseStudyCreatorCta,
                  secondaryCtaHref: e.target.value,
                })
              }
            />
          </Field>
        </div>
      </section>

      <section className="space-y-4">
        <div>
          <h2 className="font-display text-xl">Footer — intro</h2>
          <p className="mt-1 text-sm text-muted">
            Tagline, company line, and contact email shown under the wordmark.
          </p>
        </div>
        <Field label="Tagline" id="ft-tagline">
          <TextArea
            id="ft-tagline"
            rows={2}
            value={sections.footer.tagline}
            onChange={(e) =>
              setFooter({ ...sections.footer, tagline: e.target.value })
            }
          />
        </Field>
        <Field label="Company line" id="ft-company">
          <TextInput
            id="ft-company"
            value={sections.footer.companyLine}
            onChange={(e) =>
              setFooter({ ...sections.footer, companyLine: e.target.value })
            }
          />
        </Field>
        <Field label="Email" id="ft-email">
          <TextInput
            id="ft-email"
            value={sections.footer.email}
            onChange={(e) =>
              setFooter({ ...sections.footer, email: e.target.value })
            }
          />
        </Field>
        <Field
          label="Copyright (after year)"
          id="ft-copyright"
          hint={`Rendered as “© ${new Date().getFullYear()} …”`}
        >
          <TextInput
            id="ft-copyright"
            value={sections.footer.copyright}
            onChange={(e) =>
              setFooter({ ...sections.footer, copyright: e.target.value })
            }
          />
        </Field>
      </section>

      <section className="space-y-4">
        <div>
          <h2 className="font-display text-xl">Footer — social</h2>
          <p className="mt-1 text-sm text-muted">
            Pick a network for the icon, then set the label and URL. Add or remove freely.
          </p>
        </div>
        {sections.footer.socials.map((social, index) => (
          <div
            key={`social-${index}`}
            className="space-y-3 rounded-sm border border-charcoal/10 p-4"
          >
            <div className="flex items-center justify-between gap-3">
              <p className="text-sm font-medium">Social {index + 1}</p>
              <div className="flex items-center gap-2">
                <MoveButtons
                  index={index}
                  total={sections.footer.socials.length}
                  onMove={moveSocial}
                />
                <button
                  type="button"
                  onClick={() =>
                    setFooter({
                      ...sections.footer,
                      socials: sections.footer.socials.filter((_, i) => i !== index),
                    })
                  }
                  className="text-xs font-medium text-danger hover:underline"
                >
                  Remove
                </button>
              </div>
            </div>
            <div className="grid gap-3 md:grid-cols-3">
              <Field label="Network" id={`social-net-${index}`}>
                <select
                  id={`social-net-${index}`}
                  value={social.network}
                  onChange={(e) => {
                    const network = e.target.value as SocialNetwork;
                    const preset = SOCIAL_NETWORKS.find((n) => n.value === network);
                    updateSocial(index, {
                      ...social,
                      network,
                      label: preset?.label ?? social.label,
                    });
                  }}
                  className="w-full rounded-sm border border-charcoal/15 bg-white px-3 py-2 text-sm"
                >
                  {SOCIAL_NETWORKS.map((n) => (
                    <option key={n.value} value={n.value}>
                      {n.label}
                    </option>
                  ))}
                </select>
              </Field>
              <Field label="Label" id={`social-label-${index}`}>
                <TextInput
                  id={`social-label-${index}`}
                  value={social.label}
                  onChange={(e) =>
                    updateSocial(index, { ...social, label: e.target.value })
                  }
                />
              </Field>
              <Field label="URL" id={`social-href-${index}`}>
                <TextInput
                  id={`social-href-${index}`}
                  value={social.href}
                  onChange={(e) =>
                    updateSocial(index, { ...social, href: e.target.value })
                  }
                />
              </Field>
            </div>
          </div>
        ))}
        <button
          type="button"
          onClick={() =>
            setFooter({
              ...sections.footer,
              socials: [...sections.footer.socials, emptySocialLink()],
            })
          }
          className="text-sm font-medium text-forest hover:text-forest-dark"
        >
          + Add social link
        </button>
      </section>

      <section className="space-y-4">
        <div>
          <h2 className="font-display text-xl">Footer — link columns</h2>
          <p className="mt-1 text-sm text-muted">
            Each column is a list of links. Add or remove columns and links independently
            (titles are for your organization in admin; the live footer shows the links).
          </p>
        </div>
        {sections.footer.columns.map((column, columnIndex) => (
          <div
            key={`col-${columnIndex}`}
            className="space-y-4 rounded-sm border border-charcoal/10 p-4"
          >
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="min-w-[12rem] flex-1">
                <Field
                  label={`Column ${columnIndex + 1} title`}
                  id={`col-title-${columnIndex}`}
                >
                  <TextInput
                    id={`col-title-${columnIndex}`}
                    value={column.title}
                    onChange={(e) =>
                      updateColumn(columnIndex, {
                        ...column,
                        title: e.target.value,
                      })
                    }
                  />
                </Field>
              </div>
              <div className="flex items-center gap-2">
                <MoveButtons
                  index={columnIndex}
                  total={sections.footer.columns.length}
                  onMove={moveColumn}
                />
                <button
                  type="button"
                  onClick={() =>
                    setFooter({
                      ...sections.footer,
                      columns: sections.footer.columns.filter(
                        (_, i) => i !== columnIndex,
                      ),
                    })
                  }
                  className="text-xs font-medium text-danger hover:underline"
                >
                  Remove column
                </button>
              </div>
            </div>
            <NavLinkRows
              idPrefix={`col-${columnIndex}`}
              links={column.links}
              onChange={(links) =>
                updateColumn(columnIndex, { ...column, links })
              }
            />
          </div>
        ))}
        <button
          type="button"
          onClick={() =>
            setFooter({
              ...sections.footer,
              columns: [...sections.footer.columns, emptyFooterColumn()],
            })
          }
          className="text-sm font-medium text-forest hover:text-forest-dark"
        >
          + Add column
        </button>
      </section>

      <section className="space-y-4">
        <div>
          <h2 className="font-display text-xl">Footer — legal links</h2>
          <p className="mt-1 text-sm text-muted">
            Bottom-bar links next to the copyright line.
          </p>
        </div>
        <NavLinkRows
          idPrefix="legal"
          links={sections.footer.legalLinks}
          onChange={(legalLinks) =>
            setFooter({ ...sections.footer, legalLinks })
          }
        />
      </section>
      </>
      ) : null}

      <div
        className={cn(
          "sticky bottom-4 z-10 flex flex-wrap items-center gap-3 rounded-sm border border-charcoal/10 bg-white/95 px-4 py-3 shadow-[0_10px_30px_rgba(28,26,23,0.08)] backdrop-blur",
        )}
      >
        <Button type="submit" variant="primary" disabled={pending}>
          {pending
            ? "Saving…"
            : profileOnly
              ? "Save profile template"
              : "Save header & footer"}
        </Button>
        <a
          href={profileOnly ? "/roster" : "/"}
          target="_blank"
          rel="noreferrer"
          className="text-sm font-medium text-charcoal/60 hover:text-charcoal"
        >
          {profileOnly ? "View roster ↗" : "View site ↗"}
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
