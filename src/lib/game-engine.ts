import type {
  Motherboard,
  Server,
  Rack,
  Row,
  DataCenter,
  SimulationResult,
  Challenge,
  Workload,
} from './types';

// ==================== Server Templates ====================

export interface ServerTemplate {
  id: string;
  name: string;
  description: string;
  formFactor: string;
  units: number;
  powerDraw: number;
  cost: number;
  monthlyCost: number;
  cpuCores: number;
  ramGB: number;
  storageTB: number;
  hasGPU: boolean;
  gpuVRAM: number;
  networkGbps: number;
  workloadsServed: string[];
  revenuePerMonth: number;
}

export const serverTemplates: ServerTemplate[] = [
  { id: 'tpl-web', name: 'Web Server', description: 'Lightweight 1U server for web hosting and email', formFactor: '1U', units: 1, powerDraw: 200, cost: 2000, monthlyCost: 50, cpuCores: 8, ramGB: 32, storageTB: 1, hasGPU: false, gpuVRAM: 0, networkGbps: 10, workloadsServed: ['Web Hosting', 'Email Servers'], revenuePerMonth: 2500 },
  { id: 'tpl-db', name: 'Database Server', description: 'Powerful 2U server optimized for databases', formFactor: '2U', units: 2, powerDraw: 450, cost: 8000, monthlyCost: 120, cpuCores: 32, ramGB: 128, storageTB: 8, hasGPU: false, gpuVRAM: 0, networkGbps: 25, workloadsServed: ['Database', 'Cloud Storage'], revenuePerMonth: 7000 },
  { id: 'tpl-ai', name: 'AI Compute Server', description: 'GPU-heavy 4U beast for AI and scientific computing', formFactor: '4U', units: 4, powerDraw: 1500, cost: 45000, monthlyCost: 400, cpuCores: 64, ramGB: 256, storageTB: 4, hasGPU: true, gpuVRAM: 80, networkGbps: 100, workloadsServed: ['AI Training', 'Scientific Computing'], revenuePerMonth: 18000 },
  { id: 'tpl-storage', name: 'Storage Server', description: '2U server packed with drives for cloud storage', formFactor: '2U', units: 2, powerDraw: 300, cost: 5000, monthlyCost: 80, cpuCores: 8, ramGB: 32, storageTB: 48, hasGPU: false, gpuVRAM: 0, networkGbps: 25, workloadsServed: ['Cloud Storage', 'Video Streaming'], revenuePerMonth: 4000 },
  { id: 'tpl-game', name: 'Game Server', description: '2U server with GPU for multiplayer game hosting', formFactor: '2U', units: 2, powerDraw: 500, cost: 6000, monthlyCost: 100, cpuCores: 16, ramGB: 64, storageTB: 2, hasGPU: true, gpuVRAM: 12, networkGbps: 10, workloadsServed: ['Game Servers', 'Video Streaming'], revenuePerMonth: 5500 },
];

// ==================== Rack Templates ====================

export interface RackTemplate {
  id: string;
  name: string;
  description: string;
  servers: ServerTemplate[];
  totalUnits: number;
  totalPower: number;
  totalCost: number;
  monthlyRevenue: number;
  monthlyCost: number;
}

function buildRackTemplate(
  id: string,
  name: string,
  description: string,
  serverMix: { templateId: string; count: number }[]
): RackTemplate {
  const servers: ServerTemplate[] = [];
  let totalUnits = 0;
  let totalPower = 0;
  let totalCost = 0;
  let monthlyRevenue = 0;
  let monthlyCost = 0;

  for (const mix of serverMix) {
    const tpl = serverTemplates.find((s) => s.id === mix.templateId);
    if (!tpl) continue;
    for (let i = 0; i < mix.count; i++) {
      servers.push(tpl);
      totalUnits += tpl.units;
      totalPower += tpl.powerDraw;
      totalCost += tpl.cost;
      monthlyRevenue += tpl.revenuePerMonth;
      monthlyCost += tpl.monthlyCost;
    }
  }

  return { id, name, description, servers, totalUnits, totalPower, totalCost, monthlyRevenue, monthlyCost };
}

