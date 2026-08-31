"use client";

import { useEffect, useId, useRef, useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";

import { EditableHit } from "@/components/editable-hit";
import { Button, Field, TextArea, TextInput } from "@/components/ui";
import type { CaseStudiesPageSections } from "@/lib/case-studies-page";

type CaseStudiesEditTarget = "hero" | "archive";

function targetTitle(target: CaseStudiesEditTarget): string {
  const map: Record<CaseStudiesEditTarget, string> = {
    hero: "Page intro",
    archive: "All stories",
  };
  return map[target];
}

function CaseStudiesHero({
  sections,
  editing,
  selected,
  onSelect,
}: {
  sections: CaseStudiesPageSections;
  editing: boolean;
  selected: CaseStudiesEditTarget | null;
  onSelect: (target: CaseStudiesEditTarget) => void;
}) {
  const { headline, headlineContinued, headlineAccent, subhead } =
    sections.hero;

  return (
    <section className="px-6 pt-16 pb-0 md:px-10 md:pt-20 lg:px-12 lg:pt-24">
      <div className="mx-auto max-w-352">
        <EditableHit
          active={editing}
          selected={selected === "hero"}
          onSelect={() => onSelect("hero")}
          label="Page intro"
          block
          ringOffset="ring-offset-cream"
        >
          <h1 className="max-w-[16ch] font-display text-[2.6rem] leading-[1.05] tracking-tight text-charcoal sm:text-[3.25rem] md:text-[3.75rem] lg:text-[4.15rem]">
            {headline.trim() || editing ? (
              <>
                {headline.trim() || (editing ? "Projects headline" : null)}
                {headlineContinued.trim() ||
                headlineAccent.trim() ||
                editing ? (
                  <>
                    <br />
                    {headlineContinued.trim() ? (
                      <>{headlineContinued} </>
                    ) : editing && !headlineAccent.trim() ? (
                      <span className="text-charcoal/30">what happened </span>
                    ) : null}
                    {headlineAccent.trim() ? (
                      <span className="text-forest">{headlineAccent}</span>
                    ) : editing ? (
                      <span className="text-forest/40">next.</span>
                    ) : null}
                  </>
                ) : null}
              </>
            ) : null}
          </h1>
          {subhead.trim() || editing ? (
            <p className="mt-6 max-w-xl text-[1.05rem] leading-relaxed text-charcoal/65 md:text-[1.125rem]">
              {subhead.trim() || (editing ? "Supporting line…" : null)}
            </p>
          ) : null}
        </EditableHit>
      </div>
    </section>
  );
}

function CaseStudiesArchiveHeading({
  sections,
  editing,
  selected,
  onSelect,
}: {
  sections: CaseStudiesPageSections;
  editing: boolean;
  selected: CaseStudiesEditTarget | null;
  onSelect: (target: CaseStudiesEditTarget) => void;
}) {
  return (
    <EditableHit
      active={editing}
      selected={selected === "archive"}
      onSelect={() => onSelect("archive")}
      label="All stories"
      block
      ringOffset="ring-offset-cream"
    >
      <h2 className="text-center font-display text-[2rem] leading-[1.12] tracking-tight text-charcoal sm:text-[2.4rem] md:text-[2.75rem]">
        {sections.archive.headline.trim() ||
          (editing ? "All stories" : null)}
      </h2>
    </EditableHit>
  );
}

function EditorPopover({
  target,
  sections,
  onChange,
  onClose,
}: {
  target: CaseStudiesEditTarget;
  sections: CaseStudiesPageSections;
  onChange: (next: CaseStudiesPageSections) => void;
  onClose: () => void;
}) {
  const titleId = useId();
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

  return (
    <div
      ref={panelRef}
      role="dialog"
      aria-labelledby={titleId}
      className="fixed top-20 right-4 z-50 max-h-[min(80vh,40rem)] w-[min(100vw-2rem,24rem)] overflow-y-auto rounded-sm border border-charcoal/10 bg-white p-4 shadow-[0_18px_50px_rgba(28,26,23,0.16)]"
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

      <div className="space-y-4">
        {target === "hero" ? (
          <>
            <Field
              label="Headline"
              id="ve-cs-headline"
              hint="First line of the title."
            >
              <TextInput
                id="ve-cs-headline"
                value={sections.hero.headline}
                onChange={(e) =>
                  onChange({
                    ...sections,
                    hero: { ...sections.hero, headline: e.target.value },
                  })
                }
              />
            </Field>
            <Field
              label="Headline continued"
              id="ve-cs-continued"
              hint="Second-line lead-in before the green accent."
            >
              <TextInput
                id="ve-cs-continued"
                value={sections.hero.headlineContinued}
                onChange={(e) =>
                  onChange({
                    ...sections,
                    hero: {
                      ...sections.hero,
                      headlineContinued: e.target.value,
                    },
                  })
                }
              />
            </Field>
            <Field
              label="Headline accent"
              id="ve-cs-accent"
              hint="Forest-green end of the title."
            >
              <TextInput
                id="ve-cs-accent"
                value={sections.hero.headlineAccent}
                onChange={(e) =>
                  onChange({
                    ...sections,
                    hero: {
                      ...sections.hero,
                      headlineAccent: e.target.value,
                    },
                  })
                }
              />
            </Field>
            <Field label="Supporting line" id="ve-cs-subhead">
              <TextArea
                id="ve-cs-subhead"
                rows={4}
                value={sections.hero.subhead}
                onChange={(e) =>
                  onChange({
                    ...sections,
                    hero: { ...sections.hero, subhead: e.target.value },
                  })
                }
              />
            </Field>
          </>
        ) : null}

        {target === "archive" ? (
          <>
            <Field label="Section headline" id="ve-cs-archive-headline">
              <TextInput
                id="ve-cs-archive-headline"
                value={sections.archive.headline}
                onChange={(e) =>
                  onChange({
                    ...sections,
                    archive: {
                      ...sections.archive,
                      headline: e.target.value,
                    },
                  })
                }
              />
            </Field>
            <Field
              label="Empty — catalogue has featured only"
              id="ve-cs-archive-empty-filtered"
            >
              <TextInput
                id="ve-cs-archive-empty-filtered"
                value={sections.archive.emptyFiltered}
                onChange={(e) =>
                  onChange({
                    ...sections,
                    archive: {
                      ...sections.archive,
                      emptyFiltered: e.target.value,
                    },
                  })
                }
              />
            </Field>
            <Field
              label="Empty — no projects"
              id="ve-cs-archive-empty-none"
            >
              <TextInput
                id="ve-cs-archive-empty-none"
                value={sections.archive.emptyNone}
                onChange={(e) =>
                  onChange({
                    ...sections,
                    archive: {
                      ...sections.archive,
                      emptyNone: e.target.value,
                    },
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

export function CaseStudiesVisualEditor({
  initial,
  canEdit,
  saveAction,
  featured,
  filters,
  stories,
  hasAnyStudies,
}: {
  initial: CaseStudiesPageSections;
  canEdit: boolean;
  saveAction: typeof import("@/lib/actions/admin-cms").saveCaseStudiesPage;
  featured: ReactNode;
  filters?: ReactNode;
  /** Grid of archive cards, or null to show the CMS empty state. */
  stories: ReactNode | null;
  hasAnyStudies: boolean;
}) {
  const router = useRouter();
  const [editing, setEditing] = useState(false);
  const [sections, setSections] = useState(initial);
  const [baseline, setBaseline] = useState(initial);
  const [target, setTarget] = useState<CaseStudiesEditTarget | null>(null);
  const [pending, setPending] = useState(false);
  const [message, setMessage] = useState("");
  const [ok, setOk] = useState(false);

  const dirty = JSON.stringify(sections) !== JSON.stringify(baseline);

  useEffect(() => {
    setSections(initial);
    setBaseline(initial);
  }, [initial]);

  async function save() {
    setPending(true);
    const result = await saveAction(sections);
    setOk(result.ok);
    setMessage(result.ok ? "Projects page saved." : result.message);
    setPending(false);
    if (result.ok) {
      setBaseline(sections);
      router.refresh();
    }
  }

  function discard() {
    setSections(baseline);
    setTarget(null);
    setMessage("");
  }

  return (
    <>
      <CaseStudiesHero
        sections={sections}
        editing={editing && canEdit}
        selected={target}
        onSelect={setTarget}
      />

      <section className="px-6 pt-10 pb-0 md:px-10 md:pt-12 lg:px-12 lg:pt-14">
        {featured}
      </section>

      <section
        id="all-case-studies"
        className="scroll-mt-8 bg-cream px-6 pt-10 pb-16 md:px-10 md:pt-12 md:pb-20 lg:px-12 lg:pt-14 lg:pb-24"
      >
        <div className="mx-auto max-w-352">
          <CaseStudiesArchiveHeading
            sections={sections}
            editing={editing && canEdit}
            selected={target}
            onSelect={setTarget}
          />

          {filters}

          {stories ?? (
            <p className="mt-10 text-sm text-charcoal/50 md:mt-12">
              {hasAnyStudies
                ? sections.archive.emptyFiltered
                : sections.archive.emptyNone}
            </p>
          )}
        </div>
      </section>

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
                href="/admin/pages/case-studies"
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
          sections={sections}
          onChange={setSections}
          onClose={() => setTarget(null)}
        />
      ) : null}
    </>
  );
}
