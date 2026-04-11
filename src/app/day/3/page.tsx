"use client";

import { useState, useMemo } from "react";
import { useGameStore } from "@/lib/store";
import { serverTemplates, calculateRackScore, getVedicCoolingTip } from "@/lib/game-engine";
import { quizQuestions } from "@/lib/data/challenges";
import type { ServerTemplate } from "@/lib/game-engine";
import { HardDrive, BookOpen, Star, Trophy, Gamepad2, Plus, Trash2, Check, X, Zap } from "lucide-react";
import Link from "next/link";

const BUDGET = 200000;
const MAX_UNITS = 42;

export default function Day3Page() {
  const [tab, setTab] = useState<"learn" | "quiz" | "build">("learn");
  const store = useGameStore();

  // Quiz state
  const [quizIdx, setQuizIdx] = useState(0);
  const [quizAnswers, setQuizAnswers] = useState<(number | null)[]>([]);
  const [quizDone, setQuizDone] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);

  // Build state
  const [rackServers, setRackServers] = useState<ServerTemplate[]>([]);
  const [buildSubmitted, setBuildSubmitted] = useState(false);
  const [buildResult, setBuildResult] = useState<{ score: number; feedback: string[] }>({ score: 0, feedback: [] });

  const questions = quizQuestions[3] || [];

  const usedUnits = useMemo(() => rackServers.reduce((s, sv) => s + sv.units, 0), [rackServers]);
  const totalCost = useMemo(() => rackServers.reduce((s, sv) => s + sv.cost, 0) + 3000, [rackServers]); // +3000 rack hardware
  const totalPower = useMemo(() => rackServers.reduce((s, sv) => s + sv.powerDraw, 0), [rackServers]);
  const monthlyRevenue = useMemo(() => rackServers.reduce((s, sv) => s + sv.revenuePerMonth, 0), [rackServers]);
  const monthlyPowerCost = useMemo(() => (totalPower / 1000) * 0.10 * 730, [totalPower]);
  const coolingBTU = Math.round(totalPower * 3.41);
  const vedicTip = getVedicCoolingTip(totalPower);

  const addServer = (tpl: ServerTemplate) => {
    if (usedUnits + tpl.units > MAX_UNITS) return;
    setRackServers((prev) => [...prev, tpl]);
  };

  const removeServer = (idx: number) => setRackServers((prev) => prev.filter((_, i) => i !== idx));

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
      store.completeQuiz(3, Math.round((correct / questions.length) * 100));
    } else {
      setQuizIdx((i) => i + 1);
      setSelectedAnswer(null);
      setShowExplanation(false);
    }
  };

  const submitBuild = () => {
    const result = calculateRackScore(usedUnits, MAX_UNITS, totalPower, totalCost, monthlyRevenue, BUDGET);
    setBuildResult({ score: result.score, feedback: result.feedback });
    setBuildSubmitted(true);
    store.completeSimulation(3, result.score);
    if (usedUnits >= 40) store.earnBadge("full-rack");
  };

  return (
    <div className="min-h-screen bg-slate-900">
      <div className="bg-slate-800 border-b border-slate-700">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-purple-500 flex items-center justify-center">
              <HardDrive className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">Day 3: Filling the Rack</h1>
              <p className="text-sm text-slate-400">Stack servers into a 42U rack!</p>
            </div>
          </div>
          <Link href="/dashboard" className="text-slate-400 hover:text-white text-sm">← Dashboard</Link>
        </div>
        <div className="max-w-6xl mx-auto px-4 flex gap-1">
          {([["learn", BookOpen, "Learn"], ["quiz", Star, "Quiz"], ["build", Gamepad2, "Build"]] as const).map(([key, Icon, label]) => (
            <button key={key} onClick={() => setTab(key)} className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${tab === key ? "border-purple-500 text-purple-400" : "border-transparent text-slate-400 hover:text-white"}`}>
              <Icon className="w-4 h-4" />{label}
            </button>
          ))}
        </div>
      </div>

      {/* Advanced Extension Ribbon */}
      <div className="bg-purple-900/40 border-b border-purple-500/30 text-center py-1.5 px-4 text-xs text-purple-200">
        🎓 Going deeper? Try <Link href="/demo-advanced" className="font-bold underline text-purple-300 hover:text-white">Advanced Mode</Link> to see how 3-year TCO changes your rack decisions
      </div>

      <div className="max-w-6xl mx-auto px-4 py-6">
        {/* LEARN */}
        {tab === "learn" && (
          <div className="space-y-4 animate-slide-in">
            <div className="bg-gradient-to-r from-purple-900/30 to-blue-900/30 border border-purple-500/20 rounded-xl p-6">
              <h2 className="text-2xl font-bold text-white mb-3">What is a Server Rack? 🗄️</h2>
              <p className="text-slate-300 mb-2">A server rack is a tall metal cabinet that holds servers. The standard rack is 42U tall (about 6 feet). Each &quot;U&quot; is 1.75 inches — the height of a 1U server.</p>
              <p className="text-slate-300">Data centers have hundreds or thousands of these racks, all connected together!</p>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-slate-800 border border-slate-700 rounded-xl p-4">
                <h3 className="text-white font-bold mb-2">📏 Rack Math</h3>
                <p className="text-slate-400 text-sm mb-3">A 42U rack can fit:</p>
                <ul className="text-slate-300 text-sm space-y-1">
                  <li>• 42 × 1U servers, OR</li>
                  <li>• 21 × 2U servers, OR</li>
                  <li>• 10 × 4U servers (2U left), OR</li>
                  <li>• Any mix that totals ≤ 42U</li>
                </ul>
              </div>
              <div className="bg-slate-800 border border-slate-700 rounded-xl p-4">
                <h3 className="text-white font-bold mb-2">🌡️ Cooling</h3>
                <p className="text-slate-400 text-sm mb-2">Servers generate lots of heat! A full rack can draw 10-30 kW.</p>
                <p className="text-slate-300 text-sm">Heat is measured in BTU. Formula: <strong className="text-amber-400">Watts × 3.41 = BTU/hr</strong></p>
                <p className="text-slate-400 text-xs mt-1">Fun fact: A full rack uses as much power as 20 homes! 🏠×20</p>
              </div>
              <div className="bg-slate-800 border border-slate-700 rounded-xl p-4">
                <h3 className="text-white font-bold mb-2">🔌 Power Distribution</h3>
                <p className="text-slate-300 text-sm">Each rack has PDUs (Power Distribution Units) that distribute electricity to each server. Think of it like a power strip for servers!</p>
              </div>
              <div className="bg-slate-800 border border-slate-700 rounded-xl p-4">
                <h3 className="text-white font-bold mb-2">🔥 Hot Aisle / Cold Aisle</h3>
                <p className="text-slate-300 text-sm">Racks are arranged so cold air enters from one side (cold aisle) and hot exhaust exits the other (hot aisle). This prevents hot and cold air from mixing!</p>
              </div>
            </div>

            <button onClick={() => setTab("quiz")} className="w-full bg-purple-500 text-white font-bold py-3 rounded-xl hover:bg-purple-400">Ready for the Quiz? →</button>
          </div>
        )}

        {/* QUIZ */}
        {tab === "quiz" && (
          <div className="max-w-2xl mx-auto animate-slide-in">
            {!quizDone && questions.length > 0 ? (
              <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-sm text-slate-400">Question {quizIdx + 1} of {questions.length}</span>
                  <span className="text-sm text-purple-400">{questions[quizIdx].points} pts</span>
                </div>
                <div className="w-full bg-slate-700 rounded-full h-2 mb-6">
                  <div className="bg-purple-500 h-2 rounded-full transition-all" style={{ width: `${((quizIdx + 1) / questions.length) * 100}%` }} />
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
                    <button onClick={nextQuestion} className="w-full bg-purple-500 text-white font-bold py-2 rounded-lg hover:bg-purple-400">
                      {quizIdx + 1 >= questions.length ? "See Results" : "Next Question →"}
                    </button>
                  </div>
                )}
              </div>
            ) : quizDone ? (
              <div className="bg-slate-800 border border-slate-700 rounded-xl p-8 text-center">
                <Trophy className="w-16 h-16 text-amber-400 mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-white mb-2">Quiz Complete!</h2>
                <p className="text-4xl font-black text-purple-400 mb-4">{quizAnswers.filter((a, i) => a === questions[i]?.correctAnswer).length}/{questions.length}</p>
                <button onClick={() => setTab("build")} className="bg-purple-500 text-white font-bold py-3 px-8 rounded-xl hover:bg-purple-400">Start Building! →</button>
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
                <span className={totalCost > BUDGET ? "text-red-400" : "text-emerald-400"}>${(BUDGET - totalCost).toLocaleString()} left</span>
              </div>
              <div className="w-full bg-slate-700 rounded-full h-3">
                <div className={`h-3 rounded-full transition-all ${totalCost > BUDGET ? "bg-red-500" : "bg-purple-500"}`} style={{ width: `${Math.max(0, Math.min(100, ((BUDGET - totalCost) / BUDGET) * 100))}%` }} />
              </div>
            </div>

            {!buildSubmitted ? (
              <div className="grid lg:grid-cols-3 gap-4">
                <div className="lg:col-span-2 space-y-4">
                  {/* Server Templates */}
                  <div className="bg-slate-800 border border-slate-700 rounded-xl p-4">
                    <h3 className="text-white font-bold mb-3">Add Servers to Your Rack</h3>
                    <div className="grid sm:grid-cols-2 gap-3">
                      {serverTemplates.map((tpl) => (
                        <button key={tpl.id} onClick={() => addServer(tpl)} disabled={usedUnits + tpl.units > MAX_UNITS}
                          className="text-left p-3 rounded-lg border border-slate-600 hover:border-purple-500/50 disabled:opacity-40 disabled:cursor-not-allowed transition-all">
                          <div className="flex justify-between items-start mb-1">
                            <span className="text-white font-medium">{tpl.name}</span>
                            <span className="text-emerald-400 font-bold text-sm">${tpl.cost.toLocaleString()}</span>
                          </div>
                          <p className="text-slate-400 text-xs mb-2">{tpl.description}</p>
                          <div className="flex flex-wrap gap-2 text-xs text-slate-400">
                            <span className="bg-slate-700 px-2 py-0.5 rounded">{tpl.formFactor}</span>
                            <span>{tpl.powerDraw}W</span>
                            <span className="text-emerald-400">${tpl.revenuePerMonth.toLocaleString()}/mo</span>
                          </div>
                          <div className="mt-2 text-purple-400 text-xs flex items-center gap-1">
                            <Plus className="w-3 h-3" /> Add to Rack
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Vedic Math */}
                  <div className="vedic-card rounded-xl p-4">
                    <h4 className="text-amber-200 font-bold mb-1">🧮 {vedicTip.title}</h4>
                    <p className="text-amber-100/80 text-sm mb-1">{vedicTip.description}</p>
                    <p className="text-amber-200/60 text-xs font-mono">{vedicTip.example}</p>
                  </div>
                </div>

                {/* Rack Visualization & Summary */}
                <div>
                  <div className="bg-slate-800 border border-slate-700 rounded-xl p-4 sticky top-4">
                    <h3 className="text-lg font-bold text-white mb-3">Rack ({usedUnits}/{MAX_UNITS}U)</h3>

                    {/* Rack visual */}
                    <div className="bg-slate-700 rounded-lg p-1 mb-4 border border-slate-600 max-h-80 overflow-y-auto">
                      {rackServers.length === 0 ? (
                        <div className="h-20 flex items-center justify-center text-slate-500 text-sm">Empty rack — add servers!</div>
                      ) : (
                        rackServers.map((sv, i) => (
                          <div key={i} className={`rack-slot-filled rounded mb-0.5 px-2 py-1 flex items-center justify-between`} style={{ minHeight: `${sv.units * 18}px` }}>
                            <span className="text-white text-xs">{sv.name} ({sv.formFactor})</span>
                            <button onClick={() => removeServer(i)} className="text-red-400 hover:text-red-300"><Trash2 className="w-3 h-3" /></button>
                          </div>
                        ))
                      )}
                      {usedUnits < MAX_UNITS && (
                        <div className="h-8 flex items-center justify-center text-slate-500 text-xs border border-dashed border-slate-600 rounded mt-0.5">
                          {MAX_UNITS - usedUnits}U free
                        </div>
                      )}
                    </div>

                    {/* Stats */}
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between"><span className="text-slate-400">Servers</span><span className="text-white">{rackServers.length}</span></div>
                      <div className="flex justify-between"><span className="text-slate-400">Used Space</span><span className="text-white">{usedUnits}/{MAX_UNITS}U ({Math.round((usedUnits / MAX_UNITS) * 100)}%)</span></div>
                      <div className="flex justify-between"><span className="text-slate-400">Total Cost</span><span className={`font-bold ${totalCost > BUDGET ? "text-red-400" : "text-emerald-400"}`}>${totalCost.toLocaleString()}</span></div>
                      <div className="flex justify-between"><span className="text-slate-400">Power</span><span className="text-amber-400">{(totalPower / 1000).toFixed(1)} kW</span></div>
                      <div className="flex justify-between"><span className="text-slate-400">Cooling</span><span className="text-blue-400">{coolingBTU.toLocaleString()} BTU/hr</span></div>
                      <div className="border-t border-slate-700 pt-2">
                        <div className="flex justify-between"><span className="text-slate-400">Monthly Revenue</span><span className="text-emerald-400">${monthlyRevenue.toLocaleString()}</span></div>
                        <div className="flex justify-between"><span className="text-slate-400">Monthly Power Cost</span><span className="text-red-400">-${Math.round(monthlyPowerCost).toLocaleString()}</span></div>
                        <div className="flex justify-between font-bold"><span className="text-slate-300">Net Profit/mo</span><span className={monthlyRevenue - monthlyPowerCost > 0 ? "text-emerald-400" : "text-red-400"}>${Math.round(monthlyRevenue - monthlyPowerCost).toLocaleString()}</span></div>
                      </div>
                    </div>

                    <button onClick={submitBuild} disabled={rackServers.length === 0} className="w-full mt-4 bg-purple-500 text-white font-bold py-3 rounded-xl hover:bg-purple-400 disabled:opacity-50 disabled:cursor-not-allowed">Submit Rack</button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="max-w-lg mx-auto bg-slate-800 border border-slate-700 rounded-xl p-8 text-center">
                <Trophy className="w-16 h-16 text-amber-400 mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-white mb-2">Rack Complete!</h2>
                <p className="text-5xl font-black text-purple-400 mb-4">{buildResult.score}/100</p>
                <div className="text-left space-y-2 mb-6">
                  {buildResult.feedback.map((f, i) => <p key={i} className="text-sm text-slate-300">• {f}</p>)}
                </div>
                <div className="flex gap-3">
                  <button onClick={() => { setBuildSubmitted(false); setRackServers([]); }} className="flex-1 bg-slate-700 text-white py-2 rounded-lg hover:bg-slate-600">Try Again</button>
                  <Link href="/day/4" className="flex-1 bg-purple-500 text-white py-2 rounded-lg hover:bg-purple-400 text-center font-bold">Day 4 →</Link>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
