"use client";

import { useState, useMemo } from "react";
import { useGameStore, calculateMotherboardCost, calculateMotherboardPower } from "@/lib/store";
import { cpus, rams, storages, gpus, networkCards, powerSupplies } from "@/lib/data/components";
import { quizQuestions } from "@/lib/data/challenges";
import { Server, Cpu, BookOpen, Star, Trophy, Gamepad2, Check, X, Plus, Trash2 } from "lucide-react";
import Link from "next/link";
import type { Motherboard, CPUSpec, RAMSpec, StorageSpec, GPUSpec, NetworkCard as NC, PowerSupply as PS } from "@/lib/types";

const BUDGET = 15000;

interface MBTemplate {
  name: string; price: number; power: number; perf: number; cores: number; ram: number; storage: number; hasGPU: boolean;
  build: () => Motherboard;
}

function makeMB(cpu: CPUSpec, ramPicks: RAMSpec[], storagePicks: StorageSpec[], gpu: GPUSpec | null, net: NC, psu: PS): Motherboard {
  return { cpu, ram: ramPicks, storage: storagePicks, gpu, networkCard: net, powerSupply: psu, ramSlots: 4, storageSlots: 4 };
}

const mbTemplates: MBTemplate[] = [
  {
    name: "Budget Web", price: 800, power: 120, perf: 30, cores: 4, ram: 16, storage: 1, hasGPU: false,
    build: () => makeMB(cpus[0], [rams[0]], [storages[0]], null, networkCards[0], powerSupplies[0]),
  },
  {
    name: "Standard", price: 2000, power: 250, perf: 55, cores: 8, ram: 32, storage: 2, hasGPU: false,
    build: () => makeMB(cpus[1], [rams[1], rams[1]], [storages[1]], null, networkCards[1], powerSupplies[1]),
  },
  {
    name: "Performance", price: 4000, power: 400, perf: 75, cores: 16, ram: 64, storage: 4, hasGPU: false,
    build: () => makeMB(cpus[2], [rams[2], rams[2]], [storages[2], storages[2]], null, networkCards[2], powerSupplies[2]),
  },
  {
    name: "AI Powerhouse", price: 8000, power: 700, perf: 95, cores: 32, ram: 128, storage: 4, hasGPU: true,
    build: () => makeMB(cpus[cpus.length - 1], [rams[rams.length - 1], rams[rams.length - 1]], [storages[storages.length - 1]], gpus[gpus.length - 1], networkCards[networkCards.length - 1], powerSupplies[powerSupplies.length - 1]),
  },
];

const formFactors = [
  { ff: "1U", max: 1, desc: "Slim, 1 motherboard. Great for simple web servers.", height: "h-8" },
  { ff: "2U", max: 2, desc: "Standard, 2 motherboards. Good for databases.", height: "h-16" },
  { ff: "4U", max: 4, desc: "Big, 4 motherboards. Perfect for AI & compute.", height: "h-28" },
];

