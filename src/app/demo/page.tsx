"use client";

import { useState, useMemo } from "react";
import { cpus, rams, storages, gpus, networkCards, powerSupplies } from "@/lib/data/components";
import { quizQuestions } from "@/lib/data/challenges";
import { workloads } from "@/lib/data/workloads";
import type { CPUSpec, RAMSpec, StorageSpec, GPUSpec, NetworkCard, PowerSupply } from "@/lib/types";
import {
  Cpu, MemoryStick, HardDrive, Monitor, Network, Battery,
  BookOpen, Gamepad2, Trophy, Star, Check, X,
  ChevronDown, ChevronUp, Zap, ArrowRight, Lock, Sparkles,
} from "lucide-react";
import Link from "next/link";

const BUDGET = 5000;

const componentInfo = [
  { emoji: "🧠", name: "CPU", analogy: "The Brain", desc: "The CPU (Central Processing Unit) is the brain of the computer. It processes all instructions and calculations. More cores = more tasks at once! Clock speed (GHz) = how fast it thinks.", specs: ["Cores", "Clock Speed (GHz)", "TDP (Watts)", "Best For"] },
  { emoji: "📋", name: "RAM", analogy: "The Desk", desc: "RAM (Random Access Memory) is like your desk space. More RAM = bigger desk = more things open at once! It's super fast but forgets everything when power goes off.", specs: ["Capacity (GB)", "Type (DDR4/DDR5)", "Speed (MHz)"] },
  { emoji: "🗄️", name: "Storage", analogy: "The Filing Cabinet", desc: "Storage is where all your files live permanently. HDDs are cheap but slow (spinning disks!). SSDs are fast (no moving parts). NVMe SSDs are the fastest of all!", specs: ["Type (HDD/SSD/NVMe)", "Capacity (TB)", "Read/Write Speed"] },
  { emoji: "🎨", name: "GPU", analogy: "The Art Studio", desc: "The GPU (Graphics Processing Unit) is amazing at doing many simple calculations at once. Perfect for AI training, video rendering, and gaming. Not every server needs one!", specs: ["VRAM (GB)", "TDP (Watts)", "Best For"] },
  { emoji: "🛣️", name: "Network Card", analogy: "The Highway", desc: "The Network Interface Card connects your server to the internet and other servers. Speed is measured in Gbps (gigabits per second). More speed = more data flowing!", specs: ["Speed (Gbps)", "Ports"] },
  { emoji: "❤️", name: "Power Supply", analogy: "The Heart", desc: "The PSU (Power Supply Unit) converts wall power into the exact voltages your components need. Efficiency ratings (80+ Bronze/Gold/Platinum) tell you how little energy is wasted as heat.", specs: ["Wattage", "Efficiency Rating"] },
];

