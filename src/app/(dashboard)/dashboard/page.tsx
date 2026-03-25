"use client";

import { useAuth } from "@/lib/auth-context";
import { useEffect, useState } from "react";
import { Machine } from "@/lib/types";
import { Card, CardContent } from "@/components/ui/card";

function StatCard({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <Card>
      <CardContent className="pt-6">
        <p className="text-sm text-slate-400">{label}</p>
        <p className={`text-3xl font-bold mt-1 ${color}`}>{value}</p>
      </CardContent>
    </Card>
  );
}

export default function DashboardPage() {
  const { profile } = useAuth();
  const [machines, setMachines] = useState<Machine[]>([]);
  const [totalCustomers, setTotalCustomers] = useState(0);

  useEffect(() => {
    if (!profile) return;
    fetch("/api/machines").then((r) => r.json()).then(setMachines);
    if (profile.role === "admin") {
      fetch("/api/users").then((r) => r.json()).then((users) => setTotalCustomers(users.length));
    }
  }, [profile]);

  if (!profile) return null;

  const activeMachines = machines.filter((m) => m.status === "active").length;
  const pendingVerification = machines.filter((m) => !m.verifiedByAdmin).length;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">
        {profile.role === "admin" ? "Admin Dashboard" : `Welcome back, ${profile.company}`}
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <StatCard label={profile.role === "admin" ? "Total Machines" : "Active Machines"} value={profile.role === "admin" ? machines.length : activeMachines} color="text-blue-400" />
        <StatCard label={profile.role === "admin" ? "Customers" : "In Maintenance"} value={profile.role === "admin" ? totalCustomers : machines.filter((m) => m.status === "maintenance").length} color="text-amber-400" />
        <StatCard label="Pending Verification" value={pendingVerification} color="text-red-400" />
      </div>
    </div>
  );
}
