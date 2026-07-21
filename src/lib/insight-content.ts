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

export function readingTime(body: string) {
  const words = body.trim().split(/\s+/).length;
  return Math.max(1, Math.round(words / 200));
}

export type InsightBlock =
  | { type: "p"; text: string }
  | { type: "h2"; text: string; id: string }
  | { type: "h3"; text: string; id: string }
  | { type: "quote"; text: string; attribution?: string }
  | { type: "ul"; items: string[] };

export type InsightTocItem = { id: string; text: string };

function slugify(text: string) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

/** Lightweight markdown: ## / ### / > / - lists / paragraphs */
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
    if (listItems.length === 0) return;
    blocks.push({ type: "ul", items: [...listItems] });
    listItems = [];
  }

  for (const raw of lines) {
    const line = raw.trimEnd();
    const trimmed = line.trim();

    if (!trimmed) {
      flushParagraph();
      flushList();
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

    if (trimmed.startsWith("> ")) {
      flushParagraph();
      flushList();
      const content = trimmed.slice(2).trim();
      const attrMatch = content.match(/^(.*)\s+[—–-]\s+(.+)$/);
      if (attrMatch) {
        blocks.push({
          type: "quote",
          text: attrMatch[1].replace(/^["“]|["”]$/g, "").trim(),
          attribution: attrMatch[2].trim(),
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
      listItems.push(trimmed.slice(2).trim());
      continue;
    }

    flushList();
    paragraph.push(trimmed);
  }

  flushParagraph();
  flushList();

  return { blocks, toc };
}
