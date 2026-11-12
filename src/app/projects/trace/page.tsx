import type { Metadata } from "next";
import TracePage from "@/features/projects/trace/trace-page";

export const metadata: Metadata = {
  title: "Trace · Yakob Getu",
  description:
    "A terminal tool that opens a website in a real browser, uses it like a visitor, and reports what stopped working between two versions.",
};

export default function Page() {
  return <TracePage />;
}
