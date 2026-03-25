"use client";

import { useAuth } from "@/lib/auth-context";
import { useEffect, useState } from "react";
import { Machine, Ticket } from "@/lib/types";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

function StatCard({ label, value, color, href }: { label: string; value: number; color: string; href?: string }) {
  const content = (
    <Card className={href ? "hover:border-slate-700 transition-colors cursor-pointer" : ""}>
      <CardContent className="pt-6">
        <p className="text-sm text-slate-400">{label}</p>
        <p className={`text-3xl font-bold mt-1 ${color}`}>{value}</p>
      </CardContent>
    </Card>
  );
  return href ? <Link href={href}>{content}</Link> : content;
}

const priorityColors: Record<string, "default" | "success" | "warning" | "error"> = {
  critical: "error", high: "warning", normal: "default", low: "default",
};

export default function DashboardPage() {
  const { profile } = useAuth();
  const [machines, setMachines] = useState<Machine[]>([]);
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [totalCustomers, setTotalCustomers] = useState(0);

  useEffect(() => {
    if (!profile) return;
    fetch("/api/machines").then((r) => r.json()).then(setMachines);
    fetch("/api/tickets").then((r) => r.json()).then(setTickets);
    if (profile.role === "admin") {
      fetch("/api/users").then((r) => r.json()).then((users) => setTotalCustomers(users.length));
    }
  }, [profile]);

  if (!profile) return null;

  const activeMachines = machines.filter((m) => m.status === "active").length;
  const pendingVerification = machines.filter((m) => !m.verifiedByAdmin).length;
  const openTickets = tickets.filter((t) => t.status === "open" || t.status === "in_progress").length;
  const criticalTickets = tickets.filter((t) => t.priority === "critical" && t.status !== "closed" && t.status !== "resolved").length;

  const recentTickets = [...tickets]
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    .slice(0, 5);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">
        {profile.role === "admin" ? "Admin Dashboard" : `Welcome back, ${profile.company}`}
      </h1>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard
          label={profile.role === "admin" ? "Total Machines" : "Active Machines"}
          value={profile.role === "admin" ? machines.length : activeMachines}
          color="text-blue-400"
          href={profile.role === "admin" ? "/admin/machines" : "/machines"}
        />
        <StatCard
          label="Open Tickets"
          value={openTickets}
          color={openTickets > 0 ? "text-amber-400" : "text-slate-500"}
          href={profile.role === "admin" ? "/admin/tickets" : "/tickets"}
        />
        {profile.role === "admin" ? (
          <>
            <StatCard label="Customers" value={totalCustomers} color="text-emerald-400" href="/admin/customers" />
            <StatCard label="Critical Tickets" value={criticalTickets} color={criticalTickets > 0 ? "text-red-400" : "text-slate-500"} href="/admin/tickets" />
          </>
        ) : (
          <>
            <StatCard label="In Maintenance" value={machines.filter((m) => m.status === "maintenance").length} color="text-amber-400" />
            <StatCard label="Pending Verification" value={pendingVerification} color={pendingVerification > 0 ? "text-red-400" : "text-slate-500"} />
          </>
        )}
      </div>

      {/* Recent tickets */}
      {recentTickets.length > 0 && (
        <div className="mb-8">
          <div className="flex justify-between items-center mb-3">
            <h2 className="text-lg font-semibold">Recent Tickets</h2>
            <Link href={profile.role === "admin" ? "/admin/tickets" : "/tickets"} className="text-blue-500 text-sm hover:underline">View all →</Link>
          </div>
          <div className="space-y-2">
            {recentTickets.map((ticket) => (
              <Link key={ticket.id} href={`/tickets/${ticket.id}`}>
                <div className="bg-slate-900 border border-slate-800 rounded-lg p-3 hover:border-slate-700 transition-colors cursor-pointer flex flex-col sm:flex-row sm:items-center gap-2 mb-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    <Badge variant={priorityColors[ticket.priority]}>{ticket.priority}</Badge>
                    <span className="font-medium text-sm text-slate-100">{ticket.subject}</span>
                  </div>
                  <span className="text-xs text-slate-500 sm:ml-auto">{ticket.messages.length} msg · {new Date(ticket.updatedAt).toLocaleDateString()}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Quick actions */}
      <div>
        <h2 className="text-lg font-semibold mb-3">Quick Actions</h2>
        <div className="flex flex-wrap gap-3">
          <Link href="/catalog" className="bg-slate-900 border border-slate-800 rounded-lg px-4 py-3 hover:border-slate-700 transition-colors text-sm text-slate-300">📖 Browse Catalog</Link>
          <Link href="/kb" className="bg-slate-900 border border-slate-800 rounded-lg px-4 py-3 hover:border-slate-700 transition-colors text-sm text-slate-300">📚 Knowledge Base</Link>
          {profile.role === "customer" && (
            <>
              <Link href="/machines/register" className="bg-slate-900 border border-slate-800 rounded-lg px-4 py-3 hover:border-slate-700 transition-colors text-sm text-slate-300">🔧 Register Machine</Link>
              <Link href="/tickets/new" className="bg-slate-900 border border-slate-800 rounded-lg px-4 py-3 hover:border-slate-700 transition-colors text-sm text-slate-300">🎫 Report Problem</Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
