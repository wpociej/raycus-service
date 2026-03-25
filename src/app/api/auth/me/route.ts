import { NextResponse } from "next/server";
import { getUserByUid } from "@/lib/local-db";
import { cookies } from "next/headers";

export async function GET() {
  const cookieStore = await cookies();
  const session = cookieStore.get("session");

  if (!session?.value) {
    return NextResponse.json({ profile: null });
  }

  const user = getUserByUid(session.value);
  if (!user) {
    return NextResponse.json({ profile: null });
  }

  const { password: _, ...profile } = user;
  return NextResponse.json({ profile });
}
