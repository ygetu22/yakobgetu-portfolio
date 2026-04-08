import BackToTop from "@/components/back-to-top";
import DarkModeSpotlight from "@/components/dark-mode-spotlight";
import Footer from "@/components/footer";
import Header from "@/components/header";
import { ThemeProvider } from "@/components/theme-provider";
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Yakob Getu",
  description: "Portfolio",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen bg-background text-foreground">
        <ThemeProvider>
          <div className="relative min-h-screen overflow-hidden">
            <DarkModeSpotlight />

            <div className="relative z-10 flex min-h-screen flex-col">
              <Header />
              <main className="flex-1">{children}</main>
              <Footer />
              <BackToTop />
            </div>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
