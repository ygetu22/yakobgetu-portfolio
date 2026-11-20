import type { Metadata } from "next";
import Zempled from "@/features/projects/zempled/collection";

export const metadata: Metadata = {
  title: "Zempled · Yakob Getu",
  description: "Hear Ethiopian originals beside the songs that sampled them. A listening project by Yakob Getu.",
};

export default function ZempledPage() {
  return <Zempled />;
}
