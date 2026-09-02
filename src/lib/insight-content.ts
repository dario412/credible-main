import { coverAltFor, resolveImageAlt } from "@/lib/image-alt";
import { richTextToPlainText, sanitizeRichTextHtml } from "@/lib/rich-text";

export const INSIGHT_COVER_BY_SLUG: Record<string, string> = {
  "why-creator-label-doesnt-fit-b2b": "/images/insights/operator-creator.jpg",
  "rise-of-the-creator-marketing-manager":
    "/images/insights/expert-economy.jpg",
  "four-tier-revenue-pyramid": "/images/insights/beyond-keynote.jpg",
  "superstar-revenue-mix-2025": "/images/insights/operator-creator.jpg",
  "conversation-with-alex-lieberman": "/images/insights/expert-economy.jpg",
  "pr-agencies-best-buyers": "/images/insights/beyond-keynote.jpg",
  "how-to-brief-a-b2b-creator": "/images/insights/operator-creator.jpg",
  "when-to-use-expert-creators-vs-executives":
    "/images/insights/expert-economy.jpg",
  "category-narrative-before-the-campaign":
    "/images/insights/beyond-keynote.jpg",
  "what-b2b-buyers-actually-trust": "/images/insights/operator-creator.jpg",
  "inside-the-creator-briefing-room": "/images/insights/beyond-keynote.jpg",
  "pricing-ambassador-retainers": "/images/insights/expert-economy.jpg",
  "conversation-with-lenny-rachitsky": "/images/insights/operator-creator.jpg",
  "conversation-with-emily-kramer": "/images/insights/beyond-keynote.jpg",
  "format-roi-benchmarks-2025": "/images/insights/expert-economy.jpg",
  "audience-overlap-across-expert-tiers":
    "/images/insights/beyond-keynote.jpg",
};

export function insightCover(insight: {
  slug: string;
  coverImage: string | null;
}) {
  return insight.coverImage ?? INSIGHT_COVER_BY_SLUG[insight.slug] ?? null;
}

export function insightCoverAlt(insight: {
  title: string;
  coverImageAlt?: string | null;
}): string {
  return resolveImageAlt(insight.coverImageAlt, coverAltFor(insight.title));
}

export function readingTime(body: string) {
  const words = body.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 170));
}

export function readingTimeFromBlocks(blocks: InsightBlock[]) {
  return readingTime(blocksToPlainText(blocks));
}

export type InsightBlock =
  | { type: "p"; text: string }
  | { type: "richtext"; html: string }
  | { type: "h2"; text: string; id: string }
  | { type: "h3"; text: string; id: string }
  | { type: "quote"; text: string; attribution?: string }
  | { type: "ul"; items: string[] }
  | { type: "ol"; items: string[] }
  | { type: "image"; src: string; alt?: string; caption?: string }
  | { type: "callout"; text: string; label?: string }
  | { type: "hr" };

export type InsightTocItem = { id: string; text: string };

function slugify(text: string) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export function blocksToPlainText(blocks: InsightBlock[]): string {
  return blocks
    .map((block) => {
      switch (block.type) {
        case "ul":
        case "ol":
          return block.items.join(" ");
        case "quote":
          return `${block.text} ${block.attribution ?? ""}`;
        case "image":
          return [block.alt, block.caption].filter(Boolean).join(" ");
        case "callout":
          return `${block.label ?? ""} ${block.text}`;
        case "hr":
          return "";
        case "richtext":
          return richTextToPlainText(block.html);
        default:
          return "text" in block ? block.text : "";
      }
    })
    .join(" ");
}

export function blocksToMarkdown(blocks: InsightBlock[]): string {
  return blocks
    .map((block) => {
      switch (block.type) {
        case "h2":
          return `## ${block.text}`;
        case "h3":
          return `### ${block.text}`;
        case "quote":
          return block.attribution
            ? `> ${block.text} — ${block.attribution}`
            : `> ${block.text}`;
        case "ul":
          return block.items.map((item) => `- ${item}`).join("\n");
        case "ol":
          return block.items
            .map((item, i) => `${i + 1}. ${item}`)
            .join("\n");
        case "image":
          return `![${block.alt ?? ""}](${block.src})${
            block.caption ? `\n*${block.caption}*` : ""
          }`;
        case "callout":
          return block.label
            ? `> **${block.label}**\n> ${block.text}`
            : `> ${block.text}`;
        case "hr":
          return "---";
        case "richtext":
          return richTextToPlainText(block.html);
        case "p":
        default:
          return "text" in block ? block.text : "";
      }
    })
    .join("\n\n");
}

export function tocFromBlocks(blocks: InsightBlock[]): InsightTocItem[] {
  return blocks
    .filter((b): b is Extract<InsightBlock, { type: "h2" }> => b.type === "h2")
    .map((b) => ({ id: b.id, text: b.text }));
}

export function ensureBlockIds(blocks: InsightBlock[]): InsightBlock[] {
  const usedIds = new Map<string, number>();
  function uniqueId(text: string) {
    const base = slugify(text) || "section";
    const count = usedIds.get(base) ?? 0;
    usedIds.set(base, count + 1);
    return count === 0 ? base : `${base}-${count + 1}`;
  }

  return blocks.map((block) => {
    if (block.type === "h2" || block.type === "h3") {
      return { ...block, id: block.id || uniqueId(block.text) };
    }
    return block;
  });
}

