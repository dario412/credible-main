import "server-only";

import { RosterPreviewSection } from "@/components/home-2/roster-preview-section";
import type { HomePageSections } from "@/lib/cms";
import { loadRosterPreviewCards } from "@/lib/roster-preview-server";

/** Server wrapper used outside the visual editor. */
export async function RosterPreview({
  content,
}: {
  content: HomePageSections["roster"];
}) {
  const cards = await loadRosterPreviewCards();
  return <RosterPreviewSection content={content} cards={cards} />;
}
