"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import Link from "next/link";
import {
  Cpu, Gamepad2, Trophy, Star, Check, X, ChevronDown, ChevronUp, Lock,
  Sparkles, Cloud, Calculator, Timer, Zap, Shield, AlertTriangle, Activity, DollarSign,
  GraduationCap,
} from "lucide-react";
import { cpus, rams, storages, gpus, networkCards, powerSupplies } from "@/lib/data/components";
import { workloads } from "@/lib/data/workloads";
import {
  cpuAdvanced, ramAdvanced, storageAdvanced, gpuAdvanced, psuAdvanced,
  workloadAdvanced, computeTCO, type TCOBreakdown,
} from "@/lib/data/advanced-components";
import {
  findOptimalBuild, computeBuildMetrics, computeProfitabilityScore,
  type OptimalBuildResult, type BuildMetrics,
} from "@/lib/data/optimal-builds";
import { AchievementToast, type Achievement } from "@/components/AchievementToast";
import type { CPUSpec, RAMSpec, StorageSpec, GPUSpec, NetworkCard, PowerSupply } from "@/lib/types";

// ─── Advanced Challenges ───
interface AdvancedChallenge {
  id: string;
  name: string;
  scenario: string;
  difficulty: number;
  budget: number;
  workloadId: string;
  hook: string;  // One-liner explaining the advanced twist
}

const advancedChallenges: AdvancedChallenge[] = [
  { id: "ach1", name: "Bank Database — 3-Year TCO", difficulty: 3, budget: 8000,
    workloadId: "wl-db",
    scenario: "KidBank needs a bulletproof database with 99.99% uptime. Think LONG-TERM: the cheapest upfront isn't always cheapest over 3 years.",
    hook: "Failures + support contracts matter more than sticker price." },
  { id: "ach2", name: "Streaming Platform — Failure Survival", difficulty: 4, budget: 12000,
    workloadId: "wl-video",
    scenario: "PetTube serves 1M viewers. Every hour of downtime costs $2,000 in lost ad revenue. Build for reliability, not just performance.",
    hook: "Downtime cost > hardware cost if you pick wrong." },
  { id: "ach3", name: "AI Lab — OpEx Minimizer", difficulty: 5, budget: 50000,
    workloadId: "wl-ai",
    scenario: "Research lab trains models 24/7. Electricity is 40% of TCO over 3 years. Can you squeeze more performance per watt?",
    hook: "Every watt = $$ over 3 years." },
];