export function parseInsightBlocks(raw: unknown): InsightBlock[] | null {
  if (!Array.isArray(raw) || raw.length === 0) return null;
  const blocks: InsightBlock[] = [];
  for (const item of raw) {
    if (!item || typeof item !== "object") continue;
    const block = item as Record<string, unknown>;
    const type = block.type;
    if (type === "p" && typeof block.text === "string") {
      blocks.push({ type: "p", text: block.text });
    } else if (type === "richtext" && typeof block.html === "string") {
      blocks.push({
        type: "richtext",
        html: sanitizeRichTextHtml(block.html),
      });
    } else if (
      (type === "h2" || type === "h3") &&
      typeof block.text === "string"
    ) {
      blocks.push({
        type,
        text: block.text,
        id: typeof block.id === "string" ? block.id : slugify(block.text),
      });
    } else if (type === "quote" && typeof block.text === "string") {
      blocks.push({
        type: "quote",
        text: block.text,
        attribution:
          typeof block.attribution === "string" ? block.attribution : undefined,
      });
    } else if (type === "ul" && Array.isArray(block.items)) {
      blocks.push({
        type: "ul",
        items: block.items.filter((i): i is string => typeof i === "string"),
      });
    } else if (type === "ol" && Array.isArray(block.items)) {
      blocks.push({
        type: "ol",
        items: block.items.filter((i): i is string => typeof i === "string"),
      });
    } else if (type === "image" && typeof block.src === "string" && block.src.trim()) {
      blocks.push({
        type: "image",
        src: block.src,
        alt: typeof block.alt === "string" ? block.alt : undefined,
        caption: typeof block.caption === "string" ? block.caption : undefined,
      });
    } else if (type === "callout" && typeof block.text === "string") {
      blocks.push({
        type: "callout",
        text: block.text,
        label: typeof block.label === "string" ? block.label : undefined,
      });
    } else if (type === "hr") {
      blocks.push({ type: "hr" });
    }
  }
  return blocks.length > 0 ? ensureBlockIds(blocks) : null;
}

/** Resolve blocks from CMS JSON or legacy markdown body. */
export function resolveInsightContent(insight: {
  body: string;
  blocks?: unknown;
}): { blocks: InsightBlock[]; toc: InsightTocItem[] } {
  const fromJson = parseInsightBlocks(insight.blocks);
  if (fromJson) {
    return { blocks: fromJson, toc: tocFromBlocks(fromJson) };
  }
  return parseInsightBody(insight.body);
}

/** Lightweight markdown: ## / ### / > / lists / images / --- / paragraphs */
export function parseInsightBody(body: string): {
  blocks: InsightBlock[];
  toc: InsightTocItem[];
} {
  const lines = body.replace(/\r\n/g, "\n").split("\n");
  const blocks: InsightBlock[] = [];
  const toc: InsightTocItem[] = [];
  const usedIds = new Map<string, number>();
  let paragraph: string[] = [];
  let listItems: string[] = [];
  let listKind: "ul" | "ol" | null = null;

  function uniqueId(text: string) {
    const base = slugify(text) || "section";
    const count = usedIds.get(base) ?? 0;
    usedIds.set(base, count + 1);
    return count === 0 ? base : `${base}-${count + 1}`;
  }

  function flushParagraph() {
    if (paragraph.length === 0) return;
    const text = paragraph.join(" ").trim();
    paragraph = [];
    if (!text) return;
    blocks.push({ type: "p", text });
  }

  function flushList() {
    if (listItems.length === 0 || !listKind) {
      listItems = [];
      listKind = null;
      return;
    }
    blocks.push({ type: listKind, items: [...listItems] });
    listItems = [];
    listKind = null;
  }

  for (const raw of lines) {
    const line = raw.trimEnd();
    const trimmed = line.trim();

    if (!trimmed) {
      flushParagraph();
      flushList();
      continue;
    }

    if (trimmed === "---") {
      flushParagraph();
      flushList();
      blocks.push({ type: "hr" });
      continue;
    }

    if (trimmed.startsWith("### ")) {
      flushParagraph();
      flushList();
      const text = trimmed.slice(4).trim();
      const id = uniqueId(text);
      blocks.push({ type: "h3", text, id });
      continue;
    }

    if (trimmed.startsWith("## ")) {
      flushParagraph();
      flushList();
      const text = trimmed.slice(3).trim();
      const id = uniqueId(text);
      blocks.push({ type: "h2", text, id });
      toc.push({ id, text });
      continue;
    }

    const imageMatch = trimmed.match(/^!\[([^\]]*)\]\(([^)]+)\)\s*$/);
    if (imageMatch) {
      flushParagraph();
      flushList();
      blocks.push({
        type: "image",
        src: imageMatch[2]!.trim(),
        alt: imageMatch[1]?.trim() || undefined,
      });
      continue;
    }

    if (trimmed.startsWith("> ")) {
      flushParagraph();
      flushList();
      const content = trimmed.slice(2).trim();
      const attrMatch = content.match(/^(.*)\s+[—–-]\s+(.+)$/);
      if (attrMatch) {
        blocks.push({
          type: "quote",
          text: attrMatch[1]!.replace(/^["“]|["”]$/g, "").trim(),
          attribution: attrMatch[2]!.trim(),
        });
      } else {
        blocks.push({
          type: "quote",
          text: content.replace(/^["“]|["”]$/g, "").trim(),
        });
      }
      continue;
    }

    if (trimmed.startsWith("- ") || trimmed.startsWith("* ")) {
      flushParagraph();
      if (listKind && listKind !== "ul") flushList();
      listKind = "ul";
      listItems.push(trimmed.slice(2).trim());
      continue;
    }

    const olMatch = trimmed.match(/^\d+\.\s+(.+)$/);
    if (olMatch) {
      flushParagraph();
      if (listKind && listKind !== "ol") flushList();
      listKind = "ol";
      listItems.push(olMatch[1]!.trim());
      continue;
    }

    flushList();
    paragraph.push(trimmed);
  }

  flushParagraph();
  flushList();

  return { blocks, toc };
}
