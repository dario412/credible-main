"use client";

import { useMemo, useState } from "react";

import { CaseStudyBlockEditor } from "@/components/case-study-block-editor";
import { MediaField } from "@/components/media-library";
import { Button, Field, TextArea, TextInput } from "@/components/ui";
import {
  CASE_STUDY_PILLARS,
  DEFAULT_CASE_STUDY_PILLAR,
  type CaseStudyCard,
} from "@/lib/case-studies";
import {
  ensureBlockIds,
  legacyStoryToBlocks,
  type CaseStudyBlock,
} from "@/lib/case-study-content";
import {
  PROJECT_HERO_SUMMARY_MAX,
  PROJECT_SEO_DESCRIPTION_MAX,
  PROJECT_SEO_TITLE_MAX,
  PROJECT_SUMMARY_MAX,
  validateProjectCmsFields,
} from "@/lib/project-cms-limits";
import { cn } from "@/lib/utils";

export type CaseStudySpeakerOption = {
  slug: string;
  name: string;
};

function initialBlocks(card: CaseStudyCard): CaseStudyBlock[] {
  if (card.blocks && card.blocks.length > 0) {
    return ensureBlockIds(card.blocks);
  }
  return legacyStoryToBlocks(card);
}

function SpeakersField({
  speakers,
  selected,
  onChange,
}: {
  speakers: CaseStudySpeakerOption[];
  selected: string[];
  onChange: (next: string[]) => void;
}) {
  const [query, setQuery] = useState("");
  const selectedSet = useMemo(() => new Set(selected), [selected]);
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return speakers;
    return speakers.filter(
      (speaker) =>
        speaker.name.toLowerCase().includes(q) ||
        speaker.slug.toLowerCase().includes(q),
    );
  }, [speakers, query]);

  function toggle(slug: string) {
    if (selectedSet.has(slug)) {
      onChange(selected.filter((item) => item !== slug));
      return;
    }
    onChange([...selected, slug]);
  }

  return (
    <Field
      label="Speakers"
      id="speakers"
      hint="Link one or more roster creators. Their profile Recent work section will show this case."
    >
      <div className="space-y-2">
        <TextInput
          id="speakers-search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search roster…"
        />
        <div
          id="speakers"
          className="max-h-56 space-y-1 overflow-y-auto border border-charcoal/30 bg-white px-3 py-2"
        >
          {filtered.map((speaker) => {
            const checked = selectedSet.has(speaker.slug);
            return (
              <label
                key={speaker.slug}
                className="flex cursor-pointer items-center gap-2 rounded-sm px-1 py-1.5 text-sm text-charcoal hover:bg-cream-dark/60"
              >
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={() => toggle(speaker.slug)}
                />
                <span className="min-w-0 flex-1 truncate">{speaker.name}</span>
                <span className="shrink-0 text-[0.7rem] text-charcoal/40">
                  {speaker.slug}
                </span>
              </label>
            );
          })}
          {filtered.length === 0 ? (
            <p className="px-1 py-2 text-sm text-charcoal/45">
              No speakers match that search.
            </p>
          ) : null}
        </div>
        {selected.length > 0 ? (
          <p className="text-xs text-charcoal/50">
            {selected.length} selected
            {selected.length <= 3
              ? `: ${selected
                  .map(
                    (slug) =>
                      speakers.find((speaker) => speaker.slug === slug)?.name ??
                      slug,
                  )
                  .join(", ")}`
              : ""}
          </p>
        ) : (
          <p className="text-xs text-charcoal/45">Optional — none selected.</p>
        )}
      </div>
    </Field>
  );
}

function CharCount({
  value,
  max,
}: {
  value: string;
  max: number;
}) {
  const count = value.length;
  const over = count > max;
  const near = count > max * 0.85;
  return (
    <p
      className={cn(
        "text-right text-xs tabular-nums",
        over ? "text-danger" : near ? "text-charcoal/55" : "text-charcoal/40",
      )}
    >
      {count}/{max}
      {over ? " — too long" : ""}
    </p>
  );
}

