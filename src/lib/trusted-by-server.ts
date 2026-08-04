import "server-only";

import {
  DEFAULT_TRUSTED_CLIENTS,
  trustedClientToCard,
  type TrustedByClient,
} from "@/lib/trusted-by";
import { prisma } from "@/lib/prisma";

/** Shared loader — use from any page that renders the Trusted by grid. */
export async function loadTrustedClients(): Promise<TrustedByClient[]> {
  try {
    const rows = await prisma.trustedClient.findMany({
      where: { active: true },
      orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
    });
    if (rows.length === 0) return DEFAULT_TRUSTED_CLIENTS;
    return rows.map(trustedClientToCard);
  } catch {
    return DEFAULT_TRUSTED_CLIENTS;
  }
}

export async function loadTrustedClient(
  id: string,
): Promise<TrustedByClient | null> {
  try {
    const row = await prisma.trustedClient.findUnique({ where: { id } });
    return row ? trustedClientToCard(row) : null;
  } catch {
    return null;
  }
}

export async function listTrustedClientsAdmin(): Promise<TrustedByClient[]> {
  try {
    const rows = await prisma.trustedClient.findMany({
      orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
    });
    if (rows.length === 0) return DEFAULT_TRUSTED_CLIENTS;
    return rows.map(trustedClientToCard);
  } catch {
    return DEFAULT_TRUSTED_CLIENTS;
  }
}
