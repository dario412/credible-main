"use server";

import bcrypt from "bcryptjs";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { auth } from "@/lib/auth";
import { hasPermission } from "@/lib/permissions";
import { prisma } from "@/lib/prisma";
import type { Role } from "@/generated/prisma/client";

async function requireOwner() {
  const session = await auth();
  if (!session?.user || !hasPermission(session.user.role, "MANAGE_USERS")) {
    return null;
  }
  return session;
}

const createSchema = z.object({
  email: z.string().email(),
  name: z.string().min(1).max(120),
  role: z.enum(["OWNER", "EDITOR", "VIEWER"]),
  password: z.string().min(6).max(100),
});

export async function createUser(formData: FormData) {
  const session = await requireOwner();
  if (!session) return { ok: false, message: "Unauthorized" };

  const parsed = createSchema.safeParse({
    email: formData.get("email"),
    name: formData.get("name"),
    role: formData.get("role"),
    password: formData.get("password"),
  });
  if (!parsed.success) {
    return { ok: false, message: "Check the form fields and try again." };
  }

  const existing = await prisma.user.findUnique({
    where: { email: parsed.data.email },
  });
  if (existing) {
    return { ok: false, message: "A user with that email already exists." };
  }

  const passwordHash = await bcrypt.hash(parsed.data.password, 12);
  await prisma.user.create({
    data: {
      email: parsed.data.email,
      name: parsed.data.name,
      role: parsed.data.role as Role,
      passwordHash,
      createdById: session.user.id,
      totpEnabled: false,
    },
  });

  revalidatePath("/admin/users");
  return { ok: true, message: "User created. They must set up 2FA on first login." };
}

export async function updateUserRole(userId: string, role: Role) {
  const session = await requireOwner();
  if (!session) return { ok: false, message: "Unauthorized" };

  const target = await prisma.user.findUnique({ where: { id: userId } });
  if (!target) return { ok: false, message: "User not found." };

  if (target.role === "OWNER" && role !== "OWNER") {
    const owners = await prisma.user.count({
      where: { role: "OWNER", active: true },
    });
    if (owners <= 1) {
      return { ok: false, message: "Cannot demote the last owner." };
    }
  }

  await prisma.user.update({ where: { id: userId }, data: { role } });
  revalidatePath("/admin/users");
  return { ok: true };
}

export async function setUserActive(userId: string, active: boolean) {
  const session = await requireOwner();
  if (!session) return { ok: false, message: "Unauthorized" };

  if (userId === session.user.id && !active) {
    return { ok: false, message: "You cannot deactivate yourself." };
  }

  const target = await prisma.user.findUnique({ where: { id: userId } });
  if (!target) return { ok: false, message: "User not found." };

  if (target.role === "OWNER" && !active) {
    const owners = await prisma.user.count({
      where: { role: "OWNER", active: true },
    });
    if (owners <= 1) {
      return { ok: false, message: "Cannot deactivate the last owner." };
    }
  }

  await prisma.user.update({ where: { id: userId }, data: { active } });
  revalidatePath("/admin/users");
  return { ok: true };
}
