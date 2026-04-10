import Image from "next/image";
import type { ContentMap } from "@/types";
import { Reveal } from "./Reveal";

interface AboutProps {
  content: ContentMap;
}

export function About({ content }: AboutProps) {
  const c = content.about ?? {};

  const creds = [
    { title: c.cred_1_title, value: c.cred_1_value },
    { title: c.cred_2_title, value: c.cred_2_value },
    { title: c.cred_3_title, value: c.cred_3_value },
    { title: c.cred_4_title, value: c.cred_4_value },
  ].filter((cr) => cr.title && cr.value);

  return (
    <section id="about" className="py-20 lg:py-28 px-6 lg:px-20">
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.3fr] gap-12 lg:gap-20 items-center max-w-[1300px] mx-auto">
        <Reveal>
          <div className="relative aspect-[3/4] overflow-hidden">
            {c.image_url ? (
              <Image
                src={c.image_url}
                alt="Dr. Marwan Tarek"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 40vw"
              />
            ) : (
              <div className="w-full h-full bg-surface" />
            )}
            <div className="absolute -top-2 -right-2 bottom-2 left-2 border border-accent/20 pointer-events-none" />
          </div>
        </Reveal>

        <Reveal delay={0.1}>
          <div>
            <div className="flex items-center gap-4 mb-4">
              <span className="w-8 h-px bg-accent" />
              <span className="text-[0.65rem] tracking-[7px] uppercase text-accent font-semibold">
                {c.tag || "The Coach"}
              </span>
            </div>

            <h2 className="font-display text-[clamp(2.5rem,4.5vw,4rem)] leading-none tracking-wide mb-2">
              {c.title || "DR. MARWAN TAREK"}
            </h2>

            {c.paragraph1 && (
              <p className="text-muted leading-[1.85] mt-5 text-[0.92rem] font-light">
                {c.paragraph1}
              </p>
            )}
            {c.paragraph2 && (
              <p className="text-muted leading-[1.85] mt-4 text-[0.92rem] font-light">
                {c.paragraph2}
              </p>
            )}

            {creds.length > 0 && (
              <div className="grid grid-cols-2 gap-3 mt-8">
                {creds.map((cr, i) => (
                  <div
                    key={i}
                    className="p-4 border border-accent/[0.08] bg-surface"
                  >
                    <div className="text-[0.6rem] tracking-[3px] uppercase text-accent mb-1">
                      {cr.title}
                    </div>
                    <div className="font-semibold text-[0.88rem]">
                      {cr.value}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
