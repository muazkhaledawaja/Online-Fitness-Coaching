"use client";

import { useTheme } from "next-themes";
import { useLanguage } from "@/contexts/LanguageContext";
import { Sun, Moon } from "lucide-react";
import { useEffect, useState } from "react";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);
  if (!mounted) return <div className="w-8 h-8" />;

  return (
    <button
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className="w-8 h-8 flex items-center justify-center text-muted hover:text-accent transition-colors"
      aria-label="Toggle theme"
    >
      {theme === "dark" ? <Sun size={15} /> : <Moon size={15} />}
    </button>
  );
}

export function LangToggle() {
  const { lang, toggle } = useLanguage();

  return (
    <button
      onClick={toggle}
      className="text-[0.72rem] tracking-[2px] font-semibold text-muted hover:text-accent transition-colors px-1"
      aria-label="Switch language"
    >
      {lang === "en" ? "AR" : "EN"}
    </button>
  );
}
