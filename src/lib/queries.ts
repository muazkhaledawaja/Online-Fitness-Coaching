import { createServerSupabase } from "@/lib/supabase/server";
import type { ContentMap, SiteData } from "@/types";

export async function getSiteContent(): Promise<ContentMap> {
  const supabase = await createServerSupabase();
  const { data } = await supabase.from("site_content").select("*");

  const map: ContentMap = {};
  data?.forEach((row) => {
    if (!map[row.section]) map[row.section] = {};
    map[row.section][row.key] = row.value;
  });
  return map;
}

export async function getGallery() {
  const supabase = await createServerSupabase();
  const { data } = await supabase
    .from("gallery_images")
    .select("*")
    .eq("is_visible", true)
    .order("sort_order", { ascending: true });
  return data ?? [];
}

export async function getTestimonials() {
  const supabase = await createServerSupabase();
  const { data } = await supabase
    .from("testimonials")
    .select("*")
    .eq("is_visible", true)
    .order("sort_order", { ascending: true });
  return data ?? [];
}

export async function getPricingPlans() {
  const supabase = await createServerSupabase();
  const { data } = await supabase
    .from("pricing_plans")
    .select("*")
    .eq("is_visible", true)
    .order("sort_order", { ascending: true });
  return data ?? [];
}

export async function getHeroStats() {
  const supabase = await createServerSupabase();
  const { data } = await supabase
    .from("hero_stats")
    .select("*")
    .eq("is_visible", true)
    .order("sort_order", { ascending: true });
  return data ?? [];
}

export async function getMarqueeItems() {
  const supabase = await createServerSupabase();
  const { data } = await supabase
    .from("marquee_items")
    .select("*")
    .eq("is_visible", true)
    .order("sort_order", { ascending: true });
  return data ?? [];
}

/** Fetch everything needed for the public site in parallel */
export async function getAllSiteData(): Promise<SiteData> {
  const [content, gallery, testimonials, plans, stats, marquee] =
    await Promise.all([
      getSiteContent(),
      getGallery(),
      getTestimonials(),
      getPricingPlans(),
      getHeroStats(),
      getMarqueeItems(),
    ]);

  return { content, gallery, testimonials, plans, stats, marquee };
}
