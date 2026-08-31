import "server-only";

import type { ExpertProfileTestimonial } from "@/lib/expert-profiles";

import { listAirtableTable, type AirtableRecord } from "./client";

export const AIRTABLE_CREATOR_TESTIMONIALS_FIELD = "Credible | Testimonials";
export const AIRTABLE_TESTIMONIALS_TABLE = "Credible | Testimonials";

function chunk<T>(items: T[], size: number): T[][] {
  const out: T[][] = [];
  for (let i = 0; i < items.length; i += size) out.push(items.slice(i, i + size));
  return out;
}

function asString(value: unknown): string | null {
  if (typeof value === "string" && value.trim()) return value.trim();
  if (typeof value === "number" && Number.isFinite(value)) return String(value);
  return null;
}

function linkedRecordIds(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value.filter(
    (id): id is string => typeof id === "string" && id.startsWith("rec"),
  );
}

function isApproved(value: unknown): boolean {
  if (value === false) return false;
  return true;
}

function parseRoleOrganisation(value: string | null): {
  name: string;
  title: string;
  company: string;
} {
  if (!value) return { name: "", title: "", company: "" };
  const parts = value.split(",").map((part) => part.trim()).filter(Boolean);
  if (parts.length >= 3) {
    return {
      name: parts[0] ?? "",
      title: parts.slice(1, -1).join(", "),
      company: parts[parts.length - 1] ?? "",
    };
  }
  if (parts.length === 2) {
    return { name: "", title: parts[0] ?? "", company: parts[1] ?? "" };
  }
  return { name: parts[0] ?? "", title: "", company: "" };
}

export function mapAirtableTestimonialRecord(
  record: AirtableRecord,
  organisationNames: Map<string, string>,
): ExpertProfileTestimonial | null {
  const { fields } = record;
  if (!isApproved(fields["Approved for use"])) return null;

  const quote = asString(fields.Quote);
  if (!quote) return null;

  const explicitName = asString(fields.Name);
  const role = asString(fields.Role) ?? "";
  const parsed = parseRoleOrganisation(asString(fields["Role, Organisation"]));

  const orgIds = linkedRecordIds(fields.Organisation);
  const linkedCompany =
    orgIds.map((id) => organisationNames.get(id)).find(Boolean) ?? "";

  const name = explicitName ?? parsed.name ?? role;
  const title = role || parsed.title;
  const company = linkedCompany || parsed.company || undefined;

  if (!name.trim()) return null;

  return {
    quote,
    name: name.trim(),
    title: title.trim(),
    company: company?.trim() || undefined,
  };
}

async function loadOrganisationNamesById(
  recordIdsToLoad: string[],
): Promise<Map<string, string>> {
  const map = new Map<string, string>();
  const unique = [...new Set(recordIdsToLoad.filter((id) => id.startsWith("rec")))];
  if (unique.length === 0) return map;

  for (const group of chunk(unique, 12)) {
    const formula = `OR(${group.map((id) => `RECORD_ID()="${id}"`).join(",")})`;
    try {
      const rows = await listAirtableTable("Organisations", {
        filterByFormula: formula,
      });
      for (const row of rows) {
        const name =
          asString(row.fields.Organisation) ??
          asString(row.fields.Organization) ??
          asString(row.fields.Name);
        if (name) map.set(row.id, name);
      }
    } catch {
      return map;
    }
  }

  return map;
}

/** Resolve linked testimonial records by Airtable id, preserving input order. */
export async function loadTestimonialsByIds(
  ids: string[],
): Promise<Map<string, ExpertProfileTestimonial>> {
  const map = new Map<string, ExpertProfileTestimonial>();
  const unique = [...new Set(ids.filter((id) => id.startsWith("rec")))];
  if (unique.length === 0) return map;

  const records: AirtableRecord[] = [];
  for (const group of chunk(unique, 12)) {
    const formula = `OR(${group.map((id) => `RECORD_ID()="${id}"`).join(",")})`;
    try {
      const rows = await listAirtableTable(AIRTABLE_TESTIMONIALS_TABLE, {
        filterByFormula: formula,
      });
      records.push(...rows);
    } catch {
      return map;
    }
  }

  const orgIds = records.flatMap((record) =>
    linkedRecordIds(record.fields.Organisation),
  );
  const organisationNames = await loadOrganisationNamesById(orgIds);

  for (const record of records) {
    const mapped = mapAirtableTestimonialRecord(record, organisationNames);
    if (mapped) map.set(record.id, mapped);
  }

  return map;
}

export function testimonialIdsFromFields(
  fields: Record<string, unknown>,
): string[] {
  return linkedRecordIds(fields[AIRTABLE_CREATOR_TESTIMONIALS_FIELD]);
}

export function resolveOrderedTestimonials(
  ids: string[],
  byId: Map<string, ExpertProfileTestimonial>,
): ExpertProfileTestimonial[] {
  const seen = new Set<string>();
  const out: ExpertProfileTestimonial[] = [];
  for (const id of ids) {
    const item = byId.get(id);
    if (!item) continue;
    const key = `${item.quote}::${item.name}`;
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(item);
  }
  return out;
}
