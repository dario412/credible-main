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
  image,
}: {
  title?: string;
  description?: string;
  path?: string;
  noIndex?: boolean;
  /** Absolute or site-relative URL for Open Graph / Twitter cards. */
  image?: string;
} = {}): Metadata {
  const fullTitle = title ? `${title} | ${siteName}` : `${siteName} — Talent agency for the expert economy`;
  const url = absoluteUrl(path);
  const imageUrl = image
    ? image.startsWith("http")
      ? image
      : absoluteUrl(image)
    : undefined;

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
      ...(imageUrl ? { images: [{ url: imageUrl }] } : {}),
    },
    twitter: {
      card: imageUrl ? "summary_large_image" : "summary_large_image",
      title: fullTitle,
      description,
      ...(imageUrl ? { images: [imageUrl] } : {}),
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
