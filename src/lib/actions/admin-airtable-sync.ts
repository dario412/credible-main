"use server";

import { revalidatePath } from "next/cache";

import { syncExpertsFromAirtable } from "@/lib/airtable/sync-experts";
import { isAirtableConfigured } from "@/lib/airtable/client";
import { auth } from "@/lib/auth";
import { hasPermission } from "@/lib/permissions";

async function requireContentEditor() {
  const session = await auth();
  if (!session?.user || !hasPermission(session.user.role, "MANAGE_CONTENT")) {
    return null;
  }
  return session;
}

export async function getAirtableSyncStatus() {
  const session = await requireContentEditor();
  if (!session) return { ok: false as const, configured: false };

  return {
    ok: true as const,
    configured: isAirtableConfigured(),
  };
}

export async function runAirtableExpertSync() {
  const session = await requireContentEditor();
  if (!session) {
    return {
      ok: false as const,
      message: "Unauthorized",
      created: 0,
      updated: 0,
      skipped: 0,
      total: 0,
      errors: [] as string[],
    };
  }

  const result = await syncExpertsFromAirtable();

  if (result.created + result.updated > 0) {
    revalidatePath("/roster");
    revalidatePath("/");
    revalidatePath("/admin/roster");
  }

  return result;
}
