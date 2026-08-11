"use client";

import { useEffect, useId, useRef, useState } from "react";
import { useRouter } from "next/navigation";

import { useSiteChrome } from "@/components/site-chrome-context";
import { Button, Field, TextArea, TextInput } from "@/components/ui";
import type {
  ProfileFormatKind,
  ProfileRailNavLabels,
  SiteChromeSections,
} from "@/lib/site-chrome";
import { PROFILE_FORMAT_KINDS } from "@/lib/site-chrome";

type ProfileEditTarget =
  | "profileRail.availabilityLabel"
  | "profileRail.badges"
  | "profileRail.focusLabel"
  | `profileRail.nav.${keyof ProfileRailNavLabels}`
  | "profileRail.workWith"
  | "profileRail.primaryCta"
  | "profileRail.shortlist"
  | "profileRail.footnote"
  | "profileCta.headline"
  | "profileCta.description"
  | "profileCta.primaryCta"
  | "profileCta.secondaryCta"
  | "profileCta.similar"
  | `profileFormats.${ProfileFormatKind}`;

const NAV_LABEL_HINTS: Record<keyof ProfileRailNavLabels, string> = {
  overview: "Overview",
  channels: "Channels",
  topics: "Topics & audience",
  formats: "Formats",
  work: "Recent work",
};

const FORMAT_LABEL_HINTS = Object.fromEntries(
  PROFILE_FORMAT_KINDS.map((item) => [item.key, item.hint]),
) as Record<ProfileFormatKind, string>;

function targetTitle(target: ProfileEditTarget): string {
  const map: Partial<Record<ProfileEditTarget, string>> = {
    "profileRail.availabilityLabel": "Availability label",
    "profileRail.badges": "Signed / Open badges",
    "profileRail.focusLabel": "Focus label",
    "profileRail.workWith": "Work-with block",
    "profileRail.primaryCta": "Get Rates button",
    "profileRail.shortlist": "Shortlist buttons",
    "profileRail.footnote": "Rail footnote",
    "profileCta.headline": "Footer CTA headline",
    "profileCta.description": "Footer CTA description",
    "profileCta.primaryCta": "Footer primary button",
    "profileCta.secondaryCta": "Footer secondary button",
    "profileCta.similar": "Similar creators strip",
  };
  if (target.startsWith("profileRail.nav.")) {
    const key = target.split(".")[2] as keyof ProfileRailNavLabels;
    return `Nav: ${NAV_LABEL_HINTS[key] ?? key}`;
  }
  if (target.startsWith("profileFormats.")) {
    const key = target.split(".")[1] as ProfileFormatKind;
    return `Format: ${FORMAT_LABEL_HINTS[key] ?? key}`;
  }
  return map[target] ?? "Edit";
}

function profileSnapshot(chrome: SiteChromeSections) {
  return {
    profileRail: chrome.profileRail,
    profileCta: chrome.profileCta,
    profileFormats: chrome.profileFormats,
  };
}

