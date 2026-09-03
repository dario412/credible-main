import { WhatWeDoVisualEditor } from "@/components/what-we-do-visual-editor";
import {
  getWhatWeDoSections,
  saveWhatWeDoPage,
} from "@/lib/actions/admin-cms";
import { auth } from "@/lib/auth";
import { hasPermission } from "@/lib/permissions";
import { createMetadata } from "@/lib/seo";

export const dynamic = "force-dynamic";

export const metadata = createMetadata({
  title: "How we work",
  description:
    "Four ways to put an expert voice behind your brand — content, brand partnerships, speaking, and live events.",
  path: "/how-we-work",
});

export default async function HowWeWorkPage() {
  const [sections, session] = await Promise.all([
    getWhatWeDoSections(),
    auth(),
  ]);
  const canEdit = Boolean(
    session?.user && hasPermission(session.user.role, "MANAGE_CONTENT"),
  );

  return (
    <WhatWeDoVisualEditor
      initial={sections}
      canEdit={canEdit}
      saveAction={saveWhatWeDoPage}
    />
  );
}
