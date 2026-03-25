import { NextResponse } from "next/server";
import { getKBArticleBySlug } from "@/lib/local-db";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const article = getKBArticleBySlug(slug);
  if (!article) return NextResponse.json({ error: "Article not found" }, { status: 404 });
  return NextResponse.json(article);
}