function EditorPopover({
  target,
  chrome,
  onChange,
  onClose,
}: {
  target: ProfileEditTarget;
  chrome: SiteChromeSections;
  onChange: (next: SiteChromeSections) => void;
  onClose: () => void;
}) {
  const titleId = useId();
  const panelRef = useRef<HTMLDivElement>(null);
  const rail = chrome.profileRail;
  const cta = chrome.profileCta;
  const formats = chrome.profileFormats;

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

  function setRail(profileRail: SiteChromeSections["profileRail"]) {
    onChange({ ...chrome, profileRail });
  }

  function setCta(profileCta: SiteChromeSections["profileCta"]) {
    onChange({ ...chrome, profileCta });
  }

  function setFormats(profileFormats: SiteChromeSections["profileFormats"]) {
    onChange({ ...chrome, profileFormats });
  }

  const navMatch = target.match(
    /^profileRail\.nav\.(overview|channels|topics|formats|work)$/,
  );
  const navKey = navMatch?.[1] as keyof ProfileRailNavLabels | undefined;

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
        {target === "profileRail.availabilityLabel" ? (
          <Field label="Label" id="pr-availability">
            <TextInput
              id="pr-availability"
              value={rail.availabilityLabel}
              onChange={(e) =>
                setRail({ ...rail, availabilityLabel: e.target.value })
              }
            />
          </Field>
        ) : null}

        {target === "profileRail.badges" ? (
          <div className="grid gap-4">
            <Field label="Signed badge" id="pr-signed">
              <TextInput
                id="pr-signed"
                value={rail.signedBadgeLabel}
                onChange={(e) =>
                  setRail({ ...rail, signedBadgeLabel: e.target.value })
                }
              />
            </Field>
            <Field label="Open badge" id="pr-open">
              <TextInput
                id="pr-open"
                value={rail.openBadgeLabel}
                onChange={(e) =>
                  setRail({ ...rail, openBadgeLabel: e.target.value })
                }
              />
            </Field>
          </div>
        ) : null}

        {target === "profileRail.focusLabel" ? (
          <Field label="Label" id="pr-focus">
            <TextInput
              id="pr-focus"
              value={rail.focusLabel}
              onChange={(e) =>
                setRail({ ...rail, focusLabel: e.target.value })
              }
            />
          </Field>
        ) : null}

        {navKey ? (
          <Field label="Nav label" id={`pr-nav-${navKey}`}>
            <TextInput
              id={`pr-nav-${navKey}`}
              value={rail.nav[navKey]}
              onChange={(e) =>
                setRail({
                  ...rail,
                  nav: { ...rail.nav, [navKey]: e.target.value },
                })
              }
            />
          </Field>
        ) : null}

        {target === "profileRail.workWith" ? (
          <>
            <Field label="Title ({first}, {name})" id="pr-work-title">
              <TextInput
                id="pr-work-title"
                value={rail.workWithTitle}
                onChange={(e) =>
                  setRail({ ...rail, workWithTitle: e.target.value })
                }
              />
            </Field>
            <Field label="Description ({first}, {name})" id="pr-work-desc">
              <TextArea
                id="pr-work-desc"
                rows={2}
                value={rail.workWithDescription}
                onChange={(e) =>
                  setRail({ ...rail, workWithDescription: e.target.value })
                }
              />
            </Field>
          </>
        ) : null}

        {target === "profileRail.primaryCta" ? (
          <Field label="Button label" id="pr-primary-cta">
            <TextInput
              id="pr-primary-cta"
              value={rail.primaryCtaLabel}
              onChange={(e) =>
                setRail({ ...rail, primaryCtaLabel: e.target.value })
              }
            />
          </Field>
        ) : null}

        {target === "profileRail.shortlist" ? (
          <div className="grid gap-4">
            <Field label="Shortlist button" id="pr-shortlist">
              <TextInput
                id="pr-shortlist"
                value={rail.shortlistLabel}
                onChange={(e) =>
                  setRail({ ...rail, shortlistLabel: e.target.value })
                }
              />
            </Field>
            <Field label="Shortlisted button" id="pr-shortlisted">
              <TextInput
                id="pr-shortlisted"
                value={rail.shortlistedLabel}
                onChange={(e) =>
                  setRail({ ...rail, shortlistedLabel: e.target.value })
                }
              />
            </Field>
          </div>
        ) : null}

        {target === "profileRail.footnote" ? (
          <Field label="Footnote" id="pr-footnote">
            <TextInput
              id="pr-footnote"
              value={rail.footnote}
              onChange={(e) =>
                setRail({ ...rail, footnote: e.target.value })
              }
            />
          </Field>
        ) : null}

        {target === "profileCta.headline" ? (
          <Field label="Headline ({first}, {name})" id="pc-headline">
            <TextInput
              id="pc-headline"
              value={cta.headline}
              onChange={(e) =>
                setCta({ ...cta, headline: e.target.value })
              }
            />
          </Field>
        ) : null}

        {target === "profileCta.description" ? (
          <Field label="Description ({first}, {name})" id="pc-description">
            <TextArea
              id="pc-description"
              rows={3}
              value={cta.description}
              onChange={(e) =>
                setCta({ ...cta, description: e.target.value })
              }
            />
          </Field>
        ) : null}

        {target === "profileCta.primaryCta" ? (
          <>
            <Field label="Button label" id="pc-primary-label">
              <TextInput
                id="pc-primary-label"
                value={cta.primaryCtaLabel}
                onChange={(e) =>
                  setCta({ ...cta, primaryCtaLabel: e.target.value })
                }
              />
            </Field>
            <Field label="Link ({slug})" id="pc-primary-href">
              <TextInput
                id="pc-primary-href"
                value={cta.primaryCtaHref}
                onChange={(e) =>
                  setCta({ ...cta, primaryCtaHref: e.target.value })
                }
              />
            </Field>
          </>
        ) : null}

        {target === "profileCta.secondaryCta" ? (
          <>
            <Field label="Button label" id="pc-secondary-label">
              <TextInput
                id="pc-secondary-label"
                value={cta.secondaryCtaLabel}
                onChange={(e) =>
                  setCta({ ...cta, secondaryCtaLabel: e.target.value })
                }
              />
            </Field>
            <Field label="Link" id="pc-secondary-href">
              <TextInput
                id="pc-secondary-href"
                value={cta.secondaryCtaHref}
                onChange={(e) =>
                  setCta({ ...cta, secondaryCtaHref: e.target.value })
                }
              />
            </Field>
          </>
        ) : null}

        {target === "profileCta.similar" ? (
          <>
            <Field label="Headline" id="pc-similar-headline">
              <TextInput
                id="pc-similar-headline"
                value={cta.similarHeadline}
                onChange={(e) =>
                  setCta({ ...cta, similarHeadline: e.target.value })
                }
              />
            </Field>
            <Field label="Link label" id="pc-similar-link-label">
              <TextInput
                id="pc-similar-link-label"
                value={cta.similarLinkLabel}
                onChange={(e) =>
                  setCta({ ...cta, similarLinkLabel: e.target.value })
                }
              />
            </Field>
            <Field label="Link URL" id="pc-similar-link-href">
              <TextInput
                id="pc-similar-link-href"
                value={cta.similarLinkHref}
                onChange={(e) =>
                  setCta({ ...cta, similarLinkHref: e.target.value })
                }
              />
            </Field>
          </>
        ) : null}

        {PROFILE_FORMAT_KINDS.map(({ key }) =>
          target === `profileFormats.${key}` ? (
            <div key={key} className="space-y-4">
              <Field label="Title" id={`pf-title-${key}`}>
                <TextInput
                  id={`pf-title-${key}`}
                  value={formats[key].title}
                  onChange={(e) =>
                    setFormats({
                      ...formats,
                      [key]: { ...formats[key], title: e.target.value },
                    })
                  }
                />
              </Field>
              <Field
                label="Description ({first}, {name})"
                id={`pf-desc-${key}`}
              >
                <TextArea
                  id={`pf-desc-${key}`}
                  rows={4}
                  value={formats[key].description}
                  onChange={(e) =>
                    setFormats({
                      ...formats,
                      [key]: {
                        ...formats[key],
                        description: e.target.value,
                      },
                    })
                  }
                />
              </Field>
            </div>
          ) : null,
        )}
      </div>
    </div>
  );
}

