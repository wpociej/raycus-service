"use client";

import { useEffect, useState } from "react";
import { use } from "react";
import { MachineModel } from "@/lib/types";
import { ErrorCodeTable } from "@/components/machines/error-code-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Loading } from "@/components/ui/loading";
import Link from "next/link";

export default function ModelDetailPage({ params }: { params: Promise<{ modelId: string }> }) {
  const { modelId } = use(params);
  const [model, setModel] = useState<MachineModel | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/models/${modelId}`).then((r) => r.json()).then((data) => {
      setModel(data.error ? null : data);
      setLoading(false);
    });
  }, [modelId]);

  if (loading) return <Loading />;
  if (!model) return <p className="p-6 text-slate-400">Model not found.</p>;

  return (
    <div className="p-6">
      <Link href="/catalog" className="text-blue-500 text-sm hover:underline mb-4 inline-block">← Back to Catalog</Link>
      <div className="flex flex-col lg:flex-row gap-6">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-3">
            <Badge>CW Fiber Laser</Badge>
            <Badge variant={model.status === "in_production" ? "success" : "warning"}>
              {model.status === "in_production" ? "In Production" : "Discontinued"}
            </Badge>
          </div>
          <h1 className="text-3xl font-bold">{model.name}</h1>
          <p className="text-slate-400 mt-1">{model.description}</p>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-6">
            {Object.entries(model.specs).map(([key, value]) => (
              <div key={key} className="bg-slate-800 rounded-lg p-4">
                <p className="text-xs text-slate-500 uppercase">{key.replace(/([A-Z])/g, " $1").trim()}</p>
                <p className="text-lg font-semibold text-slate-100 mt-1">{value}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="w-full lg:w-72 lg:flex-shrink-0 space-y-4">
          <Card>
            <CardContent className="pt-6">
              <h3 className="font-semibold mb-3">Documents</h3>
              {!model.manualUrls || model.manualUrls.length === 0 ? (
                <p className="text-sm text-slate-500">No documents uploaded yet.</p>
              ) : (
                <div className="space-y-2">
                  {model.manualUrls.map((url, i) => (
                    <a key={i} href={url} target="_blank" rel="noopener noreferrer" className="flex justify-between items-center py-2 border-b border-slate-800 last:border-0">
                      <span className="text-sm text-slate-300">Document {i + 1}</span>
                      <span className="text-blue-500 text-xs">↓ PDF</span>
                    </a>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6 space-y-2">
              <h3 className="font-semibold mb-3">Quick Actions</h3>
              <Link href="/machines/register"><Button className="w-full">Register This Model</Button></Link>
            </CardContent>
          </Card>
        </div>
      </div>
      <div className="mt-8">
        <h2 className="text-xl font-bold mb-4">Error Code Reference</h2>
        <ErrorCodeTable codes={model.errorCodes || []} />
      </div>
    </div>
  );
}
