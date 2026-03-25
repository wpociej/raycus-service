import { ErrorCode } from "@/lib/types";
import { Badge } from "@/components/ui/badge";

export function ErrorCodeTable({ codes }: { codes: ErrorCode[] }) {
  if (codes.length === 0)
    return <p className="text-slate-500 text-sm">No error codes documented.</p>;

  return (
    <div className="bg-slate-800 rounded-lg overflow-hidden">
      <div className="grid grid-cols-[80px_1fr_1fr] gap-4 px-4 py-3 bg-slate-900 text-xs text-slate-500 uppercase font-semibold">
        <div>Code</div>
        <div>Description</div>
        <div>Solution</div>
      </div>
      {codes.map((ec) => (
        <div
          key={ec.code}
          className="grid grid-cols-[80px_1fr_1fr] gap-4 px-4 py-3 border-t border-slate-900 text-sm"
        >
          <div>
            <Badge variant={ec.severity === "error" ? "error" : "warning"}>
              {ec.code}
            </Badge>
          </div>
          <div className="text-slate-300">{ec.description}</div>
          <div className="text-slate-400">{ec.solution}</div>
        </div>
      ))}
    </div>
  );
}
