"use client";

import { useState, useEffect } from "react";
import {
  BookOpen, Presentation, Users, BookMarked, Play, ChevronRight,
  ChevronLeft, Clock, Check, ChevronDown, ChevronUp, X, Timer,
  GraduationCap, Star, Trophy, Sparkles, ExternalLink,
} from "lucide-react";
import Link from "next/link";
import { cpus, rams, storages, gpus, networkCards, powerSupplies } from "@/lib/data/components";
import { workloads } from "@/lib/data/workloads";
import { vedicTips } from "@/lib/vedic-math";
import { daySchedules } from "@/lib/data/schedule";
import { advancedCurriculum, advancedBlockCount } from "@/lib/data/advanced-curriculum";
import type { ScheduleBlock } from "@/lib/types";

const dayThemes = [
  { day: 1, title: "Inside the Motherboard", icon: "🧠" },
  { day: 2, title: "Building a Server", icon: "🖥️" },
  { day: 3, title: "Filling the Rack", icon: "🗄️" },
  { day: 4, title: "Building a Row", icon: "🏗️" },
  { day: 5, title: "Shark Tank", icon: "🦈" },
];

const blockIcons: Record<string, string> = {
  warmup: "🌅", lesson: "📖", activity: "🔧", "vedic-workshop": "🧮",
  lunch: "🍕", energizer: "⚡", "deep-dive": "🔬", "show-and-tell": "🎤", wrapup: "🌟",
};

const mockStudents = [
  { name: "Aiden M.", block: "Activity 1", d1: 85, d2: 72, d3: 0, d4: 0, d5: 0, pts: 157, badges: 3 },
  { name: "Sofia R.", block: "Lesson 1", d1: 92, d2: 88, d3: 0, d4: 0, d5: 0, pts: 180, badges: 5 },
  { name: "Jayden K.", block: "Vedic Workshop", d1: 78, d2: 65, d3: 0, d4: 0, d5: 0, pts: 143, badges: 2 },
  { name: "Emma L.", block: "Activity 1", d1: 95, d2: 91, d3: 0, d4: 0, d5: 0, pts: 186, badges: 6 },
  { name: "Lucas T.", block: "Lesson 1", d1: 70, d2: 58, d3: 0, d4: 0, d5: 0, pts: 128, badges: 1 },
  { name: "Mia C.", block: "Energizer", d1: 88, d2: 82, d3: 0, d4: 0, d5: 0, pts: 170, badges: 4 },
  { name: "Ethan W.", block: "Deep Dive", d1: 82, d2: 76, d3: 0, d4: 0, d5: 0, pts: 158, badges: 3 },
  { name: "Ava P.", block: "Show & Tell", d1: 90, d2: 85, d3: 0, d4: 0, d5: 0, pts: 175, badges: 4 },
  { name: "Noah D.", block: "Activity 2", d1: 75, d2: 70, d3: 0, d4: 0, d5: 0, pts: 145, badges: 2 },
  { name: "Olivia B.", block: "Wrap-up", d1: 98, d2: 94, d3: 0, d4: 0, d5: 0, pts: 192, badges: 7 },
];

type Tab = "agenda" | "slides" | "progress" | "reference" | "advanced";

