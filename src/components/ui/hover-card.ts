"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { clamp } from "@/components/motion/motion-math";

// Long enough to move the pointer from the anchor across the gap onto the card.
const CLOSE_DELAY_MS = 180;
const SCREEN_MARGIN_PX = 12;
const GAP_PX = 12;
const POINTER_INSET_PX = 24;

type Placement = "below" | "beside";

// Behaviour for a small card that belongs to an element (the "anchor"):
// it opens while the mouse is over the anchor or the card, or while either has keyboard focus,
// and closes shortly after both are left. Escape and scrolling close it at once.
// With a mouse, a card shown below its anchor lines up with the pointer and follows it along the
// anchor, so a wide anchor (the tibeb band) shows its card where the visitor is pointing.
// On touch screens there is no hover, so the caller opens it from a tap with `toggle`.
export function useHoverCard(placement: Placement = "below") {
  const [isOpen, setIsOpen] = useState(false);
  const anchor = useRef<HTMLElement | null>(null);
  const card = useRef<HTMLDivElement | null>(null);
  // Callback refs, so the anchor can be any kind of element (button, span, div, ...).
  const setAnchor = useCallback((element: HTMLElement | null) => {
    anchor.current = element;
  }, []);
  const setCard = useCallback((element: HTMLDivElement | null) => {
    card.current = element;
  }, []);
  const closeTimer = useRef(0);
  // Where the mouse is over the anchor, or null when the card was opened from the keyboard or a tap.
  const pointerX = useRef<number | null>(null);

  function open() {
    window.clearTimeout(closeTimer.current);
    setIsOpen(true);
  }

  function closeSoon() {
    window.clearTimeout(closeTimer.current);
    closeTimer.current = window.setTimeout(() => setIsOpen(false), CLOSE_DELAY_MS);
  }

  function close() {
    window.clearTimeout(closeTimer.current);
    setIsOpen(false);
  }

  useEffect(() => () => window.clearTimeout(closeTimer.current), []);

  useEffect(() => {
    if (!isOpen) return;

    function closeOnEscape(event: KeyboardEvent) {
      if (event.key === "Escape") setIsOpen(false);
    }
    // A tap or click anywhere outside the anchor and the card closes it.
    function closeOnOutsidePress(event: PointerEvent) {
      const target = event.target as Node;
      if (anchor.current?.contains(target) || card.current?.contains(target)) return;
      setIsOpen(false);
    }
    const closeOnScroll = () => setIsOpen(false);

    window.addEventListener("keydown", closeOnEscape);
    window.addEventListener("pointerdown", closeOnOutsidePress);
    window.addEventListener("scroll", closeOnScroll, { passive: true });
    return () => {
      window.removeEventListener("keydown", closeOnEscape);
      window.removeEventListener("pointerdown", closeOnOutsidePress);
      window.removeEventListener("scroll", closeOnScroll);
    };
  }, [isOpen]);

  // Place the card next to its anchor (or under the pointer) and keep it fully on screen.
  const place = useCallback(() => {
    const cardElement = card.current;
    if (!anchor.current || !cardElement) return;

    const anchorBox = anchor.current.getBoundingClientRect();
    const maxLeft = window.innerWidth - cardElement.offsetWidth - SCREEN_MARGIN_PX;
    const maxTop = window.innerHeight - cardElement.offsetHeight - SCREEN_MARGIN_PX;
    const fitsBeside =
      anchorBox.right + GAP_PX + cardElement.offsetWidth + SCREEN_MARGIN_PX <= window.innerWidth;

    // The pointer sits a little inside the card's left edge, so the card reads as coming from it.
    let left = pointerX.current === null ? anchorBox.left : pointerX.current - POINTER_INSET_PX;
    let top = anchorBox.bottom + GAP_PX;
    if (placement === "beside" && fitsBeside) {
      left = anchorBox.right + GAP_PX;
      top = anchorBox.top - 8;
    } else if (top > maxTop) {
      // No room underneath: sit above the anchor instead.
      top = anchorBox.top - cardElement.offsetHeight - GAP_PX;
    }

    cardElement.style.left = `${clamp(left, SCREEN_MARGIN_PX, Math.max(SCREEN_MARGIN_PX, maxLeft))}px`;
    cardElement.style.top = `${clamp(top, SCREEN_MARGIN_PX, Math.max(SCREEN_MARGIN_PX, maxTop))}px`;
  }, [placement]);

  useLayoutEffect(() => {
    if (isOpen) place();
  }, [isOpen, place]);

  // Spread these on both the anchor and the card.
  const hoverProps = {
    onPointerEnter: (event: React.PointerEvent) => {
      // Also remembered for a tap, so a card opened by tapping shows where the finger was.
      if (event.currentTarget === anchor.current) pointerX.current = event.clientX;
      if (event.pointerType === "mouse") open();
    },
    onPointerMove: (event: React.PointerEvent) => {
      // Follow the pointer along the anchor; once it is on the card, the card stays put.
      if (event.pointerType !== "mouse" || placement !== "below") return;
      if (event.currentTarget !== anchor.current) return;
      pointerX.current = event.clientX;
      if (isOpen) place();
    },
    onPointerLeave: (event: React.PointerEvent) => {
      if (event.pointerType === "mouse") closeSoon();
    },
    onFocus: (event: React.FocusEvent) => {
      // Only keyboard focus opens the card; a mouse click on a button should not pin it open.
      if (event.target.matches(":focus-visible")) {
        pointerX.current = null;
        open();
      }
    },
    onBlur: closeSoon,
  };

  return {
    isOpen,
    open,
    close,
    toggle: () => (isOpen ? close() : open()),
    hoverProps,
    // Pass these as the `ref` of the anchor element and of the card element.
    setAnchor,
    setCard,
  };
}