export const rackTemplates: RackTemplate[] = [
  buildRackTemplate('rack-web', 'Web Hosting Rack', '20 web servers for massive web hosting', [{ templateId: 'tpl-web', count: 20 }]),
  buildRackTemplate('rack-ai', 'AI Compute Rack', '8 AI servers for machine learning workloads', [{ templateId: 'tpl-ai', count: 8 }]),
  buildRackTemplate('rack-storage', 'Storage Rack', '18 storage servers for cloud storage', [{ templateId: 'tpl-storage', count: 18 }]),
  buildRackTemplate('rack-mixed', 'Mixed Workload Rack', 'A balanced mix of server types', [
    { templateId: 'tpl-web', count: 8 },
    { templateId: 'tpl-db', count: 4 },
    { templateId: 'tpl-storage', count: 4 },
    { templateId: 'tpl-game', count: 2 },
  ]),
];

// ==================== Cooling Options ====================

export interface CoolingOption {
  id: string;
  name: string;
  monthlyCost: number;
  pue: number;
  description: string;
}

export const coolingOptions: CoolingOption[] = [
  { id: 'cool-basic', name: 'Basic Air Cooling', monthlyCost: 5000, pue: 2.0, description: 'Standard CRAC units' },
  { id: 'cool-advanced', name: 'Advanced Air Cooling', monthlyCost: 10000, pue: 1.5, description: 'Hot/cold aisle containment with efficient CRAC' },
  { id: 'cool-liquid', name: 'Liquid Cooling', monthlyCost: 20000, pue: 1.2, description: 'Direct-to-chip liquid cooling' },
  { id: 'cool-free', name: 'Free Cooling + Liquid', monthlyCost: 15000, pue: 1.1, description: 'Outside air + liquid cooling hybrid' },
];

// ==================== Network Options ====================

export interface NetworkOption {
  id: string;
  name: string;
  speed: string;
  monthlyCost: number;
  description: string;
}

export const networkOptions: NetworkOption[] = [
  { id: 'net-basic', name: 'Basic', speed: '1 Gbps', monthlyCost: 2000, description: '1 Gbps ToR switches' },
  { id: 'net-standard', name: 'Standard', speed: '10 Gbps', monthlyCost: 5000, description: '10 Gbps with aggregation layer' },
  { id: 'net-premium', name: 'Premium', speed: '100 Gbps', monthlyCost: 15000, description: '100 Gbps spine-leaf fabric' },
];

// ==================== Redundancy Options ====================

export interface RedundancyOption {
  id: string;
  name: string;
  monthlyCost: number;
  uptime: number;
  description: string;
}

export const redundancyOptions: RedundancyOption[] = [
  { id: 'red-n', name: 'N (No Redundancy)', monthlyCost: 0, uptime: 99.0, description: 'Single power path' },
  { id: 'red-n1', name: 'N+1', monthlyCost: 10000, uptime: 99.9, description: 'One extra backup for every component' },
  { id: 'red-2n', name: '2N', monthlyCost: 25000, uptime: 99.99, description: 'Fully duplicated power infrastructure' },
];

// ==================== Constants ====================

/** Electricity cost per kilowatt-hour */
const ELECTRICITY_COST_PER_KWH = 0.10;

/** Hours in a month (24 * 30) */
const HOURS_PER_MONTH = 720;

/** Watts to BTU/hr conversion factor */
const WATTS_TO_BTU = 3.41;

/** Monthly maintenance cost per server */
const MAINTENANCE_PER_SERVER = 50;

/** Base cooling cost multiplier (percentage of power cost) */
const COOLING_COST_MULTIPLIER = 0.4;

// ==================== Stat Interfaces ====================

export interface MotherboardStats {
  totalPower: number;
  totalCost: number;
  performanceScore: number;
  totalRAM: number;
  totalStorage: number;
  hasSufficientPower: boolean;
}

export interface ServerStats {
  totalPower: number;
  totalCost: number;
  performanceScore: number;
  totalRAM: number;
  totalStorage: number;
  totalCPUCores: number;
  hasGPU: boolean;
  maxGPUVRAM: number;
  networkSpeed: number;
}

export interface RackStats {
  totalPower: number;
  totalCost: number;
  performanceScore: number;
  usedUnits: number;
  availableUnits: number;
  coolingRequired: number; // BTU/hr
  serverCount: number;
  monthlyPowerCost: number;
}

