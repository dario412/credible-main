import Link from "next/link";

import { cn } from "@/lib/utils";

export function V2Wordmark({
  href = "/",
  invert = false,
  className,
}: {
  href?: string;
  invert?: boolean;
  className?: string;
}) {
  return (
    <Link href={href} className={cn("inline-block shrink-0", className)}>
      <img
        src={
          invert
            ? "/brand/credible-wordmark-cream.svg"
            : "/brand/credible-wordmark.svg"
        }
        alt="Credible"
        width={253}
        height={50}
        className="block h-[1em] w-auto"
      />
    </Link>
  );
}
