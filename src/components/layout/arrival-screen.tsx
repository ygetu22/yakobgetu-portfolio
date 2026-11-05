"use client";

import { useCallback, useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";

export default function ArrivalScreen() {
  const pathname = usePathname();
  const router = useRouter();
  const [visible, setVisible] = useState(true);
  const [leaving, setLeaving] = useState(false);
  const [palette, setPalette] = useState(0);

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      const previousPalette = Number(window.sessionStorage.getItem("yakob-getu-arrival-palette"));
      const availablePalettes = [0, 1, 2, 3, 4, 5, 6, 7].filter((value) => value !== previousPalette);
      const nextPalette = availablePalettes[Math.floor(Math.random() * availablePalettes.length)] ?? 0;
      window.sessionStorage.setItem("yakob-getu-arrival-palette", String(nextPalette));
      setPalette(nextPalette);
    });
    return () => window.cancelAnimationFrame(frame);
  }, []);

  useEffect(() => {
    if (visible && pathname !== "/") router.replace("/");
  }, [pathname, router, visible]);

  const enterSite = useCallback(() => {
    if (leaving) return;
    setLeaving(true);
    window.setTimeout(() => setVisible(false), 850);
  }, [leaving]);

  useEffect(() => {
    if (!visible) return;
    const timer = window.setTimeout(enterSite, 2800);
    return () => window.clearTimeout(timer);
  }, [visible, enterSite]);

  if (!visible) return null;

  return (
    <section
      aria-label="Welcome to Yakob Getu's portfolio"
      className={`arrival-screen arrival-palette-${palette} fixed inset-0 z-[100] overflow-hidden text-[#fff3d9] ${leaving ? "arrival-screen-leaving" : ""}`}
      onClick={enterSite}
    >

      <div className="relative z-10 flex h-full flex-col items-center justify-center px-6 text-center">
        <h1 className="arrival-name text-6xl leading-[0.9] tracking-[-0.025em] sm:text-8xl">Yakob<br /><span>Getu</span></h1>
      </div>
    </section>
  );
}
