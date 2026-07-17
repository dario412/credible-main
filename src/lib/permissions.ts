import type { Role } from "@/generated/prisma/enums";

export type Permission = "VIEW_LEADS" | "MANAGE_USERS" | "MANAGE_CONTENT";

const ROLE_PERMISSIONS: Record<Role, Permission[]> = {
  OWNER: ["VIEW_LEADS", "MANAGE_USERS", "MANAGE_CONTENT"],
  EDITOR: ["VIEW_LEADS", "MANAGE_CONTENT"],
  VIEWER: ["VIEW_LEADS"],
};

export function permissionsFor(role: Role): Permission[] {
  return ROLE_PERMISSIONS[role] ?? [];
}

export function hasPermission(role: Role, permission: Permission): boolean {
  return permissionsFor(role).includes(permission);
}

export const ROLE_LABELS: Record<Role, string> = {
  OWNER: "Owner",
  EDITOR: "Editor",
  VIEWER: "Viewer",
};
