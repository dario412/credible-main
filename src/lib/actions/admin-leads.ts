"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { hasPermission } from "@/lib/permissions";
import { prisma } from "@/lib/prisma";
import type { LeadStatus } from "@/generated/prisma/client";

export async function updateLeadStatus(id: string, status: LeadStatus) {
  const session = await auth();
  if (!session?.user || !hasPermission(session.user.role, "VIEW_LEADS")) {
    return { ok: false, message: "Unauthorized" };
  }

  await prisma.lead.update({ where: { id }, data: { status } });
  revalidatePath("/admin/leads");
  revalidatePath(`/admin/leads/${id}`);
  revalidatePath("/admin");
  return { ok: true };
}
