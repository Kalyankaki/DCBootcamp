"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import { cpus, rams, storages, gpus, networkCards, powerSupplies } from "@/lib/data/components";
import { quizQuestions } from "@/lib/data/challenges";
import { workloads } from "@/lib/data/workloads";
import type { CPUSpec, RAMSpec, StorageSpec, GPUSpec, NetworkCard, PowerSupply } from "@/lib/types";
import {
  Cpu, BookOpen, Gamepad2, Trophy, Star, Check, X,
  ChevronDown, ChevronUp, Lock, Sparkles, Globe, Cloud,
  Calculator, Timer, Zap,
} from "lucide-react";
import Link from "next/link";
import { AchievementToast, type Achievement } from "@/components/AchievementToast";
import { quickMultiply, percentageOf, digitSumVerify } from "@/lib/vedic-math";

// ─── Component Learning Data ───
const componentInfo = [
  { emoji: "🧠", name: "CPU", analogy: "The Brain", desc: "The CPU (Central Processing Unit) is the brain of the computer. It processes all instructions and calculations. More cores = more tasks at once! Clock speed (GHz) = how fast it thinks.", specs: ["Cores", "Clock Speed (GHz)", "TDP (Watts)", "Best For"] },
  { emoji: "📋", name: "RAM", analogy: "The Desk", desc: "RAM (Random Access Memory) is like your desk space. More RAM = bigger desk = more things open at once! It's super fast but forgets everything when power goes off.", specs: ["Capacity (GB)", "Type (DDR4/DDR5)", "Speed (MHz)"] },
  { emoji: "🗄️", name: "Storage", analogy: "The Filing Cabinet", desc: "Storage is where all your files live permanently. HDDs are cheap but slow (spinning disks!). SSDs are fast (no moving parts). NVMe SSDs are the fastest of all!", specs: ["Type (HDD/SSD/NVMe)", "Capacity (TB)", "Read/Write Speed"] },
  { emoji: "🎨", name: "GPU", analogy: "The Art Studio", desc: "The GPU (Graphics Processing Unit) is amazing at doing many simple calculations at once. Perfect for AI training, video rendering, and gaming. Not every server needs one!", specs: ["VRAM (GB)", "TDP (Watts)", "Best For"] },
  { emoji: "🛣️", name: "Network Card", analogy: "The Highway", desc: "The Network Interface Card connects your server to the internet and other servers. Speed is measured in Gbps (gigabits per second). More speed = more data flowing!", specs: ["Speed (Gbps)", "Ports"] },
  { emoji: "❤️", name: "Power Supply", analogy: "The Heart", desc: "The PSU (Power Supply Unit) converts wall power into the exact voltages your components need. Efficiency ratings (80+ Bronze/Gold/Platinum) tell you how little energy is wasted as heat.", specs: ["Wattage", "Efficiency Rating"] },
];

// ─── Workload Education Data (with AWS/Azure mappings) ───
const workloadEducation = [
  {
    id: "web", icon: "🌐", name: "Web Hosting", color: "from-emerald-800/40 to-emerald-900/20", borderColor: "border-emerald-500/30",
    description: "When you type a website address, a server sends you the page. Every website — from your school's homepage to Amazon — lives on a server somewhere!",
    realWorld: "When 1,000 kids all visit the school website to check snow day announcements at the same time, the web server needs to handle all of them without crashing!",
    whyNeeds: {
      cpu: { val: 4, max: 64, why: "Like a cashier — you need enough to handle multiple customers, but web pages are simple to serve" },
      ram: { val: 16, max: 128, why: "Each visitor's page is held in memory while they browse — more visitors = more RAM" },
      storage: { val: 1, max: 8, why: "Website files, images, and code don't take much space" },
      gpu: { needed: false, why: "Web pages are text and images — no heavy graphics processing needed" },
      network: { val: 10, max: 100, why: "Sending web pages to thousands of people needs a fast highway" },
    },
    revenue: 2000,
    aws: { sku: "t3.xlarge", cost: "$0.17/hr (~$120/mo)", note: "The 't' stands for 'burstable' — it speeds up when traffic spikes!" },
    azure: { sku: "B4ms", cost: "$0.17/hr (~$120/mo)", note: "The 'B' series is for bursty workloads like websites that get traffic waves." },
  },
  {
    id: "game", icon: "🎮", name: "Game Servers", color: "from-purple-800/40 to-purple-900/20", borderColor: "border-purple-500/30",
    description: "Multiplayer games like Fortnite, Minecraft, and Roblox all run on servers. The server tracks every player's position, health, inventory, and actions — hundreds of times per second!",
    realWorld: "Imagine 100 kids playing Minecraft on the same world. The server has to calculate every block placed, every creeper explosion, every arrow shot — all in real-time with zero lag!",
    whyNeeds: {
      cpu: { val: 8, max: 64, why: "Game physics and player calculations need fast single-thread performance. Each game 'tick' must finish in milliseconds" },
      ram: { val: 32, max: 128, why: "Every player's state, the entire map, and all entities live in memory. More players = more RAM" },
      storage: { val: 2, max: 8, why: "World saves, player data, and game assets" },
      gpu: { needed: true, vram: 8, why: "Some games do server-side rendering or AI pathfinding on GPU" },
      network: { val: 10, max: 100, why: "Low latency is KING. Even 50ms of lag = players complaining about 'lag spikes'" },
    },
    revenue: 5000,
    aws: { sku: "g4dn.xlarge", cost: "$0.53/hr (~$380/mo)", note: "The 'g' means GPU-powered. Designed for game streaming!" },
    azure: { sku: "NCas_T4_v3", cost: "$0.53/hr (~$380/mo)", note: "Uses NVIDIA T4 GPUs built for gaming and graphics." },
  },
  {
    id: "video", icon: "🎬", name: "Video Streaming", color: "from-red-800/40 to-red-900/20", borderColor: "border-red-500/30",
    description: "Netflix, YouTube, and TikTok serve BILLIONS of hours of video every day. The server stores videos, converts them to different qualities (4K, 1080p, 720p), and streams them to your device.",
    realWorld: "When a new Marvel movie drops on Disney+, millions of people hit play at the same time. The servers must encode the video into 20+ different formats and deliver them to phones, tablets, TVs, and laptops — all without buffering!",
    whyNeeds: {
      cpu: { val: 16, max: 64, why: "Encoding video from one format to another is CPU-intensive work" },
      ram: { val: 64, max: 128, why: "Buffering video chunks in memory for fast delivery" },
      storage: { val: 8, max: 8, why: "A single 4K movie is 100 GB. Libraries have thousands of titles!" },
      gpu: { needed: true, vram: 6, why: "Hardware video encoding is MUCH faster than CPU encoding" },
      network: { val: 100, max: 100, why: "This is the big one! Streaming video to millions = massive bandwidth" },
    },
    revenue: 8000,
    aws: { sku: "c6i.4xlarge", cost: "$0.68/hr (~$490/mo)", note: "Compute-optimized. Plus S3 storage at $0.023/GB/mo. AWS CloudFront CDN caches videos closer to viewers." },
    azure: { sku: "Fsv2 series", cost: "$0.68/hr (~$490/mo)", note: "Optimized for high CPU throughput. Azure Media Services handles encoding automatically." },
  },
  {
    id: "db", icon: "🗄️", name: "Database", color: "from-blue-800/40 to-blue-900/20", borderColor: "border-blue-500/30",
    description: "Every app has a database behind it. When you log into Instagram, it checks your username and password in a database. When you post a photo, it saves the metadata. EVERYTHING is data.",
    realWorld: "A bank's database handles millions of transactions per second. If someone sends you $20 on Venmo, the database must INSTANTLY deduct from their account and add to yours — and never, ever make a mistake!",
    whyNeeds: {
      cpu: { val: 16, max: 64, why: "Sorting, searching, joining, and filtering millions of records requires serious compute" },
      ram: { val: 64, max: 128, why: "THE most important thing! Databases cache frequently-used data in RAM because it's 1000x faster than disk" },
      storage: { val: 4, max: 8, why: "All the actual data lives here. NVMe SSDs are preferred for speed" },
      gpu: { needed: false, why: "Database queries are sequential logic, not parallel math — no GPU needed" },
      network: { val: 10, max: 100, why: "Applications constantly read/write to the database" },
    },
    revenue: 6000,
    aws: { sku: "r6i.2xlarge", cost: "$0.50/hr (~$365/mo)", note: "The 'r' = memory-optimized. Or use RDS for managed databases — AWS handles backups and scaling!" },
    azure: { sku: "E4as_v5", cost: "$0.50/hr (~$365/mo)", note: "The 'E' series = memory-optimized. Azure SQL Database is the managed option." },
  },
  {
    id: "ai", icon: "🧠", name: "AI Training", color: "from-amber-800/40 to-amber-900/20", borderColor: "border-amber-500/30",
    description: "This is how ChatGPT, image generators, and self-driving cars learn! AI training feeds millions of examples through a neural network, adjusting millions of parameters until the AI gets smart.",
    realWorld: "Teaching an AI to recognize cats in photos means showing it 10 MILLION cat pictures. Each picture runs through billions of calculations. This can take WEEKS on a single computer — or hours on a GPU cluster!",
    whyNeeds: {
      cpu: { val: 32, max: 64, why: "Prepares data, manages training pipeline, handles I/O. Think of it as the project manager" },
      ram: { val: 128, max: 128, why: "Loading huge datasets into memory — ImageNet alone is 150 GB!" },
      storage: { val: 4, max: 8, why: "Training datasets, model checkpoints, logs" },
      gpu: { needed: true, vram: 40, why: "THE most important component! GPUs do matrix math 100x faster than CPUs. More VRAM = bigger models" },
      network: { val: 25, max: 100, why: "When training across multiple servers, they need to share gradient updates FAST" },
    },
    revenue: 15000,
    aws: { sku: "p4d.24xlarge", cost: "$32.77/hr (~$24K/mo)", note: "Has 8 NVIDIA A100 GPUs! This is what companies use to train GPT-class models." },
    azure: { sku: "ND A100 v4", cost: "$27.20/hr (~$20K/mo)", note: "Microsoft uses these internally for Copilot and Bing AI!" },
  },
];

