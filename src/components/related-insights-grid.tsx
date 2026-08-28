"use client";

import Image from "next/image";
import Link from "next/link";

import { FadeUp } from "@/components/fade-up";
import { insightCover, insightCoverAlt, readingTime } from "@/lib/insight-content";

type RelatedInsight = {
  id: string;
  slug: string;
  title: string;
  body: string;
  coverImage: string | null;
  coverImageAlt?: string | null;
};

export function RelatedInsightsGrid({ items }: { items: RelatedInsight[] }) {
  return (
    <ul className="mt-8 grid gap-8 sm:grid-cols-2 md:mt-10 lg:grid-cols-3 lg:gap-10">
      {items.map((item, index) => {
        const itemCover = insightCover(item);
        const itemMins = readingTime(item.body);

        return (
          <li key={item.id}>
            <FadeUp
              delay={index * 200}
              duration={1400}
              y={28}
              threshold={0.12}
            >
              <Link
                href={`/insights/${item.slug}`}
                className="group block cursor-pointer"
              >
                <div className="relative aspect-16/10 overflow-hidden rounded-sm bg-cream-dark">
                  {itemCover ? (
                    <Image
                      src={itemCover}
                      alt={insightCoverAlt(item)}
                      fill
                      sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                      className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03]"
                    />
                  ) : null}
                </div>
                <p className="mt-4 text-xs text-charcoal/55">
                  {itemMins} min read
                </p>
                <h3 className="mt-2 max-w-sm font-display text-[1.15rem] leading-snug tracking-tight text-charcoal transition-colors group-hover:text-forest md:text-[1.25rem]">
                  {item.title}
                </h3>
              </Link>
            </FadeUp>
          </li>
        );
      })}
    </ul>
  );
}
