import Image from "next/image";
import type { ContentMap, HeroStat } from "@/types";
import { Reveal } from "./Reveal";

interface HeroProps {
  content: ContentMap;
  stats: HeroStat[];
}

export function Hero({ content, stats }: HeroProps) {
  const c = content.hero ?? {};

  return (
    <section className="min-h-screen grid grid-cols-1 lg:grid-cols-2 relative overflow-hidden">
      <div className="flex flex-col justify-center px-6 lg:px-20 pt-28 lg:pt-32 pb-10 relative z-10">
        <div className="flex items-center gap-4 mb-8">
          <span className="w-10 h-px bg-accent" />
          <span className="text-[0.7rem] tracking-[7px] uppercase text-accent font-semibold">
            {c.tag || "Online Fitness Coaching"}
          </span>
        </div>

        <h1 className="font-display text-[clamp(4rem,7.5vw,7rem)] leading-[0.88] -tracking-wide mb-6">
          {c.title_line1 || "BUILD"}
          <br />
          {c.title_line2 || "YOUR"}
          <br />
          <span className="text-accent">{c.title_line3 || "LEGACY"}</span>
        </h1>

        <p className="text-[1.05rem] text-muted max-w-[400px] leading-[1.75] mb-8 font-light">
          {c.description ||
            "Science-backed training programs designed by Dr. Marwan Tarek."}
        </p>

        <div className="flex gap-4 flex-wrap">
          <a
            href="#programs"
            className="inline-flex items-center gap-3 bg-accent text-bg px-8 py-4 text-[0.8rem] font-semibold tracking-[2.5px] uppercase hover:bg-accent-hover hover:-translate-y-0.5 hover:shadow-[0_8px_30px_rgba(201,168,76,0.25)] transition-all"
          >
            {c.cta_primary || "View Programs"}
            <svg
              className="w-3.5 h-3.5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </a>
          <a
            href="#about"
            className="inline-flex items-center gap-3 border border-white/[0.15] text-foreground px-8 py-4 text-[0.8rem] font-semibold tracking-[2.5px] uppercase hover:border-accent hover:text-accent transition-all"
          >
            {c.cta_secondary || "Learn More"}
          </a>
        </div>

        {stats.length > 0 && (
          <div className="flex gap-8 mt-8 pt-7 border-t border-accent/[0.12]">
            {stats.map((stat) => (
              <div key={stat.id}>
                <div className="font-display text-[2.5rem] text-accent leading-none">
                  {stat.value}
                </div>
                <div className="text-[0.65rem] tracking-[3px] uppercase text-muted mt-1">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="relative overflow-hidden h-[70vh] lg:h-auto">
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
      </div>
    </section>
  );
}
