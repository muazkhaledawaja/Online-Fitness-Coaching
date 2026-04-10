"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 px-6 lg:px-16 py-4 flex justify-between items-center transition-all duration-300 ${
        scrolled
          ? "bg-bg/98 backdrop-blur-lg border-b border-accent/[0.08]"
          : "bg-gradient-to-b from-bg/97 to-transparent"
      }`}
    >
      <a href="#" className="flex items-center gap-3">
        <Image
          src="/images/logo4_icon.png"
          alt="Dr. Marwan Tarek"
          width={44}
          height={44}
          className="h-11 w-auto"
          priority
        />
        <span className="hidden md:block font-display text-[1.4rem] tracking-[5px] text-foreground">
          DR<span className="text-accent">.</span> MARWAN
        </span>
      </a>

      <div className="flex gap-10 items-center">
        <a
          href="#about"
          className="hidden md:inline text-muted no-underline text-[0.78rem] tracking-[2.5px] uppercase font-medium hover:text-accent transition-colors"
        >
          About
        </a>
        <a
          href="#programs"
          className="hidden md:inline text-muted no-underline text-[0.78rem] tracking-[2.5px] uppercase font-medium hover:text-accent transition-colors"
        >
          Programs
        </a>
        <a
          href="#gallery"
          className="hidden md:inline text-muted no-underline text-[0.78rem] tracking-[2.5px] uppercase font-medium hover:text-accent transition-colors"
        >
          Gallery
        </a>
        <a
          href="#start"
          className="bg-accent text-bg px-5 py-2 text-[0.78rem] tracking-[1.5px] uppercase font-bold hover:bg-accent-hover transition-colors"
        >
          Start Now
        </a>
      </div>
    </nav>
  );
}
