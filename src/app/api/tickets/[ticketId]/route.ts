import { NextResponse } from "next/server";
import { getTicketById } from "@/lib/local-db";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ ticketId: string }> }
) {
  const { ticketId } = await params;
  const ticket = getTicketById(ticketId);
  if (!ticket) return NextResponse.json({ error: "Ticket not found" }, { status: 404 });
  return NextResponse.json(ticket);
}
