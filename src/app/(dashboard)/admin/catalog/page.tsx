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
      {/* Mobile card layout */}
      <div className="md:hidden space-y-3">
        {models.map((m) => (
          <div key={m.id} className="bg-slate-900 border border-slate-800 rounded-lg p-4 space-y-2">
            <div className="font-semibold text-slate-100">{m.name}</div>
            <div className="flex flex-wrap gap-2 text-sm">
              <span className="text-slate-400">{m.powerWatt}W</span>
              <span className="text-slate-600">|</span>
              <span className="text-slate-400">{m.wavelength}</span>
              <span className="text-slate-600">|</span>
              <span className="text-slate-400">{m.errorCodes?.length || 0} errors</span>
            </div>
            <div>
              <Badge variant={m.status === "in_production" ? "success" : "warning"}>{m.status === "in_production" ? "Active" : "EOL"}</Badge>
            </div>
          </div>
        ))}
      </div>

      {/* Desktop table layout */}
      <div className="hidden md:block bg-slate-900 rounded-xl border border-slate-800 overflow-hidden">
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
