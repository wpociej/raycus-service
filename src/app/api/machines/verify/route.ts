import { NextRequest, NextResponse } from "next/server";
import { verifyMachineById } from "@/lib/local-db";

export async function POST(req: NextRequest) {
  const { machineId } = await req.json();
  const success = verifyMachineById(machineId);
  if (!success) {
    return NextResponse.json({ error: "Machine not found" }, { status: 404 });
  }
  return NextResponse.json({ ok: true });
}
