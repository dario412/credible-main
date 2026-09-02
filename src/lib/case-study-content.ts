import type {
  CaseStudyCard,
  CaseStudyDeliverable,
  CaseStudyQuote,
  CaseStudyResult,
  CaseStudyStory,
} from "@/lib/case-studies";
import { CASE_STUDY_LOGO } from "@/lib/case-studies";
import { sanitizeRichTextHtml } from "@/lib/rich-text";

export type CaseStudyStatsItem = {
  value: string;
  caption: string;
  label?: string;
};

export type CaseStudyBlock =
  | { type: "p"; text: string }
  | { type: "richtext"; html: string }
  | { type: "h2"; text: string; id: string }
  | { type: "h3"; text: string; id: string }
  | { type: "quoteInline"; text: string; attribution?: string }
  | { type: "quoteFull"; text: string; name: string; role: string }
  | {
      type: "stats";
      heading?: string;
      items: CaseStudyStatsItem[];
    }
  | {
      type: "deliverables";
      heading?: string;
      intro?: string[];
      items: CaseStudyDeliverable[];
    }
  | { type: "ul"; items: string[] };

export type CaseStudyTocItem = { id: string; text: string };

function slugify(text: string) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function asString(value: unknown, fallback = "") {
  return typeof value === "string" ? value : fallback;
}

function asStringList(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value.filter((item): item is string => typeof item === "string");
}

export function ensureBlockIds(blocks: CaseStudyBlock[]): CaseStudyBlock[] {
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

export function tocFromBlocks(blocks: CaseStudyBlock[]): CaseStudyTocItem[] {
  return blocks
    .filter((b): b is Extract<CaseStudyBlock, { type: "h2" }> => b.type === "h2")
    .map((b) => ({ id: b.id, text: b.text }));
}

function parseStatsItems(raw: unknown): CaseStudyStatsItem[] {
  if (!Array.isArray(raw)) return [];
  const items: CaseStudyStatsItem[] = [];
  for (const entry of raw) {
    if (!entry || typeof entry !== "object") continue;
    const row = entry as Record<string, unknown>;
    const value = asString(row.value).trim();
    const caption = asString(row.caption).trim();
    if (!value && !caption) continue;
    items.push({
      value,
      caption,
      label: asString(row.label).trim() || undefined,
    });
  }
  return items;
}

function parseDeliverableItems(raw: unknown): CaseStudyDeliverable[] {
  if (!Array.isArray(raw)) return [];
  const items: CaseStudyDeliverable[] = [];
  for (const entry of raw) {
    if (!entry || typeof entry !== "object") continue;
    const row = entry as Record<string, unknown>;
    const title = asString(row.title).trim();
    if (!title) continue;
    items.push({
      label: asString(row.label).trim() || title,
      title,
      meta: asString(row.meta).trim(),
      logo: asString(row.logo).trim() || CASE_STUDY_LOGO,
    });
  }
  return items;
}

export function parseCaseStudyBlocks(raw: unknown): CaseStudyBlock[] | null {
  if (!Array.isArray(raw) || raw.length === 0) return null;
  const blocks: CaseStudyBlock[] = [];

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
    } else if (type === "quoteInline" && typeof block.text === "string") {
      blocks.push({
        type: "quoteInline",
        text: block.text,
        attribution:
          typeof block.attribution === "string" ? block.attribution : undefined,
      });
    } else if (type === "quoteFull" && typeof block.text === "string") {
      blocks.push({
        type: "quoteFull",
        text: block.text,
        name: asString(block.name),
        role: asString(block.role),
      });
    } else if (type === "stats") {
      const items = parseStatsItems(block.items);
      if (items.length === 0) continue;
      blocks.push({
        type: "stats",
        heading: asString(block.heading).trim() || undefined,
        items,
      });
    } else if (type === "deliverables") {
      const items = parseDeliverableItems(block.items);
      if (items.length === 0) continue;
      const intro = asStringList(block.intro).map((s) => s.trim()).filter(Boolean);
      blocks.push({
        type: "deliverables",
        heading: asString(block.heading).trim() || undefined,
        intro: intro.length > 0 ? intro : undefined,
        items,
      });
    } else if (type === "ul" && Array.isArray(block.items)) {
      const items = asStringList(block.items).map((s) => s.trim()).filter(Boolean);
      if (items.length === 0) continue;
      blocks.push({ type: "ul", items });
    }
  }

  return blocks.length > 0 ? ensureBlockIds(blocks) : null;
}

