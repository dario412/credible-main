import type { Metadata } from "next";

import { getSiteUrl } from "@/lib/site-url";

const siteName = "Credible Creators";
const defaultDescription =
  "The talent agency for the expert economy. We represent founders, operators and trusted voices.";

export function absoluteUrl(path = "") {
  return `${getSiteUrl()}${path}`;
}

export function createMetadata({
  title,
  description = defaultDescription,
  path = "/",
  noIndex = false,
}: {
  title?: string;
  description?: string;
  path?: string;
  noIndex?: boolean;
} = {}): Metadata {
  const fullTitle = title ? `${title} | ${siteName}` : `${siteName} — Talent agency for the expert economy`;
  const url = absoluteUrl(path);

  return {
    title: fullTitle,
    description,
    alternates: { canonical: url },
    openGraph: {
      title: fullTitle,
      description,
      url,
      siteName,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
    },
    robots: noIndex
      ? { index: false, follow: false, nocache: true }
      : { index: true, follow: true },
  };
}

export const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: siteName,
  url: absoluteUrl("/"),
  description: defaultDescription,
};