export function CaseStudyEditorForm({
  initial,
  speakers,
  saveAction,
}: {
  initial: CaseStudyCard;
  speakers: CaseStudySpeakerOption[];
  saveAction: typeof import("@/lib/actions/admin-cms").saveCaseStudy;
}) {
  const [card, setCard] = useState<CaseStudyCard>({
    ...initial,
    relatedExperts: initial.relatedExperts ?? [],
  });
  const [blocks, setBlocks] = useState<CaseStudyBlock[]>(() =>
    initialBlocks(initial),
  );
  const [previousSlug] = useState(initial.slug);
  const [message, setMessage] = useState("");
  const [ok, setOk] = useState(false);
  const [pending, setPending] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (pending) return;

    const validationError = validateProjectCmsFields({
      summary: card.summary,
      heroSummary: card.heroSummary,
      seoTitle: card.seoTitle,
      seoDescription: card.seoDescription,
    });
    if (validationError) {
      setOk(false);
      setMessage(validationError);
      return;
    }

    setPending(true);
    const next: CaseStudyCard = {
      ...card,
      id: card.id ?? initial.id,
      pillars:
        card.pillars && card.pillars.length > 0
          ? card.pillars
          : [card.pillar || DEFAULT_CASE_STUDY_PILLAR],
      pillar:
        (card.pillars && card.pillars[0]) ||
        card.pillar ||
        DEFAULT_CASE_STUDY_PILLAR,
      relatedExperts: card.relatedExperts ?? [],
      blocks: ensureBlockIds(blocks),
    };
    const result = await saveAction(next, {
      previousSlug: previousSlug || undefined,
    });
    setOk(result.ok);
    setMessage(result.message);
    setPending(false);
    if (result.ok && result.slug) {
      window.location.href = `/admin/case-studies/${result.slug}`;
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-10">
      <section className="space-y-4">
        <div>
          <h2 className="font-display text-xl">Page content</h2>
          <p className="mt-1 text-sm text-muted">
            What visitors see on the project page and projects index. This is
            separate from Google / social fields below.
          </p>
        </div>
      <div className="grid gap-4 md:grid-cols-2">
        <Field label="Page title" id="title" hint="Main headline on the project page.">
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
        <MediaField
          label="Client logo"
          hint="Brand mark on the project hero and catalogue cards — not used for SEO or social previews."
          value={card.logo ?? ""}
          onChange={(logo) => setCard({ ...card, logo: logo || undefined })}
        />
        <div className="md:col-span-2">
          <SpeakersField
            speakers={speakers}
            selected={card.relatedExperts ?? []}
            onChange={(relatedExperts) => setCard({ ...card, relatedExperts })}
          />
        </div>
        <Field label="Pillars" id="pillars">
          <div
            id="pillars"
            className="flex flex-wrap gap-x-4 gap-y-2 border border-charcoal/30 bg-white px-4 py-3"
          >
            {CASE_STUDY_PILLARS.map((p) => {
              const selected = (card.pillars ?? [card.pillar]).includes(p);
              return (
                <label
                  key={p}
                  className="flex cursor-pointer items-center gap-2 text-sm text-charcoal"
                >
                  <input
                    type="checkbox"
                    checked={selected}
                    onChange={() => {
                      const current = card.pillars?.length
                        ? [...card.pillars]
                        : [card.pillar];
                      const next = selected
                        ? current.filter((item) => item !== p)
                        : [...current, p];
                      const ordered = CASE_STUDY_PILLARS.filter((item) =>
                        next.includes(item),
                      );
                      setCard({
                        ...card,
                        pillars: ordered,
                        pillar: ordered[0] ?? DEFAULT_CASE_STUDY_PILLAR,
                      });
                    }}
                  />
                  {p}
                </label>
              );
            })}
          </div>
        </Field>
        <div className="md:col-span-2">
          <Field
            label="Card summary"
            id="summary"
            hint="Short teaser on the projects index and cards. Not the Google meta description — use Search & social below for that."
          >
            <TextArea
              id="summary"
              rows={3}
              maxLength={PROJECT_SUMMARY_MAX}
              value={card.summary}
              onChange={(e) => setCard({ ...card, summary: e.target.value })}
              required
            />
            <CharCount value={card.summary} max={PROJECT_SUMMARY_MAX} />
          </Field>
        </div>
        <MediaField
          label="Cover image"
          hint="Full-bleed hero on the project page. Also used as the social share image unless you set one below."
          value={card.coverImage ?? ""}
          onChange={(coverImage) => setCard({ ...card, coverImage })}
        />
        <label className="flex items-center gap-2 self-end pb-3 text-sm">
          <input
            type="checkbox"
            checked={Boolean(card.featured)}
            onChange={(e) => setCard({ ...card, featured: e.target.checked })}
          />
          Featured on projects index
        </label>
        <div className="md:col-span-2 border-t border-charcoal/10 pt-4">
          <p className="text-sm font-medium text-charcoal">Hero overrides (optional)</p>
          <p className="mt-0.5 text-xs text-muted">
            Replace the default title and intro on the full-bleed hero. Leave
            blank to use the page title and card summary.
          </p>
        </div>
        <Field label="Hero headline" id="heroTitle">
          <TextInput
            id="heroTitle"
            value={card.heroTitle ?? ""}
            onChange={(e) => setCard({ ...card, heroTitle: e.target.value })}
          />
        </Field>
        <Field label="Hero emphasis" id="heroTitleEmphasis" hint="Optional italic or accent phrase at the end of the hero headline.">
          <TextInput
            id="heroTitleEmphasis"
            value={card.heroTitleEmphasis ?? ""}
            onChange={(e) =>
              setCard({ ...card, heroTitleEmphasis: e.target.value })
            }
          />
        </Field>
        <div className="md:col-span-2">
          <Field
            label="Hero intro"
            id="heroSummary"
            hint="Supporting line under the hero headline on the project page only."
          >
            <TextArea
              id="heroSummary"
              rows={2}
              maxLength={PROJECT_HERO_SUMMARY_MAX}
              value={card.heroSummary ?? ""}
              onChange={(e) => setCard({ ...card, heroSummary: e.target.value })}
            />
            <CharCount
              value={card.heroSummary ?? ""}
              max={PROJECT_HERO_SUMMARY_MAX}
            />
          </Field>
        </div>
      </div>
      </section>

      <section className="space-y-4">
        <div>
          <h2 className="font-display text-xl">Search &amp; social (SEO)</h2>
          <p className="mt-1 text-sm text-muted">
            Controls the browser tab title, Google search snippet, and link
            previews on LinkedIn, Slack, etc. If left blank, the page falls
            back to the page title, card summary, and cover image.
          </p>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <Field
            label="Meta title"
            id="seoTitle"
            hint={`Google & browser tab title. Max ${PROJECT_SEO_TITLE_MAX} characters. Defaults to page title.`}
          >
            <TextInput
              id="seoTitle"
              maxLength={PROJECT_SEO_TITLE_MAX}
              value={card.seoTitle ?? ""}
              onChange={(e) =>
                setCard({ ...card, seoTitle: e.target.value })
              }
              placeholder={card.title || "Page title"}
            />
            <CharCount value={card.seoTitle ?? ""} max={PROJECT_SEO_TITLE_MAX} />
          </Field>
          <MediaField
            label="Social share image (OG)"
            hint="1200×630 recommended. Defaults to cover image."
            value={card.ogImage ?? ""}
            onChange={(ogImage) =>
              setCard({ ...card, ogImage: ogImage || undefined })
            }
          />
          <div className="md:col-span-2">
            <Field
              label="Meta description"
              id="seoDescription"
              hint={`The snippet Google shows in search results. Max ${PROJECT_SEO_DESCRIPTION_MAX} characters. Not the same as card summary. Defaults to card summary if empty.`}
            >
              <TextArea
                id="seoDescription"
                rows={3}
                maxLength={PROJECT_SEO_DESCRIPTION_MAX}
                value={card.seoDescription ?? ""}
                onChange={(e) =>
                  setCard({ ...card, seoDescription: e.target.value })
                }
                placeholder={card.summary || "Card summary"}
              />
              <CharCount
                value={card.seoDescription ?? ""}
                max={PROJECT_SEO_DESCRIPTION_MAX}
              />
            </Field>
          </div>
        </div>
      </section>

      <div className="space-y-4">
        <h2 className="font-display text-xl">Story content</h2>
        <CaseStudyBlockEditor value={blocks} onChange={setBlocks} />
      </div>

      <div
        className={cn(
          "sticky bottom-4 z-10 flex flex-wrap items-center gap-3 rounded-sm border border-charcoal/10 bg-white/95 px-4 py-3 shadow-[0_10px_30px_rgba(28,26,23,0.08)] backdrop-blur",
        )}
      >
        <Button type="submit" variant="primary" disabled={pending}>
          {pending ? "Saving…" : "Save project"}
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
