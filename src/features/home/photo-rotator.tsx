"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

type Slide = {
  src: string;
  alt: string;
};

function nextRandomSlide(current: number, total: number) {
  if (total < 2) return 0;

  return (current + 1 + Math.floor(Math.random() * (total - 1))) % total;
}

export default function PhotoRotator({ slides }: { slides: Slide[] }) {
  const [activeSlide, setActiveSlide] = useState(0);
  const [isExpanded, setIsExpanded] = useState(false);
  const [aspectRatios, setAspectRatios] = useState<Record<string, number>>({});

  useEffect(() => {
    if (slides.length < 2) return;

    const timer = window.setTimeout(() => {
      setActiveSlide((current) => nextRandomSlide(current, slides.length));
    }, 4200);

    return () => window.clearTimeout(timer);
  }, [activeSlide, slides.length]);

  if (!slides.length) return null;

  const currentSlide = activeSlide % slides.length;
  const activeImage = slides[currentSlide];
  const expandedAspectRatio = aspectRatios[activeImage.src];

  return (
    <div
      className="relative mx-auto aspect-[4/5] w-full max-w-md"
      onMouseEnter={() => setIsExpanded(true)}
      onMouseLeave={() => setIsExpanded(false)}
    >
    <button
      type="button"
      className={`absolute left-0 top-1/2 aspect-[4/5] max-h-[115%] w-full -translate-y-1/2 cursor-pointer overflow-hidden rounded-[2rem] bg-background shadow-2xl shadow-black/10 transition-[aspect-ratio,scale,box-shadow] duration-500 ease-out focus-visible:outline-2 focus-visible:outline-offset-8 focus-visible:outline-foreground/60 motion-reduce:transition-none dark:shadow-black/30 ${isExpanded ? "z-10 scale-[1.03] motion-reduce:scale-100" : "scale-100"}`}
      style={isExpanded && expandedAspectRatio ? { aspectRatio: expandedAspectRatio } : undefined}
      aria-label={slides.length > 1 ? "Show next portrait. Hover or focus to see the full photo." : "Portrait. Hover or focus to see the full photo."}
      onClick={() => setActiveSlide((current) => (current + 1) % slides.length)}
      onFocus={() => setIsExpanded(true)}
      onBlur={() => setIsExpanded(false)}
    >
      <Image
        key={activeImage.src}
        src={activeImage.src}
        alt={activeImage.alt}
        fill
        sizes="(max-width: 1023px) 100vw, 450px"
        className={`animate-[photo-in_500ms_ease-out] motion-reduce:animate-none ${isExpanded ? "object-contain" : "object-cover"}`}
        onLoad={(event) => {
          const image = event.currentTarget;
          setAspectRatios((current) => (
            current[activeImage.src]
              ? current
              : { ...current, [activeImage.src]: image.naturalWidth / image.naturalHeight }
          ));
        }}
        priority={currentSlide === 0}
      />

    </button>
    </div>
  );
}