export interface RowStats {
  totalPower: number;
  totalCost: number;
  performanceScore: number;
  rackCount: number;
  serverCount: number;
  coolingRequired: number;
  monthlyCoolingCost: number;
  monthlyPowerCost: number;
  monthlyMaintenanceCost: number;
  monthlyOperatingCost: number;
}

export interface DataCenterStats {
  totalPower: number;
  totalCost: number;
  performanceScore: number;
  totalRows: number;
  totalRacks: number;
  totalServers: number;
  pue: number;
  monthlyPowerCost: number;
  monthlyCoolingCost: number;
  monthlyMaintenanceCost: number;
  monthlyOperatingCost: number;
  monthlyRevenue: number;
  monthlyProfit: number;
  profitMargin: number;
  annualROI: number;
  paybackMonths: number;
}

// ==================== Calculation Functions ====================

/**
 * Calculate stats for a single motherboard.
 */
export function calculateMotherboardStats(mb: Motherboard): MotherboardStats {
  let totalPower = 0;
  let totalCost = 0;
  let performanceScore = 0;
  let totalRAM = 0;
  let totalStorage = 0;
  let componentCount = 0;

  if (mb.cpu) {
    totalPower += mb.cpu.tdp;
    totalCost += mb.cpu.price;
    performanceScore += mb.cpu.performanceScore;
    componentCount++;
  }

  for (const ram of mb.ram) {
    totalPower += 5; // ~5W per RAM stick
    totalCost += ram.price;
    performanceScore += ram.performanceScore;
    totalRAM += ram.capacity;
    componentCount++;
  }

  for (const stor of mb.storage) {
    totalPower += stor.type === 'HDD' ? 10 : stor.type === 'SSD' ? 5 : 7; // NVMe ~7W
    totalCost += stor.price;
    performanceScore += stor.performanceScore;
    totalStorage += stor.capacity;
    componentCount++;
  }

  if (mb.gpu) {
    totalPower += mb.gpu.tdp;
    totalCost += mb.gpu.price;
    performanceScore += mb.gpu.performanceScore;
    componentCount++;
  }

  if (mb.networkCard) {
    totalPower += 10; // ~10W for NIC
    totalCost += mb.networkCard.price;
    componentCount++;
  }

  if (mb.powerSupply) {
    totalCost += mb.powerSupply.price;
    // PSU itself doesn't add to power draw, it supplies it
  }

  // Average the performance score across components
  if (componentCount > 0) {
    performanceScore = Math.round(performanceScore / componentCount);
  }

  // Check if PSU can handle the total power draw
  const hasSufficientPower = mb.powerSupply
    ? mb.powerSupply.wattage >= totalPower
    : false;

  return {
    totalPower,
    totalCost,
    performanceScore,
    totalRAM,
    totalStorage,
    hasSufficientPower,
  };
}

/**
 * Calculate stats for a server (aggregates motherboard stats).
 */
export function calculateServerStats(server: Server): ServerStats {
  let totalPower = 0;
  let totalCost = 0;
  let performanceScore = 0;
  let totalRAM = 0;
  let totalStorage = 0;
  let totalCPUCores = 0;
  let hasGPU = false;
  let maxGPUVRAM = 0;
  let networkSpeed = 0;

  for (const mb of server.motherboards) {
    const mbStats = calculateMotherboardStats(mb);
    totalPower += mbStats.totalPower;
    totalCost += mbStats.totalCost;
    performanceScore += mbStats.performanceScore;
    totalRAM += mbStats.totalRAM;
    totalStorage += mbStats.totalStorage;

    if (mb.cpu) {
      totalCPUCores += mb.cpu.cores;
    }

    if (mb.gpu) {
      hasGPU = true;
      maxGPUVRAM = Math.max(maxGPUVRAM, mb.gpu.vram);
    }

    if (mb.networkCard) {
      networkSpeed = Math.max(networkSpeed, mb.networkCard.speed);
    }
  }

  // Average performance across motherboards
  if (server.motherboards.length > 0) {
    performanceScore = Math.round(performanceScore / server.motherboards.length);
  }

  // Add baseline server overhead power (~20W for fans, management controller, etc.)
  totalPower += 20;

  return {
    totalPower,
    totalCost,
    performanceScore,
    totalRAM,
    totalStorage,
    totalCPUCores,
    hasGPU,
    maxGPUVRAM,
    networkSpeed,
  };
}

