import CulturalBackdrop from "@/components/layout/cultural-backdrop";
import ArrivalScreen from "@/components/layout/arrival-screen";
import SiteNav from "@/components/layout/site-nav";
import ScrollProgress from "@/components/layout/scroll-progress";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { InterfaceSoundsProvider } from "@/components/providers/interface-sounds";
import type { Metadata } from "next";
import { Fragment_Mono, Hanken_Grotesk } from "next/font/google";
import { headers } from "next/headers";
import "@/styles/globals.css";

const bodyFont = Fragment_Mono({
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  variable: "--font-body",
});

const displayFont = Hanken_Grotesk({
  subsets: ["latin"],
  style: ["normal", "italic"],
  variable: "--font-display",
});

export const metadata: Metadata = {
  title: "Yakob Getu",
  description: "Software engineer in Columbus, Ohio.",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const nonce = (await headers()).get("x-nonce") ?? undefined;
  return (
    <html lang="en" data-scroll-behavior="smooth" suppressHydrationWarning>
      <body className={`${bodyFont.variable} ${displayFont.variable} min-h-screen bg-background text-foreground`}>
        <ThemeProvider nonce={nonce}>
          <InterfaceSoundsProvider>
            <div className="relative min-h-screen overflow-x-clip">
              <ArrivalScreen />
              <CulturalBackdrop />
              <SiteNav />
              <ScrollProgress />
              <main className="relative z-10">{children}</main>
            </div>
          </InterfaceSoundsProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
