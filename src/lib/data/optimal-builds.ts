/**
 * Optimal Build Finder
 *
 * Brute-force search for the most profitable component combination that
 * satisfies a workload's requirements within a given budget. Used by the
 * demo results screen to show students what the ideal build would have been
 * and WHY it's better than theirs.
 *
 * Search space per workload: 6 CPUs × 6 RAMs × 6 Storages × 6 GPUs (5+none) × 5 NICs × 6 PSUs
 * = 38,880 combinations. Runs in ~15-30ms. Cached per workload+budget pair.
 */

import { cpus, rams, storages, gpus, networkCards, powerSupplies } from "./components";
import { workloads } from "./workloads";
import type { CPUSpec, RAMSpec, StorageSpec, GPUSpec, NetworkCard, PowerSupply, Workload } from "../types";

export interface BuildConfig {
  cpu: CPUSpec;
  ram: RAMSpec;        // Single stick for optimal search (kept simple)
  ramCount: number;    // How many sticks
  storage: StorageSpec;
  storageCount: number;
  gpu: GPUSpec | null;
  nic: NetworkCard;
  psu: PowerSupply;
}

export interface BuildMetrics {
  totalCost: number;
  totalPower: number;
  monthlyRevenue: number;
  amortizedMonthlyCost: number;   // Hardware cost spread over 36 months
  monthlyProfit: number;
  profitMargin: number;           // percentage
  paybackMonths: number;
  meetsRequirements: boolean;
}

export interface OptimalBuildResult {
  config: BuildConfig;
  metrics: BuildMetrics;
  reasoning: string[];            // Bullet points explaining why it wins
}

// Simple memo cache
const cache = new Map<string, OptimalBuildResult | null>();

function computePower(
  cpu: CPUSpec,
  ramCount: number,
  storageCount: number,
  gpu: GPUSpec | null,
  nicIncluded: boolean,
): number {
  let p = cpu.tdp;
  p += ramCount * 10;
  p += storageCount * 15;
  if (gpu) p += gpu.tdp;
  if (nicIncluded) p += 25;
  return p;
}

function computeCost(
  cpu: CPUSpec,
  ram: RAMSpec,
  ramCount: number,
  storage: StorageSpec,
  storageCount: number,
  gpu: GPUSpec | null,
  nic: NetworkCard,
  psu: PowerSupply,
): number {
  let c = cpu.price;
  c += ram.price * ramCount;
  c += storage.price * storageCount;
  if (gpu) c += gpu.price;
  c += nic.price;
  c += psu.price;
  return c;
}

function meetsRequirements(
  cpu: CPUSpec,
  ramTotal: number,
  storageTotal: number,
  gpu: GPUSpec | null,
  nic: NetworkCard,
  workload: Workload,
): boolean {
  if (cpu.cores < workload.requiredCPUCores) return false;
  if (ramTotal < workload.requiredRAM) return false;
  if (storageTotal < workload.requiredStorage) return false;
  if (workload.requiredGPU) {
    if (!gpu) return false;
    if ((workload.requiredGPUVRAM ?? 0) > gpu.vram) return false;
  }
  if (nic.speed < workload.networkBandwidth) return false;
  return true;
}

/**
 * Find the most profitable build that satisfies the workload.
 * Returns null if no valid build exists within budget.
 */
