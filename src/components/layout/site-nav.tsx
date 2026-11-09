"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import RotatingWordmark from "./rotating-wordmark";
import { usePathname } from "next/navigation";
import { useInterfaceSound, type InterfaceSound } from "@/components/providers/interface-sounds";

// Resume, Projects and Posts are sections on Home. Their standalone pages still exist for direct links.
const links = [
  { href: "/", section: null, page: "/", label: "Home", sound: "home" },
  { href: "/#resume", section: "resume", page: "/resume", label: "Resume", sound: "resume" },
  { href: "/#projects", section: "projects", page: "/projects", label: "Projects", sound: "projects" },
  { href: "/#posts", section: "posts", page: "/posts", label: "Posts", sound: "posts" },
] satisfies { href: string; section: string | null; page: string; label: string; sound: InterfaceSound }[];

// Home's sections from top to bottom. About has no nav link, so while it is in view Home stays active.
const homeSectionIds = ["about", "posts", "resume", "projects"];

// Returns the Home section the reader is currently in, or null while they are still at the top.
function useCurrentHomeSection(enabled: boolean) {
  const [currentSection, setCurrentSection] = useState<string | null>(null);

  useEffect(() => {
    if (!enabled) return;

    let frame = 0;

    const update = () => {
      frame = 0;
      // Just below where a section lands after a nav click (scroll-margin-top: 6rem in home.css),
      // so a short section like Posts still counts as current when its heading reaches the top.
      const readingLine = 140;
      let current: string | null = null;

      for (const id of homeSectionIds) {
        const section = document.getElementById(id);
        if (section && section.getBoundingClientRect().top <= readingLine) current = id;
      }

      setCurrentSection(current);
    };

    const scheduleUpdate = () => {
      if (!frame) frame = window.requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", scheduleUpdate, { passive: true });
    window.addEventListener("resize", scheduleUpdate);

    return () => {
      window.removeEventListener("scroll", scheduleUpdate);
      window.removeEventListener("resize", scheduleUpdate);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, [enabled]);

  return enabled ? currentSection : null;
}

export default function SiteNav() {
  const pathname = usePathname();
  const playSound = useInterfaceSound();
  const isJournal = pathname === "/projects/elsewhere";
  const isHome = pathname === "/";
  const currentSection = useCurrentHomeSection(isHome);

  function isActive(link: (typeof links)[number]) {
    if (isHome) {
      const navSection = currentSection === "about" ? null : currentSection;
      return link.section === navSection;
    }
    return link.page !== "/" && pathname.startsWith(link.page);
  }

  return (
    <>
      <Link
        href="/"
        onClick={() => playSound("home")}
        aria-label="Yakob — home"
        className={`fixed z-50 rounded-sm site-wordmark font-serif text-xl tracking-tight transition hover:opacity-70 focus-visible:outline-2 focus-visible:outline-offset-4 ${isJournal ? "journal-wordmark left-5 top-4 sm:left-6" : "left-5 top-7 text-foreground sm:left-9 sm:top-10"}`}
      >
        {isJournal ? (
          <>
            <span lang="am">ያዕቆብ</span>
            <span>Yakob</span>
          </>
        ) : (
          <RotatingWordmark />
        )}
      </Link>

      <nav
        aria-label="Primary navigation"
        className={isJournal ? "journal-site-nav fixed z-50" : "fixed right-5 top-7 z-50 sm:right-9 sm:top-10"}
      >
        <div className={isJournal ? "flex items-center gap-5" : "flex flex-col items-end gap-3"}>
          {links.map((link) => {
            const active = isActive(link);

            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => playSound(link.sound)}
                aria-current={active ? (isHome ? "location" : "page") : undefined}
                className={`text-xs font-medium tracking-[0.08em] transition ${active ? "text-foreground underline decoration-foreground/45 underline-offset-4" : "text-foreground/50 hover:text-foreground"}`}
              >
                {link.label}
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
}
