import { getDashboardStats } from "@/actions";
import { createServerSupabase } from "@/lib/supabase/server";
import { timeAgo } from "@/lib/utils";
import { Users, Image, MessageSquareQuote, DollarSign } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const stats = await getDashboardStats();
  const supabase = await createServerSupabase();

  const { data: recentLeads } = await supabase
    .from("contact_leads")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(5);

  const cards = [
    {
      label: "Total Leads",
      value: stats.totalLeads,
      sub: `${stats.unreadLeads} unread`,
      icon: Users,
      accent: stats.unreadLeads > 0,
    },
    {
      label: "Testimonials",
      value: stats.totalTestimonials,
      icon: MessageSquareQuote,
    },
    {
      label: "Gallery Images",
      value: stats.totalGalleryImages,
      icon: Image,
    },
  ];

  return (
    <div>
      <h1 className="font-display text-3xl tracking-[3px] mb-8">DASHBOARD</h1>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.label}
              className="bg-surface border border-accent/[0.06] p-6"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-[0.65rem] tracking-[3px] uppercase text-muted">
                  {card.label}
                </span>
                <Icon className="w-4 h-4 text-accent/40" />
              </div>
              <div className="font-display text-4xl text-foreground">
                {card.value}
              </div>
              {card.sub && (
                <div
                  className={`text-xs mt-1 ${
                    card.accent ? "text-accent" : "text-muted"
                  }`}
                >
                  {card.sub}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Recent Leads */}
      <div className="bg-surface border border-accent/[0.06]">
        <div className="px-6 py-4 border-b border-accent/[0.06] flex items-center justify-between">
          <h2 className="font-display text-lg tracking-[2px]">RECENT LEADS</h2>
          <a
            href="/admin/leads"
            className="text-accent text-xs tracking-widest uppercase hover:text-accent-hover"
          >
            View All →
          </a>
        </div>
        <div className="divide-y divide-accent/[0.04]">
          {recentLeads?.map((lead) => (
            <div
              key={lead.id}
              className={`px-6 py-4 flex items-center justify-between ${
                !lead.is_read ? "bg-accent/[0.02]" : ""
              }`}
            >
              <div>
                <div className="flex items-center gap-2">
                  {!lead.is_read && (
                    <span className="w-2 h-2 rounded-full bg-accent" />
                  )}
                  <span className="font-medium text-sm">{lead.name}</span>
                </div>
                <p className="text-muted text-xs mt-0.5 truncate max-w-[300px]">
                  {lead.goal || lead.message || "No message"}
                </p>
              </div>
              <div className="text-muted text-xs">
                {timeAgo(lead.created_at)}
              </div>
            </div>
          ))}
          {(!recentLeads || recentLeads.length === 0) && (
            <div className="px-6 py-10 text-center text-muted text-sm">
              No leads yet. They&apos;ll show up here when someone applies.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