export function findOptimalBuild(workloadId: string, budget: number): OptimalBuildResult | null {
  const cacheKey = `${workloadId}-${budget}`;
  if (cache.has(cacheKey)) return cache.get(cacheKey)!;

  const workload = workloads.find((w) => w.id === workloadId);
  if (!workload) {
    cache.set(cacheKey, null);
    return null;
  }

  let best: { config: BuildConfig; metrics: BuildMetrics } | null = null;
  let bestProfit = -Infinity;

  const gpuOptions: (GPUSpec | null)[] = workload.requiredGPU ? [...gpus] : [null, ...gpus];

  for (const cpu of cpus) {
    if (cpu.cores < workload.requiredCPUCores) continue;

    for (const ram of rams) {
      // Try 1, 2, or 4 sticks to meet RAM requirement
      for (const ramCount of [1, 2, 4]) {
        const ramTotal = ram.capacity * ramCount;
        if (ramTotal < workload.requiredRAM) continue;

        for (const storage of storages) {
          // Try 1, 2, or 4 drives
          for (const storageCount of [1, 2, 4]) {
            const storageTotal = storage.capacity * storageCount;
            if (storageTotal < workload.requiredStorage) continue;

            for (const gpu of gpuOptions) {
              if (workload.requiredGPU && gpu) {
                if ((workload.requiredGPUVRAM ?? 0) > gpu.vram) continue;
              }

              for (const nic of networkCards) {
                if (nic.speed < workload.networkBandwidth) continue;

                // Find cheapest PSU that can handle the power draw
                const power = computePower(cpu, ramCount, storageCount, gpu, true);
                const validPsus = powerSupplies.filter((p) => p.wattage >= power);
                if (validPsus.length === 0) continue;

                const psu = validPsus.reduce((cheapest, p) =>
                  p.price < cheapest.price ? p : cheapest,
                );

                const cost = computeCost(cpu, ram, ramCount, storage, storageCount, gpu, nic, psu);
                if (cost > budget) continue;

                // Profit calculation: 3-year amortization
                const amortizedMonthlyCost = cost / 36;
                const monthlyProfit = workload.revenuePerMonth - amortizedMonthlyCost;

                if (monthlyProfit > bestProfit) {
                  bestProfit = monthlyProfit;
                  best = {
                    config: { cpu, ram, ramCount, storage, storageCount, gpu, nic, psu },
                    metrics: {
                      totalCost: cost,
                      totalPower: power,
                      monthlyRevenue: workload.revenuePerMonth,
                      amortizedMonthlyCost,
                      monthlyProfit,
                      profitMargin: (monthlyProfit / workload.revenuePerMonth) * 100,
                      paybackMonths: cost / Math.max(monthlyProfit, 1),
                      meetsRequirements: true,
                    },
                  };
                }
              }
            }
          }
        }
      }
    }
  }

  if (!best) {
    cache.set(cacheKey, null);
    return null;
  }

  const result: OptimalBuildResult = {
    config: best.config,
    metrics: best.metrics,
    reasoning: [], // filled in by generateReasoning when comparing
  };
  cache.set(cacheKey, result);
  return result;
}

/**
 * Compute metrics for a student's build (not guaranteed optimal).
 */
export function computeBuildMetrics(
  cpu: CPUSpec | null,
  ramSticks: RAMSpec[],
  storageDrives: StorageSpec[],
  gpu: GPUSpec | null,
  nic: NetworkCard | null,
  psu: PowerSupply | null,
  workloadId: string,
): BuildMetrics {
  const workload = workloads.find((w) => w.id === workloadId);
  if (!workload) {
    return {
      totalCost: 0, totalPower: 0, monthlyRevenue: 0, amortizedMonthlyCost: 0,
      monthlyProfit: 0, profitMargin: 0, paybackMonths: 0, meetsRequirements: false,
    };
  }

  let cost = 0;
  let power = 0;
  if (cpu) { cost += cpu.price; power += cpu.tdp; }
  cost += ramSticks.reduce((s, r) => s + r.price, 0);
  power += ramSticks.length * 10;
  cost += storageDrives.reduce((s, d) => s + d.price, 0);
  power += storageDrives.length * 15;
  if (gpu) { cost += gpu.price; power += gpu.tdp; }
  if (nic) { cost += nic.price; power += 25; }
  if (psu) cost += psu.price;

  const ramTotal = ramSticks.reduce((s, r) => s + r.capacity, 0);
  const storageTotal = storageDrives.reduce((s, d) => s + d.capacity, 0);
  const meets =
    !!cpu && cpu.cores >= workload.requiredCPUCores &&
    ramTotal >= workload.requiredRAM &&
    storageTotal >= workload.requiredStorage &&
    (!workload.requiredGPU || (!!gpu && (workload.requiredGPUVRAM ?? 0) <= gpu.vram)) &&
    !!nic && nic.speed >= workload.networkBandwidth;

  const amortizedMonthlyCost = cost / 36;
  const monthlyProfit = meets ? workload.revenuePerMonth - amortizedMonthlyCost : 0;

  return {
    totalCost: cost,
    totalPower: power,
    monthlyRevenue: meets ? workload.revenuePerMonth : 0,
    amortizedMonthlyCost,
    monthlyProfit,
    profitMargin: meets ? (monthlyProfit / workload.revenuePerMonth) * 100 : 0,
    paybackMonths: monthlyProfit > 0 ? cost / monthlyProfit : Infinity,
    meetsRequirements: meets,
  };
}

