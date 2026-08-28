export type LegalBlock =
  | { type: "h2"; text: string; id: string }
  | { type: "h3"; text: string; id: string }
  | { type: "p"; text: string }
  | { type: "ul"; items: string[] }
  | { type: "ol"; items: string[] }
  | { type: "table"; headers: string[]; rows: string[][] }
  | { type: "hr" };

function slugify(text: string) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function isTableRow(line: string) {
  const trimmed = line.trim();
  return trimmed.startsWith("|") && trimmed.endsWith("|");
}

function isTableSeparator(line: string) {
  return /^\|\s*:?-+:?\s*(\|\s*:?-+:?\s*)+\|$/.test(line.trim());
}

function parseTableRow(line: string) {
  return line
    .trim()
    .replace(/^\|/, "")
    .replace(/\|$/, "")
    .split("|")
    .map((cell) => cell.trim());
}

export function parseLegalMarkdown(body: string): LegalBlock[] {
  const lines = body.replace(/\r\n/g, "\n").split("\n");
  const blocks: LegalBlock[] = [];
  const usedIds = new Map<string, number>();
  let paragraph: string[] = [];
  let listItems: string[] = [];
  let listKind: "ul" | "ol" | null = null;
  let tableRows: string[][] = [];

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
    if (text) blocks.push({ type: "p", text });
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

  function flushTable() {
    if (tableRows.length === 0) return;
    const [headerRow, ...bodyRows] = tableRows;
    tableRows = [];
    if (!headerRow) return;
    blocks.push({
      type: "table",
      headers: headerRow,
      rows: bodyRows,
    });
  }

  for (const raw of lines) {
    const line = raw.trimEnd();
    const trimmed = line.trim();

    if (isTableRow(trimmed)) {
      flushParagraph();
      flushList();
      if (!isTableSeparator(trimmed)) {
        tableRows.push(parseTableRow(trimmed));
      }
      continue;
    }

    flushTable();

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

    if (trimmed.startsWith("#### ")) {
      flushParagraph();
      flushList();
      blocks.push({ type: "p", text: `**${trimmed.slice(5).trim()}**` });
      continue;
    }

    if (trimmed.startsWith("### ")) {
      flushParagraph();
      flushList();
      const text = trimmed.slice(4).trim();
      blocks.push({ type: "h3", text, id: uniqueId(text) });
      continue;
    }

    if (trimmed.startsWith("## ")) {
      flushParagraph();
      flushList();
      const text = trimmed.slice(3).trim();
      blocks.push({ type: "h2", text, id: uniqueId(text) });
      continue;
    }

    if (trimmed.startsWith("# ")) {
      flushParagraph();
      flushList();
      continue;
    }

    const orderedMatch = trimmed.match(/^(\d+)\.\s+(.*)$/);
    if (orderedMatch) {
      flushParagraph();
      if (listKind !== "ol") {
        flushList();
        listKind = "ol";
      }
      listItems.push(orderedMatch[2]!.trim());
      continue;
    }

    if (trimmed.startsWith("* ") || trimmed.startsWith("- ")) {
      flushParagraph();
      if (listKind !== "ul") {
        flushList();
        listKind = "ul";
      }
      listItems.push(trimmed.slice(2).trim());
      continue;
    }

    paragraph.push(trimmed);
  }

  flushParagraph();
  flushList();
  flushTable();
  return blocks;
}

const inlineTokenPattern =
  /(\*\*[^*]+\*\*|\[[^\]]+\]\([^)]+\)|<https?:\/\/[^>]+>|https?:\/\/[^\s<]+[^\s<.,;:!?])/g;

export function splitLegalInline(text: string): Array<
  | { kind: "text"; value: string }
  | { kind: "bold"; value: string }
  | { kind: "link"; label: string; href: string }
> {
  const parts: Array<
    | { kind: "text"; value: string }
    | { kind: "bold"; value: string }
    | { kind: "link"; label: string; href: string }
  > = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = inlineTokenPattern.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push({ kind: "text", value: text.slice(lastIndex, match.index) });
    }

    const token = match[0]!;
    if (token.startsWith("**")) {
      parts.push({ kind: "bold", value: token.slice(2, -2) });
    } else if (token.startsWith("<http")) {
      const href = token.slice(1, -1);
      parts.push({ kind: "link", label: href, href });
    } else if (token.startsWith("[")) {
      const linkMatch = token.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
      if (linkMatch) {
        parts.push({
          kind: "link",
          label: linkMatch[1]!,
          href: linkMatch[2]!,
        });
      } else {
        parts.push({ kind: "text", value: token });
      }
    } else {
      parts.push({ kind: "link", label: token, href: token });
    }

    lastIndex = match.index + token.length;
  }

  if (lastIndex < text.length) {
    parts.push({ kind: "text", value: text.slice(lastIndex) });
  }

  return parts;
}