// ─── Build Challenges (mapped to workloads + cloud SKUs) ───
interface DemoChallenge {
  id: string; name: string; scenario: string; difficulty: number; budget: number;
  workloadId: string; // maps to workloads array by id
  cloudEquiv: string;
}

const demoChallenges: DemoChallenge[] = [
  { id: "ch1", name: "School Website Server", difficulty: 1, budget: 2000,
    workloadId: "wl-web",
    scenario: "Bothell Middle School needs a server for their website. 500 students check it daily for homework and announcements. Build a motherboard that can handle it!",
    cloudEquiv: "AWS t3.xlarge (~$120/mo) or Azure B4ms (~$120/mo)" },
  { id: "ch2", name: "Minecraft Server", difficulty: 2, budget: 3000,
    workloadId: "wl-game",
    scenario: "MathCodeLab wants to host a Minecraft server for 50 players. Build a rig that keeps the game running smooth at 20 TPS with zero lag!",
    cloudEquiv: "AWS g4dn.xlarge (~$380/mo) or Azure NCas_T4_v3 (~$380/mo)" },
  { id: "ch3", name: "YouTube for Pets", difficulty: 3, budget: 3500,
    workloadId: "wl-video",
    scenario: "A startup is launching 'PetTube' — a video streaming site just for funny pet videos. They need to serve 1080p video to 10,000 viewers at once!",
    cloudEquiv: "AWS c6i.4xlarge (~$490/mo) or Azure Fsv2 (~$490/mo)" },
  { id: "ch4", name: "Bank Database", difficulty: 4, budget: 4000,
    workloadId: "wl-db",
    scenario: "KidBank, a banking app for kids' allowances, needs a bulletproof database. Handle 50,000 transactions per hour and NEVER lose a penny!",
    cloudEquiv: "AWS r6i.2xlarge (~$365/mo) or Azure E4as_v5 (~$365/mo)" },
  { id: "ch5", name: "Train an AI", difficulty: 5, budget: 40000,
    workloadId: "wl-ai",
    scenario: "A research lab wants to train an AI that identifies diseases in X-ray images. This will save lives — but it needs SERIOUS GPU power!",
    cloudEquiv: "AWS p4d.24xlarge (~$24K/mo) or Azure ND A100 v4 (~$20K/mo)" },
];

// ─── Personality Quiz ───
const WORKLOAD_KEYS = ["video", "game", "ai", "web", "db"] as const;
type WorkloadKey = (typeof WORKLOAD_KEYS)[number];

const personalityQs: { q: string; opts: { label: string; maps: WorkloadKey }[] }[] = [
  { q: "What's your favorite thing to do online?", opts: [
    { label: "Watch videos 🎬", maps: "video" },
    { label: "Play games 🎮", maps: "game" },
    { label: "Learn new stuff 🧠", maps: "ai" },
    { label: "Chat with friends 💬", maps: "web" },
    { label: "Build & create 🔨", maps: "db" },
  ]},
  { q: "Your brain-computer would be best at...", opts: [
    { label: "Running super fast ⚡", maps: "game" },
    { label: "Remembering everything 🗄️", maps: "db" },
    { label: "Drawing amazing art 🎨", maps: "video" },
    { label: "Talking to everyone 📣", maps: "web" },
    { label: "Solving puzzles 🧩", maps: "ai" },
  ]},
  { q: "Your dream project is...", opts: [
    { label: "Viral YouTube channel 📹", maps: "video" },
    { label: "Minecraft mega-world 🌍", maps: "game" },
    { label: "Teach a robot to dance 🤖", maps: "ai" },
    { label: "Lemonade stand empire 🍋", maps: "web" },
    { label: "Secret recipe vault 📚", maps: "db" },
  ]},
  { q: "Pick a superpower:", opts: [
    { label: "Super speed 💨", maps: "game" },
    { label: "Perfect memory 🧠", maps: "db" },
    { label: "X-ray vision 👁️", maps: "ai" },
    { label: "Teleportation 🌀", maps: "web" },
    { label: "Time rewind ⏪", maps: "video" },
  ]},
  { q: "Weekend plans?", opts: [
    { label: "Movie marathon 🎥", maps: "video" },
    { label: "Game tournament 🏆", maps: "game" },
    { label: "Science experiment 🧪", maps: "ai" },
    { label: "Hanging with friends 🎉", maps: "web" },
    { label: "Organizing my stuff 📦", maps: "db" },
  ]},
];

const personalityResults: Record<WorkloadKey, { title: string; desc: string; emoji: string; challengeId: string }> = {
  video: { title: "Video Streamer", emoji: "🎬", desc: "You love content that moves! You'd thrive building servers that push massive amounts of data to millions of screens.", challengeId: "ch3" },
  game: { title: "Game Architect", emoji: "🎮", desc: "You live for action and speed! Low-latency game servers are your jam — every millisecond counts.", challengeId: "ch2" },
  ai: { title: "AI Trainer", emoji: "🧠", desc: "You're a puzzle-solver and pattern-spotter. GPU-packed AI training rigs are your future battlefield.", challengeId: "ch5" },
  web: { title: "Web Hero", emoji: "🌐", desc: "You connect people. Web servers that stay up no matter what traffic hits them — that's you.", challengeId: "ch1" },
  db: { title: "Data Guardian", emoji: "🗄️", desc: "You never forget a detail. Databases are your domain — where every byte is sacred.", challengeId: "ch4" },
};

