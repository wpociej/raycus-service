"use client";

import { useEffect, useState } from "react";
import { Ticket } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Loading } from "@/components/ui/loading";
import Link from "next/link";

const statusColors: Record<string, "default" | "success" | "warning" | "error"> = {
  open: "error",
  in_progress: "warning",
  waiting_customer: "default",
  resolved: "success",
  closed: "default",
};

const priorityColors: Record<string, "default" | "success" | "warning" | "error"> = {
  critical: "error",
  high: "warning",
  normal: "default",
  low: "default",
};

export default function TicketsPage() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/tickets").then((r) => r.json()).then((data) => { setTickets(data); setLoading(false); });
  }, []);

  if (loading) return <Loading />;

  const sorted = [...tickets].sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Support Tickets</h1>
          <p className="text-slate-400 text-sm mt-1">Report problems with your machines</p>
        </div>
        <Link href="/tickets/new"><Button>+ New Ticket</Button></Link>
      </div>

      {sorted.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-slate-400 mb-4">No support tickets yet.</p>
          <Link href="/tickets/new"><Button>Create Your First Ticket</Button></Link>
        </div>
      ) : (
        <div className="space-y-3">
          {sorted.map((ticket) => (
            <Link key={ticket.id} href={`/tickets/${ticket.id}`}>
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 sm:p-5 hover:border-slate-700 transition-colors cursor-pointer mb-3">
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mb-2">
                  <Badge variant={priorityColors[ticket.priority]}>{ticket.priority}</Badge>
                  <Badge variant={statusColors[ticket.status]}>{ticket.status.replace("_", " ")}</Badge>
                  {ticket.errorCode && <Badge variant="error">{ticket.errorCode}</Badge>}
                  <span className="text-xs text-slate-500 sm:ml-auto">{new Date(ticket.updatedAt).toLocaleDateString()}</span>
                </div>
                <h3 className="font-semibold text-slate-100">{ticket.subject}</h3>
                <p className="text-sm text-slate-400 mt-1">{ticket.machineName} — S/N: {ticket.machineSerial}</p>
                <p className="text-sm text-slate-500 mt-1">{ticket.messages.length} message{ticket.messages.length !== 1 ? "s" : ""}</p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
