"use client";

import Link from "next/link";
import RotatingWordmark from "./rotating-wordmark";
import { usePathname } from "next/navigation";
import { useInterfaceSound, type InterfaceSound } from "@/components/providers/interface-sounds";

const links = [
  { href: "/", label: "Home", sound: "home" },
  { href: "/resume", label: "Resume", sound: "resume" },
  { href: "/projects", label: "Projects", sound: "projects" },
  { href: "/posts", label: "Posts", sound: "posts" },
] satisfies { href: string; label: string; sound: InterfaceSound }[];

export default function SiteNav() {
  const pathname = usePathname();
  const playSound = useInterfaceSound();
  const isJournal = pathname === "/projects/elsewhere";

  return (
    <>
      <Link
        href="/"
        onClick={() => playSound("home")}
        aria-label="Yakob — home"
        className={`fixed z-50 rounded-sm site-wordmark font-serif text-xl tracking-tight transition hover:opacity-70 focus-visible:outline-2 focus-visible:outline-offset-4 ${isJournal ? "journal-wordmark left-5 top-4 sm:left-6" : "left-5 top-7 text-foreground sm:left-9 sm:top-10"}`}
      >
        {isJournal ? <><span lang="am">ያዕቆብ</span><span>Yakob</span></> : <RotatingWordmark />}
      </Link>
      <nav aria-label="Primary navigation" className={isJournal ? "journal-site-nav fixed z-50" : "fixed right-5 top-7 z-50 sm:right-9 sm:top-10"}>
        <div className={isJournal ? "flex items-center gap-5" : "flex flex-col items-end gap-3"}>
          {links.map((link) => {
            const isActive = link.href === "/" ? pathname === "/" : pathname.startsWith(link.href);

            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => playSound(link.sound)}
                aria-current={isActive ? "page" : undefined}
                className={`text-xs font-medium tracking-[0.08em] transition ${isActive ? "text-foreground underline decoration-foreground/45 underline-offset-4" : "text-foreground/50 hover:text-foreground"}`}
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
