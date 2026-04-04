"use client";

import { Zap, AlertTriangle } from "lucide-react";

interface PowerMeterProps {
  currentWatts: number;
  maxWatts: number;
}

export default function PowerMeter({ currentWatts, maxWatts }: PowerMeterProps) {
  const percentage = maxWatts > 0 ? Math.min((currentWatts / maxWatts) * 100, 100) : 0;
  const overloaded = currentWatts > maxWatts;

  const barColor = overloaded
    ? "bg-red-500"
    : percentage > 80
    ? "bg-amber-500"
    : percentage > 50
    ? "bg-blue-500"
    : "bg-emerald-500";

  const glowColor = overloaded
    ? "shadow-red-500/40"
    : percentage > 80
    ? "shadow-amber-500/30"
    : "shadow-emerald-500/20";

  return (
    <div className={`bg-slate-800 rounded-xl border border-slate-700 p-4 shadow-lg ${glowColor}`}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Zap className={`w-5 h-5 ${overloaded ? "text-red-400 animate-pulse" : "text-amber-400"}`} />
          <span className="text-white font-bold text-sm">Power Consumption</span>
        </div>
        {overloaded && (
          <div className="flex items-center gap-1 text-red-400 text-xs font-bold animate-pulse">
            <AlertTriangle className="w-4 h-4" />
            OVERLOADED!
          </div>
        )}
      </div>

      {/* Power bar */}
      <div className="relative h-6 bg-slate-700 rounded-full overflow-hidden mb-3">
        <div
          className={`h-full rounded-full transition-all duration-500 ease-out ${barColor} ${
            overloaded ? "animate-pulse" : ""
          }`}
          style={{ width: `${Math.min(percentage, 100)}%` }}
        />
        {/* Tick marks */}
        <div className="absolute inset-0 flex items-center justify-between px-1">
          {[25, 50, 75].map((tick) => (
            <div
              key={tick}
              className="w-px h-3 bg-slate-500/50"
              style={{ marginLeft: `${tick}%` }}
            />
          ))}
        </div>
      </div>

      <div className="flex justify-between text-xs">
        <div>
          <span className="text-slate-400">Using: </span>
          <span className={`font-bold ${overloaded ? "text-red-400" : "text-white"}`}>
            {currentWatts}W
          </span>
        </div>
        <div>
          <span className="text-slate-400">PSU Capacity: </span>
          <span className="text-slate-200 font-bold">{maxWatts}W</span>
        </div>
      </div>

      {overloaded && (
        <p className="text-red-400/80 text-xs mt-2">
          You need a bigger power supply! Your components draw more power than the PSU can deliver.
        </p>
      )}
    </div>
  );
}
