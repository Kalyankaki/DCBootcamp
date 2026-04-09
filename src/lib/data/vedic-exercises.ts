import type { VedicExercise } from "@/lib/types";

/** Per-day Vedic math exercises tied to data center scenarios. */
export const vedicExercises: Record<number, VedicExercise[]> = {
  1: [
    { id: "v1-1", type: "quickMultiply", problemText: "A CPU costs $97 and you need 96 of them. What's the total?", numbers: [97, 96], context: "Bulk CPU ordering for a server farm", difficulty: "medium" },
    { id: "v1-2", type: "percentageOf", problemText: "Your $5,000 budget just got a 15% discount. How much do you save?", numbers: [15, 5000], context: "Component bulk discount", difficulty: "easy" },
    { id: "v1-3", type: "quickMultiply", problemText: "Each RAM stick costs $105. You need 104 sticks. Total cost?", numbers: [105, 104], context: "RAM for a server cluster", difficulty: "medium" },
    { id: "v1-4", type: "percentageOf", problemText: "A $350 CPU uses 25% of its power at idle. How many watts at idle if TDP is 200W?", numbers: [25, 200], context: "Idle power calculation", difficulty: "easy" },
    { id: "v1-5", type: "digitSum", problemText: "Verify: 23 servers × 47 RAM sticks = 1,081 total sticks. Is that right?", numbers: [23, 47, 1081], context: "Inventory check", difficulty: "medium" },
    { id: "v1-6", type: "quickMultiply", problemText: "Storage drives cost $98 each. You're buying 95. Total?", numbers: [98, 95], context: "SSD bulk purchase", difficulty: "medium" },
  ],
  2: [
    { id: "v2-1", type: "quickMultiply", problemText: "A 1U server costs $2,000. How much for 99 of them?", numbers: [99, 2000], context: "Server fleet pricing", difficulty: "easy" },
    { id: "v2-2", type: "percentageOf", problemText: "RAID 5 has 20% storage overhead. How much space lost on 10TB?", numbers: [20, 10000], context: "RAID overhead calculation", difficulty: "easy" },
    { id: "v2-3", type: "crossMultiply", problemText: "Server A: $2,000 for 85 perf. Server B: $3,500 for 95 perf. Which is better value?", numbers: [2000, 85, 3500, 95], context: "Price-performance comparison", difficulty: "hard" },
    { id: "v2-4", type: "quickMultiply", problemText: "Each hot-swap drive bay costs $108. 96 bays needed. Total?", numbers: [108, 96], context: "Hot-swap bay pricing", difficulty: "medium" },
    { id: "v2-5", type: "percentageOf", problemText: "Server uptime is 99.9%. How many minutes of downtime per year? (525,600 min/year × 0.1%)", numbers: [0.1, 525600], context: "SLA downtime", difficulty: "hard" },
    { id: "v2-6", type: "digitSum", problemText: "Check: 48 servers × 32GB RAM each = 1,536GB total. Correct?", numbers: [48, 32, 1536], context: "Cluster memory total", difficulty: "easy" },
  ],
  3: [
    { id: "v3-1", type: "quickMultiply", problemText: "Each rack costs $3,500. You need 96 racks. Total investment?", numbers: [96, 3500], context: "Rack procurement", difficulty: "hard" },
    { id: "v3-2", type: "percentageOf", problemText: "A rack draws 10,000W. Cooling adds 30% overhead. Total power?", numbers: [30, 10000], context: "Cooling overhead", difficulty: "easy" },
    { id: "v3-3", type: "quickMultiply", problemText: "BTU conversion: 1 watt = 3.41 BTU/hr. A 5,000W rack produces how many BTU?", numbers: [5000, 341], context: "Cooling capacity planning (answer in BTU×100)", difficulty: "hard" },
    { id: "v3-4", type: "crossMultiply", problemText: "Rack A: $200K for 42 servers. Rack B: $150K for 30 servers. Better server-per-dollar?", numbers: [200000, 42, 150000, 30], context: "Rack density economics", difficulty: "medium" },
    { id: "v3-5", type: "percentageOf", problemText: "Electricity costs $0.10/kWh. A 20kW rack runs 24/7. Monthly cost? (720 hours × 20 × $0.10)", numbers: [10, 14400], context: "Monthly power bill", difficulty: "medium" },
    { id: "v3-6", type: "digitSum", problemText: "Verify: 42 servers × 450W each = 18,900W total. Right?", numbers: [42, 450, 18900], context: "Rack power budget", difficulty: "easy" },
  ],
  4: [
    { id: "v4-1", type: "quickMultiply", problemText: "N+1 redundancy costs $10,000/month. Over 98 months, total spend?", numbers: [98, 10000], context: "Redundancy ROI", difficulty: "medium" },
    { id: "v4-2", type: "percentageOf", problemText: "PUE of 1.5 means 50% overhead. If IT load is $50,000/month, what's total power cost?", numbers: [50, 50000], context: "PUE cost impact", difficulty: "easy" },
    { id: "v4-3", type: "crossMultiply", problemText: "Cooling A: $20K/mo, PUE 1.2. Cooling B: $10K/mo, PUE 1.5. Which saves more long-term?", numbers: [20000, 120, 10000, 150], context: "Cooling system comparison (cost per PUE point)", difficulty: "hard" },
    { id: "v4-4", type: "quickMultiply", problemText: "Your row has 10 racks at $95 each/month for monitoring. Annual cost?", numbers: [95, 120], context: "Monitoring contract", difficulty: "medium" },
    { id: "v4-5", type: "percentageOf", problemText: "99.99% uptime = 0.01% downtime. How many minutes per year? (525,600 min)", numbers: [0.01, 525600], context: "Five-nines planning", difficulty: "hard" },
  ],
  5: [
    { id: "v5-1", type: "quickMultiply", problemText: "Your DC earns $95,000/month revenue. Annual projection?", numbers: [95000, 12], context: "Shark Tank revenue pitch", difficulty: "easy" },
    { id: "v5-2", type: "percentageOf", problemText: "Revenue $100K, expenses $65K. What's the profit margin percentage?", numbers: [35, 100], context: "Profit margin for investors", difficulty: "easy" },
    { id: "v5-3", type: "crossMultiply", problemText: "Plan A: $500K investment, $15K/mo profit. Plan B: $300K, $8K/mo. Better ROI?", numbers: [500000, 15000, 300000, 8000], context: "Investment comparison", difficulty: "hard" },
    { id: "v5-4", type: "quickMultiply", problemText: "Payback period: $400K investment ÷ $8K monthly profit. Approximately how many months?", numbers: [400, 8], context: "Payback calculation", difficulty: "easy" },
    { id: "v5-5", type: "percentageOf", problemText: "Investors want 20% annual return on $500K. What's the minimum annual profit needed?", numbers: [20, 500000], context: "Investor expectations", difficulty: "medium" },
    { id: "v5-6", type: "digitSum", problemText: "Verify: Monthly OpEx $35,000 × 12 months = $420,000 annual. Correct?", numbers: [35000, 12, 420000], context: "Annual budget check", difficulty: "easy" },
  ],
};
