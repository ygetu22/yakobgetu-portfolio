import type { Metadata } from "next";
import PhotoJournal from "@/features/projects/elsewhere/photo-journal";
import { journalEntries } from "@/features/projects/elsewhere/journal-data";

export const metadata: Metadata = {
  title: "Elsewhere · Yakob Getu",
  description: "Places I've been, moments I've kept. A visual journal of life beyond the screen, one frame at a time.",
};

type ElsewherePageProps = {
  searchParams: Promise<{ photo?: string | string[] }>;
};

export default async function ElsewherePage({ searchParams }: ElsewherePageProps) {
  const { photo } = await searchParams;
  // Only a single plain value can name a photo; anything else is ignored.
  const initialPhotoId = typeof photo === "string" ? photo : undefined;
  return <PhotoJournal entries={journalEntries} initialPhotoId={initialPhotoId} />;
}
