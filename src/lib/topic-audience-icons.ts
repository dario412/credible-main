import {
  Bank,
  Briefcase,
  ChartLineUp,
  Cloud,
  Crown,
  DotsThree,
  FilmStrip,
  GlobeHemisphereWest,
  LightbulbFilament,
  Megaphone,
  RocketLaunch,
  Sparkle,
  Tag,
  TrendUp,
  User,
  Users,
  UsersThree,
  type Icon,
} from "@phosphor-icons/react";

export type TopicAudienceIconComponent = Icon;
export type TopicAudienceIconContext = "topic" | "audience" | "industry";

type IconRule = {
  match: RegExp;
  icon: TopicAudienceIconComponent;
};

const FALLBACK_ICONS: TopicAudienceIconComponent[] = [
  Tag,
  LightbulbFilament,
  TrendUp,
  User,
  GlobeHemisphereWest,
  Sparkle,
  DotsThree,
];

const TOPIC_RULES: IconRule[] = [
  { match: /\bai\b|artificial intelligence|machine learning/i, icon: Sparkle },
  { match: /entrepreneurship|entrepreneur/i, icon: RocketLaunch },
  { match: /creator economy|creator/i, icon: UsersThree },
  { match: /media business|media company|media\b/i, icon: FilmStrip },
  { match: /leadership|executive|c-suite|ceo/i, icon: Crown },
  { match: /career|workplace|talent/i, icon: Briefcase },
  { match: /saas.*growth|growth.*saas|saas growth/i, icon: ChartLineUp },
  { match: /saas|software|tech|product/i, icon: Cloud },
  { match: /growth|revenue|gtm|sales/i, icon: ChartLineUp },
  { match: /marketing|brand|advertis/i, icon: Megaphone },
  { match: /finance|financial|invest/i, icon: Bank },
  { match: /strategy|innovation/i, icon: LightbulbFilament },
];

const AUDIENCE_RULES: IconRule[] = [
  { match: /founder|entrepreneur|c-suite|executive/i, icon: Users },
  { match: /vp\b|director|head of|manager/i, icon: Crown },
  { match: /individual contributor|\bic\b|specialist/i, icon: User },
  { match: /investor|vc\b|angel/i, icon: TrendUp },
  { match: /operator|leader|management/i, icon: Briefcase },
  { match: /marketing|brand/i, icon: Megaphone },
  { match: /tech|saas|product/i, icon: Cloud },
  { match: /media|content|creator/i, icon: FilmStrip },
  { match: /finance|financial/i, icon: Bank },
];

const INDUSTRY_RULES: IconRule[] = [
  { match: /saas|software|tech|product|engineering/i, icon: Cloud },
  { match: /media|marketing|advertis|communications/i, icon: Megaphone },
  { match: /financial|finance|banking|fintech|insurance/i, icon: Bank },
  { match: /health|wellness|medical/i, icon: Sparkle },
  { match: /retail|consumer|commerce|ecommerce/i, icon: TrendUp },
  { match: /education|learning|training/i, icon: LightbulbFilament },
  { match: /^other\b|misc|general/i, icon: DotsThree },
  { match: /global|international|\bus\b|\buk\b|europe/i, icon: GlobeHemisphereWest },
];

const CONTEXT_RULES: Record<TopicAudienceIconContext, IconRule[]> = {
  topic: TOPIC_RULES,
  audience: AUDIENCE_RULES,
  industry: INDUSTRY_RULES,
};

function rulesForLabel(
  label: string,
  context: TopicAudienceIconContext,
): TopicAudienceIconComponent[] {
  const normalized = label.trim();
  const seen = new Set<TopicAudienceIconComponent>();
  const ordered: TopicAudienceIconComponent[] = [];

  for (const rule of CONTEXT_RULES[context]) {
    if (!rule.match.test(normalized)) continue;
    if (seen.has(rule.icon)) continue;
    seen.add(rule.icon);
    ordered.push(rule.icon);
  }

  for (const fallback of FALLBACK_ICONS) {
    if (!seen.has(fallback)) ordered.push(fallback);
  }

  return ordered;
}

export type TopicAudienceIconSection = {
  context: TopicAudienceIconContext;
  labels: string[];
};

/** Assign icons across Talks about / Audience / Best for without repeating. */
export function assignUniqueTopicAudienceIcons(
  sections: TopicAudienceIconSection[],
): Map<string, TopicAudienceIconComponent> {
  const used = new Set<TopicAudienceIconComponent>();
  const assignments = new Map<string, TopicAudienceIconComponent>();

  for (const section of sections) {
    for (const label of section.labels) {
      const key = `${section.context}:${label}`;
      const candidates = rulesForLabel(label, section.context);
      const icon =
        candidates.find((candidate) => !used.has(candidate)) ??
        FALLBACK_ICONS.find((candidate) => !used.has(candidate)) ??
        Tag;

      assignments.set(key, icon);
      used.add(icon);
    }
  }

  return assignments;
}

export function iconForTopicAudienceLabel(
  label: string,
  context: TopicAudienceIconContext = "topic",
  iconMap?: Map<string, TopicAudienceIconComponent>,
): TopicAudienceIconComponent {
  if (iconMap?.has(`${context}:${label}`)) {
    return iconMap.get(`${context}:${label}`)!;
  }
  return rulesForLabel(label, context)[0] ?? Tag;
}

export function buildTopicAudienceIconMap(input: {
  topics: string[];
  audience: string[];
  industry: string[];
}): Map<string, TopicAudienceIconComponent> {
  return assignUniqueTopicAudienceIcons([
    { context: "topic", labels: input.topics },
    { context: "audience", labels: input.audience },
    { context: "industry", labels: input.industry },
  ]);
}
