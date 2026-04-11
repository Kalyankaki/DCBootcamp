/**
 * Advanced reliability / support data for components.
 *
 * This lives in a separate file so the base components.ts stays simple for
 * the normal demo. Advanced mode imports this and merges it into component
 * data at runtime.
 *
 * Industry reference values (MTBF / AFR):
 *   - Enterprise SSDs: 2,000,000 hrs / 0.5% AFR
 *   - Consumer SSDs:   1,500,000 hrs / 1.5% AFR
 *   - HDDs:            1,000,000 hrs / 2.0% AFR
 *   - Server CPUs:     3,000,000 hrs / 0.3% AFR
 *   - GPUs:              500,000 hrs / 1.0% AFR (heat stress)
 *   - PSUs:              100,000 hrs / 3.0% AFR (most common failure!)
 */

import type { AdvancedSpec } from "../types";

// Typical support tiers for different component classes
function standardSupport(basePrice: number) {
  return {
    basic: { annualCost: Math.round(basePrice * 0.05), responseHours: 48 },
    standard: { annualCost: Math.round(basePrice * 0.12), responseHours: 8 },
    premium: { annualCost: Math.round(basePrice * 0.25), responseHours: 1 },
  };
}

export const cpuAdvanced: Record<string, AdvancedSpec> = {
  "cpu-1": { mtbfHours: 3000000, annualFailureRate: 0.003, replacementCost: 150, supportTiers: standardSupport(150) },
  "cpu-2": { mtbfHours: 3000000, annualFailureRate: 0.003, replacementCost: 350, supportTiers: standardSupport(350) },
  "cpu-3": { mtbfHours: 2500000, annualFailureRate: 0.004, replacementCost: 750, supportTiers: standardSupport(750) },
  "cpu-4": { mtbfHours: 2000000, annualFailureRate: 0.005, replacementCost: 3500, supportTiers: standardSupport(3500) },
  "cpu-5": { mtbfHours: 3500000, annualFailureRate: 0.002, replacementCost: 75, supportTiers: standardSupport(75) },
  "cpu-6": { mtbfHours: 2200000, annualFailureRate: 0.004, replacementCost: 1800, supportTiers: standardSupport(1800) },
};

export const storageAdvanced: Record<string, AdvancedSpec> = {
  "stor-1": { mtbfHours: 1000000, annualFailureRate: 0.020, replacementCost: 60, supportTiers: standardSupport(50) },   // HDD
  "stor-2": { mtbfHours: 1000000, annualFailureRate: 0.020, replacementCost: 170, supportTiers: standardSupport(150) }, // HDD
  "stor-3": { mtbfHours: 1500000, annualFailureRate: 0.015, replacementCost: 90, supportTiers: standardSupport(80) },   // consumer SSD
  "stor-4": { mtbfHours: 1500000, annualFailureRate: 0.015, replacementCost: 320, supportTiers: standardSupport(300) }, // consumer SSD
  "stor-5": { mtbfHours: 2000000, annualFailureRate: 0.005, replacementCost: 220, supportTiers: standardSupport(200) }, // enterprise NVMe
  "stor-6": { mtbfHours: 2000000, annualFailureRate: 0.005, replacementCost: 800, supportTiers: standardSupport(750) }, // enterprise NVMe
};

export const gpuAdvanced: Record<string, AdvancedSpec> = {
  "gpu-1": { mtbfHours: 500000, annualFailureRate: 0.012, replacementCost: 280, supportTiers: standardSupport(250) },
  "gpu-2": { mtbfHours: 500000, annualFailureRate: 0.010, replacementCost: 650, supportTiers: standardSupport(600) },
  "gpu-3": { mtbfHours: 600000, annualFailureRate: 0.008, replacementCost: 8500, supportTiers: standardSupport(8000) },
  "gpu-4": { mtbfHours: 600000, annualFailureRate: 0.008, replacementCost: 26000, supportTiers: standardSupport(25000) },
  "gpu-5": { mtbfHours: 550000, annualFailureRate: 0.010, replacementCost: 380, supportTiers: standardSupport(350) },
};

export const psuAdvanced: Record<string, AdvancedSpec> = {
  "psu-1": { mtbfHours: 100000, annualFailureRate: 0.030, replacementCost: 55, supportTiers: standardSupport(50) },
  "psu-2": { mtbfHours: 120000, annualFailureRate: 0.025, replacementCost: 90, supportTiers: standardSupport(85) },
  "psu-3": { mtbfHours: 150000, annualFailureRate: 0.020, replacementCost: 160, supportTiers: standardSupport(150) },
  "psu-4": { mtbfHours: 150000, annualFailureRate: 0.020, replacementCost: 260, supportTiers: standardSupport(250) },
  "psu-5": { mtbfHours: 200000, annualFailureRate: 0.015, replacementCost: 410, supportTiers: standardSupport(400) },
  "psu-6": { mtbfHours: 80000, annualFailureRate: 0.040, replacementCost: 35, supportTiers: standardSupport(30) },
};

