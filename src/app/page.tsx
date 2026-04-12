"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import {
  Server, Cpu, HardDrive, Network, Building2, BarChart3,
  ArrowRight, Play, Layers, Shield, BookOpen, Users, Activity,
} from "lucide-react";
import { useTheme } from "@/components/ThemeProvider";

const curriculum = [
  { day: 1, title: "Motherboard Fundamentals", icon: Cpu, desc: "Component-level design — CPU, memory, storage, power" },
  { day: 2, title: "Server Assembly", icon: Server, desc: "Form factors, redundancy, and 24/7 reliability engineering" },
  { day: 3, title: "Rack Integration", icon: HardDrive, desc: "42U rack density, power distribution, and cooling math" },
  { day: 4, title: "Row Infrastructure", icon: Building2, desc: "Network topology, SLA tiers, and redundancy design" },
  { day: 5, title: "Capstone Pitch", icon: BarChart3, desc: "Full data center business case with TCO & ROI analysis" },
];

export default function HomePage() {
  const { data: session } = useSession();
  const router = useRouter();
  useTheme(); // subscribe to force re-render on theme change

  const goToApp = () => {
    if (!session) {
      router.push("/login");
      return;
    }
    const role = (session.user as { role?: string } | undefined)?.role;
    if (role === "teacher" || role === "superadmin") router.push("/teacher");
    else router.push("/dashboard");
  };

  return (
    <div className="min-h-screen app-surface">
      {/* ─── Top navigation bar ─────────────────────────────────────── */}
      <header className="app-card border-b border-b-[var(--border-subtle)] sticky top-0 z-30 backdrop-blur-sm bg-opacity-95">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-md flex items-center justify-center app-accent-bg">
              <Server className="w-4 h-4 text-white" />
            </div>
            <span className="app-text-strong font-semibold text-base tracking-tight">DC Bootcamp</span>
            <span className="text-xs app-text-muted border-l border-l-[var(--border-subtle)] pl-2.5 ml-1 hidden sm:inline">MathCodeLab Program</span>
          </div>
          <nav className="flex items-center gap-2">
            <ThemeToggleButton />
            {session ? (
              <button onClick={goToApp} className="app-btn-primary">
                Open Console <ArrowRight className="w-3.5 h-3.5 inline ml-1" />
              </button>
            ) : (
              <Link href="/login" className="app-btn-primary">Sign In</Link>
            )}
          </nav>
        </div>
      </header>

      {/* ─── Hero ───────────────────────────────────────────────────── */}
      <section className="max-w-6xl mx-auto px-6 pt-20 pb-16">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 app-accent-soft app-accent-text text-xs font-semibold uppercase tracking-wider px-3 py-1 rounded-full border app-accent-border mb-6">
            <Activity className="w-3.5 h-3.5" /> 5-Day Curriculum · Grades 4-10
          </div>
          <h1 className="text-4xl md:text-6xl font-bold app-text-strong tracking-tight mb-5 leading-[1.1]">
            Learn how the internet is <span className="app-accent-text">actually built.</span>
          </h1>
          <p className="text-lg md:text-xl app-text max-w-2xl mb-4 leading-relaxed">
            A rigorous, hands-on data center engineering program for middle school students. Go from individual components to a full, profitable data center in five days.
          </p>
          <p className="text-sm app-text-muted max-w-2xl mb-10">
            Taught with real hardware specifications, industry-standard terminology, and the same TCO and ROI calculations engineers use at AWS, Azure, and Google Cloud.
          </p>

          {/* Primary actions */}
          <div className="flex flex-wrap gap-3">
            {session ? (
              <button onClick={goToApp} className="app-btn-primary inline-flex items-center gap-2 text-base py-3 px-6">
                Open My Console <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <Link href="/login" className="app-btn-primary inline-flex items-center gap-2 text-base py-3 px-6">
                Sign In <ArrowRight className="w-4 h-4" />
              </Link>
            )}
            <Link href="/demo" className="app-btn-ghost inline-flex items-center gap-2 text-base py-3 px-6">
              <Play className="w-4 h-4" /> Try Standard Demo
            </Link>
            <Link href="/demo-advanced" className="app-btn-ghost inline-flex items-center gap-2 text-base py-3 px-6">
              <Layers className="w-4 h-4" /> Try Advanced Demo
            </Link>
          </div>
        </div>
      </section>

      {/* ─── Demo comparison cards ──────────────────────────────────── */}
      <section className="max-w-6xl mx-auto px-6 pb-20">
        <div className="grid md:grid-cols-2 gap-4">
          <div className="app-card rounded-lg p-6 card-hover">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-9 h-9 rounded-md app-accent-soft flex items-center justify-center">
                <Play className="w-4 h-4 app-accent-text" />
              </div>
              <div>
                <div className="app-text-strong font-semibold text-base">Standard Demo</div>
                <div className="app-text-subtle text-xs uppercase tracking-wider">For students, grades 4-10</div>
              </div>
            </div>
            <p className="app-text text-sm mb-4">
              Interactive motherboard builder with hardware selection, workload matching, boot sequence validation, and profitability scoring.
            </p>
            <ul className="space-y-1.5 mb-5 text-sm app-text-muted">
              <li className="flex items-start gap-2"><span className="app-accent-text mt-0.5">›</span> 5 workload challenges with escalating difficulty</li>
              <li className="flex items-start gap-2"><span className="app-accent-text mt-0.5">›</span> Live budget and power calculations</li>
              <li className="flex items-start gap-2"><span className="app-accent-text mt-0.5">›</span> Optimal build comparison with reasoning</li>
            </ul>
            <Link href="/demo" className="app-btn-primary inline-flex items-center gap-2 text-sm">
              Launch Standard Demo <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="app-card rounded-lg p-6 card-hover">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-9 h-9 rounded-md app-accent-soft flex items-center justify-center">
                <Layers className="w-4 h-4 app-accent-text" />
              </div>
              <div>
                <div className="app-text-strong font-semibold text-base">Advanced Demo</div>
                <div className="app-text-subtle text-xs uppercase tracking-wider">For advanced learners, grade 7+</div>
              </div>
            </div>
            <p className="app-text text-sm mb-4">
              TCO-driven decision making with failure rates, support contract tiers, and 3-year operating expense modeling.
            </p>
            <ul className="space-y-1.5 mb-5 text-sm app-text-muted">
              <li className="flex items-start gap-2"><span className="app-accent-text mt-0.5">›</span> 3-year TCO with hardware, power, failures, support, downtime</li>
              <li className="flex items-start gap-2"><span className="app-accent-text mt-0.5">›</span> MTBF and AFR for every component</li>
              <li className="flex items-start gap-2"><span className="app-accent-text mt-0.5">›</span> Support tier selection matched to workload criticality</li>
            </ul>
            <Link href="/demo-advanced" className="app-btn-primary inline-flex items-center gap-2 text-sm">
              Launch Advanced Demo <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </section>

      {/* ─── What you'll learn ──────────────────────────────────────── */}
      <section className="max-w-6xl mx-auto px-6 pb-16">
        <div className="mb-8">
          <div className="text-xs font-semibold uppercase tracking-wider app-accent-text mb-2">Program outcomes</div>
          <h2 className="text-2xl md:text-3xl font-bold app-text-strong tracking-tight">Three pillars of modern infrastructure</h2>
        </div>
        <div className="grid md:grid-cols-3 gap-4">
          <Pillar
            icon={<Cpu className="w-5 h-5 app-accent-text" />}
            title="Hardware Literacy"
            desc="Understand every major component in a modern server: CPUs, memory, storage, GPUs, networking, and power systems."
          />
          <Pillar
            icon={<Network className="w-5 h-5 app-accent-text" />}
            title="Infrastructure Design"
            desc="Design complete data center rows with cooling, redundancy, power distribution, and network topology."
          />
          <Pillar
            icon={<BarChart3 className="w-5 h-5 app-accent-text" />}
            title="Business Economics"
            desc="Calculate TCO, ROI, payback period, and profit margins — the same math real engineers use."
          />
        </div>
      </section>

      {/* ─── 5-day curriculum ──────────────────────────────────────── */}
      <section className="max-w-6xl mx-auto px-6 pb-20">
        <div className="mb-8">
          <div className="text-xs font-semibold uppercase tracking-wider app-accent-text mb-2">Curriculum</div>
          <h2 className="text-2xl md:text-3xl font-bold app-text-strong tracking-tight">Five days, five levels of scale</h2>
        </div>
        <div className="app-card rounded-lg overflow-hidden">
          {curriculum.map((d, i) => (
            <div
              key={d.day}
              className={`flex items-center gap-4 p-5 ${i < curriculum.length - 1 ? "border-b border-b-[var(--border-subtle)]" : ""}`}
            >
              <div className="text-xs font-mono app-text-subtle w-12 tabular-nums">Day {d.day}</div>
              <div className="w-9 h-9 rounded-md app-accent-soft flex items-center justify-center shrink-0">
                <d.icon className="w-4 h-4 app-accent-text" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="app-text-strong font-semibold text-sm">{d.title}</div>
                <div className="app-text-muted text-xs">{d.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ─── Roles ────────────────────────────────────────────────── */}
      <section className="max-w-6xl mx-auto px-6 pb-20">
        <div className="mb-8">
          <div className="text-xs font-semibold uppercase tracking-wider app-accent-text mb-2">Who it's for</div>
          <h2 className="text-2xl md:text-3xl font-bold app-text-strong tracking-tight">Built for students and their teachers</h2>
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="app-card rounded-lg p-6">
            <div className="flex items-center gap-2.5 mb-3">
              <BookOpen className="w-5 h-5 app-accent-text" />
              <div className="app-text-strong font-semibold">For Students</div>
            </div>
            <p className="app-text text-sm mb-3">
              Interactive learning tracks across all 5 days. Build progress, earn badges, see your ranking, and master Vedic math shortcuts along the way.
            </p>
            <Link href="/login" className="app-accent-text text-sm font-semibold inline-flex items-center gap-1">
              Sign in as a student <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          <div className="app-card rounded-lg p-6">
            <div className="flex items-center gap-2.5 mb-3">
              <Users className="w-5 h-5 app-accent-text" />
              <div className="app-text-strong font-semibold">For Teachers</div>
            </div>
            <p className="app-text text-sm mb-3">
              When you sign in with a teacher account, you land directly in your Command Center — lesson plans, timers, presentation mode, student progress, and optional advanced curriculum.
            </p>
            <Link href="/login" className="app-accent-text text-sm font-semibold inline-flex items-center gap-1">
              Sign in as a teacher <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </section>

      {/* ─── Footer ───────────────────────────────────────────────── */}
      <footer className="border-t border-t-[var(--border-subtle)] py-6">
        <div className="max-w-6xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="app-text-subtle text-xs">
            A MathCodeLab Production · Data Center Bootcamp © 2026
          </div>
          <div className="flex items-center gap-4 text-xs app-text-subtle">
            <Link href="/demo" className="hover:app-text-strong">Standard Demo</Link>
            <Link href="/demo-advanced" className="hover:app-text-strong">Advanced Demo</Link>
            <Link href="/login" className="hover:app-text-strong">Sign In</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

function Pillar({ icon, title, desc }: { icon: React.ReactNode; title: string; desc: string }) {
  return (
    <div className="app-card rounded-lg p-5">
      <div className="w-9 h-9 rounded-md app-accent-soft flex items-center justify-center mb-3">
        {icon}
      </div>
      <div className="app-text-strong font-semibold text-sm mb-1">{title}</div>
      <div className="app-text-muted text-xs leading-relaxed">{desc}</div>
    </div>
  );
}

function ThemeToggleButton() {
  const { theme, toggleTheme } = useTheme();
  return (
    <button
      onClick={toggleTheme}
      className="app-btn-ghost !py-2 !px-2.5 inline-flex items-center gap-1.5"
      aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
      title={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
    >
      {theme === "dark" ? <Sun /> : <Moon />}
    </button>
  );
}

function Sun() {
  return (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/>
    </svg>
  );
}

function Moon() {
  return (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/>
    </svg>
  );
}
