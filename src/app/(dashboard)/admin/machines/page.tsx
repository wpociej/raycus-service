"use client";

import { useEffect, useState } from "react";
import { Machine } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Loading } from "@/components/ui/loading";

export default function AdminMachinesPage() {
  const [machines, setMachines] = useState<Machine[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { loadMachines(); }, []);

  async function loadMachines() {
    const data = await fetch("/api/machines").then((r) => r.json());
    setMachines(data);
    setLoading(false);
  }

  async function handleVerify(machineId: string) {
    await fetch("/api/machines/verify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ machineId }),
    });
    loadMachines();
  }

  if (loading) return <Loading />;

  const pending = machines.filter((m) => !m.verifiedByAdmin);
  const verified = machines.filter((m) => m.verifiedByAdmin);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">All Machines ({machines.length})</h1>
      {pending.length > 0 && (
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-amber-400 mb-3">Pending Verification ({pending.length})</h2>
          <div className="space-y-2">
            {pending.map((m) => (
              <div key={m.id} className="bg-slate-900 border border-amber-500/30 rounded-lg px-4 sm:px-6 py-4 flex flex-col sm:flex-row sm:items-center gap-3 sm:justify-between">
                <div className="min-w-0">
                  <span className="font-semibold text-slate-100 block sm:inline">{m.modelName}</span>
                  <span className="text-slate-500 sm:ml-3 block sm:inline text-sm">S/N: {m.serialNumber}</span>
                </div>
                <Button size="sm" className="self-start sm:self-center shrink-0" onClick={() => handleVerify(m.id)}>Verify</Button>
              </div>
            ))}
          </div>
        </div>
      )}
      {/* Mobile card layout */}
      <div className="md:hidden space-y-3">
        {verified.map((m) => (
          <div key={m.id} className="bg-slate-900 border border-slate-800 rounded-lg p-4 space-y-2">
            <div className="font-semibold text-slate-100">{m.modelName}</div>
            <div className="text-sm text-slate-400">S/N: {m.serialNumber}</div>
            <div className="flex gap-2">
              <Badge variant={m.status === "active" ? "success" : "warning"}>{m.status}</Badge>
              <Badge variant="success">Verified</Badge>
            </div>
          </div>
        ))}
      </div>

      {/* Desktop table layout */}
      <div className="hidden md:block bg-slate-900 rounded-xl border border-slate-800 overflow-hidden">
        <div className="grid grid-cols-[1fr_1fr_120px_120px] gap-4 px-6 py-3 bg-slate-800/50 text-xs text-slate-500 uppercase font-semibold">
          <div>Model</div><div>Serial Number</div><div>Status</div><div>Verified</div>
        </div>
        {verified.map((m) => (
          <div key={m.id} className="grid grid-cols-[1fr_1fr_120px_120px] gap-4 px-6 py-4 border-t border-slate-800 text-sm">
            <div className="text-slate-100">{m.modelName}</div>
            <div className="text-slate-400">{m.serialNumber}</div>
            <div><Badge variant={m.status === "active" ? "success" : "warning"}>{m.status}</Badge></div>
            <div><Badge variant="success">Verified</Badge></div>
          </div>
        ))}
      </div>
    </div>
  );
}
