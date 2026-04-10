// ============================================
// DATABASE TYPES
// ============================================

export interface SiteContent {
  id: string;
  section: string;
  key: string;
  value: string;
  value_type: "text" | "html" | "number" | "boolean";
  created_at: string;
  updated_at: string;
}

export interface GalleryImage {
  id: string;
  url: string;
  alt_text: string;
  sort_order: number;
  is_visible: boolean;
  created_at: string;
}

export interface Testimonial {
  id: string;
  client_name: string;
  quote: string;
  result: string;
  stars: number;
  avatar_url: string | null;
  sort_order: number;
  is_visible: boolean;
  created_at: string;
  updated_at: string;
}

export interface PricingPlan {
  id: string;
  name: string;
  tier_label: string;
  price: number;
  currency: string;
  period: string;
  description: string;
  features: string[];
  is_featured: boolean;
  sort_order: number;
  is_visible: boolean;
  created_at: string;
  updated_at: string;
}

export interface ContactLead {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  goal: string;
  message: string;
  preferred_plan: string | null;
  is_read: boolean;
  is_archived: boolean;
  created_at: string;
}

export interface HeroStat {
  id: string;
  value: string;
  label: string;
  sort_order: number;
  is_visible: boolean;
}

export interface MarqueeItem {
  id: string;
  text: string;
  sort_order: number;
  is_visible: boolean;
}

// ============================================
// HELPER TYPES
// ============================================

/** Parsed site_content into a section→key→value map */
export type ContentMap = Record<string, Record<string, string>>;

/** All data needed to render the public site */
export interface SiteData {
  content: ContentMap;
  gallery: GalleryImage[];
  testimonials: Testimonial[];
  plans: PricingPlan[];
  stats: HeroStat[];
  marquee: MarqueeItem[];
}

/** Lead form submission */
export interface LeadFormData {
  name: string;
  email?: string;
  phone?: string;
  goal?: string;
  message?: string;
  preferred_plan?: string;
}

/** Dashboard stats for admin */
export interface DashboardStats {
  totalLeads: number;
  unreadLeads: number;
  totalTestimonials: number;
  totalGalleryImages: number;
}
