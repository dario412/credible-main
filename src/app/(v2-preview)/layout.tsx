import { Fraunces, Inter } from "next/font/google";

import { PeptalkTrackingCapture } from "@/components/peptalk-tracking";
import "@/components/v2/v2.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  display: "swap",
});

export default function V2Layout({ children }: { children: React.ReactNode }) {
  return (
    <div
      className={`v2 ${inter.variable} ${fraunces.variable} flex min-h-dvh flex-col`}
    >
      <PeptalkTrackingCapture />
      {children}
    </div>
  );
}
