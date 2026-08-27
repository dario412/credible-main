import { Faculty_Glyphic, Instrument_Sans } from "next/font/google";
import {
  GoogleTagManager,
  GoogleTagManagerNoscript,
} from "@/components/google-tag-manager";
import { Providers } from "@/components/providers";
import { createMetadata, organizationJsonLd } from "@/lib/seo";
import { getSiteFontStylesheet } from "@/lib/site-fonts-server";
import "./globals.css";

const facultyGlyphic = Faculty_Glyphic({
  variable: "--font-faculty-glyphic",
  subsets: ["latin"],
  weight: "400",
  display: "swap",
});

const instrument = Instrument_Sans({
  variable: "--font-instrument",
  subsets: ["latin"],
  display: "swap",
});

export const metadata = createMetadata();

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const fonts = await getSiteFontStylesheet();

  return (
    <html
      lang="en"
      className={`${facultyGlyphic.variable} ${instrument.variable} h-full antialiased`}
    >
      <body
        className="flex min-h-full flex-col bg-cream text-charcoal"
        suppressHydrationWarning
      >
        <GoogleTagManagerNoscript />
        <GoogleTagManager />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        {fonts.googleHref ? (
          <link rel="stylesheet" href={fonts.googleHref} />
        ) : null}
        <style dangerouslySetInnerHTML={{ __html: fonts.inlineCss }} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationJsonLd),
          }}
        />
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