/**
 * Calculate stats for a rack (aggregates server stats + cooling).
 */
export function calculateRackStats(rack: Rack): RackStats {
  let totalPower = 0;
  let totalCost = 0;
  let performanceScore = 0;
  let usedUnits = 0;

  for (const server of rack.servers) {
    const serverStats = calculateServerStats(server);
    totalPower += serverStats.totalPower;
    totalCost += serverStats.totalCost;
    performanceScore += serverStats.performanceScore;
    usedUnits += formFactorToUnits(server.formFactor);
  }

  if (rack.servers.length > 0) {
    performanceScore = Math.round(performanceScore / rack.servers.length);
  }

  // Add rack infrastructure cost (~$2000 for the rack itself, PDUs, cabling)
  totalCost += 2000;

  const coolingRequired = Math.round(totalPower * WATTS_TO_BTU);
  const monthlyPowerCost = calculateMonthlyPowerCost(totalPower);

  return {
    totalPower,
    totalCost,
    performanceScore,
    usedUnits,
    availableUnits: rack.maxUnits - usedUnits,
    coolingRequired,
    serverCount: rack.servers.length,
    monthlyPowerCost,
  };
}

/**
 * Calculate stats for a row (aggregates rack stats + cooling system).
 */
export function calculateRowStats(row: Row): RowStats {
  let totalPower = 0;
  let totalCost = 0;
  let performanceScore = 0;
  let serverCount = 0;
  let coolingRequired = 0;

  for (const rack of row.racks) {
    const rackStats = calculateRackStats(rack);
    totalPower += rackStats.totalPower;
    totalCost += rackStats.totalCost;
    performanceScore += rackStats.performanceScore;
    serverCount += rackStats.serverCount;
    coolingRequired += rackStats.coolingRequired;
  }

  if (row.racks.length > 0) {
    performanceScore = Math.round(performanceScore / row.racks.length);
  }

  const monthlyPowerCost = calculateMonthlyPowerCost(totalPower);
  const monthlyCoolingCost = row.coolingCost > 0
    ? row.coolingCost
    : Math.round(monthlyPowerCost * COOLING_COST_MULTIPLIER);
  const monthlyMaintenanceCost = serverCount * MAINTENANCE_PER_SERVER;
  const monthlyOperatingCost = monthlyPowerCost + monthlyCoolingCost + monthlyMaintenanceCost;

  return {
    totalPower,
    totalCost,
    performanceScore,
    rackCount: row.racks.length,
    serverCount,
    coolingRequired,
    monthlyCoolingCost,
    monthlyPowerCost,
    monthlyMaintenanceCost,
    monthlyOperatingCost,
  };
}

/**
 * Calculate full data center stats including PUE and profitability.
 */
