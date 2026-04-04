"use client";

import React, { useState, useMemo } from "react";
import { useSession } from "next-auth/react";
import {
  ShieldAlert,
  Users,
  Activity,
  BarChart3,
  TrendingUp,
  Search,
  Download,
  Trophy,
  Settings,
  ChevronDown,
  ChevronUp,
  Save,
} from "lucide-react";

// ─── Super admin whitelist ──────────────────────────────────────────────

const SUPER_ADMINS = [
  "kalyank.123@gmail.com",
  "communications@mathcodelab.com",
];

// ─── Mock data ──────────────────────────────────────────────────────────

const mockStudents = [
  { name: "Aarav Patel", email: "aarav@school.edu", currentDay: 5, points: 2850, lastActive: "2026-04-04" },
  { name: "Sophia Chen", email: "sophia@school.edu", currentDay: 5, points: 2720, lastActive: "2026-04-04" },
  { name: "Liam Johnson", email: "liam@school.edu", currentDay: 4, points: 2100, lastActive: "2026-04-03" },
  { name: "Priya Sharma", email: "priya@school.edu", currentDay: 5, points: 2650, lastActive: "2026-04-04" },
  { name: "Marcus Williams", email: "marcus@school.edu", currentDay: 3, points: 1500, lastActive: "2026-04-02" },
  { name: "Emily Davis", email: "emily@school.edu", currentDay: 4, points: 1980, lastActive: "2026-04-03" },
  { name: "Ravi Kumar", email: "ravi@school.edu", currentDay: 5, points: 2900, lastActive: "2026-04-04" },
  { name: "Olivia Brown", email: "olivia@school.edu", currentDay: 2, points: 800, lastActive: "2026-04-01" },
  { name: "Noah Garcia", email: "noah@school.edu", currentDay: 4, points: 2050, lastActive: "2026-04-03" },
  { name: "Ananya Singh", email: "ananya@school.edu", currentDay: 5, points: 2780, lastActive: "2026-04-04" },
];

const dayAvgScores = [
  { day: 1, label: "Motherboard", avg: 82 },
  { day: 2, label: "Server", avg: 75 },
  { day: 3, label: "Rack", avg: 68 },
  { day: 4, label: "Row", avg: 71 },
  { day: 5, label: "Competition", avg: 64 },
];

// ─── Component ──────────────────────────────────────────────────────────

