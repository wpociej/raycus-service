"use client";

import { useEffect, useState } from "react";
import { Ticket } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { Loading } from "@/components/ui/loading";
import Link from "next/link";

const statusColors: Record<string, "default" | "success" | "warning" | "error"> = {
  open: "error", in_progress: "warning", waiting_customer: "default", resolved: "success", closed: "default",
};
const priorityColors: Record<string, "default" | "success" | "warning" | "error"> = {
  critical: "error", high: "warning", normal: "default", low: "default",
};

export default function AdminTicketsPage() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>("all");

  useEffect(() => {
    fetch("/api/tickets").then((r) => r.json()).then((data) => { setTickets(data); setLoading(false); });
  }, []);

  if (loading) return <Loading />;

  const filtered = filter === "all" ? tickets : tickets.filter((t) => t.status === filter);
  const sorted = [...filtered].sort((a, b) => {
    const priorityOrder = { critical: 0, high: 1, normal: 2, low: 3 };
    const pa = priorityOrder[a.priority as keyof typeof priorityOrder] ?? 2;
    const pb = priorityOrder[b.priority as keyof typeof priorityOrder] ?? 2;
    if (pa !== pb) return pa - pb;
    return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
  });

  const counts = {
    all: tickets.length,
    open: tickets.filter((t) => t.status === "open").length,
    in_progress: tickets.filter((t) => t.status === "in_progress").length,
    waiting_customer: tickets.filter((t) => t.status === "waiting_customer").length,
    resolved: tickets.filter((t) => t.status === "resolved").length,
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-2">All Support Tickets</h1>
      <p className="text-slate-400 text-sm mb-6">Manage customer service requests</p>

      {/* Filter tabs */}
      <div className="flex flex-wrap gap-2 mb-6">
        {[
          { key: "all", label: "All" },
          { key: "open", label: "Open" },
          { key: "in_progress", label: "In Progress" },
          { key: "waiting_customer", label: "Waiting" },
          { key: "resolved", label: "Resolved" },
        ].map((f) => (
          <button key={f.key} onClick={() => setFilter(f.key)}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors cursor-pointer ${filter === f.key ? "bg-blue-600 text-white" : "bg-slate-800 text-slate-400 hover:text-white"}`}>
            {f.label} ({counts[f.key as keyof typeof counts] ?? 0})
          </button>
        ))}
      </div>

      {sorted.length === 0 ? (
        <p className="text-slate-500 py-8 text-center">No tickets{filter !== "all" ? ` with status "${filter}"` : ""}.</p>
      ) : (
        <div className="space-y-3">
          {sorted.map((ticket) => (
            <Link key={ticket.id} href={`/tickets/${ticket.id}`}>
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 sm:p-5 hover:border-slate-700 transition-colors cursor-pointer mb-3">
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-2">
                  <Badge variant={priorityColors[ticket.priority]}>{ticket.priority}</Badge>
                  <Badge variant={statusColors[ticket.status]}>{ticket.status.replace("_", " ")}</Badge>
                  {ticket.errorCode && <Badge variant="error">{ticket.errorCode}</Badge>}
                  <span className="text-xs text-slate-500 sm:ml-auto">{new Date(ticket.updatedAt).toLocaleDateString()}</span>
                </div>
                <h3 className="font-semibold text-slate-100">{ticket.subject}</h3>
                <p className="text-sm text-slate-400 mt-1">
                  {ticket.customerCompany} — {ticket.machineName} (S/N: {ticket.machineSerial})
                </p>
                <p className="text-sm text-slate-500 mt-1">{ticket.messages.length} message{ticket.messages.length !== 1 ? "s" : ""}</p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
