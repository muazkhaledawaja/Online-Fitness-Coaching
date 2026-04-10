"use client";

import Image from "next/image";
import type { GalleryImage } from "@/types";

interface GalleryProps {
  images: GalleryImage[];
}

export function Gallery({ images }: GalleryProps) {
  if (images.length === 0) return null;

  return (
    <section id="gallery" className="py-16 lg:py-20 overflow-hidden">
      <div className="px-6 lg:px-20 mb-8">
        <div className="flex items-center gap-4 mb-4">
          <span className="w-8 h-px bg-accent" />
          <span className="text-[0.65rem] tracking-[7px] uppercase text-accent font-semibold">
            Gallery
          </span>
        </div>
        <h2 className="font-display text-[clamp(2.5rem,4.5vw,4rem)] leading-none tracking-wide">
          THE WORK SPEAKS
        </h2>
      </div>

      <div className="flex gap-4 px-6 lg:px-20 overflow-x-auto scrollbar-hide scroll-smooth snap-x snap-mandatory pb-4">
        {images.map((img) => (
          <div
            key={img.id}
            className="flex-none w-[280px] aspect-[3/4] overflow-hidden relative snap-start group"
          >
            <Image
              src={img.url}
              alt={img.alt_text || "Gallery"}
              fill
              className="object-cover grayscale-[20%] contrast-[1.05] group-hover:scale-105 group-hover:grayscale-0 transition-all duration-500"
              sizes="280px"
            />
          </div>
        ))}
      </div>
    </section>
  );
}
