/** Energizer game configs for each day's after-lunch competition. */
export const energizers: Record<number, {
  gameName: string;
  type: string;
  description: string;
  rules: string[];
  teamBased: boolean;
  timeMinutes: number;
  scoringRules: string[];
}> = {
  1: {
    gameName: "Component Speed Round",
    type: "quiz-relay",
    description: "Teams race to identify computer components from descriptions! Teacher reads clues, teams buzz in with the answer. Fastest correct answer wins the point.",
    teamBased: true,
    timeMinutes: 20,
    rules: [
      "Split class into 2-4 teams",
      "Teacher reads a component description (e.g., 'I am the brain of the computer, I process all instructions')",
      "First team to raise hand and answer correctly gets 10 points",
      "Wrong answer = other teams can steal for 5 points",
      "Bonus round: Name the ANALOGY (e.g., 'The Desk' for RAM) for 15 points",
      "10 questions total, then tally scores",
    ],
    scoringRules: [
      "Correct answer: 10 pts",
      "Steal: 5 pts",
      "Analogy bonus: 15 pts",
      "Speed bonus: +5 pts if answered within 3 seconds",
    ],
  },
  2: {
    gameName: "Form Factor Bingo",
    type: "bingo",
    description: "Each student gets a bingo card with server specs. Teacher calls out requirements, students mark the matching form factor. First bingo wins!",
    teamBased: false,
    timeMinutes: 15,
    rules: [
      "Each student draws a 3×3 grid and fills in random specs: '1U', '2U', '4U', 'Hot-Swap', 'RAID 1', 'RAID 5', 'Redundant PSU', '2 motherboards', '4 motherboards'",
      "Teacher calls out scenarios: 'I need the most space-efficient server' (answer: 1U)",
      "Students mark matching squares",
      "First to get 3 in a row shouts 'SERVER ONLINE!'",
      "Winner explains WHY each square matches",
      "Play 2-3 rounds with reshuffled cards",
    ],
    scoringRules: [
      "First bingo: 50 pts",
      "Second bingo: 30 pts",
      "Correct explanation of each square: 5 pts each",
    ],
  },
  3: {
    gameName: "Rack Stacking Race",
    type: "team-challenge",
    description: "Teams compete to fill a 42U rack with the highest-revenue configuration under budget! Use the simulator on your screens — fastest optimal build wins.",
    teamBased: true,
    timeMinutes: 20,
    rules: [
      "Split into teams of 2-3",
      "Each team uses the Day 3 Build simulator",
      "Goal: Fill a 42U rack to maximize monthly revenue",
      "Budget: $200,000 (same as the regular challenge)",
      "Time limit: 10 minutes",
      "At the end, each team reports: Total Revenue, Power Draw, Units Used",
      "Best revenue-per-watt ratio wins",
    ],
    scoringRules: [
      "Highest monthly revenue: 50 pts",
      "Best revenue-per-watt: 30 pts",
      "Fully filled rack (42U): 20 pts",
      "Under budget bonus: 10 pts",
    ],
  },
  4: {
    gameName: "Uptime Showdown",
    type: "scenario-cards",
    description: "Disaster scenario cards! Each team draws a card describing a data center problem. They must choose the right redundancy level and justify their choice.",
    teamBased: true,
    timeMinutes: 25,
    rules: [
      "Teacher reads disaster scenarios one at a time",
      "Teams have 60 seconds to discuss and choose: N, N+1, or 2N redundancy",
      "Teams also estimate: How much downtime would occur? What's the cost of downtime?",
      "After all teams answer, teacher reveals the 'real-world' answer",
      "Scenarios include: power outage, network failure, cooling malfunction, server crash, natural disaster",
      "5 scenarios total",
    ],
    scoringRules: [
      "Correct redundancy level: 20 pts per scenario",
      "Downtime estimate within 50%: 10 pts",
      "Best justification (teacher's choice): 15 pts bonus",
    ],
  },
  5: {
    gameName: "Budget Bidding War",
    type: "auction",
    description: "Premium components go up for auction! Teams bid from their Shark Tank budget. Overbid and you waste money. Underbid and competitors get the advantage.",
    teamBased: true,
    timeMinutes: 20,
    rules: [
      "Each team starts with their Shark Tank budget allocation",
      "Teacher auctions 8 premium items: High-end GPU, Liquid Cooling System, 100Gbps Network, 2N Redundancy, Premium Storage Array, AI-Optimized CPU, Backup Generator, Smart PDU",
      "Teams write secret bids on paper",
      "Highest bid wins the item (deducted from budget)",
      "Items provide specific stat boosts for the final Shark Tank build",
      "Strategy: bid wisely — you need budget for other things too!",
      "If no team bids enough (minimum reserve price), item goes unsold",
    ],
    scoringRules: [
      "Each won item: specific stat boost for Shark Tank scoring",
      "Most items won: 20 pts bonus",
      "Lowest total spend on won items: 20 pts 'shrewd negotiator' bonus",
    ],
  },
};
