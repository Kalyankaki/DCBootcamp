import { create } from "zustand";
import { persist } from "zustand/middleware";
import type {
  Motherboard,
  Server,
  Rack,
  Row,
  DataCenter,
  CPUSpec,
  RAMSpec,
  StorageSpec,
  GPUSpec,
  NetworkCard,
  PowerSupply,
  DayProgress,
  LeaderboardEntry,
  Challenge,
} from "@/lib/types";

// ---------- helper to create empty builder objects ----------

function createEmptyMotherboard(): Motherboard {
  return {
    cpu: null,
    ram: [],
    storage: [],
    gpu: null,
    networkCard: null,
    powerSupply: null,
    ramSlots: 4,
    storageSlots: 4,
  };
}

function createEmptyServer(): Server {
  return {
    id: crypto.randomUUID(),
    name: "New Server",
    motherboards: [],
    formFactor: "1U",
    maxMotherboards: 1,
    totalPower: 0,
    totalCost: 0,
    performanceScore: 0,
  };
}

function createEmptyRack(): Rack {
  return {
    id: crypto.randomUUID(),
    name: "New Rack",
    servers: [],
    maxUnits: 42,
    currentUnits: 0,
    totalPower: 0,
    totalCost: 0,
    coolingRequired: 0,
  };
}

function createEmptyRow(): Row {
  return {
    id: crypto.randomUUID(),
    name: "New Row",
    racks: [],
    maxRacks: 10,
    totalPower: 0,
    totalCost: 0,
    coolingSystem: "Air Cooling",
    coolingCost: 0,
  };
}

function createEmptyDataCenter(): DataCenter {
  return {
    id: crypto.randomUUID(),
    name: "New Data Center",
    rows: [],
    totalPower: 0,
    totalCost: 0,
    monthlyRevenue: 0,
    monthlyOperatingCost: 0,
    pue: 1.5,
    uptime: 99.9,
    profitMargin: 0,
  };
}

// ---------- state shape ----------

export interface GameState {
  // User profile
  userId: string;
  email: string;
  name: string;
  image: string;
  role: "student" | "teacher" | "admin" | "superadmin";
  totalPoints: number;
  badges: string[];
  completedChallenges: string[];

  // Day tracking
  currentDay: number;
  dayProgress: DayProgress[];

  // Builder states
  motherboard: Motherboard;
  server: Server;
  rack: Rack;
  row: Row;
  dataCenter: DataCenter;

  // Budget
  budgetRemaining: number;

  // Challenge
  currentChallenge: Challenge | null;
  timeRemaining: number;

  // Leaderboard
  leaderboard: LeaderboardEntry[];

  // Teacher session
  teacherSession: {
    dayNumber: number;
    currentBlockIndex: number;
    completedBlocks: string[];
  } | null;

  // ---- Actions ----

  // Day / progress
  setDay: (day: number) => void;
  completeQuiz: (day: number, score: number) => void;
  completeSimulation: (day: number, score: number) => void;

  // Points / badges
  addPoints: (points: number) => void;
  earnBadge: (badgeId: string) => void;

  // Motherboard component actions
  setCPU: (cpu: CPUSpec) => void;
  addRAM: (ram: RAMSpec) => void;
  removeRAM: (index: number) => void;
  addStorage: (storage: StorageSpec) => void;
  removeStorage: (index: number) => void;
  setGPU: (gpu: GPUSpec) => void;
  setNetworkCard: (card: NetworkCard) => void;
  setPowerSupply: (psu: PowerSupply) => void;

  // Server builder
  setServerFormFactor: (formFactor: string) => void;
  addMotherboardToServer: (mb: Motherboard) => void;
  removeMotherboardFromServer: (index: number) => void;
  finalizeServer: () => void;

  // Rack builder
  addServerToRack: (server: Server) => void;
  removeServerFromRack: (index: number) => void;

  // Row builder
  addRackToRow: (rack: Rack) => void;
  removeRackFromRow: (index: number) => void;
  setRowCooling: (system: string, cost: number) => void;

  // Data center builder
  addRowToDataCenter: (row: Row) => void;
  removeRowFromDataCenter: (index: number) => void;

  // Budget / challenge
  setBudget: (amount: number) => void;
  setCurrentChallenge: (challenge: Challenge | null) => void;
  setTimeRemaining: (seconds: number) => void;

  // Leaderboard
  setLeaderboard: (entries: LeaderboardEntry[]) => void;

  // Teacher session
  setTeacherSession: (session: { dayNumber: number; currentBlockIndex: number; completedBlocks: string[] } | null) => void;
  advanceTeacherBlock: () => void;
  completeTeacherBlock: (blockId: string) => void;

