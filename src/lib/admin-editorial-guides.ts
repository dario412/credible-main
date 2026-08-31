/** Client editorial style guides — served from public/admin/guides/. */
export const ADMIN_EDITORIAL_GUIDES = {
  project: {
    href: "/admin/guides/case-study-style-guide.pdf",
    label: "Project style guide",
  },
  insight: {
    href: "/admin/guides/insights-style-guide.pdf",
    label: "Insight style guide",
  },
} as const;

export type AdminEditorialGuideKind = keyof typeof ADMIN_EDITORIAL_GUIDES;
