"use client";

import { useState } from "react";

import { MediaField } from "@/components/media-library";
import { Button, Field, TextArea, TextInput } from "@/components/ui";
import type { CaseStudyCard } from "@/lib/case-studies";
import { CASE_STUDY_PILLARS, CASE_STUDY_CLIENT_TYPES } from "@/lib/case-studies";
import { cn } from "@/lib/utils";

export function CaseStudyEditorForm({
  initial,
  saveAction,
}: {
  initial: CaseStudyCard;
  saveAction: typeof import("@/lib/actions/admin-cms").saveCaseStudy;
}) {
  const [card, setCard] = useState<CaseStudyCard>(initial);
  const [challenge, setChallenge] = useState(
    (initial.story?.challenge ?? []).join("\n\n"),
  );
  const [approach, setApproach] = useState(
    (initial.story?.approach ?? []).join("\n\n"),
  );
  const [outcomes, setOutcomes] = useState(
    (initial.story?.outcomes ?? []).join("\n\n"),
  );
  const [message, setMessage] = useState("");
  const [ok, setOk] = useState(false);
  const [pending, setPending] = useState(false);

  function splitParas(text: string) {
    return text
      .split(/\n\s*\n/)
      .map((p) => p.trim())
      .filter(Boolean);
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setPending(true);
    const next: CaseStudyCard = {
      ...card,
      story: {
        challenge: splitParas(challenge),
        approach: splitParas(approach),
        outcomes: splitParas(outcomes),
        outcomesHeadline: card.story?.outcomesHeadline,
        deliverablesHeadline: card.story?.deliverablesHeadline,
        deliverablesIntro: card.story?.deliverablesIntro,
        deliverables: card.story?.deliverables ?? [],
      },
    };
    const result = await saveAction(next);
    setOk(result.ok);
    setMessage(result.message);
    setPending(false);
    if (result.ok && result.slug) {
      window.location.href = `/admin/case-studies/${result.slug}`;
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-8">
      <div className="grid gap-4 md:grid-cols-2">
        <Field label="Title" id="title">
          <TextInput
            id="title"
            value={card.title}
            onChange={(e) => setCard({ ...card, title: e.target.value })}
            required
          />
        </Field>
        <Field label="Slug" id="slug">
          <TextInput
            id="slug"
            value={card.slug}
            onChange={(e) => setCard({ ...card, slug: e.target.value })}
            required
          />
        </Field>
        <Field label="Client" id="client">
          <TextInput
            id="client"
            value={card.client}
            onChange={(e) => setCard({ ...card, client: e.target.value })}
            required
          />
        </Field>
        <Field label="Period" id="period">
          <TextInput
            id="period"
            value={card.period}
            onChange={(e) => setCard({ ...card, period: e.target.value })}
          />
        </Field>
        <Field label="Pillar" id="pillar">
          <select
            id="pillar"
            className="w-full border border-charcoal/30 bg-white px-4 py-3 text-sm"
            value={card.pillar}
            onChange={(e) =>
              setCard({
                ...card,
                pillar: e.target.value as CaseStudyCard["pillar"],
              })
            }
          >
            {CASE_STUDY_PILLARS.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Client type" id="clientType">
          <select
            id="clientType"
            className="w-full border border-charcoal/30 bg-white px-4 py-3 text-sm"
            value={card.clientType}
            onChange={(e) =>
              setCard({
                ...card,
                clientType: e.target.value as CaseStudyCard["clientType"],
              })
            }
          >
            {CASE_STUDY_CLIENT_TYPES.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Industry" id="industry">
          <TextInput
            id="industry"
            value={card.industry}
            onChange={(e) => setCard({ ...card, industry: e.target.value })}
          />
        </Field>
        <Field label="Company size" id="size">
          <TextInput
            id="size"
            value={card.size}
            onChange={(e) => setCard({ ...card, size: e.target.value })}
          />
        </Field>
        <div className="md:col-span-2">
          <Field label="Summary" id="summary">
            <TextArea
              id="summary"
              rows={3}
              value={card.summary}
              onChange={(e) => setCard({ ...card, summary: e.target.value })}
              required
            />
          </Field>
        </div>
        <MediaField
          label="Cover image"
          value={card.coverImage ?? ""}
          onChange={(coverImage) => setCard({ ...card, coverImage })}
        />
        <label className="flex items-center gap-2 self-end pb-3 text-sm">
          <input
            type="checkbox"
            checked={Boolean(card.featured)}
            onChange={(e) => setCard({ ...card, featured: e.target.checked })}
          />
          Featured on case studies index
        </label>
        <Field label="Hero title (optional)" id="heroTitle">
          <TextInput
            id="heroTitle"
            value={card.heroTitle ?? ""}
            onChange={(e) => setCard({ ...card, heroTitle: e.target.value })}
          />
        </Field>
        <Field label="Hero emphasis (optional)" id="heroTitleEmphasis">
          <TextInput
            id="heroTitleEmphasis"
            value={card.heroTitleEmphasis ?? ""}
            onChange={(e) =>
              setCard({ ...card, heroTitleEmphasis: e.target.value })
            }
          />
        </Field>
        <div className="md:col-span-2">
          <Field label="Hero summary (optional)" id="heroSummary">
            <TextArea
              id="heroSummary"
              rows={2}
              value={card.heroSummary ?? ""}
              onChange={(e) => setCard({ ...card, heroSummary: e.target.value })}
            />
          </Field>
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="font-display text-xl">Story</h2>
        <p className="text-sm text-muted">
          Separate paragraphs with a blank line.
        </p>
        <Field label="Challenge" id="challenge">
          <TextArea
            id="challenge"
            rows={5}
            value={challenge}
            onChange={(e) => setChallenge(e.target.value)}
          />
        </Field>
        <Field label="Approach" id="approach">
          <TextArea
            id="approach"
            rows={5}
            value={approach}
            onChange={(e) => setApproach(e.target.value)}
          />
        </Field>
        <Field label="Outcomes" id="outcomes">
          <TextArea
            id="outcomes"
            rows={5}
            value={outcomes}
            onChange={(e) => setOutcomes(e.target.value)}
          />
        </Field>
      </div>

      <div
        className={cn(
          "sticky bottom-4 z-10 flex flex-wrap items-center gap-3 rounded-sm border border-charcoal/10 bg-white/95 px-4 py-3 shadow-[0_10px_30px_rgba(28,26,23,0.08)] backdrop-blur",
        )}
      >
        <Button type="submit" variant="primary" disabled={pending}>
          {pending ? "Saving…" : "Save case study"}
        </Button>
        {card.slug ? (
          <a
            href={`/case-studies/${card.slug}`}
            target="_blank"
            rel="noreferrer"
            className="text-sm font-medium text-charcoal/60 hover:text-charcoal"
          >
            View on site ↗
          </a>
        ) : null}
        {message ? (
          <p className={`text-sm ${ok ? "text-success" : "text-danger"}`}>
            {message}
          </p>
        ) : null}
      </div>
    </form>
  );
}
