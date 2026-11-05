import type { Metadata } from "next";
import TracePage from "@/features/projects/trace/trace-page";

export const metadata: Metadata = {
  title: "Trace · Yakob Getu",
  description: "Enter a URL and read a factual text report of HTTP, HTTPS, resource errors, and basic browser protections.",
};
export const dynamic = "force-dynamic";

export default function Page() {
  return <TracePage />;
}
