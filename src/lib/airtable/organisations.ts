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
  return null;
}

function asUrl(value: unknown): string | null {
  const direct = asString(value);
  if (direct && /^https?:\/\//i.test(direct)) return direct;
  if (!Array.isArray(value)) return null;
  for (const item of value) {
    if (typeof item === "string" && /^https?:\/\//i.test(item.trim())) {
      return item.trim();
    }
    if (item && typeof item === "object" && "url" in item) {
      const url = (item as { url?: unknown }).url;
      if (typeof url === "string" && /^https?:\/\//i.test(url)) return url;
    }
  }
  return null;
}

function brandFromOrg(org: AirtableRecord): TrustedBrand | null {
  const name =
    asString(org.fields.Organisation) ??
    asString(org.fields.Organization) ??
    asString(org.fields.Name);
  if (!name) return null;
  const logo = asUrl(org.fields["Logo url"]) ?? asUrl(org.fields.Logo);
  return { name, logo: logo ?? undefined };
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
