"use client";

import { useEffect, useMemo, useRef, useState, useTransition } from "react";

import { Button } from "@/components/ui";
import {
  deleteMediaAsset,
  listMediaAssets,
  uploadMediaAsset,
} from "@/lib/actions/admin-media";
import { formatBytes, type MediaAssetCard } from "@/lib/media";
import { cn } from "@/lib/utils";

function MediaGrid({
  assets,
  selectedUrl,
  onSelect,
  onDelete,
  pending,
}: {
  assets: MediaAssetCard[];
  selectedUrl?: string;
  onSelect?: (asset: MediaAssetCard) => void;
  onDelete?: (id: string) => void;
  pending?: boolean;
}) {
  if (assets.length === 0) {
    return (
      <p className="rounded-sm border border-dashed border-charcoal/15 px-4 py-10 text-center text-sm text-charcoal/50">
        No media yet. Upload an image to get started.
      </p>
    );
  }

  return (
    <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
      {assets.map((asset) => {
        const selected = selectedUrl === asset.url;
        return (
          <li key={asset.id}>
            <button
              type="button"
              disabled={pending}
              onClick={() => onSelect?.(asset)}
              className={cn(
                "group flex w-full flex-col overflow-hidden rounded-sm border bg-white text-left transition-colors",
                selected
                  ? "border-forest ring-2 ring-forest/30"
                  : "border-charcoal/10 hover:border-charcoal/25",
              )}
            >
              <span className="relative flex aspect-square items-center justify-center bg-[#f4f2ef] p-3">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={asset.url}
                  alt={asset.alt || asset.fileName}
                  className="max-h-full max-w-full object-contain"
                />
              </span>
              <span className="space-y-0.5 border-t border-charcoal/8 px-2.5 py-2">
                <span className="block truncate text-[0.75rem] font-medium text-charcoal">
                  {asset.fileName}
                </span>
                <span className="block text-[0.65rem] text-charcoal/45">
                  {formatBytes(asset.byteSize)}
                </span>
              </span>
            </button>
            {onDelete ? (
              <button
                type="button"
                disabled={pending}
                onClick={() => onDelete(asset.id)}
                className="mt-1.5 text-[0.7rem] text-charcoal/45 hover:text-danger"
              >
                Remove
              </button>
            ) : null}
          </li>
        );
      })}
    </ul>
  );
}

export function MediaLibraryPanel({
  initial,
  selectable = false,
  selectedUrl,
  onSelect,
}: {
  initial: MediaAssetCard[];
  selectable?: boolean;
  selectedUrl?: string;
  onSelect?: (asset: MediaAssetCard) => void;
}) {
  const [assets, setAssets] = useState(initial);
  const [message, setMessage] = useState("");
  const [pending, startTransition] = useTransition();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setAssets(initial);
  }, [initial]);

  function refresh() {
    startTransition(async () => {
      const next = await listMediaAssets();
      setAssets(next);
    });
  }

  function onUpload(files: FileList | null) {
    const file = files?.[0];
    if (!file) return;
    const data = new FormData();
    data.set("file", file);
    startTransition(async () => {
      const result = await uploadMediaAsset(data);
      setMessage(result.message);
      if (result.ok && result.asset) {
        setAssets((prev) => [result.asset!, ...prev]);
        if (selectable) onSelect?.(result.asset);
      }
      if (inputRef.current) inputRef.current.value = "";
    });
  }

  function onDelete(id: string) {
    if (!window.confirm("Remove this file from the media library?")) return;
    startTransition(async () => {
      const result = await deleteMediaAsset(id);
      setMessage(result.message);
      if (result.ok) {
        setAssets((prev) => prev.filter((a) => a.id !== id));
        refresh();
      }
    });
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-3">
        <Button
          type="button"
          variant="primary"
          disabled={pending}
          onClick={() => inputRef.current?.click()}
        >
          {pending ? "Working…" : "Upload image"}
        </Button>
        <input
          ref={inputRef}
          type="file"
          accept="image/png,image/jpeg,image/webp,image/gif,image/svg+xml"
          className="hidden"
          onChange={(e) => onUpload(e.target.files)}
        />
        <p className="text-xs text-charcoal/50">
          PNG, JPG, WebP, GIF, or SVG · max 4 MB
        </p>
        {message ? (
          <p className="text-xs text-charcoal/60">{message}</p>
        ) : null}
      </div>

      <MediaGrid
        assets={assets}
        selectedUrl={selectedUrl}
        pending={pending}
        onSelect={selectable ? onSelect : undefined}
        onDelete={onDelete}
      />
    </div>
  );
}

export function MediaField({
  label,
  value,
  onChange,
  hint,
}: {
  label: string;
  value: string;
  onChange: (url: string) => void;
  hint?: string;
}) {
  const [open, setOpen] = useState(false);
  const [assets, setAssets] = useState<MediaAssetCard[]>([]);
  const [loading, setLoading] = useState(false);

  const preview = useMemo(() => value.trim(), [value]);

  async function openPicker() {
    setOpen(true);
    setLoading(true);
    try {
      setAssets(await listMediaAssets());
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-1.5">
      <p className="block text-sm font-medium text-charcoal">{label}</p>
      {hint ? <p className="text-xs text-muted">{hint}</p> : null}

      <div className="flex items-stretch gap-3">
        <div className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-sm border border-charcoal/10 bg-[#f4f2ef]">
          {preview ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={preview}
              alt=""
              className="max-h-full max-w-full object-contain"
            />
          ) : (
            <span className="px-2 text-center text-[0.65rem] text-charcoal/40">
              No image
            </span>
          )}
        </div>
        <div className="flex flex-1 flex-col justify-center gap-2">
          <div className="flex flex-wrap gap-2">
            <Button
              type="button"
              variant="secondary"
              className="px-3! py-2! text-xs"
              onClick={() => void openPicker()}
            >
              {preview ? "Change image" : "Select from media"}
            </Button>
            {preview ? (
              <Button
                type="button"
                variant="ghost"
                className="px-3! py-2! text-xs"
                onClick={() => onChange("")}
              >
                Clear
              </Button>
            ) : null}
          </div>
          {preview ? (
            <p className="truncate text-[0.7rem] text-charcoal/45">{preview}</p>
          ) : null}
        </div>
      </div>

      {open ? (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-charcoal/45 p-4"
          onClick={() => setOpen(false)}
          onKeyDown={(e) => {
            if (e.key === "Escape") setOpen(false);
          }}
        >
          <div
            role="dialog"
            aria-modal
            aria-label="Media library"
            className="flex max-h-[85vh] w-full max-w-3xl flex-col overflow-hidden rounded-sm border border-charcoal/10 bg-white shadow-[0_24px_60px_rgba(28,26,23,0.28)]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between gap-3 border-b border-charcoal/10 px-5 py-4">
              <div>
                <h2 className="font-display text-xl text-charcoal">Media</h2>
                <p className="mt-0.5 text-sm text-charcoal/55">
                  Select an existing file or upload a new one.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="text-sm text-charcoal/50 hover:text-charcoal"
              >
                Close
              </button>
            </div>
            <div className="flex-1 overflow-y-auto px-5 py-4">
              {loading ? (
                <p className="py-10 text-center text-sm text-charcoal/50">
                  Loading media…
                </p>
              ) : (
                <MediaLibraryPanel
                  initial={assets}
                  selectable
                  selectedUrl={preview}
                  onSelect={(asset) => {
                    onChange(asset.url);
                    setOpen(false);
                  }}
                />
              )}
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
