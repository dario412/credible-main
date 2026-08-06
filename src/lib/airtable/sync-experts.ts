import "server-only";

import { withResolvedLogos, type TrustedBrand } from "@/lib/brand-logos";
import { prisma } from "@/lib/prisma";

import {
  isAirtableConfigured,
  listAirtableTable,
  listAllAirtableRecords,
  type AirtableRecord,
} from "./client";
import { mapAirtableRecordToExpert } from "./map-expert";

export type SyncExpertsResult = {
  ok: boolean;
  message: string;
  created: number;
  updated: number;
  skipped: number;
  total: number;
  errors: string[];
};

function chunk<T>(items: T[], size: number): T[][] {
  const out: T[][] = [];
  for (let i = 0; i < items.length; i += size) out.push(items.slice(i, i + size));
  return out;
}

function asString(value: unknown): string | null {
  if (typeof value === "string" && value.trim()) return value.trim();
  return null;
}

/**
 * Organisations linked via Expert booked → map Experts record id → brands.
 */
async function loadTrustedByByExpertId(
  expertRecordIds: string[],
): Promise<Map<string, TrustedBrand[]>> {
  const map = new Map<string, TrustedBrand[]>();
  const unique = [...new Set(expertRecordIds.filter((id) => id.startsWith("rec")))];
  if (unique.length === 0) return map;

  const orgRecords: AirtableRecord[] = [];
  for (const group of chunk(unique, 12)) {
    const formula = `OR(${group
      .map((id) => `FIND("${id}", ARRAYJOIN({Expert booked}))`)
      .join(",")})`;
    try {
      const page = await listAirtableTable("Organisations", {
        filterByFormula: formula,
      });
      orgRecords.push(...page);
    } catch {
      // If Organisations table isn't readable, skip trusted-by sync
      return map;
    }
  }

  for (const org of orgRecords) {
    const name = asString(org.fields.Organisation);
    if (!name) continue;
    const logo = asString(org.fields["Logo url"]);
    const booked = org.fields["Expert booked"];
    const bookedIds = Array.isArray(booked)
      ? booked.filter((id): id is string => typeof id === "string")
      : [];
    const brand = withResolvedLogos([{ name, logo }])[0];
    if (!brand) continue;
    for (const expertId of bookedIds) {
      const list = map.get(expertId) ?? [];
      if (!list.some((b) => b.name.toLowerCase() === brand.name.toLowerCase())) {
        list.push(brand);
      }
      map.set(expertId, list);
    }
  }

  return map;
}

/**
 * Pull all Airtable speaker records and upsert into Expert.
 * Match order: airtableId → slug (links existing seed rows) → create.
 */
export async function syncExpertsFromAirtable(): Promise<SyncExpertsResult> {
  if (!isAirtableConfigured()) {
    return {
      ok: false,
      message:
        "Airtable is not configured. Set AIRTABLE_PAT, AIRTABLE_BASE_ID, and AIRTABLE_TABLE.",
      created: 0,
      updated: 0,
      skipped: 0,
      total: 0,
      errors: [],
    };
  }

  let records;
  try {
    records = await listAllAirtableRecords();
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Airtable fetch failed.";
    return {
      ok: false,
      message,
      created: 0,
      updated: 0,
      skipped: 0,
      total: 0,
      errors: [message],
    };
  }

  const mappedRows = records
    .map((record) => ({ record, mapped: mapAirtableRecordToExpert(record) }))
    .filter(
      (row): row is { record: AirtableRecord; mapped: NonNullable<typeof row.mapped> } =>
        Boolean(row.mapped),
    );

  const expertIds = mappedRows.flatMap((row) => row.mapped.expertsRecordIds);
  let trustedByMap = new Map<string, TrustedBrand[]>();
  try {
    trustedByMap = await loadTrustedByByExpertId(expertIds);
  } catch {
    trustedByMap = new Map();
  }

  let created = 0;
  let updated = 0;
  let skipped = records.length - mappedRows.length;
  const errors: string[] = [];
  const usedSlugs = new Set<string>();

  for (const { mapped } of mappedRows) {
    let slug = mapped.slug;
    if (usedSlugs.has(slug)) {
      slug = `${slug}-${mapped.airtableId.slice(-6).toLowerCase()}`;
    }
    usedSlugs.add(slug);

    const fromOrgs = mapped.expertsRecordIds.flatMap(
      (id) => trustedByMap.get(id) ?? [],
    );
    const fromPartnerships = withResolvedLogos(
      mapped.recentPartnerships.map((name) => ({ name })),
    );
    const trustedBy = withResolvedLogos([...fromOrgs, ...fromPartnerships]).slice(
      0,
      12,
    );

    const data = {
      airtableId: mapped.airtableId,
      slug,
      name: mapped.name,
      title: mapped.title,
      bio: mapped.bio,
      shortBio: mapped.shortBio,
      image: mapped.image,
      categories: mapped.categories,
      topics: mapped.topics,
      formats: mapped.formats,
      combinedReach: mapped.combinedReach,
      growth90d: mapped.growth90d,
      audienceWho: mapped.audienceWho,
      audienceWhere: mapped.audienceWhere,
      channels: mapped.channels,
      featured: mapped.featured,
      seoTitle: mapped.seoTitle,
      seoDescription: mapped.seoDescription,
      profileExtras: {
        nameFirst: mapped.nameFirst,
        bannerImage: mapped.bannerImage,
        highlight2: mapped.highlight2,
        highlight3: mapped.highlight3,
        exclusive: mapped.exclusive,
        quote: mapped.quote,
        quoteSource: mapped.quoteSource,
        brandPartnershipsCopy: mapped.brandPartnershipsCopy,
        trustedBy,
        profileSections: mapped.profileSections,
      },
    };

    try {
      const byAirtable = await prisma.expert.findUnique({
        where: { airtableId: mapped.airtableId },
      });

      if (byAirtable) {
        await prisma.expert.update({
          where: { id: byAirtable.id },
          data: {
            ...data,
            slug:
              mapped.slug !== byAirtable.slug && mapped.slug
                ? slug
                : byAirtable.slug,
          },
        });
        updated += 1;
        continue;
      }

      const bySlug = await prisma.expert.findUnique({ where: { slug } });
      if (bySlug) {
        await prisma.expert.update({
          where: { id: bySlug.id },
          data,
        });
        updated += 1;
        continue;
      }

      await prisma.expert.create({ data });
      created += 1;
    } catch (error) {
      const message =
        error instanceof Error
          ? `${mapped.name} (${mapped.airtableId}): ${error.message}`
          : `${mapped.name}: unknown error`;
      errors.push(message);
      skipped += 1;
    }
  }

  const ok = errors.length === 0;
  return {
    ok,
    message: ok
      ? `Synced ${created + updated} experts (${created} new, ${updated} updated, ${skipped} skipped).`
      : `Synced with ${errors.length} error(s). ${created} new, ${updated} updated, ${skipped} skipped.`,
    created,
    updated,
    skipped,
    total: records.length,
    errors: errors.slice(0, 20),
  };
}
