"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import { auth } from "@/lib/auth";
import { hasPermission } from "@/lib/permissions";
import { prisma } from "@/lib/prisma";
import {
  DEFAULT_BODY_FAMILY,
  DEFAULT_HEADING_FAMILY,
  GOOGLE_FONTS,
  type FontRole,
  type FontSource,
} from "@/lib/site-fonts";

export type FontActionState = {
  ok: boolean;
  message: string;
};

const ALLOWED_MIME = new Set([
  "font/woff2",
  "font/woff",
  "font/ttf",
  "font/otf",
  "application/font-woff",
  "application/font-woff2",
  "application/x-font-ttf",
  "application/x-font-otf",
  "application/octet-stream",
]);

const choiceSchema = z.object({
  family: z.string().min(1).max(80),
  source: z.enum(["default", "google", "upload"]),
  assetId: z.string().min(1).nullable().optional(),
});

async function requireFontEditor() {
  const session = await auth();
  if (!session?.user) return { ok: false as const, message: "Unauthorized" };
  if (!hasPermission(session.user.role, "MANAGE_CONTENT")) {
    return { ok: false as const, message: "You cannot change site fonts." };
  }
  return { ok: true as const, session };
}

function normalizeGoogleFamily(family: string) {
  const trimmed = family.trim();
  const known = GOOGLE_FONTS.find(
    (f) => f.toLowerCase() === trimmed.toLowerCase(),
  );
  return known ?? trimmed;
}

export async function saveSiteFonts(
  _prev: FontActionState,
  formData: FormData,
): Promise<FontActionState> {
  const gate = await requireFontEditor();
  if (!gate.ok) return { ok: false, message: gate.message };

  const headingParsed = choiceSchema.safeParse({
    family: formData.get("headingFamily"),
    source: formData.get("headingSource"),
    assetId: formData.get("headingAssetId") || null,
  });
  const bodyParsed = choiceSchema.safeParse({
    family: formData.get("bodyFamily"),
    source: formData.get("bodySource"),
    assetId: formData.get("bodyAssetId") || null,
  });

  if (!headingParsed.success || !bodyParsed.success) {
    return { ok: false, message: "Invalid font selection." };
  }

  const heading = headingParsed.data;
  const body = bodyParsed.data;

  if (heading.source === "default") {
    heading.family = DEFAULT_HEADING_FAMILY;
    heading.assetId = null;
  } else if (heading.source === "google") {
    heading.family = normalizeGoogleFamily(heading.family);
    heading.assetId = null;
  } else if (!heading.assetId) {
    return { ok: false, message: "Upload a heading font file first." };
  }

  if (body.source === "default") {
    body.family = DEFAULT_BODY_FAMILY;
    body.assetId = null;
  } else if (body.source === "google") {
    body.family = normalizeGoogleFamily(body.family);
    body.assetId = null;
  } else if (!body.assetId) {
    return { ok: false, message: "Upload a body font file first." };
  }

  await prisma.siteSettings.upsert({
    where: { id: "default" },
    create: {
      id: "default",
      headingFamily: heading.family,
      headingSource: heading.source,
      headingAssetId: heading.assetId ?? null,
      bodyFamily: body.family,
      bodySource: body.source,
      bodyAssetId: body.assetId ?? null,
    },
    update: {
      headingFamily: heading.family,
      headingSource: heading.source,
      headingAssetId: heading.assetId ?? null,
      bodyFamily: body.family,
      bodySource: body.source,
      bodyAssetId: body.assetId ?? null,
    },
  });

  revalidatePath("/", "layout");
  revalidatePath("/admin/style-guide");

  return { ok: true, message: "Fonts saved — live across the site." };
}

