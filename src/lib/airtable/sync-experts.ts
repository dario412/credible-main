import "server-only";

import { withResolvedLogos, type TrustedBrand } from "@/lib/brand-logos";
import type { ExpertProfileTestimonial } from "@/lib/expert-profiles";
import { prisma } from "@/lib/prisma";

import {
  isAirtableConfigured,
  listAirtableTable,
  listAllAirtableRecords,
  type AirtableRecord,
} from "./client";
import {
  mapAirtableRecordToExpert,
} from "./map-expert";
import { loadOrganisationBrandsByIds } from "./organisations";
import {
  loadTestimonialsByIds,
  resolveOrderedTestimonials,
} from "./testimonials";

export type SyncExpertsResult = {
  ok: boolean;
  message: string;
  created: number;
  updated: number;
  removed: number;
  skipped: number;
  total: number;
  errors: string[];
  createdNames: string[];
  removedNames: string[];
};

function emptySyncResult(
  message: string,
  extra?: Partial<SyncExpertsResult>,
): SyncExpertsResult {
  return {
    ok: false,
    message,
    created: 0,
    updated: 0,
    removed: 0,
    skipped: 0,
    total: 0,
    errors: [],
    createdNames: [],
    removedNames: [],
    ...extra,
  };
}

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
 * Pull all Airtable speaker records and reconcile Expert.
 * Adds new creators, updates existing ones, and removes anyone missing
 * from Airtable (deleted, archived, or no longer mappable).
 * Match order: airtableId → slug (links existing seed rows) → create.
 */
export async function syncExpertsFromAirtable(): Promise<SyncExpertsResult> {
  if (!isAirtableConfigured()) {
    return emptySyncResult(
      "Airtable is not configured. Set AIRTABLE_PAT, AIRTABLE_BASE_ID, and AIRTABLE_TABLE.",
    );
  }

  let records;
  try {
    records = await listAllAirtableRecords();
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Airtable fetch failed.";
    return emptySyncResult(message, { errors: [message] });
  }

  const mappedRows = records
    .map((record) => ({
      record,
      mapped: mapAirtableRecordToExpert(record),
    }))
    .filter(
      (row): row is { record: AirtableRecord; mapped: NonNullable<typeof row.mapped> } =>
        Boolean(row.mapped),
    );

  if (records.length > 0 && mappedRows.length === 0) {
    return emptySyncResult(
      "Airtable returned records but none could be mapped. Left the existing roster in place.",
      {
        total: records.length,
        skipped: records.length,
        errors: [
          "Check that creator names are present and Archive is not set on every row.",
        ],
      },
    );
  }

  const expertIds = mappedRows.flatMap((row) => row.mapped.expertsRecordIds);
  const companyLogoIds = mappedRows.flatMap((row) => row.mapped.companyLogoIds);
  let trustedByMap = new Map<string, TrustedBrand[]>();
  let organisationBrands = new Map<string, TrustedBrand>();
  try {
    trustedByMap = await loadTrustedByByExpertId(expertIds);
  } catch {
    trustedByMap = new Map();
  }
  try {
    organisationBrands = await loadOrganisationBrandsByIds(companyLogoIds);
  } catch {
    organisationBrands = new Map();
  }

  const allTestimonialIds = mappedRows.flatMap((row) => row.mapped.testimonialIds);
  let testimonialsById = new Map<string, ExpertProfileTestimonial>();
  try {
    testimonialsById = await loadTestimonialsByIds(allTestimonialIds);
  } catch {
    testimonialsById = new Map();
  }

  let created = 0;
  let updated = 0;
  let skipped = records.length - mappedRows.length;
  const errors: string[] = [];
  const createdNames: string[] = [];
  const usedSlugs = new Set<string>();
  const keepIds = mappedRows.map((row) => row.mapped.airtableId);

  for (const { mapped } of mappedRows) {
    let slug = mapped.slug;
    if (usedSlugs.has(slug)) {
      slug = `${slug}-${mapped.airtableId.slice(-6).toLowerCase()}`;
    }
    usedSlugs.add(slug);

    const fromCompanyLogos = mapped.companyLogoIds
      .map((id) => organisationBrands.get(id))
      .filter((brand): brand is TrustedBrand => Boolean(brand));
    const fromOrgs = mapped.expertsRecordIds.flatMap(
      (id) => trustedByMap.get(id) ?? [],
    );
    const fromPartnerships = withResolvedLogos(
      mapped.recentPartnerships.map((name) => ({ name })),
    );
    const trustedBy = withResolvedLogos(
      fromCompanyLogos.length > 0
        ? fromCompanyLogos
        : [...fromOrgs, ...fromPartnerships],
    )
      .filter((brand) => Boolean(brand.logo))
      .slice(0, 12);

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
        highlight1: mapped.highlight1,
        highlight2: mapped.highlight2,
        highlight3: mapped.highlight3,
        highlight4: mapped.highlight4,
        websiteSubtitle: mapped.websiteSubtitle,
        exclusive: mapped.exclusive,
        quote: mapped.quote,
        quoteSource: mapped.quoteSource,
        brandPartnershipsCopy: mapped.brandPartnershipsCopy,
        trustedBy,
        similarProfileIds: mapped.similarProfileIds,
        profileSections: mapped.profileSections,
        testimonials: resolveOrderedTestimonials(
          mapped.testimonialIds,
          testimonialsById,
        ),
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
      createdNames.push(mapped.name);
    } catch (error) {
      const message =
        error instanceof Error
          ? `${mapped.name} (${mapped.airtableId}): ${error.message}`
          : `${mapped.name}: unknown error`;
      errors.push(message);
      skipped += 1;
    }
  }

  const stale =
    keepIds.length === 0
      ? await prisma.expert.findMany({ select: { id: true, name: true } })
      : await prisma.expert.findMany({
          where: {
            OR: [{ airtableId: null }, { airtableId: { notIn: keepIds } }],
          },
          select: { id: true, name: true },
        });

  if (stale.length > 0) {
    await prisma.expert.deleteMany({
      where: { id: { in: stale.map((expert) => expert.id) } },
    });
  }

  const removedNames = stale.map((expert) => expert.name);
  const removed = removedNames.length;
  const ok = errors.length === 0;
  return {
    ok,
    message: ok
      ? `Synced ${created + updated} creators (${created} added, ${updated} updated, ${removed} removed).`
      : `Synced with ${errors.length} error(s). ${created} added, ${updated} updated, ${removed} removed, ${skipped} skipped.`,
    created,
    updated,
    removed,
    skipped,
    total: records.length,
    errors: errors.slice(0, 20),
    createdNames: createdNames.slice(0, 20),
    removedNames: removedNames.slice(0, 20),
  };
}
