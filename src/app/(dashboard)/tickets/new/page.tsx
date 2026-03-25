"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/lib/auth-context";
import { Machine, MachineModel } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function NewTicketPage() {
  const { profile } = useAuth();
  const router = useRouter();
  const [machines, setMachines] = useState<Machine[]>([]);
  const [models, setModels] = useState<MachineModel[]>([]);
  const [form, setForm] = useState({ machineId: "", subject: "", description: "", errorCode: "", priority: "normal" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch("/api/machines").then((r) => r.json()).then(setMachines);
    fetch("/api/models").then((r) => r.json()).then(setModels);
  }, []);

  const selectedMachine = machines.find((m) => m.id === form.machineId);
  const selectedModel = selectedMachine ? models.find((m) => m.id === selectedMachine.modelId) : null;
  const errorCodes = selectedModel?.errorCodes || [];

  function update(field: string, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!profile || !selectedMachine) return;
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/tickets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          subject: form.subject,
          description: form.description,
          machineId: selectedMachine.id,
          machineName: selectedMachine.modelName,
          machineSerial: selectedMachine.serialNumber,
          errorCode: form.errorCode || undefined,
          customerId: profile.uid,
          customerName: profile.displayName,
          customerCompany: profile.company,
          priority: form.priority,
          status: "open",
        }),
      });
      if (!res.ok) throw new Error("Failed to create ticket");
      router.push("/tickets");
    } catch { setError("Failed to create ticket"); } finally { setLoading(false); }
  }

  return (
    <div className="p-6 max-w-2xl">
      <Link href="/tickets" className="text-blue-500 text-sm hover:underline mb-4 inline-block">← Back to Tickets</Link>
      <Card>
        <CardHeader>
          <h1 className="text-xl font-bold">Report a Problem</h1>
          <p className="text-sm text-slate-400">Describe the issue with your machine</p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && <p className="text-red-400 text-sm">{error}</p>}

            <div>
              <label className="block text-sm text-slate-400 mb-1">Machine *</label>
              <select value={form.machineId} onChange={(e) => update("machineId", e.target.value)} required className="w-full rounded-lg bg-slate-800 border border-slate-700 px-4 py-2 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="">Select a machine...</option>
                {machines.map((m) => (
                  <option key={m.id} value={m.id}>{m.modelName} — S/N: {m.serialNumber}</option>
                ))}
              </select>
            </div>

            {errorCodes.length > 0 && (
              <div>
                <label className="block text-sm text-slate-400 mb-1">Error Code (if applicable)</label>
                <select value={form.errorCode} onChange={(e) => update("errorCode", e.target.value)} className="w-full rounded-lg bg-slate-800 border border-slate-700 px-4 py-2 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option value="">No specific error code</option>
                  {errorCodes.map((ec) => (
                    <option key={ec.code} value={ec.code}>{ec.code} — {ec.description}</option>
                  ))}
                </select>
              </div>
            )}

            <div>
              <label className="block text-sm text-slate-400 mb-1">Priority *</label>
              <select value={form.priority} onChange={(e) => update("priority", e.target.value)} className="w-full rounded-lg bg-slate-800 border border-slate-700 px-4 py-2 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="low">Low — Minor issue, not urgent</option>
                <option value="normal">Normal — Standard service request</option>
                <option value="high">High — Production affected</option>
                <option value="critical">Critical — Production stopped</option>
              </select>
            </div>

            <div>
              <label className="block text-sm text-slate-400 mb-1">Subject *</label>
              <Input value={form.subject} onChange={(e) => update("subject", e.target.value)} required placeholder="Brief summary of the problem" />
            </div>

            <div>
              <label className="block text-sm text-slate-400 mb-1">Description *</label>
              <textarea value={form.description} onChange={(e) => update("description", e.target.value)} required placeholder="Describe the problem in detail. Include: what happened, when it started, what you've tried so far..." className="w-full rounded-lg bg-slate-800 border border-slate-700 px-4 py-3 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[120px] resize-y" />
            </div>

            <Button type="submit" disabled={loading} className="w-full">{loading ? "Submitting..." : "Submit Ticket"}</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
