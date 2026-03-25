"use client";

import { useEffect, useState } from "react";
import { KBArticle } from "@/lib/types";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Loading } from "@/components/ui/loading";
import Link from "next/link";

export default function KBPage() {
  const [articles, setArticles] = useState<KBArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const q = search ? `?q=${encodeURIComponent(search)}` : "";
    fetch(`/api/kb${q}`).then((r) => r.json()).then((data) => { setArticles(data); setLoading(false); });
  }, [search]);

  const categories = [...new Set(articles.map((a) => a.category))];

  if (loading) return <Loading />;

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">Knowledge Base</h1>
        <p className="text-slate-400 mb-4">Guides, troubleshooting, and best practices for Raycus fiber lasers</p>
        <Input
          placeholder="Search articles... (e.g. 'back-reflection', 'cooling', 'MOPA')"
          value={search}
          onChange={(e) => { setSearch(e.target.value); setLoading(true); }}
          className="max-w-md"
        />
      </div>

      {articles.length === 0 ? (
        <p className="text-slate-500 py-8 text-center">No articles found{search ? ` for "${search}"` : ""}.</p>
      ) : (
        categories.map((cat) => (
          <div key={cat} className="mb-8">
            <h2 className="text-lg font-semibold text-slate-200 mb-3">{cat}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {articles.filter((a) => a.category === cat).map((article) => (
                <Link key={article.id} href={`/kb/${article.slug}`}>
                  <Card className="hover:border-slate-700 transition-colors cursor-pointer h-full">
                    <CardContent className="pt-6">
                      <h3 className="font-semibold text-slate-100 mb-2">{article.title}</h3>
                      <div className="flex flex-wrap gap-1 mb-3">
                        {article.tags.slice(0, 4).map((tag) => (
                          <Badge key={tag} variant="default">{tag}</Badge>
                        ))}
                        {article.tags.length > 4 && <Badge variant="default">+{article.tags.length - 4}</Badge>}
                      </div>
                      <p className="text-sm text-slate-400 line-clamp-2">
                        {article.content.replace(/[#*|`\[\]\-]/g, "").substring(0, 150)}...
                      </p>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        ))
      )}
    </div>
  );
}