export function calculateDataCenterStats(dc: DataCenter): DataCenterStats {
  let totalITPower = 0;
  let totalCost = 0;
  let performanceScore = 0;
  let totalRacks = 0;
  let totalServers = 0;
  let totalCoolingCost = 0;
  let totalMaintenanceCost = 0;

  for (const row of dc.rows) {
    const rowStats = calculateRowStats(row);
    totalITPower += rowStats.totalPower;
    totalCost += rowStats.totalCost;
    performanceScore += rowStats.performanceScore;
    totalRacks += rowStats.rackCount;
    totalServers += rowStats.serverCount;
    totalCoolingCost += rowStats.monthlyCoolingCost;
    totalMaintenanceCost += rowStats.monthlyMaintenanceCost;
  }

  if (dc.rows.length > 0) {
    performanceScore = Math.round(performanceScore / dc.rows.length);
  }

  // PUE calculation: total facility power / IT power
  // Cooling and overhead add to total facility power
  const monthlyITPowerCost = calculateMonthlyPowerCost(totalITPower);
  const totalFacilityPower = totalITPower > 0
    ? totalITPower * (dc.pue > 0 ? dc.pue : 1.5)
    : 0;
  const monthlyPowerCost = calculateMonthlyPowerCost(totalFacilityPower);

  // If PUE is not set, calculate it from cooling costs
  const pue = totalITPower > 0
    ? (dc.pue > 0 ? dc.pue : (totalFacilityPower / totalITPower))
    : 1.0;

  const monthlyOperatingCost = monthlyPowerCost + totalCoolingCost + totalMaintenanceCost;
  const monthlyRevenue = dc.monthlyRevenue;
  const monthlyProfit = monthlyRevenue - monthlyOperatingCost;
  const profitMargin = monthlyRevenue > 0
    ? Math.round((monthlyProfit / monthlyRevenue) * 10000) / 100
    : 0;

  const annualROI = totalCost > 0
    ? Math.round(((monthlyProfit * 12) / totalCost) * 10000) / 100
    : 0;

  const paybackMonths = monthlyProfit > 0
    ? Math.ceil(totalCost / monthlyProfit)
    : Infinity;

  return {
    totalPower: totalITPower,
    totalCost,
    performanceScore,
    totalRows: dc.rows.length,
    totalRacks,
    totalServers,
    pue: Math.round(pue * 100) / 100,
    monthlyPowerCost: Math.round(monthlyPowerCost),
    monthlyCoolingCost: Math.round(totalCoolingCost),
    monthlyMaintenanceCost: Math.round(totalMaintenanceCost),
    monthlyOperatingCost: Math.round(monthlyOperatingCost),
    monthlyRevenue: Math.round(monthlyRevenue),
    monthlyProfit: Math.round(monthlyProfit),
    profitMargin,
    annualROI,
    paybackMonths,
  };
}

// ==================== Evaluation Functions ====================

/**
 * Evaluate a simulation result against a challenge's requirements.
 * Returns a score from 0-100.
 */
export function evaluateSimulation(
  result: SimulationResult,
  challenge: Challenge
): number {
  let score = 0;
  const maxScore = challenge.points;

  // Base score from the simulation's own score (0-100 scale)
  score += result.score * 0.4;

  // Budget bonus
  if (challenge.budget) {
    if (result.withinBudget) {
      score += 20;
      // Extra points for being well under budget
      const budgetUsage = result.totalCost / challenge.budget;
      if (budgetUsage < 0.8) score += 10;
    }
  } else {
    score += 20; // No budget requirement, free points
  }

  // Requirements met bonus
  if (result.meetsRequirements) {
    score += 20;
  }

  // Profitability bonus
  if (result.profitability > 0) {
    score += 10;
    if (result.profitability > 5000) score += 5;
    if (result.profitability > 10000) score += 5;
  }

  // Cap at 100 and scale to challenge points
  score = Math.min(100, Math.max(0, score));
  return Math.round((score / 100) * maxScore);
}

/**
 * Check if a motherboard configuration can handle a given workload.
 */
export function checkWorkloadCompatibility(
  motherboard: Motherboard,
  workload: Workload
): { compatible: boolean; missing: string[] } {
  const missing: string[] = [];
  const stats = calculateMotherboardStats(motherboard);

  // Check CPU cores
  const cpuCores = motherboard.cpu?.cores ?? 0;
  if (cpuCores < workload.requiredCPUCores) {
    missing.push(
      `Need ${workload.requiredCPUCores} CPU cores, have ${cpuCores}`
    );
  }

  // Check RAM
  if (stats.totalRAM < workload.requiredRAM) {
    missing.push(
      `Need ${workload.requiredRAM}GB RAM, have ${stats.totalRAM}GB`
    );
  }

  // Check storage
  if (stats.totalStorage < workload.requiredStorage) {
    missing.push(
      `Need ${workload.requiredStorage}TB storage, have ${stats.totalStorage}TB`
    );
  }

  // Check GPU
  if (workload.requiredGPU && !motherboard.gpu) {
    missing.push(`This workload requires a GPU`);
  }

  // Check GPU VRAM
  if (workload.requiredGPUVRAM && motherboard.gpu) {
    if (motherboard.gpu.vram < workload.requiredGPUVRAM) {
      missing.push(
        `Need ${workload.requiredGPUVRAM}GB GPU VRAM, have ${motherboard.gpu.vram}GB`
      );
    }
  }

  // Check network bandwidth
  const networkSpeed = motherboard.networkCard?.speed ?? 0;
  if (networkSpeed < workload.networkBandwidth) {
    missing.push(
      `Need ${workload.networkBandwidth}Gbps network, have ${networkSpeed}Gbps`
    );
  }

  return {
    compatible: missing.length === 0,
    missing,
  };
}

