"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { clamp } from "@/components/motion/motion-math";

// Long enough to move the pointer from the anchor across the gap onto the card.
const CLOSE_DELAY_MS = 180;
const SCREEN_MARGIN_PX = 12;
const GAP_PX = 12;

type Placement = "below" | "beside";

// Behaviour for a small card that belongs to an element (the "anchor"):
// it opens while the mouse is over the anchor or the card, or while either has keyboard focus,
// and closes shortly after both are left. Escape and scrolling close it at once.
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

  // Place the card next to its anchor and keep it fully on screen.
  useLayoutEffect(() => {
    const cardElement = card.current;
    if (!isOpen || !anchor.current || !cardElement) return;

    const anchorBox = anchor.current.getBoundingClientRect();
    const maxLeft = window.innerWidth - cardElement.offsetWidth - SCREEN_MARGIN_PX;
    const maxTop = window.innerHeight - cardElement.offsetHeight - SCREEN_MARGIN_PX;
    const fitsBeside =
      anchorBox.right + GAP_PX + cardElement.offsetWidth + SCREEN_MARGIN_PX <= window.innerWidth;

    let left = anchorBox.left;
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
  }, [isOpen, placement]);

  // Spread these on both the anchor and the card.
  const hoverProps = {
    onPointerEnter: (event: React.PointerEvent) => {
      if (event.pointerType === "mouse") open();
    },
    onPointerLeave: (event: React.PointerEvent) => {
      if (event.pointerType === "mouse") closeSoon();
    },
    onFocus: (event: React.FocusEvent) => {
      // Only keyboard focus opens the card; a mouse click on a button should not pin it open.
      if (event.target.matches(":focus-visible")) open();
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
