import Link from "next/link";
import { redirect } from "next/navigation";

import { MediaLibraryPanel } from "@/components/media-library";
import { listMediaAssets } from "@/lib/actions/admin-media";
import { auth } from "@/lib/auth";
import { hasPermission } from "@/lib/permissions";
import { createMetadata } from "@/lib/seo";

export const metadata = createMetadata({
  title: "Media library",
  path: "/admin/media",
  noIndex: true,
});

export default async function AdminMediaPage() {
  const session = await auth();
  if (!session?.user) redirect("/admin/login");
  if (!hasPermission(session.user.role, "MANAGE_CONTENT")) redirect("/admin");

  const assets = await listMediaAssets();

  return (
    <div className="mx-auto max-w-5xl space-y-8">
      <div>
        <h1 className="font-display text-3xl">Media</h1>
        <p className="mt-2 text-sm text-muted">
          Upload and manage images used across Trusted by, insights, case
          studies, and page editors.
        </p>
      </div>

      <MediaLibraryPanel initial={assets} />

      <p className="text-sm text-charcoal/50">
        Tip: from any image field, use{" "}
        <span className="font-medium text-charcoal/70">Select from media</span>{" "}
        to pick or upload without pasting URLs.{" "}
        <Link href="/admin/trusted-by" className="text-forest hover:text-forest-dark">
          Trusted by
        </Link>
      </p>
    </div>
  );
}
