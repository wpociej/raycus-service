"use client";

import { useEffect, useState } from "react";
import { MachineModel } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loading } from "@/components/ui/loading";
import Link from "next/link";

export default function AdminCatalogPage() {
  const [models, setModels] = useState<MachineModel[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/models").then((r) => r.json()).then((data) => { setModels(data); setLoading(false); });
  }, []);

  if (loading) return <Loading />;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Manage Catalog</h1>
        <Link href="/admin/catalog/new"><Button>+ Add Model</Button></Link>
      </div>
      <div className="bg-slate-900 rounded-xl border border-slate-800 overflow-hidden">
        <div className="grid grid-cols-[1fr_100px_100px_100px_80px] gap-4 px-6 py-3 bg-slate-800/50 text-xs text-slate-500 uppercase font-semibold">
          <div>Model</div><div>Power</div><div>Wavelength</div><div>Status</div><div>Errors</div>
        </div>
        {models.map((m) => (
          <div key={m.id} className="grid grid-cols-[1fr_100px_100px_100px_80px] gap-4 px-6 py-4 border-t border-slate-800 text-sm">
            <div className="text-slate-100 font-semibold">{m.name}</div>
            <div className="text-slate-400">{m.powerWatt}W</div>
            <div className="text-slate-400">{m.wavelength}</div>
            <div><Badge variant={m.status === "in_production" ? "success" : "warning"}>{m.status === "in_production" ? "Active" : "EOL"}</Badge></div>
            <div className="text-slate-400">{m.errorCodes?.length || 0}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