export function ProfileVisualEditor({
  initialChrome,
  canEdit,
  saveAction,
}: {
  initialChrome: SiteChromeSections;
  canEdit: boolean;
  saveAction: typeof import("@/lib/actions/admin-cms").saveSiteChrome;
}) {
  const router = useRouter();
  const {
    chrome,
    setChrome,
    setCanEdit,
    setEditing: setCmsEditing,
    setSelected,
    selected,
  } = useSiteChrome();
  const [editing, setEditing] = useState(false);
  const [baseline, setBaseline] = useState(() => profileSnapshot(initialChrome));
  const [pending, setPending] = useState(false);
  const [message, setMessage] = useState("");
  const [ok, setOk] = useState(false);

  const snapshot = profileSnapshot(chrome);
  const dirty = JSON.stringify(snapshot) !== JSON.stringify(baseline);
  const target = selected as ProfileEditTarget | null;

  useEffect(() => {
    setCanEdit(canEdit);
  }, [canEdit, setCanEdit]);

  useEffect(() => {
    setCmsEditing(editing);
    if (!editing) setSelected(null);
  }, [editing, setCmsEditing, setSelected]);

  async function save() {
    setPending(true);
    const result = await saveAction(chrome);
    setOk(result.ok);
    setMessage(result.ok ? "Profile template saved." : result.message);
    setPending(false);
    if (result.ok) {
      setBaseline(profileSnapshot(chrome));
      router.refresh();
    }
  }

  function discard() {
    setChrome({
      ...chrome,
      profileRail: baseline.profileRail,
      profileCta: baseline.profileCta,
      profileFormats: baseline.profileFormats,
    });
    setSelected(null);
    setMessage("");
  }

  if (!canEdit) return null;

  return (
    <>
      <div className="fixed bottom-4 left-1/2 z-50 flex -translate-x-1/2 flex-wrap items-center justify-center gap-2 rounded-sm border border-charcoal/10 bg-white/95 px-3 py-2 shadow-[0_12px_40px_rgba(28,26,23,0.14)] backdrop-blur">
        <Button
          type="button"
          variant={editing ? "secondary" : "primary"}
          className="px-4! py-2! text-xs"
          onClick={() => {
            setEditing((v) => !v);
            setSelected(null);
            setMessage("");
          }}
        >
          {editing ? "Done editing" : "Edit profile template"}
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
              href="/admin/pages/site"
              className="px-2 text-xs font-medium text-charcoal/55 hover:text-charcoal"
            >
              Admin form
            </a>
            <a
              href="/admin/roster"
              className="px-2 text-xs font-medium text-charcoal/55 hover:text-charcoal"
            >
              Roster data
            </a>
          </>
        ) : null}
        {message ? (
          <p className={`text-xs ${ok ? "text-success" : "text-danger"}`}>
            {message}
          </p>
        ) : null}
      </div>

      {editing && target ? (
        <EditorPopover
          target={target}
          chrome={chrome}
          onChange={setChrome}
          onClose={() => setSelected(null)}
        />
      ) : null}
    </>
  );
}
