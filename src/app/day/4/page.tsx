"use client";

import { useState, useMemo } from "react";
import { useGameStore } from "@/lib/store";
import { rackTemplates, coolingOptions, networkOptions, redundancyOptions, calculateRowScore, getVedicProfitTip } from "@/lib/game-engine";
import { quizQuestions } from "@/lib/data/challenges";
import type { RackTemplate, CoolingOption, NetworkOption, RedundancyOption } from "@/lib/game-engine";
import { Zap, BookOpen, Star, Trophy, Gamepad2, Plus, Trash2, Check, X, Thermometer, Wifi, Shield } from "lucide-react";
import Link from "next/link";

export default function Day4Page() {
  const [tab, setTab] = useState<"learn" | "quiz" | "build">("learn");
  const store = useGameStore();

  // Quiz
  const [quizIdx, setQuizIdx] = useState(0);
  const [quizAnswers, setQuizAnswers] = useState<(number | null)[]>([]);
  const [quizDone, setQuizDone] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);

  // Build
  const [racks, setRacks] = useState<RackTemplate[]>([]);
  const [cooling, setCooling] = useState<CoolingOption>(coolingOptions[1]);
  const [network, setNetwork] = useState<NetworkOption>(networkOptions[1]);
  const [redundancy, setRedundancy] = useState<RedundancyOption>(redundancyOptions[1]);
  const [buildSubmitted, setBuildSubmitted] = useState(false);
  const [buildResult, setBuildResult] = useState<{ score: number; feedback: string[] }>({ score: 0, feedback: [] });

  const questions = quizQuestions[4] || [];

  const totalPower = useMemo(() => racks.reduce((s, r) => s + r.totalPower, 0), [racks]);
  const totalHardwareCost = useMemo(() => racks.reduce((s, r) => s + r.totalCost, 0), [racks]);
  const monthlyRevenue = useMemo(() => racks.reduce((s, r) => s + r.monthlyRevenue, 0), [racks]);
  const monthlyPowerCost = useMemo(() => (totalPower * cooling.pue / 1000) * 0.10 * 730, [totalPower, cooling]);
  const monthlyRackOps = useMemo(() => racks.reduce((s, r) => s + r.monthlyCost, 0), [racks]);
  const monthlyCosts = monthlyPowerCost + cooling.monthlyCost + network.monthlyCost + redundancy.monthlyCost + monthlyRackOps;
  const monthlyProfit = monthlyRevenue - monthlyCosts;
  const profitMargin = monthlyRevenue > 0 ? (monthlyProfit / monthlyRevenue * 100) : 0;
  const totalServers = useMemo(() => racks.reduce((s, r) => s + r.servers.length, 0), [racks]);
  const vedicTip = getVedicProfitTip(monthlyRevenue, monthlyCosts);

  const addRack = (tpl: RackTemplate) => { if (racks.length < 20) setRacks((prev) => [...prev, tpl]); };
  const removeRack = (idx: number) => setRacks((prev) => prev.filter((_, i) => i !== idx));

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
      store.completeQuiz(4, Math.round((correct / questions.length) * 100));
    } else { setQuizIdx((i) => i + 1); setSelectedAnswer(null); setShowExplanation(false); }
  };

  const submitBuild = () => {
    const result = calculateRowScore(racks.length, totalPower, monthlyCosts, monthlyRevenue, cooling.pue, redundancy.uptime);
    setBuildResult({ score: result.score, feedback: result.feedback });
    setBuildSubmitted(true);
    store.completeSimulation(4, result.score);
  };

  return (
    <div className="min-h-screen bg-slate-900">
      <div className="bg-slate-800 border-b border-slate-700">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-orange-500 flex items-center justify-center"><Zap className="w-6 h-6 text-white" /></div>
            <div>
              <h1 className="text-xl font-bold text-white">Day 4: Building a Row</h1>
              <p className="text-sm text-slate-400">Design an entire row with cooling, network & power!</p>
            </div>
          </div>
          <Link href="/dashboard" className="text-slate-400 hover:text-white text-sm">← Dashboard</Link>
        </div>
        <div className="max-w-6xl mx-auto px-4 flex gap-1">
          {([["learn", BookOpen, "Learn"], ["quiz", Star, "Quiz"], ["build", Gamepad2, "Build"]] as const).map(([key, Icon, label]) => (
            <button key={key} onClick={() => setTab(key)} className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${tab === key ? "border-orange-500 text-orange-400" : "border-transparent text-slate-400 hover:text-white"}`}>
              <Icon className="w-4 h-4" />{label}
            </button>
          ))}
        </div>
      </div>

      {/* Advanced Extension Ribbon */}
      <div className="bg-purple-900/40 border-b border-purple-500/30 text-center py-1.5 px-4 text-xs text-purple-200">
        🎓 Going deeper? Try <Link href="/demo-advanced" className="font-bold underline text-purple-300 hover:text-white">Advanced Mode</Link> to design rows with MTBF and support contracts
      </div>

      <div className="max-w-6xl mx-auto px-4 py-6">
        {/* LEARN */}
        {tab === "learn" && (
          <div className="space-y-4 animate-slide-in">
            <div className="bg-gradient-to-r from-orange-900/30 to-red-900/30 border border-orange-500/20 rounded-xl p-6">
              <h2 className="text-2xl font-bold text-white mb-3">What is a Data Center Row? 🏗️</h2>
              <p className="text-slate-300 mb-2">A row is a line of racks in a data center. Rows are arranged with hot aisle/cold aisle containment to manage airflow efficiently.</p>
              <p className="text-slate-300">Beyond racks, you need cooling, networking, and power infrastructure to make everything work!</p>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-slate-800 border border-slate-700 rounded-xl p-4">
                <h3 className="text-white font-bold mb-2">🔌 Power Distribution</h3>
                <div className="space-y-2 text-sm text-slate-300">
                  <div className="flex items-center gap-2"><span className="bg-amber-500/20 text-amber-400 px-2 py-0.5 rounded text-xs">1</span> Utility Power</div>
                  <div className="flex items-center gap-2"><span className="bg-amber-500/20 text-amber-400 px-2 py-0.5 rounded text-xs">2</span> Transformer (high to low voltage)</div>
                  <div className="flex items-center gap-2"><span className="bg-amber-500/20 text-amber-400 px-2 py-0.5 rounded text-xs">3</span> UPS (battery backup)</div>
                  <div className="flex items-center gap-2"><span className="bg-amber-500/20 text-amber-400 px-2 py-0.5 rounded text-xs">4</span> PDU → Rack → Server</div>
                </div>
              </div>
              <div className="bg-slate-800 border border-slate-700 rounded-xl p-4">
                <h3 className="text-white font-bold mb-2">🌐 Network Topology</h3>
                <div className="space-y-2 text-sm text-slate-300">
                  <p><strong className="text-blue-400">ToR Switch:</strong> Top-of-Rack switch connects all servers in a rack</p>
                  <p><strong className="text-blue-400">Aggregation:</strong> Connects multiple racks together</p>
                  <p><strong className="text-blue-400">Core:</strong> Connects to the internet</p>
                </div>
              </div>
              <div className="bg-slate-800 border border-slate-700 rounded-xl p-4">
                <h3 className="text-white font-bold mb-2">🛡️ Redundancy Levels</h3>
                <div className="space-y-2 text-sm text-slate-300">
                  <p><strong>N:</strong> No backup — 99% uptime (~3.65 days downtime/year)</p>
                  <p><strong>N+1:</strong> One extra of each — 99.9% (~8.7 hours/year)</p>
                  <p><strong>2N:</strong> Fully duplicated — 99.99% (~52 minutes/year)</p>
                </div>
              </div>
              <div className="bg-slate-800 border border-slate-700 rounded-xl p-4">
                <h3 className="text-white font-bold mb-2">❄️ Cooling Systems</h3>
                <div className="space-y-2 text-sm text-slate-300">
                  <p><strong>Air Cooling:</strong> Traditional CRAC units, PUE ~2.0</p>
                  <p><strong>Liquid Cooling:</strong> Pipes to each chip, PUE ~1.2</p>
                  <p><strong>Free Cooling:</strong> Using outside air, PUE ~1.1</p>
                </div>
                <p className="text-slate-400 text-xs mt-2">PUE = Total Power / IT Power. Lower is better! (1.0 = perfect)</p>
              </div>
            </div>

            <button onClick={() => setTab("quiz")} className="w-full bg-orange-500 text-white font-bold py-3 rounded-xl hover:bg-orange-400">Ready for the Quiz? →</button>
          </div>
        )}

        {/* QUIZ */}
        {tab === "quiz" && (
          <div className="max-w-2xl mx-auto animate-slide-in">
            {!quizDone && questions.length > 0 ? (
              <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-sm text-slate-400">Question {quizIdx + 1} of {questions.length}</span>
                </div>
                <div className="w-full bg-slate-700 rounded-full h-2 mb-6">
                  <div className="bg-orange-500 h-2 rounded-full transition-all" style={{ width: `${((quizIdx + 1) / questions.length) * 100}%` }} />
                </div>
                <h3 className="text-xl font-bold text-white mb-6">{questions[quizIdx].question}</h3>
                <div className="space-y-3">
                  {questions[quizIdx].options.map((opt, oi) => {
                    let cls = "border-slate-600 hover:border-slate-500";
                    if (showExplanation) {
                      if (oi === questions[quizIdx].correctAnswer) cls = "border-emerald-500 bg-emerald-500/10";
                      else if (oi === selectedAnswer) cls = "border-red-500 bg-red-500/10";
                    }
                    return <button key={oi} onClick={() => handleQuizAnswer(oi)} className={`w-full text-left p-4 rounded-lg border ${cls} transition-colors`}><span className="text-white">{opt}</span></button>;
                  })}
                </div>
                {showExplanation && (
                  <div className="mt-4 space-y-3">
                    <div className={`p-3 rounded-lg ${selectedAnswer === questions[quizIdx].correctAnswer ? "bg-emerald-500/10 border border-emerald-500/30" : "bg-red-500/10 border border-red-500/30"}`}>
                      <p className="text-sm text-slate-300">{selectedAnswer === questions[quizIdx].correctAnswer ? "✅ Correct!" : "❌ Not quite!"} {questions[quizIdx].explanation}</p>
                    </div>
                    <button onClick={nextQuestion} className="w-full bg-orange-500 text-white font-bold py-2 rounded-lg hover:bg-orange-400">
                      {quizIdx + 1 >= questions.length ? "See Results" : "Next Question →"}
                    </button>
                  </div>
                )}
              </div>
            ) : quizDone ? (
              <div className="bg-slate-800 border border-slate-700 rounded-xl p-8 text-center">
                <Trophy className="w-16 h-16 text-amber-400 mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-white mb-2">Quiz Complete!</h2>
                <p className="text-4xl font-black text-orange-400 mb-4">{quizAnswers.filter((a, i) => a === questions[i]?.correctAnswer).length}/{questions.length}</p>
                <button onClick={() => setTab("build")} className="bg-orange-500 text-white font-bold py-3 px-8 rounded-xl hover:bg-orange-400">Start Building! →</button>
              </div>
            ) : <p className="text-slate-400 text-center">No quiz questions available.</p>}
          </div>
        )}

        {/* BUILD */}
        {tab === "build" && (
          <div className="animate-slide-in">
            {!buildSubmitted ? (
              <div className="grid lg:grid-cols-3 gap-4">
                <div className="lg:col-span-2 space-y-4">
                  {/* Rack Templates */}
                  <div className="bg-slate-800 border border-slate-700 rounded-xl p-4">
                    <h3 className="text-white font-bold mb-3">Step 1: Add Racks ({racks.length}/20)</h3>
                    <div className="grid sm:grid-cols-2 gap-3">
                      {rackTemplates.map((tpl) => (
                        <button key={tpl.id} onClick={() => addRack(tpl)} disabled={racks.length >= 20}
                          className="text-left p-3 rounded-lg border border-slate-600 hover:border-orange-500/50 disabled:opacity-40 transition-all">
                          <div className="flex justify-between items-start mb-1">
                            <span className="text-white font-medium">{tpl.name}</span>
                            <span className="text-emerald-400 font-bold text-sm">${tpl.totalCost.toLocaleString()}</span>
                          </div>
                          <p className="text-slate-400 text-xs mb-2">{tpl.description}</p>
                          <div className="flex flex-wrap gap-2 text-xs text-slate-400">
                            <span>{tpl.servers.length} servers</span>
                            <span>{tpl.totalUnits}U used</span>
                            <span>{(tpl.totalPower / 1000).toFixed(1)}kW</span>
                            <span className="text-emerald-400">${tpl.monthlyRevenue.toLocaleString()}/mo</span>
                          </div>
                          <div className="mt-2 text-orange-400 text-xs flex items-center gap-1"><Plus className="w-3 h-3" /> Add Rack</div>
                        </button>
                      ))}
                    </div>
                    {/* Added racks */}
                    {racks.length > 0 && (
                      <div className="mt-3 space-y-1">
                        <h4 className="text-sm text-slate-400">Your Racks:</h4>
                        {racks.map((r, i) => (
                          <div key={i} className="flex items-center justify-between bg-slate-700/50 rounded px-3 py-1">
                            <span className="text-white text-sm">{r.name}</span>
                            <button onClick={() => removeRack(i)} className="text-red-400 hover:text-red-300"><Trash2 className="w-3 h-3" /></button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Cooling */}
                  <div className="bg-slate-800 border border-slate-700 rounded-xl p-4">
                    <h3 className="text-white font-bold mb-3 flex items-center gap-2"><Thermometer className="w-4 h-4 text-blue-400" /> Step 2: Cooling System</h3>
                    <div className="grid sm:grid-cols-2 gap-2">
                      {coolingOptions.map((opt) => (
                        <button key={opt.id} onClick={() => setCooling(opt)} className={`text-left p-3 rounded-lg border transition-all ${cooling.id === opt.id ? "border-blue-500 bg-blue-500/10" : "border-slate-600 hover:border-slate-500"}`}>
                          <span className="text-white font-medium text-sm">{opt.name}</span>
                          <p className="text-slate-400 text-xs">{opt.description}</p>
                          <div className="flex justify-between mt-1 text-xs">
                            <span className="text-amber-400">PUE: {opt.pue}</span>
                            <span className="text-red-400">${opt.monthlyCost.toLocaleString()}/mo</span>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Network */}
                  <div className="bg-slate-800 border border-slate-700 rounded-xl p-4">
                    <h3 className="text-white font-bold mb-3 flex items-center gap-2"><Wifi className="w-4 h-4 text-emerald-400" /> Step 3: Network</h3>
                    <div className="grid grid-cols-3 gap-2">
                      {networkOptions.map((opt) => (
                        <button key={opt.id} onClick={() => setNetwork(opt)} className={`text-left p-3 rounded-lg border transition-all ${network.id === opt.id ? "border-emerald-500 bg-emerald-500/10" : "border-slate-600 hover:border-slate-500"}`}>
                          <span className="text-white font-medium text-sm">{opt.name}</span>
                          <p className="text-slate-400 text-xs">{opt.speed}</p>
                          <span className="text-red-400 text-xs">${opt.monthlyCost.toLocaleString()}/mo</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Redundancy */}
                  <div className="bg-slate-800 border border-slate-700 rounded-xl p-4">
                    <h3 className="text-white font-bold mb-3 flex items-center gap-2"><Shield className="w-4 h-4 text-purple-400" /> Step 4: Power Redundancy</h3>
                    <div className="grid grid-cols-3 gap-2">
                      {redundancyOptions.map((opt) => (
                        <button key={opt.id} onClick={() => setRedundancy(opt)} className={`text-left p-3 rounded-lg border transition-all ${redundancy.id === opt.id ? "border-purple-500 bg-purple-500/10" : "border-slate-600 hover:border-slate-500"}`}>
                          <span className="text-white font-medium text-sm">{opt.name}</span>
                          <p className="text-emerald-400 text-xs">{opt.uptime}% uptime</p>
                          <span className="text-red-400 text-xs">{opt.monthlyCost > 0 ? `$${opt.monthlyCost.toLocaleString()}/mo` : "Free"}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Vedic */}
                  <div className="vedic-card rounded-xl p-4">
                    <h4 className="text-amber-200 font-bold mb-1">🧮 {vedicTip.title}</h4>
                    <p className="text-amber-100/80 text-sm">{vedicTip.example}</p>
                  </div>
                </div>

                {/* Dashboard */}
                <div>
                  <div className="bg-slate-800 border border-slate-700 rounded-xl p-4 sticky top-4">
                    <h3 className="text-lg font-bold text-white mb-4">Row Dashboard</h3>

                    {/* Row visual */}
                    <div className="flex gap-1 mb-4 overflow-x-auto pb-2">
                      {racks.length === 0 ? (
                        <div className="text-slate-500 text-sm py-4 w-full text-center">Add racks to see your row</div>
                      ) : (
                        racks.map((_, i) => (
                          <div key={i} className="w-6 h-16 bg-gradient-to-t from-slate-600 to-slate-500 rounded-sm border border-slate-400 flex-shrink-0" title={`Rack ${i + 1}`} />
                        ))
                      )}
                    </div>

                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between"><span className="text-slate-400">Racks</span><span className="text-white">{racks.length}</span></div>
                      <div className="flex justify-between"><span className="text-slate-400">Servers</span><span className="text-white">{totalServers}</span></div>
                      <div className="flex justify-between"><span className="text-slate-400">IT Power</span><span className="text-amber-400">{(totalPower / 1000).toFixed(1)} kW</span></div>
                      <div className="flex justify-between"><span className="text-slate-400">PUE</span><span className="text-blue-400">{cooling.pue}</span></div>
                      <div className="flex justify-between"><span className="text-slate-400">Uptime</span><span className="text-purple-400">{redundancy.uptime}%</span></div>

                      <div className="border-t border-slate-700 pt-2 mt-2">
                        <p className="text-slate-500 text-xs mb-1">Monthly Costs</p>
                        <div className="flex justify-between"><span className="text-slate-400">Power</span><span className="text-red-400">-${Math.round(monthlyPowerCost).toLocaleString()}</span></div>
                        <div className="flex justify-between"><span className="text-slate-400">Cooling</span><span className="text-red-400">-${cooling.monthlyCost.toLocaleString()}</span></div>
                        <div className="flex justify-between"><span className="text-slate-400">Network</span><span className="text-red-400">-${network.monthlyCost.toLocaleString()}</span></div>
                        <div className="flex justify-between"><span className="text-slate-400">Redundancy</span><span className="text-red-400">-${redundancy.monthlyCost.toLocaleString()}</span></div>
                        <div className="flex justify-between"><span className="text-slate-400">Operations</span><span className="text-red-400">-${monthlyRackOps.toLocaleString()}</span></div>
                        <div className="flex justify-between font-medium"><span className="text-slate-300">Total Costs</span><span className="text-red-400">-${Math.round(monthlyCosts).toLocaleString()}</span></div>
                      </div>

                      <div className="border-t border-slate-700 pt-2">
                        <div className="flex justify-between"><span className="text-slate-400">Revenue</span><span className="text-emerald-400">${monthlyRevenue.toLocaleString()}</span></div>
                        <div className="flex justify-between font-bold text-base">
                          <span className="text-slate-200">Profit</span>
                          <span className={monthlyProfit > 0 ? "text-emerald-400" : "text-red-400"}>${Math.round(monthlyProfit).toLocaleString()}/mo</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">Margin</span>
                          <span className={profitMargin > 0 ? "text-emerald-400" : "text-red-400"}>{profitMargin.toFixed(1)}%</span>
                        </div>
                      </div>
                    </div>

                    <button onClick={submitBuild} disabled={racks.length < 4} className="w-full mt-4 bg-orange-500 text-white font-bold py-3 rounded-xl hover:bg-orange-400 disabled:opacity-50 disabled:cursor-not-allowed">
                      {racks.length < 4 ? `Add ${4 - racks.length} more rack${4 - racks.length > 1 ? "s" : ""}` : "Submit Row"}
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="max-w-lg mx-auto bg-slate-800 border border-slate-700 rounded-xl p-8 text-center">
                <Trophy className="w-16 h-16 text-amber-400 mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-white mb-2">Row Complete!</h2>
                <p className="text-5xl font-black text-orange-400 mb-4">{buildResult.score}/100</p>
                <div className="text-left space-y-2 mb-6">
                  {buildResult.feedback.map((f, i) => <p key={i} className="text-sm text-slate-300">• {f}</p>)}
                </div>
                <div className="flex gap-3">
                  <button onClick={() => { setBuildSubmitted(false); setRacks([]); }} className="flex-1 bg-slate-700 text-white py-2 rounded-lg hover:bg-slate-600">Try Again</button>
                  <Link href="/day/5" className="flex-1 bg-orange-500 text-white py-2 rounded-lg hover:bg-orange-400 text-center font-bold">Day 5 →</Link>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
