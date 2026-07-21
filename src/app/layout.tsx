import { Faculty_Glyphic, Instrument_Sans } from "next/font/google";
import { Providers } from "@/components/providers";
import { createMetadata, organizationJsonLd } from "@/lib/seo";
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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${facultyGlyphic.variable} ${instrument.variable} h-full antialiased`}
    >
      <body
        className="flex min-h-full flex-col bg-cream text-charcoal"
        suppressHydrationWarning
      >
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
