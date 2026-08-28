import fs from "node:fs";
import path from "node:path";

export type LegalPageKey = "privacy" | "terms" | "accessibility";

export type LegalPageDoc = {
  title: string;
  effectiveDate: string;
  metaDescription: string;
  body: string;
};

export type LegalPagesSections = Record<LegalPageKey, LegalPageDoc>;

function readDefaultMarkdown(filename: string) {
  return fs.readFileSync(
    path.join(process.cwd(), "src/content/legal", filename),
    "utf8",
  );
}

function stripLegalHeader(markdown: string) {
  const lines = markdown.split("\n");
  let index = 0;

  if (lines[index]?.startsWith("# ")) index += 1;
  while (lines[index]?.trim() === "") index += 1;
  if (lines[index]?.toLowerCase().startsWith("effective date")) index += 1;
  while (lines[index]?.trim() === "") index += 1;

  if (lines[index]?.trim() === "Table of contents") {
    index += 1;
    while (
      lines[index]?.trim() &&
      !lines[index]?.startsWith("**") &&
      !lines[index]?.startsWith("###")
    ) {
      index += 1;
    }
  }

  return lines.slice(index).join("\n").trim();
}

function defaultDoc(
  title: string,
  effectiveDate: string,
  metaDescription: string,
  filename: string,
): LegalPageDoc {
  return {
    title,
    effectiveDate,
    metaDescription,
    body: stripLegalHeader(readDefaultMarkdown(filename)),
  };
}

export const DEFAULT_LEGAL_SECTIONS: LegalPagesSections = {
  privacy: defaultDoc(
    "Privacy Policy",
    "April 20, 2026",
    "Privacy policy for Credible Creators.",
    "privacy.md",
  ),
  terms: defaultDoc(
    "Terms of Service",
    "April 20, 2026",
    "Terms of service for Credible Creators.",
    "terms.md",
  ),
  accessibility: defaultDoc(
    "Accessibility Statement",
    "April 20, 2026",
    "Accessibility statement for Credible Creators.",
    "accessibility.md",
  ),
};

function asString(value: unknown, fallback: string) {
  return typeof value === "string" ? value : fallback;
}

function mergeDoc(
  raw: unknown,
  defaults: LegalPageDoc,
): LegalPageDoc {
  const data = (raw && typeof raw === "object" ? raw : {}) as Partial<LegalPageDoc>;
  return {
    title: asString(data.title, defaults.title),
    effectiveDate: asString(data.effectiveDate, defaults.effectiveDate),
    metaDescription: asString(data.metaDescription, defaults.metaDescription),
    body: asString(data.body, defaults.body),
  };
}

export function mergeLegalSections(raw: unknown): LegalPagesSections {
  const data = (raw && typeof raw === "object" ? raw : {}) as Partial<
    Record<LegalPageKey, unknown>
  >;
  const defaults = DEFAULT_LEGAL_SECTIONS;

  return {
    privacy: mergeDoc(data.privacy, defaults.privacy),
    terms: mergeDoc(data.terms, defaults.terms),
    accessibility: mergeDoc(data.accessibility, defaults.accessibility),
  };
}

export function getLegalPage(
  sections: LegalPagesSections,
  key: LegalPageKey,
): LegalPageDoc {
  return sections[key];
}

export const LEGAL_PAGE_ROUTES: Record<
  LegalPageKey,
  { path: string; label: string }
> = {
  privacy: { path: "/privacy", label: "Privacy Policy" },
  terms: { path: "/terms", label: "Terms of Service" },
  accessibility: {
    path: "/accessibility-statement",
    label: "Accessibility Statement",
  },
};
