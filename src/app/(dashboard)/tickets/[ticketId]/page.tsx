"use client";

import { useEffect, useState } from "react";
import { use } from "react";
import { useAuth } from "@/lib/auth-context";
import { Ticket, TicketStatus } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Loading } from "@/components/ui/loading";
import Link from "next/link";

const statusColors: Record<string, "default" | "success" | "warning" | "error"> = {
  open: "error", in_progress: "warning", waiting_customer: "default", resolved: "success", closed: "default",
};

const statusOptions: { value: TicketStatus; label: string }[] = [
  { value: "open", label: "Open" },
  { value: "in_progress", label: "In Progress" },
  { value: "waiting_customer", label: "Waiting on Customer" },
  { value: "resolved", label: "Resolved" },
  { value: "closed", label: "Closed" },
];

export default function TicketDetailPage({ params }: { params: Promise<{ ticketId: string }> }) {
  const { ticketId } = use(params);
  const { profile } = useAuth();
  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);

  function loadTicket() {
    fetch(`/api/tickets/${ticketId}`).then((r) => r.json()).then((data) => {
      setTicket(data.error ? null : data);
      setLoading(false);
    });
  }

  useEffect(() => { loadTicket(); }, [ticketId]);

  async function sendMessage(e: React.FormEvent) {
    e.preventDefault();
    if (!profile || !message.trim()) return;
    setSending(true);
    await fetch(`/api/tickets/${ticketId}/messages`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ authorId: profile.uid, authorName: profile.displayName, authorRole: profile.role, text: message }),
    });
    setMessage("");
    setSending(false);
    loadTicket();
  }

  async function changeStatus(status: TicketStatus) {
    await fetch(`/api/tickets/${ticketId}/status`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    loadTicket();
  }

  if (loading) return <Loading />;
  if (!ticket) return <p className="p-6 text-slate-400">Ticket not found.</p>;

  return (
    <div className="p-6 max-w-4xl">
      <Link href={profile?.role === "admin" ? "/admin/tickets" : "/tickets"} className="text-blue-500 text-sm hover:underline mb-4 inline-block">← Back to Tickets</Link>

      {/* Ticket header */}
      <div className="mb-6">
        <div className="flex flex-wrap gap-2 mb-2">
          <Badge variant={statusColors[ticket.status]}>{ticket.status.replace("_", " ")}</Badge>
          <Badge variant={ticket.priority === "critical" ? "error" : ticket.priority === "high" ? "warning" : "default"}>{ticket.priority}</Badge>
          {ticket.errorCode && <Badge variant="error">{ticket.errorCode}</Badge>}
        </div>
        <h1 className="text-2xl font-bold">{ticket.subject}</h1>
        <p className="text-sm text-slate-400 mt-1">
          {ticket.machineName} — S/N: {ticket.machineSerial} | By {ticket.customerName} ({ticket.customerCompany})
        </p>
        <p className="text-xs text-slate-500 mt-1">Created {new Date(ticket.createdAt).toLocaleString()}</p>
      </div>

      {/* Admin status controls */}
      {profile?.role === "admin" && (
        <Card className="mb-6">
          <CardContent className="pt-4 pb-4">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-sm text-slate-400">Change status:</span>
              {statusOptions.map((opt) => (
                <button key={opt.value} onClick={() => changeStatus(opt.value)}
                  className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors cursor-pointer ${ticket.status === opt.value ? "bg-blue-600 text-white" : "bg-slate-800 text-slate-400 hover:text-white"}`}>
                  {opt.label}
                </button>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Description */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <h3 className="font-semibold mb-2 text-slate-300">Problem Description</h3>
          <p className="text-slate-300 whitespace-pre-wrap leading-relaxed">{ticket.description}</p>
        </CardContent>
      </Card>

      {/* Messages */}
      <h3 className="font-semibold mb-3 text-slate-200">Conversation ({ticket.messages.length})</h3>
      <div className="space-y-3 mb-6">
        {ticket.messages.map((msg) => (
          <div key={msg.id} className={`rounded-xl p-4 ${msg.authorRole === "admin" ? "bg-blue-500/10 border border-blue-500/20" : "bg-slate-900 border border-slate-800"}`}>
            <div className="flex items-center gap-2 mb-2">
              <span className="font-semibold text-sm text-slate-100">{msg.authorName}</span>
              <Badge variant={msg.authorRole === "admin" ? "success" : "default"}>{msg.authorRole}</Badge>
              <span className="text-xs text-slate-500 ml-auto">{new Date(msg.createdAt).toLocaleString()}</span>
            </div>
            <p className="text-sm text-slate-300 whitespace-pre-wrap leading-relaxed">{msg.text}</p>
          </div>
        ))}
        {ticket.messages.length === 0 && <p className="text-slate-500 text-sm py-4">No messages yet.</p>}
      </div>

      {/* Reply form */}
      {ticket.status !== "closed" && (
        <form onSubmit={sendMessage}>
          <textarea value={message} onChange={(e) => setMessage(e.target.value)} required
            placeholder={profile?.role === "admin" ? "Reply to customer..." : "Add more details or respond..."}
            className="w-full rounded-lg bg-slate-800 border border-slate-700 px-4 py-3 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[100px] resize-y mb-3" />
          <Button type="submit" disabled={sending}>{sending ? "Sending..." : "Send Message"}</Button>
        </form>
      )}
    </div>
  );
}