/** Convert legacy quote / story / results into the block stream. */
export function legacyStoryToBlocks(study: {
  quote?: CaseStudyQuote;
  story?: CaseStudyStory;
  results?: CaseStudyResult[];
}): CaseStudyBlock[] {
  const blocks: CaseStudyBlock[] = [];
  const quote = study.quote;
  const story = study.story;
  const results = study.results ?? [];

  if (quote?.text?.trim()) {
    blocks.push({
      type: "quoteFull",
      text: quote.text,
      name: quote.name ?? "",
      role: quote.role ?? "",
    });
  }

  if (story?.challenge?.length) {
    blocks.push({ type: "h2", text: "The challenge", id: "challenge" });
    for (const text of story.challenge) {
      if (text.trim()) blocks.push({ type: "p", text });
    }
  }

  if (story?.approach?.length) {
    blocks.push({ type: "h2", text: "Our approach", id: "approach" });
    for (const text of story.approach) {
      if (text.trim()) blocks.push({ type: "p", text });
    }
  }

  const outcomesHeading =
    story?.outcomesHeadline?.trim() ||
    (story?.outcomes?.length || results.length ? "Outcomes" : "");
  if (outcomesHeading || story?.outcomes?.length || results.length) {
    blocks.push({
      type: "h2",
      text: outcomesHeading || "Outcomes",
      id: "outcomes",
    });
    for (const text of story?.outcomes ?? []) {
      if (text.trim()) blocks.push({ type: "p", text });
    }
    if (results.length > 0) {
      blocks.push({
        type: "stats",
        items: results.map((r) => ({
          value: r.value,
          caption: r.caption,
          label: r.label,
        })),
      });
    }
  }

  if (story?.deliverables?.length) {
    blocks.push({
      type: "h2",
      text: story.deliverablesHeadline?.trim() || "Deliverables",
      id: "deliverables",
    });
    blocks.push({
      type: "deliverables",
      intro: story.deliverablesIntro,
      items: story.deliverables,
    });
  }

  return ensureBlockIds(blocks);
}

export function resolveCaseStudyBlocks(study: CaseStudyCard): {
  blocks: CaseStudyBlock[];
  toc: CaseStudyTocItem[];
} {
  const fromJson = parseCaseStudyBlocks(study.blocks);
  const blocks = fromJson ?? legacyStoryToBlocks(study);
  return { blocks, toc: tocFromBlocks(blocks) };
}

export function emptyStatsItem(): CaseStudyStatsItem {
  return { value: "", caption: "", label: "" };
}

export function emptyDeliverableItem(): CaseStudyDeliverable {
  return {
    label: "",
    title: "",
    meta: "",
    logo: CASE_STUDY_LOGO,
  };
}

export function newCaseStudyBlock(
  type: CaseStudyBlock["type"],
): CaseStudyBlock {
  switch (type) {
    case "h2":
      return { type: "h2", text: "", id: `h2-${Date.now()}` };
    case "h3":
      return { type: "h3", text: "", id: `h3-${Date.now()}` };
    case "quoteInline":
      return { type: "quoteInline", text: "", attribution: "" };
    case "quoteFull":
      return { type: "quoteFull", text: "", name: "", role: "" };
    case "stats":
      return { type: "stats", heading: "", items: [emptyStatsItem()] };
    case "deliverables":
      return {
        type: "deliverables",
        heading: "",
        intro: [],
        items: [emptyDeliverableItem()],
      };
    case "ul":
      return { type: "ul", items: [""] };
    case "richtext":
      return { type: "richtext", html: "" };
    case "p":
    default:
      return { type: "p", text: "" };
  }
}
