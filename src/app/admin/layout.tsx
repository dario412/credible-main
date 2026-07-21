import Link from "next/link";
import { auth, signOut } from "@/lib/auth";
import { hasPermission } from "@/lib/permissions";
import { createMetadata } from "@/lib/seo";
import { AdminNav } from "@/components/admin-nav";
import { AdminTopbar } from "@/components/admin-topbar";

export const metadata = createMetadata({
  title: "Admin",
  path: "/admin",
  noIndex: true,
});

const nav = [
  { href: "/admin", label: "Dashboard", permission: null },
  { href: "/admin/leads", label: "Leads", permission: "VIEW_LEADS" as const },
  { href: "/admin/users", label: "Users", permission: "MANAGE_USERS" as const },
  { href: "/admin/style-guide", label: "Style guide", permission: null },
];

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session?.user) {
    return children;
  }

  const user = session.user;
  const items = nav.filter(
    (item) => !item.permission || hasPermission(user.role, item.permission),
  );

  return (
    <div className="flex min-h-screen bg-[#f4f2ef] text-charcoal">
      {/* Fixed-width sidebar — never resizes with active state */}
      <aside className="sticky top-0 hidden h-screen w-60 shrink-0 flex-col border-r border-charcoal/10 bg-white md:flex">
        <div className="flex h-14 shrink-0 items-center border-b border-charcoal/10 px-5">
          <Link href="/" className="inline-block transition-opacity hover:opacity-80">
            <img
              src="/brand/credible-wordmark.svg"
              alt="Credible"
              width={253}
              height={50}
              className="h-6 w-auto"
            />
          </Link>
        </div>

        <div className="flex-1 overflow-y-auto">
          <AdminNav items={items} />
        </div>

        <div className="shrink-0 border-t border-charcoal/10 p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-forest text-[11px] font-semibold text-cream">
              {(user.name ?? user.email).slice(0, 1).toUpperCase()}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium leading-tight">
                {user.name ?? "Admin"}
              </p>
              <p className="truncate text-[11px] capitalize text-muted">
                {user.role.toLowerCase()}
              </p>
            </div>
          </div>
          <form
            action={async () => {
              "use server";
              await signOut({ redirectTo: "/admin/login" });
            }}
            className="mt-3"
          >
            <button
              type="submit"
              className="w-full rounded-md px-2 py-1.5 text-left text-xs text-muted transition-colors hover:bg-charcoal/4 hover:text-charcoal"
            >
              Sign out
            </button>
          </form>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <AdminTopbar
          email={user.email}
          items={items}
          name={user.name}
        />
        <main className="flex-1 p-5 md:p-7">{children}</main>
      </div>
    </div>
  );
}
