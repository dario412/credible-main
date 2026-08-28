import "server-only";

import { listAirtableTable, type AirtableRecord } from "./client";

export const AIRTABLE_TOPICS_TABLE = "Credible | Topics";
export const AIRTABLE_CREATOR_PROFILE_TOPICS_FIELD =
  "Creator | Profile | Topics";

function asString(value: unknown): string | null {
  if (typeof value === "string" && value.trim()) return value.trim();
  return null;
}

/** Topic record id → display label from the Credible | Topics table. */
export async function loadTopicNamesById(): Promise<Map<string, string>> {
  const map = new Map<string, string>();
  let records: AirtableRecord[];
  try {
    records = await listAirtableTable(AIRTABLE_TOPICS_TABLE);
  } catch {
    return map;
  }

  for (const record of records) {
    const name = asString(record.fields.Topic);
    if (name) map.set(record.id, name);
  }
  return map;
}
