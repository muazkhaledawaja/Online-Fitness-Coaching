"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import type { ContentMap, HeroStat } from "@/types";
import { AnimatedCounter } from "./AnimatedCounter";
import { useLanguage } from "@/contexts/LanguageContext";

interface HeroProps {
  content: ContentMap;
  stats: HeroStat[];
}

const lineVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, delay: 0.1 + i * 0.12, ease: [0.22, 1, 0.36, 1] },
  }),
};

export function Hero({ content, stats }: HeroProps) {
  const { t, lang } = useLanguage();
  const c = content.hero ?? {};
  // In AR mode always use translation; in EN mode use DB content with translation fallback
  const tx = (dbVal: string | undefined, fallback: string) =>
    lang === "ar" ? fallback : dbVal || fallback;

  return (
    <section className="min-h-screen grid grid-cols-1 lg:grid-cols-2 relative overflow-hidden">
      <div className="flex flex-col justify-center px-6 lg:px-20 pt-28 lg:pt-32 pb-10 relative z-10">

        {/* Tag */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="flex items-center gap-4 mb-8"
        >
          <span className="w-10 h-px bg-accent" />
          <span className="text-[0.7rem] tracking-[7px] uppercase text-accent font-semibold">
            {tx(c.tag, t.hero.tag)}
          </span>
        </motion.div>

        {/* Headline */}
        <h1 className="font-display text-[clamp(4rem,7.5vw,7rem)] leading-[0.88] -tracking-wide mb-6 overflow-hidden">
          {[tx(c.title_line1, t.hero.line1), tx(c.title_line2, t.hero.line2)].map((line, i) => (
            <motion.span
              key={i}
              className="block"
              custom={i}
              initial="hidden"
              animate="visible"
              variants={lineVariants}
            >
              {line}
            </motion.span>
          ))}
          <motion.span
            className="block text-accent"
            custom={2}
            initial="hidden"
            animate="visible"
            variants={lineVariants}
          >
            {tx(c.title_line3, t.hero.line3)}
          </motion.span>
        </h1>

        {/* Description */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.5, ease: "easeOut" }}
          className="text-[1.05rem] text-muted max-w-[400px] leading-[1.75] mb-8 font-light"
        >
          {tx(c.description, t.hero.description)}
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.65, ease: "easeOut" }}
          className="flex gap-4 flex-wrap"
        >
          <a
            href="#programs"
            className="inline-flex items-center gap-3 bg-accent text-bg px-8 py-4 text-[0.8rem] font-semibold tracking-[2.5px] uppercase hover:bg-accent-hover hover:-translate-y-0.5 hover:shadow-[0_8px_30px_rgba(201,168,76,0.25)] transition-all"
          >
            {tx(c.cta_primary, t.hero.ctaPrimary)}
            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </a>
          <a
            href="#about"
            className="inline-flex items-center gap-3 border border-foreground/[0.15] text-foreground px-8 py-4 text-[0.8rem] font-semibold tracking-[2.5px] uppercase hover:border-accent hover:text-accent transition-all"
          >
            {tx(c.cta_secondary, t.hero.ctaSecondary)}
          </a>
        </motion.div>

        {/* Stats */}
        {stats.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.85 }}
            className="flex flex-wrap gap-6 lg:gap-8 mt-8 pt-7 border-t border-accent/[0.12]"
          >
            {stats.map((stat) => (
              <div key={stat.id}>
                <div className="font-display text-[2rem] lg:text-[2.5rem] text-accent leading-none">
                  <AnimatedCounter value={stat.value} />
                </div>
                <div className="text-[0.65rem] tracking-[3px] uppercase text-muted mt-1">
                  {stat.label}
                </div>
              </div>
            ))}
          </motion.div>
        )}
      </div>

      {/* Hero Image */}
      <motion.div
        initial={{ opacity: 0, scale: 1.04 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
        className="relative overflow-hidden h-[70vh] lg:h-auto"
      >
        {c.image_url ? (
          <Image
            src={c.image_url}
            alt="Dr. Marwan Tarek"
            fill
            className="object-cover object-top contrast-[1.05] brightness-95"
            priority
            sizes="(max-width: 1024px) 100vw, 50vw"
          />
        ) : (
          <div className="w-full h-full bg-surface" />
        )}
        <div className="absolute inset-0 bg-gradient-to-r from-bg via-bg/30 to-transparent lg:via-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-bg to-transparent via-transparent" />
        <div className="absolute inset-0 bg-gradient-to-b from-bg to-transparent via-transparent opacity-30" />
      </motion.div>
    </section>
  );
}
