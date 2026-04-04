"use client";

import { useEffect, useState } from "react";
import { DollarSign, AlertTriangle } from "lucide-react";

interface BudgetBarProps {
  totalBudget: number;
  spentAmount: number;
}

export default function BudgetBar({ totalBudget, spentAmount }: BudgetBarProps) {
  const [animate, setAnimate] = useState(false);
  const [prevSpent, setPrevSpent] = useState(spentAmount);

  const remaining = totalBudget - spentAmount;
  const percentRemaining = Math.max(0, (remaining / totalBudget) * 100);
  const percentSpent = Math.min(100, (spentAmount / totalBudget) * 100);
  const overBudget = spentAmount > totalBudget;

  const barColor =
    overBudget
      ? "bg-red-500"
      : percentRemaining > 50
      ? "bg-emerald-500"
      : percentRemaining > 25
      ? "bg-amber-500"
      : "bg-red-500";

  useEffect(() => {
    if (spentAmount !== prevSpent) {
      setAnimate(true);
      setPrevSpent(spentAmount);
      const timeout = setTimeout(() => setAnimate(false), 600);
      return () => clearTimeout(timeout);
    }
  }, [spentAmount, prevSpent]);

  const shakeClass = overBudget && animate ? "animate-[shake_0.5s_ease-in-out]" : "";

  return (
    <div
      className={`bg-slate-800 rounded-xl border border-slate-700 p-4 ${shakeClass}`}
      style={{
        // @ts-expect-error -- inline keyframes for shake
        "--tw-animate-shake": undefined,
      }}
    >
      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          10%, 30%, 50%, 70%, 90% { transform: translateX(-4px); }
          20%, 40%, 60%, 80% { transform: translateX(4px); }
        }
      `}</style>

      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <DollarSign className="w-5 h-5 text-emerald-400" />
          <span className="text-white font-bold text-sm">Budget</span>
        </div>
        {overBudget && (
          <div className="flex items-center gap-1 text-red-400 text-xs font-bold animate-pulse">
            <AlertTriangle className="w-4 h-4" />
            OVER BUDGET!
          </div>
        )}
      </div>

      {/* Progress bar */}
      <div className="h-4 bg-slate-700 rounded-full overflow-hidden mb-3">
        <div
          className={`h-full rounded-full transition-all duration-500 ease-out ${barColor}`}
          style={{ width: `${Math.min(percentSpent, 100)}%` }}
        />
      </div>

      {/* Dollar amounts */}
      <div className="flex justify-between text-xs">
        <div>
          <span className="text-slate-400">Spent: </span>
          <span className={`font-bold ${overBudget ? "text-red-400" : "text-white"}`}>
            ${spentAmount.toLocaleString()}
          </span>
        </div>
        <div>
          <span className="text-slate-400">Remaining: </span>
          <span
            className={`font-bold ${
              overBudget
                ? "text-red-400"
                : percentRemaining > 50
                ? "text-emerald-400"
                : percentRemaining > 25
                ? "text-amber-400"
                : "text-red-400"
            }`}
          >
            ${remaining.toLocaleString()}
          </span>
        </div>
        <div>
          <span className="text-slate-400">Total: </span>
          <span className="text-slate-200 font-bold">${totalBudget.toLocaleString()}</span>
        </div>
      </div>
    </div>
  );
}
