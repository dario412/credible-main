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

export function buildRosterFilterOptions(experts: ExpertFilterSource[]) {
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

  return {
    archetypeOptions: sortByArchetypeOrder([...archetypeSet]),
    topicOptions: [...topicSet].sort((a, b) => a.localeCompare(b)),
  };
}
