import "server-only";

import { listAirtableTable, type AirtableRecord } from "./client";

/** Linked from Credible | Data → Creator | Profile | Talks about. */
export const AIRTABLE_TOPICS_TABLE = "Credible | Topics";
export const AIRTABLE_TALKS_ABOUT_FIELD = "Creator | Profile | Talks about";
export const AIRTABLE_TALKS_ABOUT_FIELD_ID = "fldA1MRZ9JVvauTHC";

function asString(value: unknown): string | null {
  if (typeof value === "string" && value.trim()) return value.trim();
  return null;
}

/** Topic record id → display label from Credible | Topics. */
export async function loadTopicNamesById(): Promise<Map<string, string>> {
  const map = new Map<string, string>();
  let records: AirtableRecord[];
  try {
    records = await listAirtableTable(AIRTABLE_TOPICS_TABLE);
  } catch {
    return map;
  }

  for (const record of records) {
    const name =
      asString(record.fields.Topic) ??
      asString(record.fields.Name) ??
      asString(record.fields.topic);
    if (!name) continue;
    map.set(record.id, name);
  }
  return map;
}
