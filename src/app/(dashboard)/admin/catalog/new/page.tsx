"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function NewModelPage() {
  const router = useRouter();
  const [form, setForm] = useState({ name: "", series: "", powerWatt: "", wavelength: "1080 ± 5 nm", description: "" });
  const [loading, setLoading] = useState(false);

  function update(field: string, value: string) { setForm((prev) => ({ ...prev, [field]: value })); }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    await fetch("/api/models", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: form.name, series: form.series, powerWatt: parseInt(form.powerWatt),
        wavelength: form.wavelength, description: form.description,
        specs: { outputPower: `${form.powerWatt} W`, wavelength: form.wavelength },
        manualUrls: [], errorCodes: [], status: "in_production",
      }),
    });
    router.push("/admin/catalog");
  }

  return (
    <div className="p-6 max-w-lg">
      <Link href="/admin/catalog" className="text-blue-500 text-sm hover:underline mb-4 inline-block">← Back to Manage Catalog</Link>
      <Card>
        <CardHeader><h1 className="text-xl font-bold">Add New Model</h1></CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div><label className="block text-sm text-slate-400 mb-1">Model Name</label><Input value={form.name} onChange={(e) => update("name", e.target.value)} required placeholder="e.g. RFL-C3000" /></div>
            <div><label className="block text-sm text-slate-400 mb-1">Series</label><Input value={form.series} onChange={(e) => update("series", e.target.value)} required placeholder="e.g. RFL-C" /></div>
            <div><label className="block text-sm text-slate-400 mb-1">Power (Watts)</label><Input type="number" value={form.powerWatt} onChange={(e) => update("powerWatt", e.target.value)} required placeholder="e.g. 3000" /></div>
            <div><label className="block text-sm text-slate-400 mb-1">Wavelength</label><Input value={form.wavelength} onChange={(e) => update("wavelength", e.target.value)} required /></div>
            <div><label className="block text-sm text-slate-400 mb-1">Description</label><Input value={form.description} onChange={(e) => update("description", e.target.value)} placeholder="Brief description" /></div>
            <Button type="submit" disabled={loading} className="w-full">{loading ? "Creating..." : "Add Model"}</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