/**
 * Compare student build to optimal and generate human-readable reasoning.
 */
export function generateReasoning(
  studentCPU: CPUSpec | null,
  studentRam: RAMSpec[],
  studentStorage: StorageSpec[],
  studentGPU: GPUSpec | null,
  studentPSU: PowerSupply | null,
  optimal: BuildConfig,
  workloadId: string,
): string[] {
  const reasons: string[] = [];
  const workload = workloads.find((w) => w.id === workloadId);
  if (!workload) return reasons;

  // CPU comparison
  if (studentCPU && studentCPU.id !== optimal.cpu.id) {
    if (studentCPU.price > optimal.cpu.price && studentCPU.cores > workload.requiredCPUCores * 1.5) {
      reasons.push(`Your ${studentCPU.name} (${studentCPU.cores} cores, $${studentCPU.price}) had wasted cores — the workload only needs ${workload.requiredCPUCores}. The optimal ${optimal.cpu.name} saves $${studentCPU.price - optimal.cpu.price}.`);
    } else if (studentCPU.price < optimal.cpu.price) {
      reasons.push(`The optimal uses ${optimal.cpu.name} because ${studentCPU.name} is under-powered for max profit. Spending more upfront pays back through reliability.`);
    } else {
      reasons.push(`Optimal CPU: ${optimal.cpu.name} ($${optimal.cpu.price}) — better performance-per-dollar for this workload.`);
    }
  } else if (studentCPU && studentCPU.id === optimal.cpu.id) {
    reasons.push(`✓ You picked the optimal CPU (${optimal.cpu.name}).`);
  }

  // RAM comparison
  const studentRamTotal = studentRam.reduce((s, r) => s + r.capacity, 0);
  const optimalRamTotal = optimal.ram.capacity * optimal.ramCount;
  if (studentRamTotal > optimalRamTotal * 1.5) {
    reasons.push(`You installed ${studentRamTotal}GB of RAM — the workload only needs ${workload.requiredRAM}GB. Optimal: ${optimalRamTotal}GB saves money without hurting performance.`);
  } else if (studentRamTotal < workload.requiredRAM) {
    reasons.push(`You had only ${studentRamTotal}GB of RAM — workload needs ${workload.requiredRAM}GB minimum. The optimal uses ${optimal.ramCount}× ${optimal.ram.name} = ${optimalRamTotal}GB.`);
  } else if (studentRamTotal === optimalRamTotal) {
    reasons.push(`✓ Your RAM sizing is optimal.`);
  }

  // GPU comparison
  if (workload.requiredGPU) {
    if (!studentGPU) {
      reasons.push(`You forgot the GPU! This workload REQUIRES a GPU with ${workload.requiredGPUVRAM}GB VRAM.`);
    } else if (studentGPU.price > optimal.gpu!.price && studentGPU.vram > (workload.requiredGPUVRAM ?? 0) * 1.5) {
      reasons.push(`Your ${studentGPU.name} ($${studentGPU.price.toLocaleString()}) is overkill. Optimal: ${optimal.gpu!.name} ($${optimal.gpu!.price.toLocaleString()}) — same job, saves $${(studentGPU.price - optimal.gpu!.price).toLocaleString()}.`);
    }
  } else if (studentGPU) {
    reasons.push(`Your ${studentGPU.name} costs $${studentGPU.price.toLocaleString()} but this workload doesn't need a GPU. That's wasted money!`);
  }

  // Storage comparison
  const studentStorageTotal = studentStorage.reduce((s, d) => s + d.capacity, 0);
  const studentStorageCost = studentStorage.reduce((s, d) => s + d.price, 0);
  const optimalStorageCost = optimal.storage.price * optimal.storageCount;
  if (studentStorageCost > optimalStorageCost * 1.3 && studentStorageTotal > workload.requiredStorage * 1.5) {
    reasons.push(`Your storage cost $${studentStorageCost} — optimal is $${optimalStorageCost}. You over-provisioned capacity.`);
  }

  // PSU comparison
  if (studentPSU && optimal.psu && studentPSU.id !== optimal.psu.id) {
    if (studentPSU.wattage > optimal.psu.wattage * 1.5) {
      reasons.push(`Your ${studentPSU.name} (${studentPSU.wattage}W) has too much headroom. Optimal: ${optimal.psu.name} (${optimal.psu.wattage}W) — cheaper and sufficient.`);
    }
  }

  if (reasons.length === 0) {
    reasons.push(`Your build is close to optimal — nice work! The optimal saved a few dollars on minor component choices.`);
  }

  return reasons;
}

