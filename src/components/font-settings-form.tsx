"use client";

import { useEffect, useMemo, useRef, useState, useTransition } from "react";
import { CaretDown, MagnifyingGlass, UploadSimple } from "@phosphor-icons/react";

import {
  resetSiteFonts,
  saveSiteFonts,
  uploadSiteFont,
  type FontActionState,
} from "@/lib/actions/site-fonts";
import {
  DEFAULT_BODY_FAMILY,
  DEFAULT_HEADING_FAMILY,
  GOOGLE_FONTS,
  type FontChoice,
  type FontRole,
  type FontSource,
  type SiteFontSettings,
} from "@/lib/site-fonts";
import { cn } from "@/lib/utils";

type Props = {
  initial: SiteFontSettings;
  canEdit: boolean;
};

function sourceLabel(source: FontSource) {
  if (source === "google") return "Google Fonts";
  if (source === "upload") return "Uploaded";
  return "Site default";
}

function usePreviewFonts(families: string[]) {
  const key = families.join("|");
  useEffect(() => {
    const unique = [...new Set(families.filter(Boolean))];
    if (unique.length === 0) return;

    const id = "admin-font-preview";
    let link = document.getElementById(id) as HTMLLinkElement | null;
    if (!link) {
      link = document.createElement("link");
      link.id = id;
      link.rel = "stylesheet";
      document.head.appendChild(link);
    }

    const params = unique
      .slice(0, 24)
      .map(
        (family) =>
          `family=${encodeURIComponent(family).replace(/%20/g, "+")}:wght@400;500;600;700`,
      )
      .join("&");
    link.href = `https://fonts.googleapis.com/css2?${params}&display=swap`;
  }, [key]);
}

function FontPicker({
  label,
  role,
  value,
  onChange,
  canEdit,
  onUploaded,
}: {
  label: string;
  role: FontRole;
  value: FontChoice;
  onChange: (next: FontChoice) => void;
  canEdit: boolean;
  onUploaded: (family: string, assetId: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [uploadPending, startUpload] = useTransition();
  const [uploadMessage, setUploadMessage] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function onPointerDown(event: MouseEvent) {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onPointerDown);
    return () => document.removeEventListener("mousedown", onPointerDown);
  }, [open]);

  const options = useMemo(() => {
    const q = query.trim().toLowerCase();
    const defaults =
      role === "heading"
        ? [
            {
              family: DEFAULT_HEADING_FAMILY,
              source: "default" as const,
              note: "Current brand display",
            },
          ]
        : [
            {
              family: DEFAULT_BODY_FAMILY,
              source: "default" as const,
              note: "Current brand body",
            },
          ];

    const google = GOOGLE_FONTS.map((family) => ({
      family,
      source: "google" as const,
      note: "Google Fonts",
    })).filter(
      (g) =>
        !(
          (role === "heading" && g.family === DEFAULT_HEADING_FAMILY) ||
          (role === "body" && g.family === DEFAULT_BODY_FAMILY)
        ),
    );

    const merged = [...defaults, ...google];
    if (!q) return merged;
    return merged.filter((item) => item.family.toLowerCase().includes(q));
  }, [query, role]);

  usePreviewFonts(
    open
      ? options.slice(0, 20).map((o) => o.family)
      : value.source === "google"
        ? [value.family]
        : [],
  );

  function pick(family: string, source: FontSource) {
    onChange({
      family,
      source,
      assetId: source === "upload" ? value.assetId : null,
    });
    setOpen(false);
    setQuery("");
  }

  function handleUpload(file: File | null) {
    if (!file || !canEdit) return;
    setUploadMessage("");
    const data = new FormData();
    data.set("file", file);
    data.set("family", file.name.replace(/\.(woff2|woff|ttf|otf)$/i, ""));

    startUpload(async () => {
      const result = await uploadSiteFont(role, data);
      setUploadMessage(result.message);
      if (result.ok && result.assetId && result.family) {
        onUploaded(result.family, result.assetId);
      }
      if (fileRef.current) fileRef.current.value = "";
    });
  }

  return (
    <div
      ref={rootRef}
      className="space-y-3 border border-charcoal/10 bg-white/60 p-4"
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-sm font-medium text-charcoal">{label}</p>
          <p className="mt-1 text-xs text-muted">
            Current: <strong className="text-charcoal">{value.family}</strong>
            <span className="text-charcoal/40">
              {" "}
              · {sourceLabel(value.source)}
            </span>
          </p>
        </div>
        <p
          className={cn(
            "max-w-[14ch] truncate text-[1.35rem] leading-none tracking-tight text-charcoal",
            value.source === "default" && role === "heading" && "font-display",
          )}
          style={
            value.source === "default"
              ? undefined
              : {
                  fontFamily: `"${value.family}", system-ui, sans-serif`,
                }
          }
        >
          Aa
        </p>
      </div>

      <div className="relative">
        <button
          type="button"
          disabled={!canEdit}
          onClick={() => setOpen((v) => !v)}
          className={cn(
            "flex w-full items-center justify-between gap-2 border border-forest/40 bg-transparent px-3 py-2.5 text-left text-sm transition-colors",
            canEdit ? "cursor-pointer hover:border-forest" : "opacity-60",
          )}
        >
          <span className="min-w-0 truncate">
            {value.family}
            <span className="text-muted"> — search to change</span>
          </span>
          <CaretDown className="size-4 shrink-0 text-charcoal/50" aria-hidden />
        </button>

        {open ? (
          <div className="absolute z-20 mt-1 w-full overflow-hidden border border-charcoal/15 bg-[#FBF8F5] shadow-[0_12px_32px_rgba(28,26,23,0.12)]">
            <div className="flex items-center gap-2 border-b border-charcoal/10 px-3 py-2">
              <MagnifyingGlass
                className="size-4 text-charcoal/45"
                aria-hidden
              />
              <input
                autoFocus
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search Google Fonts…"
                className="w-full bg-transparent text-sm outline-none placeholder:text-charcoal/40"
              />
            </div>
            <ul className="max-h-56 overflow-y-auto py-1">
              {options.length === 0 ? (
                <li className="px-3 py-2 text-sm text-muted">No matches</li>
              ) : (
                options.map((item) => (
                  <li key={`${item.source}-${item.family}`}>
                    <button
                      type="button"
                      onClick={() => pick(item.family, item.source)}
                      className={cn(
                        "flex w-full cursor-pointer items-center justify-between gap-3 px-3 py-2 text-left text-sm hover:bg-cream-dark",
                        value.family === item.family &&
                          value.source === item.source &&
                          "bg-cream-dark",
                      )}
                    >
                      <span
                        className="truncate"
                        style={{
                          fontFamily:
                            item.source === "google"
                              ? `"${item.family}", system-ui, sans-serif`
                              : undefined,
                        }}
                      >
                        {item.family}
                      </span>
                      <span className="shrink-0 text-[0.7rem] text-muted">
                        {item.note}
                      </span>
                    </button>
                  </li>
                ))
              )}
            </ul>
            {query.trim() &&
            !GOOGLE_FONTS.some(
              (f) => f.toLowerCase() === query.trim().toLowerCase(),
            ) ? (
              <button
                type="button"
                onClick={() => pick(query.trim(), "google")}
                className="w-full cursor-pointer border-t border-charcoal/10 px-3 py-2.5 text-left text-sm text-forest hover:bg-cream-dark"
              >
                Use “{query.trim()}” from Google Fonts
              </button>
            ) : null}
          </div>
        ) : null}
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <input
          ref={fileRef}
          type="file"
          accept=".woff2,.woff,.ttf,.otf,font/woff2,font/woff,font/ttf,font/otf"
          className="hidden"
          disabled={!canEdit || uploadPending}
          onChange={(e) => handleUpload(e.target.files?.[0] ?? null)}
        />
        <button
          type="button"
          disabled={!canEdit || uploadPending}
          onClick={() => fileRef.current?.click()}
          className="inline-flex cursor-pointer items-center gap-1.5 border border-charcoal/20 px-3 py-2 text-xs font-medium text-charcoal transition-colors hover:border-charcoal/45 disabled:opacity-50"
        >
          <UploadSimple className="size-3.5" aria-hidden />
          {uploadPending ? "Uploading…" : "Upload font"}
        </button>
        <span className="text-[0.7rem] text-muted">
          .woff2 / .woff / .ttf / .otf
        </span>
      </div>
      {uploadMessage ? (
        <p className="text-xs text-forest">{uploadMessage}</p>
      ) : null}
    </div>
  );
}

