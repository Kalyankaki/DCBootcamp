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
        "The 3-Year Reality Check\nYesterday you built a rack based on price and specs. Today we check what happens over 3 years. Cheap components often cost MORE in the long run once you count failures, replacements, and support contracts.",
        "Sticker Price Is Only About 40% of True Cost\nHere's an uncomfortable fact from the real industry: the hardware purchase price is typically only 40% of the total cost over 3 years. The other 60% is power, failures, support contracts, and downtime. Most kids — and most adults — never think about this.",
        "HDDs: Cheap Upfront, Expensive Over Time\nA $50 hard drive fails at 2% per year. Across 100 drives in a rack, that's 6 failures in 3 years. Replacements plus shipping plus labor adds up fast. And hard drive vendors charge MORE for support because they know their drives break.",
        "Enterprise SSDs: Expensive Upfront, Cheaper Over Time\nA $300 enterprise SSD fails at 0.5% per year. Only 1.5 drives fail across 100 units in 3 years. Support contracts are cheaper because reliability is higher. The expensive option is often the cheaper option when you do the full math.",
        "The Formula: AFR × Replacement × 3\nTotal failure cost equals Annual Failure Rate times Replacement Cost times 3 years. This is one of the most important formulas in data center economics, and it completely changes which components look attractive.",
        "Use the Advanced Demo to See It Live\nOpen /demo-advanced on your screens. The Bank Database challenge lets you compare cheap-and-cheerful versus expensive-and-reliable builds. Watch the TCO bar change as you swap components. It's eye-opening.",
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
        "Support Tier Decision — A Real Business Skill\nWhen you buy infrastructure components, you also buy a support contract. There are usually three tiers — Basic, Standard, and Premium. Picking the right tier for each workload is one of the most important cost decisions in running a data center.",
        "Support Tier Is Insurance\nThink of support tiers like insurance. Cheap insurance has slow response. Expensive insurance has fast response. Nobody buys the most expensive insurance for everything — that's wasteful. But nobody skips insurance on critical assets either. You match it to what you're protecting.",
        "Premium: One-Hour Response\nPremium support guarantees a vendor expert on the line within 1 hour, any time of day. Costs about 25% of hardware price per year. Use it for critical workloads where downtime costs thousands per hour — banks, hospitals, stock exchanges.",
        "Standard: Eight-Hour Response\nStandard support guarantees response within 8 hours — enough time to handle an overnight issue before the business day starts. Costs about 12% of hardware per year. Good default for most business servers.",
        "Basic: Forty-Eight-Hour Response\nBasic support guarantees response within 2 days. Costs about 5% of hardware per year. Fine for low-priority workloads where the business can tolerate 2 days of degraded service — internal tools, backups, testing environments.",
        "Match Tier to Downtime Cost\nThe rule: calculate what an hour of downtime costs the business, multiply by the response window, and compare to the premium cost. If downtime costs $5K/hour and Basic means 48 hours offline, that's $240K — way more than a Premium contract.",
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
        "MTBF Math Workshop\nLet's learn the math that turns vendor spec sheets into real reliability planning. MTBF stands for Mean Time Between Failures, and it's the single most important reliability number every component vendor publishes.",
        "MTBF Is Measured in Hours\nMTBF is the average number of hours a component runs before failing. Modern enterprise SSDs have an MTBF of 2 million hours. Consumer hard drives have 1 million. It sounds like a long time — but across thousands of components, it adds up.",
        "AFR: Convert to Annual Percentage\nMTBF in hours is hard to reason about. Convert it to Annual Failure Rate. The formula: AFR equals 8760 divided by MTBF, times 100%. Why 8760? Because there are 8,760 hours in a year.",
        "Vedic Shortcut\nHere's the shortcut: divide 8760 by MTBF in MILLIONS of hours. 8760 divided by 2 (for 2 million hours) equals 4.38. That's your failure rate per THOUSAND units per year. So a fleet of 1000 enterprise SSDs averages 4.38 failures per year.",
        "Example: 2 Million Hour MTBF\nEnterprise SSDs at 2 million hour MTBF equals 0.438% AFR. Across 1000 drives, that's about 4 failures per year. Across 10,000 drives, 44 failures. You now have the math to plan your replacement budget.",
        "Real Application\nBackblaze runs 200,000+ drives and publishes their failure data every year. You can look up the exact AFR for specific drive models. Real engineers use this data to decide which drives to buy. Now you have the same skill.",
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
        "The Overprovisioning Trap\nNew engineers make this mistake constantly: 'I'll build 3x the capacity I need, just in case.' It sounds smart and safe. In reality, overprovisioning is one of the most expensive mistakes you can make.",
        "Excess Capacity Is Dead Money\nEvery watt of unused capacity still costs power. Every rack slot still costs rent. Every unused server still needs cooling. If you build 3x what you need and only use a third of it, you're paying triple for your actual work output.",
        "Target Utilization: 60-80 Percent\nThe sweet spot is running at 60-80% utilization. That gives you a buffer for traffic spikes while still using most of what you paid for. Below 60% and you're wasting money. Above 80% and you risk failures during peak load.",
        "Every Wasted Watt Equals Dollars Per Year\nAt $0.12/kWh, every unused watt costs about $1 per year in pure electricity. Multiply that by thousands of wasted watts in an over-specced rack and you see why engineers obsess over right-sizing.",
        "Under-Provisioning Is Also Bad\nThe opposite mistake is just as dangerous. Running at 95% utilization means any traffic spike causes failures. The art is finding the middle ground — enough buffer for spikes, not so much that you're burning money on idle capacity.",
        "AWS Sells 'Pay for What You Use'\nHere's why the cloud won the infrastructure war. AWS lets you rent compute by the second, scaling up for spikes and down during quiet times. You only pay for actual usage. That's the opposite of overbuilding, and it's more efficient for almost everyone.",
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
        "OpEx Shark Tank — The Hard Mode\nThis is a variant of the standard Shark Tank that adds a brutal twist: after your 3-minute pitch, investors specifically grill you on your TCO, failure rates, power costs, and support contracts. They don't just want the exciting parts.",
        "3-Minute Pitch Plus 2-Minute Grilling\nSame 3-minute pitch as standard Shark Tank. But then investors get 2 extra minutes to ask hostile TCO questions. You'll be interrupted. You'll be challenged. This is what real investor meetings feel like.",
        "Questions You Will Be Asked\nWhat's your 3-year TCO? What happens if electricity prices rise 20%? Which component in your build has the highest failure rate? Why did you pick Premium support over Standard? These are real questions real investors ask.",
        "Know Your Numbers COLD\nFluency matters more than anything else. If you hesitate for 3 seconds on a basic TCO question, you lose credibility. Memorize your key numbers before you walk up: TCO, power cost, failure budget, support tier for each component, 3-year profit.",
        "Scoring: Defensibility Over Big Numbers\nStandard Shark Tank rewards the most impressive numbers. OpEx Shark Tank rewards the most DEFENSIBLE numbers. A small business with honest, well-thought-out TCO will beat a flashy business that can't answer hard questions.",
        "Good Luck — The Sharks Are Hungry\nWalk up confident. Pause before answering questions. If you don't know something, say so honestly — honesty beats BS every single time with real investors. You've prepared for this all week. Trust your preparation.",
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