/**
 * New profitability-aware scoring.
 * Returns a score 0-100 based on multiple factors.
 */
export interface ScoreBreakdown {
  total: number;
  requirementsMet: number;      // 20
  bootSuccess: number;           // 10
  costEfficiency: number;        // 25
  rightSizing: number;           // 20
  powerEfficiency: number;       // 10
  profitMargin: number;          // 15
}

export function computeProfitabilityScore(
  studentMetrics: BuildMetrics,
  optimalMetrics: BuildMetrics | null,
  bootSuccess: boolean,
): ScoreBreakdown {
  let requirementsMet = 0;
  let bootSuccessPts = 0;
  let costEfficiency = 0;
  let rightSizing = 0;
  let powerEfficiency = 0;
  let profitMarginPts = 0;

  // Requirements (20 pts)
  if (studentMetrics.meetsRequirements) requirementsMet = 20;

  // Boot success (10 pts)
  if (bootSuccess) bootSuccessPts = 10;

  // Only give efficiency scores if build actually works
  if (studentMetrics.meetsRequirements && optimalMetrics) {
    // Cost efficiency (25 pts) — how close to optimal cost?
    const costRatio = optimalMetrics.totalCost / Math.max(studentMetrics.totalCost, 1);
    costEfficiency = Math.round(Math.max(0, Math.min(25, costRatio * 25)));

    // Right-sizing (20 pts) — penalty for power overhead vs optimal
    const powerRatio = optimalMetrics.totalPower / Math.max(studentMetrics.totalPower, 1);
    rightSizing = Math.round(Math.max(0, Math.min(20, powerRatio * 20)));

    // Power efficiency (10 pts) — lower watts = better
    if (studentMetrics.totalPower <= optimalMetrics.totalPower * 1.1) powerEfficiency = 10;
    else if (studentMetrics.totalPower <= optimalMetrics.totalPower * 1.3) powerEfficiency = 7;
    else if (studentMetrics.totalPower <= optimalMetrics.totalPower * 1.5) powerEfficiency = 4;
    else powerEfficiency = 1;

    // Profit margin (15 pts) — 0% = 0 pts, >=30% = 15 pts
    profitMarginPts = Math.round(Math.max(0, Math.min(15, (studentMetrics.profitMargin / 30) * 15)));
  }

  const total = requirementsMet + bootSuccessPts + costEfficiency + rightSizing + powerEfficiency + profitMarginPts;

  return {
    total,
    requirementsMet,
    bootSuccess: bootSuccessPts,
    costEfficiency,
    rightSizing,
    powerEfficiency,
    profitMargin: profitMarginPts,
  };
}

export function rankFromScore(score: number): { rank: string; emoji: string; color: string } {
  if (score >= 90) return { rank: "Data Center Architect", emoji: "🏆", color: "text-amber-400" };
  if (score >= 75) return { rank: "Hardware Pro", emoji: "⭐", color: "text-emerald-400" };
  if (score >= 60) return { rank: "Apprentice Builder", emoji: "📚", color: "text-blue-400" };
  return { rank: "Keep Practicing", emoji: "🌱", color: "text-slate-400" };
}
