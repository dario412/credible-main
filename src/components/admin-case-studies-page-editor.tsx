"use client";

import { useState } from "react";

import { Button, Field, TextArea, TextInput } from "@/components/ui";
import {
  emptyCaseStudiesFaqItem,
  type CaseStudiesPageSections,
} from "@/lib/case-studies-page";

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

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <section className="space-y-4">
        <div>
          <h2 className="font-display text-xl">FAQ</h2>
          <p className="mt-1 text-sm text-muted">
            Accordion under All stories on{" "}
            <a
              href="/case-studies"
              className="font-medium text-forest hover:text-forest-dark"
            >
              /case-studies
            </a>
            .
          </p>
        </div>
        <Field label="Eyebrow" id="cs-faq-eyebrow">
          <TextInput
            id="cs-faq-eyebrow"
            value={sections.faq.eyebrow}
            onChange={(e) =>
              setSections({
                ...sections,
                faq: { ...sections.faq, eyebrow: e.target.value },
              })
            }
          />
        </Field>
        <Field label="Headline" id="cs-faq-headline">
          <TextInput
            id="cs-faq-headline"
            value={sections.faq.headline}
            onChange={(e) =>
              setSections({
                ...sections,
                faq: { ...sections.faq, headline: e.target.value },
              })
            }
          />
        </Field>
        <Field label="Subhead" id="cs-faq-subhead">
          <TextArea
            id="cs-faq-subhead"
            rows={3}
            value={sections.faq.subhead}
            onChange={(e) =>
              setSections({
                ...sections,
                faq: { ...sections.faq, subhead: e.target.value },
              })
            }
          />
        </Field>
        {sections.faq.items.map((item, index) => (
          <div
            key={`cs-faq-${index}`}
            className="space-y-3 rounded-sm border border-charcoal/10 p-4"
          >
            <div className="flex items-center justify-between gap-3">
              <p className="text-sm font-medium">Question {index + 1}</p>
              <button
                type="button"
                onClick={() =>
                  setSections({
                    ...sections,
                    faq: {
                      ...sections.faq,
                      items: sections.faq.items.filter((_, i) => i !== index),
                    },
                  })
                }
                className="text-xs font-medium text-danger hover:underline"
              >
                Remove
              </button>
            </div>
            <Field label="Question" id={`cs-faq-q-${index}`}>
              <TextInput
                id={`cs-faq-q-${index}`}
                value={item.q}
                onChange={(e) => {
                  const items = sections.faq.items.map((row, i) =>
                    i === index ? { ...row, q: e.target.value } : row,
                  );
                  setSections({
                    ...sections,
                    faq: { ...sections.faq, items },
                  });
                }}
              />
            </Field>
            <Field label="Answer" id={`cs-faq-a-${index}`}>
              <TextArea
                id={`cs-faq-a-${index}`}
                rows={3}
                value={item.a}
                onChange={(e) => {
                  const items = sections.faq.items.map((row, i) =>
                    i === index ? { ...row, a: e.target.value } : row,
                  );
                  setSections({
                    ...sections,
                    faq: { ...sections.faq, items },
                  });
                }}
              />
            </Field>
          </div>
        ))}
        <button
          type="button"
          onClick={() =>
            setSections({
              ...sections,
              faq: {
                ...sections.faq,
                items: [...sections.faq.items, emptyCaseStudiesFaqItem()],
              },
            })
          }
          className="text-sm font-medium text-forest hover:text-forest-dark"
        >
          + Add question
        </button>
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
