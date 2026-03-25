import { NextRequest, NextResponse } from "next/server";
import { getTickets, getTicketsByCustomer, createTicket, getUserByUid } from "@/lib/local-db";
import { cookies } from "next/headers";

export async function GET() {
  const cookieStore = await cookies();
  const session = cookieStore.get("session");
  if (!session?.value) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

  const user = getUserByUid(session.value);
  if (!user) return NextResponse.json({ error: "User not found" }, { status: 401 });

  const tickets = user.role === "admin" ? getTickets() : getTicketsByCustomer(user.uid);
  return NextResponse.json(tickets);
}

export async function POST(req: NextRequest) {
  const cookieStore = await cookies();
  const session = cookieStore.get("session");
  if (!session?.value) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

  const data = await req.json();
  const ticket = createTicket(data);
  return NextResponse.json(ticket);
}
