"use client";

import { useState, useTransition } from "react";

import { runAirtableExpertSync } from "@/lib/actions/admin-airtable-sync";

type SyncResult = Awaited<ReturnType<typeof runAirtableExpertSync>>;

export function AdminAirtableSyncPanel({
  configured,
}: {
  configured: boolean;
}) {
  const [pending, startTransition] = useTransition();
  const [result, setResult] = useState<SyncResult | null>(null);

  function onSync() {
    startTransition(async () => {
      const next = await runAirtableExpertSync();
      setResult(next);
    });
  }

  return (
    <div className="space-y-6 rounded-sm border border-charcoal/10 bg-white p-6 shadow-[0_10px_28px_rgba(28,26,23,0.04)]">
      <div>
        <h2 className="font-display text-xl tracking-tight">Creator roster</h2>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted">
          Matches the website roster to Airtable: adds new creators, updates
          existing ones, and removes anyone missing from Airtable or marked
          archived.
        </p>
      </div>

      {!configured ? (
        <div className="rounded-sm border border-amber-700/20 bg-amber-50 px-4 py-3 text-sm text-amber-950">
          Set <code className="text-[0.8125rem]">AIRTABLE_PAT</code>,{" "}
          <code className="text-[0.8125rem]">AIRTABLE_BASE_ID</code>, and{" "}
          <code className="text-[0.8125rem]">AIRTABLE_TABLE</code> in your
          environment, then reload this page.
        </div>
      ) : (
        <p className="text-sm text-forest">
          Airtable credentials detected. Ready to sync.
        </p>
      )}

      <button
        type="button"
        disabled={!configured || pending}
        onClick={onSync}
        className="inline-flex h-10 items-center rounded-sm bg-forest px-4 text-sm font-medium text-cream transition-colors hover:bg-forest-dark disabled:cursor-not-allowed disabled:opacity-50"
      >
        {pending ? "Syncing…" : "Sync roster now"}
      </button>

      {result ? (
        <div
          className={
            result.ok
              ? "rounded-sm border border-forest/20 bg-forest/5 px-4 py-3 text-sm text-charcoal"
              : "rounded-sm border border-red-700/20 bg-red-50 px-4 py-3 text-sm text-red-950"
          }
        >
          <p className="font-medium">{result.message}</p>
          <p className="mt-1 text-charcoal/65">
            Airtable records: {result.total} · Added: {result.created} ·
            Updated: {result.updated} · Removed: {result.removed} · Skipped:{" "}
            {result.skipped}
          </p>
          {result.createdNames.length > 0 ? (
            <p className="mt-2 text-sm text-charcoal/75">
              Added: {result.createdNames.join(", ")}
            </p>
          ) : null}
          {result.removedNames.length > 0 ? (
            <p className="mt-1 text-sm text-charcoal/75">
              Removed: {result.removedNames.join(", ")}
            </p>
          ) : null}
          {result.errors.length > 0 ? (
            <ul className="mt-3 list-disc space-y-1 pl-5 text-xs">
              {result.errors.map((error) => (
                <li key={error}>{error}</li>
              ))}
            </ul>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
