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
import { coverAltFor, logoAltFor } from "@/lib/image-alt";
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

function UseSameCheckbox({
  id,
  checked,
  onChange,
  children,
}: {
  id: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  children: React.ReactNode;
}) {
  return (
    <label
      htmlFor={id}
      className="flex cursor-pointer items-center gap-2 text-sm text-charcoal"
    >
      <input
        id={id}
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
      />
      {children}
    </label>
  );
}

function SeoFallbackPreview({
  value,
  max,
  emptyLabel,
}: {
  value: string;
  max: number;
  emptyLabel: string;
}) {
  const preview = value.trim();
  return (
    <div className="rounded-sm border border-charcoal/15 bg-cream-dark/40 px-3 py-2.5">
      <p className="text-xs font-medium text-charcoal/55">Will use</p>
      <p className="mt-1 text-sm text-charcoal">
        {preview || (
          <span className="text-charcoal/45 italic">{emptyLabel}</span>
        )}
      </p>
      {preview ? <CharCount value={preview} max={max} /> : null}
    </div>
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
  const [useSameMetaTitle, setUseSameMetaTitle] = useState(
    () => !initial.seoTitle?.trim(),
  );
  const [useSameMetaDescription, setUseSameMetaDescription] = useState(
    () => !initial.seoDescription?.trim(),
  );
  const [useSameOgImage, setUseSameOgImage] = useState(
    () => !initial.ogImage?.trim(),
  );

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (pending) return;

    const validationError = validateProjectCmsFields({
      summary: card.summary,
      heroSummary: card.heroSummary,
      seoTitle: useSameMetaTitle ? undefined : card.seoTitle,
      seoDescription: useSameMetaDescription ? undefined : card.seoDescription,
      title: card.title,
    });
    if (validationError) {
      setOk(false);
      setMessage(validationError);
      return;
    }

    if (!useSameMetaTitle && !card.seoTitle?.trim()) {
      setOk(false);
      setMessage("Enter a custom meta title or check Same as page title.");
      return;
    }

    if (!useSameMetaDescription && !card.seoDescription?.trim()) {
      setOk(false);
      setMessage(
        "Enter a custom meta description or check Same as card summary.",
      );
      return;
    }

    setPending(true);
    const next: CaseStudyCard = {
      ...card,
      seoTitle: useSameMetaTitle ? undefined : card.seoTitle?.trim() || undefined,
      seoDescription: useSameMetaDescription
        ? undefined
        : card.seoDescription?.trim() || undefined,
      ogImage: useSameOgImage ? undefined : card.ogImage?.trim() || undefined,
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
          alt={card.logoAlt ?? ""}
          onAltChange={(logoAlt) =>
            setCard({ ...card, logoAlt: logoAlt.trim() || undefined })
          }
          suggestedAlt={logoAltFor(card.client)}
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
          hint="Full-bleed hero on the project page. Can also be reused as the social share image in Search & social below."
          value={card.coverImage ?? ""}
          onChange={(coverImage) => setCard({ ...card, coverImage })}
          alt={card.coverImageAlt ?? ""}
          onAltChange={(coverImageAlt) =>
            setCard({ ...card, coverImageAlt: coverImageAlt.trim() || undefined })
          }
          suggestedAlt={coverAltFor(card.title)}
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
            previews on LinkedIn, Slack, etc. Check &ldquo;same as&rdquo; to
            reuse page content, or enter custom values below.
          </p>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <Field
            label="Meta title"
            id="seoTitle"
            hint={`Google & browser tab title. Max ${PROJECT_SEO_TITLE_MAX} characters.`}
          >
            <div className="space-y-2">
              <UseSameCheckbox
                id="seoTitleSameAsPageTitle"
                checked={useSameMetaTitle}
                onChange={(checked) => {
                  setUseSameMetaTitle(checked);
                  if (checked) {
                    setCard({ ...card, seoTitle: undefined });
                    return;
                  }
                  setCard({ ...card, seoTitle: card.title });
                }}
              >
                Same as page title
              </UseSameCheckbox>
              {useSameMetaTitle ? (
                <SeoFallbackPreview
                  value={card.title}
                  max={PROJECT_SEO_TITLE_MAX}
                  emptyLabel="Add a page title above"
                />
              ) : (
                <>
                  <TextInput
                    id="seoTitle"
                    maxLength={PROJECT_SEO_TITLE_MAX}
                    value={card.seoTitle ?? ""}
                    onChange={(e) =>
                      setCard({ ...card, seoTitle: e.target.value })
                    }
                    placeholder="Custom meta title"
                  />
                  <CharCount
                    value={card.seoTitle ?? ""}
                    max={PROJECT_SEO_TITLE_MAX}
                  />
                </>
              )}
            </div>
          </Field>
          <div className="space-y-1.5">
            <p className="block text-sm font-medium text-charcoal">
              Social share image (OG)
            </p>
            <p className="text-xs text-muted">
              1200×630 recommended. Used for link previews on LinkedIn, Slack,
              etc.
            </p>
            <div className="space-y-2">
              <UseSameCheckbox
                id="ogImageSameAsCover"
                checked={useSameOgImage}
                onChange={(checked) => {
                  setUseSameOgImage(checked);
                  if (checked) {
                    setCard({ ...card, ogImage: undefined });
                  }
                }}
              >
                Same as cover image
              </UseSameCheckbox>
              {useSameOgImage ? (
                <div className="flex items-stretch gap-3 rounded-sm border border-charcoal/15 bg-cream-dark/40 px-3 py-2.5">
                  <div className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-sm border border-charcoal/10 bg-[#f4f2ef]">
                    {card.coverImage?.trim() ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={card.coverImage}
                        alt=""
                        className="max-h-full max-w-full object-contain"
                      />
                    ) : (
                      <span className="px-2 text-center text-[0.65rem] text-charcoal/40">
                        No cover
                      </span>
                    )}
                  </div>
                  <p className="self-center text-sm text-charcoal/70">
                    {card.coverImage?.trim()
                      ? "Using the cover image from Page content."
                      : "Add a cover image above to use it here."}
                  </p>
                </div>
              ) : (
                <MediaField
                  label=""
                  hint=""
                  value={card.ogImage ?? ""}
                  onChange={(ogImage) =>
                    setCard({ ...card, ogImage: ogImage || undefined })
                  }
                  alt={card.ogImageAlt ?? ""}
                  onAltChange={(ogImageAlt) =>
                    setCard({
                      ...card,
                      ogImageAlt: ogImageAlt.trim() || undefined,
                    })
                  }
                  suggestedAlt={coverAltFor(card.title)}
                />
              )}
            </div>
          </div>
          <div className="md:col-span-2">
            <Field
              label="Meta description"
              id="seoDescription"
              hint={`The snippet Google shows in search results. Max ${PROJECT_SEO_DESCRIPTION_MAX} characters.`}
            >
              <div className="space-y-2">
                <UseSameCheckbox
                  id="seoDescriptionSameAsSummary"
                  checked={useSameMetaDescription}
                  onChange={(checked) => {
                    setUseSameMetaDescription(checked);
                    if (checked) {
                      setCard({ ...card, seoDescription: undefined });
                      return;
                    }
                    setCard({ ...card, seoDescription: card.summary });
                  }}
                >
                  Same as card summary
                </UseSameCheckbox>
                {useSameMetaDescription ? (
                  <SeoFallbackPreview
                    value={card.summary}
                    max={PROJECT_SEO_DESCRIPTION_MAX}
                    emptyLabel="Add a card summary above"
                  />
                ) : (
                  <>
                    <TextArea
                      id="seoDescription"
                      rows={3}
                      maxLength={PROJECT_SEO_DESCRIPTION_MAX}
                      value={card.seoDescription ?? ""}
                      onChange={(e) =>
                        setCard({ ...card, seoDescription: e.target.value })
                      }
                      placeholder="Custom meta description"
                    />
                    <CharCount
                      value={card.seoDescription ?? ""}
                      max={PROJECT_SEO_DESCRIPTION_MAX}
                    />
                  </>
                )}
              </div>
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
