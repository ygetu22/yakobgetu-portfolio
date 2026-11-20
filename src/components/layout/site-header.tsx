"use client";

import { usePathname } from "next/navigation";
import { useEffect, useId, useState, type CSSProperties } from "react";
import { lessons } from "@/components/culture/lessons";
import { LessonContent } from "@/components/culture/learn";
import { useScrollFrame } from "@/components/motion/scroll-frame";
import { useInterfaceSound, type InterfaceSound } from "@/components/providers/interface-sounds";
import { useHoverCard } from "@/components/ui/hover-card";
import cardStyles from "@/components/ui/hover-card.module.css";
import { SiteLink } from "./page-curtain";
import { useShortcutLabel } from "./shortcut-label";
import styles from "./site-header.module.css";

// Every stop in the menu is a section of Home. Other pages highlight the section they belong to.
const menuLinks: { label: string; section: string; sound: InterfaceSound }[] = [
  { label: "Home", section: "", sound: "home" },
  { label: "About", section: "about", sound: "home" },
  { label: "Resume", section: "resume", sound: "resume" },
  { label: "Projects", section: "projects", sound: "projects" },
  { label: "Life", section: "life", sound: "home" },
  { label: "Posts", section: "posts", sound: "posts" },
  { label: "Contact", section: "contact", sound: "home" },
];

// Which menu link is current on pages other than Home.
function sectionForPath(pathname: string): string {
  if (pathname.startsWith("/projects/elsewhere")) return "life";
  if (pathname.startsWith("/projects")) return "projects";
  if (pathname.startsWith("/resume")) return "resume";
  if (pathname.startsWith("/contact")) return "contact";
  return "";
}

// On Home, the section the reader has scrolled into ("" while still at the top).
function useCurrentHomeSection(isHome: boolean): string {
  const [section, setSection] = useState("");

  useScrollFrame(() => {
    if (!isHome) return;
    // A section becomes current once its heading is near the top of the screen.
    const readingLine = 160;
    let current = "";
    for (const link of menuLinks) {
      const element = link.section ? document.getElementById(link.section) : null;
      if (element && element.getBoundingClientRect().top <= readingLine) current = link.section;
    }
    setSection(current);
  });

  return section;
}

function Wordmark() {
  const { isOpen, setAnchor, setCard, hoverProps } = useHoverCard();
  const cardId = useId();
  const playSound = useInterfaceSound();

  return (
    <>
      <SiteLink
        ref={setAnchor}
        href="/"
        curtainTitle="Yakob Getu"
        className={styles.wordmark}
        aria-label="Yakob Getu, home"
        aria-describedby={cardId}
        onClick={() => playSound("home")}
        {...hoverProps}
      >
        <span aria-hidden="true">Yakob</span>
        <span aria-hidden="true" lang="am">
          ያዕቆብ
        </span>
      </SiteLink>
      <div
        ref={setCard}
        id={cardId}
        className={cardStyles.card}
        role="note"
        hidden={!isOpen}
        {...hoverProps}
      >
        <LessonContent lesson={lessons.name} />
      </div>
    </>
  );
}

export default function SiteHeader({ onOpenSearch }: { onOpenSearch: () => void }) {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const homeSection = useCurrentHomeSection(isHome);
  const currentSection = isHome ? homeSection : sectionForPath(pathname);
  const shortcutLabel = useShortcutLabel();
  const playSound = useInterfaceSound();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuId = useId();

  useEffect(() => {
    if (!isMenuOpen) return;
    function closeOnEscape(event: KeyboardEvent) {
      if (event.key === "Escape") setIsMenuOpen(false);
    }
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [isMenuOpen]);

  return (
    <header>
      <Wordmark />

      <nav className={`${styles.nav} ${isMenuOpen ? styles.open : ""}`} aria-label="Site">
        <div className={styles.bar}>
          <button
            type="button"
            className={styles.barButton}
            aria-expanded={isMenuOpen}
            aria-controls={menuId}
            aria-label={isMenuOpen ? "Close the menu" : "Open the menu"}
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <span className={styles.menuIcon} aria-hidden="true">
              <i />
              <i />
            </span>
          </button>
          <button
            type="button"
            className={styles.barButton}
            aria-haspopup="dialog"
            aria-label="Search the site"
            onClick={onOpenSearch}
          >
            <kbd>{shortcutLabel}</kbd>
          </button>
        </div>

        {/* `inert` keeps the hidden links out of the tab order and away from screen readers. */}
        <div id={menuId} className={styles.links} inert={!isMenuOpen}>
          <ul>
            {menuLinks.map((link, index) => {
              const isCurrent = link.section === currentSection;
              return (
                <li key={link.label} style={{ "--link-index": index } as CSSProperties}>
                  <SiteLink
                    href={link.section ? `/#${link.section}` : "/"}
                    curtainTitle={link.label}
                    className={isCurrent ? styles.current : undefined}
                    aria-current={isCurrent ? (isHome ? "location" : "page") : undefined}
                    onClick={() => playSound(link.sound)}
                  >
                    {link.label}
                  </SiteLink>
                </li>
              );
            })}
          </ul>
        </div>
      </nav>
    </header>
  );
}
