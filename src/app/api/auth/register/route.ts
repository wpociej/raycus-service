import { NextRequest, NextResponse } from "next/server";
import { getUserByEmail, createUser } from "@/lib/local-db";
import { cookies } from "next/headers";

export async function POST(req: NextRequest) {
  const { email, password, displayName, company, phone } = await req.json();

  if (getUserByEmail(email)) {
    return NextResponse.json({ error: "Email already registered" }, { status: 400 });
  }

  const uid = `customer-${Date.now()}`;
  const user = createUser({
    uid,
    email,
    password,
    displayName,
    role: "customer",
    company,
    phone,
    createdAt: new Date(),
  });

  const cookieStore = await cookies();
  cookieStore.set("session", user.uid, {
    httpOnly: true,
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });

  const { password: _, ...profile } = user;
  return NextResponse.json({ profile });
}
