import {
  iconForTopicAudienceLabel,
  type TopicAudienceIconComponent,
  type TopicAudienceIconContext,
} from "@/lib/topic-audience-icons";
import { cn } from "@/lib/utils";

export function TopicAudienceIcon({
  label,
  context = "topic",
  iconMap,
  icon,
  className,
  wellClassName,
}: {
  label: string;
  context?: TopicAudienceIconContext;
  iconMap?: Map<string, TopicAudienceIconComponent>;
  icon?: TopicAudienceIconComponent;
  className?: string;
  wellClassName?: string;
}) {
  const Icon =
    icon ?? iconForTopicAudienceLabel(label, context, iconMap);

  return (
    <span
      className={cn(
        "inline-flex size-7 shrink-0 items-center justify-center rounded-sm bg-forest/[0.07] text-forest",
        wellClassName,
      )}
      aria-hidden
    >
      <Icon weight="duotone" className={cn("size-4", className)} />
    </span>
  );
}

export function TopicAudienceListItem({
  label,
  context = "topic",
  iconMap,
  delayMs = 0,
  visible = true,
  animate = false,
}: {
  label: string;
  context?: TopicAudienceIconContext;
  iconMap?: Map<string, TopicAudienceIconComponent>;
  delayMs?: number;
  visible?: boolean;
  animate?: boolean;
}) {
  return (
    <li
      className={cn(
        "flex items-center gap-3 py-2.5 first:pt-0 last:pb-0",
        animate &&
          "transition-[opacity,transform] duration-[1100ms] ease-[cubic-bezier(0.22,1,0.36,1)]",
        animate && (visible ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"),
      )}
      style={animate && visible ? { transitionDelay: `${delayMs}ms` } : undefined}
    >
      <TopicAudienceIcon label={label} context={context} iconMap={iconMap} />
      <span className="min-w-0 text-[0.875rem] leading-snug text-charcoal/80">
        {label}
      </span>
    </li>
  );
}
