import type { ScheduleBlock } from "@/lib/types";

/**
 * OPTIONAL advanced curriculum. These blocks are NOT in the standard 8-hour
 * schedule — they're shown in the Teacher Dashboard's "Advanced Mode" tab so
 * teachers can insert them based on class level (older students, accelerated
 * programs, or kids who want to go deeper into OpEx/TCO topics).
 *
 * Each block reuses the same ScheduleBlock structure so all the existing
 * teacher guide rendering components work without changes.
 */

const day3Advanced: ScheduleBlock[] = [
  {
    id: "adv-d3-tco",
    dayNumber: 3,
    type: "activity",
    title: "The 3-Year Reality Check",
    subtitle: "Fast-forward your rack — see what REALLY costs money",
    startTime: "—",
    durationMinutes: 45,
    icon: "⏩",
    content: {
      existingComponent: "demo-advanced",
      narrative: [
        "You built a rack yesterday. Cheap HDDs looked like a steal at $50 each.",
        "Now fast-forward 3 years. HDDs fail at 2% per year. Across 100 drives, that's 6 failures — replacement cost? $300 + shipping + labor.",
        "Meanwhile, the 'expensive' enterprise SSDs at $300 each had a 0.5% failure rate. Only 1.5 drives failed in 3 years. Replacement cost? $450.",
        "Plus: support contracts on failing HDDs are HIGHER because vendors know they break. Total 3-year TCO of HDDs often exceeds SSDs.",
      ],
      keyConcepts: [
        { term: "TCO (Total Cost of Ownership)", definition: "Hardware + power + failures + support + downtime over the full lifecycle", analogy: "Like buying a car — sticker price is only ~40% of what you'll actually spend over 5 years", realWorldExample: "AWS publishes TCO calculators because it's the #1 CFO question" },
        { term: "Replacement Cost", definition: "Price of the failed part + shipping + labor to install", analogy: "Your phone screen repair isn't just the glass — it's also the technician's time", realWorldExample: "Enterprise server replacement costs are 1.5-2x the component price" },
      ],
      discussionPrompts: [
        "Would you rather save $250 upfront or avoid 6 failures over 3 years?",
        "Why do enterprise vendors charge more — what are you actually buying?",
      ],
    },
    teacherGuide: {
      talkingPoints: [
        "Open /demo-advanced on the projector — walk through the Bank Database challenge",
        "Show how picking cheap HDDs drives up failures + support costs",
        "Demonstrate: enterprise SSDs look expensive but win on 3-year TCO",
        "Have students compute: annual failure rate × replacement cost × 3 years",
        "Real-world tie: Netflix only uses enterprise-grade storage — the failures would bankrupt them",
      ],
      probingQuestions: [
        "If your rack has 50 HDDs at 2% AFR, how many failures per year?",
        "What if the vendor takes 48 hours to ship replacements — how much downtime cost?",
        "Is it worth spending 2x upfront to reduce failures by 75%?",
      ],
      commonMisconceptions: [
        "Cheap = better value — WRONG for infrastructure where reliability matters",
        "Support contracts are a scam — wrong, they're insurance with a clear ROI",
      ],
      differentiationTips: {
        struggling: "Start with 2 scenarios: cheap HDD vs enterprise SSD. Compute 3-year cost together.",
        advanced: "Factor in the time value of money — is $100 today worth more than $100 in 3 years?",
      },
      slidesBullets: [
        "Sticker price is only ~40% of true cost",
        "HDDs: cheap but fail often",
        "Enterprise SSDs: expensive but reliable",
        "Annual Failure Rate × Replacement Cost × 3 = real cost",
        "Use /demo-advanced to see it live",
      ],
      timerMinutes: 45,
    },
  },
];

