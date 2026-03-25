"use client";

import { useEffect, useState } from "react";
import { MachineModel, LaserCategory } from "@/lib/types";
import { ModelCard } from "@/components/machines/model-card";
import { Loading } from "@/components/ui/loading";

const CATEGORY_ORDER: LaserCategory[] = [
  "CW Fiber Laser",
  "HP CW Fiber Laser",
  "ABP Fiber Laser",
  "QCW Fiber Laser",
  "Pulsed Fiber Laser",
  "MOPA Fiber Laser",
  "Q-Switched Fiber Laser",
  "3D Printing Fiber Laser",
  "Direct Diode Laser",
];

const CATEGORY_LABELS: Record<LaserCategory, { label: string; desc: string }> = {
  "CW Fiber Laser": { label: "CW Global Series", desc: "Continuous wave fiber lasers — CE certified for cutting & welding" },
  "HP CW Fiber Laser": { label: "HP High Power", desc: "High-performance CW fiber lasers for demanding industrial applications" },
  "ABP Fiber Laser": { label: "ABP Adjustable Beam", desc: "Adjustable beam profile — switch between Gaussian, ring, and mixed spots" },
  "QCW Fiber Laser": { label: "QCW", desc: "Quasi-continuous wave — high peak power pulsed operation" },
  "Pulsed Fiber Laser": { label: "High-Power Pulsed", desc: "Nanosecond pulsed lasers for cleaning, marking, and micro-machining" },
  "MOPA Fiber Laser": { label: "MOPA", desc: "Master oscillator power amplifier — tunable pulse width for color marking" },
  "Q-Switched Fiber Laser": { label: "Q-Switched", desc: "Short pulse marking and engraving lasers" },
  "3D Printing Fiber Laser": { label: "3D Printing", desc: "Single-mode CW lasers optimized for powder bed fusion" },
  "Direct Diode Laser": { label: "Direct Diode", desc: "Fiber-delivered direct diode lasers for heat treatment and cladding" },
};

export default function CatalogPage() {
  const [models, setModels] = useState<MachineModel[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState<LaserCategory | "all">("all");

  useEffect(() => {
    fetch("/api/models")
      .then((r) => r.json())
      .then((data) => {
        setModels(data);
        setLoading(false);
      });
  }, []);

  if (loading) return <Loading />;

  const categories = CATEGORY_ORDER.filter((cat) =>
    models.some((m) => m.category === cat)
  );

  const filtered =
    activeCategory === "all"
      ? models
      : models.filter((m) => m.category === activeCategory);

  const grouped = activeCategory === "all"
    ? categories.map((cat) => ({
        category: cat,
        models: models.filter((m) => m.category === cat).sort((a, b) => a.powerWatt - b.powerWatt),
      }))
    : [{ category: activeCategory as LaserCategory, models: filtered.sort((a, b) => a.powerWatt - b.powerWatt) }];

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-2">Product Catalog</h1>
      <p className="text-slate-400 mb-6">
        Raycus Fiber Laser Sources — Full Portfolio
      </p>

      {/* Category filter tabs */}
      <div className="flex flex-wrap gap-2 mb-8">
        <button
          onClick={() => setActiveCategory("all")}
          className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
            activeCategory === "all"
              ? "bg-blue-600 text-white"
              : "bg-slate-800 text-slate-400 hover:text-slate-100"
          }`}
        >
          All ({models.length})
        </button>
        {categories.map((cat) => {
          const count = models.filter((m) => m.category === cat).length;
          return (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
                activeCategory === cat
                  ? "bg-blue-600 text-white"
                  : "bg-slate-800 text-slate-400 hover:text-slate-100"
              }`}
            >
              {CATEGORY_LABELS[cat]?.label || cat} ({count})
            </button>
          );
        })}
      </div>

      {/* Model groups */}
      {grouped.map(({ category, models: catModels }) => (
        <div key={category} className="mb-10">
          <div className="mb-4">
            <h2 className="text-lg font-bold text-slate-100">
              {CATEGORY_LABELS[category]?.label || category}
            </h2>
            <p className="text-sm text-slate-500">
              {CATEGORY_LABELS[category]?.desc} — {catModels.length} model{catModels.length !== 1 ? "s" : ""}
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {catModels.map((model) => (
              <ModelCard key={model.id} model={model} />
            ))}
          </div>
        </div>
      ))}

      {filtered.length === 0 && (
        <p className="text-slate-500 text-center py-12">
          No models found in this category.
        </p>
      )}
    </div>
  );
}