export default function Day2Page() {
  const [tab, setTab] = useState<"learn" | "quiz" | "build">("learn");
  const store = useGameStore();

  // Quiz state
  const [quizIdx, setQuizIdx] = useState(0);
  const [quizAnswers, setQuizAnswers] = useState<(number | null)[]>([]);
  const [quizDone, setQuizDone] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);

  // Build state
  const [formFactor, setFormFactor] = useState("1U");
  const [motherboards, setMotherboards] = useState<Motherboard[]>([]);
  const [buildSubmitted, setBuildSubmitted] = useState(false);
  const [buildScore, setBuildScore] = useState(0);
  const [buildFeedback, setBuildFeedback] = useState<string[]>([]);

  const maxMBs = formFactor === "4U" ? 4 : formFactor === "2U" ? 2 : 1;
  const questions = quizQuestions[2] || [];

  const serverCost = useMemo(() => {
    const chassisCost = formFactor === "4U" ? 600 : formFactor === "2U" ? 350 : 200;
    return motherboards.reduce((s, mb) => s + calculateMotherboardCost(mb), 0) + chassisCost;
  }, [motherboards, formFactor]);

  const serverPower = useMemo(() => motherboards.reduce((s, mb) => s + calculateMotherboardPower(mb), 0), [motherboards]);
  const budgetLeft = BUDGET - serverCost;

  const handleQuizAnswer = (ansIdx: number) => {
    if (showExplanation) return;
    setSelectedAnswer(ansIdx);
    setShowExplanation(true);
    setQuizAnswers((prev) => [...prev, ansIdx]);
  };

  const nextQuestion = () => {
    if (quizIdx + 1 >= questions.length) {
      const correct = quizAnswers.filter((a, i) => a === questions[i]?.correctAnswer).length;
      setQuizDone(true);
      store.completeQuiz(2, Math.round((correct / questions.length) * 100));
    } else {
      setQuizIdx((i) => i + 1);
      setSelectedAnswer(null);
      setShowExplanation(false);
    }
  };

  const addTemplate = (tpl: MBTemplate) => {
    if (motherboards.length >= maxMBs) return;
    setMotherboards((prev) => [...prev, tpl.build()]);
  };

  const removeMB = (idx: number) => setMotherboards((prev) => prev.filter((_, i) => i !== idx));

  const submitBuild = () => {
    let score = 0;
    const feedback: string[] = [];

    if (serverCost <= BUDGET) { score += 25; feedback.push("Within budget!"); } else { feedback.push("Over budget!"); }
    if (motherboards.length > 0) { score += 15; } else { feedback.push("Add at least one motherboard!"); }
    if (motherboards.length === maxMBs) { score += 20; feedback.push("All motherboard slots filled!"); } else { feedback.push(`Only ${motherboards.length}/${maxMBs} slots used.`); }

    const totalCores = motherboards.reduce((s, mb) => s + (mb.cpu?.cores ?? 0), 0);
    const totalRAM = motherboards.reduce((s, mb) => s + mb.ram.reduce((r, m) => r + m.capacity, 0), 0);
    if (totalCores >= 16) { score += 15; feedback.push(`${totalCores} cores — good compute power!`); }
    if (totalRAM >= 64) { score += 15; feedback.push(`${totalRAM}GB RAM — plenty of memory!`); }

    const efficiency = serverPower > 0 ? (totalCores * 10 + totalRAM) / serverPower : 0;
    if (efficiency > 1) { score += 10; feedback.push("Good power efficiency!"); }

    setBuildScore(score);
    setBuildFeedback(feedback);
    setBuildSubmitted(true);
    store.completeSimulation(2, score);
  };

  return (
    <div className="min-h-screen bg-slate-900">
      <div className="bg-slate-800 border-b border-slate-700">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-500 flex items-center justify-center">
              <Server className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">Day 2: Building a Server</h1>
              <p className="text-sm text-slate-400">Assemble motherboards into servers!</p>
            </div>
          </div>
          <Link href="/dashboard" className="text-slate-400 hover:text-white text-sm">← Dashboard</Link>
        </div>
        <div className="max-w-6xl mx-auto px-4 flex gap-1">
          {([["learn", BookOpen, "Learn"], ["quiz", Star, "Quiz"], ["build", Gamepad2, "Build"]] as const).map(([key, Icon, label]) => (
            <button key={key} onClick={() => setTab(key)} className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${tab === key ? "border-blue-500 text-blue-400" : "border-transparent text-slate-400 hover:text-white"}`}>
              <Icon className="w-4 h-4" />{label}
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-6">
        {/* LEARN */}
        {tab === "learn" && (
          <div className="space-y-4 animate-slide-in">
            <div className="bg-gradient-to-r from-blue-900/30 to-purple-900/30 border border-blue-500/20 rounded-xl p-6">
              <h2 className="text-2xl font-bold text-white mb-3">What is a Server? 🖥️</h2>
              <p className="text-slate-300 mb-2">A server is a specialized computer that lives in a data center and serves data to thousands of users. Unlike your home PC, servers run 24/7 and can have multiple motherboards!</p>
              <p className="text-slate-300">Servers come in standard sizes called &quot;form factors&quot; measured in U (rack units). 1U = 1.75 inches tall.</p>
            </div>

            <h3 className="text-lg font-bold text-white">Form Factors</h3>
            <div className="grid md:grid-cols-3 gap-4">
              {formFactors.map((ff) => (
                <div key={ff.ff} className="bg-slate-800 border border-slate-700 rounded-xl p-4">
                  <div className={`${ff.height} bg-gradient-to-r from-slate-600 to-slate-700 rounded-lg mb-3 flex items-center justify-center border border-slate-500`}>
                    <span className="text-white font-bold">{ff.ff}</span>
                  </div>
                  <h4 className="text-white font-bold">{ff.ff} Server</h4>
                  <p className="text-slate-400 text-sm">{ff.desc}</p>
                  <p className="text-slate-500 text-xs mt-1">Max {ff.max} motherboard{ff.max > 1 ? "s" : ""}</p>
                </div>
              ))}
            </div>

            <div className="bg-slate-800 border border-slate-700 rounded-xl p-4">
              <h3 className="text-lg font-bold text-white mb-2">Key Server Concepts</h3>
              <div className="space-y-3 text-sm text-slate-300">
                <p><strong className="text-amber-400">Redundancy:</strong> Having backup components so the server keeps running if something fails. Like having a spare tire!</p>
                <p><strong className="text-blue-400">RAID:</strong> Combining multiple hard drives so data is safe even if a drive fails. Think of it as backing up your homework in multiple folders!</p>
                <p><strong className="text-emerald-400">Hot-Swap:</strong> Replacing a broken part without turning off the server. Like changing a tire while the car is still moving (carefully)!</p>
              </div>
            </div>

            <button onClick={() => setTab("quiz")} className="w-full bg-blue-500 text-white font-bold py-3 rounded-xl hover:bg-blue-400">Ready for the Quiz? →</button>
          </div>
        )}

        {/* QUIZ */}
        {tab === "quiz" && (
          <div className="max-w-2xl mx-auto animate-slide-in">
            {!quizDone && questions.length > 0 ? (
              <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-sm text-slate-400">Question {quizIdx + 1} of {questions.length}</span>
                  <span className="text-sm text-blue-400">{questions[quizIdx].points} pts</span>
                </div>
                <div className="w-full bg-slate-700 rounded-full h-2 mb-6">
                  <div className="bg-blue-500 h-2 rounded-full transition-all" style={{ width: `${((quizIdx + 1) / questions.length) * 100}%` }} />
                </div>
                <h3 className="text-xl font-bold text-white mb-6">{questions[quizIdx].question}</h3>
                <div className="space-y-3">
                  {questions[quizIdx].options.map((opt, oi) => {
                    let cls = "border-slate-600 hover:border-slate-500";
                    if (showExplanation) {
                      if (oi === questions[quizIdx].correctAnswer) cls = "border-emerald-500 bg-emerald-500/10";
                      else if (oi === selectedAnswer) cls = "border-red-500 bg-red-500/10";
                    }
                    return (
                      <button key={oi} onClick={() => handleQuizAnswer(oi)} className={`w-full text-left p-4 rounded-lg border ${cls} transition-colors`}>
                        <span className="text-white">{opt}</span>
                      </button>
                    );
                  })}
                </div>
                {showExplanation && (
                  <div className="mt-4 space-y-3">
                    <div className={`p-3 rounded-lg ${selectedAnswer === questions[quizIdx].correctAnswer ? "bg-emerald-500/10 border border-emerald-500/30" : "bg-red-500/10 border border-red-500/30"}`}>
                      <p className="text-sm text-slate-300">{selectedAnswer === questions[quizIdx].correctAnswer ? "✅ Correct!" : "❌ Not quite!"} {questions[quizIdx].explanation}</p>
                    </div>
                    <button onClick={nextQuestion} className="w-full bg-blue-500 text-white font-bold py-2 rounded-lg hover:bg-blue-400">
                      {quizIdx + 1 >= questions.length ? "See Results" : "Next Question →"}
                    </button>
                  </div>
                )}
              </div>
            ) : quizDone ? (
              <div className="bg-slate-800 border border-slate-700 rounded-xl p-8 text-center">
                <Trophy className="w-16 h-16 text-amber-400 mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-white mb-2">Quiz Complete!</h2>
                <p className="text-4xl font-black text-blue-400 mb-4">{quizAnswers.filter((a, i) => a === questions[i]?.correctAnswer).length}/{questions.length}</p>
                <button onClick={() => setTab("build")} className="bg-blue-500 text-white font-bold py-3 px-8 rounded-xl hover:bg-blue-400">Start Building! →</button>
              </div>
            ) : <p className="text-slate-400 text-center">No quiz questions available.</p>}
          </div>
        )}

        {/* BUILD */}
        {tab === "build" && (
          <div className="animate-slide-in">
            {/* Budget */}
            <div className="bg-slate-800 rounded-xl p-4 mb-4 border border-slate-700">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-slate-400">Budget: ${BUDGET.toLocaleString()}</span>
                <span className={budgetLeft < 0 ? "text-red-400" : "text-emerald-400"}>${budgetLeft.toLocaleString()} left</span>
              </div>
              <div className="w-full bg-slate-700 rounded-full h-3">
                <div className={`h-3 rounded-full transition-all ${budgetLeft < 0 ? "bg-red-500" : "bg-blue-500"}`} style={{ width: `${Math.max(0, Math.min(100, (budgetLeft / BUDGET) * 100))}%` }} />
              </div>
            </div>

            {!buildSubmitted ? (
              <div className="grid lg:grid-cols-3 gap-4">
                <div className="lg:col-span-2 space-y-4">
                  {/* Form Factor */}
                  <div className="bg-slate-800 border border-slate-700 rounded-xl p-4">
                    <h3 className="text-white font-bold mb-3">Step 1: Choose Form Factor</h3>
                    <div className="grid grid-cols-3 gap-3">
                      {formFactors.map((ff) => (
                        <button key={ff.ff} onClick={() => { setFormFactor(ff.ff); setMotherboards([]); }} className={`p-3 rounded-lg border text-center transition-all ${formFactor === ff.ff ? "border-blue-500 bg-blue-500/10" : "border-slate-600 hover:border-slate-500"}`}>
                          <div className={`${ff.height} bg-slate-600 rounded mb-2 mx-auto max-w-[80px] flex items-center justify-center`}>
                            <span className="text-white text-xs font-bold">{ff.ff}</span>
                          </div>
                          <p className="text-white text-sm font-medium">{ff.ff}</p>
                          <p className="text-slate-400 text-xs">{ff.max} MB slot{ff.max > 1 ? "s" : ""}</p>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Motherboard Templates */}
                  <div className="bg-slate-800 border border-slate-700 rounded-xl p-4">
                    <h3 className="text-white font-bold mb-3">Step 2: Add Motherboards ({motherboards.length}/{maxMBs})</h3>
                    <div className="grid sm:grid-cols-2 gap-3">
                      {mbTemplates.map((tpl) => (
                        <button key={tpl.name} onClick={() => addTemplate(tpl)} disabled={motherboards.length >= maxMBs} className="text-left p-3 rounded-lg border border-slate-600 hover:border-slate-500 disabled:opacity-40 disabled:cursor-not-allowed transition-all">
                          <div className="flex justify-between items-start mb-2">
                            <span className="text-white font-medium">{tpl.name}</span>
                            <span className="text-emerald-400 font-bold text-sm">${tpl.price.toLocaleString()}</span>
                          </div>
                          <div className="flex flex-wrap gap-2 text-xs text-slate-400">
                            <span>{tpl.cores} cores</span>
                            <span>{tpl.ram}GB RAM</span>
                            <span>{tpl.storage}TB</span>
                            {tpl.hasGPU && <span className="text-amber-400">GPU</span>}
                            <span>{tpl.power}W</span>
                          </div>
                          <div className="mt-2 flex items-center gap-1">
                            <div className="w-full h-1.5 bg-slate-700 rounded-full">
                              <div className="h-1.5 bg-blue-500 rounded-full" style={{ width: `${tpl.perf}%` }} />
                            </div>
                            <span className="text-xs text-slate-500">{tpl.perf}</span>
                          </div>
                          <div className="mt-2 flex items-center gap-1 text-blue-400 text-xs">
                            <Plus className="w-3 h-3" /> Add to Server
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Server Summary */}
                <div>
                  <div className="bg-slate-800 border border-slate-700 rounded-xl p-4 sticky top-4">
                    <h3 className="text-lg font-bold text-white mb-3">Server: {formFactor}</h3>

                    {/* Visual Server */}
                    <div className="bg-slate-700 rounded-lg p-2 mb-4 border border-slate-600">
                      {Array.from({ length: maxMBs }).map((_, i) => (
                        <div key={i} className={`h-10 rounded mb-1 last:mb-0 flex items-center justify-between px-3 ${i < motherboards.length ? "bg-gradient-to-r from-blue-900 to-blue-800 border border-blue-500/30" : "bg-slate-600/50 border border-dashed border-slate-500"}`}>
                          {i < motherboards.length ? (
                            <>
                              <span className="text-white text-xs">MB {i + 1}: {motherboards[i].cpu?.name ?? "Custom"}</span>
                              <button onClick={() => removeMB(i)} className="text-red-400 hover:text-red-300"><Trash2 className="w-3 h-3" /></button>
                            </>
                          ) : (
                            <span className="text-slate-500 text-xs">Empty Slot {i + 1}</span>
                          )}
                        </div>
                      ))}
                    </div>

                    <div className="space-y-2 text-sm border-t border-slate-700 pt-3">
                      <div className="flex justify-between"><span className="text-slate-400">Total Cost</span><span className={`font-bold ${serverCost > BUDGET ? "text-red-400" : "text-emerald-400"}`}>${serverCost.toLocaleString()}</span></div>
                      <div className="flex justify-between"><span className="text-slate-400">Total Power</span><span className="text-amber-400 font-bold">{serverPower}W</span></div>
                      <div className="flex justify-between"><span className="text-slate-400">Motherboards</span><span className="text-white">{motherboards.length}/{maxMBs}</span></div>
                      <div className="flex justify-between"><span className="text-slate-400">Total Cores</span><span className="text-white">{motherboards.reduce((s, mb) => s + (mb.cpu?.cores ?? 0), 0)}</span></div>
                      <div className="flex justify-between"><span className="text-slate-400">Total RAM</span><span className="text-white">{motherboards.reduce((s, mb) => s + mb.ram.reduce((r, m) => r + m.capacity, 0), 0)}GB</span></div>
                    </div>

                    <button onClick={submitBuild} disabled={motherboards.length === 0} className="w-full mt-4 bg-blue-500 text-white font-bold py-3 rounded-xl hover:bg-blue-400 disabled:opacity-50 disabled:cursor-not-allowed">Submit Server</button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="max-w-lg mx-auto bg-slate-800 border border-slate-700 rounded-xl p-8 text-center">
                <Trophy className="w-16 h-16 text-amber-400 mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-white mb-2">Server Built!</h2>
                <p className="text-5xl font-black text-blue-400 mb-4">{buildScore}/100</p>
                <div className="text-left space-y-2 mb-6">
                  {buildFeedback.map((f, i) => (
                    <p key={i} className="text-sm text-slate-300 flex items-start gap-2">
                      {f.includes("!") && !f.includes("Over") ? <Check className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" /> : <X className="w-4 h-4 text-red-400 mt-0.5 flex-shrink-0" />}
                      {f}
                    </p>
                  ))}
                </div>
                <div className="flex gap-3">
                  <button onClick={() => { setBuildSubmitted(false); setMotherboards([]); }} className="flex-1 bg-slate-700 text-white py-2 rounded-lg hover:bg-slate-600">Try Again</button>
                  <Link href="/day/3" className="flex-1 bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-400 text-center font-bold">Day 3 →</Link>
                </div>
              </div>
            )}

            <div className="vedic-card rounded-xl p-4 mt-4">
              <h4 className="text-amber-200 font-bold mb-1">🧮 Vedic Math: Quick Server ROI</h4>
              <p className="text-amber-100/80 text-sm">To estimate monthly revenue per dollar spent: if a server costs $8,000 and earns $2,000/month, the payback period = $8,000 ÷ $2,000 = 4 months. Vedic shortcut: 8÷2 = 4!</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
