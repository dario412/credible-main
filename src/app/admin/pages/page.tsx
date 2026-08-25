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

const pages: {
  slug: string;
  title: string;
  description: string;
  disabled?: boolean;
}[] = [
  {
    slug: "home",
    title: "Home",
    description:
      "Hero, ways in, roster, impact stats, case study, and brief. Logos live under Homepage logos.",
  },
  {
    slug: "site",
    title: "Header, footer & profile template",
    description:
      "Nav, Send brief CTA, footer, profile template, format cards, Insights promos, and article sidebar CTA.",
  },
  {
    slug: "contact",
    title: "Contact",
    description:
      "Intro, briefed-by logos, What happens next sidebar, and footer contact blocks on /contact.",
  },
  {
    slug: "roster",
    title: "Roster",
    description: "Intro headline and supporting line on /roster.",
  },
  {
    slug: "case-studies",
    title: "Case studies",
    description: "FAQ accordion under All stories on /case-studies.",
  },
  {
    slug: "about",
    title: "About",
    description:
      "Hero, thesis, why we exist, operating model, how we work, roster rail, and two ways in.",
  },
  {
    slug: "what-we-do",
    title: "What we do",
    description:
      "Hero, service system, business moments, service cards, process, how to choose, and closing CTA.",
  },
  {
    slug: "apply-for-representation",
    title: "Apply for representation",
    description:
      "Intro, what you get, self-qualify, path, FAQ, and start-application CTA.",
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
