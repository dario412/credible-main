export type FontSource = "default" | "google" | "upload";

export type FontRole = "heading" | "body";

export type FontChoice = {
  family: string;
  source: FontSource;
  assetId: string | null;
};

export type SiteFontSettings = {
  heading: FontChoice;
  body: FontChoice;
};

export const DEFAULT_HEADING_FAMILY = "Faculty Glyphic";
export const DEFAULT_BODY_FAMILY = "Instrument Sans";

export const DEFAULT_FONT_SETTINGS: SiteFontSettings = {
  heading: {
    family: DEFAULT_HEADING_FAMILY,
    source: "default",
    assetId: null,
  },
  body: {
    family: DEFAULT_BODY_FAMILY,
    source: "default",
    assetId: null,
  },
};

/** Curated free Google Fonts for the admin picker. */
export const GOOGLE_FONTS = [
  "Instrument Sans",
  "Inter",
  "Roboto",
  "Open Sans",
  "Lato",
  "Montserrat",
  "Poppins",
  "Raleway",
  "Source Sans 3",
  "Nunito",
  "Nunito Sans",
  "Work Sans",
  "DM Sans",
  "Manrope",
  "Outfit",
  "Plus Jakarta Sans",
  "Space Grotesk",
  "IBM Plex Sans",
  "Libre Franklin",
  "Karla",
  "Mulish",
  "Figtree",
  "Sora",
  "Geist",
  "Faculty Glyphic",
  "Playfair Display",
  "Merriweather",
  "Lora",
  "Libre Baskerville",
  "Source Serif 4",
  "EB Garamond",
  "Cormorant Garamond",
  "Libre Caslon Text",
  "Newsreader",
  "Fraunces",
  "DM Serif Display",
  "Instrument Serif",
  "Bodoni Moda",
  "Cinzel",
  "Josefin Sans",
  "Josefin Slab",
  "Bebas Neue",
  "Oswald",
  "Archivo",
  "Barlow",
  "Barlow Condensed",
  "Syne",
  "Bricolage Grotesque",
  "Literata",
  "Spectral",
] as const;

export function googleFontsCssUrl(families: string[]): string | null {
  const unique = [...new Set(families.map((f) => f.trim()).filter(Boolean))];
  if (unique.length === 0) return null;

  const params = unique
    .map((family) => {
      const encoded = family.replace(/ /g, "+");
      return `family=${encoded}:wght@400;500;600;700`;
    })
    .join("&");

  return `https://fonts.googleapis.com/css2?${params}&display=swap`;
}

export function cssFamilyName(family: string) {
  return family.includes(" ") ? `"${family}"` : family;
}

export function buildFontFaceCss(
  family: string,
  assetId: string,
  mimeType: string,
) {
  const format =
    mimeType.includes("woff2")
      ? "woff2"
      : mimeType.includes("woff")
        ? "woff"
        : mimeType.includes("ttf") || mimeType.includes("truetype")
          ? "truetype"
          : mimeType.includes("otf") || mimeType.includes("opentype")
            ? "opentype"
            : "woff2";

  return `@font-face{font-family:${cssFamilyName(family)};src:url('/api/fonts/${assetId}') format('${format}');font-display:swap;font-weight:100 900;font-style:normal;}`;
}

export function buildActiveFontCss(settings: SiteFontSettings) {
  const headingStack =
    settings.heading.source === "default"
      ? "var(--font-faculty-glyphic), system-ui, sans-serif"
      : `${cssFamilyName(settings.heading.family)}, var(--font-faculty-glyphic), system-ui, sans-serif`;

  const bodyStack =
    settings.body.source === "default"
      ? "var(--font-instrument), system-ui, sans-serif"
      : `${cssFamilyName(settings.body.family)}, var(--font-instrument), system-ui, sans-serif`;

  const faces: string[] = [];
  if (settings.heading.source === "upload" && settings.heading.assetId) {
    faces.push(
      buildFontFaceCss(
        settings.heading.family,
        settings.heading.assetId,
        "font/woff2",
      ),
    );
  }
  if (settings.body.source === "upload" && settings.body.assetId) {
    faces.push(
      buildFontFaceCss(
        settings.body.family,
        settings.body.assetId,
        "font/woff2",
      ),
    );
  }

  return `${faces.join("")}:root{--font-heading:${headingStack};--font-body:${bodyStack};}`;
}
