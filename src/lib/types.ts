// Component types for motherboard parts
export interface CPUSpec {
  id: string;
  name: string;
  brand: string;
  cores: number;
  clockSpeed: number; // GHz
  tdp: number; // Watts
  price: number;
  performanceScore: number;
  bestFor: string[]; // e.g., ["AI Training", "Web Hosting"]
}

export interface RAMSpec {
  id: string;
  name: string;
  capacity: number; // GB
  type: string; // DDR4, DDR5
  speed: number; // MHz
  price: number;
  performanceScore: number;
}

export interface StorageSpec {
  id: string;
  name: string;
  type: string; // SSD, HDD, NVMe
  capacity: number; // TB
  readSpeed: number; // MB/s
  writeSpeed: number; // MB/s
  price: number;
  performanceScore: number;
}

export interface GPUSpec {
  id: string;
  name: string;
  brand: string;
  vram: number; // GB
  tdp: number; // Watts
  price: number;
  performanceScore: number;
  bestFor: string[];
}

export interface NetworkCard {
  id: string;
  name: string;
  speed: number; // Gbps
  ports: number;
  price: number;
}

export interface PowerSupply {
  id: string;
  name: string;
  wattage: number;
  efficiency: string; // 80+ Bronze, Silver, Gold, Platinum
  price: number;
}

export interface Motherboard {
  cpu: CPUSpec | null;
  ram: RAMSpec[];
  storage: StorageSpec[];
  gpu: GPUSpec | null;
  networkCard: NetworkCard | null;
  powerSupply: PowerSupply | null;
  ramSlots: number;
  storageSlots: number;
}

export interface Server {
  id: string;
  name: string;
  motherboards: Motherboard[];
  formFactor: string; // 1U, 2U, 4U
  maxMotherboards: number;
  totalPower: number;
  totalCost: number;
  performanceScore: number;
}

export interface Rack {
  id: string;
  name: string;
  servers: Server[];
  maxUnits: number; // typically 42U
  currentUnits: number;
  totalPower: number;
  totalCost: number;
  coolingRequired: number; // BTU
}

export interface Row {
  id: string;
  name: string;
  racks: Rack[];
  maxRacks: number;
  totalPower: number;
  totalCost: number;
  coolingSystem: string;
  coolingCost: number;
}

export interface DataCenter {
  id: string;
  name: string;
  rows: Row[];
  totalPower: number;
  totalCost: number;
  monthlyRevenue: number;
  monthlyOperatingCost: number;
  pue: number; // Power Usage Effectiveness
  uptime: number; // percentage
  profitMargin: number;
}

// Challenge/Exercise types
export interface Challenge {
  id: string;
  day: number;
  title: string;
  description: string;
  type: 'quiz' | 'simulation' | 'budget';
  budget?: number;
  requirements?: string[];
  timeLimit?: number; // seconds
  points: number;
  difficulty: 'easy' | 'medium' | 'hard';
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  points: number;
  vedicMathTip?: string;
}

// User/Progress types
export interface UserProfile {
  id: string;
  email: string;
  name: string;
  image?: string;
  role: 'student' | 'admin' | 'superadmin';
  totalPoints: number;
  currentDay: number;
  completedChallenges: string[];
  badges: string[];
  createdAt: string;
}

export interface LeaderboardEntry {
  userId: string;
  name: string;
  image?: string;
  totalPoints: number;
  completedChallenges: number;
  rank: number;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  requirement: string;
}

export interface DayProgress {
  day: number;
  completed: boolean;
  quizScore: number;
  simulationScore: number;
  totalPoints: number;
  completedAt?: string;
}

// Vedic Math types
export interface VedicMathTip {
  id: string;
  title: string;
  description: string;
  example: string;
  formula: string;
  applicableTo: string; // e.g., "profit margin", "power calculation"
}

// Budget challenge result
export interface SimulationResult {
  totalCost: number;
  totalPower: number;
  performanceScore: number;
  profitability: number;
  withinBudget: boolean;
  meetsRequirements: boolean;
  score: number;
  feedback: string[];
}

export interface Workload {
  id: string;
  name: string;
  description: string;
  icon: string;
  requiredCPUCores: number;
  requiredRAM: number; // GB
  requiredStorage: number; // TB
  requiredGPU: boolean;
  requiredGPUVRAM?: number;
  networkBandwidth: number; // Gbps
  revenuePerMonth: number;
  priority: 'low' | 'medium' | 'high' | 'critical';
}
