import { createServerSupabase } from "@/lib/supabase/server";
import { formatDate } from "@/lib/utils";
import { LeadActions } from "./LeadActions";

export const dynamic = "force-dynamic";

export default async function LeadsPage() {
  const supabase = await createServerSupabase();
  const { data: leads } = await supabase
    .from("contact_leads")
    .select("*, pricing_plans(name)")
    .eq("is_archived", false)
    .order("created_at", { ascending: false });

  return (
    <div>
      <h1 className="font-display text-3xl tracking-[3px] mb-8">LEADS</h1>

      <div className="bg-surface border border-accent/[0.06]">
        <div className="divide-y divide-accent/[0.04]">
          {leads?.map((lead) => (
            <div
              key={lead.id}
              className={`p-6 ${!lead.is_read ? "bg-accent/[0.02]" : ""}`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    {!lead.is_read && (
                      <span className="w-2 h-2 rounded-full bg-accent flex-shrink-0" />
                    )}
                    <span className="font-semibold">{lead.name}</span>
                    <span className="text-muted text-xs">
                      {formatDate(lead.created_at)}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-sm text-muted mb-2">
                    {lead.email && <div>✉ {lead.email}</div>}
                    {lead.phone && <div>📱 {lead.phone}</div>}
                    {lead.pricing_plans && (
                      <div className="text-accent">
                        💪 {(lead.pricing_plans as any).name}
                      </div>
                    )}
                  </div>

                  {lead.goal && (
                    <p className="text-sm text-muted/80 mt-1">
                      <span className="text-accent text-xs uppercase tracking-wider">
                        Goal:
                      </span>{" "}
                      {lead.goal}
                    </p>
                  )}
                  {lead.message && (
                    <p className="text-sm text-muted/80 mt-1">
                      <span className="text-accent text-xs uppercase tracking-wider">
                        Message:
                      </span>{" "}
                      {lead.message}
                    </p>
                  )}
                </div>

                <LeadActions id={lead.id} isRead={lead.is_read} />
              </div>
            </div>
          ))}
          {(!leads || leads.length === 0) && (
            <div className="p-10 text-center text-muted text-sm">
              No leads yet.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
