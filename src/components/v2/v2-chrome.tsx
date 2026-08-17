import type { ReactNode } from "react";

import { V2Footer } from "@/components/v2/v2-footer";
import { V2Nav } from "@/components/v2/v2-nav";
import { getSiteChrome } from "@/lib/actions/admin-cms";
import { prisma } from "@/lib/prisma";

export async function V2Chrome({ children }: { children: ReactNode }) {
  const [chrome, expertCount] = await Promise.all([
    getSiteChrome(),
    prisma.expert.count(),
  ]);

  return (
    <>
      <V2Nav
        links={chrome.header.links}
        ctaLabel={chrome.header.ctaLabel || "Send a brief"}
        creatorCount={expertCount || 20}
      />
      <main className="flex-1">{children}</main>
      <V2Footer footer={chrome.footer} />
    </>
  );
}
