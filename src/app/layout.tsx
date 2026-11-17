import GlyphLayer from "@/components/culture/glyph-layer";
import ArrivalScreen from "@/components/layout/arrival-screen";
import BackToTop from "@/components/layout/back-to-top";
import { HashTargetHighlighter } from "@/components/layout/location-hash";
import { PageCurtainProvider } from "@/components/layout/page-curtain";
import PointerDot from "@/components/layout/pointer-dot";
import ScrollProgress from "@/components/layout/scroll-progress";
import SideControls from "@/components/layout/side-controls";
import SiteChrome from "@/components/layout/site-chrome";
import SiteFooter from "@/components/layout/site-footer";
import { InterfaceSoundsProvider } from "@/components/providers/interface-sounds";
import { ThemeProvider } from "@/components/providers/theme-provider";
import Toast from "@/components/ui/toast";
import { MusicPlayerProvider } from "@/features/music/music-player";
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
      <body className={`${bodyFont.variable} ${displayFont.variable}`}>
        <ThemeProvider nonce={nonce}>
          <InterfaceSoundsProvider>
            <MusicPlayerProvider>
              <PageCurtainProvider>
                <a className="skip-link" href="#main">
                  Skip to the content
                </a>
                <ArrivalScreen />
                <ScrollProgress />
                <GlyphLayer />
                <SiteChrome />
                <SideControls />
                <main id="main" className="site-main">
                  {children}
                </main>
                <SiteFooter />
                <BackToTop />
                <PointerDot />
                <Toast />
                <HashTargetHighlighter />
              </PageCurtainProvider>
            </MusicPlayerProvider>
          </InterfaceSoundsProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
