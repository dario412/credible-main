"use client";

import {
  createContext,
  useContext,
  useEffect,
  useId,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { useRouter } from "next/navigation";

import { useSiteChrome } from "@/components/site-chrome-context";
import { Button, Field, TextArea, TextInput } from "@/components/ui";
import type { SiteChromeSections } from "@/lib/site-chrome";

export type CaseStudyArticleEditTarget = "sidebarCta" | "creatorCta";

type CaseStudyArticleEditContextValue = {
  editing: boolean;
  target: CaseStudyArticleEditTarget | null;
  onSelect: (target: CaseStudyArticleEditTarget) => void;
};

const CaseStudyArticleEditContext =
  createContext<CaseStudyArticleEditContextValue | null>(null);

export function useCaseStudyArticleEdit() {
  return useContext(CaseStudyArticleEditContext);
}

function caseStudyArticleSnapshot(chrome: SiteChromeSections) {
  return {
    articleSidebarCta: chrome.articleSidebarCta,
    caseStudyCreatorCta: chrome.caseStudyCreatorCta,
  };
}

function useEditorPopover(onClose: () => void) {
  const panelRef = useRef<HTMLDivElement>(null);

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

  return panelRef;
}

function SidebarCtaPopover({
  chrome,
  onChange,
  onClose,
}: {
  chrome: SiteChromeSections;
  onChange: (next: SiteChromeSections) => void;
  onClose: () => void;
}) {
  const titleId = useId();
  const panelRef = useEditorPopover(onClose);
  const cta = chrome.articleSidebarCta;

  function setArticleSidebarCta(
    articleSidebarCta: SiteChromeSections["articleSidebarCta"],
  ) {
    onChange({ ...chrome, articleSidebarCta });
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
          Sidebar CTA
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
        <Field label="Headline" id="ve-cs-asc-headline">
          <TextInput
            id="ve-cs-asc-headline"
            value={cta.headline}
            onChange={(e) =>
              setArticleSidebarCta({ ...cta, headline: e.target.value })
            }
          />
        </Field>
        <Field label="Description" id="ve-cs-asc-description">
          <TextArea
            id="ve-cs-asc-description"
            rows={3}
            value={cta.description}
            onChange={(e) =>
              setArticleSidebarCta({ ...cta, description: e.target.value })
            }
          />
        </Field>
        <Field label="CTA label" id="ve-cs-asc-cta-label">
          <TextInput
            id="ve-cs-asc-cta-label"
            value={cta.ctaLabel}
            onChange={(e) =>
              setArticleSidebarCta({ ...cta, ctaLabel: e.target.value })
            }
          />
        </Field>
        <Field label="CTA URL" id="ve-cs-asc-cta-href">
          <TextInput
            id="ve-cs-asc-cta-href"
            value={cta.ctaHref}
            onChange={(e) =>
              setArticleSidebarCta({ ...cta, ctaHref: e.target.value })
            }
          />
        </Field>
      </div>
    </div>
  );
}

function CreatorCtaPopover({
  chrome,
  onChange,
  onClose,
}: {
  chrome: SiteChromeSections;
  onChange: (next: SiteChromeSections) => void;
  onClose: () => void;
}) {
  const titleId = useId();
  const panelRef = useEditorPopover(onClose);
  const cta = chrome.caseStudyCreatorCta;

  function setCaseStudyCreatorCta(
    caseStudyCreatorCta: SiteChromeSections["caseStudyCreatorCta"],
  ) {
    onChange({ ...chrome, caseStudyCreatorCta });
  }

  return (
    <div
      ref={panelRef}
      role="dialog"
      aria-labelledby={titleId}
      className="fixed top-20 right-4 z-50 w-[min(100vw-2rem,24rem)] rounded-sm border border-charcoal/10 bg-white p-4 shadow-[0_18px_50px_rgba(28,26,23,0.16)]"
    >
      <div className="mb-3 flex items-center justify-between gap-3">
        <h2 id={titleId} className="font-display text-lg text-charcoal">
          Creator CTA
        </h2>
        <button
          type="button"
          onClick={onClose}
          className="text-sm text-charcoal/50 hover:text-charcoal"
        >
          Close
        </button>
      </div>

      <p className="mb-4 text-xs leading-relaxed text-charcoal/50">
        Use {"{first}"}, {"{name}"}, {"{slug}"}, or {"{possessive}"} in copy and
        links.
      </p>

      <div className="max-h-[70vh] space-y-4 overflow-y-auto pr-1">
        <Field label="Eyebrow" id="ve-cs-cc-eyebrow">
          <TextInput
            id="ve-cs-cc-eyebrow"
            value={cta.eyebrow}
            onChange={(e) =>
              setCaseStudyCreatorCta({ ...cta, eyebrow: e.target.value })
            }
          />
        </Field>
        <Field label="Headline" id="ve-cs-cc-headline">
          <TextInput
            id="ve-cs-cc-headline"
            value={cta.headline}
            onChange={(e) =>
              setCaseStudyCreatorCta({ ...cta, headline: e.target.value })
            }
          />
        </Field>
        <Field label="Description" id="ve-cs-cc-description">
          <TextArea
            id="ve-cs-cc-description"
            rows={3}
            value={cta.description}
            onChange={(e) =>
              setCaseStudyCreatorCta({ ...cta, description: e.target.value })
            }
          />
        </Field>
        <label className="flex items-center gap-2 text-sm text-charcoal">
          <input
            type="checkbox"
            checked={cta.showFacesMarquee}
            onChange={(e) =>
              setCaseStudyCreatorCta({
                ...cta,
                showFacesMarquee: e.target.checked,
              })
            }
            className="size-4 rounded-sm border-charcoal/20"
          />
          Show creator faces marquee
        </label>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Stat 1" id="ve-cs-cc-stat1">
            <TextInput
              id="ve-cs-cc-stat1"
              value={cta.stat1}
              onChange={(e) =>
                setCaseStudyCreatorCta({ ...cta, stat1: e.target.value })
              }
            />
          </Field>
          <Field label="Stat 2" id="ve-cs-cc-stat2">
            <TextInput
              id="ve-cs-cc-stat2"
              value={cta.stat2}
              onChange={(e) =>
                setCaseStudyCreatorCta({ ...cta, stat2: e.target.value })
              }
            />
          </Field>
        </div>
        <Field label="Primary button label" id="ve-cs-cc-primary-label">
          <TextInput
            id="ve-cs-cc-primary-label"
            value={cta.primaryCtaLabel}
            onChange={(e) =>
              setCaseStudyCreatorCta({
                ...cta,
                primaryCtaLabel: e.target.value,
              })
            }
          />
        </Field>
        <Field label="Primary button URL" id="ve-cs-cc-primary-href">
          <TextInput
            id="ve-cs-cc-primary-href"
            value={cta.primaryCtaHref}
            onChange={(e) =>
              setCaseStudyCreatorCta({
                ...cta,
                primaryCtaHref: e.target.value,
              })
            }
          />
        </Field>
        <Field label="Secondary button label" id="ve-cs-cc-secondary-label">
          <TextInput
            id="ve-cs-cc-secondary-label"
            value={cta.secondaryCtaLabel}
            onChange={(e) =>
              setCaseStudyCreatorCta({
                ...cta,
                secondaryCtaLabel: e.target.value,
              })
            }
          />
        </Field>
        <Field label="Secondary button URL" id="ve-cs-cc-secondary-href">
          <TextInput
            id="ve-cs-cc-secondary-href"
            value={cta.secondaryCtaHref}
            onChange={(e) =>
              setCaseStudyCreatorCta({
                ...cta,
                secondaryCtaHref: e.target.value,
              })
            }
          />
        </Field>
      </div>
    </div>
  );
}

export function CaseStudyArticleEditorProvider({
  canEdit,
  saveAction,
  children,
}: {
  canEdit: boolean;
  saveAction: typeof import("@/lib/actions/admin-cms").saveSiteChrome;
  children: ReactNode;
}) {
  const router = useRouter();
  const { chrome, setChrome } = useSiteChrome();
  const [editing, setEditing] = useState(false);
  const [baseline, setBaseline] = useState(() => caseStudyArticleSnapshot(chrome));
  const [target, setTarget] = useState<CaseStudyArticleEditTarget | null>(null);
  const [pending, setPending] = useState(false);
  const [message, setMessage] = useState("");
  const [ok, setOk] = useState(false);

  const dirty =
    JSON.stringify(caseStudyArticleSnapshot(chrome)) !==
    JSON.stringify(baseline);

  async function save() {
    setPending(true);
    const result = await saveAction(chrome);
    setOk(result.ok);
    setMessage(result.ok ? "Case study CTAs saved." : result.message);
    setPending(false);
    if (result.ok) {
      setBaseline(caseStudyArticleSnapshot(chrome));
      router.refresh();
    }
  }

  function discard() {
    setChrome({
      ...chrome,
      articleSidebarCta: baseline.articleSidebarCta,
      caseStudyCreatorCta: baseline.caseStudyCreatorCta,
    });
    setTarget(null);
    setMessage("");
  }

  const editValue: CaseStudyArticleEditContextValue = {
    editing: editing && canEdit,
    target,
    onSelect: setTarget,
  };

  return (
    <CaseStudyArticleEditContext.Provider value={editValue}>
      {children}

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

      {editing && canEdit && target === "sidebarCta" ? (
        <SidebarCtaPopover
          chrome={chrome}
          onChange={setChrome}
          onClose={() => setTarget(null)}
        />
      ) : null}

      {editing && canEdit && target === "creatorCta" ? (
        <CreatorCtaPopover
          chrome={chrome}
          onChange={setChrome}
          onClose={() => setTarget(null)}
        />
      ) : null}
    </CaseStudyArticleEditContext.Provider>
  );
}
