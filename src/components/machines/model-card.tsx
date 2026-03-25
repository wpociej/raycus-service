import Link from "next/link";
import { MachineModel } from "@/lib/types";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export function ModelCard({ model }: { model: MachineModel }) {
  const isPulsed = ["QCW Fiber Laser", "Pulsed Fiber Laser", "MOPA Fiber Laser", "Q-Switched Fiber Laser"].includes(model.category);

  return (
    <Link href={`/catalog/${model.id}`}>
      <Card className="hover:border-slate-700 transition-colors cursor-pointer h-full">
        <CardContent className="pt-6">
          <div className="flex items-center gap-2 mb-3 flex-wrap">
            <Badge variant="default">{model.category}</Badge>
            <Badge variant={model.status === "in_production" ? "success" : "warning"}>
              {model.status === "in_production" ? "In Production" : "Discontinued"}
            </Badge>
          </div>
          <h3 className="text-lg font-bold text-slate-100">{model.name}</h3>
          <p className="text-sm text-slate-400 mt-1 line-clamp-2">{model.description}</p>
          <div className="grid grid-cols-2 gap-2 mt-4">
            <div className="bg-slate-800 rounded-lg p-3">
              <p className="text-xs text-slate-500 uppercase">
                {isPulsed ? "Avg Power" : "Power"}
              </p>
              <p className="text-sm font-semibold text-slate-200">
                {model.powerWatt >= 1000
                  ? `${(model.powerWatt / 1000).toFixed(model.powerWatt % 1000 === 0 ? 0 : 1)} kW`
                  : `${model.powerWatt} W`}
              </p>
            </div>
            <div className="bg-slate-800 rounded-lg p-3">
              <p className="text-xs text-slate-500 uppercase">Wavelength</p>
              <p className="text-sm font-semibold text-slate-200">{model.wavelength}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