export default function AdminPage() {
  const { data: session, status } = useSession();

  // Settings local state
  const [settingsBudget, setSettingsBudget] = useState(500000);
  const [settingsTimer, setSettingsTimer] = useState(30);
  const [settingsSaved, setSettingsSaved] = useState(false);

  // Table search
  const [searchQuery, setSearchQuery] = useState("");

  // Panel toggles
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  // ── Auth check ──────────────────────────────────────────────────────

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-2 border-emerald-400 border-t-transparent rounded-full" />
      </div>
    );
  }

  const email = session?.user?.email ?? "";
  if (!SUPER_ADMINS.includes(email)) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center text-white">
        <div className="text-center max-w-md">
          <ShieldAlert className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-extrabold mb-2">Access Denied</h1>
          <p className="text-slate-400">
            You do not have permission to view this page. Only super
            administrators can access the Admin Control Center.
          </p>
          <p className="text-slate-500 text-sm mt-4">
            Signed in as: {email || "not signed in"}
          </p>
        </div>
      </div>
    );
  }

  // ── Derived data ────────────────────────────────────────────────────

  const totalStudents = 45;
  const activeToday = mockStudents.filter((s) => s.lastActive === "2026-04-04").length;
  const avgScore = Math.round(mockStudents.reduce((a, s) => a + s.points, 0) / mockStudents.length);
  const completionRate = Math.round(
    (mockStudents.filter((s) => s.currentDay === 5).length / mockStudents.length) * 100
  );

  const filteredStudents = searchQuery
    ? mockStudents.filter(
        (s) =>
          s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          s.email.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : mockStudents;

  const leaderboard = [...mockStudents].sort((a, b) => b.points - a.points);

  // ── Export CSV ──────────────────────────────────────────────────────

  const exportCSV = () => {
    const header = "Name,Email,Current Day,Points,Last Active\n";
    const body = mockStudents
      .map((s) => `${s.name},${s.email},${s.currentDay},${s.points},${s.lastActive}`)
      .join("\n");
    const blob = new Blob([header + body], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "dc-bootcamp-students.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleSaveSettings = () => {
    setSettingsSaved(true);
    setTimeout(() => setSettingsSaved(false), 2000);
  };

  // ── Render ─────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      {/* Header */}
      <div className="bg-slate-800 border-b border-slate-700">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center gap-3">
            <ShieldAlert className="w-8 h-8 text-emerald-400" />
            <div>
              <h1 className="text-2xl md:text-3xl font-extrabold">
                Admin Control Center
              </h1>
              <p className="text-slate-400 text-sm">
                Manage students, view analytics, and configure settings
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6 space-y-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { icon: Users, label: "Total Students", value: totalStudents, color: "text-blue-400", bg: "bg-blue-500/10 border-blue-500/20" },
            { icon: Activity, label: "Active Today", value: activeToday, color: "text-emerald-400", bg: "bg-emerald-500/10 border-emerald-500/20" },
            { icon: BarChart3, label: "Average Score", value: avgScore.toLocaleString(), color: "text-amber-400", bg: "bg-amber-500/10 border-amber-500/20" },
            { icon: TrendingUp, label: "Completion Rate", value: `${completionRate}%`, color: "text-purple-400", bg: "bg-purple-500/10 border-purple-500/20" },
          ].map((card) => {
            const Icon = card.icon;
            return (
              <div key={card.label} className={`rounded-xl border p-4 ${card.bg}`}>
                <Icon className={`w-6 h-6 ${card.color} mb-2`} />
                <p className="text-xs text-slate-400 uppercase tracking-wide">{card.label}</p>
                <p className={`text-2xl font-extrabold ${card.color}`}>{card.value}</p>
              </div>
            );
          })}
        </div>

        {/* Student Table */}
        <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden">
          <div className="px-4 py-3 border-b border-slate-700 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <h2 className="font-bold text-lg">Student Roster</h2>
            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type="text"
                  placeholder="Search students..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-slate-900 border border-slate-600 rounded-lg pl-9 pr-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500 w-56"
                />
              </div>
              <button
                onClick={exportCSV}
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-bold transition-colors"
              >
                <Download className="w-4 h-4" />
                Export CSV
              </button>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-slate-400 text-xs uppercase tracking-wider">
                  <th className="px-4 py-3">Name</th>
                  <th className="px-4 py-3">Email</th>
                  <th className="px-4 py-3 text-center">Current Day</th>
                  <th className="px-4 py-3 text-right">Points</th>
                  <th className="px-4 py-3 text-right">Last Active</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700">
                {filteredStudents.map((student, idx) => (
                  <tr
                    key={student.email}
                    className="hover:bg-slate-750 transition-colors"
                  >
                    <td className="px-4 py-3 font-medium text-white">
                      {student.name}
                    </td>
                    <td className="px-4 py-3 text-slate-400">
                      {student.email}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span
                        className={`inline-block px-2 py-0.5 rounded-full text-xs font-bold ${
                          student.currentDay === 5
                            ? "bg-emerald-900/50 text-emerald-400"
                            : "bg-slate-700 text-slate-300"
                        }`}
                      >
                        Day {student.currentDay}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right font-bold text-amber-400">
                      {student.points.toLocaleString()}
                    </td>
                    <td className="px-4 py-3 text-right text-slate-400">
                      {student.lastActive}
                    </td>
                  </tr>
                ))}
                {filteredStudents.length === 0 && (
                  <tr>
                    <td
                      colSpan={5}
                      className="px-4 py-8 text-center text-slate-500"
                    >
                      No students match your search.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Day Analytics */}
        <div className="bg-slate-800 rounded-xl border border-slate-700 p-5">
          <h2 className="font-bold text-lg mb-4 flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-cyan-400" />
            Day Analytics &mdash; Average Scores
          </h2>
          <div className="space-y-3">
            {dayAvgScores.map((d) => (
              <div key={d.day} className="flex items-center gap-3">
                <span className="w-28 text-sm text-slate-400 shrink-0">
                  Day {d.day}: {d.label}
                </span>
                <div className="flex-1 h-6 bg-slate-700 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-full flex items-center justify-end pr-2 text-xs font-bold transition-all duration-700"
                    style={{ width: `${d.avg}%` }}
                  >
                    {d.avg}%
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Leaderboard */}
        <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden">
          <button
            onClick={() => setShowLeaderboard(!showLeaderboard)}
            className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-slate-750 transition-colors"
          >
            <h2 className="font-bold text-lg flex items-center gap-2">
              <Trophy className="w-5 h-5 text-amber-400" />
              Leaderboard
            </h2>
            {showLeaderboard ? (
              <ChevronUp className="w-5 h-5 text-slate-500" />
            ) : (
              <ChevronDown className="w-5 h-5 text-slate-500" />
            )}
          </button>
          {showLeaderboard && (
            <div className="border-t border-slate-700">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-slate-400 text-xs uppercase tracking-wider">
                    <th className="px-4 py-3 w-16">Rank</th>
                    <th className="px-4 py-3">Name</th>
                    <th className="px-4 py-3 text-right">Points</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-700">
                  {leaderboard.map((student, idx) => (
                    <tr
                      key={student.email}
                      className={
                        idx < 3
                          ? "bg-amber-500/5"
                          : "hover:bg-slate-750 transition-colors"
                      }
                    >
                      <td className="px-4 py-3">
                        <span
                          className={`inline-flex items-center justify-center w-7 h-7 rounded-full text-xs font-extrabold ${
                            idx === 0
                              ? "bg-amber-500 text-black"
                              : idx === 1
                              ? "bg-slate-400 text-black"
                              : idx === 2
                              ? "bg-amber-700 text-white"
                              : "bg-slate-700 text-slate-400"
                          }`}
                        >
                          {idx + 1}
                        </span>
                      </td>
                      <td className="px-4 py-3 font-medium text-white">
                        {student.name}
                      </td>
                      <td className="px-4 py-3 text-right font-bold text-amber-400">
                        {student.points.toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Settings */}
        <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden">
          <button
            onClick={() => setShowSettings(!showSettings)}
            className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-slate-750 transition-colors"
          >
            <h2 className="font-bold text-lg flex items-center gap-2">
              <Settings className="w-5 h-5 text-slate-400" />
              Settings
            </h2>
            {showSettings ? (
              <ChevronUp className="w-5 h-5 text-slate-500" />
            ) : (
              <ChevronDown className="w-5 h-5 text-slate-500" />
            )}
          </button>
          {showSettings && (
            <div className="border-t border-slate-700 p-5 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-slate-400 mb-1.5 font-medium">
                    Competition Budget ($)
                  </label>
                  <input
                    type="number"
                    value={settingsBudget}
                    onChange={(e) => setSettingsBudget(Number(e.target.value))}
                    className="w-full bg-slate-900 border border-slate-600 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-sm text-slate-400 mb-1.5 font-medium">
                    Timer Duration (minutes)
                  </label>
                  <input
                    type="number"
                    value={settingsTimer}
                    onChange={(e) => setSettingsTimer(Number(e.target.value))}
                    min={1}
                    max={120}
                    className="w-full bg-slate-900 border border-slate-600 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>
              <button
                onClick={handleSaveSettings}
                className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm transition-colors"
              >
                <Save className="w-4 h-4" />
                {settingsSaved ? "Saved!" : "Save Settings"}
              </button>
              {settingsSaved && (
                <p className="text-xs text-emerald-400">
                  Settings saved to local state.
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