export default function DemoAdvancedPage() {
  // Challenge state
  const [selectedChallenge, setSelectedChallenge] = useState<AdvancedChallenge>(advancedChallenges[0]);
  const BUDGET = selectedChallenge.budget;
  const challengeWorkload = useMemo(() => workloads.find(w => w.id === selectedChallenge.workloadId) ?? workloads[0], [selectedChallenge]);
  const wlAdvanced = workloadAdvanced[selectedChallenge.workloadId] ?? { downtimeCostPerHour: 500, requiredUptime: 0.999 };

  // Build state
  const [selectedCPU, setSelectedCPU] = useState<CPUSpec | null>(null);
  const [selectedRAM, setSelectedRAM] = useState<RAMSpec[]>([]);
  const [selectedStorage, setSelectedStorage] = useState<StorageSpec[]>([]);
  const [selectedGPU, setSelectedGPU] = useState<GPUSpec | null>(null);
  const [selectedNIC, setSelectedNIC] = useState<NetworkCard | null>(null);
  const [selectedPSU, setSelectedPSU] = useState<PowerSupply | null>(null);

  // Advanced mode specific
  const [supportTier, setSupportTier] = useState<"basic" | "standard" | "premium">("standard");

  // Results state
  const [buildSubmitted, setBuildSubmitted] = useState(false);
  const [buildScore, setBuildScore] = useState(0);
  const [tcoResult, setTcoResult] = useState<TCOBreakdown | null>(null);
  const [advancedFeedback, setAdvancedFeedback] = useState<Array<{ type: "good" | "bad" | "info"; text: string }>>([]);
  const [showIntro, setShowIntro] = useState(true);

  // Achievements
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const unlock = (a: Achievement) => {
    setAchievements((prev) => prev.some((p) => p.id === a.id) ? prev : [...prev, a]);
  };

  // Computed
  const totalCost = useMemo(() => {
    let c = 0;
    if (selectedCPU) c += selectedCPU.price;
    c += selectedRAM.reduce((s, r) => s + r.price, 0);
    c += selectedStorage.reduce((s, d) => s + d.price, 0);
    if (selectedGPU) c += selectedGPU.price;
    if (selectedNIC) c += selectedNIC.price;
    if (selectedPSU) c += selectedPSU.price;
    return c;
  }, [selectedCPU, selectedRAM, selectedStorage, selectedGPU, selectedNIC, selectedPSU]);

  const totalPower = useMemo(() => {
    let p = 0;
    if (selectedCPU) p += selectedCPU.tdp;
    if (selectedGPU) p += selectedGPU.tdp;
    p += selectedRAM.length * 10;
    p += selectedStorage.length * 15;
    if (selectedNIC) p += 25;
    return p;
  }, [selectedCPU, selectedGPU, selectedRAM, selectedStorage, selectedNIC]);

  const componentsPicked = (selectedCPU ? 1 : 0) + selectedRAM.length + selectedStorage.length +
    (selectedGPU ? 1 : 0) + (selectedNIC ? 1 : 0) + (selectedPSU ? 1 : 0);

  const budgetLeft = BUDGET - totalCost;

  // Live TCO preview (updates as components change)
  const liveTCO = useMemo((): TCOBreakdown | null => {
    if (componentsPicked === 0) return null;
    const components: Array<{ advanced?: import("@/lib/types").AdvancedSpec }> = [];
    if (selectedCPU) components.push({ advanced: cpuAdvanced[selectedCPU.id] });
    for (const r of selectedRAM) components.push({ advanced: ramAdvanced[r.id] });
    for (const s of selectedStorage) components.push({ advanced: storageAdvanced[s.id] });
    if (selectedGPU) components.push({ advanced: gpuAdvanced[selectedGPU.id] });
    if (selectedPSU) components.push({ advanced: psuAdvanced[selectedPSU.id] });

    return computeTCO({
      hardwareCost: totalCost,
      powerWatts: totalPower,
      components,
      supportTier,
      downtimeCostPerHour: wlAdvanced.downtimeCostPerHour,
    });
  }, [selectedCPU, selectedRAM, selectedStorage, selectedGPU, selectedPSU, totalCost, totalPower, supportTier, wlAdvanced.downtimeCostPerHour, componentsPicked]);

  const resetBuild = () => {
    setSelectedCPU(null);
    setSelectedRAM([]);
    setSelectedStorage([]);
    setSelectedGPU(null);
    setSelectedNIC(null);
    setSelectedPSU(null);
    setBuildSubmitted(false);
    setBuildScore(0);
    setTcoResult(null);
    setAdvancedFeedback([]);
  };

  const switchChallenge = (ch: AdvancedChallenge) => {
    setSelectedChallenge(ch);
    resetBuild();
  };

  const submitBuild = () => {
    const metrics = computeBuildMetrics(
      selectedCPU, selectedRAM, selectedStorage, selectedGPU, selectedNIC, selectedPSU,
      challengeWorkload.id,
    );
    const optimal = findOptimalBuild(challengeWorkload.id, BUDGET);
    const baseScore = computeProfitabilityScore(metrics, optimal?.metrics ?? null, true);

    // Advanced score adjustments
    const feedback: Array<{ type: "good" | "bad" | "info"; text: string }> = [];
    let advancedScore = baseScore.total;
    const overBudget = metrics.totalCost > BUDGET;

    // Over-budget penalty — you can't afford hardware you can't afford
    if (overBudget) {
      feedback.push({ type: "bad", text: `Over budget by $${(metrics.totalCost - BUDGET).toLocaleString()} — investors won't fund this.` });
      advancedScore = Math.max(0, Math.round(advancedScore * 0.5));
    }

    if (!metrics.meetsRequirements) {
      feedback.push({ type: "bad", text: `Build doesn't meet ${challengeWorkload.name} requirements — no profit possible.` });
    }

    // TCO bonus/penalty based on total TCO
    if (liveTCO && metrics.meetsRequirements && !overBudget) {
      // Compare to revenue: if 3-year TCO < 3-year revenue, profitable
      const threeYearRevenue = metrics.monthlyRevenue * 36;
      const tcoToRevenueRatio = liveTCO.total / threeYearRevenue;

      if (tcoToRevenueRatio < 0.4) {
        feedback.push({ type: "good", text: "Excellent TCO! Your costs are well under revenue." });
        advancedScore = Math.min(100, advancedScore + 10);
      } else if (tcoToRevenueRatio < 0.6) {
        feedback.push({ type: "good", text: "Good TCO management." });
      } else if (tcoToRevenueRatio < 0.8) {
        feedback.push({ type: "bad", text: "TCO is high — support costs or power may be eating profits." });
        advancedScore = Math.max(0, advancedScore - 5);
      } else {
        feedback.push({ type: "bad", text: "TCO exceeds 80% of revenue. This build won't be profitable!" });
        advancedScore = Math.max(0, advancedScore - 15);
      }

      // Support tier appropriateness
      if (wlAdvanced.requiredUptime >= 0.9999 && supportTier !== "premium") {
        feedback.push({ type: "bad", text: `Critical workload needs PREMIUM support — you picked ${supportTier}.` });
        advancedScore = Math.max(0, advancedScore - 8);
      } else if (wlAdvanced.requiredUptime < 0.999 && supportTier === "premium") {
        feedback.push({ type: "bad", text: "Premium support is overkill for this workload. You overspent on support." });
        advancedScore = Math.max(0, advancedScore - 5);
      } else if (
        (wlAdvanced.requiredUptime >= 0.9999 && supportTier === "premium") ||
        (wlAdvanced.requiredUptime >= 0.999 && wlAdvanced.requiredUptime < 0.9999 && supportTier === "standard") ||
        (wlAdvanced.requiredUptime < 0.999 && supportTier === "basic")
      ) {
        feedback.push({ type: "good", text: "Support tier matches workload criticality. Smart!" });
        advancedScore = Math.min(100, advancedScore + 5);
      }

      // Failure cost penalty
      if (liveTCO.failures > metrics.totalCost * 0.3) {
        feedback.push({ type: "bad", text: "Your components fail too often — replacement costs are eating profits." });
        advancedScore = Math.max(0, advancedScore - 5);
      }

      // Power efficiency
      if (liveTCO.power > metrics.totalCost * 0.8) {
        feedback.push({ type: "info", text: "Power costs dominate your TCO — consider lower-TDP components." });
      }
    }

    // Achievements
    if (advancedScore >= 85) {
      unlock({ id: "tco-master", emoji: "📊", title: "TCO Master!", description: "Scored 85+ in advanced mode!" });
    }
    if (liveTCO && liveTCO.total < metrics.monthlyRevenue * 36 * 0.5 && metrics.meetsRequirements) {
      unlock({ id: "efficiency-guru", emoji: "⚡", title: "Efficiency Guru!", description: "TCO under 50% of revenue!" });
    }

    setTcoResult(liveTCO);
    setBuildScore(advancedScore);
    setAdvancedFeedback(feedback);
    setBuildSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-slate-900">
      <AchievementToast achievements={achievements} />

      {/* Advanced Mode Banner — clean, enterprise indigo */}
      <div className="bg-indigo-500/10 border-b border-indigo-500/30 text-center py-1.5 px-4 text-xs text-indigo-300 flex items-center justify-center gap-2">
        <GraduationCap className="w-3.5 h-3.5" />
        <span className="font-semibold">Advanced Mode</span>
        <span className="text-slate-400">· TCO · Failure Rates · Support Contracts</span>
        <Link href="/demo" className="text-indigo-400 font-semibold hover:underline ml-1">← Standard Demo</Link>
      </div>

      {/* Header */}
      <div className="bg-slate-800 border-b border-slate-700">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-md bg-indigo-600 flex items-center justify-center">
              <Shield className="w-4 h-4 text-white" />
            </div>
            <div>
              <h1 className="text-base font-semibold text-white">Advanced Challenge</h1>
              <p className="text-xs text-slate-400">Design for total cost of ownership, not just specs</p>
            </div>
          </div>
          <Link href="/" className="text-slate-400 hover:text-white text-xs">← Home</Link>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-6">
        {/* Intro Panel */}
        {showIntro && (
          <div className="bg-slate-800 border border-slate-700 rounded-lg p-6 mb-4 relative">
            <button onClick={() => setShowIntro(false)} className="absolute top-4 right-4 text-slate-400 hover:text-white">
              <X className="w-4 h-4" />
            </button>
            <h2 className="text-lg font-semibold text-white mb-2 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-indigo-400" />
              Welcome to Advanced Mode
            </h2>
            <p className="text-slate-300 text-sm mb-3">
              Real data centers don&apos;t just worry about specs. They track <strong className="text-white">Total Cost of Ownership (TCO)</strong> over 3 years: hardware, power, failures, support contracts, and downtime.
            </p>
            <div className="grid md:grid-cols-2 gap-3 mt-4">
              <InfoCard icon={<Activity className="w-5 h-5 text-purple-400" />} title="Failure Rates (MTBF)" desc="Every component has a Mean Time Between Failures. A $50 PSU that fails yearly costs more than a $400 PSU that lasts 10 years." />
              <InfoCard icon={<Shield className="w-5 h-5 text-purple-400" />} title="Support Contracts" desc="Basic / Standard / Premium tiers. A critical bank needs 1-hour response. A blog can survive 48 hours." />
              <InfoCard icon={<DollarSign className="w-5 h-5 text-purple-400" />} title="Power Costs" desc="Electricity @ $0.12/kWh. A 500W build costs $1,576 in power over 3 years." />
              <InfoCard icon={<AlertTriangle className="w-5 h-5 text-purple-400" />} title="Downtime Cost" desc="Every minute of outage costs real money. Banks lose $5,000/hour. Match support tier to criticality!" />
            </div>
          </div>
        )}

        {/* Challenge Selector */}
        <div className="bg-slate-800 border border-slate-700 rounded-xl p-4 mb-4">
          <h3 className="text-white font-bold mb-3">Choose Your Advanced Challenge</h3>
          <div className="grid md:grid-cols-3 gap-2">
            {advancedChallenges.map((ch) => (
              <button key={ch.id} onClick={() => switchChallenge(ch)}
                className={`text-left p-3 rounded-lg border transition-all ${selectedChallenge.id === ch.id ? "border-purple-500 bg-purple-500/10 selected-glow" : "border-slate-600 hover:border-slate-500"}`}>
                <div className="flex gap-0.5 mb-1">
                  {Array.from({ length: 5 }).map((_, s) => (
                    <Star key={s} className={`w-3 h-3 ${s < ch.difficulty ? "text-amber-400 fill-amber-400" : "text-slate-700"}`} />
                  ))}
                </div>
                <div className="text-white text-sm font-medium">{ch.name}</div>
                <div className="text-purple-400 text-xs">${ch.budget.toLocaleString()}</div>
                <div className="text-amber-300/70 text-[10px] mt-1 italic">💡 {ch.hook}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Challenge Brief */}
        <div className="bg-gradient-to-r from-purple-900/30 to-indigo-900/30 border border-purple-500/20 rounded-xl p-4 mb-4">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <h3 className="text-lg font-bold text-white mb-1">{selectedChallenge.name} {challengeWorkload.icon}</h3>
              <p className="text-sm text-slate-300 mb-3">{selectedChallenge.scenario}</p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs">
                <Pill label="CPU" value={`${challengeWorkload.requiredCPUCores}+ cores`} />
                <Pill label="RAM" value={`${challengeWorkload.requiredRAM}+ GB`} />
                <Pill label="Storage" value={`${challengeWorkload.requiredStorage}+ TB`} />
                <Pill label="SLA" value={`${(wlAdvanced.requiredUptime * 100).toFixed(2)}% uptime`} color="text-purple-300" />
                <Pill label="Downtime" value={`$${wlAdvanced.downtimeCostPerHour}/hr`} color="text-red-300" />
                <Pill label="Revenue" value={`$${challengeWorkload.revenuePerMonth.toLocaleString()}/mo`} color="text-emerald-300" />
              </div>
            </div>
            <div className="text-right flex-shrink-0">
              <div className="text-purple-400 font-bold text-lg">${BUDGET.toLocaleString()}</div>
              <div className="text-slate-500 text-xs">hardware budget</div>
            </div>
          </div>
        </div>

        {!buildSubmitted && (
          <>
            {/* Support Tier Picker */}
            <div className="bg-slate-800 border border-slate-700 rounded-xl p-4 mb-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-white font-bold flex items-center gap-2">
                  <Shield className="w-5 h-5 text-purple-400" /> Support Contract Tier
                </h3>
                <span className="text-slate-400 text-xs">Match criticality to response time</span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {(["basic", "standard", "premium"] as const).map((tier) => {
                  const details: Record<string, { label: string; response: string; desc: string; cost: string }> = {
                    basic: { label: "Basic", response: "48 hr response", desc: "Cheapest — for low-priority workloads", cost: "~5% of hw" },
                    standard: { label: "Standard", response: "8 hr response", desc: "Balanced — most common choice", cost: "~12% of hw" },
                    premium: { label: "Premium", response: "1 hr response", desc: "Critical systems — expensive but fast", cost: "~25% of hw" },
                  };
                  const d = details[tier];
                  return (
                    <button key={tier} onClick={() => setSupportTier(tier)}
                      className={`text-left p-3 rounded-lg border-2 transition-all ${supportTier === tier ? "border-purple-500 bg-purple-500/10" : "border-slate-600 hover:border-slate-500"}`}>
                      <div className="text-white font-bold text-sm mb-0.5">{d.label}</div>
                      <div className="text-purple-300 text-xs font-mono">{d.response}</div>
                      <div className="text-slate-400 text-xs mt-1">{d.desc}</div>
                      <div className="text-amber-400 text-[10px] mt-1">{d.cost}/year</div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Component Grid */}
            <div className="grid lg:grid-cols-3 gap-4">
              <div className="lg:col-span-2 space-y-4">
                {/* CPU */}
                <AdvSection title="CPU" icon="🧠" selected={selectedCPU?.name}>
                  <div className="grid sm:grid-cols-2 gap-2">
                    {cpus.map((c) => (
                      <AdvCompCard key={c.id} component={c} selected={selectedCPU?.id === c.id}
                        onSelect={() => setSelectedCPU(c)}
                        specs={[`${c.cores}c/${c.clockSpeed}GHz`, `${c.tdp}W`]}
                        advanced={cpuAdvanced[c.id]} />
                    ))}
                  </div>
                </AdvSection>

                {/* RAM */}
                <AdvSection title={`RAM (${selectedRAM.length}/4)`} icon="📋" selected={selectedRAM.length > 0 ? `${selectedRAM.length} sticks` : undefined}>
                  <div className="grid sm:grid-cols-2 gap-2">
                    {rams.map((r) => (
                      <AdvCompCard key={r.id} component={r}
                        selected={false}
                        onSelect={() => { if (selectedRAM.length < 4) setSelectedRAM((prev) => [...prev, r]); }}
                        disabled={selectedRAM.length >= 4}
                        specs={[`${r.capacity}GB`, r.type]}
                        advanced={ramAdvanced[r.id]} />
                    ))}
                  </div>
                  {selectedRAM.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-2">
                      {selectedRAM.map((r, i) => (
                        <span key={i} className="bg-emerald-500/20 text-emerald-400 text-xs px-2 py-1 rounded flex items-center gap-1">
                          {r.name} <button onClick={() => setSelectedRAM((prev) => prev.filter((_, j) => j !== i))} className="text-red-400 hover:text-red-300">×</button>
                        </span>
                      ))}
                    </div>
                  )}
                </AdvSection>

                {/* Storage */}
                <AdvSection title={`Storage (${selectedStorage.length}/4)`} icon="🗄️" selected={selectedStorage.length > 0 ? `${selectedStorage.length} drives` : undefined}>
                  <div className="grid sm:grid-cols-2 gap-2">
                    {storages.map((s) => (
                      <AdvCompCard key={s.id} component={s}
                        selected={false}
                        onSelect={() => { if (selectedStorage.length < 4) setSelectedStorage((prev) => [...prev, s]); }}
                        disabled={selectedStorage.length >= 4}
                        specs={[s.type, `${s.capacity}TB`]}
                        advanced={storageAdvanced[s.id]} />
                    ))}
                  </div>
                  {selectedStorage.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-2">
                      {selectedStorage.map((s, i) => (
                        <span key={i} className="bg-blue-500/20 text-blue-400 text-xs px-2 py-1 rounded flex items-center gap-1">
                          {s.name} <button onClick={() => setSelectedStorage((prev) => prev.filter((_, j) => j !== i))} className="text-red-400 hover:text-red-300">×</button>
                        </span>
                      ))}
                    </div>
                  )}
                </AdvSection>

                {/* GPU */}
                <AdvSection title="GPU" icon="🎨" selected={selectedGPU?.name}>
                  <div className="grid sm:grid-cols-2 gap-2">
                    {gpus.map((g) => (
                      <AdvCompCard key={g.id} component={g} selected={selectedGPU?.id === g.id}
                        onSelect={() => setSelectedGPU(g)}
                        specs={[`${g.vram}GB VRAM`, `${g.tdp}W`]}
                        advanced={gpuAdvanced[g.id]} />
                    ))}
                  </div>
                </AdvSection>

                {/* NIC */}
                <AdvSection title="Network Card" icon="🛣️" selected={selectedNIC?.name}>
                  <div className="grid sm:grid-cols-2 gap-2">
                    {networkCards.map((n) => (
                      <AdvCompCard key={n.id} component={n} selected={selectedNIC?.id === n.id}
                        onSelect={() => setSelectedNIC(n)}
                        specs={[`${n.speed} Gbps`, `${n.ports} ports`]}
                        advanced={undefined} />
                    ))}
                  </div>
                </AdvSection>

                {/* PSU */}
                <AdvSection title="Power Supply" icon="❤️" selected={selectedPSU?.name}>
                  <div className="grid sm:grid-cols-2 gap-2">
                    {powerSupplies.map((p) => (
                      <AdvCompCard key={p.id} component={p} selected={selectedPSU?.id === p.id}
                        onSelect={() => setSelectedPSU(p)}
                        specs={[`${p.wattage}W`, p.efficiency]}
                        advanced={psuAdvanced[p.id]} />
                    ))}
                  </div>
                </AdvSection>
              </div>

              {/* Sidebar — Live TCO */}
              <div className="lg:col-span-1">
                <div className="bg-slate-800 border border-slate-700 rounded-xl p-4 sticky top-4 space-y-3">
                  <h3 className="text-white font-bold">Build Status</h3>

                  {/* Budget bar */}
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-slate-400">Hardware Budget</span>
                      <span className={budgetLeft < 0 ? "text-red-400" : "text-emerald-400"}>
                        ${budgetLeft.toLocaleString()} / ${BUDGET.toLocaleString()}
                      </span>
                    </div>
                    <div className="w-full bg-slate-700 rounded-full h-2">
                      <div className={`h-2 rounded-full transition-all ${budgetLeft < 0 ? "bg-red-500" : "bg-purple-500"}`} style={{ width: `${Math.max(0, Math.min(100, (budgetLeft / BUDGET) * 100))}%` }} />
                    </div>
                  </div>

                  {/* Power */}
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-400">Total Power</span>
                    <span className="text-amber-400 font-bold">{totalPower}W</span>
                  </div>

                  {/* Live TCO Bar */}
                  {liveTCO && (
                    <div className="border-t border-slate-700 pt-3">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="text-purple-300 font-bold text-xs uppercase flex items-center gap-1">
                          <Activity className="w-3 h-3" /> 3-Year TCO
                        </h4>
                        <span className="text-white font-bold text-sm">${liveTCO.total.toLocaleString()}</span>
                      </div>
                      <TCOBar tco={liveTCO} />
                      <div className="space-y-0.5 mt-2 text-[10px]">
                        <TCOLine label="Hardware" value={liveTCO.hardware} color="bg-blue-500" total={liveTCO.total} />
                        <TCOLine label="Power" value={liveTCO.power} color="bg-amber-500" total={liveTCO.total} />
                        <TCOLine label="Support" value={liveTCO.support} color="bg-purple-500" total={liveTCO.total} />
                        <TCOLine label="Failures" value={liveTCO.failures} color="bg-red-500" total={liveTCO.total} />
                        <TCOLine label="Downtime" value={liveTCO.downtime} color="bg-pink-500" total={liveTCO.total} />
                      </div>
                    </div>
                  )}

                  <button onClick={submitBuild} disabled={!selectedCPU}
                    className="w-full bg-purple-600 text-white font-bold py-3 rounded-xl hover:bg-purple-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
                    Analyze Build 📊
                  </button>
                  <button onClick={resetBuild} className="w-full bg-slate-700 text-slate-300 py-2 rounded-lg text-sm hover:bg-slate-600">
                    Reset Build
                  </button>
                </div>
              </div>
            </div>
          </>
        )}

        {/* Results Screen */}
        {buildSubmitted && (
          <div className="max-w-3xl mx-auto bg-slate-800 border border-slate-700 rounded-xl p-6 animate-fade-in-up">
            <div className="text-center mb-6">
              <Trophy className="w-14 h-14 text-purple-400 mx-auto mb-3" />
              <h2 className="text-2xl font-bold text-white mb-2">Advanced Analysis Complete</h2>
              <p className="text-5xl font-black text-purple-400 mb-2">{buildScore}/100</p>
              <p className={`text-sm font-bold ${buildScore >= 85 ? "text-emerald-400" : buildScore >= 70 ? "text-amber-400" : "text-red-400"}`}>
                {buildScore >= 85 ? "🏆 TCO Champion" : buildScore >= 70 ? "⭐ Solid Build" : "📚 Keep Optimizing"}
              </p>
            </div>

            {/* 3-Year TCO Breakdown — the star of the advanced mode */}
            {tcoResult && (
              <div className="bg-gradient-to-br from-purple-950/40 to-indigo-950/30 border border-purple-500/40 rounded-xl p-5 mb-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-white font-bold flex items-center gap-2">
                    <Activity className="w-5 h-5 text-purple-400" /> 3-Year Total Cost of Ownership
                  </h3>
                  <span className="text-purple-300 font-bold text-xl">${tcoResult.total.toLocaleString()}</span>
                </div>

                {/* Big stacked bar */}
                <div className="mb-3">
                  <TCOBar tco={tcoResult} />
                </div>

                {/* Breakdown table */}
                <div className="space-y-1 mb-3">
                  <TCOLine label="Hardware (one-time)" value={tcoResult.hardware} color="bg-blue-500" total={tcoResult.total} />
                  <TCOLine label="Power (3 years @ $0.12/kWh)" value={tcoResult.power} color="bg-amber-500" total={tcoResult.total} />
                  <TCOLine label={`Support Contract (${supportTier})`} value={tcoResult.support} color="bg-purple-500" total={tcoResult.total} />
                  <TCOLine label="Expected Failures + Replacements" value={tcoResult.failures} color="bg-red-500" total={tcoResult.total} />
                  <TCOLine label="Downtime Revenue Loss" value={tcoResult.downtime} color="bg-pink-500" total={tcoResult.total} />
                </div>

                {/* Revenue comparison — only valid if build meets reqs AND within budget */}
                {(() => {
                  const metrics = computeBuildMetrics(selectedCPU, selectedRAM, selectedStorage, selectedGPU, selectedNIC, selectedPSU, challengeWorkload.id);
                  const overBudget = metrics.totalCost > BUDGET;
                  const canRun = metrics.meetsRequirements && !overBudget;
                  if (!canRun) {
                    return (
                      <div className="border-t border-purple-500/20 pt-3">
                        <p className="text-xs text-amber-300 flex items-start gap-2">
                          <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                          {overBudget
                            ? "This build is over budget — you can't actually deploy it, so there's no revenue."
                            : "This build doesn't meet workload requirements — the workload won't run, so no revenue is earned."}
                        </p>
                      </div>
                    );
                  }
                  const threeYearRevenue = challengeWorkload.revenuePerMonth * 36;
                  const profit = threeYearRevenue - tcoResult.total;
                  return (
                    <div className="border-t border-purple-500/20 pt-3 space-y-1">
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-400">3-Year Revenue</span>
                        <span className="text-emerald-400 font-bold">${threeYearRevenue.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-400">3-Year TCO</span>
                        <span className="text-red-400 font-bold">-${tcoResult.total.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between text-base font-bold border-t border-purple-500/20 pt-2">
                        <span className="text-white">3-Year Profit</span>
                        <span className={profit > 0 ? "text-emerald-400" : "text-red-400"}>
                          ${profit.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  );
                })()}
              </div>
            )}

            {/* Feedback messages */}
            {advancedFeedback.length > 0 && (
              <div className="bg-slate-900/40 rounded-lg p-4 mb-4">
                <h4 className="text-white font-bold text-sm mb-2 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-400" /> Analysis
                </h4>
                <div className="space-y-1.5">
                  {advancedFeedback.map((f, i) => (
                    <p key={i} className="text-xs text-slate-300 flex items-start gap-2">
                      {f.type === "good"
                        ? <Check className="w-3.5 h-3.5 text-emerald-400 mt-0.5 flex-shrink-0" />
                        : f.type === "bad"
                          ? <X className="w-3.5 h-3.5 text-red-400 mt-0.5 flex-shrink-0" />
                          : <AlertTriangle className="w-3.5 h-3.5 text-amber-400 mt-0.5 flex-shrink-0" />}
                      <span>{f.text}</span>
                    </p>
                  ))}
                </div>
              </div>
            )}

            {/* Key Lessons */}
            <div className="bg-amber-950/30 border border-amber-700/30 rounded-lg p-4 mb-4">
              <h4 className="text-amber-300 font-bold text-sm mb-2">🎓 What this teaches you</h4>
              <ul className="text-xs text-amber-200/80 space-y-1">
                <li>• <strong>Sticker price ≠ total cost</strong>. A $50 PSU that fails yearly costs more than a $400 PSU that lasts 10 years.</li>
                <li>• <strong>Support contracts are insurance</strong>. Match them to workload criticality, not always premium.</li>
                <li>• <strong>Power is the hidden tax</strong>. A 500W build burns $1,576 in electricity over 3 years.</li>
                <li>• <strong>Downtime is expensive</strong>. Every hour offline costs real revenue — plan for failures.</li>
              </ul>
            </div>

            <div className="flex gap-3">
              <button onClick={resetBuild} className="flex-1 bg-slate-700 text-white py-2 rounded-lg hover:bg-slate-600">
                Try Again
              </button>
              {advancedChallenges.findIndex(c => c.id === selectedChallenge.id) < advancedChallenges.length - 1 && (
                <button onClick={() => switchChallenge(advancedChallenges[advancedChallenges.findIndex(c => c.id === selectedChallenge.id) + 1])}
                  className="flex-1 bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-500 font-bold">
                  Next Challenge →
                </button>
              )}
              <Link href="/demo" className="flex-1 bg-slate-700 text-white py-2 rounded-lg hover:bg-slate-600 text-center">
                Back to Standard Demo
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function InfoCard({ icon, title, desc }: { icon: React.ReactNode; title: string; desc: string }) {
  return (
    <div className="bg-slate-800/50 rounded-lg p-3 border border-slate-700">
      <div className="flex items-center gap-2 mb-1">
        {icon}
        <h3 className="text-white font-bold text-sm">{title}</h3>
      </div>
      <p className="text-slate-400 text-xs">{desc}</p>
    </div>
  );
}

function Pill({ label, value, color = "text-slate-300" }: { label: string; value: string; color?: string }) {
  return (
    <div className="bg-slate-800/60 px-2 py-1 rounded">
      <span className="text-slate-500">{label}: </span>
      <span className={`font-bold ${color}`}>{value}</span>
    </div>
  );
}

function AdvSection({ title, icon, selected, children }: { title: string; icon: string; selected?: string; children: React.ReactNode }) {
  const [open, setOpen] = useState(true);
  return (
    <div className="bg-slate-800 border border-slate-700 rounded-xl overflow-hidden">
      <button onClick={() => setOpen(!open)} className="w-full flex items-center gap-3 p-3 text-left">
        <span className="text-xl">{icon}</span>
        <span className="text-white font-medium flex-1">{title}</span>
        {selected && <span className="text-purple-400 text-xs">{selected}</span>}
        {open ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
      </button>
      {open && <div className="p-3 pt-0">{children}</div>}
    </div>
  );
}

function AdvCompCard({ component, selected, onSelect, disabled, specs, advanced }: {
  component: { name: string; price: number };
  selected: boolean;
  onSelect: () => void;
  disabled?: boolean;
  specs: string[];
  advanced?: import("@/lib/types").AdvancedSpec;
}) {
  return (
    <button onClick={onSelect} disabled={disabled}
      className={`text-left p-3 rounded-lg border transition-all ${selected ? "border-purple-500 bg-purple-500/10 selected-glow" : "border-slate-600 hover:border-slate-500"} ${disabled ? "opacity-40 cursor-not-allowed" : ""}`}>
      <div className="font-medium text-white text-sm mb-1">{component.name}</div>
      <div className="flex flex-wrap gap-1 mb-2">
        {specs.map((s) => <span key={s} className="text-xs text-slate-400">{s}</span>)}
      </div>
      <div className="flex items-center justify-between mb-1">
        <span className="text-purple-400 font-bold text-sm">${component.price.toLocaleString()}</span>
      </div>
      {advanced && (
        <div className="border-t border-slate-700 mt-1 pt-1 flex gap-2 text-[10px]">
          <span className="text-slate-500">MTBF: <span className={advanced.mtbfHours > 1000000 ? "text-emerald-400" : "text-amber-400"}>{(advanced.mtbfHours / 1000000).toFixed(1)}M hrs</span></span>
          <span className="text-slate-500">AFR: <span className={advanced.annualFailureRate < 0.01 ? "text-emerald-400" : advanced.annualFailureRate < 0.02 ? "text-amber-400" : "text-red-400"}>{(advanced.annualFailureRate * 100).toFixed(1)}%</span></span>
        </div>
      )}
    </button>
  );
}

function TCOBar({ tco }: { tco: TCOBreakdown }) {
  const segments = [
    { value: tco.hardware, color: "bg-blue-500" },
    { value: tco.power, color: "bg-amber-500" },
    { value: tco.support, color: "bg-purple-500" },
    { value: tco.failures, color: "bg-red-500" },
    { value: tco.downtime, color: "bg-pink-500" },
  ];
  const total = tco.total || 1;
  return (
    <div className="flex h-3 w-full bg-slate-700 rounded overflow-hidden">
      {segments.map((s, i) => (
        <div key={i} className={s.color} style={{ width: `${(s.value / total) * 100}%` }} />
      ))}
    </div>
  );
}

function TCOLine({ label, value, color, total }: { label: string; value: number; color: string; total: number }) {
  const pct = total > 0 ? ((value / total) * 100).toFixed(0) : "0";
  return (
    <div className="flex items-center gap-2">
      <div className={`w-2 h-2 rounded ${color}`} />
      <span className="text-slate-400 flex-1">{label}</span>
      <span className="text-slate-300 font-mono">${value.toLocaleString()}</span>
      <span className="text-slate-500 w-8 text-right">{pct}%</span>
    </div>
  );
}

