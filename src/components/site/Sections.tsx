import type { ContentMap, Testimonial } from "@/types";
import Image from "next/image";
import { Reveal } from "./Reveal";

// ============================================
// PROCESS
// ============================================
export function Process({ content }: { content: ContentMap }) {
  const c = content.process ?? {};
  const steps = [
    { num: "01", title: c.step1_title, desc: c.step1_desc },
    { num: "02", title: c.step2_title, desc: c.step2_desc },
    { num: "03", title: c.step3_title, desc: c.step3_desc },
    { num: "04", title: c.step4_title, desc: c.step4_desc },
  ].filter((s) => s.title);

  return (
    <section className="py-20 lg:py-28 px-6 lg:px-20 bg-bg">
      <Reveal>
        <div className="flex items-center justify-center gap-4 mb-4">
          <span className="text-[0.65rem] tracking-[7px] uppercase text-accent font-semibold">
            {c.tag || "How It Works"}
          </span>
        </div>
      </Reveal>
      <Reveal delay={0.05}>
        <h2 className="font-display text-[clamp(2.5rem,4.5vw,4rem)] leading-none tracking-wide text-center mb-10">
          {c.title || "FROM APPLICATION TO TRANSFORMATION"}
        </h2>
      </Reveal>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 relative">
        <div className="hidden lg:block absolute top-10 left-[10%] right-[10%] h-px bg-accent/10" />
        {steps.map((step, i) => (
          <Reveal key={i} delay={i * 0.08}>
            <div className="text-center px-4 relative">
              <div className="font-display text-[2.5rem] text-accent/30 mb-3">
                {step.num}
              </div>
              <h4 className="text-[0.95rem] font-semibold mb-2">
                {step.title}
              </h4>
              <p className="text-[0.8rem] text-muted leading-relaxed font-light">
                {step.desc}
              </p>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

// ============================================
// TESTIMONIALS
// ============================================
export function Testimonials({
  testimonials,
}: {
  testimonials: Testimonial[];
}) {
  if (testimonials.length === 0) return null;

  return (
    <section className="py-20 lg:py-28 px-6 lg:px-20">
      <Reveal>
        <div className="flex items-center gap-4 mb-4">
          <span className="w-8 h-px bg-accent" />
          <span className="text-[0.65rem] tracking-[7px] uppercase text-accent font-semibold">
            Testimonials
          </span>
        </div>
      </Reveal>
      <Reveal delay={0.05}>
        <h2 className="font-display text-[clamp(2.5rem,4.5vw,4rem)] leading-none tracking-wide mb-8">
          REAL RESULTS. REAL PEOPLE.
        </h2>
      </Reveal>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {testimonials.map((t, i) => (
          <Reveal key={t.id} delay={i * 0.08}>
            <div className="p-8 bg-surface border border-accent/[0.06]">
              <div className="text-accent text-[0.75rem] tracking-[2px] mb-4">
                {"★".repeat(t.stars)}
              </div>
              <p className="text-foreground text-[0.95rem] leading-relaxed italic mb-5 font-light">
                &ldquo;{t.quote}&rdquo;
              </p>
              <div className="text-[0.7rem] tracking-[2.5px] uppercase text-muted font-medium">
                {t.client_name}
              </div>
              {t.result && (
                <div className="text-[0.65rem] text-accent font-semibold tracking-wider mt-1">
                  {t.result.toUpperCase()}
                </div>
              )}
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

// ============================================
// CTA
// ============================================
export function CTA({ content }: { content: ContentMap }) {
  const c = content.cta ?? {};

  return (
    <section
      id="start"
      className="text-center py-24 lg:py-32 px-6 relative overflow-hidden"
    >
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 font-display text-[clamp(5rem,15vw,14rem)] text-accent/[0.03] whitespace-nowrap pointer-events-none tracking-[10px]">
        TRANSFORM
      </div>

      <Reveal>
        <div className="flex items-center justify-center gap-4 mb-4">
          <span className="text-[0.65rem] tracking-[7px] uppercase text-accent font-semibold">
            {c.tag || "Get Started"}
          </span>
        </div>
      </Reveal>

      <Reveal delay={0.05}>
        <h2 className="font-display text-[clamp(2.8rem,5.5vw,4.5rem)] tracking-[2px] mb-4 relative">
          {c.title_line1 || "YOUR TRANSFORMATION"}
          <br />
          {c.title_line2 || "STARTS TODAY"}
        </h2>
      </Reveal>

      <Reveal delay={0.1}>
        <p className="text-muted max-w-[460px] mx-auto mb-8 leading-[1.75] font-light">
          {c.description || "Apply now for a free consultation."}
        </p>
      </Reveal>

      <Reveal delay={0.15}>
        <a
          href={c.whatsapp_url || "https://wa.me/"}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-3 bg-accent text-bg px-10 py-4 text-[0.85rem] font-semibold tracking-[2.5px] uppercase hover:bg-accent-hover hover:-translate-y-0.5 hover:shadow-[0_8px_30px_rgba(201,168,76,0.25)] transition-all"
        >
          {c.button_text || "Apply For Coaching"}
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
      </Reveal>
    </section>
  );
}

// ============================================
// FOOTER
// ============================================
export function Footer({ content }: { content: ContentMap }) {
  const c = content.footer ?? {};

  return (
    <footer className="py-12 px-6 lg:px-20 border-t border-accent/[0.06]">
      <div className="flex flex-col lg:flex-row justify-between items-start gap-8 mb-10">
        <div>
          <a href="#" className="block mb-3">
            <Image
              src="/images/logo3_stacked.png"
              alt="Dr. Marwan Tarek"
              width={160}
              height={180}
              className="h-28 w-auto"
            />
          </a>
          <p className="text-muted text-[0.78rem] mt-3 max-w-[280px] leading-relaxed font-light">
            {c.description ||
              "Evidence-based online coaching for serious athletes."}
          </p>
        </div>

        <div className="flex gap-16">
          <div>
            <h4 className="text-[0.6rem] tracking-[4px] uppercase text-accent mb-4">
              Navigate
            </h4>
            <div className="space-y-1">
              <a href="#about" className="block text-muted text-[0.82rem] hover:text-foreground transition-colors font-light">About</a>
              <a href="#programs" className="block text-muted text-[0.82rem] hover:text-foreground transition-colors font-light">Programs</a>
              <a href="#gallery" className="block text-muted text-[0.82rem] hover:text-foreground transition-colors font-light">Gallery</a>
              <a href="#start" className="block text-muted text-[0.82rem] hover:text-foreground transition-colors font-light">Contact</a>
            </div>
          </div>
          <div>
            <h4 className="text-[0.6rem] tracking-[4px] uppercase text-accent mb-4">
              Connect
            </h4>
            <div className="space-y-1">
              {c.instagram_url && (
                <a href={c.instagram_url} target="_blank" rel="noopener noreferrer" className="block text-muted text-[0.82rem] hover:text-foreground transition-colors font-light">Instagram</a>
              )}
              {c.whatsapp_url && (
                <a href={c.whatsapp_url} target="_blank" rel="noopener noreferrer" className="block text-muted text-[0.82rem] hover:text-foreground transition-colors font-light">WhatsApp</a>
              )}
              {c.youtube_url && c.youtube_url !== "#" && (
                <a href={c.youtube_url} target="_blank" rel="noopener noreferrer" className="block text-muted text-[0.82rem] hover:text-foreground transition-colors font-light">YouTube</a>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-between items-center pt-5 border-t border-accent/[0.06] text-muted text-[0.7rem]">
        <span>&copy; {new Date().getFullYear()} Dr. Marwan Tarek. All rights reserved.</span>
        <span>Built with precision.</span>
      </div>
    </footer>
  );
}
