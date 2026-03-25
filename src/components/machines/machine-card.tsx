import { Machine } from "@/lib/types";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const statusColors: Record<string, string> = {
  active: "border-l-emerald-500",
  maintenance: "border-l-amber-500",
  decommissioned: "border-l-slate-600",
};

const statusBadge: Record<string, "success" | "warning" | "default"> = {
  active: "success",
  maintenance: "warning",
  decommissioned: "default",
};

export function MachineCard({ machine }: { machine: Machine }) {
  const warrantyValid =
    machine.warrantyExpiry &&
    new Date(machine.warrantyExpiry) > new Date();

  return (
    <Card className={`border-l-4 ${statusColors[machine.status]}`}>
      <CardContent className="pt-6">
        <div className="flex justify-between items-center mb-2">
          <h3 className="font-bold text-slate-100">{machine.modelName}</h3>
          <Badge variant={statusBadge[machine.status]}>
            {machine.status}
          </Badge>
        </div>
        <p className="text-xs text-slate-500">S/N: {machine.serialNumber}</p>
        <p className="text-xs text-slate-500">
          Purchased:{" "}
          {machine.purchaseDate
            ? new Date(machine.purchaseDate).toLocaleDateString()
            : "N/A"}
        </p>
        {machine.warrantyExpiry && (
          <p
            className={`text-xs mt-2 ${warrantyValid ? "text-emerald-400" : "text-red-400"}`}
          >
            Warranty: {warrantyValid ? "Valid" : "Expired"} until{" "}
            {new Date(machine.warrantyExpiry).toLocaleDateString()}
          </p>
        )}
        {!machine.verifiedByAdmin && (
          <Badge variant="warning" className="mt-2">
            Pending Verification
          </Badge>
        )}
      </CardContent>
    </Card>
  );
}