/**
 * Check if a server can handle a given workload (checks across all motherboards).
 */
export function checkServerWorkloadCompatibility(
  server: Server,
  workload: Workload
): { compatible: boolean; missing: string[] } {
  const stats = calculateServerStats(server);
  const missing: string[] = [];

  if (stats.totalCPUCores < workload.requiredCPUCores) {
    missing.push(
      `Need ${workload.requiredCPUCores} CPU cores, have ${stats.totalCPUCores}`
    );
  }

  if (stats.totalRAM < workload.requiredRAM) {
    missing.push(
      `Need ${workload.requiredRAM}GB RAM, have ${stats.totalRAM}GB`
    );
  }

  if (stats.totalStorage < workload.requiredStorage) {
    missing.push(
      `Need ${workload.requiredStorage}TB storage, have ${stats.totalStorage}TB`
    );
  }

  if (workload.requiredGPU && !stats.hasGPU) {
    missing.push(`This workload requires a GPU`);
  }

  if (workload.requiredGPUVRAM && stats.maxGPUVRAM < workload.requiredGPUVRAM) {
    missing.push(
      `Need ${workload.requiredGPUVRAM}GB GPU VRAM, have ${stats.maxGPUVRAM}GB`
    );
  }

  if (stats.networkSpeed < workload.networkBandwidth) {
    missing.push(
      `Need ${workload.networkBandwidth}Gbps network, have ${stats.networkSpeed}Gbps`
    );
  }

  return {
    compatible: missing.length === 0,
    missing,
  };
}

/**
 * Generate helpful, kid-friendly feedback strings based on a simulation result.
 */
export function generateFeedback(result: SimulationResult): string[] {
  const feedback: string[] = [];

  // Cost feedback
  if (result.totalCost < 1000) {
    feedback.push('Super budget-friendly build! You are saving serious cash.');
  } else if (result.totalCost > 50000) {
    feedback.push('Whoa, big spender! Make sure that investment pays off with enough revenue.');
  }

  // Power feedback
  if (result.totalPower < 500) {
    feedback.push('Very low power consumption! Mother Earth gives you a high-five.');
  } else if (result.totalPower > 10000) {
    feedback.push('That is a LOT of power! Make sure your cooling can handle the heat.');
  }

  // Performance feedback
  if (result.performanceScore >= 90) {
    feedback.push('Beast mode activated! This build is an absolute powerhouse.');
  } else if (result.performanceScore >= 70) {
    feedback.push('Solid performance! This can handle most workloads with ease.');
  } else if (result.performanceScore >= 40) {
    feedback.push('Decent performance. Good enough for basic workloads, but might struggle with heavy stuff.');
  } else {
    feedback.push('Performance is on the low side. Consider upgrading your CPU or adding more RAM.');
  }

  // Profitability feedback
  if (result.profitability > 10000) {
    feedback.push('Ka-ching! Your data center is a money-making machine!');
  } else if (result.profitability > 0) {
    feedback.push('You are in the green! Making profit is the name of the game.');
  } else if (result.profitability === 0) {
    feedback.push('Breaking even. Not bad, but there is room to grow.');
  } else {
    feedback.push('You are losing money each month. Try cutting costs or adding more revenue-generating workloads.');
  }

  // Budget feedback
  if (result.withinBudget) {
    feedback.push('Nice work staying within budget! A good data center manager watches every dollar.');
  } else {
    feedback.push('Oops, you went over budget! Try swapping some premium parts for budget options.');
  }

  // Requirements feedback
  if (result.meetsRequirements) {
    feedback.push('All requirements met! Your configuration checks all the boxes.');
  } else {
    feedback.push('Some requirements are not met. Check the workload needs and adjust your build.');
  }

  return feedback;
}