export default function DemoPage() {
  const [tab, setTab] = useState<"learn" | "quiz" | "build">("learn");
  const [expandedComponent, setExpandedComponent] = useState<number | null>(null);

  // Quiz state
  const [quizIdx, setQuizIdx] = useState(0);
  const [quizAnswers, setQuizAnswers] = useState<(number | null)[]>([]);
  const [quizDone, setQuizDone] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);

  // Build state — local, no store needed
  const [selectedCPU, setSelectedCPU] = useState<CPUSpec | null>(null);
  const [selectedRAM, setSelectedRAM] = useState<RAMSpec[]>([]);
  const [selectedStorage, setSelectedStorage] = useState<StorageSpec[]>([]);
  const [selectedGPU, setSelectedGPU] = useState<GPUSpec | null>(null);
  const [selectedNIC, setSelectedNIC] = useState<NetworkCard | null>(null);
  const [selectedPSU, setSelectedPSU] = useState<PowerSupply | null>(null);
  const [buildSubmitted, setBuildSubmitted] = useState(false);
  const [buildScore, setBuildScore] = useState(0);
  const [buildFeedback, setBuildFeedback] = useState<string[]>([]);
  const [challengeWorkload] = useState(() => workloads[0]); // always Web Hosting for demo

  const questions = quizQuestions[1] || [];

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

  const budgetLeft = BUDGET - totalCost;

  const handleQuizAnswer = (ansIdx: number) => {
    if (showExplanation) return;
    setSelectedAnswer(ansIdx);
    setShowExplanation(true);
    setQuizAnswers((prev) => [...prev, ansIdx]);
  };

  const nextQuestion = () => {
    if (quizIdx + 1 >= questions.length) {
      setQuizDone(true);
    } else {
      setQuizIdx((i) => i + 1);
      setSelectedAnswer(null);
      setShowExplanation(false);
    }
  };

  const resetBuild = () => {
    setSelectedCPU(null);
    setSelectedRAM([]);
    setSelectedStorage([]);
    setSelectedGPU(null);
    setSelectedNIC(null);
    setSelectedPSU(null);
    setBuildSubmitted(false);
  };

  const submitBuild = () => {
    let score = 0;
    const feedback: string[] = [];

    if (totalCost <= BUDGET) { score += 30; feedback.push("Within budget! Great job managing costs."); }
    else { feedback.push("Over budget! You need to cut costs."); }

    if (selectedCPU) { score += 15; } else { feedback.push("You need a CPU!"); }
    if (selectedRAM.length > 0) { score += 10; } else { feedback.push("Add some RAM!"); }
    if (selectedStorage.length > 0) { score += 10; } else { feedback.push("Add storage!"); }
    if (selectedPSU) {
      if (selectedPSU.wattage >= totalPower) { score += 15; feedback.push("PSU handles the power draw. Smart!"); }
      else { score += 5; feedback.push("PSU wattage is too low for your components!"); }
    } else { feedback.push("Don't forget the power supply!"); }
    if (selectedNIC) { score += 5; }

    const cpuCores = selectedCPU?.cores ?? 0;
    const totalRAM = selectedRAM.reduce((s, r) => s + r.capacity, 0);
    const totalStor = selectedStorage.reduce((s, d) => s + d.capacity, 0);
    if (cpuCores >= challengeWorkload.requiredCPUCores && totalRAM >= challengeWorkload.requiredRAM && totalStor >= challengeWorkload.requiredStorage) {
      score += 15;
      feedback.push(`Build meets ${challengeWorkload.name} requirements!`);
    } else {
      feedback.push(`Build doesn't fully meet ${challengeWorkload.name} needs.`);
    }

    setBuildScore(score);
    setBuildFeedback(feedback);
    setBuildSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-slate-900">
      {/* Demo Banner */}
      <div className="bg-gradient-to-r from-amber-500 to-orange-500 text-black text-center py-2 px-4 text-sm font-medium flex items-center justify-center gap-2">
        <Sparkles className="w-4 h-4" />
        Demo Mode — Try Day 1 without signing in!
        <Link href="/login" className="underline font-bold ml-2">Sign in for the full 5-day experience →</Link>
      </div>

      {/* Header */}
      <div className="bg-slate-800 border-b border-slate-700">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-emerald-500 flex items-center justify-center">
              <Cpu className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">Day 1: Inside the Motherboard</h1>
              <p className="text-sm text-slate-400">Learn, Quiz, Build — no login needed!</p>
            </div>
          </div>
          <Link href="/" className="text-slate-400 hover:text-white text-sm">← Home</Link>
        </div>
        {/* Tabs */}
        <div className="max-w-6xl mx-auto px-4 flex gap-1">
          {([["learn", BookOpen, "Learn"], ["quiz", Star, "Quiz"], ["build", Gamepad2, "Build"]] as const).map(([key, Icon, label]) => (
            <button key={key} onClick={() => setTab(key)} className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${tab === key ? "border-emerald-500 text-emerald-400" : "border-transparent text-slate-400 hover:text-white"}`}>
              <Icon className="w-4 h-4" />{label}
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-6">
        {/* LEARN TAB */}
        {tab === "learn" && (
          <div className="space-y-4 animate-slide-in">
            <div className="bg-gradient-to-r from-emerald-900/30 to-blue-900/30 border border-emerald-500/20 rounded-xl p-6">
              <h2 className="text-2xl font-bold text-white mb-3">What is a Motherboard? 🔧</h2>
              <p className="text-slate-300 mb-2">The motherboard is the main circuit board in every computer and server. Think of it as a city where all the important buildings (components) are connected by roads (circuits).</p>
              <p className="text-slate-300">Every data center server has a motherboard with components carefully chosen for specific jobs. Let&apos;s learn about each one!</p>
            </div>

            {componentInfo.map((comp, i) => (
              <div key={i} className="bg-slate-800 border border-slate-700 rounded-xl overflow-hidden card-hover">
                <button onClick={() => setExpandedComponent(expandedComponent === i ? null : i)} className="w-full flex items-center gap-4 p-4 text-left">
                  <div className="w-12 h-12 rounded-lg bg-slate-700 flex items-center justify-center text-2xl">{comp.emoji}</div>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-white">{comp.name} — {comp.analogy}</h3>
                    <p className="text-sm text-slate-400">Click to learn more</p>
                  </div>
                  {expandedComponent === i ? <ChevronUp className="w-5 h-5 text-slate-400" /> : <ChevronDown className="w-5 h-5 text-slate-400" />}
                </button>
                {expandedComponent === i && (
                  <div className="px-4 pb-4 border-t border-slate-700 pt-3 animate-slide-in">
                    <p className="text-slate-300 mb-3">{comp.desc}</p>
                    <div className="flex flex-wrap gap-2">
                      {comp.specs.map((s) => (
                        <span key={s} className="bg-slate-700 text-slate-300 text-xs px-3 py-1 rounded-full">{s}</span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}

            <button onClick={() => setTab("quiz")} className="w-full bg-emerald-500 text-white font-bold py-3 rounded-xl hover:bg-emerald-400 transition-colors">
              Ready for the Quiz? →
            </button>
          </div>
        )}

        {/* QUIZ TAB */}
        {tab === "quiz" && (
          <div className="max-w-2xl mx-auto animate-slide-in">
            {!quizDone && questions.length > 0 ? (
              <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-sm text-slate-400">Question {quizIdx + 1} of {questions.length}</span>
                  <span className="text-sm text-emerald-400">{questions[quizIdx].points} pts</span>
                </div>
                <div className="w-full bg-slate-700 rounded-full h-2 mb-6">
                  <div className="bg-emerald-500 h-2 rounded-full transition-all" style={{ width: `${((quizIdx + 1) / questions.length) * 100}%` }} />
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
                    {questions[quizIdx].vedicMathTip && (
                      <div className="vedic-card p-3 rounded-lg">
                        <p className="text-sm text-amber-200">🧮 Vedic Math Tip: {questions[quizIdx].vedicMathTip}</p>
                      </div>
                    )}
                    <button onClick={nextQuestion} className="w-full bg-emerald-500 text-white font-bold py-2 rounded-lg hover:bg-emerald-400">
                      {quizIdx + 1 >= questions.length ? "See Results" : "Next Question →"}
                    </button>
                  </div>
                )}
              </div>
            ) : quizDone ? (
              <div className="bg-slate-800 border border-slate-700 rounded-xl p-8 text-center">
                <Trophy className="w-16 h-16 text-amber-400 mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-white mb-2">Quiz Complete!</h2>
                <p className="text-4xl font-black text-emerald-400 mb-2">
                  {quizAnswers.filter((a, i) => a === questions[i]?.correctAnswer).length}/{questions.length}
                </p>
                <p className="text-slate-400 mb-6">Great job! Now try building a motherboard.</p>
                <button onClick={() => setTab("build")} className="bg-emerald-500 text-white font-bold py-3 px-8 rounded-xl hover:bg-emerald-400">
                  Start Building! →
                </button>
              </div>
            ) : (
              <p className="text-slate-400 text-center">No quiz questions available.</p>
            )}
          </div>
        )}

        {/* BUILD TAB */}
        {tab === "build" && (
          <div className="animate-slide-in">
            {/* Challenge Brief */}
            <div className="bg-gradient-to-r from-blue-900/30 to-purple-900/30 border border-blue-500/20 rounded-xl p-4 mb-4">
              <h3 className="text-lg font-bold text-white mb-1">Build Challenge: {challengeWorkload.name}</h3>
              <p className="text-sm text-slate-300 mb-2">{challengeWorkload.description}</p>
              <div className="flex flex-wrap gap-3 text-xs text-slate-400">
                <span>CPU: {challengeWorkload.requiredCPUCores}+ cores</span>
                <span>RAM: {challengeWorkload.requiredRAM}+ GB</span>
                <span>Storage: {challengeWorkload.requiredStorage}+ TB</span>
                {challengeWorkload.requiredGPU && <span className="text-amber-400">GPU Required</span>}
                <span>Budget: ${BUDGET.toLocaleString()}</span>
              </div>
            </div>

            {/* Budget Bar */}
            <div className="bg-slate-800 rounded-xl p-4 mb-4 border border-slate-700">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-slate-400">Budget</span>
                <span className={budgetLeft < 0 ? "text-red-400" : budgetLeft < BUDGET * 0.25 ? "text-amber-400" : "text-emerald-400"}>
                  ${budgetLeft.toLocaleString()} / ${BUDGET.toLocaleString()}
                </span>
              </div>
              <div className="w-full bg-slate-700 rounded-full h-3">
                <div className={`h-3 rounded-full transition-all ${budgetLeft < 0 ? "bg-red-500" : budgetLeft < BUDGET * 0.25 ? "bg-amber-500" : "bg-emerald-500"}`} style={{ width: `${Math.max(0, Math.min(100, (budgetLeft / BUDGET) * 100))}%` }} />
              </div>
            </div>

            {!buildSubmitted ? (
              <div className="grid lg:grid-cols-3 gap-4">
                {/* Component Selection */}
                <div className="lg:col-span-2 space-y-4">
                  {/* CPU */}
                  <Section title="CPU" icon="🧠" selected={selectedCPU?.name}>
                    <div className="grid sm:grid-cols-2 gap-2">
                      {cpus.map((c) => (
                        <CompCard key={c.id} name={c.name} selected={selectedCPU?.id === c.id} price={c.price} specs={[`${c.cores} cores`, `${c.clockSpeed} GHz`, `${c.tdp}W`]} score={c.performanceScore} onSelect={() => setSelectedCPU(c)} />
                      ))}
                    </div>
                  </Section>

                  {/* RAM */}
                  <Section title={`RAM (${selectedRAM.length}/4 slots)`} icon="📋" selected={selectedRAM.length > 0 ? `${selectedRAM.length} sticks` : undefined}>
                    <div className="grid sm:grid-cols-2 gap-2">
                      {rams.map((r) => (
                        <CompCard key={r.id} name={r.name} selected={false} price={r.price} specs={[`${r.capacity}GB`, r.type, `${r.speed}MHz`]} score={r.performanceScore} onSelect={() => { if (selectedRAM.length < 4) setSelectedRAM((prev) => [...prev, r]); }} disabled={selectedRAM.length >= 4} />
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
                  </Section>

                  {/* Storage */}
                  <Section title={`Storage (${selectedStorage.length}/4 slots)`} icon="🗄️" selected={selectedStorage.length > 0 ? `${selectedStorage.length} drives` : undefined}>
                    <div className="grid sm:grid-cols-2 gap-2">
                      {storages.map((s) => (
                        <CompCard key={s.id} name={s.name} selected={false} price={s.price} specs={[s.type, `${s.capacity}TB`, `${s.readSpeed}MB/s`]} score={s.performanceScore} onSelect={() => { if (selectedStorage.length < 4) setSelectedStorage((prev) => [...prev, s]); }} disabled={selectedStorage.length >= 4} />
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
                  </Section>

                  {/* GPU */}
                  <Section title="GPU (Optional)" icon="🎨" selected={selectedGPU?.name}>
                    <div className="grid sm:grid-cols-2 gap-2">
                      {gpus.map((g) => (
                        <CompCard key={g.id} name={g.name} selected={selectedGPU?.id === g.id} price={g.price} specs={[`${g.vram}GB VRAM`, `${g.tdp}W`]} score={g.performanceScore} onSelect={() => setSelectedGPU(g)} />
                      ))}
                    </div>
                  </Section>

                  {/* Network */}
                  <Section title="Network Card" icon="🛣️" selected={selectedNIC?.name}>
                    <div className="grid sm:grid-cols-2 gap-2">
                      {networkCards.map((n) => (
                        <CompCard key={n.id} name={n.name} selected={selectedNIC?.id === n.id} price={n.price} specs={[`${n.speed} Gbps`, `${n.ports} ports`]} score={n.speed * 10} onSelect={() => setSelectedNIC(n)} />
                      ))}
                    </div>
                  </Section>

                  {/* PSU */}
                  <Section title="Power Supply" icon="❤️" selected={selectedPSU?.name}>
                    <div className="grid sm:grid-cols-2 gap-2">
                      {powerSupplies.map((p) => (
                        <CompCard key={p.id} name={p.name} selected={selectedPSU?.id === p.id} price={p.price} specs={[`${p.wattage}W`, p.efficiency]} score={Math.min(100, p.wattage / 10)} onSelect={() => setSelectedPSU(p)} />
                      ))}
                    </div>
                  </Section>
                </div>

                {/* Build Summary */}
                <div className="lg:col-span-1">
                  <div className="bg-slate-800 border border-slate-700 rounded-xl p-4 sticky top-4">
                    <h3 className="text-lg font-bold text-white mb-4">Build Summary</h3>
                    <div className="space-y-2 text-sm">
                      <SummaryRow label="CPU" value={selectedCPU?.name ?? "None"} ok={!!selectedCPU} />
                      <SummaryRow label="RAM" value={selectedRAM.length > 0 ? `${selectedRAM.reduce((s, r) => s + r.capacity, 0)}GB (${selectedRAM.length} sticks)` : "None"} ok={selectedRAM.length > 0} />
                      <SummaryRow label="Storage" value={selectedStorage.length > 0 ? `${selectedStorage.reduce((s, d) => s + d.capacity, 0)}TB (${selectedStorage.length} drives)` : "None"} ok={selectedStorage.length > 0} />
                      <SummaryRow label="GPU" value={selectedGPU?.name ?? "None"} ok={!challengeWorkload.requiredGPU || !!selectedGPU} />
                      <SummaryRow label="Network" value={selectedNIC?.name ?? "None"} ok={!!selectedNIC} />
                      <SummaryRow label="PSU" value={selectedPSU?.name ?? "None"} ok={!!selectedPSU} />
                    </div>
                    <div className="border-t border-slate-700 mt-4 pt-4 space-y-2">
                      <div className="flex justify-between">
                        <span className="text-slate-400">Total Cost</span>
                        <span className={`font-bold ${totalCost > BUDGET ? "text-red-400" : "text-emerald-400"}`}>${totalCost.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Total Power</span>
                        <span className="font-bold text-amber-400">{totalPower}W</span>
                      </div>
                      {selectedPSU && totalPower > selectedPSU.wattage && (
                        <p className="text-red-400 text-xs">⚠️ Power exceeds PSU capacity!</p>
                      )}
                    </div>
                    <button onClick={submitBuild} disabled={!selectedCPU} className="w-full mt-4 bg-emerald-500 text-white font-bold py-3 rounded-xl hover:bg-emerald-400 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
                      Submit Build
                    </button>
                    <button onClick={resetBuild} className="w-full mt-2 bg-slate-700 text-slate-300 py-2 rounded-lg text-sm hover:bg-slate-600">
                      Reset Build
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              /* Results */
              <div className="max-w-lg mx-auto bg-slate-800 border border-slate-700 rounded-xl p-8 text-center">
                <Trophy className="w-16 h-16 text-amber-400 mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-white mb-2">Build Complete!</h2>
                <p className="text-5xl font-black text-emerald-400 mb-4">{buildScore}/100</p>
                <div className="flex justify-center mb-4">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star key={s} className={`w-6 h-6 ${s <= Math.ceil(buildScore / 20) ? "text-amber-400 fill-amber-400" : "text-slate-600"}`} />
                  ))}
                </div>
                <div className="text-left space-y-2 mb-6">
                  {buildFeedback.map((f, i) => (
                    <p key={i} className="text-sm text-slate-300 flex items-start gap-2">
                      {f.includes("!") && !f.includes("Don't") && !f.includes("Over") && !f.includes("doesn't") ? <Check className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" /> : <X className="w-4 h-4 text-red-400 mt-0.5 flex-shrink-0" />}
                      {f}
                    </p>
                  ))}
                </div>

                {/* CTA to sign up */}
                <div className="bg-gradient-to-r from-emerald-900/50 to-blue-900/50 border border-emerald-500/20 rounded-xl p-4 mb-4">
                  <p className="text-white font-bold mb-1">Liked Day 1?</p>
                  <p className="text-slate-300 text-sm mb-3">Sign in to unlock all 5 days — servers, racks, rows, and the Shark Tank competition!</p>
                  <Link href="/login" className="inline-flex items-center gap-2 bg-emerald-500 text-white font-bold py-2 px-6 rounded-lg hover:bg-emerald-400 text-sm">
                    <Lock className="w-4 h-4" /> Sign In to Continue
                  </Link>
                </div>

                <button onClick={resetBuild} className="w-full bg-slate-700 text-white py-2 rounded-lg hover:bg-slate-600">
                  Try Again
                </button>
              </div>
            )}

            {/* Vedic Math Tip */}
            {!buildSubmitted && (
              <div className="vedic-card rounded-xl p-4 mt-4">
                <h4 className="text-amber-200 font-bold mb-1">🧮 Vedic Math: Quick Budget Check</h4>
                <p className="text-amber-100/80 text-sm">To check if you&apos;re within budget, subtract from ${BUDGET.toLocaleString()} using the Vedic method: subtract each digit from 9 (last from 10). Example: $5000 - $3,247 → 9-3=6, 9-2=7, 9-4=5, 10-7=3 → $1,753 remaining!</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function Section({ title, icon, selected, children }: { title: string; icon: string; selected?: string; children: React.ReactNode }) {
  const [open, setOpen] = useState(true);
  return (
    <div className="bg-slate-800 border border-slate-700 rounded-xl overflow-hidden">
      <button onClick={() => setOpen(!open)} className="w-full flex items-center gap-3 p-3 text-left">
        <span className="text-xl">{icon}</span>
        <span className="text-white font-medium flex-1">{title}</span>
        {selected && <span className="text-emerald-400 text-xs">{selected}</span>}
        {open ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
      </button>
      {open && <div className="p-3 pt-0">{children}</div>}
    </div>
  );
}

function CompCard({ name, selected, price, specs, score, onSelect, disabled }: { name: string; selected: boolean; price: number; specs: string[]; score: number; onSelect: () => void; disabled?: boolean }) {
  return (
    <button onClick={onSelect} disabled={disabled}
      className={`text-left p-3 rounded-lg border transition-all ${selected ? "border-emerald-500 bg-emerald-500/10 selected-glow" : "border-slate-600 hover:border-slate-500"} ${disabled ? "opacity-40 cursor-not-allowed" : ""}`}>
      <div className="font-medium text-white text-sm mb-1">{name}</div>
      <div className="flex flex-wrap gap-1 mb-2">
        {specs.map((s) => <span key={s} className="text-xs text-slate-400">{s}</span>)}
      </div>
      <div className="flex items-center justify-between">
        <span className="text-emerald-400 font-bold text-sm">${price.toLocaleString()}</span>
        <div className="flex items-center gap-1">
          <div className="w-16 h-1.5 bg-slate-700 rounded-full">
            <div className="h-1.5 bg-blue-500 rounded-full" style={{ width: `${score}%` }} />
          </div>
          <span className="text-xs text-slate-500">{score}</span>
        </div>
      </div>
    </button>
  );
}

function SummaryRow({ label, value, ok }: { label: string; value: string; ok: boolean }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-slate-400">{label}</span>
      <span className={`flex items-center gap-1 ${ok ? "text-emerald-400" : "text-slate-500"}`}>
        {value} {ok ? <Check className="w-3 h-3" /> : null}
      </span>
    </div>
  );
}
