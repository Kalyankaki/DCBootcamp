"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";
import {
  Server,
  Cpu,
  HardDrive,
  Zap,
  Trophy,
  ArrowRight,
  Brain,
  Gamepad2,
  DollarSign,
  ChevronRight,
} from "lucide-react";

const days = [
  { day: 1, title: "Motherboard", icon: Cpu, color: "from-emerald-500 to-emerald-700", desc: "Learn every chip, slot, and port on a motherboard" },
  { day: 2, title: "Server", icon: Server, color: "from-blue-500 to-blue-700", desc: "Assemble motherboards into powerful servers" },
  { day: 3, title: "Rack", icon: HardDrive, color: "from-purple-500 to-purple-700", desc: "Stack servers into 42U racks" },
  { day: 4, title: "Row", icon: Zap, color: "from-orange-500 to-orange-700", desc: "Design rows with cooling & power" },
  { day: 5, title: "Competition", icon: Trophy, color: "from-amber-500 to-red-500", desc: "Shark Tank: build a profitable data center!" },
];

export default function HomePage() {
  const { data: session } = useSession();

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900">
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-900/20 to-blue-900/20" />
        <div className="max-w-6xl mx-auto px-4 py-20 relative z-10">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/30 rounded-full px-4 py-1 text-emerald-400 text-sm mb-6">
              <Zap className="w-4 h-4" /> 5-Day Bootcamp for Grades 4-10
            </div>
            <h1 className="text-5xl md:text-7xl font-black text-white mb-4 leading-tight">
              Data Center
              <br />
              <span className="bg-gradient-to-r from-emerald-400 to-blue-400 bg-clip-text text-transparent">
                Bootcamp
              </span>
            </h1>
            <p className="text-xl text-slate-300 max-w-2xl mx-auto mb-4">
              From motherboard to cloud profit in 5 days!
            </p>
            <p className="text-slate-400 max-w-xl mx-auto mb-8">
              Every AI model. Every app. Every video call. All running on a data center.
              Learn exactly how — and build one yourself.
            </p>
            <Link
              href={session ? "/dashboard" : "/login"}
              className="inline-flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white font-bold py-4 px-8 rounded-xl hover:from-emerald-400 hover:to-emerald-500 transition-all hover:scale-105 shadow-lg shadow-emerald-500/25 text-lg"
            >
              {session ? "Go to Dashboard" : "Get Started"} <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-6xl mx-auto px-4 py-16">
        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6 card-hover">
            <Gamepad2 className="w-10 h-10 text-emerald-400 mb-4" />
            <h3 className="text-lg font-bold text-white mb-2">Gamified Learning</h3>
            <p className="text-slate-400 text-sm">
              Earn points, badges, and climb the leaderboard as you build your data center from scratch.
            </p>
          </div>
          <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6 card-hover">
            <DollarSign className="w-10 h-10 text-amber-400 mb-4" />
            <h3 className="text-lg font-bold text-white mb-2">Real Economics</h3>
            <p className="text-slate-400 text-sm">
              Learn COGS, profit margins, ROI, and what makes a data center business profitable.
            </p>
          </div>
          <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6 card-hover">
            <Brain className="w-10 h-10 text-purple-400 mb-4" />
            <h3 className="text-lg font-bold text-white mb-2">Vedic Math</h3>
            <p className="text-slate-400 text-sm">
              Ancient Indian math shortcuts to crunch big numbers fast — multiply, percentage, verify!
            </p>
          </div>
        </div>
      </section>

      {/* 5-Day Curriculum */}
      <section className="max-w-6xl mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center text-white mb-12">5-Day Curriculum</h2>
        <div className="space-y-4">
          {days.map((d) => (
            <div key={d.day} className="bg-slate-800/50 border border-slate-700 rounded-xl p-6 flex items-center gap-6 card-hover">
              <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${d.color} flex items-center justify-center flex-shrink-0`}>
                <d.icon className="w-7 h-7 text-white" />
              </div>
              <div className="flex-1">
                <div className="text-sm text-slate-500 font-medium">Day {d.day}</div>
                <h3 className="text-lg font-bold text-white">{d.title}</h3>
                <p className="text-slate-400 text-sm">{d.desc}</p>
              </div>
              <ChevronRight className="w-5 h-5 text-slate-500" />
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-6xl mx-auto px-4 py-16 text-center">
        <div className="bg-gradient-to-r from-emerald-900/50 to-blue-900/50 border border-emerald-500/20 rounded-2xl p-12">
          <h2 className="text-3xl font-bold text-white mb-4">Ready to Build the Internet?</h2>
          <p className="text-slate-300 mb-8 max-w-lg mx-auto">
            Join the bootcamp and go from zero to data center engineer in 5 days!
          </p>
          <Link
            href={session ? "/dashboard" : "/login"}
            className="inline-flex items-center gap-2 bg-emerald-500 text-white font-bold py-3 px-8 rounded-xl hover:bg-emerald-400 transition-all"
          >
            Start Building <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      <footer className="border-t border-slate-800 py-8 text-center text-slate-500 text-sm">
        <p>A MathCodeLab Production | Data Center Bootcamp &copy; 2026</p>
      </footer>
    </div>
  );
}
