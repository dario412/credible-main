import Link from "next/link";

import {
  ADMIN_EDITORIAL_GUIDES,
  type AdminEditorialGuideKind,
} from "@/lib/admin-editorial-guides";
import { cn } from "@/lib/utils";

export function AdminEditorialGuideLink({
  kind,
  className,
}: {
  kind: AdminEditorialGuideKind;
  className?: string;
}) {
  const guide = ADMIN_EDITORIAL_GUIDES[kind];

  return (
    <Link
      href={guide.href}
      target="_blank"
      rel="noreferrer"
      className={cn(
        "text-sm font-medium text-forest hover:text-forest-dark",
        className,
      )}
    >
      {guide.label} (PDF) ↗
    </Link>
  );
}