export const ramAdvanced: Record<string, AdvancedSpec> = {
  "ram-1": { mtbfHours: 4000000, annualFailureRate: 0.001, replacementCost: 30, supportTiers: standardSupport(25) },
  "ram-2": { mtbfHours: 4000000, annualFailureRate: 0.001, replacementCost: 50, supportTiers: standardSupport(45) },
  "ram-3": { mtbfHours: 4500000, annualFailureRate: 0.001, replacementCost: 115, supportTiers: standardSupport(110) },
  "ram-4": { mtbfHours: 4500000, annualFailureRate: 0.001, replacementCost: 230, supportTiers: standardSupport(220) },
  "ram-5": { mtbfHours: 5000000, annualFailureRate: 0.0008, replacementCost: 460, supportTiers: standardSupport(450) },
  "ram-6": { mtbfHours: 3000000, annualFailureRate: 0.002, replacementCost: 15, supportTiers: standardSupport(12) },
};

// Workload criticality — downtime cost per hour & required uptime SLA
export const workloadAdvanced: Record<string, { downtimeCostPerHour: number; requiredUptime: number }> = {
  "wl-ai": { downtimeCostPerHour: 500, requiredUptime: 0.995 },         // research workload, less time-critical
  "wl-web": { downtimeCostPerHour: 200, requiredUptime: 0.999 },
  "wl-game": { downtimeCostPerHour: 1500, requiredUptime: 0.999 },      // players leave if laggy
  "wl-video": { downtimeCostPerHour: 2000, requiredUptime: 0.9995 },
  "wl-email": { downtimeCostPerHour: 100, requiredUptime: 0.999 },
  "wl-db": { downtimeCostPerHour: 5000, requiredUptime: 0.9999 },       // CRITICAL — banking
  "wl-cloud": { downtimeCostPerHour: 800, requiredUptime: 0.9995 },
  "wl-science": { downtimeCostPerHour: 300, requiredUptime: 0.99 },
  "wl-social": { downtimeCostPerHour: 3000, requiredUptime: 0.9999 },
  "wl-crypto": { downtimeCostPerHour: 150, requiredUptime: 0.99 },      // low priority
};

/**
 * TCO calculation for Advanced Mode.
 *
 * Hardware cost (one-time)
 * + 3 years of power @ $0.12/kWh
 * + 3 years of expected failures × replacement cost
 * + 3 years of support contract
 * + 3 years of downtime cost (based on failure probability)
 */
export interface TCOBreakdown {
  hardware: number;
  power: number;
  failures: number;
  support: number;
  downtime: number;
  total: number;
}

export interface TCOInput {
  hardwareCost: number;
  powerWatts: number;
  components: Array<{ advanced?: AdvancedSpec }>;
  supportTier: "basic" | "standard" | "premium";
  downtimeCostPerHour: number;
}

export function computeTCO(input: TCOInput): TCOBreakdown {
  const years = 3;
  const pricePerKwh = 0.12;

  // Power: watts × 24 × 365 × 3 years × $0.12/kWh
  const annualKwh = (input.powerWatts * 24 * 365) / 1000;
  const power = Math.round(annualKwh * pricePerKwh * years);

  // Failures: sum of (AFR × replacementCost) × years
  let failures = 0;
  let support = 0;
  let totalAFR = 0;
  for (const c of input.components) {
    if (!c.advanced) continue;
    failures += c.advanced.annualFailureRate * c.advanced.replacementCost * years;
    support += c.advanced.supportTiers[input.supportTier].annualCost * years;
    totalAFR += c.advanced.annualFailureRate;
  }
  failures = Math.round(failures);
  support = Math.round(support);

  // Downtime: expected failure events × mean response hours × downtime cost
  const responseHours = input.components[0]?.advanced?.supportTiers[input.supportTier].responseHours ?? 48;
  const expectedFailuresPerYear = totalAFR;
  const downtime = Math.round(expectedFailuresPerYear * responseHours * input.downtimeCostPerHour * years);

  return {
    hardware: input.hardwareCost,
    power,
    failures,
    support,
    downtime,
    total: input.hardwareCost + power + failures + support + downtime,
  };
}
