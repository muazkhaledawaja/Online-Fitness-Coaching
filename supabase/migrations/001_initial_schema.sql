-- ============================================
-- DR. MARWAN TAREK COACHING - DATABASE SCHEMA
-- ============================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- 1. SITE CONTENT (key-value for all text)
-- ============================================
CREATE TABLE site_content (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  section VARCHAR(50) NOT NULL,        -- 'hero', 'about', 'cta', 'footer', 'meta'
  key VARCHAR(100) NOT NULL,           -- 'title', 'subtitle', 'description', etc.
  value TEXT NOT NULL DEFAULT '',
  value_type VARCHAR(20) NOT NULL DEFAULT 'text', -- 'text', 'html', 'number', 'boolean'
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(section, key)
);

-- ============================================
-- 2. GALLERY IMAGES
-- ============================================
CREATE TABLE gallery_images (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  url TEXT NOT NULL,
  alt_text VARCHAR(255) DEFAULT '',
  sort_order INTEGER NOT NULL DEFAULT 0,
  is_visible BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================
-- 3. TESTIMONIALS
-- ============================================
CREATE TABLE testimonials (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  client_name VARCHAR(100) NOT NULL,
  quote TEXT NOT NULL,
  result VARCHAR(200) DEFAULT '',      -- e.g. "-20kg · 5 months"
  stars INTEGER NOT NULL DEFAULT 5 CHECK (stars >= 1 AND stars <= 5),
  avatar_url TEXT,
  sort_order INTEGER NOT NULL DEFAULT 0,
  is_visible BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================
-- 4. PRICING PLANS
-- ============================================
CREATE TABLE pricing_plans (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(100) NOT NULL,          -- 'Foundation', 'Elite Coaching', 'Comp Prep'
  tier_label VARCHAR(50) DEFAULT '',   -- 'Tier 01', 'Tier 02', 'Tier 03'
  price DECIMAL(10,2) NOT NULL,
  currency VARCHAR(3) NOT NULL DEFAULT 'USD',
  period VARCHAR(20) NOT NULL DEFAULT 'month', -- 'month', 'week', 'one-time'
  description TEXT DEFAULT '',
  features JSONB NOT NULL DEFAULT '[]', -- ["Feature 1", "Feature 2", ...]
  is_featured BOOLEAN NOT NULL DEFAULT false,
  sort_order INTEGER NOT NULL DEFAULT 0,
  is_visible BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================
-- 5. CONTACT LEADS
-- ============================================
CREATE TABLE contact_leads (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(150) NOT NULL,
  email VARCHAR(255),
  phone VARCHAR(50),
  goal TEXT DEFAULT '',                -- What they want to achieve
  message TEXT DEFAULT '',
  preferred_plan UUID REFERENCES pricing_plans(id) ON DELETE SET NULL,
  is_read BOOLEAN NOT NULL DEFAULT false,
  is_archived BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================
-- 6. HERO STATS (the 500+, 8+, 98% numbers)
-- ============================================
CREATE TABLE hero_stats (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  value VARCHAR(20) NOT NULL,          -- '500+', '8+', '98%'
  label VARCHAR(100) NOT NULL,         -- 'Clients Transformed'
  sort_order INTEGER NOT NULL DEFAULT 0,
  is_visible BOOLEAN NOT NULL DEFAULT true
);

-- ============================================
-- 7. MARQUEE ITEMS
-- ============================================
CREATE TABLE marquee_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  text VARCHAR(50) NOT NULL,
  sort_order INTEGER NOT NULL DEFAULT 0,
  is_visible BOOLEAN NOT NULL DEFAULT true
);

-- ============================================
-- AUTO-UPDATE updated_at TRIGGER
-- ============================================
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_site_content_updated
  BEFORE UPDATE ON site_content
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER trg_testimonials_updated
  BEFORE UPDATE ON testimonials
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER trg_pricing_plans_updated
  BEFORE UPDATE ON pricing_plans
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ============================================
-- ROW LEVEL SECURITY
-- ============================================

-- Enable RLS on all tables
ALTER TABLE site_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE gallery_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE pricing_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE hero_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE marquee_items ENABLE ROW LEVEL SECURITY;

-- PUBLIC READ policies (anon can read visible content)
CREATE POLICY "Public can read site_content"
  ON site_content FOR SELECT TO anon USING (true);

CREATE POLICY "Public can read visible gallery"
  ON gallery_images FOR SELECT TO anon USING (is_visible = true);

CREATE POLICY "Public can read visible testimonials"
  ON testimonials FOR SELECT TO anon USING (is_visible = true);

CREATE POLICY "Public can read visible pricing"
  ON pricing_plans FOR SELECT TO anon USING (is_visible = true);

CREATE POLICY "Public can read hero_stats"
  ON hero_stats FOR SELECT TO anon USING (is_visible = true);

CREATE POLICY "Public can read marquee_items"
  ON marquee_items FOR SELECT TO anon USING (is_visible = true);

-- PUBLIC INSERT for contact leads (anyone can submit)
CREATE POLICY "Public can insert leads"
  ON contact_leads FOR INSERT TO anon
  WITH CHECK (true);

-- ADMIN FULL ACCESS (authenticated users)
CREATE POLICY "Admin full access site_content"
  ON site_content FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Admin full access gallery"
  ON gallery_images FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Admin full access testimonials"
  ON testimonials FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Admin full access pricing"
  ON pricing_plans FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Admin full access leads"
  ON contact_leads FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Admin full access hero_stats"
  ON hero_stats FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Admin full access marquee_items"
  ON marquee_items FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- ============================================
-- STORAGE BUCKET FOR GALLERY
-- ============================================
INSERT INTO storage.buckets (id, name, public)
VALUES ('gallery', 'gallery', true)
ON CONFLICT (id) DO NOTHING;

-- Allow public read on gallery bucket
CREATE POLICY "Public read gallery bucket"
  ON storage.objects FOR SELECT TO anon
  USING (bucket_id = 'gallery');

-- Allow authenticated upload/delete
CREATE POLICY "Admin upload gallery"
  ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'gallery');

CREATE POLICY "Admin update gallery"
  ON storage.objects FOR UPDATE TO authenticated
  USING (bucket_id = 'gallery');

CREATE POLICY "Admin delete gallery"
  ON storage.objects FOR DELETE TO authenticated
  USING (bucket_id = 'gallery');

-- ============================================
-- SEED DATA
-- ============================================

-- Hero content
INSERT INTO site_content (section, key, value) VALUES
  ('hero', 'tag', 'Online Fitness Coaching'),
  ('hero', 'title_line1', 'BUILD'),
  ('hero', 'title_line2', 'YOUR'),
  ('hero', 'title_line3', 'LEGACY'),
  ('hero', 'description', 'Science-backed training programs designed by Dr. Marwan Tarek. Transform your physique with personalized coaching — anywhere in the world.'),
  ('hero', 'cta_primary', 'View Programs'),
  ('hero', 'cta_secondary', 'Learn More'),
  ('hero', 'image_url', '');

-- About content
INSERT INTO site_content (section, key, value) VALUES
  ('about', 'tag', 'The Coach'),
  ('about', 'title', 'DR. MARWAN TAREK'),
  ('about', 'paragraph1', 'With years of hands-on experience transforming physiques across Egypt and the Middle East, Dr. Marwan combines medical knowledge with elite-level coaching methodology. Every program is built on evidence-based training science — no shortcuts, no gimmicks.'),
  ('about', 'paragraph2', 'Whether you''re a beginner building a foundation or an advanced lifter pushing for competition prep, every protocol is tailored to YOUR body, YOUR goals, YOUR life.'),
  ('about', 'image_url', ''),
  ('about', 'cred_1_title', 'Specialization'),
  ('about', 'cred_1_value', 'Hypertrophy & Body Recomp'),
  ('about', 'cred_2_title', 'Background'),
  ('about', 'cred_2_value', 'Medical Doctor'),
  ('about', 'cred_3_title', 'Clients'),
  ('about', 'cred_3_value', '500+ Worldwide'),
  ('about', 'cred_4_title', 'Based In'),
  ('about', 'cred_4_value', 'Egypt / Online');

-- CTA content
INSERT INTO site_content (section, key, value) VALUES
  ('cta', 'tag', 'Get Started'),
  ('cta', 'title_line1', 'YOUR TRANSFORMATION'),
  ('cta', 'title_line2', 'STARTS TODAY'),
  ('cta', 'description', 'Stop planning. Start doing. Apply now for a free consultation and see what personalized coaching can do.'),
  ('cta', 'button_text', 'Apply For Coaching'),
  ('cta', 'whatsapp_url', 'https://wa.me/');

-- Programs section labels
INSERT INTO site_content (section, key, value) VALUES
  ('programs', 'tag', 'Programs'),
  ('programs', 'title', 'CHOOSE YOUR PATH'),
  ('programs', 'subtitle', 'Every plan is fully personalized. Pick the level of coaching that fits your commitment.');

-- Footer content
INSERT INTO site_content (section, key, value) VALUES
  ('footer', 'description', 'Evidence-based online coaching for serious athletes and transformation seekers.'),
  ('footer', 'instagram_url', 'https://www.instagram.com/drmarwantarek'),
  ('footer', 'whatsapp_url', 'https://wa.me/'),
  ('footer', 'youtube_url', '#');

-- Meta
INSERT INTO site_content (section, key, value) VALUES
  ('meta', 'site_title', 'DR. MARWAN TAREK — Online Coaching'),
  ('meta', 'site_description', 'Science-backed online fitness coaching by Dr. Marwan Tarek. Personalized training and nutrition programs.');

-- Hero stats
INSERT INTO hero_stats (value, label, sort_order) VALUES
  ('500+', 'Clients Transformed', 1),
  ('8+', 'Years Experience', 2),
  ('98%', 'Retention Rate', 3);

-- Marquee items
INSERT INTO marquee_items (text, sort_order) VALUES
  ('STRENGTH', 1), ('DISCIPLINE', 2), ('HYPERTROPHY', 3),
  ('NUTRITION', 4), ('TRANSFORMATION', 5), ('MINDSET', 6);

-- Pricing plans
INSERT INTO pricing_plans (name, tier_label, price, period, description, features, is_featured, sort_order) VALUES
  ('Foundation', 'Tier 01', 99, 'month',
   'Custom training program with nutrition guidelines. Perfect for self-motivated athletes who need expert programming.',
   '["Personalized training program", "Nutrition macro targets", "Monthly program updates", "Exercise video library"]',
   false, 1),
  ('Elite Coaching', 'Tier 02 — Most Popular', 199, 'month',
   'Full coaching experience with weekly check-ins, form reviews, and real-time program adjustments.',
   '["Everything in Foundation", "Weekly 1-on-1 check-ins", "Form video review & feedback", "Full meal plan with recipes", "Supplement protocol", "WhatsApp direct access"]',
   true, 2),
  ('Comp Prep', 'Tier 03', 349, 'month',
   'Competition-level protocol with peak week strategy and daily communication for stage-ready athletes.',
   '["Everything in Elite", "Daily check-ins", "Peak week protocol", "Posing guidance", "Show day management", "Post-show reverse diet"]',
   false, 3);

-- Testimonials
INSERT INTO testimonials (client_name, quote, result, stars, sort_order) VALUES
  ('Ahmed M.', 'Dr. Marwan''s medical background sets him apart. He understood my thyroid condition and designed around it.', '-20kg · 5 months', 5, 1),
  ('Omar K.', 'I''ve worked with three coaches before. Marwan is the first who explains the WHY behind every decision. Absolute game-changer.', '+8kg lean mass · 4 months', 5, 2),
  ('Youssef R.', 'The weekly check-ins kept me accountable in ways I never could on my own. Best investment I''ve made in myself.', 'Full recomp · 6 months', 5, 3),
  ('Karim A.', 'My doctor was shocked at my bloodwork after 6 months. This is life-changing coaching.', '-25kg · 24 weeks', 5, 4);

-- Process steps
INSERT INTO site_content (section, key, value) VALUES
  ('process', 'tag', 'How It Works'),
  ('process', 'title', 'FROM APPLICATION TO TRANSFORMATION'),
  ('process', 'step1_title', 'Apply'),
  ('process', 'step1_desc', 'Fill out the intake form with your history, goals, and lifestyle details.'),
  ('process', 'step2_title', 'Consult'),
  ('process', 'step2_desc', 'Deep-dive call to align on strategy, set expectations, and plan your path.'),
  ('process', 'step3_title', 'Execute'),
  ('process', 'step3_desc', 'Receive your fully customized training and nutrition protocol. We begin.'),
  ('process', 'step4_title', 'Evolve'),
  ('process', 'step4_desc', 'Weekly check-ins ensure your program adapts as your body responds.');
