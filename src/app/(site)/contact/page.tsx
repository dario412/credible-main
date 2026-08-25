import { BriefForm } from "@/components/brief-form";
import { ContactVisualEditor } from "@/components/contact-visual-editor";
import {
  getContactPageSections,
  saveContactPage,
} from "@/lib/actions/admin-cms";
import { auth } from "@/lib/auth";
import { hasPermission } from "@/lib/permissions";
import { createMetadata } from "@/lib/seo";

export const dynamic = "force-dynamic";

export const metadata = createMetadata({
  title: "Send brief",
  description:
    "Brief B2B expert creators your buyers already trust. Same-day acknowledgement, shortlist within 48 hours.",
  path: "/contact",
});

export default async function ContactPage() {
  const [content, session] = await Promise.all([
    getContactPageSections(),
    auth(),
  ]);
  const canEdit = Boolean(
    session?.user && hasPermission(session.user.role, "MANAGE_CONTENT"),
  );

  return (
    <div className="px-6 py-14 md:px-10 md:py-18 lg:px-12 lg:py-20">
      <div className="mx-auto max-w-352">
        <ContactVisualEditor
          initial={content}
          canEdit={canEdit}
          saveAction={saveContactPage}
          form={
            <div className="flex h-full min-h-0 flex-col rounded-sm border border-charcoal/8 bg-[#FBF8F5] p-5 shadow-[0_10px_28px_rgba(28,26,23,0.06)] sm:p-6 md:p-8">
              <BriefForm
                surface="light"
                fillHeight
                formFootnote="Same-day acknowledgement · shortlist within 48 hours · no pitch deck required"
              />
            </div>
          }
        />
      </div>
    </div>
  );
}
