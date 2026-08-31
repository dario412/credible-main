import type { NavLink } from "@/lib/site-chrome";

export const FOOTER_ROSTER_LINKS_PER_COLUMN = 7;

export function buildFooterRosterNavLinks(
  categoryLabels: string[],
  allCreatorsLabel = "All creators",
): NavLink[] {
  return [
    { href: "/roster", label: allCreatorsLabel },
    ...categoryLabels.map((label) => ({
      href: `/roster?topic=${encodeURIComponent(label)}`,
      label,
    })),
  ];
}

/** Split a long roster link list into even columns for the footer nav. */
export function splitFooterNavLinks(
  links: NavLink[],
  maxPerColumn = FOOTER_ROSTER_LINKS_PER_COLUMN,
): NavLink[][] {
  if (links.length <= maxPerColumn) return [links];

  const columnCount = Math.ceil(links.length / maxPerColumn);
  const chunkSize = Math.ceil(links.length / columnCount);
  const columns: NavLink[][] = [];

  for (let index = 0; index < links.length; index += chunkSize) {
    columns.push(links.slice(index, index + chunkSize));
  }

  return columns;
}

export function expandFooterNavLists(
  columns: Array<{ title: string; links: NavLink[] }>,
  rosterNavLinks?: NavLink[],
): NavLink[][] {
  const lists: NavLink[][] = [];

  for (const column of columns) {
    const isRoster = column.title.trim().toLowerCase() === "roster";
    const links =
      isRoster && rosterNavLinks && rosterNavLinks.length > 0
        ? rosterNavLinks
        : column.links;

    if (isRoster && links.length > FOOTER_ROSTER_LINKS_PER_COLUMN) {
      lists.push(...splitFooterNavLinks(links));
      continue;
    }

    lists.push(links);
  }

  return lists;
}

function footerNavGridClass(columnCount: number): string {
  if (columnCount >= 6) {
    return "grid-cols-2 sm:grid-cols-3 lg:grid-cols-6";
  }
  if (columnCount === 5) {
    return "grid-cols-2 sm:grid-cols-3 lg:grid-cols-5";
  }
  if (columnCount === 4) {
    return "grid-cols-2 sm:grid-cols-3 lg:grid-cols-4";
  }
  return "grid-cols-2 sm:grid-cols-3";
}

export function footerNavGridClasses(columnCount: number): string {
  return `grid gap-x-10 gap-y-10 ${footerNavGridClass(columnCount)}`;
}

/**
 * Choice order for Creator | Website | Archetype (fldNR16ZQJeDMlWc8).
 * Values not in this list sort alphabetically at the end.
 */
export const WEBSITE_ARCHETYPE_ORDER = [
  "CEO",
  "Founder",
  "President",
  "Chairman",
  "Chairwoman",
  "Executive Chair",
  "Managing Director",
  "CMO",
  "CRO",
  "COO",
  "CPO",
  "CTO",
  "CHRO",
  "VP of Marketing",
  "VP of Sales",
  "VP of Product",
  "VP of Growth",
  "VP of Engineering",
  "Head of Marketing",
  "Head of Sales",
  "Head of Product",
  "Head of Growth",
  "Head of Design",
  "Head of Content",
  "Director of Marketing",
  "Director of Sales",
  "Director of Growth",
  "Director of Ops",
  "Consultant",
  "Newsletter writer",
  "Thought leader",
  "Advisor",
  "Category expert",
  "Author",
  "Researcher",
  "Podcast host",
  "Investor",
  "CGO",
  "Engineer",
] as const;

const archetypeRank = new Map(
  WEBSITE_ARCHETYPE_ORDER.map((value, index) => [value.toLowerCase(), index]),
);

function sortByArchetypeOrder(values: string[]): string[] {
  return [...values].sort((a, b) => {
    const rankA = archetypeRank.get(a.toLowerCase());
    const rankB = archetypeRank.get(b.toLowerCase());
    if (rankA !== undefined && rankB !== undefined) return rankA - rankB;
    if (rankA !== undefined) return -1;
    if (rankB !== undefined) return 1;
    return a.localeCompare(b);
  });
}

type ExpertFilterSource = {
  categories?: string[] | null;
  topics?: string[] | null;
};

export function buildRosterFilterOptions(
  experts: ExpertFilterSource[],
  categoryOrder: string[] = [],
) {
  const archetypeSet = new Set<string>();
  const topicSet = new Set<string>();

  for (const expert of experts) {
    for (const category of expert.categories ?? []) {
      const trimmed = category.trim();
      if (trimmed) archetypeSet.add(trimmed);
    }
    for (const topic of expert.topics ?? []) {
      const trimmed = topic.trim();
      if (trimmed) topicSet.add(trimmed);
    }
  }

  const topicOptions =
    categoryOrder.length > 0
      ? [
          ...categoryOrder,
          ...[...topicSet]
            .filter(
              (category) =>
                !categoryOrder.some(
                  (item) => item.toLowerCase() === category.toLowerCase(),
                ),
            )
            .sort((a, b) => a.localeCompare(b)),
        ]
      : [...topicSet].sort((a, b) => a.localeCompare(b));

  return {
    archetypeOptions: sortByArchetypeOrder([...archetypeSet]),
    topicOptions,
  };
}
