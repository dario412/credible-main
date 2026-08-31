"use client";

import { useState } from "react";

import { Button, Field, TextArea, TextInput } from "@/components/ui";
import type { CaseStudiesPageSections } from "@/lib/case-studies-page";

export function CaseStudiesPageEditorForm({
  initial,
  saveAction,
}: {
  initial: CaseStudiesPageSections;
  saveAction: typeof import("@/lib/actions/admin-cms").saveCaseStudiesPage;
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

  function setHero(hero: CaseStudiesPageSections["hero"]) {
    setSections({ ...sections, hero });
  }

  function setArchive(archive: CaseStudiesPageSections["archive"]) {
    setSections({ ...sections, archive });
  }

  return (
    <form onSubmit={onSubmit} className="space-y-10">
      <section className="space-y-4">
        <div>
          <h2 className="font-display text-xl">Intro</h2>
          <p className="mt-1 text-sm text-muted">
            Headline and supporting line at the top of{" "}
            <a
              href="/case-studies"
              className="font-medium text-forest hover:text-forest-dark"
            >
              /case-studies
            </a>
            .
          </p>
        </div>
        <Field
          label="Headline"
          id="cs-hero-headline"
          hint="First line of the title."
        >
          <TextInput
            id="cs-hero-headline"
            value={sections.hero.headline}
            onChange={(e) =>
              setHero({ ...sections.hero, headline: e.target.value })
            }
          />
        </Field>
        <Field
          label="Headline continued"
          id="cs-hero-continued"
          hint="Second-line lead-in before the green accent."
        >
          <TextInput
            id="cs-hero-continued"
            value={sections.hero.headlineContinued}
            onChange={(e) =>
              setHero({ ...sections.hero, headlineContinued: e.target.value })
            }
          />
        </Field>
        <Field
          label="Headline accent"
          id="cs-hero-accent"
          hint="Forest-green end of the title (e.g. next.)."
        >
          <TextInput
            id="cs-hero-accent"
            value={sections.hero.headlineAccent}
            onChange={(e) =>
              setHero({ ...sections.hero, headlineAccent: e.target.value })
            }
          />
        </Field>
        <Field label="Supporting line" id="cs-hero-subhead">
          <TextArea
            id="cs-hero-subhead"
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
          <h2 className="font-display text-xl">All stories</h2>
          <p className="mt-1 text-sm text-muted">
            Archive heading and empty states under the featured cards.
          </p>
        </div>
        <Field label="Section headline" id="cs-archive-headline">
          <TextInput
            id="cs-archive-headline"
            value={sections.archive.headline}
            onChange={(e) =>
              setArchive({ ...sections.archive, headline: e.target.value })
            }
          />
        </Field>
        <Field
          label="Empty — catalogue has featured only"
          id="cs-archive-empty-filtered"
        >
          <TextInput
            id="cs-archive-empty-filtered"
            value={sections.archive.emptyFiltered}
            onChange={(e) =>
              setArchive({
                ...sections.archive,
                emptyFiltered: e.target.value,
              })
            }
          />
        </Field>
        <Field label="Empty — no projects" id="cs-archive-empty-none">
          <TextInput
            id="cs-archive-empty-none"
            value={sections.archive.emptyNone}
            onChange={(e) =>
              setArchive({ ...sections.archive, emptyNone: e.target.value })
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
