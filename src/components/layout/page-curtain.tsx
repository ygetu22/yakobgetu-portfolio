"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  type ComponentProps,
  type MouseEvent,
  type ReactNode,
} from "react";
import { prefersReducedMotion } from "@/components/motion/scroll-frame";
import styles from "./page-curtain.module.css";

// Moving between pages: a curtain rises with the destination's name on it, the page changes
// underneath, then the curtain lifts. Links on the same page (/#about) just scroll.

const COVER_MS = 600;
const LIFT_MS = 800;
// If the new page never arrives (e.g. offline), lift the curtain anyway.
const GIVE_UP_MS = 4000;

type CurtainState = "idle" | "covering" | "leaving";
type Navigate = (href: string, title: string) => void;

const NavigateContext = createContext<Navigate>(() => {});

export function useCurtainNavigate(): Navigate {
  return useContext(NavigateContext);
}

export function PageCurtainProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [state, setState] = useState<CurtainState>("idle");
  const [title, setTitle] = useState("");
  const timers = useRef<number[]>([]);
  const coveredPathname = useRef<string | null>(null);

  function later(callback: () => void, delay: number) {
    timers.current.push(window.setTimeout(callback, delay));
  }

  function lift() {
    coveredPathname.current = null;
    setState("leaving");
    later(() => setState("idle"), LIFT_MS);
  }

  const navigate: Navigate = (href, nextTitle) => {
    const destination = new URL(href, window.location.href);
    const isSamePage = destination.pathname === window.location.pathname;
    if (isSamePage || prefersReducedMotion() || state !== "idle") {
      router.push(href);
      return;
    }

    setTitle(nextTitle);
    setState("covering");
    coveredPathname.current = window.location.pathname;
    later(() => router.push(href), COVER_MS);
    later(() => {
      if (coveredPathname.current !== null) lift();
    }, GIVE_UP_MS);
  };

  // The new page has rendered under the curtain: lift it.
  useEffect(() => {
    if (coveredPathname.current === null || coveredPathname.current === pathname) return;
    const timer = window.setTimeout(lift, 250);
    return () => window.clearTimeout(timer);
    // `lift` only uses refs and state setters, so it is safe to leave out.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  useEffect(() => {
    const pending = timers.current;
    return () => pending.forEach((timer) => window.clearTimeout(timer));
  }, []);

  return (
    <NavigateContext.Provider value={navigate}>
      {children}
      <div className={`${styles.curtain} ${styles[state]}`} aria-hidden="true">
        <span>{title}</span>
      </div>
    </NavigateContext.Provider>
  );
}

type SiteLinkProps = Omit<ComponentProps<typeof Link>, "href"> & {
  href: string;
  // Shown on the curtain while the next page loads.
  curtainTitle: string;
};

// A link to another page of this site that goes through the curtain.
export function SiteLink({ href, curtainTitle, onClick, children, ...linkProps }: SiteLinkProps) {
  const navigate = useCurtainNavigate();

  function handleClick(event: MouseEvent<HTMLAnchorElement>) {
    onClick?.(event);
    const opensElsewhere = event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0;
    if (event.defaultPrevented || opensElsewhere) return;

    event.preventDefault();
    navigate(href, curtainTitle);
  }

  return (
    <Link href={href} onClick={handleClick} {...linkProps}>
      {children}
    </Link>
  );
}
