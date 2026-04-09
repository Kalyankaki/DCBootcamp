"use client";

import { useState } from "react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import {
  Server,
  LayoutDashboard,
  Cpu,
  HardDrive,
  Database,
  Rows3,
  Trophy,
  Star,
  Menu,
  X,
  LogOut,
  GraduationCap,
} from "lucide-react";

const dayLinks = [
  { day: 1, name: "Motherboard", icon: Cpu },
  { day: 2, name: "Server", icon: HardDrive },
  { day: 3, name: "Rack", icon: Database },
  { day: 4, name: "Row", icon: Rows3 },
  { day: 5, name: "Competition", icon: Trophy },
];

interface NavbarProps {
  currentDay?: number;
  points?: number;
}

export default function Navbar({ currentDay = 1, points = 0 }: NavbarProps) {
  const { data: session } = useSession();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav className="bg-slate-900 border-b border-slate-700 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-2 text-emerald-400 font-extrabold text-xl hover:text-emerald-300 transition-colors shrink-0"
          >
            <Server className="w-7 h-7" />
            <span>DC Bootcamp</span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden lg:flex items-center gap-1 ml-6">
            <Link
              href="/dashboard"
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-800 transition-all"
            >
              <LayoutDashboard className="w-4 h-4" />
              Dashboard
            </Link>
            {((session?.user as any)?.role === "teacher" || (session?.user as any)?.role === "superadmin") && (
              <Link
                href="/teacher"
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium text-indigo-300 hover:text-white hover:bg-indigo-900/50 transition-all"
              >
                <GraduationCap className="w-4 h-4" />
                Teacher
              </Link>
            )}
            {dayLinks.map((d) => {
              const Icon = d.icon;
              const isActive = currentDay === d.day;
              return (
                <Link
                  key={d.day}
                  href={`/day/${d.day}`}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                    isActive
                      ? "bg-emerald-600 text-white shadow-lg shadow-emerald-500/25"
                      : "text-slate-300 hover:text-white hover:bg-slate-800"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  Day {d.day}
                  <span className="hidden xl:inline">- {d.name}</span>
                </Link>
              );
            })}
          </div>

          {/* Right side */}
          <div className="hidden lg:flex items-center gap-4 ml-auto pl-4">
            {/* Points */}
            <div className="flex items-center gap-1.5 bg-slate-800 px-3 py-1.5 rounded-full border border-amber-500/30">
              <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
              <span className="text-amber-300 font-bold text-sm">{points.toLocaleString()}</span>
            </div>

            {/* User */}
            {session?.user && (
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  {session.user.image ? (
                    <img
                      src={session.user.image}
                      alt=""
                      className="w-8 h-8 rounded-full border-2 border-emerald-500"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-emerald-600 flex items-center justify-center text-white font-bold text-sm">
                      {session.user.name?.[0] ?? "?"}
                    </div>
                  )}
                  <span className="text-slate-200 text-sm font-medium">
                    {session.user.name}
                  </span>
                </div>
                <button
                  onClick={() => signOut()}
                  className="p-2 rounded-lg text-slate-400 hover:text-red-400 hover:bg-slate-800 transition-colors"
                  title="Sign out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="lg:hidden p-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
          >
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="lg:hidden bg-slate-800 border-t border-slate-700 px-4 pb-4 pt-2 space-y-1 animate-[slideDown_0.2s_ease-out]">
          {/* Points */}
          <div className="flex items-center gap-2 px-3 py-2 mb-2">
            <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
            <span className="text-amber-300 font-bold">{points.toLocaleString()} pts</span>
          </div>

          <Link
            href="/dashboard"
            onClick={() => setMobileOpen(false)}
            className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-slate-300 hover:text-white hover:bg-slate-700 transition-all"
          >
            <LayoutDashboard className="w-5 h-5" />
            Dashboard
          </Link>

          {((session?.user as any)?.role === "teacher" || (session?.user as any)?.role === "superadmin") && (
            <Link
              href="/teacher"
              onClick={() => setMobileOpen(false)}
              className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-indigo-300 hover:text-white hover:bg-indigo-900/50 transition-all"
            >
              <GraduationCap className="w-5 h-5" />
              Teacher Dashboard
            </Link>
          )}

          {dayLinks.map((d) => {
            const Icon = d.icon;
            const isActive = currentDay === d.day;
            return (
              <Link
                key={d.day}
                href={`/day/${d.day}`}
                onClick={() => setMobileOpen(false)}
                className={`flex items-center gap-2 px-3 py-2.5 rounded-lg transition-all ${
                  isActive
                    ? "bg-emerald-600 text-white"
                    : "text-slate-300 hover:text-white hover:bg-slate-700"
                }`}
              >
                <Icon className="w-5 h-5" />
                Day {d.day} - {d.name}
              </Link>
            );
          })}

          {session?.user && (
            <div className="border-t border-slate-700 mt-2 pt-2">
              <div className="flex items-center gap-2 px-3 py-2">
                {session.user.image ? (
                  <img src={session.user.image} alt="" className="w-8 h-8 rounded-full border-2 border-emerald-500" />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-emerald-600 flex items-center justify-center text-white font-bold text-sm">
                    {session.user.name?.[0] ?? "?"}
                  </div>
                )}
                <span className="text-slate-200 text-sm font-medium">{session.user.name}</span>
              </div>
              <button
                onClick={() => signOut()}
                className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-red-400 hover:bg-slate-700 transition-colors w-full"
              >
                <LogOut className="w-5 h-5" />
                Sign Out
              </button>
            </div>
          )}
        </div>
      )}
    </nav>
  );
}
