import { NextRequest, NextResponse } from "next/server";
import { getUserByEmail } from "@/lib/local-db";
import { cookies } from "next/headers";

export async function POST(req: NextRequest) {
  const { email, password } = await req.json();
  const user = getUserByEmail(email);

  if (!user || user.password !== password) {
    return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
  }

  const cookieStore = await cookies();
  cookieStore.set("session", user.uid, {
    httpOnly: true,
    path: "/",
    maxAge: 60 * 60 * 24 * 7, // 1 week
  });

  const { password: _, ...profile } = user;
  return NextResponse.json({ profile });
}
