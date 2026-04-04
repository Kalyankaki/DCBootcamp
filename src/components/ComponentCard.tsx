"use client";

import { type ReactNode } from "react";
import { Plus, Minus } from "lucide-react";

interface ComponentCardProps {
  name: string;
  specs: Record<string, string | number>;
  price: number;
  performanceScore: number;
  selected?: boolean;
  onSelect?: () => void;
  categoryIcon?: ReactNode;
}

export default function ComponentCard({
  name,
  specs,
  price,
  performanceScore,
  selected = false,
  onSelect,
  categoryIcon,
}: ComponentCardProps) {
  const perfColor =
    performanceScore >= 80
      ? "bg-emerald-500"
      : performanceScore >= 50
      ? "bg-blue-500"
      : performanceScore >= 30
      ? "bg-amber-500"
      : "bg-red-500";

  return (
    <div
      className={`relative bg-slate-800 rounded-xl border-2 transition-all duration-300 hover:scale-[1.02] hover:-translate-y-1 ${
        selected
          ? "border-emerald-400 shadow-[0_0_20px_rgba(52,211,153,0.3)]"
          : "border-slate-700 hover:border-slate-500"
      }`}
    >
      {/* Header */}
      <div className="flex items-center gap-3 p-4 pb-2">
        {categoryIcon && (
          <div className="w-10 h-10 rounded-lg bg-slate-700 flex items-center justify-center text-blue-400 shrink-0">
            {categoryIcon}
          </div>
        )}
        <div className="min-w-0">
          <h3 className="text-white font-bold text-sm truncate">{name}</h3>
          <p className="text-emerald-400 font-extrabold text-lg">${price.toLocaleString()}</p>
        </div>
      </div>

      {/* Specs */}
      <div className="px-4 py-2 space-y-1">
        {Object.entries(specs).map(([key, value]) => (
          <div key={key} className="flex justify-between text-xs">
            <span className="text-slate-400">{key}</span>
            <span className="text-slate-200 font-medium">{value}</span>
          </div>
        ))}
      </div>

      {/* Performance bar */}
      <div className="px-4 py-2">
        <div className="flex items-center justify-between text-xs mb-1">
          <span className="text-slate-400">Performance</span>
          <span className="text-white font-bold">{performanceScore}/100</span>
        </div>
        <div className="h-2.5 bg-slate-700 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-500 ${perfColor}`}
            style={{ width: `${performanceScore}%` }}
          />
        </div>
      </div>

      {/* Action button */}
      <div className="p-4 pt-2">
        <button
          onClick={onSelect}
          className={`w-full flex items-center justify-center gap-2 py-2 px-4 rounded-lg font-bold text-sm transition-all duration-200 ${
            selected
              ? "bg-red-500/20 text-red-400 border border-red-500/40 hover:bg-red-500/30"
              : "bg-emerald-600 text-white hover:bg-emerald-500 hover:shadow-lg hover:shadow-emerald-500/25"
          }`}
        >
          {selected ? (
            <>
              <Minus className="w-4 h-4" /> Remove
            </>
          ) : (
            <>
              <Plus className="w-4 h-4" /> Add to Build
            </>
          )}
        </button>
      </div>
    </div>
  );
}
