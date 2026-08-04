"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import { auth } from "@/lib/auth";
import { hasPermission } from "@/lib/permissions";
import { prisma } from "@/lib/prisma";
import {
  trustedClientToCard,
  trustedClientToRow,
  type TrustedByClient,
} from "@/lib/trusted-by";

async function requireContentEditor() {
  const session = await auth();
  if (!session?.user || !hasPermission(session.user.role, "MANAGE_CONTENT")) {
    return null;
  }
  return session;
}

function revalidateTrustedBy() {
  revalidatePath("/");
  revalidatePath("/admin/trusted-by");
}

const clientSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1).max(120),
  logoSrc: z.string().max(500),
  caseStudySlug: z.string().max(160),
  active: z.boolean().optional(),
  sortOrder: z.number().int().optional(),
  testimonial: z
    .object({
      quote: z.string().max(1200),
      name: z.string().max(120),
      title: z.string().max(200),
      imageSrc: z.string().max(500),
    })
    .nullable(),
});

export async function listTrustedClientCards(): Promise<TrustedByClient[]> {
  const rows = await prisma.trustedClient.findMany({
    orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
  });
  return rows.map(trustedClientToCard);
}

export async function getTrustedClientCard(
  id: string,
): Promise<TrustedByClient | null> {
  const row = await prisma.trustedClient.findUnique({ where: { id } });
  return row ? trustedClientToCard(row) : null;
}

export async function saveTrustedClient(input: TrustedByClient) {
  const session = await requireContentEditor();
  if (!session) return { ok: false as const, message: "Unauthorized" };

  const parsed = clientSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false as const, message: "Check the form fields and try again." };
  }

  const data = parsed.data;
  const sortOrder =
    data.sortOrder ??
    (await prisma.trustedClient.count());

  const rowData = trustedClientToRow(
    {
      name: data.name,
      logoSrc: data.logoSrc,
      caseStudySlug: data.caseStudySlug,
      testimonial: data.testimonial,
      active: data.active,
    },
    sortOrder,
  );

  if (data.id) {
    await prisma.trustedClient.update({
      where: { id: data.id },
      data: rowData,
    });
  } else {
    await prisma.trustedClient.create({ data: rowData });
  }

  revalidateTrustedBy();
  return { ok: true as const, message: "Trusted by client saved." };
}

export async function deleteTrustedClient(id: string) {
  const session = await requireContentEditor();
  if (!session) return { ok: false as const, message: "Unauthorized" };

  await prisma.trustedClient.delete({ where: { id } });
  revalidateTrustedBy();
  return { ok: true as const, message: "Client removed." };
}

/** Replace the full ordered list (used by live homepage editor). */
export async function saveTrustedClientsList(clients: TrustedByClient[]) {
  const session = await requireContentEditor();
  if (!session) return { ok: false as const, message: "Unauthorized" };

  const cleaned = clients
    .map((client, index) => {
      const parsed = clientSchema.safeParse(client);
      if (!parsed.success) return null;
      return { parsed: parsed.data, index };
    })
    .filter((row): row is { parsed: z.infer<typeof clientSchema>; index: number } =>
      Boolean(row),
    );

  await prisma.$transaction(async (tx) => {
    await tx.trustedClient.deleteMany();
    if (cleaned.length === 0) return;
    await tx.trustedClient.createMany({
      data: cleaned.map(({ parsed, index }) =>
        trustedClientToRow(
          {
            name: parsed.name,
            logoSrc: parsed.logoSrc,
            caseStudySlug: parsed.caseStudySlug,
            testimonial: parsed.testimonial,
            active: parsed.active ?? true,
          },
          parsed.sortOrder ?? index,
        ),
      ),
    });
  });

  revalidateTrustedBy();
  return { ok: true as const, message: "Trusted by logos saved." };
}
