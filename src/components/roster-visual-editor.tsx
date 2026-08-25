"use client";

import { useEffect, useId, useRef, useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";

import { EditableHit } from "@/components/editable-hit";
import { Button, Field, TextArea, TextInput } from "@/components/ui";
import type { RosterPageSections } from "@/lib/roster-page";

type RosterEditTarget = "hero";

function RosterHero({
  sections,
  editing,
  selected,
  onSelect,
}: {
  sections: RosterPageSections;
  editing: boolean;
  selected: RosterEditTarget | null;
  onSelect: (target: RosterEditTarget) => void;
}) {
  const { headline, headlineAccent, subhead } = sections.hero;

  return (
    <div className="mx-auto max-w-3xl text-center">
      <EditableHit
        active={editing}
        selected={selected === "hero"}
        onSelect={() => onSelect("hero")}
        label="Roster intro"
        block
        ringOffset="ring-offset-cream"
      >
        <h1 className="font-display text-[2.6rem] leading-[1.08] tracking-tight text-charcoal sm:text-[3.15rem] md:text-[3.65rem]">
          {headline.trim() ? (
            <>
              {headline}
              {headlineAccent.trim() ? (
                <>
                  <br />
                  <span className="text-forest">{headlineAccent}</span>
                </>
              ) : null}
            </>
          ) : headlineAccent.trim() ? (
            <span className="text-forest">{headlineAccent}</span>
          ) : editing ? (
            "Roster headline"
          ) : null}
        </h1>
        {subhead.trim() || editing ? (
          <p className="mx-auto mt-5 max-w-lg text-[0.9rem] leading-relaxed text-charcoal/65 md:text-[0.95rem]">
            {subhead.trim() || (editing ? "Roster supporting line…" : null)}
          </p>
        ) : null}
      </EditableHit>
    </div>
  );
}

function EditorPopover({
  sections,
  onChange,
  onClose,
}: {
  sections: RosterPageSections;
  onChange: (next: RosterPageSections) => void;
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

  function setHero(hero: RosterPageSections["hero"]) {
    onChange({ ...sections, hero });
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
          Roster intro
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
        <Field
          label="Headline"
          id="ve-roster-headline"
          hint="First line, before the accent."
        >
          <TextInput
            id="ve-roster-headline"
            value={sections.hero.headline}
            onChange={(e) =>
              setHero({ ...sections.hero, headline: e.target.value })
            }
          />
        </Field>
        <Field
          label="Headline accent"
          id="ve-roster-headline-accent"
          hint="Second line, shown in forest green."
        >
          <TextInput
            id="ve-roster-headline-accent"
            value={sections.hero.headlineAccent}
            onChange={(e) =>
              setHero({ ...sections.hero, headlineAccent: e.target.value })
            }
          />
        </Field>
        <Field label="Supporting line" id="ve-roster-subhead">
          <TextArea
            id="ve-roster-subhead"
            rows={4}
            value={sections.hero.subhead}
            onChange={(e) =>
              setHero({ ...sections.hero, subhead: e.target.value })
            }
          />
        </Field>
      </div>
    </div>
  );
}

export function RosterVisualEditor({
  initial,
  canEdit,
  saveAction,
  children,
}: {
  initial: RosterPageSections;
  canEdit: boolean;
  saveAction: typeof import("@/lib/actions/admin-cms").saveRosterPage;
  children: ReactNode;
}) {
  const router = useRouter();
  const [editing, setEditing] = useState(false);
  const [sections, setSections] = useState(initial);
  const [baseline, setBaseline] = useState(initial);
  const [target, setTarget] = useState<RosterEditTarget | null>(null);
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
    setMessage(result.ok ? "Roster page saved." : result.message);
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
      <RosterHero
        sections={sections}
        editing={editing && canEdit}
        selected={target}
        onSelect={setTarget}
      />

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
                href="/admin/pages/roster"
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
          sections={sections}
          onChange={setSections}
          onClose={() => setTarget(null)}
        />
      ) : null}
    </>
  );
}
