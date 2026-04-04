"use client";

import {
  Cpu,
  HardDrive,
  Database,
  Rows3,
  Trophy,
  Check,
  Lock,
} from "lucide-react";
import type { DayProgress } from "@/lib/types";

const dayConfig = [
  { name: "Motherboard", icon: Cpu },
  { name: "Server", icon: HardDrive },
  { name: "Rack", icon: Database },
  { name: "Row", icon: Rows3 },
  { name: "Competition", icon: Trophy },
];

interface ProgressMapProps {
  currentDay: number;
  dayProgress: DayProgress[];
}

export default function ProgressMap({
  currentDay,
  dayProgress,
}: ProgressMapProps) {
  return (
    <div className="bg-slate-800 rounded-xl border border-slate-700 p-6">
      <h3 className="text-white font-bold text-lg mb-6 text-center">
        Your Journey
      </h3>

      <div className="flex items-center justify-between relative">
        {/* Connecting line */}
        <div className="absolute top-6 left-[10%] right-[10%] h-1 bg-slate-700 rounded-full" />
        <div
          className="absolute top-6 left-[10%] h-1 bg-emerald-500 rounded-full transition-all duration-700"
          style={{
            width: `${Math.max(0, ((Math.min(currentDay, 5) - 1) / 4) * 80)}%`,
          }}
        />

        {dayConfig.map((day, index) => {
          const dayNum = index + 1;
          const progress = dayProgress.find((p) => p.day === dayNum);
          const isCompleted = progress?.completed ?? false;
          const isCurrent = dayNum === currentDay;
          const isLocked = dayNum > currentDay;
          const Icon = day.icon;

          return (
            <div
              key={dayNum}
              className="flex flex-col items-center gap-2 relative z-10"
            >
              {/* Node */}
              <div
                className={`w-12 h-12 rounded-full flex items-center justify-center border-3 transition-all duration-300 ${
                  isCompleted
                    ? "bg-emerald-500 border-emerald-400 text-white shadow-lg shadow-emerald-500/30"
                    : isCurrent
                    ? "bg-blue-500 border-blue-400 text-white shadow-lg shadow-blue-500/40 animate-pulse"
                    : "bg-slate-700 border-slate-600 text-slate-500"
                }`}
              >
                {isCompleted ? (
                  <Check className="w-5 h-5" />
                ) : isLocked ? (
                  <Lock className="w-4 h-4" />
                ) : (
                  <Icon className="w-5 h-5" />
                )}
              </div>

              {/* Label */}
              <div className="text-center">
                <p
                  className={`text-xs font-bold ${
                    isCompleted
                      ? "text-emerald-400"
                      : isCurrent
                      ? "text-blue-400"
                      : "text-slate-500"
                  }`}
                >
                  Day {dayNum}
                </p>
                <p
                  className={`text-[10px] ${
                    isLocked ? "text-slate-600" : "text-slate-400"
                  }`}
                >
                  {day.name}
                </p>
              </div>

              {/* Score */}
              {isCompleted && progress && (
                <p className="text-[10px] text-emerald-300 font-bold">
                  {progress.totalPoints} pts
                </p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
