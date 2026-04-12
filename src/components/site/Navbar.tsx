"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { ThemeToggle, LangToggle } from "./Controls";
import { useLanguage } from "@/contexts/LanguageContext";

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { t } = useLanguage();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  const close = () => setMenuOpen(false);

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 px-6 lg:px-16 py-4 flex justify-between items-center transition-all duration-300 ${
          scrolled
            ? "bg-bg/95 backdrop-blur-lg border-b border-accent/[0.08]"
            : "bg-gradient-to-b from-bg/90 to-transparent"
        }`}
      >
        <a href="#" className="flex items-center gap-3" onClick={close}>
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

        <div className="flex items-center gap-4 lg:gap-6">
          {/* Desktop nav links */}
          <div className="hidden md:flex gap-8 items-center">
            <a href="#about" className="text-muted no-underline text-[0.78rem] tracking-[2.5px] uppercase font-medium hover:text-accent transition-colors">{t.nav.about}</a>
            <a href="#programs" className="text-muted no-underline text-[0.78rem] tracking-[2.5px] uppercase font-medium hover:text-accent transition-colors">{t.nav.programs}</a>
            <a href="#gallery" className="text-muted no-underline text-[0.78rem] tracking-[2.5px] uppercase font-medium hover:text-accent transition-colors">{t.nav.gallery}</a>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-1">
            <LangToggle />
            <ThemeToggle />
          </div>

          <a href="#start" className="hidden md:block bg-accent text-bg px-5 py-2 text-[0.78rem] tracking-[1.5px] uppercase font-bold hover:bg-accent-hover transition-colors" onClick={close}>
            {t.nav.startNow}
          </a>

          {/* Hamburger */}
          <button
            onClick={() => setMenuOpen((o) => !o)}
            className="md:hidden flex flex-col justify-center items-center w-8 h-8 gap-1.5"
            aria-label="Toggle menu"
          >
            <span className={`block w-6 h-px bg-foreground transition-all duration-300 origin-center ${menuOpen ? "rotate-45 translate-y-[5px]" : ""}`} />
            <span className={`block w-6 h-px bg-foreground transition-all duration-300 ${menuOpen ? "opacity-0 scale-x-0" : ""}`} />
            <span className={`block w-6 h-px bg-foreground transition-all duration-300 origin-center ${menuOpen ? "-rotate-45 -translate-y-[5px]" : ""}`} />
          </button>
        </div>
      </nav>

      {/* Mobile menu overlay */}
      <div
        className={`fixed inset-0 z-40 bg-bg/97 backdrop-blur-lg flex flex-col justify-center items-center gap-8 transition-all duration-300 md:hidden ${
          menuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
      >
        {[
          { href: "#about", label: t.nav.about },
          { href: "#programs", label: t.nav.programs },
          { href: "#gallery", label: t.nav.gallery },
          { href: "#start", label: "Contact" },
        ].map((item) => (
          <a
            key={item.href}
            href={item.href}
            onClick={close}
            className="font-display text-[2.8rem] tracking-[4px] text-foreground hover:text-accent transition-colors"
          >
            {item.label.toUpperCase()}
          </a>
        ))}
        <a
          href="#start"
          onClick={close}
          className="mt-4 bg-accent text-bg px-10 py-4 text-[0.85rem] font-semibold tracking-[2.5px] uppercase hover:bg-accent-hover transition-colors"
        >
          {t.nav.startNow}
        </a>
      </div>
    </>
  );
}
