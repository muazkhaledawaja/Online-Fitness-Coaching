"use client";

import { markLeadAsRead, archiveLead, deleteLead } from "@/actions";
import { toast } from "sonner";
import { Check, Archive, Trash2 } from "lucide-react";

export function LeadActions({ id, isRead }: { id: string; isRead: boolean }) {
  return (
    <div className="flex gap-2 flex-shrink-0">
      {!isRead && (
        <button
          onClick={async () => {
            await markLeadAsRead(id);
            toast.success("Marked as read");
          }}
          className="p-2 text-muted hover:text-accent transition-colors"
          title="Mark as read"
        >
          <Check className="w-4 h-4" />
        </button>
      )}
      <button
        onClick={async () => {
          await archiveLead(id);
          toast.success("Archived");
        }}
        className="p-2 text-muted hover:text-accent transition-colors"
        title="Archive"
      >
        <Archive className="w-4 h-4" />
      </button>
      <button
        onClick={async () => {
          if (confirm("Delete this lead?")) {
            await deleteLead(id);
            toast.success("Deleted");
          }
        }}
        className="p-2 text-muted hover:text-red-400 transition-colors"
        title="Delete"
      >
        <Trash2 className="w-4 h-4" />
      </button>
    </div>
  );
}
