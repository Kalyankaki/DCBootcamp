"use client";

import { useState } from "react";
import { Calculator, ChevronDown, ChevronUp, Sparkles } from "lucide-react";

interface VedicMathCardProps {
  title: string;
  problem: string;
  steps: string[];
  answer: string;
}

export default function VedicMathCard({
  title,
  problem,
  steps,
  answer,
}: VedicMathCardProps) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="bg-gradient-to-br from-amber-500/10 to-purple-500/10 rounded-xl border border-amber-500/30 overflow-hidden">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between p-4 text-left hover:bg-white/5 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-amber-500/20 flex items-center justify-center">
            <Calculator className="w-5 h-5 text-amber-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <Sparkles className="w-3 h-3 text-purple-400" />
              <span className="text-purple-300 text-xs font-bold uppercase tracking-wide">
                Vedic Math Shortcut
              </span>
            </div>
            <p className="text-amber-200 font-bold text-sm">{title}</p>
          </div>
        </div>
        {expanded ? (
          <ChevronUp className="w-5 h-5 text-slate-400" />
        ) : (
          <ChevronDown className="w-5 h-5 text-slate-400" />
        )}
      </button>

      {expanded && (
        <div className="px-4 pb-4 space-y-3 animate-[fadeIn_0.3s_ease-out]">
          <style>{`
            @keyframes fadeIn {
              from { opacity: 0; transform: translateY(-8px); }
              to { opacity: 1; transform: translateY(0); }
            }
          `}</style>

          <div className="bg-slate-800/50 rounded-lg p-3">
            <p className="text-slate-400 text-xs mb-1">Problem</p>
            <p className="text-white font-mono font-bold">{problem}</p>
          </div>

          <div className="space-y-2">
            {steps.map((step, i) => (
              <div key={i} className="flex items-start gap-2">
                <span className="w-6 h-6 rounded-full bg-purple-500/20 text-purple-300 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                  {i + 1}
                </span>
                <p className="text-slate-300 text-sm">{step}</p>
              </div>
            ))}
          </div>

          <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-lg p-3">
            <p className="text-emerald-400 text-xs mb-1">Answer</p>
            <p className="text-emerald-300 font-mono font-bold text-lg">
              {answer}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
