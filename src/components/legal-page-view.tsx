import { LegalDocumentBody } from "@/components/legal-document-body";
import type { LegalPageDoc } from "@/lib/legal-pages";

export function LegalPageView({ page }: { page: LegalPageDoc }) {
  return (
    <div className="mx-auto max-w-3xl px-6 py-16 md:px-10 md:py-20">
      <header>
        <h1 className="font-display text-4xl text-charcoal">{page.title}</h1>
        {page.effectiveDate ? (
          <p className="mt-3 text-sm text-charcoal/55">
            Effective date: {page.effectiveDate}
          </p>
        ) : null}
      </header>
      <LegalDocumentBody body={page.body} />
    </div>
  );
}
