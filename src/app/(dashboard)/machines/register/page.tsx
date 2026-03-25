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
  const [form, setForm] = useState({ serialNumber: "", modelId: "", purchaseDate: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch("/api/models").then((r) => r.json()).then(setModels);
  }, []);

  const selectedModel = models.find((m) => m.id === form.modelId);
  const warrantyYears = selectedModel?.warrantyYears ?? 2;

  function update(field: string, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!profile || !selectedModel) return;
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/machines", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          serialNumber: form.serialNumber,
          modelId: form.modelId,
          modelName: selectedModel.name,
          ownerId: profile.uid,
          purchaseDate: new Date(form.purchaseDate).toISOString(),
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
          <p className="text-sm text-slate-400">Enter your machine details — warranty is calculated automatically</p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && <p className="text-red-400 text-sm">{error}</p>}
            <div>
              <label className="block text-sm text-slate-400 mb-1">Serial Number *</label>
              <Input value={form.serialNumber} onChange={(e) => update("serialNumber", e.target.value)} required placeholder="e.g. RY2024-06-1234" />
            </div>
            <div>
              <label className="block text-sm text-slate-400 mb-1">Model *</label>
              <select value={form.modelId} onChange={(e) => update("modelId", e.target.value)} required className="w-full rounded-lg bg-slate-800 border border-slate-700 px-4 py-2 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="">Select a model...</option>
                {models.map((m) => (
                  <option key={m.id} value={m.id}>{m.name} — {m.powerWatt >= 1000 ? `${m.powerWatt / 1000}kW` : `${m.powerWatt}W`}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm text-slate-400 mb-1">Purchase Date *</label>
              <Input type="date" value={form.purchaseDate} onChange={(e) => update("purchaseDate", e.target.value)} required />
            </div>

            {selectedModel && form.purchaseDate && (
              <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
                <p className="text-sm text-slate-300">
                  <span className="text-slate-500">Warranty:</span>{" "}
                  <strong className="text-emerald-400">{warrantyYears} years</strong>{" "}
                  (auto-calculated for {selectedModel.name})
                </p>
                <p className="text-sm text-slate-300 mt-1">
                  <span className="text-slate-500">Expires:</span>{" "}
                  {(() => {
                    const d = new Date(form.purchaseDate);
                    d.setFullYear(d.getFullYear() + warrantyYears);
                    return d.toLocaleDateString();
                  })()}
                </p>
              </div>
            )}

            <Button type="submit" disabled={loading || !selectedModel} className="w-full">{loading ? "Registering..." : "Register Machine"}</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
