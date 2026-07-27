"use client";

import { useSyncExternalStore } from "react";

const KEY = "credible-shortlist";

export type ShortlistEntry = {
  slug: string;
  name: string;
  image?: string | null;
  role?: string | null;
};

const EMPTY: ShortlistEntry[] = [];
const listeners = new Set<() => void>();

/** Cached so getSnapshot stays referentially stable between mutations. */
let snapshot: ShortlistEntry[] | null = null;

function titleize(slug: string) {
  return slug
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function parse(raw: string | null): ShortlistEntry[] {
  if (!raw) return EMPTY;

  try {
    const stored: unknown = JSON.parse(raw);
    if (!Array.isArray(stored)) return EMPTY;

    return stored.flatMap((item): ShortlistEntry[] => {
      // Earlier versions stored bare slugs.
      if (typeof item === "string") {
        return [{ slug: item, name: titleize(item) }];
      }
      if (item && typeof item === "object" && "slug" in item) {
        const entry = item as Record<string, unknown>;
        if (typeof entry.slug !== "string") return [];
        return [
          {
            slug: entry.slug,
            name:
              typeof entry.name === "string" ? entry.name : titleize(entry.slug),
            image: typeof entry.image === "string" ? entry.image : null,
            role: typeof entry.role === "string" ? entry.role : null,
          },
        ];
      }
      return [];
    });
  } catch {
    return EMPTY;
  }
}

function getSnapshot() {
  if (snapshot === null) snapshot = parse(localStorage.getItem(KEY));
  return snapshot;
}

function getServerSnapshot() {
  return EMPTY;
}

function emit() {
  for (const listener of listeners) listener();
}

function onStorage(event: StorageEvent) {
  if (event.key !== null && event.key !== KEY) return;
  snapshot = null;
  emit();
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(listener);
    if (listeners.size === 0) {
      window.removeEventListener("storage", onStorage);
    }
  };
}

function write(next: ShortlistEntry[]) {
  snapshot = next;
  try {
    localStorage.setItem(KEY, JSON.stringify(next));
  } catch {
    /* storage unavailable — keep the in-memory list */
  }
  emit();
}

export function useShortlist() {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

export function useIsShortlisted(slug: string) {
  return useShortlist().some((entry) => entry.slug === slug);
}

export function toggleShortlist(entry: ShortlistEntry) {
  const current = getSnapshot();
  write(
    current.some((item) => item.slug === entry.slug)
      ? current.filter((item) => item.slug !== entry.slug)
      : [...current, entry],
  );
}

export function removeFromShortlist(slug: string) {
  write(getSnapshot().filter((entry) => entry.slug !== slug));
}

export function clearShortlist() {
  write(EMPTY);
}

export function briefAllHref(entries: ShortlistEntry[]) {
  const slugs = entries.map((entry) => entry.slug).join(",");
  return `/contact?experts=${encodeURIComponent(slugs)}`;
}