// ==================== Helper Functions ====================

/**
 * Calculate monthly power cost in dollars.
 * Power (watts) * hours/month / 1000 (to kW) * cost per kWh
 */
export function calculateMonthlyPowerCost(watts: number): number {
  const kWh = (watts * HOURS_PER_MONTH) / 1000;
  return Math.round(kWh * ELECTRICITY_COST_PER_KWH * 100) / 100;
}

/**
 * Calculate monthly operating costs for a given power load.
 * Includes power, cooling (estimated), and maintenance.
 */
export function calculateMonthlyOperatingCosts(
  totalPowerWatts: number,
  serverCount: number,
  coolingCostOverride?: number
): { power: number; cooling: number; maintenance: number; total: number } {
  const power = calculateMonthlyPowerCost(totalPowerWatts);
  const cooling = coolingCostOverride ?? Math.round(power * COOLING_COST_MULTIPLIER);
  const maintenance = serverCount * MAINTENANCE_PER_SERVER;
  const total = power + cooling + maintenance;

  return { power, cooling, maintenance, total };
}

/**
 * Calculate monthly revenue based on workloads a configuration can serve.
 * Each compatible workload adds its revenuePerMonth.
 */
export function calculateMonthlyRevenue(
  server: Server,
  availableWorkloads: Workload[]
): { totalRevenue: number; servedWorkloads: Workload[] } {
  const servedWorkloads: Workload[] = [];
  let totalRevenue = 0;

  for (const workload of availableWorkloads) {
    const { compatible } = checkServerWorkloadCompatibility(server, workload);
    if (compatible) {
      servedWorkloads.push(workload);
      totalRevenue += workload.revenuePerMonth;
    }
  }

  return { totalRevenue, servedWorkloads };
}

/**
 * Convert a form factor string (e.g., "1U", "2U", "4U") to rack units.
 */
export function formFactorToUnits(formFactor: string): number {
  const match = formFactor.match(/(\d+)/);
  return match ? parseInt(match[1], 10) : 1;
}

/**
 * Calculate BTU cooling requirement from watts.
 */
export function wattsToBTU(watts: number): number {
  return Math.round(watts * WATTS_TO_BTU);
}

/**
 * Create an empty motherboard with the given slot configuration.
 */
export function createEmptyMotherboard(
  ramSlots = 4,
  storageSlots = 4
): Motherboard {
  return {
    cpu: null,
    ram: [],
    storage: [],
    gpu: null,
    networkCard: null,
    powerSupply: null,
    ramSlots,
    storageSlots,
  };
}

/**
 * Create an empty server with the given form factor.
 */
export function createEmptyServer(
  id: string,
  name: string,
  formFactor = '1U'
): Server {
  const maxMotherboards = formFactor === '4U' ? 4 : formFactor === '2U' ? 2 : 1;

  return {
    id,
    name,
    motherboards: [],
    formFactor,
    maxMotherboards,
    totalPower: 0,
    totalCost: 0,
    performanceScore: 0,
  };
}

/**
 * Create an empty rack.
 */
export function createEmptyRack(id: string, name: string, maxUnits = 42): Rack {
  return {
    id,
    name,
    servers: [],
    maxUnits,
    currentUnits: 0,
    totalPower: 0,
    totalCost: 0,
    coolingRequired: 0,
  };
}

/**
 * Create an empty row.
 */
export function createEmptyRow(
  id: string,
  name: string,
  maxRacks = 10,
  coolingSystem = 'Basic Air Cooling'
): Row {
  return {
    id,
    name,
    racks: [],
    maxRacks,
    totalPower: 0,
    totalCost: 0,
    coolingSystem,
    coolingCost: 0,
  };
}

/**
 * Create an empty data center.
 */
