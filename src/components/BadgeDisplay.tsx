"use client";

import { useState, useEffect } from "react";
import { Lock } from "lucide-react";
import type { Badge } from "@/lib/types";

interface BadgeDisplayProps {
  earnedBadges: string[];
  allBadges: Badge[];
}

export default function BadgeDisplay({
  earnedBadges,
  allBadges,
}: BadgeDisplayProps) {
  const [newBadge, setNewBadge] = useState<string | null>(null);
  const [prevEarned, setPrevEarned] = useState<string[]>(earnedBadges);

  // Detect newly earned badges
  useEffect(() => {
    const newOnes = earnedBadges.filter((b) => !prevEarned.includes(b));
    if (newOnes.length > 0) {
      setNewBadge(newOnes[0]);
      const t = setTimeout(() => setNewBadge(null), 2500);
      setPrevEarned(earnedBadges);
      return () => clearTimeout(t);
    }
    setPrevEarned(earnedBadges);
  }, [earnedBadges]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="bg-slate-800 rounded-xl border border-slate-700 p-4">
      <h3 className="text-white font-bold text-sm mb-3">Badges</h3>

      <div className="grid grid-cols-4 sm:grid-cols-6 gap-3">
        {allBadges.map((badge) => {
          const earned = earnedBadges.includes(badge.id);
          const justEarned = newBadge === badge.id;

          return (
            <div key={badge.id} className="group relative flex flex-col items-center">
              {/* Badge icon */}
              <div
                className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl transition-all duration-300 ${
                  earned
                    ? justEarned
                      ? "bg-amber-500/30 border-2 border-amber-400 shadow-[0_0_20px_rgba(251,191,36,0.5)] animate-[bounce_0.5s_ease-in-out_3] scale-110"
                      : "bg-slate-700 border-2 border-emerald-500/50 shadow-[0_0_12px_rgba(52,211,153,0.2)]"
                    : "bg-slate-700/50 border-2 border-slate-600 grayscale opacity-40"
                }`}
              >
                {earned ? (
                  <span>{badge.icon}</span>
                ) : (
                  <Lock className="w-4 h-4 text-slate-500" />
                )}
              </div>

              {/* Name */}
              <p
                className={`text-[10px] mt-1 text-center leading-tight ${
                  earned ? "text-slate-300" : "text-slate-600"
                }`}
              >
                {earned ? badge.name : "???"}
              </p>

              {/* Tooltip */}
              <div className="absolute -top-16 left-1/2 -translate-x-1/2 bg-slate-900 border border-slate-600 rounded-lg px-3 py-2 text-xs opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-20 shadow-xl">
                <p className="text-white font-bold">{badge.name}</p>
                <p className="text-slate-400">{badge.requirement}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Celebration overlay for new badge */}
      {newBadge && (
        <div className="mt-3 bg-amber-500/10 border border-amber-500/30 rounded-lg p-3 text-center animate-[fadeIn_0.3s_ease-out]">
          <style>{`
            @keyframes fadeIn {
              from { opacity: 0; transform: scale(0.9); }
              to { opacity: 1; transform: scale(1); }
            }
          `}</style>
          <p className="text-amber-300 font-bold text-sm">
            🎉 New Badge Earned!
          </p>
          <p className="text-amber-200/70 text-xs">
            {allBadges.find((b) => b.id === newBadge)?.name}
          </p>
        </div>
      )}
    </div>
  );
}
