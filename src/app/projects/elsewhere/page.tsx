import type { Metadata } from "next";
import PhotoJournal from "@/features/projects/elsewhere/photo-journal";

export const metadata: Metadata = {
  title: "Elsewhere · Yakob Getu",
  description: "A photo journal of the places I've been, in the order they happened.",
};

export default function ElsewherePage() {
  return <PhotoJournal />;
}
