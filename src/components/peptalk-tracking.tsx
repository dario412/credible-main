"use client";

import { useEffect } from "react";

import type { PeptalkContext, PeptalkTracking } from "@/lib/peptalk";
import { EMPTY_PEPTALK_TRACKING } from "@/lib/peptalk";

const STORAGE_KEY = "pt_tracking";

const TRACKING_PARAMS = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_term",
  "utm_content",
  "gclid",
  "msclkid",
  "gbraid",
  "wbraid",
  "fbclid",
  "li_fat_id",
  "rdt_cid",
  "dclid",
  "irclickid",
] as const;

function readStoredTracking(): Record<string, string> {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw) as unknown;
    if (!parsed || typeof parsed !== "object") return {};
    return Object.fromEntries(
      Object.entries(parsed).filter(
        (entry): entry is [string, string] => typeof entry[1] === "string",
      ),
    );
  } catch {
    return {};
  }
}

function readUrlTracking(): Record<string, string> {
  if (typeof window === "undefined") return {};
  const params = new URLSearchParams(window.location.search);
  const captured: Record<string, string> = {};
  for (const key of TRACKING_PARAMS) {
    const value = params.get(key);
    if (value) captured[key] = value;
  }
  return captured;
}

function readSegmentAnonymousId(): string {
  if (typeof window === "undefined") return "";

  const analytics = (
    window as Window & {
      analytics?: { user?: () => { anonymousId?: () => string } };
    }
  ).analytics;
  try {
    const fromSegment = analytics?.user?.()?.anonymousId?.();
    if (fromSegment) return fromSegment;
  } catch {
    // Segment may not be loaded.
  }

  try {
    const fromStorage = localStorage.getItem("ajs_anonymous_id");
    if (fromStorage) return fromStorage.replace(/^"+|"+$/g, "");
  } catch {
    // Ignore storage access failures.
  }

  return "";
}

export function capturePeptalkTracking() {
  if (typeof window === "undefined") return;

  const captured = readUrlTracking();
  if (Object.keys(captured).length === 0) return;

  try {
    sessionStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ ...readStoredTracking(), ...captured }),
    );
  } catch {
    // Ignore quota / private-mode failures.
  }
}

/** First-touch UTMs from sessionStorage, filled by the current URL, live page/referrer at call time. */
export function getPeptalkTracking(): PeptalkTracking {
  if (typeof window === "undefined") return EMPTY_PEPTALK_TRACKING;

  capturePeptalkTracking();
  const stored = { ...readUrlTracking(), ...readStoredTracking() };

  return {
    utmSource: stored.utm_source ?? "",
    utmMedium: stored.utm_medium ?? "",
    utmCampaign: stored.utm_campaign ?? "",
    utmTerm: stored.utm_term ?? "",
    utmContent: stored.utm_content ?? "",
    gclid: stored.gclid ?? "",
    msclkid: stored.msclkid ?? "",
    gbraid: stored.gbraid ?? "",
    wbraid: stored.wbraid ?? "",
    fbclid: stored.fbclid ?? "",
    liFatId: stored.li_fat_id ?? "",
    rdtCid: stored.rdt_cid ?? "",
    dclid: stored.dclid ?? "",
    impactCode: stored.irclickid ?? "",
    segmentAnonymousId: readSegmentAnonymousId(),
    referrer: document.referrer || "",
    pageUrl: window.location.href,
  };
}

export function getPeptalkContext(): PeptalkContext {
  if (typeof window === "undefined") {
    return {
      timezone: "",
      timezoneOffset: 0,
      language: "",
      userAgent: "",
    };
  }

  return {
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || "",
    timezoneOffset: new Date().getTimezoneOffset(),
    language: navigator.language || "",
    userAgent: navigator.userAgent || "",
  };
}

/** Captures UTM and ad-click IDs on first page load so they survive navigation. */
export function PeptalkTrackingCapture() {
  useEffect(() => {
    capturePeptalkTracking();
  }, []);

  return null;
}
