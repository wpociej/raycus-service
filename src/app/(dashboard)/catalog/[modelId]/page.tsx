"use client";

import { useEffect, useState } from "react";
import { use } from "react";
import { useI18n } from "@/lib/i18n";
import { MachineModel, KBArticle } from "@/lib/types";
import { ErrorCodeTable } from "@/components/machines/error-code-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Loading } from "@/components/ui/loading";
import Link from "next/link";

type Tab = "specs" | "documents" | "errors" | "kb";

export default function ModelDetailPage({ params }: { params: Promise<{ modelId: string }> }) {
  const { modelId } = use(params);
  const { t, locale } = useI18n();
  const [model, setModel] = useState<MachineModel | null>(null);
  const [kbArticles, setKbArticles] = useState<KBArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<Tab>("specs");

  useEffect(() => {
    Promise.all([
      fetch(`/api/models/${modelId}`).then((r) => r.json()),
      fetch("/api/kb").then((r) => r.json()),
    ]).then(([modelData, allArticles]) => {
      setModel(modelData.error ? null : modelData);
      // Filter KB articles related to this model
      const related = (allArticles as KBArticle[]).filter(
        (a) => a.relatedModels.includes(modelId) || a.relatedModels.length === 0
      );
      setKbArticles(related);
      setLoading(false);
    });
  }, [modelId]);

  if (loading) return <Loading />;
  if (!model) return <p className="p-6 text-slate-400">Model not found.</p>;

  const isPulsed = ["QCW Fiber Laser", "Pulsed Fiber Laser", "MOPA Fiber Laser", "Q-Switched Fiber Laser"].includes(model.category);
  const docs = model.manualUrls || [];

  const tabs: { key: Tab; label: string; count?: number }[] = [
    { key: "specs", label: t("catalog.specifications") },
    { key: "documents", label: t("catalog.documents"), count: docs.length },
    { key: "errors", label: t("catalog.errorCodeRef"), count: model.errorCodes?.length || 0 },
    { key: "kb", label: t("catalog.relatedArticles"), count: kbArticles.length },
  ];

  return (
    <div className="p-6">
      <Link href="/catalog" className="text-blue-500 text-sm hover:underline mb-4 inline-block">{t("catalog.backToCatalog")}</Link>

      {/* Header */}
      <div className="flex flex-col lg:flex-row gap-6 mb-8">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-3 flex-wrap">
            <Badge>{model.category}</Badge>
            <Badge variant={model.status === "in_production" ? "success" : "warning"}>
              {model.status === "in_production" ? t("catalog.inProduction") : t("catalog.discontinued")}
            </Badge>
          </div>
          <h1 className="text-3xl font-bold">{model.name}</h1>
          <p className="text-slate-400 mt-2 leading-relaxed">{model.description}</p>

          {/* Key specs summary */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6">
            <div className="bg-slate-800 rounded-lg p-4 text-center">
              <p className="text-xs text-slate-500 uppercase">{isPulsed ? t("common.avgPower") : t("common.power")}</p>
              <p className="text-xl font-bold text-blue-400 mt-1">
                {model.powerWatt >= 1000 ? `${(model.powerWatt / 1000).toFixed(model.powerWatt % 1000 === 0 ? 0 : 1)} kW` : `${model.powerWatt} W`}
              </p>
            </div>
            <div className="bg-slate-800 rounded-lg p-4 text-center">
              <p className="text-xs text-slate-500 uppercase">{t("common.wavelength")}</p>
              <p className="text-xl font-bold text-emerald-400 mt-1">{model.wavelength}</p>
            </div>
            {model.specs.beamQuality && (
              <div className="bg-slate-800 rounded-lg p-4 text-center">
                <p className="text-xs text-slate-500 uppercase">{locale === "zh" ? "光束质量" : "Beam Quality"}</p>
                <p className="text-lg font-bold text-amber-400 mt-1">{model.specs.beamQuality}</p>
              </div>
            )}
            {model.specs.cooling && (
              <div className="bg-slate-800 rounded-lg p-4 text-center">
                <p className="text-xs text-slate-500 uppercase">{locale === "zh" ? "冷却方式" : "Cooling"}</p>
                <p className="text-lg font-bold text-slate-200 mt-1">{model.specs.cooling}</p>
              </div>
            )}
          </div>
        </div>

        {/* Side panel - Quick actions */}
        <div className="w-full lg:w-64 lg:flex-shrink-0 space-y-3">
          <Card>
            <CardContent className="pt-6 space-y-2">
              <h3 className="font-semibold mb-3">{t("catalog.quickActions")}</h3>
              <Link href="/machines/register"><Button className="w-full">{t("catalog.registerThisModel")}</Button></Link>
              <Link href="/tickets/new"><Button variant="secondary" className="w-full">🎫 {locale === "zh" ? "提交服务工单" : "Create Service Ticket"}</Button></Link>
              <Link href="/kb"><Button variant="ghost" className="w-full">📚 {t("dash.knowledgeBase")}</Button></Link>
            </CardContent>
          </Card>

          {model.specs.weight && (
            <Card>
              <CardContent className="pt-4 pb-4">
                <div className="grid grid-cols-2 gap-2 text-sm">
                  {model.specs.weight && <div><span className="text-slate-500">{locale === "zh" ? "重量" : "Weight"}:</span> <span className="text-slate-200">{model.specs.weight}</span></div>}
                  {model.specs.dimensions && <div className="col-span-2"><span className="text-slate-500">{locale === "zh" ? "尺寸" : "Size"}:</span> <span className="text-slate-200">{model.specs.dimensions}</span></div>}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 border-b border-slate-800 mb-6 overflow-x-auto">
        {tabs.map((tab) => (
          <button key={tab.key} onClick={() => setActiveTab(tab.key)}
            className={`px-4 py-2.5 text-sm font-medium whitespace-nowrap transition-colors cursor-pointer border-b-2 -mb-px ${
              activeTab === tab.key
                ? "border-blue-500 text-blue-400"
                : "border-transparent text-slate-400 hover:text-slate-200"
            }`}>
            {tab.label}
            {tab.count !== undefined && <span className="ml-1.5 text-xs opacity-60">({tab.count})</span>}
          </button>
        ))}
      </div>

      {/* Tab content */}
      {activeTab === "specs" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {Object.entries(model.specs).map(([key, value]) => (
            <div key={key} className="bg-slate-800/50 rounded-lg p-4 border border-slate-800">
              <p className="text-xs text-slate-500 uppercase mb-1">{key.replace(/([A-Z])/g, " $1").trim()}</p>
              <p className="text-sm font-semibold text-slate-100">{value}</p>
            </div>
          ))}
        </div>
      )}

      {activeTab === "documents" && (
        <div>
          {docs.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-slate-500 mb-2">{t("catalog.noDocuments")}</p>
              <p className="text-slate-600 text-sm">{locale === "zh" ? "文档正在整理中，请联系技术支持获取。" : "Documents are being prepared. Contact technical support for immediate access."}</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {docs.map((doc, i) => {
                const isEN = doc.language === "EN" || !doc.language;
                return (
                  <a key={i} href={doc.url} target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-3 bg-slate-800/50 border border-slate-800 rounded-lg p-4 hover:border-slate-700 transition-colors">
                    <span className="text-2xl">📄</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-slate-200 truncate">{doc.name || doc.docType || `Document ${i + 1}`}</p>
                      <p className="text-xs text-slate-500">{doc.docType || "PDF"} · {isEN ? "English" : "中文"}</p>
                    </div>
                    <span className="text-blue-500 text-sm shrink-0">↓ {t("catalog.download")}</span>
                  </a>
                );
              })}
            </div>
          )}
        </div>
      )}

      {activeTab === "errors" && (
        <div>
          {model.errorCodes && model.errorCodes.length > 0 ? (
            <ErrorCodeTable codes={model.errorCodes} />
          ) : (
            <p className="text-slate-500 text-center py-8">{locale === "zh" ? "暂无错误代码记录。" : "No error codes documented for this model."}</p>
          )}
        </div>
      )}

      {activeTab === "kb" && (
        <div>
          {kbArticles.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {kbArticles.map((article) => (
                <Link key={article.id} href={`/kb/${article.slug}`}>
                  <Card className="hover:border-slate-700 transition-colors cursor-pointer h-full">
                    <CardContent className="pt-5 pb-5">
                      <Badge variant="default" className="mb-2">{article.category}</Badge>
                      <h3 className="font-semibold text-slate-100 text-sm">{article.title}</h3>
                      <div className="flex flex-wrap gap-1 mt-2">
                        {article.tags.slice(0, 3).map((tag) => (
                          <span key={tag} className="text-xs text-slate-500">#{tag}</span>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          ) : (
            <p className="text-slate-500 text-center py-8">{locale === "zh" ? "暂无相关知识库文章。" : "No related knowledge base articles yet."}</p>
          )}
        </div>
      )}
    </div>
  );
}
