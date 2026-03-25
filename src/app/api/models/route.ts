import { NextRequest, NextResponse } from "next/server";
import { getMachineModels, addMachineModel } from "@/lib/local-db";

export async function GET() {
  const models = getMachineModels();
  return NextResponse.json(models);
}

export async function POST(req: NextRequest) {
  const data = await req.json();
  const model = addMachineModel(data);
  return NextResponse.json(model);
}
