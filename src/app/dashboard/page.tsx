"use client";

import React, { useMemo } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useGameStore } from "@/lib/store";
import { badges } from "@/lib/data/badges";
import { vedicTips } from "@/lib/vedic-math";
import Navbar from "@/components/Navbar";
import {
  Star,
  Trophy,
  Award,
  TrendingUp,
  CheckCircle2,
  Lock,
  Play,
  ArrowRight,
  Cpu,
  HardDrive,
  Database,
  Rows3,
  Sparkles,
  BookOpen,
} from "lucide-react";

const dayMeta = [
  { day: 1, title: "Motherboard Builder", icon: Cpu, description: "Learn CPU, RAM, storage, and power supply basics" },
  { day: 2, title: "Server Assembly", icon: HardDrive, description: "Build servers with form factors and workloads" },
  { day: 3, title: "Rack Configuration", icon: Database, description: "Fill a 42U rack and manage power budgets" },
  { day: 4, title: "Row & Infrastructure", icon: Rows3, description: "Design rows with cooling, networking, and redundancy" },
  { day: 5, title: "Grand Competition", icon: Trophy, description: "Shark Tank: Data Center Edition!" },
];

export default function DashboardPage() {
  const { data: session } = useSession();
  const store = useGameStore();

  const daysCompleted = store.dayProgress.filter((d) => d.completed).length;

  // Rank calculation
  const rank = useMemo(() => {
    if (store.totalPoints >= 3000) return "Data Center CEO";
    if (store.totalPoints >= 2000) return "Senior Architect";
    if (store.totalPoints >= 1000) return "Infrastructure Engineer";
    if (store.totalPoints >= 500) return "Technician";
    return "Recruit";
  }, [store.totalPoints]);

  // Random vedic tip
  const tipOfDay = useMemo(() => {
    const idx = new Date().getDate() % vedicTips.length;
    return vedicTips[idx];
  }, []);

  const currentDay = store.currentDay;
  const userName = session?.user?.name ?? store.name ?? "Student";

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      <Navbar currentDay={currentDay} points={store.totalPoints} />

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Welcome Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-extrabold mb-1">
            Welcome back,{" "}
            <span className="text-emerald-400">{userName}</span>!
          </h1>
          <p className="text-slate-400">
            Track your progress through the 5-day Data Center Bootcamp.
          </p>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          {[
            {
              icon: Star,
              label: "Total Points",
              value: store.totalPoints.toLocaleString(),
              accent: "text-amber-400",
              bg: "bg-amber-500/10 border-amber-500/20",
            },
            {
              icon: CheckCircle2,
              label: "Days Completed",
              value: `${daysCompleted} / 5`,
              accent: "text-emerald-400",
              bg: "bg-emerald-500/10 border-emerald-500/20",
            },
            {
              icon: Award,
              label: "Badges",
              value: String(store.badges.length),
              accent: "text-purple-400",
              bg: "bg-purple-500/10 border-purple-500/20",
            },
            {
              icon: TrendingUp,
              label: "Rank",
              value: rank,
              accent: "text-cyan-400",
              bg: "bg-cyan-500/10 border-cyan-500/20",
            },
          ].map((card) => {
            const Icon = card.icon;
            return (
              <div
                key={card.label}
                className={`rounded-xl border p-4 ${card.bg}`}
              >
                <Icon className={`w-6 h-6 ${card.accent} mb-2`} />
                <p className="text-xs text-slate-400 uppercase tracking-wide">
                  {card.label}
                </p>
                <p className={`text-xl font-extrabold ${card.accent}`}>
                  {card.value}
                </p>
              </div>
            );
          })}
        </div>

        {/* 5-Day Progress Timeline */}
        <div className="mb-10">
          <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-emerald-400" />
            Your Journey
          </h2>
          <div className="flex items-center justify-between relative">
            {/* Connecting line */}
            <div className="absolute left-0 right-0 top-1/2 h-1 bg-slate-700 -translate-y-1/2 z-0" />
            {store.dayProgress.map((dp, idx) => {
              const isCompleted = dp.completed;
              const isCurrent = currentDay === dp.day;
              const isLocked = dp.day > currentDay && !dp.completed;
              return (
                <div key={dp.day} className="relative z-10 flex flex-col items-center">
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center font-extrabold text-lg border-2 transition-all ${
                      isCompleted
                        ? "bg-emerald-600 border-emerald-400 text-white"
                        : isCurrent
                        ? "bg-slate-800 border-emerald-400 text-emerald-400 animate-pulse"
                        : "bg-slate-800 border-slate-600 text-slate-500"
                    }`}
                  >
                    {isCompleted ? (
                      <CheckCircle2 className="w-6 h-6" />
                    ) : isLocked ? (
                      <Lock className="w-5 h-5" />
                    ) : (
                      dp.day
                    )}
                  </div>
                  <span
                    className={`text-xs mt-1.5 font-medium ${
                      isCompleted
                        ? "text-emerald-400"
                        : isCurrent
                        ? "text-white"
                        : "text-slate-500"
                    }`}
                  >
                    Day {dp.day}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Day Cards Grid */}
        <div className="mb-10">
          <h2 className="text-lg font-bold mb-4">Daily Challenges</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {dayMeta.map((dm) => {
              const dp = store.dayProgress.find((d) => d.day === dm.day);
              const isCompleted = dp?.completed ?? false;
              const isCurrent = currentDay === dm.day;
              const isLocked = dm.day > currentDay && !isCompleted;
              const Icon = dm.icon;

              return (
                <div
                  key={dm.day}
                  className={`rounded-xl border p-5 transition-all ${
                    isCompleted
                      ? "bg-emerald-900/20 border-emerald-500/30"
                      : isCurrent
                      ? "bg-slate-800 border-emerald-500/50 shadow-lg shadow-emerald-500/10"
                      : "bg-slate-800 border-slate-700 opacity-60"
                  }`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <div
                        className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                          isCompleted
                            ? "bg-emerald-600"
                            : isCurrent
                            ? "bg-slate-700"
                            : "bg-slate-700"
                        }`}
                      >
                        <Icon className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <p className="text-xs text-slate-400">Day {dm.day}</p>
                        <p className="font-bold text-sm">{dm.title}</p>
                      </div>
                    </div>
                    {isCompleted && (
                      <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                    )}
                    {isLocked && (
                      <Lock className="w-5 h-5 text-slate-500 shrink-0" />
                    )}
                  </div>

                  <p className="text-xs text-slate-400 mb-3">{dm.description}</p>

                  {/* Scores */}
                  {dp && (dp.quizScore > 0 || dp.simulationScore > 0) && (
                    <div className="flex gap-3 mb-3 text-xs">
                      <span className="text-slate-400">
                        Quiz:{" "}
                        <span className="text-amber-400 font-bold">
                          {dp.quizScore}
                        </span>
                      </span>
                      <span className="text-slate-400">
                        Sim:{" "}
                        <span className="text-cyan-400 font-bold">
                          {dp.simulationScore}
                        </span>
                      </span>
                    </div>
                  )}

                  {!isLocked && (
                    <Link
                      href={`/day/${dm.day}`}
                      className={`inline-flex items-center gap-1.5 text-sm font-bold rounded-lg px-3 py-1.5 transition-colors ${
                        isCompleted
                          ? "bg-emerald-600/20 text-emerald-400 hover:bg-emerald-600/30"
                          : "bg-emerald-600 text-white hover:bg-emerald-500"
                      }`}
                    >
                      {isCompleted ? (
                        <>
                          Review <ArrowRight className="w-4 h-4" />
                        </>
                      ) : (
                        <>
                          {isCurrent ? "Continue" : "Start"}{" "}
                          <Play className="w-4 h-4" />
                        </>
                      )}
                    </Link>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Badge Collection */}
        <div className="mb-10">
          <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
            <Award className="w-5 h-5 text-purple-400" />
            Badge Collection
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
            {badges.map((badge) => {
              const earned = store.badges.includes(badge.id);
              return (
                <div
                  key={badge.id}
                  className={`rounded-xl border p-3 text-center transition-all ${
                    earned
                      ? "bg-purple-900/20 border-purple-500/40"
                      : "bg-slate-800 border-slate-700 opacity-50 grayscale"
                  }`}
                >
                  <span className="text-3xl block mb-1">{badge.icon}</span>
                  <p
                    className={`text-xs font-bold ${
                      earned ? "text-purple-300" : "text-slate-500"
                    }`}
                  >
                    {badge.name}
                  </p>
                  <p className="text-[10px] text-slate-500 mt-0.5 leading-tight">
                    {earned ? badge.description : badge.requirement}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Vedic Math Tip of the Day */}
        <div className="bg-gradient-to-r from-amber-900/30 to-orange-900/30 border border-amber-500/30 rounded-xl p-5">
          <div className="flex items-center gap-2 mb-2">
            <BookOpen className="w-5 h-5 text-amber-400" />
            <h3 className="font-bold text-amber-400">
              Vedic Math Tip of the Day
            </h3>
          </div>
          <h4 className="font-bold text-white mb-1">{tipOfDay.title}</h4>
          <p className="text-sm text-slate-300 mb-2">{tipOfDay.description}</p>
          <div className="bg-slate-900/50 rounded-lg px-3 py-2">
            <p className="text-sm font-mono text-amber-300">{tipOfDay.example}</p>
          </div>
          <p className="text-xs text-slate-500 mt-2">
            Applicable to: {tipOfDay.applicableTo}
          </p>
        </div>
      </div>
    </div>
  );
}
