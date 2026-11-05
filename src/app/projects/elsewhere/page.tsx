import type { Metadata } from "next";
import PhotoJournal from "@/features/projects/elsewhere/photo-journal";
import { journalScenes } from "@/features/projects/elsewhere/journal-data";

export const metadata: Metadata = {
  title: "Elsewhere · Yakob Getu",
  description: "Places I've been, moments I've kept. A visual journal of life beyond the screen, one frame at a time.",
};

export default function ElsewherePage() {
  return <PhotoJournal scenes={journalScenes} />;
}
