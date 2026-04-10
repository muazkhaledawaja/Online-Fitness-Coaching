import type { ContentMap, PricingPlan } from "@/types";
import { Reveal } from "./Reveal";

interface ProgramsProps {
  content: ContentMap;
  plans: PricingPlan[];
}

export function Programs({ content, plans }: ProgramsProps) {
  const c = content.programs ?? {};

  return (
    <section id="programs" className="py-20 lg:py-28 px-6 lg:px-20 bg-surface">
      <Reveal>
        <div className="flex items-center gap-4 mb-4">
          <span className="w-8 h-px bg-accent" />
          <span className="text-[0.65rem] tracking-[7px] uppercase text-accent font-semibold">
            {c.tag || "Programs"}
          </span>
        </div>
      </Reveal>
      <Reveal delay={0.05}>
        <h2 className="font-display text-[clamp(2.5rem,4.5vw,4rem)] leading-none tracking-wide mb-2">
          {c.title || "CHOOSE YOUR PATH"}
        </h2>
      </Reveal>
      <Reveal delay={0.1}>
        <p className="text-muted text-[0.95rem] max-w-[480px] leading-relaxed font-light">
          {c.subtitle || "Every plan is fully personalized."}
        </p>
      </Reveal>

      <div className="grid grid-cols-1 lg:grid-cols-3 mt-10 border border-accent/[0.08]">
        {plans.map((plan, i) => (
          <Reveal key={plan.id} delay={i * 0.08}>
            <div
              className={`p-8 lg:p-10 border-b lg:border-b-0 lg:border-r border-accent/[0.08] last:border-r-0 last:border-b-0 relative transition-colors hover:bg-accent/[0.02] ${
                plan.is_featured ? "bg-accent/[0.04]" : ""
              }`}
            >
              {plan.is_featured && (
                <div className="absolute top-0 left-0 right-0 h-0.5 bg-accent" />
              )}

              <div className="text-[0.6rem] tracking-[4px] uppercase text-accent font-semibold mb-5">
                {plan.tier_label}
              </div>

              <h3 className="font-display text-[1.8rem] tracking-[2px] mb-2">
                {plan.name.toUpperCase()}
              </h3>

              <p className="text-muted text-[0.82rem] leading-relaxed mb-6 font-light">
                {plan.description}
              </p>

              <div className="font-display text-[2.2rem] text-accent">
                ${plan.price}
                <span className="text-[0.75rem] text-muted font-body font-normal ml-1">
                  /{plan.period}
                </span>
              </div>

              {plan.features.length > 0 && (
                <ul className="mt-5 pt-5 border-t border-accent/[0.08] space-y-2">
                  {plan.features.map((f, fi) => (
                    <li
                      key={fi}
                      className="text-[0.78rem] text-muted pl-5 relative font-light"
                    >
                      <span className="absolute left-0 top-1/2 w-1.5 h-px bg-accent" />
                      {f}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
