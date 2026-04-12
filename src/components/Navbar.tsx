"use client";

import { useState } from "react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import {
  Server, LayoutDashboard, Cpu, HardDrive, Database, Rows3, Trophy,
  Menu, X, LogOut, GraduationCap, Sun, Moon, Star,
} from "lucide-react";
import { useTheme } from "@/components/ThemeProvider";

const dayLinks = [
  { day: 1, name: "Motherboard", icon: Cpu },
  { day: 2, name: "Server", icon: HardDrive },
  { day: 3, name: "Rack", icon: Database },
  { day: 4, name: "Row", icon: Rows3 },
  { day: 5, name: "Pitch", icon: Trophy },
];

interface NavbarProps {
  currentDay?: number;
  points?: number;
}

export default function Navbar({ currentDay = 1, points = 0 }: NavbarProps) {
  const { data: session } = useSession();
  const { theme, toggleTheme } = useTheme();
  const [mobileOpen, setMobileOpen] = useState(false);

  const role = (session?.user as { role?: string } | undefined)?.role;
  const isTeacher = role === "teacher" || role === "superadmin";

  return (
    <nav className="sticky top-0 z-40 bg-slate-800/90 border-b border-slate-700 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-14">
          {/* Brand */}
          <Link href="/" className="flex items-center gap-2.5 shrink-0">
            <div className="w-7 h-7 rounded-md bg-blue-600 flex items-center justify-center">
              <Server className="w-4 h-4 text-white" />
            </div>
            <span className="text-white font-semibold text-sm tracking-tight">DC Bootcamp</span>
          </Link>

          {/* Desktop nav — only for students */}
          {!isTeacher && (
            <div className="hidden lg:flex items-center gap-0.5 ml-6">
              <NavLink href="/dashboard" icon={<LayoutDashboard className="w-3.5 h-3.5" />} label="Dashboard" active={false} />
              {dayLinks.map((d) => {
                const Icon = d.icon;
                return (
                  <NavLink
                    key={d.day}
                    href={`/day/${d.day}`}
                    icon={<Icon className="w-3.5 h-3.5" />}
                    label={`Day ${d.day}`}
                    sublabel={d.name}
                    active={currentDay === d.day}
                  />
                );
              })}
            </div>
          )}

          {/* Teacher sub-badge */}
          {isTeacher && (
            <div className="hidden lg:flex items-center gap-2 ml-6 px-3 py-1 rounded-md bg-indigo-500/10 border border-indigo-500/30">
              <GraduationCap className="w-3.5 h-3.5 text-indigo-300" />
              <span className="text-indigo-300 text-xs font-semibold uppercase tracking-wider">Teacher Console</span>
            </div>
          )}

          {/* Right side */}
          <div className="hidden lg:flex items-center gap-2 ml-auto pl-4">
            {!isTeacher && (
              <div className="flex items-center gap-1.5 bg-slate-700/60 px-2.5 py-1 rounded-md border border-slate-600">
                <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                <span className="text-white font-semibold text-xs tabular-nums">{points.toLocaleString()} pts</span>
              </div>
            )}

            <button
              onClick={toggleTheme}
              aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
              title={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
              className="w-8 h-8 rounded-md border border-slate-600 bg-slate-700/60 text-slate-300 hover:text-white hover:bg-slate-700 transition-colors flex items-center justify-center"
            >
              {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>

            {session?.user && (
              <div className="flex items-center gap-2 pl-2 ml-1 border-l border-slate-700">
                {session.user.image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={session.user.image}
                    alt=""
                    className="w-7 h-7 rounded-full border border-slate-600"
                  />
                ) : (
                  <div className="w-7 h-7 rounded-full bg-blue-600 flex items-center justify-center text-white font-semibold text-xs">
                    {session.user.name?.[0] ?? "?"}
                  </div>
                )}
                <span className="text-slate-200 text-xs font-medium max-w-[120px] truncate">
                  {session.user.name}
                </span>
                <button
                  onClick={() => signOut({ callbackUrl: "/" })}
                  className="w-7 h-7 rounded-md border border-slate-600 text-slate-400 hover:text-red-400 hover:bg-slate-700 flex items-center justify-center transition-colors"
                  title="Sign out"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="lg:hidden w-9 h-9 rounded-md border border-slate-600 text-slate-300 hover:text-white flex items-center justify-center"
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="lg:hidden bg-slate-800 border-t border-slate-700 px-4 py-3 space-y-1">
          {!isTeacher && (
            <>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-1.5 bg-slate-700/60 px-2.5 py-1 rounded-md border border-slate-600">
                  <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                  <span className="text-white font-semibold text-xs tabular-nums">{points.toLocaleString()} pts</span>
                </div>
                <button
                  onClick={toggleTheme}
                  className="w-8 h-8 rounded-md border border-slate-600 text-slate-300 hover:text-white flex items-center justify-center"
                  aria-label="Toggle theme"
                >
                  {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                </button>
              </div>

              <Link
                href="/dashboard"
                onClick={() => setMobileOpen(false)}
                className="flex items-center gap-2 px-3 py-2 rounded-md text-slate-200 hover:text-white hover:bg-slate-700"
              >
                <LayoutDashboard className="w-4 h-4" />
                Dashboard
              </Link>
              {dayLinks.map((d) => {
                const Icon = d.icon;
                const isActive = currentDay === d.day;
                return (
                  <Link
                    key={d.day}
                    href={`/day/${d.day}`}
                    onClick={() => setMobileOpen(false)}
                    className={`flex items-center gap-2 px-3 py-2 rounded-md ${
                      isActive
                        ? "bg-blue-500/10 text-blue-300 border border-blue-500/30"
                        : "text-slate-200 hover:text-white hover:bg-slate-700"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    Day {d.day} · {d.name}
                  </Link>
                );
              })}
            </>
          )}

          {isTeacher && (
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2 px-3 py-1 rounded-md bg-indigo-500/10 border border-indigo-500/30">
                <GraduationCap className="w-3.5 h-3.5 text-indigo-300" />
                <span className="text-indigo-300 text-xs font-semibold uppercase tracking-wider">Teacher Console</span>
              </div>
              <button
                onClick={toggleTheme}
                className="w-8 h-8 rounded-md border border-slate-600 text-slate-300 hover:text-white flex items-center justify-center"
                aria-label="Toggle theme"
              >
                {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              </button>
            </div>
          )}

          {session?.user && (
            <div className="border-t border-slate-700 mt-2 pt-2">
              <div className="flex items-center gap-2 px-3 py-2">
                {session.user.image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={session.user.image} alt="" className="w-7 h-7 rounded-full border border-slate-600" />
                ) : (
                  <div className="w-7 h-7 rounded-full bg-blue-600 flex items-center justify-center text-white font-semibold text-xs">
                    {session.user.name?.[0] ?? "?"}
                  </div>
                )}
                <span className="text-slate-200 text-xs font-medium flex-1 truncate">{session.user.name}</span>
              </div>
              <button
                onClick={() => signOut({ callbackUrl: "/" })}
                className="flex items-center gap-2 px-3 py-2 rounded-md text-slate-300 hover:text-red-400 hover:bg-slate-700 w-full"
              >
                <LogOut className="w-4 h-4" />
                Sign Out
              </button>
            </div>
          )}
        </div>
      )}
    </nav>
  );
}

function NavLink({
  href, icon, label, sublabel, active,
}: {
  href: string;
  icon: React.ReactNode;
  label: string;
  sublabel?: string;
  active: boolean;
}) {
  return (
    <Link
      href={href}
      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
        active
          ? "bg-blue-500/10 text-blue-300 border border-blue-500/30"
          : "text-slate-300 hover:text-white hover:bg-slate-700/60 border border-transparent"
      }`}
    >
      {icon}
      <span>{label}</span>
      {sublabel && <span className="text-slate-500 hidden xl:inline">· {sublabel}</span>}
    </Link>
  );
}