// ─── Math Dojo Problem Generator ───
interface MathProblem {
  question: string;
  answer: number;
  explanation: string;
  hint: string;
}
function generateMathProblem(): MathProblem {
  const types = ["multiply", "percent", "subtract", "verify"];
  const t = types[Math.floor(Math.random() * types.length)];
  if (t === "multiply") {
    const a = 90 + Math.floor(Math.random() * 19); // 90-108
    const b = 90 + Math.floor(Math.random() * 19);
    const r = quickMultiply(a, b);
    return { question: `What is ${a} × ${b}?`, answer: r.result, explanation: r.explanation,
      hint: "Tip: Both numbers are close to 100. Use Nikhilam!" };
  }
  if (t === "percent") {
    const pcts = [5, 10, 15, 20, 25, 30];
    const p = pcts[Math.floor(Math.random() * pcts.length)];
    const n = (2 + Math.floor(Math.random() * 9)) * 1000; // 2000-10000
    const r = percentageOf(p, n);
    return { question: `What is ${p}% of $${n.toLocaleString()}?`, answer: r.result, explanation: r.explanation,
      hint: "Tip: 10% is just moving the decimal. Build up from there!" };
  }
  if (t === "subtract") {
    const budget = (5 + Math.floor(Math.random() * 6)) * 1000;
    const spent = Math.floor(budget * (0.4 + Math.random() * 0.4));
    return { question: `Budget $${budget.toLocaleString()}, spent $${spent.toLocaleString()}. How much left?`,
      answer: budget - spent,
      explanation: `Vedic subtraction: subtract each digit from 9, last from 10.\n$${budget.toLocaleString()} - $${spent.toLocaleString()} = $${(budget - spent).toLocaleString()}`,
      hint: "Tip: Subtract digits from 9, last digit from 10." };
  }
  // verify
  const a = 20 + Math.floor(Math.random() * 60);
  const b = 20 + Math.floor(Math.random() * 60);
  const correctProduct = a * b;
  const showWrong = Math.random() < 0.5;
  const shown = showWrong ? correctProduct + (Math.random() < 0.5 ? 9 : -9) : correctProduct;
  const r = digitSumVerify(a, b, shown);
  return { question: `Is ${a} × ${b} = ${shown}? (1 = Yes, 0 = No)`, answer: r.result, explanation: r.explanation,
    hint: "Tip: Add the digits. Digit-sum of A × digit-sum of B should match digit-sum of the answer." };
}

function rankFromScore(s: number): { rank: string; emoji: string } {
  if (s >= 900) return { rank: "Grandmaster", emoji: "👑" };
  if (s >= 600) return { rank: "Master", emoji: "🏆" };
  if (s >= 300) return { rank: "Scholar", emoji: "📚" };
  return { rank: "Apprentice", emoji: "🌱" };
}

type TabKey = "learn" | "workloads" | "quiz" | "build" | "dojo";

