import {
  parseFollowerMetric,
  parseGrowthPercent,
} from "@/lib/channel-sparkline";
import type { ExpertChannelPresence } from "@/lib/expert-profiles";

export type ChannelFollowerSnapshot = {
  date: string;
  value: number;
};

export type ChannelFollowerHistory = Partial<
  Record<ExpertChannelPresence["icon"], ChannelFollowerSnapshot[]>
>;

export function parseChannelFollowerHistory(value: unknown): number[] | null {
  if (typeof value === "string") {
    const trimmed = value.trim();
    if (!trimmed) return null;

    if (trimmed.startsWith("[")) {
      try {
        const parsed = JSON.parse(trimmed) as unknown;
        if (Array.isArray(parsed)) {
          const numbers = parsed
            .map((item) => parseFollowerMetric(String(item)) ?? Number(item))
            .filter((item): item is number => Number.isFinite(item) && item >= 0);
          return numbers.length >= 2 ? numbers : null;
        }
      } catch {
        return null;
      }
    }

    const numbers = trimmed
      .split(/[,;|\s]+/)
      .map((item) => parseFollowerMetric(item) ?? Number(item))
      .filter((item): item is number => Number.isFinite(item) && item >= 0);
    return numbers.length >= 2 ? numbers : null;
  }

  if (Array.isArray(value)) {
    const numbers = value
      .map((item) => parseFollowerMetric(String(item)) ?? Number(item))
      .filter((item): item is number => Number.isFinite(item) && item >= 0);
    return numbers.length >= 2 ? numbers : null;
  }

  return null;
}

export function formatGrowthFromSeries(values: number[]): string | null {
  if (values.length < 2) return null;
  const start = values[0]!;
  const end = values[values.length - 1]!;
  if (start <= 0) return null;

  const percent = ((end - start) / start) * 100;
  const sign = percent >= 0 ? "+" : "";
  return `${sign}${percent.toFixed(1)}%`;
}

export function growthDisplayFromFields(
  growthRaw: string | null | undefined,
  sparkline: number[] | null | undefined,
): string {
  const trimmed = growthRaw?.trim();
  if (trimmed && trimmed !== "—" && trimmed !== "-") {
    return trimmed;
  }
  if (sparkline && sparkline.length >= 2) {
    return formatGrowthFromSeries(sparkline) ?? "—";
  }
  return "—";
}

export function mergeChannelFollowerHistory(
  existing: ChannelFollowerHistory | undefined,
  channels: ExpertChannelPresence[],
): ChannelFollowerHistory {
  const history: ChannelFollowerHistory = { ...(existing ?? {}) };
  const today = new Date().toISOString().slice(0, 10);

  for (const channel of channels) {
    const value = parseFollowerMetric(channel.followers);
    if (value == null) continue;

    const key = channel.icon;
    const series = [...(history[key] ?? [])];
    const last = series[series.length - 1];

    if (last?.date === today) {
      if (last.value !== value) {
        series[series.length - 1] = { date: today, value };
      }
    } else if (!last || last.value !== value) {
      series.push({ date: today, value });
    }

    history[key] = series.slice(-12);
  }

  return history;
}

export function enrichChannelsWithFollowerHistory(
  channels: ExpertChannelPresence[],
  history: ChannelFollowerHistory | undefined,
): ExpertChannelPresence[] {
  return channels.map((channel) => {
    const historySeries = history?.[channel.icon]?.map((point) => point.value);
    const sparkline =
      channel.sparkline && channel.sparkline.length >= 2
        ? channel.sparkline
        : historySeries && historySeries.length >= 2
          ? historySeries
          : undefined;

    return {
      ...channel,
      sparkline,
      growth90d: growthDisplayFromFields(channel.growth90d, sparkline),
    };
  });
}

export function channelHasRealSparkline(channel: ExpertChannelPresence): boolean {
  return Boolean(channel.sparkline && channel.sparkline.length >= 2);
}

export function channelSparklineTrendFromValues(
  values: number[],
  growth90d: string,
): "up" | "down" | "flat" {
  const parsedGrowth = parseGrowthPercent(growth90d);
  if (parsedGrowth != null) {
    if (parsedGrowth > 0.4) return "up";
    if (parsedGrowth < -0.4) return "down";
    return "flat";
  }

  if (values.length < 2) return "flat";
  const delta = values[values.length - 1]! - values[0]!;
  const threshold = Math.max(Math.abs(values[0]!) * 0.01, 1);
  if (delta > threshold) return "up";
  if (delta < -threshold) return "down";
  return "flat";
}
