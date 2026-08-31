import "server-only";

import { getAirtableConfig, isAirtableConfigured } from "./client";

/** Lookup on Credible | Data — category labels from linked Topics → Category. */
export const AIRTABLE_WEBSITE_CATEGORY_FIELD = "Credible | Website | Category";
export const AIRTABLE_WEBSITE_CATEGORY_FIELD_ID = "fldMZGc7iUb1EkGyK";

function asString(value: unknown): string | null {
  if (typeof value === "string" && value.trim()) return value.trim();
  return null;
}

/** Parse the Website | Category lookup (string array) with stable dedupe. */
export function websiteCategoriesFromFields(
  fields: Record<string, unknown>,
): string[] {
  const raw = fields[AIRTABLE_WEBSITE_CATEGORY_FIELD];
  if (!Array.isArray(raw)) return [];

  const seen = new Set<string>();
  const out: string[] = [];
  for (const item of raw) {
    const label = asString(item);
    if (!label) continue;
    const key = label.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(label);
  }
  return out;
}

type MetaChoice = { name?: string };
type MetaField = {
  id: string;
  name: string;
  options?: {
    result?: {
      options?: {
        choices?: MetaChoice[];
      };
    };
  };
};

/** Ordered category labels from the Airtable single-select backing the lookup. */
export async function loadWebsiteCategoryChoices(): Promise<string[]> {
  if (!isAirtableConfigured()) return [];

  const { pat, baseId, table } = getAirtableConfig();
  try {
    const res = await fetch(
      `https://api.airtable.com/v0/meta/bases/${baseId}/tables`,
      {
        headers: {
          Authorization: `Bearer ${pat}`,
          Accept: "application/json",
        },
        cache: "no-store",
      },
    );
    if (!res.ok) return [];

    const data = (await res.json()) as {
      tables?: Array<{ name: string; fields?: MetaField[] }>;
    };
    const dataTable = data.tables?.find(
      (entry) => entry.name === table || entry.name === "Credible | Data",
    );
    const categoryField = dataTable?.fields?.find(
      (field) =>
        field.id === AIRTABLE_WEBSITE_CATEGORY_FIELD_ID ||
        field.name === AIRTABLE_WEBSITE_CATEGORY_FIELD,
    );
    const choices = categoryField?.options?.result?.options?.choices ?? [];
    return choices
      .map((choice) => asString(choice.name))
      .filter((name): name is string => Boolean(name));
  } catch {
    return [];
  }
}
