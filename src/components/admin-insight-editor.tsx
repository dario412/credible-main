"use client";

import { useState } from "react";

import { MediaField } from "@/components/media-library";
import { RichTextEditor } from "@/components/rich-text-field";
import { Button, Field, TextArea, TextInput } from "@/components/ui";
import type { InsightBlock } from "@/lib/insight-content";
import { coverAltFor } from "@/lib/image-alt";
import { cn } from "@/lib/utils";

type BlockType = InsightBlock["type"];

function newBlock(type: BlockType): InsightBlock {
  switch (type) {
    case "h2":
      return { type: "h2", text: "", id: `h2-${Date.now()}` };
    case "h3":
      return { type: "h3", text: "", id: `h3-${Date.now()}` };
    case "quote":
      return { type: "quote", text: "", attribution: "" };
    case "ul":
      return { type: "ul", items: [""] };
    case "ol":
      return { type: "ol", items: [""] };
    case "image":
      return { type: "image", src: "", alt: "", caption: "" };
    case "callout":
      return { type: "callout", text: "", label: "" };
    case "hr":
      return { type: "hr" };
    case "richtext":
      return { type: "richtext", html: "" };
    case "p":
    default:
      return { type: "p", text: "" };
  }
}

const ADD_OPTIONS: { type: BlockType; label: string }[] = [
  { type: "p", label: "Paragraph" },
  { type: "richtext", label: "Rich text" },
  { type: "h2", label: "Heading 2" },
  { type: "h3", label: "Heading 3" },
  { type: "quote", label: "Quote" },
  { type: "ul", label: "Bullet list" },
  { type: "ol", label: "Numbered list" },
  { type: "image", label: "Image" },
  { type: "callout", label: "Callout" },
  { type: "hr", label: "Divider" },
];

function blockLabel(type: BlockType) {
  return ADD_OPTIONS.find((o) => o.type === type)?.label ?? type;
}

export function InsightBlockEditor({
  value,
  onChange,
}: {
  value: InsightBlock[];
  onChange: (blocks: InsightBlock[]) => void;
}) {
  const [blocks, setBlocks] = useState(value);

  function commit(next: InsightBlock[]) {
    setBlocks(next);
    onChange(next);
  }

  function updateAt(index: number, block: InsightBlock) {
    commit(blocks.map((b, i) => (i === index ? block : b)));
  }

  function move(index: number, delta: number) {
    const target = index + delta;
    if (target < 0 || target >= blocks.length) return;
    const next = [...blocks];
    const [item] = next.splice(index, 1);
    next.splice(target, 0, item!);
    commit(next);
  }

  function remove(index: number) {
    commit(blocks.filter((_, i) => i !== index));
  }

  function add(type: BlockType) {
    commit([...blocks, newBlock(type)]);
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm font-medium text-charcoal">Article blocks</p>
        <div className="flex flex-wrap gap-2">
          {ADD_OPTIONS.map((opt) => (
            <button
              key={opt.type}
              type="button"
              onClick={() => add(opt.type)}
              className="rounded-sm border border-charcoal/15 bg-white px-2.5 py-1 text-[0.75rem] font-medium text-charcoal/70 transition-colors hover:border-charcoal/30 hover:text-charcoal"
            >
              + {opt.label}
            </button>
          ))}
        </div>
      </div>

      {blocks.length === 0 ? (
        <p className="rounded-sm border border-dashed border-charcoal/15 bg-white px-4 py-8 text-center text-sm text-muted">
          No blocks yet. Add a paragraph to start writing.
        </p>
      ) : null}

      <ul className="space-y-3">
        {blocks.map((block, index) => (
          <li
            key={`${block.type}-${index}`}
            className="rounded-sm border border-charcoal/10 bg-white p-4"
          >
            <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
              <span className="text-[0.65rem] font-medium tracking-[0.12em] text-charcoal/45 uppercase">
                {blockLabel(block.type)}
              </span>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => move(index, -1)}
                  className="rounded px-2 py-1 text-xs text-muted hover:bg-charcoal/5 hover:text-charcoal"
                  aria-label="Move up"
                >
                  ↑
                </button>
                <button
                  type="button"
                  onClick={() => move(index, 1)}
                  className="rounded px-2 py-1 text-xs text-muted hover:bg-charcoal/5 hover:text-charcoal"
                  aria-label="Move down"
                >
                  ↓
                </button>
                <button
                  type="button"
                  onClick={() => remove(index)}
                  className="rounded px-2 py-1 text-xs text-danger hover:bg-danger/5"
                >
                  Remove
                </button>
              </div>
            </div>

            {block.type === "richtext" ? (
              <RichTextEditor
                value={block.html}
                onChange={(html) => updateAt(index, { ...block, html })}
                placeholder="Write rich text with links, bold, and italic…"
              />
            ) : null}

            {block.type === "p" || block.type === "h2" || block.type === "h3" ? (
              <TextArea
                value={block.text}
                rows={block.type === "p" ? 4 : 2}
                onChange={(e) =>
                  updateAt(index, { ...block, text: e.target.value })
                }
                placeholder={
                  block.type === "p" ? "Write the paragraph…" : "Heading text…"
                }
              />
            ) : null}

            {block.type === "quote" ? (
              <div className="space-y-3">
                <TextArea
                  value={block.text}
                  rows={3}
                  onChange={(e) =>
                    updateAt(index, { ...block, text: e.target.value })
                  }
                  placeholder="Quote text…"
                />
                <TextInput
                  value={block.attribution ?? ""}
                  onChange={(e) =>
                    updateAt(index, {
                      ...block,
                      attribution: e.target.value,
                    })
                  }
                  placeholder="Attribution (optional)"
                />
              </div>
            ) : null}

            {block.type === "ul" || block.type === "ol" ? (
              <TextArea
                value={block.items.join("\n")}
                rows={4}
                onChange={(e) =>
                  updateAt(index, {
                    ...block,
                    items: e.target.value.split("\n"),
                  })
                }
                placeholder={
                  block.type === "ol"
                    ? "One item per line\nSecond item"
                    : "One bullet per line\nSecond item"
                }
              />
            ) : null}

            {block.type === "image" ? (
              <div className="space-y-3">
                <MediaField
                  label="Image"
                  value={block.src}
                  onChange={(src) => updateAt(index, { ...block, src })}
                  alt={block.alt ?? ""}
                  onAltChange={(alt) => updateAt(index, { ...block, alt })}
                  altHint="Required for accessibility. Describe what the image shows."
                  hint="Pick from the media library or paste a URL."
                />
                <TextInput
                  value={block.caption ?? ""}
                  onChange={(e) =>
                    updateAt(index, { ...block, caption: e.target.value })
                  }
                  placeholder="Caption (optional)"
                />
              </div>
            ) : null}

            {block.type === "callout" ? (
              <div className="space-y-3">
                <TextInput
                  value={block.label ?? ""}
                  onChange={(e) =>
                    updateAt(index, { ...block, label: e.target.value })
                  }
                  placeholder="Label (optional) — e.g. Key takeaway"
                />
                <TextArea
                  value={block.text}
                  rows={3}
                  onChange={(e) =>
                    updateAt(index, { ...block, text: e.target.value })
                  }
                  placeholder="Callout text…"
                />
              </div>
            ) : null}

            {block.type === "hr" ? (
              <p className="text-sm text-muted">
                Horizontal divider — no extra fields.
              </p>
            ) : null}
          </li>
        ))}
      </ul>
    </div>
  );
}

