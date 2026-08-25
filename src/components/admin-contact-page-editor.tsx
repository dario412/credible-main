"use client";

import { useState } from "react";

import { MediaField } from "@/components/media-library";
import { Button, Field, TextArea, TextInput } from "@/components/ui";
import {
  emptyContactChannel,
  emptyContactLogo,
  emptyContactSocial,
  emptyContactStep,
  type ContactPageSections,
} from "@/lib/contact-page";
import { TRUSTED_BY_LOGO_HINT } from "@/lib/trusted-by";

export function ContactPageEditorForm({
  initial,
  saveAction,
}: {
  initial: ContactPageSections;
  saveAction: typeof import("@/lib/actions/admin-cms").saveContactPage;
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

  function setBriefedBy(briefedBy: ContactPageSections["briefedBy"]) {
    setSections({ ...sections, briefedBy });
  }

  function setHero(hero: ContactPageSections["hero"]) {
    setSections({ ...sections, hero });
  }

  function setNextSteps(nextSteps: ContactPageSections["nextSteps"]) {
    setSections({ ...sections, nextSteps });
  }

  function setFooter(footer: ContactPageSections["footer"]) {
    setSections({ ...sections, footer });
  }

  return (
    <form onSubmit={onSubmit} className="space-y-10">
      <section className="space-y-4">
        <div>
          <h2 className="font-display text-xl">Page intro</h2>
          <p className="mt-1 text-sm text-muted">
            Headline and supporting line at the top of /contact.
          </p>
        </div>
        <Field
          label="Headline"
          id="ct-hero-headline"
          hint="First line, before the accent."
        >
          <TextInput
            id="ct-hero-headline"
            value={sections.hero.headline}
            onChange={(e) =>
              setHero({ ...sections.hero, headline: e.target.value })
            }
          />
        </Field>
        <Field
          label="Headline accent"
          id="ct-hero-headline-accent"
          hint="Shown in forest green."
        >
          <TextInput
            id="ct-hero-headline-accent"
            value={sections.hero.headlineAccent}
            onChange={(e) =>
              setHero({ ...sections.hero, headlineAccent: e.target.value })
            }
          />
        </Field>
        <Field label="Supporting line" id="ct-hero-subhead">
          <TextArea
            id="ct-hero-subhead"
            rows={3}
            value={sections.hero.subhead}
            onChange={(e) =>
              setHero({ ...sections.hero, subhead: e.target.value })
            }
          />
        </Field>
      </section>

      <section className="space-y-4">
        <div>
          <h2 className="font-display text-xl">Briefed-by logos</h2>
          <p className="mt-1 text-sm text-muted">
            Charcoal card in the contact sidebar. Optional URL turns a logo into
            a link.
          </p>
        </div>
        <Field label="Label" id="ct-briefed-label">
          <TextInput
            id="ct-briefed-label"
            value={sections.briefedBy.label}
            onChange={(e) =>
              setBriefedBy({ ...sections.briefedBy, label: e.target.value })
            }
          />
        </Field>
        {sections.briefedBy.logos.map((logo, index) => (
          <div
            key={`ct-logo-${index}`}
            className="space-y-3 rounded-sm border border-charcoal/10 p-4"
          >
            <div className="flex items-center justify-between gap-3">
              <p className="text-sm font-medium">Logo {index + 1}</p>
              <button
                type="button"
                onClick={() =>
                  setBriefedBy({
                    ...sections.briefedBy,
                    logos: sections.briefedBy.logos.filter((_, i) => i !== index),
                  })
                }
                className="text-xs font-medium text-danger hover:underline"
              >
                Remove
              </button>
            </div>
            <Field label="Name" id={`ct-logo-name-${index}`}>
              <TextInput
                id={`ct-logo-name-${index}`}
                value={logo.name}
                onChange={(e) => {
                  const logos = sections.briefedBy.logos.map((row, i) =>
                    i === index ? { ...row, name: e.target.value } : row,
                  );
                  setBriefedBy({ ...sections.briefedBy, logos });
                }}
              />
            </Field>
            <MediaField
              label="Logo image"
              hint={TRUSTED_BY_LOGO_HINT}
              value={logo.src}
              onChange={(src) => {
                const logos = sections.briefedBy.logos.map((row, i) =>
                  i === index ? { ...row, src } : row,
                );
                setBriefedBy({ ...sections.briefedBy, logos });
              }}
            />
            <Field label="Link URL (optional)" id={`ct-logo-href-${index}`}>
              <TextInput
                id={`ct-logo-href-${index}`}
                value={logo.href}
                onChange={(e) => {
                  const logos = sections.briefedBy.logos.map((row, i) =>
                    i === index ? { ...row, href: e.target.value } : row,
                  );
                  setBriefedBy({ ...sections.briefedBy, logos });
                }}
                placeholder="https://…"
              />
            </Field>
          </div>
        ))}
        <button
          type="button"
          onClick={() =>
            setBriefedBy({
              ...sections.briefedBy,
              logos: [...sections.briefedBy.logos, emptyContactLogo()],
            })
          }
          className="text-sm font-medium text-forest hover:text-forest-dark"
        >
          + Add logo
        </button>
      </section>

      <section className="space-y-4">
        <div>
          <h2 className="font-display text-xl">What happens next</h2>
          <p className="mt-1 text-sm text-muted">
            Step list and footer links under the logos card.
          </p>
        </div>
        <Field label="Eyebrow" id="ct-steps-eyebrow">
          <TextInput
            id="ct-steps-eyebrow"
            value={sections.nextSteps.eyebrow}
            onChange={(e) =>
              setNextSteps({ ...sections.nextSteps, eyebrow: e.target.value })
            }
          />
        </Field>
        {sections.nextSteps.steps.map((step, index) => (
          <div
            key={`ct-step-${index}`}
            className="space-y-3 rounded-sm border border-charcoal/10 p-4"
          >
            <div className="flex items-center justify-between gap-3">
              <p className="text-sm font-medium">Step {index + 1}</p>
              <button
                type="button"
                onClick={() =>
                  setNextSteps({
                    ...sections.nextSteps,
                    steps: sections.nextSteps.steps.filter((_, i) => i !== index),
                  })
                }
                className="text-xs font-medium text-danger hover:underline"
              >
                Remove
              </button>
            </div>
            <Field label="Title" id={`ct-step-title-${index}`}>
              <TextInput
                id={`ct-step-title-${index}`}
                value={step.title}
                onChange={(e) => {
                  const steps = sections.nextSteps.steps.map((row, i) =>
                    i === index ? { ...row, title: e.target.value } : row,
                  );
                  setNextSteps({ ...sections.nextSteps, steps });
                }}
              />
            </Field>
            <Field label="Body" id={`ct-step-body-${index}`}>
              <TextArea
                id={`ct-step-body-${index}`}
                rows={2}
                value={step.body}
                onChange={(e) => {
                  const steps = sections.nextSteps.steps.map((row, i) =>
                    i === index ? { ...row, body: e.target.value } : row,
                  );
                  setNextSteps({ ...sections.nextSteps, steps });
                }}
              />
            </Field>
          </div>
        ))}
        <button
          type="button"
          onClick={() =>
            setNextSteps({
              ...sections.nextSteps,
              steps: [...sections.nextSteps.steps, emptyContactStep()],
            })
          }
          className="text-sm font-medium text-forest hover:text-forest-dark"
        >
          + Add step
        </button>

        <Field label="Footnote lead-in" id="ct-footnote">
          <TextInput
            id="ct-footnote"
            value={sections.nextSteps.footnote}
            onChange={(e) =>
              setNextSteps({ ...sections.nextSteps, footnote: e.target.value })
            }
            placeholder="Rather browse first?"
          />
        </Field>
        <div className="grid gap-4 md:grid-cols-2">
          <Field label="Browse link label" id="ct-browse-label">
            <TextInput
              id="ct-browse-label"
              value={sections.nextSteps.browseLabel}
              onChange={(e) =>
                setNextSteps({
                  ...sections.nextSteps,
                  browseLabel: e.target.value,
                })
              }
            />
          </Field>
          <Field label="Browse link URL" id="ct-browse-href">
            <TextInput
              id="ct-browse-href"
              value={sections.nextSteps.browseHref}
              onChange={(e) =>
                setNextSteps({
                  ...sections.nextSteps,
                  browseHref: e.target.value,
                })
              }
            />
          </Field>
          <Field label="Email link label" id="ct-email-label">
            <TextInput
              id="ct-email-label"
              value={sections.nextSteps.emailLabel}
              onChange={(e) =>
                setNextSteps({
                  ...sections.nextSteps,
                  emailLabel: e.target.value,
                })
              }
            />
          </Field>
          <Field label="Email address" id="ct-email">
            <TextInput
              id="ct-email"
              value={sections.nextSteps.email}
              onChange={(e) =>
                setNextSteps({ ...sections.nextSteps, email: e.target.value })
              }
            />
          </Field>
        </div>
      </section>

      <section className="space-y-4">
        <div>
          <h2 className="font-display text-xl">Email channels</h2>
          <p className="mt-1 text-sm text-muted">
            Three mailto cards below the form on /contact.
          </p>
        </div>
        {sections.footer.channels.map((channel, index) => (
          <div
            key={`ct-channel-${index}`}
            className="space-y-3 rounded-sm border border-charcoal/10 p-4"
          >
            <div className="flex items-center justify-between gap-3">
              <p className="text-sm font-medium">Channel {index + 1}</p>
              <button
                type="button"
                onClick={() =>
                  setFooter({
                    ...sections.footer,
                    channels: sections.footer.channels.filter(
                      (_, i) => i !== index,
                    ),
                  })
                }
                className="text-xs font-medium text-danger hover:underline"
              >
                Remove
              </button>
            </div>
            <Field label="Label" id={`ct-channel-label-${index}`}>
              <TextInput
                id={`ct-channel-label-${index}`}
                value={channel.label}
                onChange={(e) => {
                  const channels = sections.footer.channels.map((row, i) =>
                    i === index ? { ...row, label: e.target.value } : row,
                  );
                  setFooter({ ...sections.footer, channels });
                }}
              />
            </Field>
            <Field label="Email address" id={`ct-channel-address-${index}`}>
              <TextInput
                id={`ct-channel-address-${index}`}
                value={channel.address}
                onChange={(e) => {
                  const channels = sections.footer.channels.map((row, i) =>
                    i === index ? { ...row, address: e.target.value } : row,
                  );
                  setFooter({ ...sections.footer, channels });
                }}
              />
            </Field>
            <Field label="Description" id={`ct-channel-body-${index}`}>
              <TextArea
                id={`ct-channel-body-${index}`}
                rows={2}
                value={channel.body}
                onChange={(e) => {
                  const channels = sections.footer.channels.map((row, i) =>
                    i === index ? { ...row, body: e.target.value } : row,
                  );
                  setFooter({ ...sections.footer, channels });
                }}
              />
            </Field>
          </div>
        ))}
        <button
          type="button"
          onClick={() =>
            setFooter({
              ...sections.footer,
              channels: [...sections.footer.channels, emptyContactChannel()],
            })
          }
          className="text-sm font-medium text-forest hover:text-forest-dark"
        >
          + Add channel
        </button>
      </section>

      <section className="space-y-4">
        <div>
          <h2 className="font-display text-xl">London office</h2>
        </div>
        <Field label="Eyebrow" id="ct-office-eyebrow">
          <TextInput
            id="ct-office-eyebrow"
            value={sections.footer.office.eyebrow}
            onChange={(e) =>
              setFooter({
                ...sections.footer,
                office: { ...sections.footer.office, eyebrow: e.target.value },
              })
            }
          />
        </Field>
        <Field label="Title" id="ct-office-title">
          <TextInput
            id="ct-office-title"
            value={sections.footer.office.title}
            onChange={(e) =>
              setFooter({
                ...sections.footer,
                office: { ...sections.footer.office, title: e.target.value },
              })
            }
          />
        </Field>
        <Field label="Address" id="ct-office-body">
          <TextArea
            id="ct-office-body"
            rows={2}
            value={sections.footer.office.body}
            onChange={(e) =>
              setFooter({
                ...sections.footer,
                office: { ...sections.footer.office, body: e.target.value },
              })
            }
          />
        </Field>
      </section>

      <section className="space-y-4">
        <div>
          <h2 className="font-display text-xl">By phone</h2>
        </div>
        <Field label="Eyebrow" id="ct-phone-eyebrow">
          <TextInput
            id="ct-phone-eyebrow"
            value={sections.footer.phone.eyebrow}
            onChange={(e) =>
              setFooter({
                ...sections.footer,
                phone: { ...sections.footer.phone, eyebrow: e.target.value },
              })
            }
          />
        </Field>
        <Field label="Display number" id="ct-phone-number">
          <TextInput
            id="ct-phone-number"
            value={sections.footer.phone.number}
            onChange={(e) =>
              setFooter({
                ...sections.footer,
                phone: { ...sections.footer.phone, number: e.target.value },
              })
            }
          />
        </Field>
        <Field
          label="Tel link"
          id="ct-phone-tel"
          hint="Digits only, e.g. +442079460018"
        >
          <TextInput
            id="ct-phone-tel"
            value={sections.footer.phone.tel}
            onChange={(e) =>
              setFooter({
                ...sections.footer,
                phone: { ...sections.footer.phone, tel: e.target.value },
              })
            }
          />
        </Field>
        <Field label="Hours / note" id="ct-phone-body">
          <TextArea
            id="ct-phone-body"
            rows={2}
            value={sections.footer.phone.body}
            onChange={(e) =>
              setFooter({
                ...sections.footer,
                phone: { ...sections.footer.phone, body: e.target.value },
              })
            }
          />
        </Field>
      </section>

      <section className="space-y-4">
        <div>
          <h2 className="font-display text-xl">Follow along</h2>
        </div>
        <Field label="Eyebrow" id="ct-socials-eyebrow">
          <TextInput
            id="ct-socials-eyebrow"
            value={sections.footer.socials.eyebrow}
            onChange={(e) =>
              setFooter({
                ...sections.footer,
                socials: {
                  ...sections.footer.socials,
                  eyebrow: e.target.value,
                },
              })
            }
          />
        </Field>
        {sections.footer.socials.items.map((social, index) => (
          <div
            key={`ct-social-${index}`}
            className="space-y-3 rounded-sm border border-charcoal/10 p-4"
          >
            <div className="flex items-center justify-between gap-3">
              <p className="text-sm font-medium">Link {index + 1}</p>
              <button
                type="button"
                onClick={() =>
                  setFooter({
                    ...sections.footer,
                    socials: {
                      ...sections.footer.socials,
                      items: sections.footer.socials.items.filter(
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
            <Field label="Network" id={`ct-social-label-${index}`}>
              <TextInput
                id={`ct-social-label-${index}`}
                value={social.label}
                onChange={(e) => {
                  const items = sections.footer.socials.items.map((row, i) =>
                    i === index ? { ...row, label: e.target.value } : row,
                  );
                  setFooter({
                    ...sections.footer,
                    socials: { ...sections.footer.socials, items },
                  });
                }}
              />
            </Field>
            <Field label="Handle" id={`ct-social-handle-${index}`}>
              <TextInput
                id={`ct-social-handle-${index}`}
                value={social.handle}
                onChange={(e) => {
                  const items = sections.footer.socials.items.map((row, i) =>
                    i === index ? { ...row, handle: e.target.value } : row,
                  );
                  setFooter({
                    ...sections.footer,
                    socials: { ...sections.footer.socials, items },
                  });
                }}
              />
            </Field>
            <Field label="URL" id={`ct-social-href-${index}`}>
              <TextInput
                id={`ct-social-href-${index}`}
                value={social.href}
                onChange={(e) => {
                  const items = sections.footer.socials.items.map((row, i) =>
                    i === index ? { ...row, href: e.target.value } : row,
                  );
                  setFooter({
                    ...sections.footer,
                    socials: { ...sections.footer.socials, items },
                  });
                }}
                placeholder="https://…"
              />
            </Field>
          </div>
        ))}
        <button
          type="button"
          onClick={() =>
            setFooter({
              ...sections.footer,
              socials: {
                ...sections.footer.socials,
                items: [...sections.footer.socials.items, emptyContactSocial()],
              },
            })
          }
          className="text-sm font-medium text-forest hover:text-forest-dark"
        >
          + Add link
        </button>
      </section>

      <div className="flex flex-wrap items-center gap-3 border-t border-charcoal/10 pt-6">
        <Button type="submit" disabled={pending}>
          {pending ? "Saving…" : "Save contact page"}
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
