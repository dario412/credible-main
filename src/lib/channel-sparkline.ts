import type { ExpertChannelPresence } from "@/lib/expert-profiles";

const SPARKLINE_POINTS = 12;

function hashString(input: string): number {
  let hash = 0;
  for (let index = 0; index < input.length; index += 1) {
    hash = (hash * 31 + input.charCodeAt(index)) | 0;
  }
  return Math.abs(hash);
}

function seededUnit(seed: number, index: number): number {
  const value = Math.sin(seed * 9999 + index * 127.1) * 10000;
  return value - Math.floor(value);
}

export function parseFollowerMetric(value: string): number | null {
  const normalized = value.toLowerCase().replace(/,/g, "").replace(/\+/g, "").trim();
  const match = normalized.match(/([\d.]+)\s*(k|m|b)?/);
  if (!match) return null;

  let amount = Number.parseFloat(match[1]);
  if (!Number.isFinite(amount)) return null;

  const suffix = match[2];
  if (suffix === "k") amount *= 1_000;
  else if (suffix === "m") amount *= 1_000_000;
  else if (suffix === "b") amount *= 1_000_000_000;

  return amount;
}

export function parseGrowthPercent(value: string): number | null {
  const trimmed = value.trim();
  if (!trimmed || trimmed === "—" || trimmed === "-") return null;
  const match = trimmed.match(/([+-]?[\d.]+)\s*%/);
  if (!match) return null;
  const parsed = Number.parseFloat(match[1]);
  return Number.isFinite(parsed) ? parsed : null;
}

export type ChannelSparklineTrend = "up" | "down" | "flat";

/** Demo-only preview curves shaped by growth until real history is available. */
export function generatePreviewChannelSparkline(
  endValue: number,
  growth90dPercent: number | null,
  seedKey: string,
  pointCount = SPARKLINE_POINTS,
): number[] {
  const seed = hashString(seedKey);
  const growth = growth90dPercent ?? 2.5;
  const startValue = endValue / (1 + growth / 100);
  const values: number[] = [];

  for (let index = 0; index < pointCount; index += 1) {
    const progress = index / (pointCount - 1);
    const base = startValue + (endValue - startValue) * progress;
    const range = Math.abs(endValue - startValue) || endValue * 0.05;
    const wiggle =
      (seededUnit(seed, index) - 0.5) *
      range *
      0.32 *
      (1 - Math.abs(progress - 0.5));
    values.push(Math.max(0, base + wiggle));
  }

  values[0] = startValue;
  values[values.length - 1] = endValue;
  return values;
}

export function resolveChannelSparkline(
  channel: ExpertChannelPresence,
): number[] | null {
  if (channel.sparkline && channel.sparkline.length >= 2) {
    return channel.sparkline;
  }

  if (!channel.usePreviewSparkline) {
    return null;
  }

  const endValue = parseFollowerMetric(channel.followers);
  if (endValue == null) {
    return Array.from({ length: SPARKLINE_POINTS }, (_, index) => {
      return 40 + seededUnit(hashString(channel.handle), index) * 18;
    });
  }

  return generatePreviewChannelSparkline(
    endValue,
    parseGrowthPercent(channel.growth90d),
    `${channel.platform}-${channel.handle}`,
  );
}

export function sparklineDividerXs(
  pointCount: number,
  width: number,
  padding = 2,
): number[] {
  if (pointCount < 2) return [];
  const innerWidth = width - padding * 2;
  return Array.from({ length: pointCount - 1 }, (_, index) => {
    return padding + ((index + 1) / pointCount) * innerWidth;
  });
}

export function sparklinePolylinePoints(
  values: number[],
  width: number,
  height: number,
  padding = 2,
): string {
  if (values.length === 0) return "";

  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min || 1;
  const innerWidth = width - padding * 2;
  const innerHeight = height - padding * 2;

  return values
    .map((value, index) => {
      const x =
        padding +
        (values.length === 1 ? 0 : (index / (values.length - 1)) * innerWidth);
      const y = padding + (1 - (value - min) / range) * innerHeight;
      return `${x.toFixed(2)},${y.toFixed(2)}`;
    })
    .join(" ");
}