  // General
  addComponent: (level: string, component: any) => void;
  removeComponent: (level: string, index: number) => void;
  resetBuilder: () => void;
  setUserProfile: (profile: {
    userId: string;
    email: string;
    name: string;
    image?: string;
    role: "student" | "teacher" | "admin" | "superadmin";
  }) => void;
}

// ---------- cost / power selectors ----------

export function calculateMotherboardCost(mb: Motherboard): number {
  let cost = 0;
  if (mb.cpu) cost += mb.cpu.price;
  cost += mb.ram.reduce((s, r) => s + r.price, 0);
  cost += mb.storage.reduce((s, d) => s + d.price, 0);
  if (mb.gpu) cost += mb.gpu.price;
  if (mb.networkCard) cost += mb.networkCard.price;
  if (mb.powerSupply) cost += mb.powerSupply.price;
  return cost;
}

export function calculateMotherboardPower(mb: Motherboard): number {
  let power = 0;
  if (mb.cpu) power += mb.cpu.tdp;
  if (mb.gpu) power += mb.gpu.tdp;
  // Baseline for RAM + storage + network
  power += mb.ram.length * 10;
  power += mb.storage.length * 15;
  if (mb.networkCard) power += 25;
  return power;
}

export function calculateTotalCost(state: GameState): number {
  let cost = calculateMotherboardCost(state.motherboard);
  cost += state.server.totalCost;
  cost += state.rack.totalCost;
  cost += state.row.totalCost;
  cost += state.dataCenter.totalCost;
  return cost;
}

export function calculateTotalPower(state: GameState): number {
  let power = calculateMotherboardPower(state.motherboard);
  power += state.server.totalPower;
  power += state.rack.totalPower;
  power += state.row.totalPower;
  power += state.dataCenter.totalPower;
  return power;
}

// ---------- helper: recalculate server totals ----------

function recalcServer(server: Server): Server {
  const totalCost = server.motherboards.reduce(
    (s, mb) => s + calculateMotherboardCost(mb),
    0
  );
  const totalPower = server.motherboards.reduce(
    (s, mb) => s + calculateMotherboardPower(mb),
    0
  );
  const performanceScore = server.motherboards.reduce((s, mb) => {
    let score = 0;
    if (mb.cpu) score += mb.cpu.performanceScore;
    if (mb.gpu) score += mb.gpu.performanceScore;
    score += mb.ram.reduce((a, r) => a + r.performanceScore, 0);
    score += mb.storage.reduce((a, d) => a + d.performanceScore, 0);
    return s + score;
  }, 0);
  return { ...server, totalCost, totalPower, performanceScore };
}

function formFactorUnits(ff: string): number {
  const n = parseInt(ff, 10);
  return isNaN(n) ? 1 : n;
}

function recalcRack(rack: Rack): Rack {
  const totalCost = rack.servers.reduce((s, sv) => s + sv.totalCost, 0);
  const totalPower = rack.servers.reduce((s, sv) => s + sv.totalPower, 0);
  const currentUnits = rack.servers.reduce(
    (s, sv) => s + formFactorUnits(sv.formFactor),
    0
  );
  const coolingRequired = Math.round(totalPower * 3.412); // watts to BTU/hr
  return { ...rack, totalCost, totalPower, currentUnits, coolingRequired };
}

function recalcRow(row: Row): Row {
  const totalCost =
    row.racks.reduce((s, r) => s + r.totalCost, 0) + row.coolingCost;
  const totalPower = row.racks.reduce((s, r) => s + r.totalPower, 0);
  return { ...row, totalCost, totalPower };
}

function recalcDataCenter(dc: DataCenter): DataCenter {
  const totalCost = dc.rows.reduce((s, r) => s + r.totalCost, 0);
  const totalPower = dc.rows.reduce((s, r) => s + r.totalPower, 0);
  return { ...dc, totalCost, totalPower };
}

// ---------- default day progress ----------

function defaultDayProgress(): DayProgress[] {
  return Array.from({ length: 5 }, (_, i) => ({
    day: i + 1,
    completed: false,
    quizScore: 0,
    simulationScore: 0,
    totalPoints: 0,
  }));
}

// ---------- Zustand store ----------