const day4Advanced: ScheduleBlock[] = [
  {
    id: "adv-d4-support",
    dayNumber: 4,
    type: "activity",
    title: "Support Tier Decision",
    subtitle: "Match support contracts to workload criticality",
    startTime: "—",
    durationMinutes: 40,
    icon: "🛡️",
    content: {
      existingComponent: "demo-advanced",
      narrative: [
        "A bank's database goes down at 3 AM. Every minute offline costs $1,000 in blocked transactions.",
        "Basic support responds in 48 hours. At $1,000/hour that's $48,000 of losses — plus reputation damage.",
        "Standard support responds in 8 hours. Losses: $8,000.",
        "Premium support responds in 1 hour. Losses: $1,000.",
        "Premium costs $2,000/year more than Basic. For a bank, it pays for itself the first outage.",
        "But for your personal blog? Basic is fine — you can tolerate 2 days of downtime.",
      ],
      keyConcepts: [
        { term: "SLA (Service Level Agreement)", definition: "A contract guaranteeing a specific response time or uptime", analogy: "Like ordering pizza delivery with a '30 min or free' promise", realWorldExample: "AWS guarantees 99.99% uptime for most services" },
        { term: "Support Tier", definition: "Level of vendor response — Basic/Standard/Premium", analogy: "Airline classes — economy, business, first. You pay for speed", realWorldExample: "Oracle charges 22% of license cost for Premium support" },
      ],
      discussionPrompts: [
        "When is paying 5x for Premium support worth it?",
        "What workload in YOUR life would need Premium support?",
      ],
    },
    teacherGuide: {
      talkingPoints: [
        "Open /demo-advanced — run the Bank Database challenge with Basic support, then Premium",
        "Show how the TCO bar changes when you upgrade support tier",
        "Real stories: Equifax breach cost $1.7B — partly due to slow patching response",
        "Ask students: 'What's your phone plan like? Basic, standard, or premium?'",
      ],
      probingQuestions: [
        "Would you pay $2K/year more for 1-hour response? When?",
        "What workloads could survive with Basic support?",
      ],
      commonMisconceptions: [
        "Premium support is always worth it — NO, only for critical systems",
        "Response time = fix time — NO, response is when they START helping",
      ],
      differentiationTips: {
        struggling: "Give them 3 workloads (blog, game server, bank). Ask which needs which tier.",
        advanced: "Compute: at what downtime cost does Premium become cheaper than Basic?",
      },
      slidesBullets: [
        "Support tier = insurance",
        "Critical = Premium (1 hr response)",
        "Balanced = Standard (8 hr)",
        "Low-priority = Basic (48 hr)",
        "Match tier to downtime cost!",
      ],
      timerMinutes: 40,
    },
  },
  {
    id: "adv-d4-mtbf",
    dayNumber: 4,
    type: "vedic-workshop",
    title: "MTBF Math Workshop",
    subtitle: "Calculate failure rates in your head",
    startTime: "—",
    durationMinutes: 25,
    icon: "📐",
    content: {
      narrative: [
        "MTBF (Mean Time Between Failures) is measured in HOURS. Modern enterprise drives: 2 million hours.",
        "Annual Failure Rate (AFR) = 8760 hours / MTBF × 100%. Example: 8760 / 2,000,000 = 0.438% per year.",
        "That means per 1000 drives, you expect 4.38 failures per year.",
        "Vedic shortcut: divide 8760 by the MTBF (in thousands) — gives AFR in percent. 8760 / 2000 = 4.38 per thousand.",
      ],
    },
    teacherGuide: {
      talkingPoints: [
        "Practice problems: HDDs 1M hrs, SSDs 1.5M hrs, enterprise SSDs 2M hrs, CPUs 3M hrs",
        "Compute AFR for each and compare",
        "Real drive: Backblaze publishes their 200,000+ drive failure data annually",
        "Vedic shortcut: 8760 / MTBF(in millions) = failures per million drives per year",
      ],
      probingQuestions: [
        "If your data center has 10,000 drives at 2% AFR, how many failures per year?",
        "Which has more failures: 1000 enterprise SSDs or 100 consumer HDDs?",
      ],
      differentiationTips: {
        struggling: "Pre-compute 8760 for them. Focus on the division.",
        advanced: "Introduce bathtub curve — drives fail MORE in year 1 and year 5+",
      },
      slidesBullets: [
        "MTBF = Mean Time Between Failures (hours)",
        "AFR = 8760 / MTBF × 100%",
        "8760 hours in a year",
        "Shortcut: 8760 / MTBF(millions) = AFR%",
        "2M hr MTBF → 0.44% AFR",
      ],
      timerMinutes: 20,
    },
  },
];

