import { NextRequest, NextResponse } from "next/server";
import { updateTicketStatus } from "@/lib/local-db";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ ticketId: string }> }
) {
  const { ticketId } = await params;
  const { status } = await req.json();
  const ok = updateTicketStatus(ticketId, status);
  if (!ok) return NextResponse.json({ error: "Ticket not found" }, { status: 404 });
  return NextResponse.json({ ok: true });
}
