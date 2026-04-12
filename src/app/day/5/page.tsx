"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import Link from "next/link";
import { useGameStore } from "@/lib/store";
import {
  rackTemplates,
  coolingOptions,
  networkOptions,
  redundancyOptions,
} from "@/lib/game-engine";
import type { RackTemplate, CoolingOption, NetworkOption, RedundancyOption } from "@/lib/game-engine";
import { calculateROI, calculateProfitMarginVedic } from "@/lib/vedic-math";
import { quizQuestions } from "@/lib/data/challenges";
import {
  Trophy,
  Timer,
  DollarSign,
  Zap,
  TrendingUp,
  Shield,
  ChevronDown,
  ChevronUp,
  Plus,
  Trash2,
  Rocket,
  Award,
  BarChart3,
  Server,
  Snowflake,
  Wifi,
  ShieldCheck,
  Star,
  PartyPopper,
  Building2,
} from "lucide-react";

// ─── Types ─────────────────────────────────────────────────────────────────

interface RowConfig {
  id: string;
  rackTemplateId: string;
  rackCount: number;
  coolingId: string;
  networkId: string;
  redundancyId: string;
  collapsed: boolean;
}

function createRowConfig(): RowConfig {
  return {
    id: crypto.randomUUID(),
    rackTemplateId: rackTemplates[0].id,
    rackCount: 1,
    coolingId: coolingOptions[0].id,
    networkId: networkOptions[0].id,
    redundancyId: redundancyOptions[0].id,
    collapsed: false,
  };
}

// ─── Helpers ───────────────────────────────────────────────────────────────

function getRowStats(row: RowConfig) {
  const rack = rackTemplates.find((r) => r.id === row.rackTemplateId) ?? rackTemplates[0];
  const cooling = coolingOptions.find((c) => c.id === row.coolingId) ?? coolingOptions[0];
  const network = networkOptions.find((n) => n.id === row.networkId) ?? networkOptions[0];
  const redundancy = redundancyOptions.find((r) => r.id === row.redundancyId) ?? redundancyOptions[0];

  const rackCost = rack.totalCost * row.rackCount;
  const monthlyRevenue = rack.monthlyRevenue * row.rackCount;
  const monthlyOpex =
    rack.monthlyCost * row.rackCount +
    cooling.monthlyCost +
    network.monthlyCost +
    redundancy.monthlyCost;
  const totalPower = rack.totalPower * row.rackCount;

  return { rack, cooling, network, redundancy, rackCost, monthlyRevenue, monthlyOpex, totalPower };
}

// ─── Component ─────────────────────────────────────────────────────────────

const BUDGET = 500_000;
const DEFAULT_TIMER_MINUTES = 30;