export function createEmptyDataCenter(id: string, name: string): DataCenter {
  return {
    id,
    name,
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

// ==================== Scoring helpers for Day 3 & 4 pages ====================

export function calculateRackScore(
  usedUnits: number,
  maxUnits: number,
  totalPower: number,
  totalCost: number,
  monthlyRevenue: number,
  budget: number,
): SimulationResult {
  const utilization = usedUnits / maxUnits;
  const powerEfficiency = totalPower > 0 ? Math.min(1, 15000 / totalPower) : 0;
  const profitability = monthlyRevenue - (totalPower * 0.12);
  const withinBudget = totalCost <= budget;

  const utilizationScore = Math.round(utilization * 30);
  const efficiencyScore = Math.round(powerEfficiency * 25);
  const profitScore = profitability > 0 ? Math.min(25, Math.round((profitability / 10000) * 25)) : 0;
  const budgetScore = withinBudget ? 20 : 5;

  const score = utilizationScore + efficiencyScore + profitScore + budgetScore;

  const feedback: string[] = [];
  if (utilization < 0.5) feedback.push('Try to use more of your rack space!');
  if (utilization > 0.9) feedback.push('Great rack utilization!');
  if (profitability <= 0) feedback.push('Your rack is not profitable yet. Add revenue-generating servers!');
  if (profitability > 5000) feedback.push('Nice profit margin!');
  if (!withinBudget) feedback.push('You went over budget!');
  if (totalPower > 20000) feedback.push('Warning: Very high power consumption!');

  return {
    totalCost,
    totalPower,
    performanceScore: score,
    profitability,
    withinBudget,
    meetsRequirements: usedUnits > 0 && withinBudget,
    score,
    feedback,
  };
}

export function calculateRowScore(
  rackCount: number,
  totalPower: number,
  monthlyCosts: number,
  monthlyRevenue: number,
  pue: number,
  uptime: number,
): SimulationResult {
  const profit = monthlyRevenue - monthlyCosts;
  const profitMargin = monthlyRevenue > 0 ? (profit / monthlyRevenue) * 100 : 0;

  const rackScore = Math.min(20, rackCount * 3);
  const pueScore = pue <= 1.2 ? 25 : pue <= 1.5 ? 20 : pue <= 2.0 ? 10 : 5;
  const uptimeScore = uptime >= 99.99 ? 25 : uptime >= 99.9 ? 20 : uptime >= 99 ? 10 : 5;
  const profitScore = profit > 0 ? Math.min(30, Math.round((profitMargin / 50) * 30)) : 0;

  const score = rackScore + pueScore + uptimeScore + profitScore;

  const feedback: string[] = [];
  if (rackCount < 4) feedback.push('Add more racks to your row!');
  if (pue > 1.5) feedback.push('Your PUE is high — consider better cooling.');
  if (pue <= 1.2) feedback.push('Excellent PUE! Very efficient.');
  if (profit <= 0) feedback.push('Your row is not profitable. Check costs vs revenue.');
  if (profitMargin > 30) feedback.push('Amazing profit margin!');
  if (uptime >= 99.99) feedback.push('Top-tier uptime with 2N redundancy!');

  return {
    totalCost: monthlyCosts,
    totalPower,
    performanceScore: score,
    profitability: profit,
    withinBudget: true,
    meetsRequirements: rackCount >= 4 && profit > 0,
    score,
    feedback,
  };
}

// ==================== Vedic Math Tips ====================

export interface VedicTip {
  title: string;
  description: string;
  example: string;
}

export function getVedicCoolingTip(watts: number): VedicTip {
  return {
    title: 'Vedic Math: Quick BTU Calculation',
    description: 'To convert watts to BTU, multiply by 3.41. Vedic shortcut: multiply by 3, then add ~14% (or ~1/7).',
    example: `${watts}W × 3 = ${watts * 3}, then add ~${Math.round(watts * 3 / 7)} = ~${Math.round(watts * 3 + watts * 3 / 7)} BTU/hr (actual: ${Math.round(watts * 3.41)} BTU/hr)`,
  };
}

export function getVedicProfitTip(revenue: number, cost: number): VedicTip {
  const profit = revenue - cost;
  const margin = revenue > 0 ? ((profit / revenue) * 100) : 0;
  return {
    title: 'Vedic Math: Quick Profit Margin',
    description: 'Profit margin = (Revenue - Cost) / Revenue × 100. Vedic shortcut: find what fraction cost is of revenue, subtract from 100%.',
    example: `Revenue $${revenue.toLocaleString()} - Cost $${cost.toLocaleString()} = $${profit.toLocaleString()} profit (${margin.toFixed(1)}% margin)`,
  };
}