export function InsightEditorForm({
  id,
  initialMeta,
  initialBlocks,
  saveAction,
}: {
  id?: string;
  initialMeta: {
    title: string;
    slug: string;
    excerpt: string;
    category: string;
    coverImage: string;
    coverImageAlt: string;
    seoTitle: string;
    seoDescription: string;
    publishedAt: string;
  };
  initialBlocks: InsightBlock[];
  saveAction: typeof import("@/lib/actions/admin-cms").saveInsight;
}) {
  const [meta, setMeta] = useState(initialMeta);
  const [blocks, setBlocks] = useState(initialBlocks);
  const [message, setMessage] = useState("");
  const [ok, setOk] = useState(false);
  const [pending, setPending] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setPending(true);
    setMessage("");
    const result = await saveAction({ id, meta, blocks });
    setOk(result.ok);
    setMessage(result.message);
    setPending(false);
    if (result.ok && result.slug && !id) {
      window.location.href = `/admin/insights/${result.slug}`;
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-8">
      <div className="grid gap-4 md:grid-cols-2">
        <Field label="Title" id="title">
          <TextInput
            id="title"
            value={meta.title}
            onChange={(e) => setMeta({ ...meta, title: e.target.value })}
            required
          />
        </Field>
        <Field label="Slug" id="slug">
          <TextInput
            id="slug"
            value={meta.slug}
            onChange={(e) => setMeta({ ...meta, slug: e.target.value })}
            required
          />
        </Field>
        <Field label="Category" id="category">
          <TextInput
            id="category"
            value={meta.category}
            onChange={(e) => setMeta({ ...meta, category: e.target.value })}
            required
          />
        </Field>
        <Field label="Published" id="publishedAt">
          <TextInput
            id="publishedAt"
            type="datetime-local"
            value={meta.publishedAt}
            onChange={(e) => setMeta({ ...meta, publishedAt: e.target.value })}
            required
          />
        </Field>
        <div className="md:col-span-2">
          <Field label="Excerpt" id="excerpt">
            <TextArea
              id="excerpt"
              rows={3}
              value={meta.excerpt}
              onChange={(e) => setMeta({ ...meta, excerpt: e.target.value })}
              required
            />
          </Field>
        </div>
        <MediaField
          label="Cover image"
          value={meta.coverImage ?? ""}
          onChange={(coverImage) => setMeta({ ...meta, coverImage })}
          alt={meta.coverImageAlt ?? ""}
          onAltChange={(coverImageAlt) =>
            setMeta({ ...meta, coverImageAlt })
          }
          suggestedAlt={coverAltFor(meta.title)}
        />
        <Field label="SEO title" id="seoTitle">
          <TextInput
            id="seoTitle"
            value={meta.seoTitle}
            onChange={(e) => setMeta({ ...meta, seoTitle: e.target.value })}
          />
        </Field>
        <div className="md:col-span-2">
          <Field label="SEO description" id="seoDescription">
            <TextArea
              id="seoDescription"
              rows={2}
              value={meta.seoDescription}
              onChange={(e) =>
                setMeta({ ...meta, seoDescription: e.target.value })
              }
            />
          </Field>
        </div>
      </div>

      <InsightBlockEditor value={blocks} onChange={setBlocks} />

      <div
        className={cn(
          "sticky bottom-4 z-10 flex flex-wrap items-center gap-3 rounded-sm border border-charcoal/10 bg-white/95 px-4 py-3 shadow-[0_10px_30px_rgba(28,26,23,0.08)] backdrop-blur",
        )}
      >
        <Button type="submit" variant="primary" disabled={pending}>
          {pending ? "Saving…" : "Save insight"}
        </Button>
        {meta.slug ? (
          <a
            href={`/insights/${meta.slug}`}
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