const day5Advanced: ScheduleBlock[] = [
  {
    id: "adv-d5-overprov",
    dayNumber: 5,
    type: "activity",
    title: "The Overprovisioning Trap",
    subtitle: "Bigger isn't better — right-sizing beats overbuilding",
    startTime: "—",
    durationMinutes: 45,
    icon: "⚠️",
    content: {
      existingComponent: "demo-advanced",
      narrative: [
        "The rookie mistake: 'I'll build 3x the capacity I need, just in case!'",
        "Result: You spent 3x on hardware, 3x on power, 3x on cooling, 3x on support. But you're only using 40%.",
        "Wasted CapEx: the money you overspent upfront.",
        "Wasted OpEx: the power, cooling, and maintenance you pay every month.",
        "Lost opportunity: the budget you could have used on something else.",
        "Real-world: AWS's biggest sell is 'pay only for what you use.' That's the solution to overprovisioning.",
      ],
      keyConcepts: [
        { term: "Right-Sizing", definition: "Matching capacity to actual demand — not maximum demand", analogy: "Like buying a car that fits your family, not a 12-seater just in case", realWorldExample: "Netflix scales compute up and down based on viewer count" },
        { term: "Utilization Rate", definition: "How much of your capacity is actually being used", analogy: "A restaurant with 100 seats but only 30 people is 30% utilized", realWorldExample: "Average data center utilization is only 15-20%!" },
      ],
      discussionPrompts: [
        "Have you ever bought something 'just in case' and regretted it?",
        "Why don't companies just always buy more than they need?",
      ],
    },
    teacherGuide: {
      talkingPoints: [
        "Open /demo-advanced — show a 50% over-provisioned build vs optimal",
        "Compute: how much profit was LOST due to unused capacity?",
        "Key insight: every watt of excess capacity = ~$3/year in power alone",
        "Counter-lesson: under-provisioning is WORSE — running at 95% causes failures",
        "Sweet spot: 60-80% utilization",
      ],
      probingQuestions: [
        "What's the right utilization target?",
        "How do you plan for peak traffic without always running at peak?",
      ],
      commonMisconceptions: [
        "More capacity = more profit — WRONG, excess capacity is dead money",
        "You should always plan for 10x peak — WRONG, that's prohibitively expensive",
      ],
      differentiationTips: {
        struggling: "Use the lemonade stand analogy — would you buy 100 lemons if you only sell 20?",
        advanced: "Introduce auto-scaling: 'pay per second' cloud billing",
      },
      slidesBullets: [
        "Right-sizing beats overbuilding",
        "Excess capacity = dead money",
        "Target utilization: 60-80%",
        "Every watt wasted = $$$/year",
        "AWS sells: 'pay for what you use'",
      ],
      timerMinutes: 45,
    },
  },
  {
    id: "adv-d5-opex-shark",
    dayNumber: 5,
    type: "show-and-tell",
    title: "OpEx Shark Tank — Investor Grilling",
    subtitle: "Pitch your data center to investors who CARE about TCO",
    startTime: "—",
    durationMinutes: 40,
    icon: "🦈",
    content: {
      presentationRules: [
        "Each student pitches their Shark Tank data center in 3 minutes",
        "Then: 2 minutes of investor questions focused on TCO",
        "Questions must include: 3-year TCO, profit margin, electricity cost assumptions, failure budget, support tier choice",
        "Investors (teacher + class) score on: TCO accuracy, realism, defensibility",
      ],
    },
    teacherGuide: {
      talkingPoints: [
        "Prep question bank: 'What's your 3-year TCO? If electricity rises 20%, are you still profitable?'",
        "Encourage students to use their OWN numbers from the /demo-advanced TCO breakdown",
        "Real investor questions: 'What's your payback period?' 'What are your unit economics?'",
        "Reward confidence + preparation — don't trap them, build them up",
      ],
      probingQuestions: [
        "What's your 3-year TCO? Is it profitable?",
        "What happens if your main vendor raises support costs 30%?",
        "How much power does your build use per dollar of revenue?",
        "What's the weakest component in your build? What's its failure rate?",
      ],
      commonMisconceptions: [
        "Investors care about revenue — they ALSO care about margins and risk",
        "A big number doesn't impress — a defensible number does",
      ],
      differentiationTips: {
        struggling: "Let them rehearse answers with a peer first",
        advanced: "Ask for NPV (net present value) or 5-year projections",
      },
      slidesBullets: [
        "🦈 OPEX SHARK TANK 🦈",
        "3-min pitch + 2-min grilling",
        "Investors grill you on TCO",
        "Know your numbers COLD",
        "Good luck — the Sharks are hungry!",
      ],
      timerMinutes: 35,
    },
  },
];

/**
 * Main export: advanced curriculum grouped by day number.
 * Days 1-2 don't have advanced content yet (concepts are still too foundational).
 */
export const advancedCurriculum: Record<number, ScheduleBlock[]> = {
  1: [],
  2: [],
  3: day3Advanced,
  4: day4Advanced,
  5: day5Advanced,
};

/** Total count of advanced blocks across all days */
export const advancedBlockCount = Object.values(advancedCurriculum).reduce((sum, blocks) => sum + blocks.length, 0);
