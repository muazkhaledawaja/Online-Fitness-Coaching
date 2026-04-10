"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { bulkUpdateSiteContent } from "@/actions";
import { toast } from "sonner";
import { Save, Loader2 } from "lucide-react";
import type { SiteContent } from "@/types";

const SECTION_LABELS: Record<string, string> = {
  hero: "Hero Section",
  about: "About Section",
  programs: "Programs Section",
  process: "Process Steps",
  cta: "Call to Action",
  footer: "Footer",
  meta: "SEO / Meta",
};

const FIELD_LABELS: Record<string, string> = {
  tag: "Tag / Label",
  title: "Title",
  title_line1: "Title Line 1",
  title_line2: "Title Line 2",
  title_line3: "Title Line 3",
  description: "Description",
  paragraph1: "Paragraph 1",
  paragraph2: "Paragraph 2",
  subtitle: "Subtitle",
  cta_primary: "Primary Button",
  cta_secondary: "Secondary Button",
  button_text: "Button Text",
  image_url: "Image URL",
  whatsapp_url: "WhatsApp URL",
  instagram_url: "Instagram URL",
  youtube_url: "YouTube URL",
  site_title: "Site Title",
  site_description: "Site Description",
};

export default function ContentPage() {
  const [content, setContent] = useState<SiteContent[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [edited, setEdited] = useState<Record<string, string>>({});

  async function fetchData() {
    const supabase = createClient();
    const { data } = await supabase
      .from("site_content")
      .select("*")
      .order("section")
      .order("key");
    setContent(data ?? []);
    setLoading(false);
  }

  useEffect(() => {
    fetchData();
  }, []);

  function handleChange(section: string, key: string, value: string) {
    setEdited((prev) => ({ ...prev, [`${section}:${key}`]: value }));
  }

  function getValue(section: string, key: string, original: string) {
    const editKey = `${section}:${key}`;
    return editKey in edited ? edited[editKey] : original;
  }

  async function handleSave() {
    if (Object.keys(edited).length === 0) {
      toast.info("No changes to save");
      return;
    }

    setSaving(true);
    const updates = Object.entries(edited).map(([k, value]) => {
      const [section, key] = k.split(":");
      return { section, key, value };
    });

    const result = await bulkUpdateSiteContent(updates);
    if (result.success) {
      toast.success("Content saved! Site will update shortly.");
      setEdited({});
      fetchData();
    } else {
      toast.error("Failed to save some changes");
    }
    setSaving(false);
  }

  // Group by section
  const grouped = content.reduce(
    (acc, item) => {
      if (!acc[item.section]) acc[item.section] = [];
      acc[item.section].push(item);
      return acc;
    },
    {} as Record<string, SiteContent[]>
  );

  const hasChanges = Object.keys(edited).length > 0;

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-display text-3xl tracking-[3px]">SITE CONTENT</h1>
        <button
          onClick={handleSave}
          disabled={!hasChanges || saving}
          className={`inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold tracking-widest uppercase transition-colors ${
            hasChanges
              ? "bg-accent text-bg hover:bg-accent-hover"
              : "bg-accent/20 text-muted cursor-not-allowed"
          }`}
        >
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          {saving ? "Saving..." : "Save Changes"}
        </button>
      </div>

      {hasChanges && (
        <div className="bg-accent/10 border border-accent/20 px-4 py-2.5 mb-6 text-sm text-accent">
          You have unsaved changes.
        </div>
      )}

      {loading ? (
        <div className="text-muted text-center py-20">Loading...</div>
      ) : (
        <div className="space-y-8">
          {Object.entries(grouped).map(([section, items]) => (
            <div key={section} className="bg-surface border border-accent/[0.06]">
              <div className="px-6 py-4 border-b border-accent/[0.06]">
                <h2 className="font-display text-lg tracking-[2px]">
                  {SECTION_LABELS[section] || section.toUpperCase()}
                </h2>
              </div>
              <div className="divide-y divide-accent/[0.04]">
                {items.map((item) => {
                  const isLong =
                    item.value.length > 80 ||
                    item.key.includes("paragraph") ||
                    item.key.includes("description");
                  const isEdited = `${item.section}:${item.key}` in edited;

                  return (
                    <div key={item.id} className="px-6 py-4">
                      <label className="text-[0.65rem] tracking-[2px] uppercase text-muted mb-2 block">
                        {FIELD_LABELS[item.key] || item.key.replace(/_/g, " ")}
                        {isEdited && (
                          <span className="text-accent ml-2">• modified</span>
                        )}
                      </label>
                      {isLong ? (
                        <textarea
                          value={getValue(item.section, item.key, item.value)}
                          onChange={(e) =>
                            handleChange(item.section, item.key, e.target.value)
                          }
                          rows={3}
                          className="w-full bg-bg border border-accent/10 px-4 py-3 text-foreground text-sm focus:border-accent/30 focus:outline-none resize-none"
                        />
                      ) : (
                        <input
                          value={getValue(item.section, item.key, item.value)}
                          onChange={(e) =>
                            handleChange(item.section, item.key, e.target.value)
                          }
                          className="w-full bg-bg border border-accent/10 px-4 py-3 text-foreground text-sm focus:border-accent/30 focus:outline-none"
                        />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
