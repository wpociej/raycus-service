"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/lib/auth-context";
import { MachineModel } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function RegisterMachinePage() {
  const { profile } = useAuth();
  const router = useRouter();
  const [models, setModels] = useState<MachineModel[]>([]);
  const [form, setForm] = useState({ serialNumber: "", modelId: "", purchaseDate: "", warrantyYears: "2" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch("/api/models").then((r) => r.json()).then(setModels);
  }, []);

  function update(field: string, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!profile) return;
    setError("");
    setLoading(true);

    const selectedModel = models.find((m) => m.id === form.modelId);
    if (!selectedModel) { setError("Please select a model"); setLoading(false); return; }

    const purchaseDate = new Date(form.purchaseDate);
    const warrantyExpiry = new Date(purchaseDate);
    warrantyExpiry.setFullYear(warrantyExpiry.getFullYear() + parseInt(form.warrantyYears));

    try {
      const res = await fetch("/api/machines", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          serialNumber: form.serialNumber,
          modelId: form.modelId,
          modelName: selectedModel.name,
          ownerId: profile.uid,
          purchaseDate: purchaseDate.toISOString(),
          warrantyExpiry: warrantyExpiry.toISOString(),
          status: "active",
        }),
      });
      if (!res.ok) throw new Error("Registration failed");
      router.push("/machines");
    } catch { setError("Registration failed"); } finally { setLoading(false); }
  }

  return (
    <div className="p-6 max-w-lg">
      <Link href="/machines" className="text-blue-500 text-sm hover:underline mb-4 inline-block">← Back to My Machines</Link>
      <Card>
        <CardHeader>
          <h1 className="text-xl font-bold">Register a Machine</h1>
          <p className="text-sm text-slate-400">Enter your machine details to register it</p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && <p className="text-red-400 text-sm">{error}</p>}
            <div>
              <label className="block text-sm text-slate-400 mb-1">Serial Number</label>
              <Input value={form.serialNumber} onChange={(e) => update("serialNumber", e.target.value)} required placeholder="e.g. RY2024-06-1234" />
            </div>
            <div>
              <label className="block text-sm text-slate-400 mb-1">Model</label>
              <select value={form.modelId} onChange={(e) => update("modelId", e.target.value)} required className="w-full rounded-lg bg-slate-800 border border-slate-700 px-4 py-2 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="">Select a model...</option>
                {models.map((m) => (<option key={m.id} value={m.id}>{m.name} — {m.powerWatt}W</option>))}
              </select>
            </div>
            <div>
              <label className="block text-sm text-slate-400 mb-1">Purchase Date</label>
              <Input type="date" value={form.purchaseDate} onChange={(e) => update("purchaseDate", e.target.value)} required />
            </div>
            <div>
              <label className="block text-sm text-slate-400 mb-1">Warranty Period</label>
              <select value={form.warrantyYears} onChange={(e) => update("warrantyYears", e.target.value)} className="w-full rounded-lg bg-slate-800 border border-slate-700 px-4 py-2 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="1">1 Year</option>
                <option value="2">2 Years</option>
                <option value="3">3 Years</option>
              </select>
            </div>
            <Button type="submit" disabled={loading} className="w-full">{loading ? "Registering..." : "Register Machine"}</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
