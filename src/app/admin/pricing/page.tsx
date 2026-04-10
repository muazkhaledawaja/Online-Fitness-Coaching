"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { upsertPricingPlan, deletePricingPlan } from "@/actions";
import { toast } from "sonner";
import { Plus, Trash2, Pencil, X, Star } from "lucide-react";
import type { PricingPlan } from "@/types";

const emptyPlan: Partial<PricingPlan> = {
  name: "",
  tier_label: "",
  price: 0,
  period: "month",
  description: "",
  features: [],
  is_featured: false,
};

export default function PricingPage() {
  const [plans, setPlans] = useState<PricingPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Partial<PricingPlan> | null>(null);
  const [featureInput, setFeatureInput] = useState("");

  async function fetchData() {
    const supabase = createClient();
    const { data } = await supabase
      .from("pricing_plans")
      .select("*")
      .order("sort_order", { ascending: true });
    setPlans(data ?? []);
    setLoading(false);
  }

  useEffect(() => {
    fetchData();
  }, []);

  async function handleSave() {
    if (!editing?.name || !editing?.price) {
      toast.error("Name and price are required");
      return;
    }
    const result = await upsertPricingPlan({
      id: editing.id,
      name: editing.name,
      tier_label: editing.tier_label || "",
      price: editing.price,
      period: editing.period || "month",
      description: editing.description || "",
      features: editing.features || [],
      is_featured: editing.is_featured || false,
    });
    if (result.success) {
      toast.success("Saved");
      setEditing(null);
      fetchData();
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this plan?")) return;
    await deletePricingPlan(id);
    toast.success("Deleted");
    fetchData();
  }

  function addFeature() {
    if (!featureInput.trim() || !editing) return;
    setEditing({
      ...editing,
      features: [...(editing.features || []), featureInput.trim()],
    });
    setFeatureInput("");
  }

  function removeFeature(index: number) {
    if (!editing) return;
    setEditing({
      ...editing,
      features: (editing.features || []).filter((_, i) => i !== index),
    });
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-display text-3xl tracking-[3px]">PRICING</h1>
        <button
          onClick={() => setEditing({ ...emptyPlan })}
          className="inline-flex items-center gap-2 bg-accent text-bg px-5 py-2.5 text-sm font-semibold tracking-widest uppercase hover:bg-accent-hover transition-colors"
        >
          <Plus className="w-4 h-4" /> Add Plan
        </button>
      </div>

      {/* Edit Modal */}
      {editing && (
        <div className="fixed inset-0 bg-bg/80 z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-surface border border-accent/10 p-8 w-full max-w-lg my-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-display text-xl tracking-[2px]">
                {editing.id ? "EDIT" : "NEW"} PLAN
              </h2>
              <button onClick={() => setEditing(null)} className="text-muted hover:text-foreground">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-4">
              <input
                value={editing.name || ""}
                onChange={(e) => setEditing({ ...editing, name: e.target.value })}
                placeholder="Plan name (e.g. Elite Coaching)"
                className="w-full bg-bg border border-accent/10 px-4 py-3 text-foreground focus:border-accent/30 focus:outline-none text-sm"
              />
              <input
                value={editing.tier_label || ""}
                onChange={(e) => setEditing({ ...editing, tier_label: e.target.value })}
                placeholder="Tier label (e.g. Tier 02 — Most Popular)"
                className="w-full bg-bg border border-accent/10 px-4 py-3 text-foreground focus:border-accent/30 focus:outline-none text-sm"
              />
              <div className="grid grid-cols-2 gap-4">
                <input
                  type="number"
                  value={editing.price || ""}
                  onChange={(e) => setEditing({ ...editing, price: Number(e.target.value) })}
                  placeholder="Price"
                  className="w-full bg-bg border border-accent/10 px-4 py-3 text-foreground focus:border-accent/30 focus:outline-none text-sm"
                />
                <select
                  value={editing.period || "month"}
                  onChange={(e) => setEditing({ ...editing, period: e.target.value })}
                  className="w-full bg-bg border border-accent/10 px-4 py-3 text-foreground focus:border-accent/30 focus:outline-none text-sm"
                >
                  <option value="month">per month</option>
                  <option value="week">per week</option>
                  <option value="one-time">one-time</option>
                </select>
              </div>
              <textarea
                value={editing.description || ""}
                onChange={(e) => setEditing({ ...editing, description: e.target.value })}
                placeholder="Description"
                rows={2}
                className="w-full bg-bg border border-accent/10 px-4 py-3 text-foreground focus:border-accent/30 focus:outline-none text-sm resize-none"
              />

              {/* Features */}
              <div>
                <label className="text-xs text-muted tracking-widest uppercase mb-2 block">
                  Features
                </label>
                <div className="space-y-1 mb-2">
                  {(editing.features || []).map((f, i) => (
                    <div key={i} className="flex items-center gap-2 text-sm">
                      <span className="flex-1 text-muted">{f}</span>
                      <button
                        onClick={() => removeFeature(i)}
                        className="text-muted hover:text-red-400 text-xs"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input
                    value={featureInput}
                    onChange={(e) => setFeatureInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addFeature())}
                    placeholder="Add feature..."
                    className="flex-1 bg-bg border border-accent/10 px-3 py-2 text-foreground focus:border-accent/30 focus:outline-none text-sm"
                  />
                  <button onClick={addFeature} className="px-3 py-2 bg-accent/10 text-accent text-sm hover:bg-accent/20">
                    Add
                  </button>
                </div>
              </div>

              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={editing.is_featured || false}
                  onChange={(e) => setEditing({ ...editing, is_featured: e.target.checked })}
                  className="accent-accent"
                />
                <span className="text-sm">Featured (highlighted on site)</span>
              </label>

              <button
                onClick={handleSave}
                className="w-full bg-accent text-bg py-3 font-semibold tracking-widest uppercase text-sm hover:bg-accent-hover transition-colors"
              >
                Save Plan
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Plans List */}
      {loading ? (
        <div className="text-muted text-center py-20">Loading...</div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className={`bg-surface border p-6 relative ${
                plan.is_featured
                  ? "border-accent/20 bg-accent/[0.03]"
                  : "border-accent/[0.06]"
              }`}
            >
              {plan.is_featured && (
                <Star className="w-4 h-4 text-accent absolute top-4 right-4 fill-accent" />
              )}
              <div className="text-[0.6rem] tracking-[3px] uppercase text-accent mb-2">
                {plan.tier_label}
              </div>
              <h3 className="font-display text-xl tracking-wider mb-1">
                {plan.name.toUpperCase()}
              </h3>
              <p className="text-muted text-xs mb-3 line-clamp-2">
                {plan.description}
              </p>
              <div className="font-display text-2xl text-accent mb-3">
                ${plan.price}
                <span className="text-xs text-muted font-body">/{plan.period}</span>
              </div>
              <div className="text-xs text-muted space-y-0.5 mb-4">
                {plan.features.map((f, i) => (
                  <div key={i}>— {f}</div>
                ))}
              </div>
              <div className="flex gap-2">
                <button onClick={() => { setEditing(plan); setFeatureInput(""); }} className="p-2 text-muted hover:text-accent">
                  <Pencil className="w-4 h-4" />
                </button>
                <button onClick={() => handleDelete(plan.id)} className="p-2 text-muted hover:text-red-400">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
