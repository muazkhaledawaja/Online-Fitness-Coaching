# Dr. Marwan Tarek — Online Coaching Website

Dark gold aesthetic coaching website with admin dashboard, powered by Next.js + Supabase.

## Stack

- **Frontend:** Next.js 15 (App Router) + Tailwind CSS + Framer Motion
- **Backend:** Supabase (PostgreSQL + Auth + Storage)
- **Deployment:** Vercel (free tier)

## Quick Setup

### 1. Create Supabase Project

1. Go to [supabase.com](https://supabase.com) and create a new project
2. Go to **SQL Editor** and run the migration file: `supabase/migrations/001_initial_schema.sql`
3. Go to **Authentication > Users** and create a user for Dr. Marwan (this is the admin login)
4. Copy your project URL and anon key from **Settings > API**

### 2. Configure Environment

```bash
cp .env.example .env.local
```

Edit `.env.local` with your Supabase credentials:
```
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGci...
```

### 3. Install & Run

```bash
npm install
npm run dev
```

- Public site: [http://localhost:3000](http://localhost:3000)
- Admin panel: [http://localhost:3000/admin/login](http://localhost:3000/admin/login)

### 4. Upload Dr. Marwan's Photos

1. Log into the admin panel
2. Go to **Gallery** → Upload his photos
3. Go to **Site Content** → Update the `hero > image_url` and `about > image_url` fields with Supabase storage URLs

### 5. Deploy to Vercel

```bash
npx vercel
```

Add environment variables in Vercel dashboard under **Settings > Environment Variables**.

## Project Structure

```
src/
├── app/
│   ├── page.tsx              # Public landing page (ISR, 60s revalidation)
│   ├── layout.tsx            # Root layout
│   ├── globals.css           # Tailwind + custom styles
│   └── admin/
│       ├── layout.tsx        # Admin sidebar layout
│       ├── login/page.tsx    # Login page
│       ├── dashboard/page.tsx # Stats overview
│       ├── leads/page.tsx    # Contact form submissions
│       ├── gallery/page.tsx  # Photo management + upload
│       ├── testimonials/     # CRUD testimonials
│       ├── pricing/          # CRUD pricing plans
│       └── content/          # Edit all site text
├── actions/index.ts          # Server actions (all CRUD)
├── components/
│   └── site/                 # Public site components
├── lib/
│   ├── queries.ts            # Data fetching
│   ├── utils.ts              # Helpers
│   └── supabase/             # Client + server setup
├── types/index.ts            # TypeScript types
└── middleware.ts              # Admin route protection

supabase/
└── migrations/
    └── 001_initial_schema.sql  # Full DB schema + seed data + RLS
```

## Admin Features

| Page | What Marwan Can Do |
|------|-------------------|
| **Dashboard** | See lead count, unread count, recent leads |
| **Leads** | View all form submissions, mark read, archive, delete |
| **Gallery** | Upload photos, hide/show, delete |
| **Testimonials** | Add/edit/delete client quotes, toggle visibility |
| **Pricing** | Add/edit/delete plans, manage features, set featured |
| **Site Content** | Edit ALL text on the site (hero, about, CTA, footer, etc.) |

## How Content Updates Work

The public site uses **ISR (Incremental Static Regeneration)** with a 60-second revalidation. When Marwan edits content in the admin panel, changes appear on the live site within ~60 seconds — no redeploy needed.

## Database

7 tables with full RLS:
- `site_content` — key-value text store
- `gallery_images` — photos with sort order
- `testimonials` — client quotes
- `pricing_plans` — plans with JSONB features
- `contact_leads` — form submissions
- `hero_stats` — the stat numbers (500+, 8+, etc.)
- `marquee_items` — scrolling text items
