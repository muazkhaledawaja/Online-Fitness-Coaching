"use client";

import { useState } from "react";
import { submitContactForm } from "@/actions";
import { toast } from "sonner";
import type { PricingPlan } from "@/types";
import { useLanguage } from "@/contexts/LanguageContext";

interface ContactFormProps {
  plans: PricingPlan[];
}

export function ContactForm({ plans }: ContactFormProps) {
  const [loading, setLoading] = useState(false);
  const { t } = useLanguage();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    const fd = new FormData(e.currentTarget);
    const result = await submitContactForm({
      name: fd.get("name") as string,
      email: (fd.get("email") as string) || undefined,
      phone: (fd.get("phone") as string) || undefined,
      goal: (fd.get("goal") as string) || undefined,
      message: (fd.get("message") as string) || undefined,
      preferred_plan: (fd.get("preferred_plan") as string) || undefined,
    });

    setLoading(false);

    if (result.success) {
      toast.success("Application submitted! Dr. Marwan will be in touch.");
      (e.target as HTMLFormElement).reset();
    } else {
      toast.error("Something went wrong. Please try again.");
    }
  }

  return (
    <section className="py-20 lg:py-28 px-6 lg:px-20 bg-surface">
      <div className="max-w-[600px] mx-auto">
        <div className="text-center mb-10">
          <div className="text-[0.65rem] tracking-[7px] uppercase text-accent font-semibold mb-4">
            {t.form.tag}
          </div>
          <h2 className="font-display text-[clamp(2rem,4vw,3rem)] leading-none tracking-wide">
            {t.form.title}
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-[0.7rem] tracking-[2px] uppercase text-muted mb-2">
              {t.form.name}{t.form.nameSuffix}
            </label>
            <input
              name="name"
              required
              className="w-full bg-bg border border-accent/[0.08] px-4 py-3 text-foreground text-[0.9rem] focus:border-accent/30 focus:outline-none transition-colors"
              placeholder={t.form.namePlaceholder}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-[0.7rem] tracking-[2px] uppercase text-muted mb-2">
                {t.form.email}
              </label>
              <input
                name="email"
                type="email"
                className="w-full bg-bg border border-accent/[0.08] px-4 py-3 text-foreground text-[0.9rem] focus:border-accent/30 focus:outline-none transition-colors"
                placeholder={t.form.emailPlaceholder}
              />
            </div>
            <div>
              <label className="block text-[0.7rem] tracking-[2px] uppercase text-muted mb-2">
                {t.form.phone}
              </label>
              <input
                name="phone"
                className="w-full bg-bg border border-accent/[0.08] px-4 py-3 text-foreground text-[0.9rem] focus:border-accent/30 focus:outline-none transition-colors"
                placeholder={t.form.phonePlaceholder}
              />
            </div>
          </div>

          {plans.length > 0 && (
            <div>
              <label className="block text-[0.7rem] tracking-[2px] uppercase text-muted mb-2">
                {t.form.interestedIn}
              </label>
              <select
                name="preferred_plan"
                className="w-full bg-bg border border-accent/[0.08] px-4 py-3 text-foreground text-[0.9rem] focus:border-accent/30 focus:outline-none transition-colors"
              >
                <option value="">{t.form.selectProgram}</option>
                {plans.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} — ${p.price}/{p.period}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div>
            <label className="block text-[0.7rem] tracking-[2px] uppercase text-muted mb-2">
              {t.form.goal}
            </label>
            <textarea
              name="goal"
              rows={3}
              className="w-full bg-bg border border-accent/[0.08] px-4 py-3 text-foreground text-[0.9rem] focus:border-accent/30 focus:outline-none transition-colors resize-none"
              placeholder={t.form.goalPlaceholder}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-accent text-bg py-4 text-[0.8rem] font-semibold tracking-[2.5px] uppercase hover:bg-accent-hover hover:-translate-y-0.5 hover:shadow-[0_8px_30px_rgba(201,168,76,0.2)] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? t.form.submitting : t.form.submit}
          </button>
        </form>
      </div>
    </section>
  );
}
