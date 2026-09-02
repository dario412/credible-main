"use client";

import { useState } from "react";

import { MediaField } from "@/components/media-library";
import { RichTextEditor } from "@/components/rich-text-field";
import { Button, Field, TextArea, TextInput } from "@/components/ui";
import {
  emptyDeliverableItem,
  emptyStatsItem,
  newCaseStudyBlock,
  type CaseStudyBlock,
} from "@/lib/case-study-content";

type BlockType = CaseStudyBlock["type"];

const ADD_OPTIONS: { type: BlockType; label: string }[] = [
  { type: "p", label: "Paragraph" },
  { type: "richtext", label: "Rich text" },
  { type: "h2", label: "Heading 2" },
  { type: "h3", label: "Heading 3" },
  { type: "quoteInline", label: "Inline quote" },
  { type: "quoteFull", label: "Full-width quote" },
  { type: "stats", label: "Stats" },
  { type: "deliverables", label: "Deliverables" },
  { type: "ul", label: "Bullet list" },
];

function blockLabel(type: BlockType) {
  return ADD_OPTIONS.find((o) => o.type === type)?.label ?? type;
}

export function CaseStudyBlockEditor({
  value,
  onChange,
}: {
  value: CaseStudyBlock[];
  onChange: (blocks: CaseStudyBlock[]) => void;
}) {
  const [blocks, setBlocks] = useState(value);

  function commit(next: CaseStudyBlock[]) {
    setBlocks(next);
    onChange(next);
  }

  function updateAt(index: number, block: CaseStudyBlock) {
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
    commit([...blocks, newCaseStudyBlock(type)]);
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-sm font-medium text-charcoal">Content blocks</p>
          <p className="mt-0.5 text-xs text-muted">
            Add, reorder, or remove sections. Only blocks you add appear on the
            live page.
          </p>
        </div>
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
          No blocks yet. Add a heading or paragraph to start the story.
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

            {block.type === "quoteInline" ? (
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

            {block.type === "quoteFull" ? (
              <div className="space-y-3">
                <TextArea
                  value={block.text}
                  rows={4}
                  onChange={(e) =>
                    updateAt(index, { ...block, text: e.target.value })
                  }
                  placeholder="Full-width quote…"
                />
                <div className="grid gap-3 md:grid-cols-2">
                  <TextInput
                    value={block.name}
                    onChange={(e) =>
                      updateAt(index, { ...block, name: e.target.value })
                    }
                    placeholder="Name"
                  />
                  <TextInput
                    value={block.role}
                    onChange={(e) =>
                      updateAt(index, { ...block, role: e.target.value })
                    }
                    placeholder="Role / title"
                  />
                </div>
              </div>
            ) : null}

            {block.type === "ul" ? (
              <TextArea
                value={block.items.join("\n")}
                rows={4}
                onChange={(e) =>
                  updateAt(index, {
                    ...block,
                    items: e.target.value.split("\n"),
                  })
                }
                placeholder={"One bullet per line\nSecond item"}
              />
            ) : null}

            {block.type === "stats" ? (
              <div className="space-y-4">
                <Field label="Section heading (optional)" id={`stats-h-${index}`}>
                  <TextInput
                    id={`stats-h-${index}`}
                    value={block.heading ?? ""}
                    onChange={(e) =>
                      updateAt(index, { ...block, heading: e.target.value })
                    }
                    placeholder="Leave blank if an H2 sits above"
                  />
                </Field>
                <ul className="space-y-3">
                  {block.items.map((item, itemIndex) => (
                    <li
                      key={itemIndex}
                      className="space-y-2 rounded-sm border border-charcoal/8 bg-[#FBF8F5] p-3"
                    >
                      <div className="grid gap-2 md:grid-cols-3">
                        <TextInput
                          value={item.value}
                          onChange={(e) => {
                            const items = block.items.map((row, i) =>
                              i === itemIndex
                                ? { ...row, value: e.target.value }
                                : row,
                            );
                            updateAt(index, { ...block, items });
                          }}
                          placeholder="Value (e.g. 6 or $4.2M)"
                        />
                        <TextInput
                          value={item.label ?? ""}
                          onChange={(e) => {
                            const items = block.items.map((row, i) =>
                              i === itemIndex
                                ? { ...row, label: e.target.value }
                                : row,
                            );
                            updateAt(index, { ...block, items });
                          }}
                          placeholder="Label"
                        />
                        <TextInput
                          value={item.caption}
                          onChange={(e) => {
                            const items = block.items.map((row, i) =>
                              i === itemIndex
                                ? { ...row, caption: e.target.value }
                                : row,
                            );
                            updateAt(index, { ...block, items });
                          }}
                          placeholder="Caption"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() =>
                          updateAt(index, {
                            ...block,
                            items: block.items.filter((_, i) => i !== itemIndex),
                          })
                        }
                        className="text-xs text-danger hover:underline"
                      >
                        Remove row
                      </button>
                    </li>
                  ))}
                </ul>
                <Button
                  type="button"
                  variant="secondary"
                  className="px-3! py-2! text-xs"
                  onClick={() =>
                    updateAt(index, {
                      ...block,
                      items: [...block.items, emptyStatsItem()],
                    })
                  }
                >
                  Add stat row
                </Button>
              </div>
            ) : null}

            {block.type === "deliverables" ? (
              <div className="space-y-4">
                <Field
                  label="Section heading (optional)"
                  id={`del-h-${index}`}
                >
                  <TextInput
                    id={`del-h-${index}`}
                    value={block.heading ?? ""}
                    onChange={(e) =>
                      updateAt(index, { ...block, heading: e.target.value })
                    }
                    placeholder="Leave blank if an H2 sits above"
                  />
                </Field>
                <Field label="Intro (optional)" id={`del-intro-${index}`}>
                  <TextArea
                    id={`del-intro-${index}`}
                    rows={2}
                    value={(block.intro ?? []).join("\n\n")}
                    onChange={(e) =>
                      updateAt(index, {
                        ...block,
                        intro: e.target.value
                          .split(/\n\s*\n/)
                          .map((p) => p.trim())
                          .filter(Boolean),
                      })
                    }
                    placeholder="Optional intro paragraphs — blank line between"
                  />
                </Field>
                <ul className="space-y-3">
                  {block.items.map((item, itemIndex) => (
                    <li
                      key={itemIndex}
                      className="space-y-3 rounded-sm border border-charcoal/8 bg-[#FBF8F5] p-3"
                    >
                      <div className="grid gap-2 md:grid-cols-2">
                        <TextInput
                          value={item.title}
                          onChange={(e) => {
                            const items = block.items.map((row, i) =>
                              i === itemIndex
                                ? { ...row, title: e.target.value }
                                : row,
                            );
                            updateAt(index, { ...block, items });
                          }}
                          placeholder="Title"
                        />
                        <TextInput
                          value={item.label}
                          onChange={(e) => {
                            const items = block.items.map((row, i) =>
                              i === itemIndex
                                ? { ...row, label: e.target.value }
                                : row,
                            );
                            updateAt(index, { ...block, items });
                          }}
                          placeholder="Client / label"
                        />
                      </div>
                      <TextInput
                        value={item.meta}
                        onChange={(e) => {
                          const items = block.items.map((row, i) =>
                            i === itemIndex
                              ? { ...row, meta: e.target.value }
                              : row,
                          );
                          updateAt(index, { ...block, items });
                        }}
                        placeholder="Meta line"
                      />
                      <MediaField
                        label="Logo"
                        value={item.logo}
                        onChange={(logo) => {
                          const items = block.items.map((row, i) =>
                            i === itemIndex ? { ...row, logo } : row,
                          );
                          updateAt(index, { ...block, items });
                        }}
                      />
                      <button
                        type="button"
                        onClick={() =>
                          updateAt(index, {
                            ...block,
                            items: block.items.filter((_, i) => i !== itemIndex),
                          })
                        }
                        className="text-xs text-danger hover:underline"
                      >
                        Remove card
                      </button>
                    </li>
                  ))}
                </ul>
                <Button
                  type="button"
                  variant="secondary"
                  className="px-3! py-2! text-xs"
                  onClick={() =>
                    updateAt(index, {
                      ...block,
                      items: [...block.items, emptyDeliverableItem()],
                    })
                  }
                >
                  Add deliverable
                </Button>
              </div>
            ) : null}
          </li>
        ))}
      </ul>
    </div>
  );
}
