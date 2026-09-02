"use client";

import { useState } from "react";

import { Button, Field, TextArea, TextInput } from "@/components/ui";
import type { RosterPageSections } from "@/lib/roster-page";

export function RosterPageEditorForm({
  initial,
  saveAction,
}: {
  initial: RosterPageSections;
  saveAction: typeof import("@/lib/actions/admin-cms").saveRosterPage;
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

  function setHero(hero: RosterPageSections["hero"]) {
    setSections({ ...sections, hero });
  }

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <section className="space-y-4">
        <div>
          <h2 className="font-display text-xl">Intro</h2>
          <p className="mt-1 text-sm text-muted">
            Headline and supporting line at the top of{" "}
            <a
              href="/roster"
              className="font-medium text-forest hover:text-forest-dark"
            >
              /roster
            </a>
            .
          </p>
        </div>
        <Field
          label="Headline"
          id="roster-headline"
          hint="First line, before the accent. Use {count} for the live roster total."
        >
          <TextInput
            id="roster-headline"
            value={sections.hero.headline}
            onChange={(e) =>
              setHero({ ...sections.hero, headline: e.target.value })
            }
          />
        </Field>
        <Field
          label="Headline accent"
          id="roster-headline-accent"
          hint="Second line, shown in forest green."
        >
          <TextInput
            id="roster-headline-accent"
            value={sections.hero.headlineAccent}
            onChange={(e) =>
              setHero({ ...sections.hero, headlineAccent: e.target.value })
            }
          />
        </Field>
        <Field label="Supporting line" id="roster-subhead">
          <TextArea
            id="roster-subhead"
            rows={4}
            value={sections.hero.subhead}
            onChange={(e) =>
              setHero({ ...sections.hero, subhead: e.target.value })
            }
          />
        </Field>
      </section>

      <div className="flex flex-wrap items-center gap-3">
        <Button type="submit" disabled={pending}>
          {pending ? "Saving…" : "Save changes"}
        </Button>
        {message ? (
          <p className={`text-sm ${ok ? "text-success" : "text-danger"}`}>
            {message}
          </p>
        ) : null}
      </div>
    </form>
  );
}
