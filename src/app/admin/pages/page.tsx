import Link from "next/link";
import { redirect } from "next/navigation";

import { auth } from "@/lib/auth";
import { hasPermission } from "@/lib/permissions";
import { createMetadata } from "@/lib/seo";

export const metadata = createMetadata({
  title: "Pages CMS",
  path: "/admin/pages",
  noIndex: true,
});

const pages = [
  {
    slug: "home",
    title: "Home",
    description:
      "Hero, ways in, roster, impact stats, case study, brief, and footer. Logos live under Trusted by.",
  },
  {
    slug: "about",
    title: "About",
    description: "Coming online when the About page leaves placeholder.",
    disabled: true,
  },
  {
    slug: "what-we-do",
    title: "What we do",
    description: "Coming online when the What we do page leaves placeholder.",
    disabled: true,
  },
];

export default async function AdminPagesPage() {
  const session = await auth();
  if (!session?.user) redirect("/admin/login");
  if (!hasPermission(session.user.role, "MANAGE_CONTENT")) redirect("/admin");

  return (
    <div className="mx-auto max-w-3xl space-y-8">
      <div>
        <h1 className="font-display text-3xl">Pages</h1>
        <p className="mt-2 text-sm text-muted">
          Edit marketing page copy without a deploy.
        </p>
      </div>

      <ul className="divide-y divide-charcoal/10 overflow-hidden rounded-sm border border-charcoal/10 bg-white">
        {pages.map((page) => (
          <li key={page.slug} className="flex items-center justify-between gap-4 px-5 py-4">
            <div>
              <p className="font-medium text-charcoal">{page.title}</p>
              <p className="mt-0.5 text-sm text-muted">{page.description}</p>
            </div>
            {page.disabled ? (
              <span className="text-xs tracking-wide text-charcoal/40 uppercase">
                Soon
              </span>
            ) : (
              <Link
                href={`/admin/pages/${page.slug}`}
                className="font-medium text-forest hover:text-forest-dark"
              >
                Edit
              </Link>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
