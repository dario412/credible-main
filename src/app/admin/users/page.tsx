import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { hasPermission, ROLE_LABELS } from "@/lib/permissions";
import { createMetadata } from "@/lib/seo";
import { CreateUserForm } from "@/components/create-user-form";
import { UserRowActions } from "@/components/user-row-actions";

export const metadata = createMetadata({
  title: "Users",
  path: "/admin/users",
  noIndex: true,
});

export default async function AdminUsersPage() {
  const session = await auth();
  if (!session?.user) redirect("/admin/login");
  if (!hasPermission(session.user.role, "MANAGE_USERS")) redirect("/admin");

  const users = await prisma.user.findMany({
    orderBy: [{ role: "asc" }, { email: "asc" }],
  });

  return (
    <div>
      <h1 className="font-display text-3xl">User management</h1>
      <p className="mt-2 max-w-2xl text-sm text-muted">
        Owners can add users with Owner, Editor, or Viewer permissions. New users
        must complete two-factor authentication on first login.
      </p>

      <div className="mt-10 max-w-lg">
        <h2 className="font-display text-2xl">Add user</h2>
        <div className="mt-4">
          <CreateUserForm />
        </div>
      </div>

      <div className="mt-12 overflow-x-auto border border-charcoal/10">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead className="border-b border-charcoal/10 bg-cream-dark text-xs uppercase tracking-wide text-muted">
            <tr>
              <th className="px-4 py-3 font-medium">User</th>
              <th className="px-4 py-3 font-medium">Role</th>
              <th className="px-4 py-3 font-medium">2FA</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} className="border-b border-charcoal/5">
                <td className="px-4 py-3">
                  <p className="font-medium">{user.name ?? "—"}</p>
                  <p className="text-muted">{user.email}</p>
                </td>
                <td className="px-4 py-3">{ROLE_LABELS[user.role]}</td>
                <td className="px-4 py-3">
                  {user.totpEnabled ? "Enabled" : "Pending"}
                </td>
                <td className="px-4 py-3">
                  {user.active ? "Active" : "Inactive"}
                </td>
                <td className="px-4 py-3">
                  <UserRowActions
                    userId={user.id}
                    role={user.role}
                    active={user.active}
                    isSelf={user.id === session.user.id}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
