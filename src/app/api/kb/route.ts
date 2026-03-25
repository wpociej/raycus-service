import { NextRequest, NextResponse } from "next/server";
import { getKBArticles, searchKBArticles } from "@/lib/local-db";

export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get("q");
  const articles = q ? searchKBArticles(q) : getKBArticles();
  return NextResponse.json(articles);
}
