import { withResolvedLogos, type TrustedBrand } from "@/lib/brand-logos";

import { listAirtableTable, type AirtableRecord } from "./client";

function chunk<T>(items: T[], size: number): T[][] {
  const out: T[][] = [];
  for (let i = 0; i < items.length; i += size) out.push(items.slice(i, i + size));
  return out;
}

function asString(value: unknown): string | null {
  if (typeof value === "string" && value.trim()) return value.trim();
  if (typeof value === "number" && Number.isFinite(value)) return String(value);
  if (value && typeof value === "object" && "value" in value) {
    return asString((value as { value: unknown }).value);
  }
  return null;
}

function asUrl(value: unknown): string | null {
  const direct = asString(value);
  if (direct && /^https?:\/\//i.test(direct)) return direct;
  if (direct && /^(www\.)?[a-z0-9.-]+\.[a-z]{2,}\b/i.test(direct)) {
    return `https://${direct}`;
  }
  if (!Array.isArray(value)) return null;
  for (const item of value) {
    const url = asUrl(item);
    if (url) return url;
  }
  return null;
}

/** Organisation website — URL field, then AI Find url. */
export function organisationWebsiteUrl(
  fields: Record<string, unknown>,
): string | null {
  return (
    asUrl(fields.URL) ??
    asUrl(fields.Url) ??
    asUrl(fields.Website) ??
    asUrl(fields["Find url"])
  );
}

function brandFromOrg(org: AirtableRecord): TrustedBrand | null {
  const name =
    asString(org.fields.Organisation) ??
    asString(org.fields.Organization) ??
    asString(org.fields.Name);
  if (!name) return null;
  const logo = asUrl(org.fields["Logo url"]) ?? asUrl(org.fields.Logo);
  const websiteUrl = organisationWebsiteUrl(org.fields);
  return withResolvedLogos([{ name, logo, websiteUrl }])[0] ?? null;
}

/**
 * Resolve Organisations records (name + Logo url) by Airtable record id.
 * Used for Creator | Website | Company logos linked chips.
 */
export async function loadOrganisationBrandsByIds(
  recordIds: string[],
): Promise<Map<string, TrustedBrand>> {
  const map = new Map<string, TrustedBrand>();
  const unique = [...new Set(recordIds.filter((id) => id.startsWith("rec")))];
  if (unique.length === 0) return map;

  const orgRecords: AirtableRecord[] = [];
  for (const group of chunk(unique, 12)) {
    const formula = `OR(${group.map((id) => `RECORD_ID()="${id}"`).join(",")})`;
    try {
      const page = await listAirtableTable("Organisations", {
        filterByFormula: formula,
      });
      orgRecords.push(...page);
    } catch {
      return map;
    }
  }

  for (const org of orgRecords) {
    const raw = brandFromOrg(org);
    if (!raw) continue;
    const brand = withResolvedLogos([raw])[0];
    if (brand) map.set(org.id, brand);
  }

  return map;
}
