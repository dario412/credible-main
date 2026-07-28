import { prisma } from "@/lib/prisma";
import {
  DEFAULT_FONT_SETTINGS,
  type FontSource,
  type SiteFontSettings,
  googleFontsCssUrl,
  buildActiveFontCss,
  buildFontFaceCss,
} from "@/lib/site-fonts";

export async function getSiteFontSettings(): Promise<SiteFontSettings> {
  try {
    const row = await prisma.siteSettings.findUnique({
      where: { id: "default" },
    });
    if (!row) return DEFAULT_FONT_SETTINGS;

    return {
      heading: {
        family: row.headingFamily,
        source: row.headingSource as FontSource,
        assetId: row.headingAssetId,
      },
      body: {
        family: row.bodyFamily,
        source: row.bodySource as FontSource,
        assetId: row.bodyAssetId,
      },
    };
  } catch {
    return DEFAULT_FONT_SETTINGS;
  }
}

export async function getSiteFontStylesheet(): Promise<{
  googleHref: string | null;
  inlineCss: string;
}> {
  const settings = await getSiteFontSettings();

  const googleFamilies: string[] = [];
  if (settings.heading.source === "google") {
    googleFamilies.push(settings.heading.family);
  }
  if (settings.body.source === "google") {
    googleFamilies.push(settings.body.family);
  }

  let inlineCss = buildActiveFontCss(settings);

  // Prefer real mime types for uploaded fonts when available
  const assetIds = [
    settings.heading.source === "upload" ? settings.heading.assetId : null,
    settings.body.source === "upload" ? settings.body.assetId : null,
  ].filter(Boolean) as string[];

  if (assetIds.length > 0) {
    try {
      const assets = await prisma.fontAsset.findMany({
        where: { id: { in: assetIds } },
        select: { id: true, family: true, mimeType: true },
      });
      const byId = new Map(assets.map((a) => [a.id, a]));

      const faces: string[] = [];
      for (const role of [settings.heading, settings.body] as const) {
        if (role.source !== "upload" || !role.assetId) continue;
        const asset = byId.get(role.assetId);
        if (!asset) continue;
        faces.push(buildFontFaceCss(role.family, asset.id, asset.mimeType));
      }

      const headingStack =
        settings.heading.source === "default"
          ? "var(--font-faculty-glyphic), system-ui, sans-serif"
          : `"${settings.heading.family}", var(--font-faculty-glyphic), system-ui, sans-serif`;
      const bodyStack =
        settings.body.source === "default"
          ? "var(--font-instrument), system-ui, sans-serif"
          : `"${settings.body.family}", var(--font-instrument), system-ui, sans-serif`;

      inlineCss = `${faces.join("")}:root{--font-heading:${headingStack};--font-body:${bodyStack};}`;
    } catch {
      // keep fallback css
    }
  }

  return {
    googleHref: googleFontsCssUrl(googleFamilies),
    inlineCss,
  };
}
