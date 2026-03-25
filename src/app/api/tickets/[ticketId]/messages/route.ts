import { NextRequest, NextResponse } from "next/server";
import { addTicketMessage } from "@/lib/local-db";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ ticketId: string }> }
) {
  const { ticketId } = await params;
  const data = await req.json();
  const msg = addTicketMessage(ticketId, data);
  if (!msg) return NextResponse.json({ error: "Ticket not found" }, { status: 404 });
  return NextResponse.json(msg);
}
