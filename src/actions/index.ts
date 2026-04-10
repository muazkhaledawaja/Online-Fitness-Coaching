"use server";

import { createServerSupabase } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import type { LeadFormData } from "@/types";

// ============================================
// PUBLIC: Contact form submission
// ============================================

export async function submitContactForm(data: LeadFormData) {
  const supabase = await createServerSupabase();

  const { error } = await supabase.from("contact_leads").insert({
    name: data.name,
    email: data.email || null,
    phone: data.phone || null,
    goal: data.goal || "",
    message: data.message || "",
    preferred_plan: data.preferred_plan || null,
  });

  if (error) return { success: false, error: error.message };
  return { success: true };
}

// ============================================
// ADMIN: Site Content
// ============================================

export async function updateSiteContent(
  section: string,
  key: string,
  value: string
) {
  const supabase = await createServerSupabase();

  const { error } = await supabase
    .from("site_content")
    .update({ value })
    .eq("section", section)
    .eq("key", key);

  if (error) return { success: false, error: error.message };
  revalidatePath("/");
  return { success: true };
}

export async function bulkUpdateSiteContent(
  updates: { section: string; key: string; value: string }[]
) {
  const supabase = await createServerSupabase();

  const promises = updates.map(({ section, key, value }) =>
    supabase
      .from("site_content")
      .update({ value })
      .eq("section", section)
      .eq("key", key)
  );

  const results = await Promise.all(promises);
  const failed = results.filter((r) => r.error);

  if (failed.length > 0)
    return { success: false, error: "Some updates failed" };

  revalidatePath("/");
  return { success: true };
}

// ============================================
// ADMIN: Gallery
// ============================================

export async function addGalleryImage(url: string, altText: string = "") {
  const supabase = await createServerSupabase();

  // Get max sort_order
  const { data: existing } = await supabase
    .from("gallery_images")
    .select("sort_order")
    .order("sort_order", { ascending: false })
    .limit(1);

  const nextOrder = (existing?.[0]?.sort_order ?? 0) + 1;

  const { error } = await supabase.from("gallery_images").insert({
    url,
    alt_text: altText,
    sort_order: nextOrder,
  });

  if (error) return { success: false, error: error.message };
  revalidatePath("/");
  revalidatePath("/admin/gallery");
  return { success: true };
}

export async function deleteGalleryImage(id: string) {
  const supabase = await createServerSupabase();
  const { error } = await supabase
    .from("gallery_images")
    .delete()
    .eq("id", id);

  if (error) return { success: false, error: error.message };
  revalidatePath("/");
  revalidatePath("/admin/gallery");
  return { success: true };
}

export async function reorderGalleryImages(
  orderedIds: { id: string; sort_order: number }[]
) {
  const supabase = await createServerSupabase();

  const promises = orderedIds.map(({ id, sort_order }) =>
    supabase.from("gallery_images").update({ sort_order }).eq("id", id)
  );

  await Promise.all(promises);
  revalidatePath("/");
  return { success: true };
}

export async function toggleGalleryVisibility(id: string, visible: boolean) {
  const supabase = await createServerSupabase();
  const { error } = await supabase
    .from("gallery_images")
    .update({ is_visible: visible })
    .eq("id", id);

  if (error) return { success: false, error: error.message };
  revalidatePath("/");
  return { success: true };
}

// ============================================
// ADMIN: Testimonials
// ============================================

export async function upsertTestimonial(data: {
  id?: string;
  client_name: string;
  quote: string;
  result: string;
  stars: number;
}) {
  const supabase = await createServerSupabase();

  if (data.id) {
    const { error } = await supabase
      .from("testimonials")
      .update({
        client_name: data.client_name,
        quote: data.quote,
        result: data.result,
        stars: data.stars,
      })
      .eq("id", data.id);

    if (error) return { success: false, error: error.message };
  } else {
    const { data: existing } = await supabase
      .from("testimonials")
      .select("sort_order")
      .order("sort_order", { ascending: false })
      .limit(1);

    const nextOrder = (existing?.[0]?.sort_order ?? 0) + 1;

    const { error } = await supabase.from("testimonials").insert({
      ...data,
      sort_order: nextOrder,
    });

    if (error) return { success: false, error: error.message };
  }

  revalidatePath("/");
  revalidatePath("/admin/testimonials");
  return { success: true };
}

export async function deleteTestimonial(id: string) {
  const supabase = await createServerSupabase();
  const { error } = await supabase
    .from("testimonials")
    .delete()
    .eq("id", id);

  if (error) return { success: false, error: error.message };
  revalidatePath("/");
  revalidatePath("/admin/testimonials");
  return { success: true };
}

