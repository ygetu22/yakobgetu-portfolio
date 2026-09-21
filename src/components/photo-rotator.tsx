"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

type Slide = {
  src: string;
  alt: string;
};

function nextRandomSlide(current: number, total: number) {
  if (total < 2) return 0;

  let next = current;
  while (next === current) next = Math.floor(Math.random() * total);

  return next;
}

export default function PhotoRotator({ slides }: { slides: Slide[] }) {
  const [activeSlide, setActiveSlide] = useState(0);

  useEffect(() => {
    if (!slides.length) return;

    const timer = window.setInterval(() => {
      setActiveSlide((current) => nextRandomSlide(current, slides.length));
    }, 4200);

    return () => window.clearInterval(timer);
  }, [slides.length]);

  if (!slides.length) return null;

  const currentSlide = activeSlide % slides.length;
  const activeImage = slides[currentSlide];

  return (
    <div className="relative mx-auto aspect-[4/5] w-full max-w-md overflow-hidden rounded-[2rem] bg-foreground/[0.08] shadow-2xl shadow-black/10 dark:shadow-black/30">
      <Image
        key={activeImage.src}
        src={activeImage.src}
        alt={activeImage.alt}
        fill
        sizes="(max-width: 1023px) 100vw, 450px"
        className="animate-[photo-in_700ms_ease-out] object-cover"
        priority={currentSlide === 0}
      />

      <div className="absolute bottom-7 left-0 right-0 flex justify-center gap-2">
        {slides.map((slide, index) => (
          <span
            key={slide.src}
            className={`h-1 rounded-full transition-all ${
              currentSlide === index ? "w-7 bg-foreground/65" : "w-2 bg-foreground/20"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
