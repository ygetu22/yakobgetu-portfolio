import type { Metadata } from "next";
import ContactSection from "@/features/contact/contact-section";

export const metadata: Metadata = {
  title: "Contact · Yakob Getu",
  description: "Send Yakob Getu a message, or find him on LinkedIn and GitHub.",
};

export default function ContactPage() {
  return (
    <div style={{ paddingTop: 90 }}>
      <ContactSection isPageTitle />
    </div>
  );
}
