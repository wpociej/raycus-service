import { NextResponse } from "next/server";
import { getMachineModelById } from "@/lib/local-db";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ modelId: string }> }
) {
  const { modelId } = await params;
  const model = getMachineModelById(modelId);
  if (!model) {
    return NextResponse.json({ error: "Model not found" }, { status: 404 });
  }
  return NextResponse.json(model);
}
