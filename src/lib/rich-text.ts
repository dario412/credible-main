const ALLOWED_TAGS = new Set(["p", "br", "strong", "b", "em", "i", "u", "a"]);

function escapeAttr(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function spanStyleFlags(style: string): {
  bold: boolean;
  italic: boolean;
  underline: boolean;
} {
  const lower = style.toLowerCase().replace(/\s/g, "");
  return {
    bold: /font-weight:(bold|[6-9]00)/.test(lower),
    italic: /font-style:italic/.test(lower),
    underline: /text-decoration(?:-line)?:[^;"]*underline/.test(lower),
  };
}

/** Map browser contentEditable markup to the small tag set we persist. */
export function normalizeRichTextMarkup(html: string): string {
  if (!html?.trim()) return "";

  let out = html
    .replace(/\r\n/g, "")
    .replace(/<div(\s[^>]*)?>/gi, "<p>")
    .replace(/<\/div>/gi, "</p>")
    .replace(/<p>\s*<\/p>/gi, "")
    .replace(/<br class="[^"]*">/gi, "<br />");

  for (let pass = 0; pass < 6; pass++) {
    const prev = out;
    out = out.replace(/<span([^>]*)>([\s\S]*?)<\/span>/gi, (_match, attrs, inner) => {
      const styleMatch = /style=(["'])(.*?)\1/i.exec(String(attrs));
      const flags = spanStyleFlags(styleMatch?.[2] ?? "");
      let wrapped = inner;
      if (flags.underline) wrapped = `<u>${wrapped}</u>`;
      if (flags.italic) wrapped = `<em>${wrapped}</em>`;
      if (flags.bold) wrapped = `<strong>${wrapped}</strong>`;
      return wrapped;
    });
    if (out === prev) break;
  }

  out = out.replace(/<font[^>]*>([\s\S]*?)<\/font>/gi, "$1");

  const plain = out.replace(/<[^>]+>/g, "").trim();
  if (plain && !/<p[\s>]/i.test(out)) {
    out = `<p>${out.trim()}</p>`;
  }

  return out.trim();
}

export function sanitizeRichTextHref(raw: string): string | null {
  const trimmed = raw.trim();
  if (!trimmed) return null;

  const lower = trimmed.toLowerCase();
  if (lower.startsWith("javascript:") || lower.startsWith("data:")) return null;
  if (/^(https?:|mailto:|tel:|\/|#)/.test(trimmed)) return trimmed;
  if (!trimmed.includes(":")) return `https://${trimmed}`;
  return null;
}

/** Allow basic inline formatting for CMS-authored copy. */
export function sanitizeRichTextHtml(raw: string): string {
  const normalized = normalizeRichTextMarkup(raw);
  if (!normalized.trim()) return "";

  const html = normalized
    .replace(/<!--[\s\S]*?-->/g, "")
    .replace(/<script[\s\S]*?<\/script>/gi, "")
    .replace(/<style[\s\S]*?<\/style>/gi, "")
    .replace(/\s+on\w+\s*=\s*("[^"]*"|'[^']*'|[^\s>]+)/gi, "");

  const sanitized = html
    .replace(/<\/?([a-z][a-z0-9]*)\b([^>]*)>/gi, (full, tagName, attrPart) => {
      const tag = String(tagName).toLowerCase();
      const closing = full.startsWith("</");

      if (!ALLOWED_TAGS.has(tag)) return "";

      if (closing) return `</${tag}>`;
      if (tag === "br") return "<br />";

      if (tag === "a") {
        const hrefMatch = attrPart.match(
          /\bhref\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+))/i,
        );
        const href = sanitizeRichTextHref(
          hrefMatch?.[1] ?? hrefMatch?.[2] ?? hrefMatch?.[3] ?? "",
        );
        if (!href) return "";
        return `<a href="${escapeAttr(href)}" target="_blank" rel="noopener noreferrer">`;
      }

      return `<${tag}>`;
    })
    .trim();

  if (!sanitized) return "";

  if (!/<[a-z]/i.test(sanitized)) {
    return `<p>${escapeHtml(sanitized)}</p>`;
  }

  return sanitized;
}

export function richTextToPlainText(html: string): string {
  return sanitizeRichTextHtml(html)
    .replace(/<br\s*\/?>/gi, " ")
    .replace(/<\/p>/gi, " ")
    .replace(/<[^>]+>/g, "")
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/&quot;/gi, '"')
    .replace(/\s+/g, " ")
    .trim();
}

export function emptyRichTextHtml() {
  return "";
}

export function richTextHtmlEquivalent(a: string, b: string): boolean {
  return sanitizeRichTextHtml(a) === sanitizeRichTextHtml(b);
}
