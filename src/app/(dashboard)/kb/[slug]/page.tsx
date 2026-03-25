"use client";

import { useEffect, useState } from "react";
import { use } from "react";
import { KBArticle } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { Loading } from "@/components/ui/loading";
import Link from "next/link";

function renderMarkdown(content: string) {
  // Simple markdown renderer
  const lines = content.split("\n");
  const elements: React.ReactNode[] = [];
  let inTable = false;
  let tableRows: string[][] = [];

  function flushTable() {
    if (tableRows.length > 0) {
      elements.push(
        <div key={`table-${elements.length}`} className="overflow-x-auto my-4">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-700">
                {tableRows[0].map((cell, i) => (
                  <th key={i} className="text-left py-2 px-3 text-slate-400 font-semibold">{cell.trim()}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {tableRows.slice(2).map((row, ri) => (
                <tr key={ri} className="border-b border-slate-800">
                  {row.map((cell, ci) => (
                    <td key={ci} className="py-2 px-3 text-slate-300">{cell.trim()}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
      tableRows = [];
    }
  }

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (line.startsWith("|")) {
      inTable = true;
      tableRows.push(line.split("|").filter(Boolean));
      continue;
    }
    if (inTable) { flushTable(); inTable = false; }

    if (line.startsWith("## ")) {
      elements.push(<h2 key={i} className="text-xl font-bold text-slate-100 mt-8 mb-3">{line.slice(3)}</h2>);
    } else if (line.startsWith("### ")) {
      elements.push(<h3 key={i} className="text-lg font-semibold text-slate-200 mt-6 mb-2">{line.slice(4)}</h3>);
    } else if (line.startsWith("- **")) {
      const match = line.match(/- \*\*(.+?)\*\*:?\s*(.*)/);
      if (match) {
        elements.push(<li key={i} className="ml-4 mb-1 text-slate-300 list-disc"><strong className="text-slate-100">{match[1]}</strong>{match[2] ? `: ${match[2]}` : ""}</li>);
      }
    } else if (line.startsWith("- ")) {
      elements.push(<li key={i} className="ml-4 mb-1 text-slate-300 list-disc">{line.slice(2)}</li>);
    } else if (line.match(/^\d+\.\s/)) {
      elements.push(<li key={i} className="ml-4 mb-1 text-slate-300 list-decimal">{line.replace(/^\d+\.\s/, "")}</li>);
    } else if (line.startsWith("**") && line.endsWith("**")) {
      elements.push(<p key={i} className="font-semibold text-slate-200 mt-3 mb-1">{line.replace(/\*\*/g, "")}</p>);
    } else if (line.startsWith("*") && line.endsWith("*")) {
      elements.push(<p key={i} className="text-slate-400 italic text-sm mb-2">{line.replace(/\*/g, "")}</p>);
    } else if (line.trim() === "") {
      // skip
    } else {
      elements.push(<p key={i} className="text-slate-300 mb-2 leading-relaxed">{line}</p>);
    }
  }
  flushTable();
  return elements;
}

export default function KBArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const [article, setArticle] = useState<KBArticle | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/kb/${slug}`).then((r) => r.json()).then((data) => {
      setArticle(data.error ? null : data);
      setLoading(false);
    });
  }, [slug]);

  if (loading) return <Loading />;
  if (!article) return <p className="p-6 text-slate-400">Article not found.</p>;

  return (
    <div className="p-6 max-w-4xl">
      <Link href="/kb" className="text-blue-500 text-sm hover:underline mb-4 inline-block">← Back to Knowledge Base</Link>
      <div className="mb-4">
        <Badge>{article.category}</Badge>
      </div>
      <h1 className="text-3xl font-bold mb-3">{article.title}</h1>
      <div className="flex flex-wrap gap-1 mb-6">
        {article.tags.map((tag) => (<Badge key={tag} variant="default">{tag}</Badge>))}
      </div>
      <div className="prose prose-invert max-w-none">
        {renderMarkdown(article.content)}
      </div>
    </div>
  );
}