export async function toggleTestimonialVisibility(
  id: string,
  visible: boolean
) {
  const supabase = await createServerSupabase();
  const { error } = await supabase
    .from("testimonials")
    .update({ is_visible: visible })
    .eq("id", id);

  if (error) return { success: false, error: error.message };
  revalidatePath("/");
  return { success: true };
}

// ============================================
// ADMIN: Pricing Plans
// ============================================

export async function upsertPricingPlan(data: {
  id?: string;
  name: string;
  tier_label: string;
  price: number;
  period: string;
  description: string;
  features: string[];
  is_featured: boolean;
}) {
  const supabase = await createServerSupabase();

  if (data.id) {
    const { error } = await supabase
      .from("pricing_plans")
      .update({
        name: data.name,
        tier_label: data.tier_label,
        price: data.price,
        period: data.period,
        description: data.description,
        features: data.features,
        is_featured: data.is_featured,
      })
      .eq("id", data.id);

    if (error) return { success: false, error: error.message };
  } else {
    const { data: existing } = await supabase
      .from("pricing_plans")
      .select("sort_order")
      .order("sort_order", { ascending: false })
      .limit(1);

    const nextOrder = (existing?.[0]?.sort_order ?? 0) + 1;

    const { error } = await supabase.from("pricing_plans").insert({
      ...data,
      sort_order: nextOrder,
    });

    if (error) return { success: false, error: error.message };
  }

  revalidatePath("/");
  revalidatePath("/admin/pricing");
  return { success: true };
}

export async function deletePricingPlan(id: string) {
  const supabase = await createServerSupabase();
  const { error } = await supabase
    .from("pricing_plans")
    .delete()
    .eq("id", id);

  if (error) return { success: false, error: error.message };
  revalidatePath("/");
  revalidatePath("/admin/pricing");
  return { success: true };
}

// ============================================
// ADMIN: Leads
// ============================================

export async function markLeadAsRead(id: string) {
  const supabase = await createServerSupabase();
  const { error } = await supabase
    .from("contact_leads")
    .update({ is_read: true })
    .eq("id", id);

  if (error) return { success: false, error: error.message };
  revalidatePath("/admin/leads");
  return { success: true };
}

export async function archiveLead(id: string) {
  const supabase = await createServerSupabase();
  const { error } = await supabase
    .from("contact_leads")
    .update({ is_archived: true })
    .eq("id", id);

  if (error) return { success: false, error: error.message };
  revalidatePath("/admin/leads");
  return { success: true };
}

export async function deleteLead(id: string) {
  const supabase = await createServerSupabase();
  const { error } = await supabase
    .from("contact_leads")
    .delete()
    .eq("id", id);

  if (error) return { success: false, error: error.message };
  revalidatePath("/admin/leads");
  return { success: true };
}

// ============================================
// ADMIN: Upload image to Supabase Storage
// ============================================

export async function uploadImage(formData: FormData) {
  const supabase = await createServerSupabase();
  const file = formData.get("file") as File;

  if (!file) return { success: false, error: "No file provided" };

  const ext = file.name.split(".").pop();
  const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

  const { error } = await supabase.storage
    .from("gallery")
    .upload(fileName, file);

  if (error) return { success: false, error: error.message };

  const {
    data: { publicUrl },
  } = supabase.storage.from("gallery").getPublicUrl(fileName);

  return { success: true, url: publicUrl };
}

// ============================================
// ADMIN: Hero Stats
// ============================================

export async function updateHeroStat(
  id: string,
  data: { value: string; label: string }
) {
  const supabase = await createServerSupabase();
  const { error } = await supabase
    .from("hero_stats")
    .update(data)
    .eq("id", id);

  if (error) return { success: false, error: error.message };
  revalidatePath("/");
  return { success: true };
}

// ============================================
// ADMIN: Dashboard stats
// ============================================

export async function getDashboardStats() {
  const supabase = await createServerSupabase();

  const [leads, unread, testimonials, gallery] = await Promise.all([
    supabase
      .from("contact_leads")
      .select("id", { count: "exact", head: true }),
    supabase
      .from("contact_leads")
      .select("id", { count: "exact", head: true })
      .eq("is_read", false),
    supabase
      .from("testimonials")
      .select("id", { count: "exact", head: true }),
    supabase
      .from("gallery_images")
      .select("id", { count: "exact", head: true }),
  ]);

  return {
    totalLeads: leads.count ?? 0,
    unreadLeads: unread.count ?? 0,
    totalTestimonials: testimonials.count ?? 0,
    totalGalleryImages: gallery.count ?? 0,
  };
}
