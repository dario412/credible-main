"use client";

import { useCallback, useEffect, useRef } from "react";

import {
  richTextHtmlEquivalent,
  sanitizeRichTextHtml,
  sanitizeRichTextHref,
} from "@/lib/rich-text";
import { cn } from "@/lib/utils";

function saveSelection(container: HTMLElement): Range | null {
  const selection = window.getSelection();
  if (!selection || selection.rangeCount === 0) return null;

  const range = selection.getRangeAt(0);
  if (!container.contains(range.commonAncestorContainer)) return null;
  return range.cloneRange();
}

function restoreSelection(range: Range) {
  const selection = window.getSelection();
  if (!selection) return;
  selection.removeAllRanges();
  selection.addRange(range);
}

function ToolbarButton({
  label,
  title,
  onMouseDown,
  onClick,
}: {
  label: string;
  title: string;
  onMouseDown: (e: React.MouseEvent) => void;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      title={title}
      aria-label={title}
      onMouseDown={onMouseDown}
      onClick={onClick}
      className="rounded px-2 py-1 text-xs font-medium text-charcoal/70 transition-colors hover:bg-charcoal/5 hover:text-charcoal"
    >
      {label}
    </button>
  );
}

export function RichTextEditor({
  value,
  onChange,
  placeholder = "Write rich text…",
}: {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
}) {
  const editorRef = useRef<HTMLDivElement>(null);
  const lastValueRef = useRef<string | null>(null);
  const composingRef = useRef(false);

  const syncFromDom = useCallback(() => {
    if (composingRef.current) return;
    const editor = editorRef.current;
    if (!editor) return;

    const next = sanitizeRichTextHtml(editor.innerHTML);
    if (
      lastValueRef.current !== null &&
      richTextHtmlEquivalent(next, lastValueRef.current)
    ) {
      return;
    }

    lastValueRef.current = next;
    onChange(next);
  }, [onChange]);

  useEffect(() => {
    try {
      document.execCommand("styleWithCSS", false, "false");
    } catch {
      // Unsupported in some browsers — normalization still handles span styles.
    }
  }, []);

  useEffect(() => {
    const editor = editorRef.current;
    if (!editor) return;

    const sanitized = sanitizeRichTextHtml(value);
    if (
      lastValueRef.current !== null &&
      richTextHtmlEquivalent(value, lastValueRef.current)
    ) {
      return;
    }

    editor.innerHTML = sanitized || "";
    lastValueRef.current = sanitized;
  }, [value]);

  function keepSelection(event: React.MouseEvent) {
    event.preventDefault();
  }

  function exec(command: "bold" | "italic" | "underline") {
    const editor = editorRef.current;
    if (!editor) return;

    editor.focus();
    try {
      document.execCommand("styleWithCSS", false, "false");
    } catch {
      // ignore
    }
    document.execCommand(command, false);
    syncFromDom();
  }

  function addLink() {
    const editor = editorRef.current;
    if (!editor) return;

    const savedRange = saveSelection(editor);
    if (!savedRange || savedRange.collapsed) {
      window.alert("Select the text you want to turn into a link first.");
      return;
    }

    const url = window.prompt("Link URL");
    if (!url) return;

    const href = sanitizeRichTextHref(url);
    if (!href) {
      window.alert("Enter a valid http(s), mailto, or site link.");
      return;
    }

    editor.focus();
    restoreSelection(savedRange);
    document.execCommand("createLink", false, href);

    editor.querySelectorAll("a").forEach((anchor) => {
      anchor.setAttribute("href", href);
      anchor.setAttribute("target", "_blank");
      anchor.setAttribute("rel", "noopener noreferrer");
    });

    syncFromDom();
  }

  function removeLink() {
    const editor = editorRef.current;
    if (!editor) return;

    editor.focus();
    document.execCommand("unlink", false);
    syncFromDom();
  }

  return (
    <div className="overflow-hidden rounded-sm border border-charcoal/15 bg-white">
      <div className="flex flex-wrap items-center gap-0.5 border-b border-charcoal/10 bg-[#FBF8F5] px-2 py-1.5">
        <ToolbarButton
          label="B"
          title="Bold"
          onMouseDown={keepSelection}
          onClick={() => exec("bold")}
        />
        <ToolbarButton
          label="I"
          title="Italic"
          onMouseDown={keepSelection}
          onClick={() => exec("italic")}
        />
        <ToolbarButton
          label="U"
          title="Underline"
          onMouseDown={keepSelection}
          onClick={() => exec("underline")}
        />
        <span className="mx-1 h-4 w-px bg-charcoal/15" aria-hidden />
        <ToolbarButton
          label="Link"
          title="Add link"
          onMouseDown={keepSelection}
          onClick={addLink}
        />
        <ToolbarButton
          label="Unlink"
          title="Remove link"
          onMouseDown={keepSelection}
          onClick={removeLink}
        />
      </div>
      <div
        ref={editorRef}
        contentEditable
        suppressContentEditableWarning
        role="textbox"
        aria-multiline="true"
        data-placeholder={placeholder}
        onInput={syncFromDom}
        onBlur={syncFromDom}
        onCompositionStart={() => {
          composingRef.current = true;
        }}
        onCompositionEnd={() => {
          composingRef.current = false;
          syncFromDom();
        }}
        className={cn(
          "rich-text-editor min-h-28 px-3 py-3 text-sm leading-relaxed text-charcoal outline-none",
          "[&_strong]:font-semibold [&_b]:font-semibold [&_em]:italic [&_i]:italic [&_u]:underline",
          "[&_a]:text-forest [&_a]:underline [&_a]:underline-offset-2",
          "[&_p+p]:mt-3",
          "[&:empty]:before:text-charcoal/45 [&:empty]:before:content-[attr(data-placeholder)]",
        )}
      />
    </div>
  );
}

export function RichTextContent({
  html,
  className,
}: {
  html: string;
  className?: string;
}) {
  const safe = sanitizeRichTextHtml(html);
  if (!safe) return null;

  return (
    <div
      className={cn(
        "rich-text-content [&_strong]:font-semibold [&_b]:font-semibold [&_em]:italic [&_i]:italic [&_u]:underline",
        "[&_a]:text-forest [&_a]:underline [&_a]:underline-offset-2 [&_a]:transition-colors hover:[&_a]:text-forest-dark",
        "[&_p+p]:mt-3",
        className,
      )}
      dangerouslySetInnerHTML={{ __html: safe }}
    />
  );
}