export function FontSettingsForm({ initial, canEdit }: Props) {
  const [heading, setHeading] = useState(initial.heading);
  const [body, setBody] = useState(initial.body);
  const [state, setState] = useState<FontActionState>({
    ok: false,
    message: "",
  });
  const [pending, startTransition] = useTransition();

  function handleSave() {
    if (!canEdit) return;
    const data = new FormData();
    data.set("headingFamily", heading.family);
    data.set("headingSource", heading.source);
    if (heading.assetId) data.set("headingAssetId", heading.assetId);
    data.set("bodyFamily", body.family);
    data.set("bodySource", body.source);
    if (body.assetId) data.set("bodyAssetId", body.assetId);

    startTransition(async () => {
      const result = await saveSiteFonts({ ok: false, message: "" }, data);
      setState(result);
    });
  }

  function handleReset() {
    if (!canEdit) return;
    startTransition(async () => {
      const result = await resetSiteFonts();
      setState(result);
      if (result.ok) {
        setHeading({
          family: DEFAULT_HEADING_FAMILY,
          source: "default",
          assetId: null,
        });
        setBody({
          family: DEFAULT_BODY_FAMILY,
          source: "default",
          assetId: null,
        });
      }
    });
  }

  return (
    <div className="mt-6 space-y-4">
      <div className="grid gap-4 md:grid-cols-2">
        <FontPicker
          label="Heading font"
          role="heading"
          value={heading}
          canEdit={canEdit}
          onChange={setHeading}
          onUploaded={(family, assetId) =>
            setHeading({ family, source: "upload", assetId })
          }
        />
        <FontPicker
          label="Paragraph / body font"
          role="body"
          value={body}
          canEdit={canEdit}
          onChange={setBody}
          onUploaded={(family, assetId) =>
            setBody({ family, source: "upload", assetId })
          }
        />
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <button
          type="button"
          disabled={!canEdit || pending}
          onClick={handleSave}
          className="cursor-pointer rounded-sm bg-forest px-5 py-2.5 text-sm font-medium text-cream transition-colors hover:bg-forest-dark disabled:opacity-50"
        >
          {pending ? "Saving…" : "Save fonts"}
        </button>
        <button
          type="button"
          disabled={!canEdit || pending}
          onClick={handleReset}
          className="cursor-pointer rounded-sm border border-charcoal/20 px-4 py-2.5 text-sm text-charcoal transition-colors hover:border-charcoal/45 disabled:opacity-50"
        >
          Reset to defaults
        </button>
        {!canEdit ? (
          <p className="text-xs text-muted">
            Only owners and editors can change site fonts.
          </p>
        ) : null}
        {state.message ? (
          <p className={`text-sm ${state.ok ? "text-forest" : "text-danger"}`}>
            {state.message}
          </p>
        ) : null}
      </div>
    </div>
  );
}
