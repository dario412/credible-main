"use server";

import { revalidatePath } from "next/cache";

import { auth } from "@/lib/auth";
import {
  MEDIA_ALLOWED_MIME,
  MEDIA_MAX_BYTES,
  mediaAssetUrl,
  type MediaAssetCard,
} from "@/lib/media";
import { hasPermission } from "@/lib/permissions";
import { prisma } from "@/lib/prisma";

async function requireMediaEditor() {
  const session = await auth();
  if (!session?.user || !hasPermission(session.user.role, "MANAGE_CONTENT")) {
    return null;
  }
  return session;
}

function toCard(row: {
  id: string;
  fileName: string;
  mimeType: string;
  alt: string;
  byteSize: number;
  createdAt: Date;
}): MediaAssetCard {
  return {
    id: row.id,
    fileName: row.fileName,
    mimeType: row.mimeType,
    alt: row.alt,
    byteSize: row.byteSize,
    createdAt: row.createdAt.toISOString(),
    url: mediaAssetUrl(row.id),
  };
}

export async function listMediaAssets(): Promise<MediaAssetCard[]> {
  const rows = await prisma.mediaAsset.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      fileName: true,
      mimeType: true,
      alt: true,
      byteSize: true,
      createdAt: true,
    },
  });
  return rows.map(toCard);
}

export async function uploadMediaAsset(formData: FormData) {
  const session = await requireMediaEditor();
  if (!session) return { ok: false as const, message: "Unauthorized" };

  const file = formData.get("file");
  if (!(file instanceof File) || file.size === 0) {
    return { ok: false as const, message: "Choose an image to upload." };
  }
  if (file.size > MEDIA_MAX_BYTES) {
    return { ok: false as const, message: "Image must be under 4 MB." };
  }

  const mimeType = file.type || "application/octet-stream";
  if (!MEDIA_ALLOWED_MIME.has(mimeType)) {
    return {
      ok: false as const,
      message: "Use PNG, JPG, WebP, GIF, or SVG.",
    };
  }

  const alt =
    typeof formData.get("alt") === "string"
      ? String(formData.get("alt")).trim()
      : "";
  const buffer = Buffer.from(await file.arrayBuffer());

  const row = await prisma.mediaAsset.create({
    data: {
      fileName: file.name.slice(0, 180) || "upload",
      mimeType,
      alt,
      byteSize: buffer.byteLength,
      data: buffer,
    },
    select: {
      id: true,
      fileName: true,
      mimeType: true,
      alt: true,
      byteSize: true,
      createdAt: true,
    },
  });

  revalidatePath("/admin/media");
  return {
    ok: true as const,
    message: "Uploaded.",
    asset: toCard(row),
  };
}

export async function deleteMediaAsset(id: string) {
  const session = await requireMediaEditor();
  if (!session) return { ok: false as const, message: "Unauthorized" };

  await prisma.mediaAsset.delete({ where: { id } });
  revalidatePath("/admin/media");
  return { ok: true as const, message: "Removed." };
}

export async function updateMediaAlt(id: string, alt: string) {
  const session = await requireMediaEditor();
  if (!session) return { ok: false as const, message: "Unauthorized" };

  await prisma.mediaAsset.update({
    where: { id },
    data: { alt: alt.trim().slice(0, 200) },
  });
  revalidatePath("/admin/media");
  return { ok: true as const, message: "Updated." };
}
