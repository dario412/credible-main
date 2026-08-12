"use client";

import { useEffect, useId, useRef, useState } from "react";
import { useRouter } from "next/navigation";

import { InsightsPromo, type InsightsPromoEditTarget } from "@/components/insights-promo";
import { useSiteChrome } from "@/components/site-chrome-context";
import { Button, Field, TextArea, TextInput } from "@/components/ui";
import type { SiteChromeSections } from "@/lib/site-chrome";

function insightsPromoSnapshot(chrome: SiteChromeSections) {
  return chrome.insightsPromo;
}

function EditorPopover({
  target,
  chrome,
  onChange,
  onClose,
}: {
  target: InsightsPromoEditTarget;
  chrome: SiteChromeSections;
  onChange: (next: SiteChromeSections) => void;
  onClose: () => void;
}) {
  const titleId = useId();
  const panelRef = useRef<HTMLDivElement>(null);
  const promo = chrome.insightsPromo;

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

  function setInsightsPromo(
    insightsPromo: SiteChromeSections["insightsPromo"],
  ) {
    onChange({ ...chrome, insightsPromo });
  }

  return (
    <div
      ref={panelRef}
      role="dialog"
      aria-labelledby={titleId}
      className="fixed top-20 right-4 z-50 w-[min(100vw-2rem,22rem)] rounded-sm border border-charcoal/10 bg-white p-4 shadow-[0_18px_50px_rgba(28,26,23,0.16)]"
    >
      <div className="mb-3 flex items-center justify-between gap-3">
        <h2 id={titleId} className="font-display text-lg text-charcoal">
          {target === "newsletter" ? "Newsletter card" : "Roster card"}
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
        {target === "newsletter" ? (
          <>
            <Field label="Eyebrow" id="ve-ip-nl-eyebrow">
              <TextInput
                id="ve-ip-nl-eyebrow"
                value={promo.newsletter.eyebrow}
                onChange={(e) =>
                  setInsightsPromo({
                    ...promo,
                    newsletter: {
                      ...promo.newsletter,
                      eyebrow: e.target.value,
                    },
                  })
                }
              />
            </Field>
            <Field label="Headline" id="ve-ip-nl-headline">
              <TextInput
                id="ve-ip-nl-headline"
                value={promo.newsletter.headline}
                onChange={(e) =>
                  setInsightsPromo({
                    ...promo,
                    newsletter: {
                      ...promo.newsletter,
                      headline: e.target.value,
                    },
                  })
                }
              />
            </Field>
            <Field label="Description" id="ve-ip-nl-desc">
              <TextArea
                id="ve-ip-nl-desc"
                rows={3}
                value={promo.newsletter.description}
                onChange={(e) =>
                  setInsightsPromo({
                    ...promo,
                    newsletter: {
                      ...promo.newsletter,
                      description: e.target.value,
                    },
                  })
                }
              />
            </Field>
            <Field label="Email placeholder" id="ve-ip-nl-placeholder">
              <TextInput
                id="ve-ip-nl-placeholder"
                value={promo.newsletter.emailPlaceholder}
                onChange={(e) =>
                  setInsightsPromo({
                    ...promo,
                    newsletter: {
                      ...promo.newsletter,
                      emailPlaceholder: e.target.value,
                    },
                  })
                }
              />
            </Field>
            <Field label="Button label" id="ve-ip-nl-button">
              <TextInput
                id="ve-ip-nl-button"
                value={promo.newsletter.buttonLabel}
                onChange={(e) =>
                  setInsightsPromo({
                    ...promo,
                    newsletter: {
                      ...promo.newsletter,
                      buttonLabel: e.target.value,
                    },
                  })
                }
              />
            </Field>
          </>
        ) : null}

        {target === "roster" ? (
          <>
            <Field label="Eyebrow" id="ve-ip-roster-eyebrow">
              <TextInput
                id="ve-ip-roster-eyebrow"
                value={promo.roster.eyebrow}
                onChange={(e) =>
                  setInsightsPromo({
                    ...promo,
                    roster: { ...promo.roster, eyebrow: e.target.value },
                  })
                }
              />
            </Field>
            <Field label="Headline" id="ve-ip-roster-headline">
              <TextInput
                id="ve-ip-roster-headline"
                value={promo.roster.headline}
                onChange={(e) =>
                  setInsightsPromo({
                    ...promo,
                    roster: { ...promo.roster, headline: e.target.value },
                  })
                }
              />
            </Field>
            <Field label="Description" id="ve-ip-roster-desc">
              <TextArea
                id="ve-ip-roster-desc"
                rows={3}
                value={promo.roster.description}
                onChange={(e) =>
                  setInsightsPromo({
                    ...promo,
                    roster: { ...promo.roster, description: e.target.value },
                  })
                }
              />
            </Field>
            <Field label="Button label" id="ve-ip-roster-cta">
              <TextInput
                id="ve-ip-roster-cta"
                value={promo.roster.ctaLabel}
                onChange={(e) =>
                  setInsightsPromo({
                    ...promo,
                    roster: { ...promo.roster, ctaLabel: e.target.value },
                  })
                }
              />
            </Field>
            <Field label="Button URL" id="ve-ip-roster-href">
              <TextInput
                id="ve-ip-roster-href"
                value={promo.roster.ctaHref}
                onChange={(e) =>
                  setInsightsPromo({
                    ...promo,
                    roster: { ...promo.roster, ctaHref: e.target.value },
                  })
                }
              />
            </Field>
          </>
        ) : null}
      </div>
    </div>
  );
}

export function InsightsVisualEditor({
  canEdit,
  saveAction,
}: {
  canEdit: boolean;
  saveAction: typeof import("@/lib/actions/admin-cms").saveSiteChrome;
}) {
  const router = useRouter();
  const { chrome, setChrome } = useSiteChrome();
  const [editing, setEditing] = useState(false);
  const [baseline, setBaseline] = useState(() =>
    insightsPromoSnapshot(chrome),
  );
  const [target, setTarget] = useState<InsightsPromoEditTarget | null>(null);
  const [pending, setPending] = useState(false);
  const [message, setMessage] = useState("");
  const [ok, setOk] = useState(false);

  const dirty =
    JSON.stringify(insightsPromoSnapshot(chrome)) !== JSON.stringify(baseline);

  async function save() {
    setPending(true);
    const result = await saveAction(chrome);
    setOk(result.ok);
    setMessage(result.ok ? "Insights promos saved." : result.message);
    setPending(false);
    if (result.ok) {
      setBaseline(insightsPromoSnapshot(chrome));
      router.refresh();
    }
  }

  function discard() {
    setChrome({
      ...chrome,
      insightsPromo: baseline,
    });
    setTarget(null);
    setMessage("");
  }

  return (
    <>
      <InsightsPromo
        editing={editing && canEdit}
        selected={target}
        onSelect={setTarget}
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
              <a
                href="/admin/pages/site"
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

      {editing && canEdit && target ? (
        <EditorPopover
          target={target}
          chrome={chrome}
          onChange={setChrome}
          onClose={() => setTarget(null)}
        />
      ) : null}
    </>
  );
}
