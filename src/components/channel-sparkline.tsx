import {
  channelSparklineTrendFromValues,
  channelHasRealSparkline,
} from "@/lib/channel-follower-history";
import {
  resolveChannelSparkline,
  sparklineDividerXs,
  sparklinePolylinePoints,
} from "@/lib/channel-sparkline";
import type { ExpertChannelPresence } from "@/lib/expert-profiles";
import { cn } from "@/lib/utils";

const SPARKLINE_WIDTH = 96;
const SPARKLINE_HEIGHT = 24;

function trendClassName(trend: "up" | "down" | "flat"): string {
  if (trend === "up") return "text-forest";
  if (trend === "down") return "text-[#b85c5c]";
  return "text-charcoal/45";
}

function growthClassName(trend: "up" | "down" | "flat"): string {
  if (trend === "up") return "text-forest";
  if (trend === "down") return "text-[#b85c5c]";
  return "text-charcoal/50";
}

export function ChannelSparkline({
  channel,
  showGrowthLabel = true,
  className,
}: {
  channel: ExpertChannelPresence;
  showGrowthLabel?: boolean;
  className?: string;
}) {
  const values = resolveChannelSparkline(channel);
  if (!values) {
    return (
      <span className={cn("text-sm text-charcoal/35", className)} aria-hidden>
        —
      </span>
    );
  }

  const trend = channelSparklineTrendFromValues(values, channel.growth90d);
  const points = sparklinePolylinePoints(
    values,
    SPARKLINE_WIDTH,
    SPARKLINE_HEIGHT,
  );
  const dividers = sparklineDividerXs(values.length, SPARKLINE_WIDTH);
  const growthLabel = channel.growth90d.trim();
  const hasGrowthLabel =
    showGrowthLabel &&
    growthLabel.length > 0 &&
    growthLabel !== "—" &&
    growthLabel !== "-";
  const isReal = channelHasRealSparkline(channel);

  return (
    <div className={cn("flex items-center gap-2.5", className)}>
      <div
        className={cn(
          "relative shrink-0 rounded-[2px] border border-charcoal/10 bg-cream/70 px-0.5 py-0.5",
          trendClassName(trend),
        )}
      >
        <svg
          width={SPARKLINE_WIDTH}
          height={SPARKLINE_HEIGHT}
          viewBox={`0 0 ${SPARKLINE_WIDTH} ${SPARKLINE_HEIGHT}`}
          role="img"
          aria-label={`${channel.platform} follower trend${isReal ? "" : " preview"}`}
          className="block"
        >
          <line
            x1={0}
            y1={SPARKLINE_HEIGHT - 1}
            x2={SPARKLINE_WIDTH}
            y2={SPARKLINE_HEIGHT - 1}
            stroke="currentColor"
            strokeOpacity={0.12}
          />
          {dividers.map((x) => (
            <line
              key={x}
              x1={x}
              y1={1}
              x2={x}
              y2={SPARKLINE_HEIGHT - 1}
              stroke="currentColor"
              strokeOpacity={0.1}
            />
          ))}
          <polyline
            fill="none"
            stroke="currentColor"
            strokeWidth="1.75"
            strokeLinecap="round"
            strokeLinejoin="round"
            points={points}
          />
        </svg>
      </div>
      {hasGrowthLabel ? (
        <span
          className={cn(
            "text-[0.75rem] font-medium tabular-nums tracking-tight",
            growthClassName(trend),
          )}
        >
          {growthLabel}
        </span>
      ) : null}
    </div>
  );
}