export default function TeacherDashboard() {
  const [tab, setTab] = useState<Tab>("agenda");
  const [selectedDay, setSelectedDay] = useState(1);
  const [activeBlockIdx, setActiveBlockIdx] = useState<number | null>(null);
  const [expandedBlock, setExpandedBlock] = useState<number | null>(null);
  const [completedBlocks, setCompletedBlocks] = useState<Set<string>>(new Set());

  // Timer
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [timerRunning, setTimerRunning] = useState(false);

  // Slides
  const [slidesBlock, setSlidesBlock] = useState<ScheduleBlock | null>(null);
  const [slideIdx, setSlideIdx] = useState(0);

  // Reference section
  const [refSection, setRefSection] = useState<string | null>("components");

  const blocks = daySchedules[selectedDay] ?? [];

  // Timer tick
  useEffect(() => {
    if (!timerRunning || timerSeconds <= 0) return;
    const id = setTimeout(() => setTimerSeconds((t) => t - 1), 1000);
    return () => clearTimeout(id);
  }, [timerRunning, timerSeconds]);

  const startBlock = (idx: number) => {
    const block = blocks[idx];
    setActiveBlockIdx(idx);
    setTimerSeconds((block.teacherGuide.timerMinutes ?? block.durationMinutes) * 60);
    setTimerRunning(true);
  };

  const completeBlock = (id: string) => {
    setCompletedBlocks((prev) => new Set([...prev, id]));
    setTimerRunning(false);
    if (activeBlockIdx !== null && activeBlockIdx + 1 < blocks.length) {
      setActiveBlockIdx(activeBlockIdx + 1);
      setExpandedBlock(activeBlockIdx + 1);
    }
  };

  const openSlides = (block: ScheduleBlock) => {
    setSlidesBlock(block);
    setSlideIdx(0);
    setTab("slides");
  };

  const fmtTime = (s: number) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;

  // Slides mode keyboard
  useEffect(() => {
    if (tab !== "slides" || !slidesBlock) return;
    const bullets = slidesBlock.teacherGuide.slidesBullets ?? [];
    const handler = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" || e.key === " ") setSlideIdx((i) => Math.min(i + 1, bullets.length - 1));
      if (e.key === "ArrowLeft") setSlideIdx((i) => Math.max(i - 1, 0));
      if (e.key === "Escape") setTab("agenda");
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [tab, slidesBlock]);

  return (
    <div className="min-h-screen bg-slate-900">
      {/* Header */}
      <div className="bg-indigo-950 border-b border-indigo-800">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <GraduationCap className="w-7 h-7 text-indigo-400" />
            <div>
              <h1 className="text-lg font-bold text-white">Teacher Command Center</h1>
              <p className="text-xs text-indigo-300">DC Bootcamp — Spring Break Camp</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {timerRunning && (
              <div className={`flex items-center gap-2 font-mono font-bold text-xl ${timerSeconds > 60 ? "text-emerald-400" : timerSeconds > 10 ? "text-amber-400" : "text-red-400 animate-pulse"}`}>
                <Timer className="w-5 h-5" /> {fmtTime(timerSeconds)}
              </div>
            )}
            <Link href="/dashboard" className="text-indigo-300 hover:text-white text-sm">← Dashboard</Link>
          </div>
        </div>
        {/* Tabs */}
        <div className="max-w-7xl mx-auto px-4 flex gap-1">
          {([["agenda", BookOpen, "Agenda"], ["slides", Presentation, "Slides"], ["progress", Users, "Students"], ["reference", BookMarked, "Reference"], ["advanced", Sparkles, "Advanced"]] as const).map(([key, Icon, label]) => (
            <button key={key} onClick={() => setTab(key)} className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${tab === key ? "border-indigo-400 text-indigo-300" : "border-transparent text-slate-400 hover:text-white"}`}>
              <Icon className="w-4 h-4" />{label}
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* ─── AGENDA TAB ─── */}
        {tab === "agenda" && (
          <div>
            {/* Day selector */}
            <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
              {dayThemes.map((d) => (
                <button key={d.day} onClick={() => { setSelectedDay(d.day); setActiveBlockIdx(null); setExpandedBlock(null); setCompletedBlocks(new Set()); setTimerRunning(false); }}
                  className={`flex items-center gap-2 px-4 py-3 rounded-xl border-2 transition-all whitespace-nowrap ${selectedDay === d.day ? "border-indigo-500 bg-indigo-500/10 text-white" : "border-slate-700 text-slate-400 hover:border-slate-500"}`}>
                  <span className="text-xl">{d.icon}</span>
                  <div className="text-left">
                    <div className="font-bold text-sm">Day {d.day}</div>
                    <div className="text-xs opacity-70">{d.title}</div>
                  </div>
                </button>
              ))}
            </div>

            {/* Timeline */}
            <div className="space-y-2">
              {blocks.map((block, i) => {
                const isActive = activeBlockIdx === i;
                const isDone = completedBlocks.has(block.id);
                const isExpanded = expandedBlock === i;
                return (
                  <div key={block.id} className={`rounded-xl border-2 transition-all overflow-hidden ${isActive ? "border-indigo-500 bg-indigo-950/30" : isDone ? "border-emerald-700/50 bg-emerald-950/20" : "border-slate-700 bg-slate-800/50"}`}>
                    <button onClick={() => setExpandedBlock(isExpanded ? null : i)} className="w-full flex items-center gap-4 p-4 text-left">
                      <div className="flex flex-col items-center w-14 shrink-0">
                        <span className="text-xs text-slate-400 font-mono">{block.startTime}</span>
                        <span className="text-lg">{blockIcons[block.type] ?? "📋"}</span>
                        <span className="text-[10px] text-slate-500">{block.durationMinutes}m</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-white text-sm">{block.title}</h3>
                        <p className="text-xs text-slate-400 truncate">{block.subtitle}</p>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        {isDone && <Check className="w-5 h-5 text-emerald-400" />}
                        {isActive && !isDone && <div className="w-3 h-3 rounded-full bg-indigo-400 animate-pulse" />}
                        {isExpanded ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
                      </div>
                    </button>

                    {isExpanded && (
                      <div className="px-4 pb-4 border-t border-slate-700/50 pt-3 space-y-4 animate-slide-in">
                        {/* Talking Points */}
                        {block.teacherGuide.talkingPoints.length > 0 && (
                          <div>
                            <h4 className="text-indigo-300 font-bold text-xs uppercase mb-2">Talking Points</h4>
                            <ul className="space-y-1">
                              {block.teacherGuide.talkingPoints.map((tp, j) => (
                                <li key={j} className="text-slate-300 text-sm flex items-start gap-2">
                                  <ChevronRight className="w-3 h-3 text-indigo-400 mt-1 shrink-0" />{tp}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {/* Probing Questions */}
                        {block.teacherGuide.probingQuestions && block.teacherGuide.probingQuestions.length > 0 && (
                          <div>
                            <h4 className="text-amber-300 font-bold text-xs uppercase mb-2">Ask the Class</h4>
                            <ul className="space-y-1">
                              {block.teacherGuide.probingQuestions.map((q, j) => (
                                <li key={j} className="text-amber-200/80 text-sm">💬 {q}</li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {/* Misconceptions */}
                        {block.teacherGuide.commonMisconceptions && block.teacherGuide.commonMisconceptions.length > 0 && (
                          <div className="bg-red-950/30 border border-red-700/30 rounded-lg p-3">
                            <h4 className="text-red-300 font-bold text-xs uppercase mb-1">Watch Out For</h4>
                            {block.teacherGuide.commonMisconceptions.map((m, j) => (
                              <p key={j} className="text-red-200/70 text-sm">⚠️ {m}</p>
                            ))}
                          </div>
                        )}

                        {/* Differentiation */}
                        {block.teacherGuide.differentiationTips && (
                          <div className="grid sm:grid-cols-2 gap-2">
                            <div className="bg-blue-950/30 border border-blue-700/30 rounded-lg p-3">
                              <h4 className="text-blue-300 font-bold text-xs mb-1">If Struggling</h4>
                              <p className="text-blue-200/70 text-sm">{block.teacherGuide.differentiationTips.struggling}</p>
                            </div>
                            <div className="bg-purple-950/30 border border-purple-700/30 rounded-lg p-3">
                              <h4 className="text-purple-300 font-bold text-xs mb-1">If Advanced</h4>
                              <p className="text-purple-200/70 text-sm">{block.teacherGuide.differentiationTips.advanced}</p>
                            </div>
                          </div>
                        )}

                        {/* Action buttons */}
                        <div className="flex flex-wrap gap-2 pt-2">
                          {!isDone && (
                            <button onClick={() => startBlock(i)} className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-indigo-500">
                              <Play className="w-4 h-4" /> Start Timer ({block.teacherGuide.timerMinutes ?? block.durationMinutes}m)
                            </button>
                          )}
                          {block.teacherGuide.slidesBullets && block.teacherGuide.slidesBullets.length > 0 && (
                            <button onClick={() => openSlides(block)} className="flex items-center gap-2 bg-slate-700 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-slate-600">
                              <Presentation className="w-4 h-4" /> Present ({block.teacherGuide.slidesBullets.length} slides)
                            </button>
                          )}
                          {isActive && !isDone && (
                            <button onClick={() => completeBlock(block.id)} className="flex items-center gap-2 bg-emerald-600 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-emerald-500">
                              <Check className="w-4 h-4" /> Complete Block
                            </button>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ─── SLIDES TAB ─── */}
        {tab === "slides" && (
          <div className="flex flex-col items-center justify-center min-h-[70vh]">
            {slidesBlock && slidesBlock.teacherGuide.slidesBullets ? (
              <>
                <div className="text-indigo-400 text-sm font-bold mb-4">{slidesBlock.title}</div>
                <div className="bg-slate-800 border-2 border-indigo-500/40 rounded-2xl p-12 max-w-4xl w-full min-h-[400px] flex items-center justify-center">
                  <p className="text-white text-3xl md:text-4xl font-bold text-center leading-relaxed">
                    {slidesBlock.teacherGuide.slidesBullets[slideIdx]}
                  </p>
                </div>
                <div className="flex items-center gap-6 mt-8">
                  <button onClick={() => setSlideIdx((i) => Math.max(0, i - 1))} disabled={slideIdx === 0}
                    className="p-3 rounded-full bg-slate-700 text-white hover:bg-slate-600 disabled:opacity-30">
                    <ChevronLeft className="w-6 h-6" />
                  </button>
                  <span className="text-slate-400 font-mono text-sm">{slideIdx + 1} / {slidesBlock.teacherGuide.slidesBullets.length}</span>
                  <button onClick={() => setSlideIdx((i) => Math.min(slidesBlock.teacherGuide.slidesBullets!.length - 1, i + 1))} disabled={slideIdx >= (slidesBlock.teacherGuide.slidesBullets?.length ?? 1) - 1}
                    className="p-3 rounded-full bg-slate-700 text-white hover:bg-slate-600 disabled:opacity-30">
                    <ChevronRight className="w-6 h-6" />
                  </button>
                </div>
                <button onClick={() => { setTab("agenda"); setSlidesBlock(null); }} className="mt-6 text-slate-400 hover:text-white text-sm flex items-center gap-1">
                  <X className="w-4 h-4" /> Exit Slides (Esc)
                </button>
                <p className="text-slate-600 text-xs mt-2">Use arrow keys or spacebar to navigate</p>
              </>
            ) : (
              <div className="text-center">
                <Presentation className="w-16 h-16 text-slate-600 mx-auto mb-4" />
                <h2 className="text-xl font-bold text-slate-400 mb-2">No slides selected</h2>
                <p className="text-slate-500 text-sm">Go to the Agenda tab and click &quot;Present&quot; on any block to start a slideshow.</p>
              </div>
            )}
          </div>
        )}

        {/* ─── PROGRESS TAB ─── */}
        {tab === "progress" && (
          <div>
            {/* Summary stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
              {[
                { label: "Students", value: mockStudents.length, icon: Users, color: "text-indigo-400" },
                { label: "Avg Score", value: Math.round(mockStudents.reduce((s, st) => s + st.pts, 0) / mockStudents.length), icon: Star, color: "text-amber-400" },
                { label: "Avg Badges", value: (mockStudents.reduce((s, st) => s + st.badges, 0) / mockStudents.length).toFixed(1), icon: Trophy, color: "text-emerald-400" },
                { label: "Day", value: selectedDay, icon: Clock, color: "text-blue-400" },
              ].map((s) => (
                <div key={s.label} className="bg-slate-800 border border-slate-700 rounded-xl p-4 flex items-center gap-3">
                  <s.icon className={`w-8 h-8 ${s.color}`} />
                  <div>
                    <div className="text-white font-bold text-xl">{s.value}</div>
                    <div className="text-slate-400 text-xs">{s.label}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Student table */}
            <div className="bg-slate-800 border border-slate-700 rounded-xl overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-700 text-slate-400 text-xs uppercase">
                    <th className="p-3 text-left">Student</th>
                    <th className="p-3 text-left">Current Block</th>
                    <th className="p-3 text-center">Day 1</th>
                    <th className="p-3 text-center">Day 2</th>
                    <th className="p-3 text-center">Day 3</th>
                    <th className="p-3 text-center">Day 4</th>
                    <th className="p-3 text-center">Day 5</th>
                    <th className="p-3 text-center">Total</th>
                    <th className="p-3 text-center">Badges</th>
                  </tr>
                </thead>
                <tbody>
                  {mockStudents.map((st, i) => (
                    <tr key={i} className="border-b border-slate-700/50 hover:bg-slate-700/30">
                      <td className="p-3 text-white font-medium">{st.name}</td>
                      <td className="p-3"><span className="text-indigo-300 bg-indigo-500/10 px-2 py-0.5 rounded text-xs">{st.block}</span></td>
                      <td className="p-3 text-center text-slate-300">{st.d1 || "—"}</td>
                      <td className="p-3 text-center text-slate-300">{st.d2 || "—"}</td>
                      <td className="p-3 text-center text-slate-500">{st.d3 || "—"}</td>
                      <td className="p-3 text-center text-slate-500">{st.d4 || "—"}</td>
                      <td className="p-3 text-center text-slate-500">{st.d5 || "—"}</td>
                      <td className="p-3 text-center text-emerald-400 font-bold">{st.pts}</td>
                      <td className="p-3 text-center text-amber-400">{st.badges}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-slate-500 text-xs mt-3 text-center">Mock data — student progress will sync live when a database is connected.</p>
          </div>
        )}

        {/* ─── REFERENCE TAB ─── */}
        {tab === "reference" && (
          <div className="space-y-3">
            {/* Component Specs */}
            <RefSection title="Component Specs" id="components" open={refSection} onToggle={setRefSection}>
              <div className="space-y-4">
                <RefTable title="CPUs" headers={["Name", "Cores", "GHz", "TDP", "Price"]}
                  rows={cpus.map(c => [c.name, c.cores, c.clockSpeed, `${c.tdp}W`, `$${c.price.toLocaleString()}`])} />
                <RefTable title="RAM" headers={["Name", "Capacity", "Type", "Speed", "Price"]}
                  rows={rams.map(r => [r.name, `${r.capacity}GB`, r.type, `${r.speed}MHz`, `$${r.price}`])} />
                <RefTable title="Storage" headers={["Name", "Type", "Capacity", "Read", "Price"]}
                  rows={storages.map(s => [s.name, s.type, `${s.capacity}TB`, `${s.readSpeed}MB/s`, `$${s.price}`])} />
                <RefTable title="GPUs" headers={["Name", "VRAM", "TDP", "Price"]}
                  rows={gpus.map(g => [g.name, `${g.vram}GB`, `${g.tdp}W`, `$${g.price.toLocaleString()}`])} />
                <RefTable title="Network" headers={["Name", "Speed", "Ports", "Price"]}
                  rows={networkCards.map(n => [n.name, `${n.speed}Gbps`, n.ports, `$${n.price}`])} />
                <RefTable title="PSUs" headers={["Name", "Wattage", "Efficiency", "Price"]}
                  rows={powerSupplies.map(p => [p.name, `${p.wattage}W`, p.efficiency, `$${p.price}`])} />
              </div>
            </RefSection>

            {/* Workloads */}
            <RefSection title="Workload Requirements" id="workloads" open={refSection} onToggle={setRefSection}>
              <RefTable title="" headers={["Workload", "CPU", "RAM", "Storage", "GPU?", "Network", "Revenue"]}
                rows={workloads.map(w => [
                  `${w.icon} ${w.name}`, `${w.requiredCPUCores}c`, `${w.requiredRAM}GB`,
                  `${w.requiredStorage}TB`, w.requiredGPU ? `Yes (${w.requiredGPUVRAM ?? "?"}GB)` : "No",
                  `${w.networkBandwidth}Gbps`, `$${w.revenuePerMonth.toLocaleString()}/mo`
                ])} />
            </RefSection>

            {/* Vedic Math Tips */}
            <RefSection title="Vedic Math Cheat Sheet" id="vedic" open={refSection} onToggle={setRefSection}>
              <div className="grid sm:grid-cols-2 gap-3">
                {vedicTips.map((tip) => (
                  <div key={tip.id} className="vedic-card rounded-lg p-4">
                    <h4 className="text-amber-200 font-bold text-sm mb-1">{tip.title}</h4>
                    <p className="text-amber-100/70 text-xs mb-2">{tip.description}</p>
                    <p className="text-amber-300 text-xs font-mono bg-amber-950/50 rounded p-2">{tip.example}</p>
                    <p className="text-amber-200/50 text-xs mt-1">Formula: {tip.formula}</p>
                  </div>
                ))}
              </div>
            </RefSection>

            {/* Key Formulas */}
            <RefSection title="Key Formulas" id="formulas" open={refSection} onToggle={setRefSection}>
              <div className="grid sm:grid-cols-2 gap-3">
                {[
                  { title: "Watts → BTU/hr", formula: "BTU = Watts × 3.41", example: "1,000W rack → 3,410 BTU/hr" },
                  { title: "PUE", formula: "PUE = Total Power ÷ IT Power", example: "200kW total, 150kW IT → PUE 1.33" },
                  { title: "ROI", formula: "ROI = (Profit ÷ Investment) × 100%", example: "$50K profit on $200K → 25% ROI" },
                  { title: "Profit Margin", formula: "Margin = (Revenue - Costs) ÷ Revenue × 100%", example: "$100K rev, $65K costs → 35% margin" },
                  { title: "Payback Period", formula: "Months = Investment ÷ Monthly Profit", example: "$500K ÷ $15K/mo = 33.3 months" },
                  { title: "Uptime → Downtime", formula: "Downtime = (1 - Uptime%) × 525,600 min/yr", example: "99.99% → 52.6 min/year" },
                ].map((f) => (
                  <div key={f.title} className="bg-slate-800 border border-slate-700 rounded-lg p-4">
                    <h4 className="text-white font-bold text-sm mb-1">{f.title}</h4>
                    <p className="text-emerald-400 font-mono text-sm mb-1">{f.formula}</p>
                    <p className="text-slate-400 text-xs">{f.example}</p>
                  </div>
                ))}
              </div>
            </RefSection>
          </div>
        )}

        {/* ─── ADVANCED TAB ─── */}
        {tab === "advanced" && (
          <div className="animate-slide-in">
            {/* Header banner */}
            <div className="bg-gradient-to-br from-purple-900/40 to-indigo-900/30 border border-purple-500/40 rounded-xl p-5 mb-4">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-bold text-white mb-2 flex items-center gap-2">
                    <Sparkles className="w-6 h-6 text-purple-400" />
                    Advanced Mode Curriculum
                  </h2>
                  <p className="text-slate-300 text-sm mb-2">
                    <strong className="text-white">Optional content</strong> for higher-grade students or kids who want to go deeper. These blocks cover TCO, failure rates, support contracts, and OpEx — concepts real data center engineers deal with every day.
                  </p>
                  <p className="text-slate-400 text-xs">
                    Use these to extend the standard 8-hour curriculum. Each block works with the interactive demo at <Link href="/demo-advanced" className="text-purple-300 underline hover:text-white">/demo-advanced</Link>
                  </p>
                </div>
                <Link href="/demo-advanced" target="_blank" className="bg-purple-600 text-white font-bold text-sm px-4 py-2 rounded-lg hover:bg-purple-500 flex items-center gap-2 shrink-0">
                  <ExternalLink className="w-4 h-4" /> Open Demo
                </Link>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-4">
                <AdvStat label="Total Blocks" value={advancedBlockCount.toString()} />
                <AdvStat label="Days Covered" value="3-5" />
                <AdvStat label="Recommended For" value="Grade 7+" />
                <AdvStat label="Extra Time" value="~3 hours" />
              </div>
            </div>

            {/* Per-day advanced blocks */}
            <div className="space-y-4">
              {[3, 4, 5].map((dayNum) => {
                const blocks = advancedCurriculum[dayNum] ?? [];
                if (blocks.length === 0) return null;
                const theme = dayThemes.find((d) => d.day === dayNum);
                return (
                  <div key={dayNum} className="bg-slate-800 border border-slate-700 rounded-xl overflow-hidden">
                    <div className="bg-slate-900/50 border-b border-slate-700 px-4 py-3 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{theme?.icon}</span>
                        <div>
                          <h3 className="text-white font-bold">Day {dayNum}: {theme?.title}</h3>
                          <p className="text-slate-400 text-xs">{blocks.length} advanced {blocks.length === 1 ? "block" : "blocks"} available</p>
                        </div>
                      </div>
                    </div>
                    <div className="divide-y divide-slate-700">
                      {blocks.map((block) => (
                        <AdvancedBlockCard key={block.id} block={block} />
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Teaching tips */}
            <div className="bg-amber-950/30 border border-amber-700/30 rounded-xl p-5 mt-4">
              <h3 className="text-amber-300 font-bold mb-2 flex items-center gap-2">
                <Star className="w-5 h-5" /> Teaching Advanced Mode
              </h3>
              <ul className="text-sm text-amber-100/80 space-y-1.5">
                <li>• <strong>Pick 1-2 blocks per day</strong> — don&apos;t try to cover everything. Quality over quantity.</li>
                <li>• <strong>Start with Day 3 &quot;3-Year Reality Check&quot;</strong> — it&apos;s the foundation of TCO thinking.</li>
                <li>• <strong>Use /demo-advanced live on projector</strong> — students learn by watching you explore it.</li>
                <li>• <strong>Pair advanced students together</strong> — they push each other harder than alone.</li>
                <li>• <strong>Don&apos;t skip the standard curriculum</strong> — advanced is for EXTENSION, not replacement.</li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function AdvStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-slate-800/50 rounded-lg p-2 border border-slate-700">
      <div className="text-slate-500 text-xs">{label}</div>
      <div className="text-white font-bold text-sm">{value}</div>
    </div>
  );
}

function AdvancedBlockCard({ block }: { block: ScheduleBlock }) {
  const [expanded, setExpanded] = useState(false);
  return (
    <div>
      <button onClick={() => setExpanded(!expanded)} className="w-full flex items-center gap-3 p-4 text-left hover:bg-slate-700/20 transition-colors">
        <span className="text-2xl shrink-0">{block.icon}</span>
        <div className="flex-1 min-w-0">
          <h4 className="text-white font-bold text-sm">{block.title}</h4>
          <p className="text-slate-400 text-xs">{block.subtitle}</p>
        </div>
        <div className="text-right shrink-0 flex items-center gap-3">
          <div className="flex flex-col items-end">
            <span className="text-purple-300 text-xs font-mono">{block.durationMinutes} min</span>
            <span className="text-slate-500 text-[10px] uppercase">{block.type.replace("-", " ")}</span>
          </div>
          {expanded ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
        </div>
      </button>
      {expanded && (
        <div className="px-4 pb-4 space-y-3 border-t border-slate-700/50 pt-3">
          {/* Narrative */}
          {block.content.narrative && block.content.narrative.length > 0 && (
            <div>
              <h5 className="text-purple-300 font-bold text-xs uppercase mb-1">Narrative</h5>
              <ul className="text-slate-300 text-xs space-y-1">
                {block.content.narrative.map((n, i) => <li key={i}>{n}</li>)}
              </ul>
            </div>
          )}
          {/* Teacher guide */}
          <div>
            <h5 className="text-purple-300 font-bold text-xs uppercase mb-1">Talking Points</h5>
            <ul className="text-slate-300 text-xs space-y-1">
              {block.teacherGuide.talkingPoints.map((tp, i) => (
                <li key={i} className="flex items-start gap-1.5">
                  <ChevronRight className="w-3 h-3 text-purple-400 mt-0.5 shrink-0" />
                  {tp}
                </li>
              ))}
            </ul>
          </div>
          {block.teacherGuide.probingQuestions && block.teacherGuide.probingQuestions.length > 0 && (
            <div>
              <h5 className="text-amber-300 font-bold text-xs uppercase mb-1">Ask the Class</h5>
              <ul className="text-amber-200/80 text-xs space-y-1">
                {block.teacherGuide.probingQuestions.map((q, i) => <li key={i}>💬 {q}</li>)}
              </ul>
            </div>
          )}
          {block.teacherGuide.differentiationTips && (
            <div className="grid sm:grid-cols-2 gap-2">
              <div className="bg-blue-950/30 border border-blue-700/30 rounded-lg p-2">
                <div className="text-blue-300 font-bold text-[10px] uppercase mb-1">If Struggling</div>
                <p className="text-blue-200/70 text-xs">{block.teacherGuide.differentiationTips.struggling}</p>
              </div>
              <div className="bg-purple-950/30 border border-purple-700/30 rounded-lg p-2">
                <div className="text-purple-300 font-bold text-[10px] uppercase mb-1">If Advanced</div>
                <p className="text-purple-200/70 text-xs">{block.teacherGuide.differentiationTips.advanced}</p>
              </div>
            </div>
          )}
          {/* Launch demo button */}
          {block.content.existingComponent === "demo-advanced" && (
            <Link href="/demo-advanced" target="_blank" className="inline-flex items-center gap-2 bg-purple-600 text-white text-xs font-bold px-3 py-2 rounded-lg hover:bg-purple-500 transition-colors">
              <ExternalLink className="w-3 h-3" /> Launch Advanced Demo
            </Link>
          )}
        </div>
      )}
    </div>
  );
}

function RefSection({ title, id, open, onToggle, children }: {
  title: string; id: string; open: string | null; onToggle: (id: string | null) => void; children: React.ReactNode;
}) {
  const isOpen = open === id;
  return (
    <div className="bg-slate-800 border border-slate-700 rounded-xl overflow-hidden">
      <button onClick={() => onToggle(isOpen ? null : id)} className="w-full flex items-center justify-between p-4 text-left">
        <h3 className="text-white font-bold">{title}</h3>
        {isOpen ? <ChevronUp className="w-5 h-5 text-slate-400" /> : <ChevronDown className="w-5 h-5 text-slate-400" />}
      </button>
      {isOpen && <div className="px-4 pb-4">{children}</div>}
    </div>
  );
}

function RefTable({ title, headers, rows }: { title: string; headers: string[]; rows: (string | number)[][] }) {
  return (
    <div>
      {title && <h4 className="text-indigo-300 font-bold text-sm mb-2">{title}</h4>}
      <div className="overflow-x-auto">
        <table className="w-full text-xs">
          <thead>
            <tr className="border-b border-slate-700">
              {headers.map((h) => <th key={h} className="p-2 text-left text-slate-400 font-medium">{h}</th>)}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <tr key={i} className="border-b border-slate-700/30 hover:bg-slate-700/20">
                {row.map((cell, j) => <td key={j} className="p-2 text-slate-300">{cell}</td>)}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