export default function DemoPage() {
  const [tab, setTab] = useState<TabKey>("learn");
  const [expandedComponent, setExpandedComponent] = useState<number | null>(null);
  const [expandedWorkload, setExpandedWorkload] = useState<number | null>(null);

  // Quiz state
  const [quizIdx, setQuizIdx] = useState(0);
  const [quizAnswers, setQuizAnswers] = useState<(number | null)[]>([]);
  const [quizDone, setQuizDone] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);

  // Build state — local, no store needed
  const [selectedChallenge, setSelectedChallenge] = useState<DemoChallenge>(demoChallenges[0]);
  const [selectedCPU, setSelectedCPU] = useState<CPUSpec | null>(null);
  const [selectedRAM, setSelectedRAM] = useState<RAMSpec[]>([]);
  const [selectedStorage, setSelectedStorage] = useState<StorageSpec[]>([]);
  const [selectedGPU, setSelectedGPU] = useState<GPUSpec | null>(null);
  const [selectedNIC, setSelectedNIC] = useState<NetworkCard | null>(null);
  const [selectedPSU, setSelectedPSU] = useState<PowerSupply | null>(null);
  const [buildSubmitted, setBuildSubmitted] = useState(false);
  const [buildScore, setBuildScore] = useState(0);
  const [buildFeedback, setBuildFeedback] = useState<string[]>([]);

  // Boot sequence state
  const [booting, setBooting] = useState(false);
  const [bootStep, setBootStep] = useState(0);
  const [bootResults, setBootResults] = useState<{ label: string; status: "ok" | "fail" | "skip"; detail: string }[]>([]);
  const [bootComplete, setBootComplete] = useState(false);
  const [bootSuccess, setBootSuccess] = useState(false);

  // Speed Run state
  const [speedRunOn, setSpeedRunOn] = useState(false);
  const [timeLeft, setTimeLeft] = useState(120);
  const [timerRunning, setTimerRunning] = useState(false);
  const [buildStartTime, setBuildStartTime] = useState<number | null>(null);
  const [finalBuildTime, setFinalBuildTime] = useState<number | null>(null);

  // Achievements
  const [achievements, setAchievements] = useState<Achievement[]>([]);

  // Live Math Coach sidebar
  const [mathLog, setMathLog] = useState<string[]>([]);
  const [mathLogOpen, setMathLogOpen] = useState(true);

  // Personality quiz
  const [pqStep, setPqStep] = useState(-1); // -1 = not started
  const [pqAnswers, setPqAnswers] = useState<WorkloadKey[]>([]);
  const [pqResult, setPqResult] = useState<WorkloadKey | null>(null);

  // Math Dojo
  const [dojoStarted, setDojoStarted] = useState(false);
  const [dojoRound, setDojoRound] = useState(0);
  const [dojoProblem, setDojoProblem] = useState<MathProblem | null>(null);
  const [dojoInput, setDojoInput] = useState("");
  const [dojoScore, setDojoScore] = useState(0);
  const [dojoStreak, setDojoStreak] = useState(0);
  const [dojoTimer, setDojoTimer] = useState(30);
  const [dojoFeedback, setDojoFeedback] = useState<{ correct: boolean; explanation: string; answer: number } | null>(null);
  const [dojoStartTime, setDojoStartTime] = useState(0);
  const [dojoDone, setDojoDone] = useState(false);

  const challengeWorkload = useMemo(() => workloads.find(w => w.id === selectedChallenge.workloadId) ?? workloads[0], [selectedChallenge]);
  const questions = quizQuestions[1] || [];

  const BUDGET = selectedChallenge.budget;

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

  const unlockedIds = useMemo(() => new Set(achievements.map((a) => a.id)), [achievements]);
  const unlock = (a: Achievement) => {
    if (unlockedIds.has(a.id)) return;
    setAchievements((prev) => [...prev, a]);
  };

  const componentsPicked = (selectedCPU ? 1 : 0) + selectedRAM.length + selectedStorage.length +
    (selectedGPU ? 1 : 0) + (selectedNIC ? 1 : 0) + (selectedPSU ? 1 : 0);

  // Achievement: first pick + start speed run timer
  useEffect(() => {
    if (componentsPicked === 1) {
      unlock({ id: "first-pick", emoji: "🔧", title: "First Pick!", description: "You placed your first component." });
      if (speedRunOn && !timerRunning && !buildSubmitted) {
        setTimerRunning(true);
        setBuildStartTime(Date.now());
      }
      if (buildStartTime === null) setBuildStartTime(Date.now());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [componentsPicked]);

  // Achievement: budget hawk
  useEffect(() => {
    if (componentsPicked >= 4 && totalCost > 0 && totalCost <= BUDGET * 0.5) {
      unlock({ id: "budget-hawk", emoji: "🦅", title: "Budget Hawk!", description: "Used less than 50% of your budget." });
    }
    if (componentsPicked >= 3 && totalPower > 0 && totalPower < 200) {
      unlock({ id: "power-saver", emoji: "⚡", title: "Power Saver!", description: "Total power under 200W." });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [totalCost, totalPower, componentsPicked]);

  // Speed Run countdown
  useEffect(() => {
    if (!timerRunning || buildSubmitted) return;
    if (timeLeft <= 0) return;
    const id = setTimeout(() => setTimeLeft((t) => t - 1), 1000);
    return () => clearTimeout(id);
  }, [timerRunning, timeLeft, buildSubmitted]);

  // Math Coach: log adds when components change
  const prevPicked = useRef(0);
  useEffect(() => {
    if (componentsPicked === 0) {
      prevPicked.current = 0;
      setMathLog([]);
      return;
    }
    if (componentsPicked === prevPicked.current) return;
    const msg = `Total: $${totalCost.toLocaleString()} · Power: ${totalPower}W · Left: $${Math.max(0, budgetLeft).toLocaleString()}`;
    setMathLog((prev) => [msg, ...prev].slice(0, 8));
    prevPicked.current = componentsPicked;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [componentsPicked, totalCost, totalPower]);

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
    setBuildScore(0);
    setBuildFeedback([]);
    setBooting(false);
    setBootResults([]);
    setBootStep(0);
    setBootComplete(false);
    setMathLog([]);
    setTimerRunning(false);
    setTimeLeft(120);
    setBuildStartTime(null);
    setFinalBuildTime(null);
  };

  const switchChallenge = (ch: DemoChallenge) => {
    setSelectedChallenge(ch);
    resetBuild();
  };

  const runBootSequence = (onDone: (success: boolean) => void) => {
    const totalRAM = selectedRAM.reduce((s, r) => s + r.capacity, 0);
    const totalStor = selectedStorage.reduce((s, d) => s + d.capacity, 0);
    const steps: { label: string; status: "ok" | "fail" | "skip"; detail: string }[] = [
      selectedCPU
        ? { label: "Checking CPU", status: "ok", detail: `${selectedCPU.cores} cores, ${selectedCPU.clockSpeed}GHz` }
        : { label: "Checking CPU", status: "fail", detail: "No CPU found!" },
      selectedRAM.length > 0
        ? { label: "Loading RAM", status: "ok", detail: `${totalRAM}GB loaded` }
        : { label: "Loading RAM", status: "fail", detail: "No RAM installed" },
      selectedStorage.length > 0
        ? { label: "Mounting Storage", status: "ok", detail: `${totalStor}TB ready` }
        : { label: "Mounting Storage", status: "fail", detail: "No storage!" },
      selectedGPU
        ? { label: "GPU Scan", status: "ok", detail: `${selectedGPU.name} (${selectedGPU.vram}GB VRAM)` }
        : challengeWorkload.requiredGPU
          ? { label: "GPU Scan", status: "fail", detail: "Workload requires GPU!" }
          : { label: "GPU Scan", status: "skip", detail: "Not installed" },
      selectedNIC
        ? { label: "Network Interface", status: "ok", detail: `${selectedNIC.speed} Gbps ready` }
        : { label: "Network Interface", status: "fail", detail: "No NIC" },
      selectedPSU
        ? selectedPSU.wattage >= totalPower
          ? { label: "Power Supply Test", status: "ok", detail: `${selectedPSU.wattage}W OK` }
          : { label: "Power Supply Test", status: "fail", detail: "OVERLOAD!" }
        : { label: "Power Supply Test", status: "fail", detail: "No PSU" },
    ];

    setBootResults([]);
    setBootStep(0);
    setBootComplete(false);
    setBooting(true);

    let i = 0;
    const tick = () => {
      if (i >= steps.length) {
        const success = !steps.some((s) => s.status === "fail");
        setBootComplete(true);
        setBootSuccess(success);
        setTimeout(() => onDone(success), 1200);
        return;
      }
      setBootResults((prev) => [...prev, steps[i]]);
      setBootStep(i + 1);
      i++;
      setTimeout(tick, 500);
    };
    tick();
  };

  const submitBuild = () => {
    setTimerRunning(false);
    const elapsed = buildStartTime ? Math.floor((Date.now() - buildStartTime) / 1000) : null;
    setFinalBuildTime(elapsed);

    runBootSequence((bootOk) => {
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
      const meetsReqs = cpuCores >= challengeWorkload.requiredCPUCores && totalRAM >= challengeWorkload.requiredRAM && totalStor >= challengeWorkload.requiredStorage;
      if (meetsReqs) {
        score += 15;
        feedback.push(`Build meets ${challengeWorkload.name} requirements!`);
      } else {
        feedback.push(`Build doesn't fully meet ${challengeWorkload.name} needs.`);
      }

      // Speed run bonus
      if (speedRunOn && elapsed !== null && bootOk) {
        if (elapsed < 60) { score = Math.round(score * 2); feedback.push(`Speed Run x2! Built in ${elapsed}s.`); }
        else if (elapsed < 90) { score = Math.round(score * 1.5); feedback.push(`Speed Run x1.5! Built in ${elapsed}s.`); }
      }

      // Achievements on submit
      if (elapsed !== null && elapsed < 60 && bootOk) {
        unlock({ id: "speed-build", emoji: "🏎️", title: "Speed Build!", description: "Finished in under 60 seconds!" });
      }
      if (score >= 80) {
        unlock({ id: "champion", emoji: "🌟", title: "Challenge Champion!", description: "Scored 80+ on a build!" });
      }
      if (meetsReqs && cpuCores >= challengeWorkload.requiredCPUCores * 2 && totalRAM >= challengeWorkload.requiredRAM * 2) {
        unlock({ id: "overkill", emoji: "💪", title: "Overkill!", description: "Doubled the required specs." });
      }
      if (meetsReqs && cpuCores < challengeWorkload.requiredCPUCores * 1.5 && totalRAM < challengeWorkload.requiredRAM * 1.5) {
        unlock({ id: "perfect-match", emoji: "🎯", title: "Perfect Match!", description: "Specs dialed in just right." });
      }

      setBuildScore(score);
      setBuildFeedback(feedback);
      setBuildSubmitted(true);
      setBooting(false);
    });
  };

  return (
    <div className="min-h-screen bg-slate-900">
      <AchievementToast achievements={achievements} />
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
        <div className="max-w-6xl mx-auto px-4 flex gap-1 overflow-x-auto">
          {([["learn", BookOpen, "Learn"], ["workloads", Globe, "Workloads"], ["quiz", Star, "Quiz"], ["build", Gamepad2, "Build"], ["dojo", Calculator, "Math Dojo"]] as const).map(([key, Icon, label]) => (
            <button key={key} onClick={() => setTab(key)} className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${tab === key ? "border-emerald-500 text-emerald-400" : "border-transparent text-slate-400 hover:text-white"}`}>
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

            {/* How It All Connects */}
            <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
              <h3 className="text-lg font-bold text-white mb-4">How It All Connects 🔗</h3>
              <div className="grid grid-cols-6 gap-2 text-center text-xs">
                <div className="col-span-2 bg-blue-900/50 border border-blue-500/30 rounded-lg p-3">
                  <div className="text-2xl mb-1">🧠</div><span className="text-blue-400 font-bold">CPU</span>
                  <div className="text-slate-500 mt-1">Processes everything</div>
                </div>
                <div className="col-span-2 bg-purple-900/50 border border-purple-500/30 rounded-lg p-3">
                  <div className="text-2xl mb-1">🎨</div><span className="text-purple-400 font-bold">GPU</span>
                  <div className="text-slate-500 mt-1">Parallel math</div>
                </div>
                <div className="col-span-2 bg-cyan-900/50 border border-cyan-500/30 rounded-lg p-3">
                  <div className="text-2xl mb-1">🛣️</div><span className="text-cyan-400 font-bold">Network</span>
                  <div className="text-slate-500 mt-1">Talks to internet</div>
                </div>
                <div className="col-span-3 bg-emerald-900/50 border border-emerald-500/30 rounded-lg p-3">
                  <div className="text-2xl mb-1">📋📋📋📋</div><span className="text-emerald-400 font-bold">4 RAM Slots</span>
                  <div className="text-slate-500 mt-1">Fast temporary memory</div>
                </div>
                <div className="col-span-3 bg-orange-900/50 border border-orange-500/30 rounded-lg p-3">
                  <div className="text-2xl mb-1">🗄️🗄️🗄️🗄️</div><span className="text-orange-400 font-bold">4 Storage Bays</span>
                  <div className="text-slate-500 mt-1">Permanent data</div>
                </div>
                <div className="col-span-6 bg-red-900/50 border border-red-500/30 rounded-lg p-2">
                  <span className="text-red-400 font-bold">❤️ Power Supply — feeds electricity to ALL components above</span>
                </div>
              </div>
              <p className="text-slate-400 text-xs mt-3 text-center">All these components plug into the motherboard, which connects them with tiny copper traces (like roads in a city!)</p>
            </div>

            <button onClick={() => setTab("workloads")} className="w-full bg-emerald-500 text-white font-bold py-3 rounded-xl hover:bg-emerald-400 transition-colors">
              Next: What Do Data Centers Actually Do? →
            </button>
          </div>
        )}

        {/* WORKLOADS TAB */}
        {tab === "workloads" && (
          <div className="space-y-4 animate-slide-in">
            <div className="bg-gradient-to-r from-blue-900/30 to-purple-900/30 border border-blue-500/20 rounded-xl p-6">
              <h2 className="text-2xl font-bold text-white mb-3">What Do Data Centers Actually DO? 🌍</h2>
              <p className="text-slate-300 mb-2">Every time you watch YouTube, play Fortnite, ask ChatGPT a question, or even send a text — a data center is working behind the scenes.</p>
              <p className="text-slate-300">But different jobs need different hardware. Let&apos;s explore what these &quot;workloads&quot; are and what they need!</p>
            </div>

            {workloadEducation.map((wl, i) => (
              <div key={wl.id} className={`bg-gradient-to-r ${wl.color} border ${wl.borderColor} rounded-xl overflow-hidden card-hover`}>
                <button onClick={() => setExpandedWorkload(expandedWorkload === i ? null : i)} className="w-full flex items-center gap-4 p-4 text-left">
                  <div className="w-14 h-14 rounded-xl bg-slate-700/80 flex items-center justify-center text-3xl flex-shrink-0">{wl.icon}</div>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-white">{wl.name}</h3>
                    <p className="text-sm text-slate-300 line-clamp-1">{wl.description}</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <span className="text-emerald-400 text-sm font-bold">${wl.revenue.toLocaleString()}/mo</span>
                    <div className="text-slate-500 text-xs">revenue</div>
                  </div>
                  {expandedWorkload === i ? <ChevronUp className="w-5 h-5 text-slate-400 flex-shrink-0" /> : <ChevronDown className="w-5 h-5 text-slate-400 flex-shrink-0" />}
                </button>
                {expandedWorkload === i && (
                  <div className="px-4 pb-4 border-t border-slate-700/50 pt-4 animate-slide-in space-y-4">
                    <p className="text-slate-300 text-sm">{wl.description}</p>

                    {/* Real World Example */}
                    <div className="bg-slate-800/50 rounded-lg p-3">
                      <h4 className="text-amber-400 font-bold text-sm mb-1">📖 Real World Example</h4>
                      <p className="text-slate-300 text-sm">{wl.realWorld}</p>
                    </div>

                    {/* Why It Needs What It Needs */}
                    <div>
                      <h4 className="text-white font-bold text-sm mb-3">What it needs — and WHY:</h4>
                      <div className="space-y-3">
                        <ReqBar label="CPU" emoji="🧠" val={wl.whyNeeds.cpu.val} max={wl.whyNeeds.cpu.max} unit="cores" why={wl.whyNeeds.cpu.why} color="bg-blue-500" />
                        <ReqBar label="RAM" emoji="📋" val={wl.whyNeeds.ram.val} max={wl.whyNeeds.ram.max} unit="GB" why={wl.whyNeeds.ram.why} color="bg-emerald-500" />
                        <ReqBar label="Storage" emoji="🗄️" val={wl.whyNeeds.storage.val} max={wl.whyNeeds.storage.max} unit="TB" why={wl.whyNeeds.storage.why} color="bg-orange-500" />
                        <div className="flex items-center gap-3">
                          <span className="text-sm w-20 flex items-center gap-1"><span>🎨</span> GPU</span>
                          <span className={`px-2 py-0.5 rounded text-xs font-bold ${wl.whyNeeds.gpu.needed ? "bg-purple-500/20 text-purple-400" : "bg-slate-700 text-slate-500"}`}>
                            {wl.whyNeeds.gpu.needed ? `YES (${wl.whyNeeds.gpu.vram}GB VRAM)` : "NOT NEEDED"}
                          </span>
                          <span className="text-slate-400 text-xs flex-1">{wl.whyNeeds.gpu.why}</span>
                        </div>
                        <ReqBar label="Network" emoji="🛣️" val={wl.whyNeeds.network.val} max={wl.whyNeeds.network.max} unit="Gbps" why={wl.whyNeeds.network.why} color="bg-cyan-500" />
                      </div>
                    </div>

                    {/* Cloud SKU Mappings */}
                    <div>
                      <h4 className="text-white font-bold text-sm mb-2 flex items-center gap-2"><Cloud className="w-4 h-4" /> In the Real Cloud</h4>
                      <div className="grid sm:grid-cols-2 gap-2">
                        <div className="bg-orange-950/30 border border-orange-500/20 rounded-lg p-3">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-orange-400 font-bold text-sm">AWS</span>
                            <span className="bg-orange-500/20 text-orange-300 text-xs px-2 py-0.5 rounded font-mono">{wl.aws.sku}</span>
                          </div>
                          <p className="text-orange-200/60 text-xs mb-1">{wl.aws.cost}</p>
                          <p className="text-slate-400 text-xs">{wl.aws.note}</p>
                        </div>
                        <div className="bg-blue-950/30 border border-blue-500/20 rounded-lg p-3">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-blue-400 font-bold text-sm">Azure</span>
                            <span className="bg-blue-500/20 text-blue-300 text-xs px-2 py-0.5 rounded font-mono">{wl.azure.sku}</span>
                          </div>
                          <p className="text-blue-200/60 text-xs mb-1">{wl.azure.cost}</p>
                          <p className="text-slate-400 text-xs">{wl.azure.note}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}

            {/* Personality Quiz */}
            <div className="bg-gradient-to-br from-purple-900/40 to-pink-900/30 border border-purple-500/30 rounded-xl p-5">
              <h3 className="text-white font-bold mb-2 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-purple-400" /> Which Workload Are You?
              </h3>
              {pqStep === -1 && pqResult === null && (
                <>
                  <p className="text-slate-300 text-sm mb-4">Take this 5-question quiz to find out what kind of data center engineer you are!</p>
                  <button onClick={() => { setPqStep(0); setPqAnswers([]); setPqResult(null); }}
                    className="bg-purple-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-purple-400">
                    Start the Quiz →
                  </button>
                </>
              )}
              {pqStep >= 0 && pqStep < personalityQs.length && (
                <div>
                  <div className="text-xs text-slate-400 mb-2">Question {pqStep + 1} of {personalityQs.length}</div>
                  <h4 className="text-white font-bold mb-3">{personalityQs[pqStep].q}</h4>
                  <div className="space-y-2">
                    {personalityQs[pqStep].opts.map((opt, i) => (
                      <button key={i}
                        onClick={() => {
                          const newAns = [...pqAnswers, opt.maps];
                          if (pqStep + 1 >= personalityQs.length) {
                            const counts: Record<string, number> = {};
                            for (const a of newAns) counts[a] = (counts[a] ?? 0) + 1;
                            const winner = Object.entries(counts).sort((a, b) => b[1] - a[1])[0][0] as WorkloadKey;
                            setPqResult(winner);
                            setPqStep(-1);
                          } else {
                            setPqAnswers(newAns);
                            setPqStep(pqStep + 1);
                          }
                        }}
                        className="w-full text-left p-3 rounded-lg border border-slate-600 hover:border-purple-500 hover:bg-purple-500/10 transition-colors text-white">
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}
              {pqResult && (
                <div className="animate-slide-in text-center">
                  <div className="text-6xl mb-2">{personalityResults[pqResult].emoji}</div>
                  <h4 className="text-2xl font-bold text-purple-300 mb-2">You are a {personalityResults[pqResult].title}!</h4>
                  <p className="text-slate-300 text-sm mb-4">{personalityResults[pqResult].desc}</p>
                  <div className="flex gap-2 justify-center">
                    <button onClick={() => { setPqResult(null); setPqStep(-1); setPqAnswers([]); }}
                      className="bg-slate-700 text-white py-2 px-4 rounded-lg hover:bg-slate-600 text-sm">
                      Retake Quiz
                    </button>
                    <button onClick={() => {
                        const challengeId = personalityResults[pqResult].challengeId;
                        const ch = demoChallenges.find(c => c.id === challengeId);
                        if (ch) { switchChallenge(ch); setTab("build"); }
                      }}
                      className="bg-purple-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-purple-400 text-sm">
                      Build for this workload →
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Cloud Economics Info Box */}
            <div className="bg-gradient-to-r from-slate-800 to-slate-700 border border-slate-600 rounded-xl p-5">
              <h3 className="text-white font-bold mb-2 flex items-center gap-2"><Cloud className="w-5 h-5 text-blue-400" /> Cloud Economics 101</h3>
              <p className="text-slate-300 text-sm mb-2">Companies like AWS and Azure don&apos;t buy one server at a time. They buy <strong className="text-white">THOUSANDS</strong> of servers and get huge discounts — then rent them to you by the hour. This is called <strong className="text-emerald-400">&quot;cloud computing.&quot;</strong></p>
              <p className="text-slate-400 text-sm">The hardware in our Build challenges costs more upfront, but cloud pricing includes electricity, cooling, maintenance, and 24/7 support. In the real world, companies decide: &quot;Should we buy our own servers or rent from the cloud?&quot; That&apos;s a key business decision!</p>
            </div>

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
            {/* Speed Run Toggle + Timer */}
            <div className="flex items-center justify-between bg-slate-800 border border-slate-700 rounded-xl p-3 mb-4">
              <button
                onClick={() => { setSpeedRunOn(!speedRunOn); setTimerRunning(false); setTimeLeft(120); }}
                disabled={buildSubmitted}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-bold text-sm transition-colors ${speedRunOn ? "bg-amber-500 text-black" : "bg-slate-700 text-slate-300 hover:bg-slate-600"}`}>
                <Timer className="w-4 h-4" /> Speed Run {speedRunOn ? "ON" : "OFF"}
              </button>
              {speedRunOn && (
                <div className={`flex items-center gap-2 font-mono font-bold text-2xl ${timeLeft > 60 ? "text-emerald-400" : timeLeft > 30 ? "text-amber-400" : "text-red-400"} ${timeLeft <= 10 && timerRunning ? "animate-timer-pulse" : ""}`}>
                  <Timer className="w-6 h-6" />
                  {Math.floor(timeLeft / 60)}:{String(timeLeft % 60).padStart(2, "0")}
                </div>
              )}
              {speedRunOn && !timerRunning && !buildSubmitted && componentsPicked === 0 && (
                <span className="text-slate-400 text-xs">Timer starts on first pick</span>
              )}
            </div>

            {/* Challenge Selector */}
            <div className="bg-slate-800 border border-slate-700 rounded-xl p-4 mb-4">
              <h3 className="text-white font-bold mb-3">Choose Your Challenge</h3>
              <div className="grid sm:grid-cols-5 gap-2">
                {demoChallenges.map((ch) => (
                  <button key={ch.id} onClick={() => switchChallenge(ch)}
                    className={`text-left p-3 rounded-lg border transition-all ${selectedChallenge.id === ch.id ? "border-emerald-500 bg-emerald-500/10 selected-glow" : "border-slate-600 hover:border-slate-500"}`}>
                    <div className="flex gap-0.5 mb-1">
                      {Array.from({ length: 5 }).map((_, s) => (
                        <Star key={s} className={`w-3 h-3 ${s < ch.difficulty ? "text-amber-400 fill-amber-400" : "text-slate-700"}`} />
                      ))}
                    </div>
                    <div className="text-white text-sm font-medium">{ch.name}</div>
                    <div className="text-emerald-400 text-xs">${ch.budget.toLocaleString()}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Challenge Brief */}
            <div className="bg-gradient-to-r from-blue-900/30 to-purple-900/30 border border-blue-500/20 rounded-xl p-4 mb-4">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="text-lg font-bold text-white mb-1">{selectedChallenge.name}: {challengeWorkload.name} {challengeWorkload.icon}</h3>
                  <p className="text-sm text-slate-300 mb-3">{selectedChallenge.scenario}</p>
                  <div className="flex flex-wrap gap-3 text-xs text-slate-400">
                    <span>CPU: {challengeWorkload.requiredCPUCores}+ cores</span>
                    <span>RAM: {challengeWorkload.requiredRAM}+ GB</span>
                    <span>Storage: {challengeWorkload.requiredStorage}+ TB</span>
                    {challengeWorkload.requiredGPU && <span className="text-amber-400">GPU Required ({challengeWorkload.requiredGPUVRAM}+ GB VRAM)</span>}
                    <span>Network: {challengeWorkload.networkBandwidth}+ Gbps</span>
                  </div>
                </div>
                <div className="text-right flex-shrink-0">
                  <div className="text-emerald-400 font-bold">${BUDGET.toLocaleString()}</div>
                  <div className="text-slate-500 text-xs">budget</div>
                </div>
              </div>
              <div className="mt-3 flex gap-2">
                <span className="bg-orange-500/20 text-orange-300 text-xs px-2 py-1 rounded">AWS: {selectedChallenge.cloudEquiv.split(" or ")[0]?.replace("AWS ", "")}</span>
                <span className="bg-blue-500/20 text-blue-300 text-xs px-2 py-1 rounded">Azure: {selectedChallenge.cloudEquiv.split(" or ")[1]?.replace("Azure ", "") ?? ""}</span>
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

            {/* Visual Motherboard Diagram */}
            {!buildSubmitted && !booting && (
              <div className="bg-gradient-to-br from-emerald-950/40 to-slate-900 border-2 border-emerald-700/40 rounded-xl p-4 mb-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-white font-bold flex items-center gap-2">🔧 Your Motherboard</h3>
                  <span className="text-emerald-400 text-xs font-mono">{componentsPicked} / 11 slots filled</span>
                </div>
                <div className="grid grid-cols-6 gap-2">
                  {/* Row 1: GPU (span 3) | NIC (span 2) | empty (1) */}
                  <MoboSlot label="GPU Slot" filled={!!selectedGPU} name={selectedGPU?.name} colSpan={3} height="h-16" onClear={() => setSelectedGPU(null)} color="purple" />
                  <MoboSlot label="NIC" filled={!!selectedNIC} name={selectedNIC?.name} colSpan={2} height="h-16" onClear={() => setSelectedNIC(null)} color="cyan" />
                  <div className="col-span-1 flex items-center justify-center text-slate-700 text-xs">◦◦◦</div>
                  {/* Row 2: CPU (span 3) | RAM x4 (each span 1 but stacked - use simpler layout) */}
                  <MoboSlot label="CPU Socket" filled={!!selectedCPU} name={selectedCPU?.name} colSpan={3} height="h-20" onClear={() => setSelectedCPU(null)} color="blue" big />
                  <MoboSlot label="RAM 1" filled={selectedRAM.length >= 1} name={selectedRAM[0]?.name} colSpan={1} height="h-20" onClear={() => setSelectedRAM((p) => p.filter((_, i) => i !== 0))} color="emerald" vert />
                  <MoboSlot label="RAM 2" filled={selectedRAM.length >= 2} name={selectedRAM[1]?.name} colSpan={1} height="h-20" onClear={() => setSelectedRAM((p) => p.filter((_, i) => i !== 1))} color="emerald" vert />
                  <MoboSlot label="RAM 3" filled={selectedRAM.length >= 3} name={selectedRAM[2]?.name} colSpan={1} height="h-20" onClear={() => setSelectedRAM((p) => p.filter((_, i) => i !== 2))} color="emerald" vert />
                  {/* Row 3: RAM4 | Storage x4 | PSU */}
                  <MoboSlot label="RAM 4" filled={selectedRAM.length >= 4} name={selectedRAM[3]?.name} colSpan={1} height="h-14" onClear={() => setSelectedRAM((p) => p.filter((_, i) => i !== 3))} color="emerald" />
                  <MoboSlot label="Drive 1" filled={selectedStorage.length >= 1} name={selectedStorage[0]?.name} colSpan={1} height="h-14" onClear={() => setSelectedStorage((p) => p.filter((_, i) => i !== 0))} color="orange" />
                  <MoboSlot label="Drive 2" filled={selectedStorage.length >= 2} name={selectedStorage[1]?.name} colSpan={1} height="h-14" onClear={() => setSelectedStorage((p) => p.filter((_, i) => i !== 1))} color="orange" />
                  <MoboSlot label="Drive 3" filled={selectedStorage.length >= 3} name={selectedStorage[2]?.name} colSpan={1} height="h-14" onClear={() => setSelectedStorage((p) => p.filter((_, i) => i !== 2))} color="orange" />
                  <MoboSlot label="Drive 4" filled={selectedStorage.length >= 4} name={selectedStorage[3]?.name} colSpan={1} height="h-14" onClear={() => setSelectedStorage((p) => p.filter((_, i) => i !== 3))} color="orange" />
                  <MoboSlot label="PSU" filled={!!selectedPSU} name={selectedPSU?.name} colSpan={1} height="h-14" onClear={() => setSelectedPSU(null)} color="red" />
                </div>
              </div>
            )}

            {/* Boot Sequence Overlay */}
            {booting && (
              <div className="bg-black border-2 border-emerald-500 rounded-xl p-6 mb-4 font-mono">
                <div className="flex items-center gap-2 mb-4 text-emerald-400">
                  <Zap className="w-5 h-5 animate-pulse" />
                  <span className="font-bold">SERVER BOOT SEQUENCE</span>
                </div>
                <div className="space-y-2 min-h-[200px]">
                  {bootResults.map((r, i) => (
                    <div key={i} className="flex items-center gap-3 text-sm animate-boot-check">
                      <span className={`w-6 ${r.status === "ok" ? "text-emerald-400" : r.status === "fail" ? "text-red-400" : "text-slate-500"}`}>
                        {r.status === "ok" ? "✓" : r.status === "fail" ? "✗" : "○"}
                      </span>
                      <span className="text-slate-300 w-44">{r.label}...</span>
                      <span className={r.status === "ok" ? "text-emerald-400" : r.status === "fail" ? "text-red-400" : "text-slate-500"}>{r.detail}</span>
                    </div>
                  ))}
                  {bootStep < 6 && (
                    <div className="flex items-center gap-3 text-sm text-slate-500">
                      <span className="w-6 animate-pulse">▸</span>
                      <span>Scanning...</span>
                    </div>
                  )}
                </div>
                {bootComplete && (
                  <div className={`mt-4 p-4 rounded-lg text-center text-2xl font-black ${bootSuccess ? "bg-emerald-900/50 text-emerald-300 animate-server-online" : "bg-red-900/50 text-red-300 animate-shake"}`}>
                    {bootSuccess ? "🟢 SERVER ONLINE" : "🔴 BOOT FAILED"}
                  </div>
                )}
              </div>
            )}

            {!buildSubmitted && !booting ? (
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
                      Boot Server 🚀
                    </button>
                    <button onClick={resetBuild} className="w-full mt-2 bg-slate-700 text-slate-300 py-2 rounded-lg text-sm hover:bg-slate-600">
                      Reset Build
                    </button>
                  </div>

                  {/* Live Math Coach */}
                  <div className="bg-amber-950/30 border border-amber-700/40 rounded-xl mt-3 overflow-hidden">
                    <button onClick={() => setMathLogOpen(!mathLogOpen)} className="w-full p-3 flex items-center justify-between text-left">
                      <span className="text-amber-300 font-bold text-sm flex items-center gap-2">
                        <Calculator className="w-4 h-4" /> Math Coach
                      </span>
                      {mathLogOpen ? <ChevronUp className="w-4 h-4 text-amber-400" /> : <ChevronDown className="w-4 h-4 text-amber-400" />}
                    </button>
                    {mathLogOpen && (
                      <div className="px-3 pb-3 space-y-1">
                        {mathLog.length === 0 ? (
                          <p className="text-amber-200/60 text-xs">Pick a component to see live math!</p>
                        ) : (
                          mathLog.map((m, i) => (
                            <p key={i} className={`text-xs font-mono ${i === 0 ? "text-amber-200" : "text-amber-200/50"}`}>
                              {i === 0 ? "▸ " : "  "}{m}
                            </p>
                          ))
                        )}
                        {componentsPicked >= 2 && budgetLeft >= 0 && (
                          <p className="text-amber-300/80 text-xs mt-2 border-t border-amber-700/30 pt-2">
                            💡 Vedic check: ${BUDGET.toLocaleString()} - ${totalCost.toLocaleString()} = ${budgetLeft.toLocaleString()} (subtract each digit from 9, last from 10)
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ) : buildSubmitted && !booting ? (
              /* Results */
              <div className="max-w-lg mx-auto bg-slate-800 border border-slate-700 rounded-xl p-8 text-center animate-fade-in-up">
                <Trophy className="w-16 h-16 text-amber-400 mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-white mb-2">Build Complete!</h2>
                <p className="text-5xl font-black text-emerald-400 mb-2">{buildScore}/100</p>
                {finalBuildTime !== null && speedRunOn && (
                  <p className="text-amber-400 text-sm font-bold mb-4 flex items-center justify-center gap-2">
                    <Timer className="w-4 h-4" /> Built in {finalBuildTime}s
                  </p>
                )}
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

                {/* Cloud Comparison */}
                <div className="bg-slate-700/50 rounded-lg p-4 mb-4 text-left text-sm">
                  <h4 className="text-white font-bold mb-2 flex items-center gap-2"><Cloud className="w-4 h-4 text-blue-400" /> Cloud Cost Comparison</h4>
                  <div className="flex justify-between mb-1">
                    <span className="text-slate-400">Your hardware build</span>
                    <span className="text-white font-bold">${totalCost.toLocaleString()} one-time</span>
                  </div>
                  <div className="flex justify-between mb-1">
                    <span className="text-slate-400">Cloud equivalent</span>
                    <span className="text-blue-400 font-bold">{selectedChallenge.cloudEquiv.split("(")[1]?.split(")")[0] ?? "~varies"}/month</span>
                  </div>
                  {totalCost > 0 && (
                    <p className="text-slate-400 text-xs mt-2">
                      At cloud rates, your ${totalCost.toLocaleString()} build pays for itself in about {Math.ceil(totalCost / (challengeWorkload.revenuePerMonth * 0.3))} months of revenue!
                    </p>
                  )}
                </div>

                {/* CTA to sign up */}
                <div className="bg-gradient-to-r from-emerald-900/50 to-blue-900/50 border border-emerald-500/20 rounded-xl p-4 mb-4">
                  <p className="text-white font-bold mb-1">Liked this challenge?</p>
                  <p className="text-slate-300 text-sm mb-3">Sign in to unlock all 5 days — servers, racks, rows, and the Shark Tank competition!</p>
                  <Link href="/login" className="inline-flex items-center gap-2 bg-emerald-500 text-white font-bold py-2 px-6 rounded-lg hover:bg-emerald-400 text-sm">
                    <Lock className="w-4 h-4" /> Sign In to Continue
                  </Link>
                </div>

                <div className="flex gap-3">
                  <button onClick={resetBuild} className="flex-1 bg-slate-700 text-white py-2 rounded-lg hover:bg-slate-600">
                    Try Again
                  </button>
                  {selectedChallenge.id !== "ch5" && (
                    <button onClick={() => switchChallenge(demoChallenges[demoChallenges.findIndex(c => c.id === selectedChallenge.id) + 1])} className="flex-1 bg-emerald-500 text-white py-2 rounded-lg hover:bg-emerald-400 font-bold">
                      Next Challenge →
                    </button>
                  )}
                </div>
              </div>
            ) : null}

            {/* Vedic Math Tip */}
            {!buildSubmitted && !booting && (
              <div className="vedic-card rounded-xl p-4 mt-4">
                <h4 className="text-amber-200 font-bold mb-1">🧮 Vedic Math: Quick Budget Check</h4>
                <p className="text-amber-100/80 text-sm">To check if you&apos;re within budget, subtract from ${BUDGET.toLocaleString()} using the Vedic method: subtract each digit from 9 (last from 10). Example: $5000 - $3,247 → 9-3=6, 9-2=7, 9-4=5, 10-7=3 → $1,753 remaining!</p>
              </div>
            )}
          </div>
        )}

        {/* MATH DOJO TAB */}
        {tab === "dojo" && (
          <MathDojo
            started={dojoStarted} round={dojoRound} problem={dojoProblem} input={dojoInput}
            score={dojoScore} streak={dojoStreak} timer={dojoTimer} feedback={dojoFeedback}
            done={dojoDone}
            onStart={() => {
              setDojoStarted(true); setDojoRound(0); setDojoScore(0); setDojoStreak(0);
              setDojoDone(false); setDojoFeedback(null); setDojoInput("");
              setDojoProblem(generateMathProblem()); setDojoTimer(30); setDojoStartTime(Date.now());
            }}
            onInputChange={setDojoInput}
            onSubmit={() => {
              if (!dojoProblem || dojoFeedback) return;
              const guess = parseFloat(dojoInput.replace(/[^\d.-]/g, ""));
              const correct = Math.abs(guess - dojoProblem.answer) < 0.01;
              const elapsed = (Date.now() - dojoStartTime) / 1000;
              let gained = 0;
              if (correct) {
                gained = 100;
                if (elapsed < 10) gained += 50;
                const newStreak = dojoStreak + 1;
                setDojoStreak(newStreak);
                if (newStreak >= 3) gained *= 2;
                unlock({ id: "vedic-apprentice", emoji: "🧮", title: "Vedic Apprentice!", description: "Solved your first problem!" });
              } else {
                setDojoStreak(0);
              }
              setDojoScore((s) => s + gained);
              setDojoFeedback({ correct, explanation: dojoProblem.explanation, answer: dojoProblem.answer });
            }}
            onNext={() => {
              if (dojoRound + 1 >= 10) {
                setDojoDone(true);
                return;
              }
              setDojoRound((r) => r + 1);
              setDojoProblem(generateMathProblem());
              setDojoInput(""); setDojoFeedback(null); setDojoTimer(30); setDojoStartTime(Date.now());
            }}
            onRestart={() => {
              setDojoStarted(false); setDojoDone(false); setDojoRound(0);
              setDojoScore(0); setDojoStreak(0); setDojoInput(""); setDojoFeedback(null);
            }}
            onTick={() => setDojoTimer((t) => Math.max(0, t - 1))}
          />
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

function ReqBar({ label, emoji, val, max, unit, why, color }: { label: string; emoji: string; val: number; max: number; unit: string; why: string; color: string }) {
  return (
    <div>
      <div className="flex items-center gap-3 mb-1">
        <span className="text-sm w-20 flex items-center gap-1"><span>{emoji}</span> {label}</span>
        <div className="flex-1 h-2 bg-slate-700 rounded-full">
          <div className={`h-2 ${color} rounded-full transition-all`} style={{ width: `${(val / max) * 100}%` }} />
        </div>
        <span className="text-white text-xs font-bold w-16 text-right">{val} {unit}</span>
      </div>
      <p className="text-slate-500 text-xs ml-[92px]">{why}</p>
    </div>
  );
}

const colorClasses: Record<string, { border: string; bg: string; text: string }> = {
  blue: { border: "border-blue-500", bg: "bg-blue-500/20", text: "text-blue-300" },
  emerald: { border: "border-emerald-500", bg: "bg-emerald-500/20", text: "text-emerald-300" },
  purple: { border: "border-purple-500", bg: "bg-purple-500/20", text: "text-purple-300" },
  orange: { border: "border-orange-500", bg: "bg-orange-500/20", text: "text-orange-300" },
  cyan: { border: "border-cyan-500", bg: "bg-cyan-500/20", text: "text-cyan-300" },
  red: { border: "border-red-500", bg: "bg-red-500/20", text: "text-red-300" },
};

function MoboSlot({ label, filled, name, colSpan, height, onClear, color, big, vert }: {
  label: string; filled: boolean; name?: string; colSpan: number; height: string;
  onClear: () => void; color: string; big?: boolean; vert?: boolean;
}) {
  const c = colorClasses[color] ?? colorClasses.emerald;
  const span = `col-span-${colSpan}`;
  const spanClasses: Record<number, string> = { 1: "col-span-1", 2: "col-span-2", 3: "col-span-3", 4: "col-span-4" };
  return (
    <button
      onClick={filled ? onClear : undefined}
      disabled={!filled}
      className={`${spanClasses[colSpan] ?? span} ${height} rounded-lg border-2 flex items-center justify-center text-center px-2 transition-all ${
        filled ? `${c.border} ${c.bg} ${c.text} cursor-pointer hover:brightness-125 animate-slot-fill` : "border-dashed border-slate-700 text-slate-600"
      }`}
    >
      {filled ? (
        <span className={`font-bold ${big ? "text-sm" : "text-[10px]"} ${vert ? "writing-vertical" : ""} line-clamp-2 leading-tight`}>
          {name ?? label}
        </span>
      ) : (
        <span className="text-[10px] font-medium">{label}</span>
      )}
    </button>
  );
}

interface MathDojoProps {
  started: boolean; round: number; problem: MathProblem | null; input: string;
  score: number; streak: number; timer: number;
  feedback: { correct: boolean; explanation: string; answer: number } | null;
  done: boolean;
  onStart: () => void; onInputChange: (v: string) => void; onSubmit: () => void;
  onNext: () => void; onRestart: () => void; onTick: () => void;
}

function MathDojo(props: MathDojoProps) {
  const { started, round, problem, input, score, streak, timer, feedback, done, onStart, onInputChange, onSubmit, onNext, onRestart, onTick } = props;

  // Timer tick
  useEffect(() => {
    if (!started || feedback || done || timer <= 0) return;
    const id = setTimeout(onTick, 1000);
    return () => clearTimeout(id);
  }, [started, feedback, done, timer, onTick]);

  if (!started && !done) {
    return (
      <div className="max-w-xl mx-auto animate-slide-in">
        <div className="bg-gradient-to-br from-amber-900/40 to-orange-900/30 border-2 border-amber-500/40 rounded-xl p-8 text-center">
          <div className="text-6xl mb-4">🧮</div>
          <h2 className="text-3xl font-black text-amber-300 mb-2">Vedic Math Dojo</h2>
          <p className="text-amber-100/80 mb-2">10 rounds. Mental math only. Vedic shortcuts FTW.</p>
          <p className="text-slate-400 text-sm mb-6">100 pts per correct answer · +50 speed bonus under 10s · 2x streak multiplier at 3+ in a row</p>
          <button onClick={onStart} className="bg-amber-500 text-black font-black py-3 px-8 rounded-xl hover:bg-amber-400 text-lg">
            Enter the Dojo →
          </button>
        </div>
      </div>
    );
  }

  if (done) {
    const r = rankFromScore(score);
    return (
      <div className="max-w-xl mx-auto animate-slide-in">
        <div className="bg-slate-800 border border-amber-500/40 rounded-xl p-8 text-center">
          <div className="text-6xl mb-2">{r.emoji}</div>
          <h2 className="text-2xl font-bold text-white mb-2">You are a {r.rank}!</h2>
          <p className="text-5xl font-black text-amber-400 mb-4">{score} pts</p>
          <p className="text-slate-400 text-sm mb-6">
            Ranks: Apprentice 🌱 (0-299) · Scholar 📚 (300-599) · Master 🏆 (600-899) · Grandmaster 👑 (900+)
          </p>
          <button onClick={onRestart} className="bg-amber-500 text-black font-bold py-2 px-6 rounded-lg hover:bg-amber-400">
            Play Again →
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto animate-slide-in">
      <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
        <div className="flex justify-between items-center mb-3">
          <span className="text-sm text-slate-400">Round {round + 1} / 10</span>
          <div className="flex items-center gap-4">
            {streak >= 2 && <span className="text-amber-400 text-sm font-bold">🔥 {streak} streak</span>}
            <span className="text-emerald-400 text-sm font-bold">{score} pts</span>
          </div>
        </div>
        <div className="w-full bg-slate-700 rounded-full h-2 mb-4">
          <div className={`h-2 rounded-full transition-all ${timer > 15 ? "bg-emerald-500" : timer > 5 ? "bg-amber-500" : "bg-red-500"}`} style={{ width: `${(timer / 30) * 100}%` }} />
        </div>

        <h3 className="text-2xl font-bold text-white mb-2 text-center">{problem?.question}</h3>
        <p className="text-amber-300/70 text-xs text-center mb-4">{problem?.hint}</p>

        {!feedback ? (
          <>
            <input
              type="text"
              inputMode="numeric"
              value={input}
              onChange={(e) => onInputChange(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && onSubmit()}
              placeholder="Your answer"
              autoFocus
              className="w-full bg-slate-900 border border-slate-600 rounded-lg p-3 text-white text-center text-2xl font-mono mb-3 focus:border-amber-500 focus:outline-none"
            />
            <button onClick={onSubmit} disabled={!input} className="w-full bg-amber-500 text-black font-bold py-3 rounded-xl hover:bg-amber-400 disabled:opacity-50 disabled:cursor-not-allowed">
              Submit Answer
            </button>
          </>
        ) : (
          <div className="animate-fade-in-up">
            <div className={`p-4 rounded-lg mb-3 ${feedback.correct ? "bg-emerald-500/10 border border-emerald-500/40" : "bg-red-500/10 border border-red-500/40"}`}>
              <p className={`font-bold mb-1 ${feedback.correct ? "text-emerald-300" : "text-red-300"}`}>
                {feedback.correct ? "✅ Correct!" : `❌ Not quite. Answer: ${feedback.answer}`}
              </p>
              <pre className="text-slate-300 text-xs whitespace-pre-wrap font-mono">{feedback.explanation}</pre>
            </div>
            <button onClick={onNext} className="w-full bg-emerald-500 text-white font-bold py-3 rounded-xl hover:bg-emerald-400">
              {round + 1 >= 10 ? "See Results →" : "Next Problem →"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