export const useGameStore = create<GameState>()(
  persist(
    (set, get) => ({
      // --- defaults ---
      userId: "",
      email: "",
      name: "",
      image: "",
      role: "student",
      totalPoints: 0,
      badges: [],
      completedChallenges: [],

      currentDay: 1,
      dayProgress: defaultDayProgress(),

      motherboard: createEmptyMotherboard(),
      server: createEmptyServer(),
      rack: createEmptyRack(),
      row: createEmptyRow(),
      dataCenter: createEmptyDataCenter(),

      budgetRemaining: 100000,

      currentChallenge: null,
      timeRemaining: 0,

      leaderboard: [],

      teacherSession: null,

      // --- actions ---

      setDay: (day) => set({ currentDay: day }),

      completeQuiz: (day, score) =>
        set((state) => {
          const dayProgress = state.dayProgress.map((dp) =>
            dp.day === day
              ? {
                  ...dp,
                  quizScore: Math.max(dp.quizScore, score),
                  totalPoints: Math.max(dp.quizScore, score) + dp.simulationScore,
                  completed: Math.max(dp.quizScore, score) > 0 && dp.simulationScore > 0,
                  completedAt:
                    Math.max(dp.quizScore, score) > 0 && dp.simulationScore > 0
                      ? new Date().toISOString()
                      : dp.completedAt,
                }
              : dp
          );
          return {
            dayProgress,
            totalPoints: state.totalPoints + score,
            completedChallenges: [...new Set([...state.completedChallenges, `quiz-day-${day}`])],
          };
        }),

      completeSimulation: (day, score) =>
        set((state) => {
          const dayProgress = state.dayProgress.map((dp) =>
            dp.day === day
              ? {
                  ...dp,
                  simulationScore: Math.max(dp.simulationScore, score),
                  totalPoints: dp.quizScore + Math.max(dp.simulationScore, score),
                  completed: dp.quizScore > 0 && Math.max(dp.simulationScore, score) > 0,
                  completedAt:
                    dp.quizScore > 0 && Math.max(dp.simulationScore, score) > 0
                      ? new Date().toISOString()
                      : dp.completedAt,
                }
              : dp
          );
          return {
            dayProgress,
            totalPoints: state.totalPoints + score,
            completedChallenges: [...new Set([...state.completedChallenges, `sim-day-${day}`])],
          };
        }),

      addPoints: (points) =>
        set((state) => ({ totalPoints: state.totalPoints + points })),

      earnBadge: (badgeId) =>
        set((state) =>
          state.badges.includes(badgeId)
            ? {}
            : { badges: [...state.badges, badgeId] }
        ),

      // Motherboard actions
      setCPU: (cpu) =>
        set((state) => ({ motherboard: { ...state.motherboard, cpu } })),

      addRAM: (ram) =>
        set((state) => {
          if (state.motherboard.ram.length >= state.motherboard.ramSlots) return {};
          return { motherboard: { ...state.motherboard, ram: [...state.motherboard.ram, ram] } };
        }),

      removeRAM: (index) =>
        set((state) => ({
          motherboard: {
            ...state.motherboard,
            ram: state.motherboard.ram.filter((_, i) => i !== index),
          },
        })),

      addStorage: (storage) =>
        set((state) => {
          if (state.motherboard.storage.length >= state.motherboard.storageSlots) return {};
          return {
            motherboard: {
              ...state.motherboard,
              storage: [...state.motherboard.storage, storage],
            },
          };
        }),

      removeStorage: (index) =>
        set((state) => ({
          motherboard: {
            ...state.motherboard,
            storage: state.motherboard.storage.filter((_, i) => i !== index),
          },
        })),

      setGPU: (gpu) =>
        set((state) => ({ motherboard: { ...state.motherboard, gpu } })),

      setNetworkCard: (card) =>
        set((state) => ({ motherboard: { ...state.motherboard, networkCard: card } })),

      setPowerSupply: (psu) =>
        set((state) => ({ motherboard: { ...state.motherboard, powerSupply: psu } })),

      // Server builder
      setServerFormFactor: (formFactor) =>
        set((state) => {
          const maxMotherboards = formFactor === "4U" ? 4 : formFactor === "2U" ? 2 : 1;
          return { server: { ...state.server, formFactor, maxMotherboards } };
        }),

      addMotherboardToServer: (mb) =>
        set((state) => {
          if (state.server.motherboards.length >= state.server.maxMotherboards) return {};
          const server = recalcServer({
            ...state.server,
            motherboards: [...state.server.motherboards, mb],
          });
          return { server };
        }),

      removeMotherboardFromServer: (index) =>
        set((state) => {
          const server = recalcServer({
            ...state.server,
            motherboards: state.server.motherboards.filter((_, i) => i !== index),
          });
          return { server };
        }),

      finalizeServer: () =>
        set((state) => {
          const mb = state.motherboard;
          if (!mb.cpu) return {};
          const server = recalcServer({
            ...state.server,
            motherboards: [...state.server.motherboards, mb],
          });
          return { server, motherboard: createEmptyMotherboard() };
        }),

      // Rack builder
      addServerToRack: (server) =>
        set((state) => {
          const units = formFactorUnits(server.formFactor);
          if (state.rack.currentUnits + units > state.rack.maxUnits) return {};
          const rack = recalcRack({
            ...state.rack,
            servers: [...state.rack.servers, server],
          });
          return { rack };
        }),

      removeServerFromRack: (index) =>
        set((state) => {
          const rack = recalcRack({
            ...state.rack,
            servers: state.rack.servers.filter((_, i) => i !== index),
          });
          return { rack };
        }),

      // Row builder
      addRackToRow: (rack) =>
        set((state) => {
          if (state.row.racks.length >= state.row.maxRacks) return {};
          const row = recalcRow({
            ...state.row,
            racks: [...state.row.racks, rack],
          });
          return { row };
        }),

      removeRackFromRow: (index) =>
        set((state) => {
          const row = recalcRow({
            ...state.row,
            racks: state.row.racks.filter((_, i) => i !== index),
          });
          return { row };
        }),

      setRowCooling: (system, cost) =>
        set((state) => {
          const row = recalcRow({
            ...state.row,
            coolingSystem: system,
            coolingCost: cost,
          });
          return { row };
        }),

      // Data center builder
      addRowToDataCenter: (row) =>
        set((state) => {
          const dc = recalcDataCenter({
            ...state.dataCenter,
            rows: [...state.dataCenter.rows, row],
          });
          return { dataCenter: dc };
        }),

      removeRowFromDataCenter: (index) =>
        set((state) => {
          const dc = recalcDataCenter({
            ...state.dataCenter,
            rows: state.dataCenter.rows.filter((_, i) => i !== index),
          });
          return { dataCenter: dc };
        }),

      // Budget / challenge
      setBudget: (amount) => set({ budgetRemaining: amount }),

      setCurrentChallenge: (challenge) => set({ currentChallenge: challenge }),

      setTimeRemaining: (seconds) => set({ timeRemaining: seconds }),

      // Leaderboard
      setLeaderboard: (entries) => set({ leaderboard: entries }),

      // Teacher session
      setTeacherSession: (session: { dayNumber: number; currentBlockIndex: number; completedBlocks: string[] } | null) => set({ teacherSession: session }),
      advanceTeacherBlock: () => set((state) => {
        if (!state.teacherSession) return {};
        return { teacherSession: { ...state.teacherSession, currentBlockIndex: state.teacherSession.currentBlockIndex + 1 } };
      }),
      completeTeacherBlock: (blockId: string) => set((state) => {
        if (!state.teacherSession) return {};
        return { teacherSession: { ...state.teacherSession, completedBlocks: [...state.teacherSession.completedBlocks, blockId] } };
      }),

      // Generic add / remove (convenience)
      addComponent: (level, component) => {
        const state = get();
        switch (level) {
          case "ram":
            state.addRAM(component);
            break;
          case "storage":
            state.addStorage(component);
            break;
          case "motherboard":
            state.addMotherboardToServer(component);
            break;
          case "server":
            state.addServerToRack(component);
            break;
          case "rack":
            state.addRackToRow(component);
            break;
          case "row":
            state.addRowToDataCenter(component);
            break;
        }
      },

      removeComponent: (level, index) => {
        const state = get();
        switch (level) {
          case "ram":
            state.removeRAM(index);
            break;
          case "storage":
            state.removeStorage(index);
            break;
          case "motherboard":
            state.removeMotherboardFromServer(index);
            break;
          case "server":
            state.removeServerFromRack(index);
            break;
          case "rack":
            state.removeRackFromRow(index);
            break;
          case "row":
            state.removeRowFromDataCenter(index);
            break;
        }
      },

      resetBuilder: () =>
        set({
          motherboard: createEmptyMotherboard(),
          server: createEmptyServer(),
          rack: createEmptyRack(),
          row: createEmptyRow(),
          dataCenter: createEmptyDataCenter(),
        }),

      setUserProfile: (profile) =>
        set({
          userId: profile.userId,
          email: profile.email,
          name: profile.name,
          image: profile.image ?? "",
          role: profile.role,
        }),
    }),
    {
      name: "dc-bootcamp-game-store",
      partialize: (state) => ({
        userId: state.userId,
        email: state.email,
        name: state.name,
        image: state.image,
        role: state.role,
        totalPoints: state.totalPoints,
        badges: state.badges,
        completedChallenges: state.completedChallenges,
        currentDay: state.currentDay,
        dayProgress: state.dayProgress,
        motherboard: state.motherboard,
        server: state.server,
        rack: state.rack,
        row: state.row,
        dataCenter: state.dataCenter,
        budgetRemaining: state.budgetRemaining,
      }),
    }
  )
);