export default function Day5Page() {
  const { completeSimulation, addPoints, earnBadge } = useGameStore();

  // Build state
  const [dcName, setDcName] = useState("My Data Center");
  const [rows, setRows] = useState<RowConfig[]>([createRowConfig()]);

  // Timer
  const [timerMinutes] = useState(DEFAULT_TIMER_MINUTES);
  const [secondsLeft, setSecondsLeft] = useState(DEFAULT_TIMER_MINUTES * 60);
  const [timerRunning, setTimerRunning] = useState(false);

  // Submission
  const [submitted, setSubmitted] = useState(false);
  const [scoreAnimating, setScoreAnimating] = useState(false);
  const [finalScore, setFinalScore] = useState(0);
  const [breakdown, setBreakdown] = useState<{
    profitability: number;
    pue: number;
    uptime: number;
    budget: number;
    diversity: number;
  } | null>(null);

  // Timer effect
  useEffect(() => {
    if (!timerRunning || secondsLeft <= 0) return;
    const interval = setInterval(() => {
      setSecondsLeft((s) => {
        if (s <= 1) {
          setTimerRunning(false);
          return 0;
        }
        return s - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [timerRunning, secondsLeft]);

  const formatTime = (s: number) => {
    const mins = Math.floor(s / 60);
    const secs = s % 60;
    return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  };

  // ── Aggregate stats ────────────────────────────────────────────────────

  const stats = useMemo(() => {
    let totalInvestment = 0;
    let totalMonthlyRevenue = 0;
    let totalMonthlyOpex = 0;
    let totalPower = 0;
    let pueSum = 0;
    let uptimeMin = 100;
    const rackTypeSet = new Set<string>();

    rows.forEach((row) => {
      const s = getRowStats(row);
      totalInvestment += s.rackCost;
      totalMonthlyRevenue += s.monthlyRevenue;
      totalMonthlyOpex += s.monthlyOpex;
      totalPower += s.totalPower;
      pueSum += s.cooling.pue;
      uptimeMin = Math.min(uptimeMin, s.redundancy.uptime);
      rackTypeSet.add(row.rackTemplateId);
    });

    const avgPue = rows.length > 0 ? pueSum / rows.length : 0;
    const monthlyProfit = totalMonthlyRevenue - totalMonthlyOpex;
    const roiResult = calculateROI(totalInvestment, totalMonthlyRevenue, totalMonthlyOpex);
    const annualROI = roiResult.result;
    const paybackMonths =
      monthlyProfit > 0 ? Math.ceil(totalInvestment / monthlyProfit) : Infinity;

    return {
      totalInvestment,
      totalMonthlyRevenue,
      totalMonthlyOpex,
      monthlyProfit,
      totalPower,
      avgPue,
      uptimeMin,
      annualROI,
      paybackMonths,
      rackTypeCount: rackTypeSet.size,
    };
  }, [rows]);

  // ── Row management ─────────────────────────────────────────────────────

  const addRow = () => {
    if (rows.length >= 4) return;
    setRows((prev) => [...prev, createRowConfig()]);
  };

  const removeRow = (id: string) => {
    setRows((prev) => prev.filter((r) => r.id !== id));
  };

  const updateRow = (id: string, patch: Partial<RowConfig>) => {
    setRows((prev) => prev.map((r) => (r.id === id ? { ...r, ...patch } : r)));
  };

  const toggleCollapse = (id: string) => {
    setRows((prev) =>
      prev.map((r) => (r.id === id ? { ...r, collapsed: !r.collapsed } : r))
    );
  };

  // ── Scoring ────────────────────────────────────────────────────────────

  const calculateFinalScore = useCallback(() => {
    // Profitability (400 pts): based on profit margin
    const marginResult = calculateProfitMarginVedic(
      stats.totalMonthlyRevenue,
      stats.totalMonthlyOpex
    );
    const margin = Math.max(0, marginResult.result);
    const profitabilityScore = Math.min(400, Math.round((margin / 60) * 400));

    // PUE (200 pts): 1.0=perfect, 2.0=bad
    const pueScore =
      stats.avgPue <= 1.1
        ? 200
        : stats.avgPue <= 1.2
        ? 180
        : stats.avgPue <= 1.4
        ? 150
        : stats.avgPue <= 1.6
        ? 100
        : stats.avgPue <= 2.0
        ? 60
        : 20;

    // Uptime (150 pts)
    const uptimeScore =
      stats.uptimeMin >= 99.99
        ? 150
        : stats.uptimeMin >= 99.9
        ? 120
        : stats.uptimeMin >= 99
        ? 70
        : 30;

    // Budget (150 pts): how well budget is used
    const budgetRatio = stats.totalInvestment / BUDGET;
    const budgetScore =
      budgetRatio > 1
        ? Math.max(0, 150 - Math.round((budgetRatio - 1) * 300))
        : budgetRatio >= 0.8
        ? 150
        : budgetRatio >= 0.5
        ? 120
        : budgetRatio >= 0.2
        ? 80
        : 30;

    // Diversity (100 pts)
    const diversityScore = Math.min(100, stats.rackTypeCount * 25);

    const total = profitabilityScore + pueScore + uptimeScore + budgetScore + diversityScore;

    return {
      total,
      profitability: profitabilityScore,
      pue: pueScore,
      uptime: uptimeScore,
      budget: budgetScore,
      diversity: diversityScore,
    };
  }, [stats]);

  const handleSubmit = () => {
    if (rows.length === 0) return;
    const scores = calculateFinalScore();
    setSubmitted(true);
    setScoreAnimating(true);
    setBreakdown(scores);

    // Animate score count-up
    let current = 0;
    const step = Math.max(1, Math.floor(scores.total / 60));
    const interval = setInterval(() => {
      current += step;
      if (current >= scores.total) {
        current = scores.total;
        clearInterval(interval);
        setScoreAnimating(false);
      }
      setFinalScore(current);
    }, 30);

    // Persist to store
    completeSimulation(5, scores.total);
    addPoints(scores.total);
    earnBadge("badge-datacenter-ceo");
    if (scores.profitability >= 300) earnBadge("badge-profit-wizard");
  };

  // ── Render ─────────────────────────────────────────────────────────────

  if (submitted) {
    return (
      <div className="min-h-screen bg-slate-900 text-white">
        <div className="max-w-3xl mx-auto px-4 py-12">
          {/* Score reveal */}
          <div className="text-center mb-10">
            <PartyPopper className="w-16 h-16 text-amber-400 mx-auto mb-4 animate-bounce" />
            <h1 className="text-4xl font-extrabold mb-2">Pitch Complete!</h1>
            <p className="text-slate-400 text-lg">&ldquo;{dcName}&rdquo;</p>
          </div>

          <div className="bg-slate-800 rounded-2xl border border-slate-700 p-8 mb-8 text-center">
            <p className="text-slate-400 mb-2 text-sm uppercase tracking-wider">
              Your Final Score
            </p>
            <p
              className={`text-7xl font-black ${
                scoreAnimating ? "text-amber-400" : "text-emerald-400"
              } transition-colors duration-500`}
            >
              {finalScore}
            </p>
            <p className="text-slate-500 mt-1">out of 1000</p>
          </div>

          {/* Breakdown */}
          {breakdown && (
            <div className="space-y-3 mb-10">
              {[
                { label: "Profitability (40%)", value: breakdown.profitability, max: 400, color: "bg-emerald-500" },
                { label: "PUE Efficiency (20%)", value: breakdown.pue, max: 200, color: "bg-cyan-500" },
                { label: "Uptime SLA (15%)", value: breakdown.uptime, max: 150, color: "bg-blue-500" },
                { label: "Budget Usage (15%)", value: breakdown.budget, max: 150, color: "bg-amber-500" },
                { label: "Rack Diversity (10%)", value: breakdown.diversity, max: 100, color: "bg-purple-500" },
              ].map((item) => (
                <div key={item.label}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-slate-300">{item.label}</span>
                    <span className="text-white font-bold">
                      {item.value} / {item.max}
                    </span>
                  </div>
                  <div className="h-3 bg-slate-700 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${item.color} rounded-full transition-all duration-1000`}
                      style={{ width: `${(item.value / item.max) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Certificate */}
          <div
            id="certificate"
            className="bg-gradient-to-br from-slate-800 via-slate-800 to-slate-700 border-2 border-amber-500/50 rounded-2xl p-8 text-center"
          >
            <Award className="w-12 h-12 text-amber-400 mx-auto mb-3" />
            <p className="uppercase text-amber-400 tracking-widest text-xs mb-1">
              Certificate of Achievement
            </p>
            <h2 className="text-2xl font-extrabold mb-1">Data Center Bootcamp</h2>
            <p className="text-slate-400 text-sm mb-4">
              Shark Tank: Data Center Edition
            </p>
            <p className="text-slate-300">
              This certifies that the builder of{" "}
              <span className="text-emerald-400 font-bold">&ldquo;{dcName}&rdquo;</span>{" "}
              achieved a score of{" "}
              <span className="text-amber-400 font-bold">{breakdown?.profitability !== undefined ? breakdown.profitability + breakdown.pue + breakdown.uptime + breakdown.budget + breakdown.diversity : 0}</span>{" "}
              / 1000 in the Grand Competition.
            </p>
            <div className="mt-6 flex items-center justify-center gap-2 text-slate-500 text-xs">
              <Star className="w-4 h-4 text-amber-500" />
              <span>DC Bootcamp {new Date().getFullYear()}</span>
              <Star className="w-4 h-4 text-amber-500" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-amber-600/20 via-emerald-600/20 to-cyan-600/20 border-b border-slate-700">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex items-center gap-3 mb-2">
            <Trophy className="w-10 h-10 text-amber-400" />
            <h1 className="text-3xl md:text-4xl font-extrabold">
              Shark Tank:{" "}
              <span className="text-emerald-400">Data Center Edition!</span>
            </h1>
          </div>
          <p className="text-slate-300 text-lg max-w-2xl">
            Build the most profitable data center with a{" "}
            <span className="text-amber-400 font-bold">$500,000</span> budget!
            Configure rows of racks, pick cooling, networking, and redundancy,
            then pitch to investors.
          </p>

          {/* Timer */}
          <div className="mt-4 flex items-center gap-4">
            <div
              className={`flex items-center gap-2 px-4 py-2 rounded-xl font-mono text-2xl font-bold ${
                secondsLeft <= 60
                  ? "bg-red-900/60 text-red-300 border border-red-500/50"
                  : "bg-slate-800 text-emerald-300 border border-slate-700"
              }`}
            >
              <Timer className="w-5 h-5" />
              {formatTime(secondsLeft)}
            </div>
            {!timerRunning && secondsLeft > 0 && (
              <button
                onClick={() => setTimerRunning(true)}
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm transition-colors"
              >
                Start Timer
              </button>
            )}
            {timerRunning && (
              <button
                onClick={() => setTimerRunning(false)}
                className="px-4 py-2 rounded-xl bg-slate-700 hover:bg-slate-600 text-white font-bold text-sm transition-colors"
              >
                Pause
              </button>
            )}
            {secondsLeft === 0 && (
              <span className="text-red-400 font-bold">Time is up!</span>
            )}
          </div>
        </div>
      </div>

      {/* Advanced Extension Ribbon */}
      <div className="app-muted border-b app-border text-center py-1.5 px-4 text-xs app-text-muted">
        🎓 Shark Tank prep: Try <Link href="/demo-advanced" className="app-accent-text font-semibold hover:underline">Advanced Mode</Link> to know your TCO cold for investor grilling
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* ─── Left: Build Interface ────────────────────────────────── */}
          <div className="lg:col-span-2 space-y-6">
            {/* DC Name */}
            <div className="bg-slate-800 rounded-xl border border-slate-700 p-4">
              <label className="block text-sm text-slate-400 mb-1.5 font-medium">
                Data Center Name
              </label>
              <div className="flex items-center gap-2">
                <Building2 className="w-5 h-5 text-emerald-400" />
                <input
                  type="text"
                  value={dcName}
                  onChange={(e) => setDcName(e.target.value)}
                  className="flex-1 bg-slate-900 border border-slate-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                  placeholder="Enter a name..."
                />
              </div>
            </div>

            {/* Rows */}
            {rows.map((row, idx) => {
              const rowStats = getRowStats(row);
              return (
                <div
                  key={row.id}
                  className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden"
                >
                  {/* Row header */}
                  <div
                    className="flex items-center justify-between px-4 py-3 cursor-pointer hover:bg-slate-750"
                    onClick={() => toggleCollapse(row.id)}
                  >
                    <div className="flex items-center gap-3">
                      <span className="bg-emerald-600 text-white text-xs font-bold px-2 py-1 rounded">
                        Row {idx + 1}
                      </span>
                      <span className="text-sm text-slate-300">
                        {rowStats.rack.name} x{row.rackCount} &middot;{" "}
                        {rowStats.cooling.name} &middot;{" "}
                        ${(rowStats.rackCost).toLocaleString()} invest
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          removeRow(row.id);
                        }}
                        className="p-1.5 rounded-lg text-red-400 hover:bg-red-900/30 transition-colors"
                        title="Remove row"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                      {row.collapsed ? (
                        <ChevronDown className="w-5 h-5 text-slate-500" />
                      ) : (
                        <ChevronUp className="w-5 h-5 text-slate-500" />
                      )}
                    </div>
                  </div>

                  {/* Row body */}
                  {!row.collapsed && (
                    <div className="border-t border-slate-700 p-4 space-y-4">
                      {/* Rack selection */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="flex items-center gap-1.5 text-sm text-slate-400 mb-1.5 font-medium">
                            <Server className="w-4 h-4" />
                            Rack Template
                          </label>
                          <select
                            value={row.rackTemplateId}
                            onChange={(e) =>
                              updateRow(row.id, { rackTemplateId: e.target.value })
                            }
                            className="w-full bg-slate-900 border border-slate-600 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-emerald-500"
                          >
                            {rackTemplates.map((rt) => (
                              <option key={rt.id} value={rt.id}>
                                {rt.name} (${rt.totalCost.toLocaleString()}/rack)
                              </option>
                            ))}
                          </select>
                          <p className="text-xs text-slate-500 mt-1">
                            {rowStats.rack.description}
                          </p>
                        </div>
                        <div>
                          <label className="text-sm text-slate-400 mb-1.5 font-medium block">
                            Number of Racks
                          </label>
                          <input
                            type="number"
                            min={1}
                            max={10}
                            value={row.rackCount}
                            onChange={(e) =>
                              updateRow(row.id, {
                                rackCount: Math.max(1, Math.min(10, Number(e.target.value))),
                              })
                            }
                            className="w-full bg-slate-900 border border-slate-600 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-emerald-500"
                          />
                        </div>
                      </div>

                      {/* Cooling */}
                      <div>
                        <label className="flex items-center gap-1.5 text-sm text-slate-400 mb-1.5 font-medium">
                          <Snowflake className="w-4 h-4" />
                          Cooling System
                        </label>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                          {coolingOptions.map((co) => (
                            <button
                              key={co.id}
                              onClick={() => updateRow(row.id, { coolingId: co.id })}
                              className={`text-left p-2.5 rounded-lg border text-xs transition-all ${
                                row.coolingId === co.id
                                  ? "border-emerald-500 bg-emerald-900/30 text-white"
                                  : "border-slate-600 bg-slate-900 text-slate-400 hover:border-slate-500"
                              }`}
                            >
                              <p className="font-bold text-sm">{co.name}</p>
                              <p className="text-slate-500">PUE {co.pue}</p>
                              <p className="text-amber-400">${co.monthlyCost.toLocaleString()}/mo</p>
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Network */}
                      <div>
                        <label className="flex items-center gap-1.5 text-sm text-slate-400 mb-1.5 font-medium">
                          <Wifi className="w-4 h-4" />
                          Network
                        </label>
                        <div className="grid grid-cols-3 gap-2">
                          {networkOptions.map((no) => (
                            <button
                              key={no.id}
                              onClick={() => updateRow(row.id, { networkId: no.id })}
                              className={`text-left p-2.5 rounded-lg border text-xs transition-all ${
                                row.networkId === no.id
                                  ? "border-emerald-500 bg-emerald-900/30 text-white"
                                  : "border-slate-600 bg-slate-900 text-slate-400 hover:border-slate-500"
                              }`}
                            >
                              <p className="font-bold text-sm">{no.name}</p>
                              <p className="text-slate-500">{no.speed}</p>
                              <p className="text-amber-400">${no.monthlyCost.toLocaleString()}/mo</p>
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Redundancy */}
                      <div>
                        <label className="flex items-center gap-1.5 text-sm text-slate-400 mb-1.5 font-medium">
                          <ShieldCheck className="w-4 h-4" />
                          Power Redundancy
                        </label>
                        <div className="grid grid-cols-3 gap-2">
                          {redundancyOptions.map((ro) => (
                            <button
                              key={ro.id}
                              onClick={() => updateRow(row.id, { redundancyId: ro.id })}
                              className={`text-left p-2.5 rounded-lg border text-xs transition-all ${
                                row.redundancyId === ro.id
                                  ? "border-emerald-500 bg-emerald-900/30 text-white"
                                  : "border-slate-600 bg-slate-900 text-slate-400 hover:border-slate-500"
                              }`}
                            >
                              <p className="font-bold text-sm">{ro.name}</p>
                              <p className="text-slate-500">{ro.uptime}% uptime</p>
                              <p className="text-amber-400">
                                {ro.monthlyCost > 0
                                  ? `$${ro.monthlyCost.toLocaleString()}/mo`
                                  : "Free"}
                              </p>
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Row summary */}
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 border-t border-slate-700">
                        <div className="text-center">
                          <p className="text-xs text-slate-500">Investment</p>
                          <p className="text-sm font-bold text-white">
                            ${rowStats.rackCost.toLocaleString()}
                          </p>
                        </div>
                        <div className="text-center">
                          <p className="text-xs text-slate-500">Revenue/mo</p>
                          <p className="text-sm font-bold text-emerald-400">
                            ${rowStats.monthlyRevenue.toLocaleString()}
                          </p>
                        </div>
                        <div className="text-center">
                          <p className="text-xs text-slate-500">OpEx/mo</p>
                          <p className="text-sm font-bold text-red-400">
                            ${rowStats.monthlyOpex.toLocaleString()}
                          </p>
                        </div>
                        <div className="text-center">
                          <p className="text-xs text-slate-500">Power</p>
                          <p className="text-sm font-bold text-cyan-400">
                            {(rowStats.totalPower / 1000).toFixed(1)} kW
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}

            {/* Add Row */}
            {rows.length < 4 && (
              <button
                onClick={addRow}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl border-2 border-dashed border-slate-600 text-slate-400 hover:border-emerald-500 hover:text-emerald-400 transition-colors"
              >
                <Plus className="w-5 h-5" />
                Add Row ({rows.length}/4)
              </button>
            )}

            {/* Submit */}
            <button
              onClick={handleSubmit}
              disabled={rows.length === 0}
              className="w-full flex items-center justify-center gap-3 py-4 rounded-xl bg-gradient-to-r from-amber-600 to-emerald-600 hover:from-amber-500 hover:to-emerald-500 text-white font-extrabold text-lg transition-all disabled:opacity-40 disabled:cursor-not-allowed shadow-lg shadow-emerald-500/20"
            >
              <Rocket className="w-6 h-6" />
              Pitch to Investors!
            </button>
          </div>

          {/* ─── Right: Live Dashboard ────────────────────────────────── */}
          <div className="space-y-4">
            <h2 className="text-lg font-bold flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-emerald-400" />
              Live Dashboard
            </h2>

            {/* Budget vs Investment */}
            <div className="bg-slate-800 rounded-xl border border-slate-700 p-4">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-slate-400">Investment</span>
                <span
                  className={`font-bold ${
                    stats.totalInvestment > BUDGET
                      ? "text-red-400"
                      : "text-emerald-400"
                  }`}
                >
                  ${stats.totalInvestment.toLocaleString()}
                </span>
              </div>
              <div className="h-3 bg-slate-700 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-300 ${
                    stats.totalInvestment > BUDGET
                      ? "bg-red-500"
                      : "bg-emerald-500"
                  }`}
                  style={{
                    width: `${Math.min(100, (stats.totalInvestment / BUDGET) * 100)}%`,
                  }}
                />
              </div>
              <p className="text-xs text-slate-500 mt-1 text-right">
                Budget: ${BUDGET.toLocaleString()}
              </p>
            </div>

            {/* Stats cards */}
            {[
              {
                icon: DollarSign,
                label: "Monthly Revenue",
                value: `$${stats.totalMonthlyRevenue.toLocaleString()}`,
                color: "text-emerald-400",
              },
              {
                icon: TrendingUp,
                label: "Monthly OpEx",
                value: `$${stats.totalMonthlyOpex.toLocaleString()}`,
                color: "text-red-400",
              },
              {
                icon: DollarSign,
                label: "Monthly Profit",
                value: `$${stats.monthlyProfit.toLocaleString()}`,
                color: stats.monthlyProfit >= 0 ? "text-emerald-400" : "text-red-400",
              },
              {
                icon: TrendingUp,
                label: "Annual ROI",
                value: `${stats.annualROI.toFixed(1)}%`,
                color: stats.annualROI >= 0 ? "text-emerald-400" : "text-red-400",
              },
              {
                icon: Timer,
                label: "Payback Period",
                value:
                  stats.paybackMonths === Infinity
                    ? "Never"
                    : `${stats.paybackMonths} months`,
                color:
                  stats.paybackMonths <= 12
                    ? "text-emerald-400"
                    : stats.paybackMonths <= 24
                    ? "text-amber-400"
                    : "text-red-400",
              },
              {
                icon: Zap,
                label: "Average PUE",
                value: stats.avgPue.toFixed(2),
                color:
                  stats.avgPue <= 1.3
                    ? "text-emerald-400"
                    : stats.avgPue <= 1.6
                    ? "text-amber-400"
                    : "text-red-400",
              },
              {
                icon: Shield,
                label: "Uptime SLA",
                value: `${stats.uptimeMin}%`,
                color:
                  stats.uptimeMin >= 99.99
                    ? "text-emerald-400"
                    : stats.uptimeMin >= 99.9
                    ? "text-amber-400"
                    : "text-red-400",
              },
            ].map((card) => {
              const Icon = card.icon;
              return (
                <div
                  key={card.label}
                  className="bg-slate-800 rounded-xl border border-slate-700 p-3 flex items-center justify-between"
                >
                  <div className="flex items-center gap-2">
                    <Icon className="w-4 h-4 text-slate-500" />
                    <span className="text-sm text-slate-400">{card.label}</span>
                  </div>
                  <span className={`font-bold text-sm ${card.color}`}>
                    {card.value}
                  </span>
                </div>
              );
            })}

            {/* Scoring preview */}
            <div className="bg-slate-800 rounded-xl border border-amber-500/30 p-4">
              <h3 className="text-sm font-bold text-amber-400 mb-2 flex items-center gap-1.5">
                <Trophy className="w-4 h-4" />
                Scoring Breakdown
              </h3>
              <ul className="text-xs text-slate-400 space-y-1">
                <li>Profitability &mdash; 400 pts (40%)</li>
                <li>PUE Efficiency &mdash; 200 pts (20%)</li>
                <li>Uptime SLA &mdash; 150 pts (15%)</li>
                <li>Budget Usage &mdash; 150 pts (15%)</li>
                <li>Rack Diversity &mdash; 100 pts (10%)</li>
              </ul>
              <p className="text-slate-500 text-xs mt-2">Total: 1000 points</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
