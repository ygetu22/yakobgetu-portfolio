import type { Metadata } from "next";
import SimplePage from "@/components/ui/simple-page";

export const metadata: Metadata = { title: "Posts · Yakob Getu" };

export default function PostsPage() {
  return <SimplePage title="Posts" text="Notes, updates, and writeups will live here." />;
}