export async function uploadSiteFont(
  role: FontRole,
  formData: FormData,
): Promise<FontActionState & { assetId?: string; family?: string }> {
  const gate = await requireFontEditor();
  if (!gate.ok) return { ok: false, message: gate.message };

  const file = formData.get("file");
  if (!(file instanceof File) || file.size === 0) {
    return { ok: false, message: "Choose a font file to upload." };
  }

  if (file.size > 2_500_000) {
    return { ok: false, message: "Font file must be under 2.5MB." };
  }

  const lower = file.name.toLowerCase();
  const hasAllowedExt = [".woff2", ".woff", ".ttf", ".otf"].some((e) =>
    lower.endsWith(e),
  );
  if (!hasAllowedExt && !ALLOWED_MIME.has(file.type)) {
    return {
      ok: false,
      message: "Use a .woff2, .woff, .ttf, or .otf font file.",
    };
  }

  const familyRaw = String(formData.get("family") ?? "").trim();
  const family =
    familyRaw ||
    file.name.replace(/\.(woff2|woff|ttf|otf)$/i, "").replace(/[-_]/g, " ");

  const buffer = Buffer.from(await file.arrayBuffer());
  const ext = [".woff2", ".woff", ".ttf", ".otf"].find((e) =>
    lower.endsWith(e),
  );
  const mimeType =
    file.type && file.type !== "application/octet-stream"
      ? file.type
      : ext === ".woff2"
        ? "font/woff2"
        : ext === ".woff"
          ? "font/woff"
          : ext === ".otf"
            ? "font/otf"
            : "font/ttf";

  const asset = await prisma.fontAsset.create({
    data: {
      family,
      fileName: file.name,
      mimeType,
      data: buffer,
    },
  });

  const current = await prisma.siteSettings.findUnique({
    where: { id: "default" },
  });

  const source: FontSource = "upload";
  if (role === "heading") {
    await prisma.siteSettings.upsert({
      where: { id: "default" },
      create: {
        id: "default",
        headingFamily: family,
        headingSource: source,
        headingAssetId: asset.id,
        bodyFamily: current?.bodyFamily ?? DEFAULT_BODY_FAMILY,
        bodySource: (current?.bodySource as FontSource) ?? "default",
        bodyAssetId: current?.bodyAssetId ?? null,
      },
      update: {
        headingFamily: family,
        headingSource: source,
        headingAssetId: asset.id,
      },
    });
  } else {
    await prisma.siteSettings.upsert({
      where: { id: "default" },
      create: {
        id: "default",
        headingFamily: current?.headingFamily ?? DEFAULT_HEADING_FAMILY,
        headingSource: (current?.headingSource as FontSource) ?? "default",
        headingAssetId: current?.headingAssetId ?? null,
        bodyFamily: family,
        bodySource: source,
        bodyAssetId: asset.id,
      },
      update: {
        bodyFamily: family,
        bodySource: source,
        bodyAssetId: asset.id,
      },
    });
  }

  revalidatePath("/", "layout");
  revalidatePath("/admin/style-guide");

  return {
    ok: true,
    message: `${role === "heading" ? "Heading" : "Body"} font uploaded and applied.`,
    assetId: asset.id,
    family,
  };
}

export async function resetSiteFonts(): Promise<FontActionState> {
  const gate = await requireFontEditor();
  if (!gate.ok) return { ok: false, message: gate.message };

  await prisma.siteSettings.upsert({
    where: { id: "default" },
    create: {
      id: "default",
      headingFamily: DEFAULT_HEADING_FAMILY,
      headingSource: "default",
      headingAssetId: null,
      bodyFamily: DEFAULT_BODY_FAMILY,
      bodySource: "default",
      bodyAssetId: null,
    },
    update: {
      headingFamily: DEFAULT_HEADING_FAMILY,
      headingSource: "default",
      headingAssetId: null,
      bodyFamily: DEFAULT_BODY_FAMILY,
      bodySource: "default",
      bodyAssetId: null,
    },
  });

  revalidatePath("/", "layout");
  revalidatePath("/admin/style-guide");

  return { ok: true, message: "Fonts reset to Faculty Glyphic + Instrument Sans." };
}
