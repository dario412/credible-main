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

type ArticleCtaEditContextValue = {
  editing: boolean;
  selected: boolean;
  onSelect: () => void;
};

const ArticleCtaEditContext = createContext<ArticleCtaEditContextValue | null>(
  null,
);

export function useArticleCtaEdit() {
  return useContext(ArticleCtaEditContext);
}

function articleSidebarCtaSnapshot(chrome: SiteChromeSections) {
  return chrome.articleSidebarCta;
}

function EditorPopover({
  chrome,
  onChange,
  onClose,
}: {
  chrome: SiteChromeSections;
  onChange: (next: SiteChromeSections) => void;
  onClose: () => void;
}) {
  const titleId = useId();
  const panelRef = useRef<HTMLDivElement>(null);
  const cta = chrome.articleSidebarCta;

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
        <Field label="Headline" id="ve-asc-headline">
          <TextInput
            id="ve-asc-headline"
            value={cta.headline}
            onChange={(e) =>
              setArticleSidebarCta({ ...cta, headline: e.target.value })
            }
          />
        </Field>
        <Field label="Description" id="ve-asc-description">
          <TextArea
            id="ve-asc-description"
            rows={3}
            value={cta.description}
            onChange={(e) =>
              setArticleSidebarCta({ ...cta, description: e.target.value })
            }
          />
        </Field>
        <Field label="CTA label" id="ve-asc-cta-label">
          <TextInput
            id="ve-asc-cta-label"
            value={cta.ctaLabel}
            onChange={(e) =>
              setArticleSidebarCta({ ...cta, ctaLabel: e.target.value })
            }
          />
        </Field>
        <Field label="CTA URL" id="ve-asc-cta-href">
          <TextInput
            id="ve-asc-cta-href"
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

export function ArticleSidebarCtaEditorProvider({
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
  const [baseline, setBaseline] = useState(() =>
    articleSidebarCtaSnapshot(chrome),
  );
  const [selected, setSelected] = useState(false);
  const [pending, setPending] = useState(false);
  const [message, setMessage] = useState("");
  const [ok, setOk] = useState(false);

  const dirty =
    JSON.stringify(articleSidebarCtaSnapshot(chrome)) !==
    JSON.stringify(baseline);

  async function save() {
    setPending(true);
    const result = await saveAction(chrome);
    setOk(result.ok);
    setMessage(result.ok ? "Sidebar CTA saved." : result.message);
    setPending(false);
    if (result.ok) {
      setBaseline(articleSidebarCtaSnapshot(chrome));
      router.refresh();
    }
  }

  function discard() {
    setChrome({
      ...chrome,
      articleSidebarCta: baseline,
    });
    setSelected(false);
    setMessage("");
  }

  const editValue: ArticleCtaEditContextValue = {
    editing: editing && canEdit,
    selected,
    onSelect: () => setSelected(true),
  };

  return (
    <ArticleCtaEditContext.Provider value={editValue}>
      {children}

      {canEdit ? (
        <div className="fixed bottom-4 left-1/2 z-50 flex -translate-x-1/2 flex-wrap items-center justify-center gap-2 rounded-sm border border-charcoal/10 bg-white/95 px-3 py-2 shadow-[0_12px_40px_rgba(28,26,23,0.14)] backdrop-blur">
          <Button
            type="button"
            variant={editing ? "secondary" : "primary"}
            className="px-4! py-2! text-xs"
            onClick={() => {
              setEditing((v) => !v);
              setSelected(false);
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

      {editing && canEdit && selected ? (
        <EditorPopover
          chrome={chrome}
          onChange={setChrome}
          onClose={() => setSelected(false)}
        />
      ) : null}
    </ArticleCtaEditContext.Provider>
  );
}
