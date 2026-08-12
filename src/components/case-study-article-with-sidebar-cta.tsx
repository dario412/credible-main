"use client";

import { CaseStudyArticleEditorProvider } from "@/components/case-study-article-editor";
import { CaseStudyContentStream } from "@/components/case-study-content-stream";
import { CaseStudyCreatorCta } from "@/components/case-study-creator-cta";
import { InsightArticleCta } from "@/components/insight-article-cta";
import { InsightShare } from "@/components/insight-share";
import type { CaseStudyBlock, CaseStudyTocItem } from "@/lib/case-study-content";

export function CaseStudyArticleWithSidebarCta({
  canEdit,
  saveAction,
  blocks,
  toc,
  shareUrl,
  title,
  ctaCreator,
}: {
  canEdit: boolean;
  saveAction: typeof import("@/lib/actions/admin-cms").saveSiteChrome;
  blocks: CaseStudyBlock[];
  toc: CaseStudyTocItem[];
  shareUrl: string;
  title: string;
  ctaCreator: { name: string; slug: string } | null;
}) {
  return (
    <CaseStudyArticleEditorProvider canEdit={canEdit} saveAction={saveAction}>
      <CaseStudyContentStream
        blocks={blocks}
        toc={toc}
        share={<InsightShare url={shareUrl} title={title} />}
        sidebarExtra={<InsightArticleCta />}
        afterColumn={
          <>
            {ctaCreator ? (
              <CaseStudyCreatorCta
                className="mt-10 md:mt-12"
                creatorName={ctaCreator.name}
                expert={{
                  slug: ctaCreator.slug,
                  name: ctaCreator.name,
                }}
              />
            ) : null}
            <div className="pt-2 lg:hidden">
              <InsightArticleCta />
            </div>
          </>
        }
      />
    </CaseStudyArticleEditorProvider>
  );
}
