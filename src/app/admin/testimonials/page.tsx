"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import {
  upsertTestimonial,
  deleteTestimonial,
  toggleTestimonialVisibility,
} from "@/actions";
import { toast } from "sonner";
import { Plus, Trash2, Eye, EyeOff, Pencil, X } from "lucide-react";
import type { Testimonial } from "@/types";

export default function TestimonialsPage() {
  const [items, setItems] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Partial<Testimonial> | null>(null);

  async function fetchData() {
    const supabase = createClient();
    const { data } = await supabase
      .from("testimonials")
      .select("*")
      .order("sort_order", { ascending: true });
    setItems(data ?? []);
    setLoading(false);
  }

  useEffect(() => {
    fetchData();
  }, []);

  async function handleSave() {
    if (!editing?.client_name || !editing?.quote) {
      toast.error("Name and quote are required");
      return;
    }
    const result = await upsertTestimonial({
      id: editing.id,
      client_name: editing.client_name,
      quote: editing.quote,
      result: editing.result || "",
      stars: editing.stars || 5,
    });
    if (result.success) {
      toast.success(editing.id ? "Updated" : "Added");
      setEditing(null);
      fetchData();
    } else {
      toast.error("Failed to save");
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this testimonial?")) return;
    await deleteTestimonial(id);
    toast.success("Deleted");
    fetchData();
  }

  async function handleToggle(id: string, visible: boolean) {
    await toggleTestimonialVisibility(id, !visible);
    toast.success(visible ? "Hidden" : "Visible");
    fetchData();
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-display text-3xl tracking-[3px]">TESTIMONIALS</h1>
        <button
          onClick={() =>
            setEditing({ client_name: "", quote: "", result: "", stars: 5 })
          }
          className="inline-flex items-center gap-2 bg-accent text-bg px-5 py-2.5 text-sm font-semibold tracking-widest uppercase hover:bg-accent-hover transition-colors"
        >
          <Plus className="w-4 h-4" /> Add
        </button>
      </div>

      {/* Edit Modal */}
      {editing && (
        <div className="fixed inset-0 bg-bg/80 z-50 flex items-center justify-center p-4">
          <div className="bg-surface border border-accent/10 p-8 w-full max-w-lg">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-display text-xl tracking-[2px]">
                {editing.id ? "EDIT" : "NEW"} TESTIMONIAL
              </h2>
              <button onClick={() => setEditing(null)} className="text-muted hover:text-foreground">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-4">
              <input
                value={editing.client_name || ""}
                onChange={(e) => setEditing({ ...editing, client_name: e.target.value })}
                placeholder="Client name"
                className="w-full bg-bg border border-accent/10 px-4 py-3 text-foreground focus:border-accent/30 focus:outline-none text-sm"
              />
              <textarea
                value={editing.quote || ""}
                onChange={(e) => setEditing({ ...editing, quote: e.target.value })}
                placeholder="Their quote..."
                rows={3}
                className="w-full bg-bg border border-accent/10 px-4 py-3 text-foreground focus:border-accent/30 focus:outline-none text-sm resize-none"
              />
              <input
                value={editing.result || ""}
                onChange={(e) => setEditing({ ...editing, result: e.target.value })}
                placeholder="Result (e.g. -20kg · 5 months)"
                className="w-full bg-bg border border-accent/10 px-4 py-3 text-foreground focus:border-accent/30 focus:outline-none text-sm"
              />
              <div>
                <label className="text-xs text-muted tracking-widest uppercase">Stars</label>
                <div className="flex gap-2 mt-2">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <button
                      key={s}
                      onClick={() => setEditing({ ...editing, stars: s })}
                      className={`text-lg ${s <= (editing.stars || 5) ? "text-accent" : "text-muted/30"}`}
                    >
                      ★
                    </button>
                  ))}
                </div>
              </div>
              <button
                onClick={handleSave}
                className="w-full bg-accent text-bg py-3 font-semibold tracking-widest uppercase text-sm hover:bg-accent-hover transition-colors"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* List */}
      {loading ? (
        <div className="text-muted text-center py-20">Loading...</div>
      ) : (
        <div className="space-y-3">
          {items.map((t) => (
            <div
              key={t.id}
              className={`bg-surface border border-accent/[0.06] p-6 flex items-start justify-between gap-4 ${
                !t.is_visible ? "opacity-40" : ""
              }`}
            >
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-1">
                  <span className="font-semibold text-sm">{t.client_name}</span>
                  <span className="text-accent text-xs">{"★".repeat(t.stars)}</span>
                </div>
                <p className="text-muted text-sm italic">&ldquo;{t.quote}&rdquo;</p>
                {t.result && (
                  <p className="text-accent text-xs font-semibold mt-1">{t.result}</p>
                )}
              </div>
              <div className="flex gap-2 flex-shrink-0">
                <button onClick={() => setEditing(t)} className="p-2 text-muted hover:text-accent" title="Edit">
                  <Pencil className="w-4 h-4" />
                </button>
                <button onClick={() => handleToggle(t.id, t.is_visible)} className="p-2 text-muted hover:text-accent" title="Toggle">
                  {t.is_visible ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
                <button onClick={() => handleDelete(t.id)} className="p-2 text-muted hover:text-red-400" title="Delete">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
          {items.length === 0 && (
            <div className="text-muted text-center py-20 bg-surface border border-accent/[0.06]">
              No testimonials yet.
            </div>
          )}
        </div>
      )}
    </div>
  );
}
