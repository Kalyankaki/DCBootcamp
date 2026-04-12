import type { ScheduleBlock } from "@/lib/types";

/**
 * 8-hour camp day schedule. 5 days × 10 blocks = 50 total blocks.
 * Each day runs 9:00 AM - 4:05 PM with a 45-minute lunch break.
 *
 * Block types: warmup → lesson → activity → vedic-workshop → lunch →
 * energizer → deep-dive → activity → show-and-tell → wrapup
 */

const day1: ScheduleBlock[] = [
  {
    id: "d1-warmup",
    dayNumber: 1,
    type: "warmup",
    title: "What's Inside YOUR Computer?",
    subtitle: "Icebreaker — guessing game about components",
    startTime: "09:00",
    durationMinutes: 30,
    icon: "🌅",
    content: {
      narrative: [
        "Welcome to Day 1! Today you'll discover what's actually inside every computer you use.",
        "Before we open up a real motherboard, let's see what YOU already know!",
      ],
      discussionPrompts: [
        "What do you think is inside your phone or laptop right now?",
        "If your computer had a 'brain,' what do you think it would be called?",
        "Have you ever seen the inside of a computer? What did it look like?",
      ],
    },
    teacherGuide: {
      talkingPoints: [
        "Go around the room — everyone shares one thing they think is inside a computer",
        "Write answers on the board (don't correct wrong ones yet — we'll revisit at end of day)",
        "Show photos or a real opened-up computer if available",
        "Build excitement: 'By the end of today, you'll know more about computers than 90% of adults!'",
      ],
      probingQuestions: [
        "Why does your phone get hot when you play games?",
        "What happens when you turn off a computer — does everything disappear?",
      ],
      commonMisconceptions: [
        "Kids often think 'memory' and 'storage' are the same thing — they're not!",
        "Some think more fans = faster computer (it's actually about cooling, not speed)",
      ],
      differentiationTips: {
        struggling: "Use physical objects to represent components (a brain for CPU, a desk for RAM)",
        advanced: "Ask: 'How do you think a computer adds 2+2?' Let them speculate about binary.",
      },
      slidesBullets: [
        "Welcome to Data Center Bootcamp\nOver the next five days you're going to learn how the internet is actually built. Every app you use, every video you stream, every game you play — they all run on servers inside buildings called data centers. By the end of the week, you'll know more about this world than most adults.",
        "Five Days, Five Levels of Scale\nDay 1 is components. Day 2 is servers. Day 3 is racks. Day 4 is rows. Day 5 is the full data center with a business pitch. Each day builds on the last — today's small pieces become tomorrow's systems.",
        "Today's Mission: What's in a Motherboard?\nBefore we can build servers we need to understand the core components. Think about the device in your pocket or on your desk — what do you think is actually inside?",
        "Your Turn: What's in Your Phone?\nTake 30 seconds. Shout out any parts you think exist inside a phone or laptop. There are no wrong answers right now — I want to see what you already know.",
      ],
      timerMinutes: 25,
    },
  },
  {
    id: "d1-lesson1",
    dayNumber: 1,
    type: "lesson",
    title: "Inside the Motherboard",
    subtitle: "The 6 components that power every computer",
    startTime: "09:30",
    durationMinutes: 60,
    icon: "📖",
    content: {
      existingComponent: "day-1-learn",
      keyConcepts: [
        { term: "CPU (Central Processing Unit)", definition: "The brain of the computer — runs all instructions", analogy: "Like the brain in your body", realWorldExample: "A modern gaming CPU can do 5 BILLION operations per second!" },
        { term: "RAM (Random Access Memory)", definition: "Fast temporary memory — forgets when power is off", analogy: "Like your desk — things you're using right now", realWorldExample: "Chrome with 20 tabs open uses ~4GB of RAM" },
        { term: "Storage", definition: "Permanent memory — keeps data even when off", analogy: "Like a filing cabinet", realWorldExample: "A 1TB SSD can hold 250,000 photos" },
        { term: "GPU (Graphics Processing Unit)", definition: "Specialized for parallel math — great for graphics and AI", analogy: "Like an art studio with 1000 painters", realWorldExample: "A single NVIDIA H100 GPU costs $40,000" },
        { term: "Network Card (NIC)", definition: "Connects to the internet", analogy: "Like a highway on-ramp", realWorldExample: "Data center NICs run at 100 Gbps — 10,000x faster than home internet" },
        { term: "Power Supply (PSU)", definition: "Converts wall power to what components need", analogy: "Like the heart pumping blood", realWorldExample: "A high-end gaming PC PSU can deliver 1,200 watts" },
      ],
      discussionPrompts: [
        "Which component do you think is most important? Why?",
        "What would happen if you took out the RAM while the computer was running?",
      ],
    },
    teacherGuide: {
      talkingPoints: [
        "Walk through each component using the analogy (Brain, Desk, Cabinet, Studio, Highway, Heart)",
        "Use the interactive Learn tab on each student's screen",
        "Emphasize: there is no single 'best' component — it depends on the WORKLOAD",
        "Show real photos of each component from a server motherboard",
      ],
      probingQuestions: [
        "Why can't we just have more RAM and no storage?",
        "Which components need the most cooling? Why?",
      ],
      commonMisconceptions: [
        "More GHz doesn't always mean faster — more cores might be better for multitasking",
        "RAM is NOT the same as storage — it's temporary!",
      ],
      differentiationTips: {
        struggling: "Focus on 3 core components: CPU, RAM, Storage. Skip GPU/NIC details for now.",
        advanced: "Introduce cache hierarchy (L1/L2/L3), clock speed vs IPC, memory bandwidth",
      },
      slidesBullets: [
        "CPU — The Brain\nThe Central Processing Unit runs all the instructions that make a computer work. A modern server CPU can perform over 5 billion operations every single second. More cores means more tasks happening at the same time, and higher clock speed means each individual task finishes faster.",
        "RAM — The Desk\nRAM is like your desk space — it holds everything you're actively working with right now. When you open Chrome with 20 tabs, all of those tabs are sitting in RAM. Here's the key thing: the moment you turn off power, RAM forgets everything. It's fast but not permanent.",
        "Storage — The Filing Cabinet\nStorage is where your stuff lives permanently — photos, documents, videos. HDDs use spinning disks (cheap but slow), SSDs have no moving parts (faster), and NVMe drives are the fastest of all. A 1TB SSD can hold about 250,000 photos.",
        "GPU — The Art Studio\nGPUs are specialized for doing many simple math operations at the same time. That makes them incredible at graphics, video rendering, and especially training AI. A single top-tier AI GPU like an NVIDIA H100 costs $40,000 — that's why ChatGPT is so expensive to run.",
        "Network Card — The Highway\nThe network card connects your computer to the internet and to other computers. Your home internet is probably around 100 megabits per second. Data center network cards run at 100 gigabits per second — that's 1000 times faster.",
        "Power Supply — The Heart\nThe PSU takes wall power and converts it into the exact voltages each component needs. Every watt of power eventually becomes heat, which is why data centers spend so much money on cooling. A high-end gaming rig PSU can pump out 1,200 watts.",
      ],
      timerMinutes: 55,
    },
  },
  {
    id: "d1-activity1",
    dayNumber: 1,
    type: "activity",
    title: "Build a Motherboard",
    subtitle: "Your first hands-on challenge — budget $5,000",
    startTime: "10:30",
    durationMinutes: 60,
    icon: "🔧",
    content: {
      existingComponent: "day-1-build",
      narrative: [
        "Time to build! You have a budget of $5,000 to build a motherboard for a specific workload.",
        "You'll pick a CPU, RAM, Storage, GPU (optional), Network Card, and Power Supply.",
        "The goal: match your build to the workload's requirements without going over budget.",
      ],
    },
    teacherGuide: {
      talkingPoints: [
        "Students work individually in the Build tab",
        "Circulate and ask each student WHY they chose each component",
        "Look for kids who are overspending — redirect them to the budget bar",
        "Look for kids who miss the GPU on workloads that need it (AI training)",
      ],
      probingQuestions: [
        "Why did you pick that specific CPU over the others?",
        "Do you have enough RAM for this workload? How do you know?",
        "Does your power supply have enough wattage for all your components?",
      ],
      commonMisconceptions: [
        "Kids buy the most expensive CPU thinking it's always best — it wastes budget",
        "Some forget the PSU entirely — then the build 'can't boot'",
      ],
      differentiationTips: {
        struggling: "Give them a template build to modify: 'Start with this 8-core CPU and 16GB RAM, adjust from there'",
        advanced: "Challenge: can you build for $3,500 and still meet requirements? Whoever gets the lowest cost wins!",
      },
      slidesBullets: [
        "Your First Build Challenge\nNow we put theory into practice. You have a $5,000 budget and a specific workload to build hardware for. This is the same decision process real data center engineers make every day, just with smaller numbers.",
        "Six Components to Choose\nYou'll pick one CPU, up to four RAM sticks, up to four storage drives, optionally a GPU, a network card, and a power supply. Every choice trades off cost against performance — there is no universal 'best' component.",
        "Match the Build to the Workload\nEach challenge targets a specific workload like web hosting or AI training. A web server doesn't need a GPU but it does need enough CPU cores to handle traffic. An AI server is the opposite — GPU is everything.",
        "How You're Scored\nYou get points for meeting the workload requirements, staying within budget, right-sizing your components so you don't overspend, and achieving a healthy profit margin. A perfect build hits all four.",
      ],
      timerMinutes: 55,
    },
  },
  {
    id: "d1-vedic",
    dayNumber: 1,
    type: "vedic-workshop",
    title: "Vedic Math Workshop",
    subtitle: "Mental math shortcuts for budget calculations",
    startTime: "11:30",
    durationMinutes: 20,
    icon: "🧮",
    content: {
      narrative: [
        "Vedic math is ancient Indian techniques for doing math in your HEAD — faster than a calculator!",
        "Today's trick: subtracting from round numbers. If your budget is $5,000 and you spent $3,247, just subtract each digit from 9, and the last from 10.",
        "9-3=6, 9-2=7, 9-4=5, 10-7=3 → $1,753 remaining. Easy!",
      ],
    },
    teacherGuide: {
      talkingPoints: [
        "Demo the 'all from 9, last from 10' trick on the board",
        "Give students 3 practice problems with different budgets",
        "Then use the Math Dojo tab in the demo for interactive practice",
        "Goal: students should be able to calculate remaining budget WITHOUT a calculator",
      ],
      probingQuestions: [
        "Why does subtracting from 9 work? (It's a shortcut for 9s-complement math)",
        "When would you need to do this in real life?",
      ],
      differentiationTips: {
        struggling: "Start with subtracting from 100 and 1,000. Build up to larger numbers.",
        advanced: "Try 10,000 and 100,000. Can you do it in your head in under 3 seconds?",
      },
      slidesBullets: [
        "Vedic Math — Ancient Mental Math Shortcuts\nVedic math is a set of calculation techniques from ancient India that let you do big arithmetic in your head faster than a calculator. Today we're going to learn one specific trick that's perfect for checking your remaining budget.",
        "The Trick: Subtract from Round Numbers\nWhen you need to subtract from a round number like 5000 or 10000, you don't line up columns like you learned in school. Instead, you subtract each digit from 9, and the very last digit from 10. Watch this.",
        "Example: $5,000 minus $3,247\nWrite out 3-2-4-7. Now subtract each from 9: nine minus three is six, nine minus two is seven, nine minus four is five. For the last digit seven, subtract from ten: ten minus seven is three. So the answer is 1-7-5-3, or $1,753.",
        "Why This Works\nSubtracting from 9 gives you the 'nines complement' of each digit. Adding those back to the original equals 9999, which is one less than 10000. The 'last digit from 10' step adjusts for that. It's pure algebra hidden in a shortcut.",
        "Practice in the Math Dojo\nOpen the Math Dojo tab on your screen. It has timed practice problems so you can get faster. By the end of the week you should be able to check your budget in under three seconds.",
      ],
      timerMinutes: 18,
    },
  },
  {
    id: "d1-lunch",
    dayNumber: 1,
    type: "lunch",
    title: "Lunch Break",
    subtitle: "Refuel and socialize",
    startTime: "11:50",
    durationMinutes: 45,
    icon: "🍕",
    content: {
      narrative: ["Time to recharge! Grab lunch and chat with your camp buddies."],
    },
    teacherGuide: {
      talkingPoints: [
        "Make sure students actually eat — they'll crash in the afternoon otherwise",
        "Fun fact to share: a data center eats ~1% of the world's electricity every day",
        "Use this time to prep the energizer game (draw teams on whiteboard)",
      ],
    },
  },
  {
    id: "d1-energizer",
    dayNumber: 1,
    type: "energizer",
    title: "Component Speed Round",
    subtitle: "Team quiz relay — identify components from clues",
    startTime: "12:35",
    durationMinutes: 30,
    icon: "⚡",
    content: {
      gameConfig: {
        gameName: "Component Speed Round",
        type: "quiz-relay",
        rules: [
          "Split class into 2-4 teams",
          "Teacher reads a clue (e.g., 'I process all instructions — what am I?')",
          "First team to buzz in gets 10 points for a correct answer",
          "Wrong answer = other teams can steal for 5 points",
          "Bonus: name the analogy (Brain, Desk, etc) for +5",
          "10 rounds — highest team score wins!",
        ],
        teamBased: true,
      },
    },
    teacherGuide: {
      talkingPoints: [
        "Energy is KEY — this is right after lunch, kids are sleepy",
        "Stand up, move around, be loud and enthusiastic",
        "Keep questions short and punchy (3-5 seconds to answer)",
        "Give bonus points for creative wrong answers that show thinking",
      ],
      probingQuestions: [
        "Ready-made clues: 'I'm temporary memory' (RAM), 'I'm the brain' (CPU), 'I'm the heart' (PSU)",
      ],
      differentiationTips: {
        struggling: "Let them see the components list on screen while playing",
        advanced: "Add 'lightning round' with 10 questions in 30 seconds",
      },
      slidesBullets: [
        "Component Speed Round\nWe're going to play a team game to reinforce everything we learned this morning. The goal is to identify computer components from clues as fast as possible. This is how you lock in knowledge — under pressure, out loud, in front of your peers.",
        "How It Works\nI'll split you into teams of three or four. I read a description — something like 'I run all the instructions' — and the first team to raise a hand gets to answer. Right answer earns ten points. Wrong answer means other teams can steal for five.",
        "Bonus Points for Analogies\nIf you can also name the analogy we used this morning — Brain, Desk, Filing Cabinet, Art Studio, Highway, or Heart — that's an extra five points. This rewards understanding, not just memorization.",
        "Speed Matters\nI'll read ten clues total. Fastest team with the most points wins. Don't overthink — trust what you learned and go. The physical act of answering quickly is what cements this stuff in your memory.",
      ],
      timerMinutes: 25,
    },
  },
  {
    id: "d1-deepdive",
    dayNumber: 1,
    type: "deep-dive",
    title: "Real-World Workloads & Cloud Providers",
    subtitle: "What Netflix, Fortnite, and ChatGPT actually need",
    startTime: "13:05",
    durationMinutes: 60,
    icon: "🔬",
    content: {
      narrative: [
        "Every app you use runs on a specific KIND of server hardware — and they're all different!",
        "Netflix needs massive storage + bandwidth. Fortnite needs fast CPUs. ChatGPT needs GPUs — lots of them.",
        "Companies don't buy their own servers — they RENT from AWS, Azure, or Google Cloud. You can rent a $50,000 server for $0.50/hour!",
      ],
      discussionPrompts: [
        "If you started a YouTube channel today, would you buy servers or rent from AWS? Why?",
        "Why does ChatGPT cost so much to run? (Hint: GPUs)",
        "What happens when millions of people try to watch the same Netflix show at once?",
      ],
    },
    teacherGuide: {
      talkingPoints: [
        "Show the Workloads tab in the demo — walk through each of the 5 workloads",
        "Explain AWS/Azure SKUs: 'c6i.4xlarge' means 'compute optimized, 4x extra large'",
        "Real numbers: Netflix pays AWS ~$40 million/month for servers",
        "The cloud is WHY startups can launch in days instead of years",
      ],
      probingQuestions: [
        "Which workload would you enjoy engineering the most?",
        "What's the difference between a GPU for gaming vs AI training?",
      ],
      commonMisconceptions: [
        "'The cloud' isn't actually in the sky — it's just someone else's computer",
        "Bigger numbers don't always mean better (a 32-core CPU isn't great for single-threaded games)",
      ],
      differentiationTips: {
        struggling: "Focus on 2-3 workloads they know (Netflix, Minecraft, TikTok)",
        advanced: "Discuss CDN architecture, edge computing, latency vs bandwidth",
      },
      slidesBullets: [
        "Different Apps, Different Hardware\nThe same set of six components can be assembled in dramatically different ways depending on what the server is doing. Let's look at the apps you use every day and work backwards to what their servers must look like.",
        "Netflix — Storage + Bandwidth\nNetflix doesn't need much CPU or GPU. What it needs is massive amounts of storage (to hold every movie and show) and massive network bandwidth (to stream 4K video to 230 million subscribers simultaneously). During peak hours Netflix uses about 15% of all US internet bandwidth.",
        "Fortnite — Fast CPU + Low Latency\nGame servers track every player, every bullet, every movement in real time. They need fast single-threaded CPUs and network connections with very low latency. Even 50 milliseconds of delay and players complain about lag.",
        "ChatGPT — Giant GPUs\nTraining an AI model is pure matrix math, which GPUs are built for. A single training run for a model like GPT-4 uses thousands of GPUs working for months. That's why AI is so expensive right now — the hardware bill is enormous.",
        "The Cloud: Renting Instead of Buying\nCompanies like Amazon (AWS), Microsoft (Azure), and Google built enormous data centers and rent out servers by the hour. You can rent a $50,000 server for 50 cents an hour. This is the single biggest reason startups can exist today.",
        "Why Startups Can Launch Cheaply\nBefore the cloud, you needed millions of dollars just to buy servers before you could start a company. Now a two-person startup can launch on $50 per month of AWS credit and scale to millions of users without ever owning a physical server.",
      ],
      timerMinutes: 55,
    },
  },
  {
    id: "d1-activity2",
    dayNumber: 1,
    type: "activity",
    title: "Workload Matchmaker",
    subtitle: "Match 5 workloads to their optimal hardware",
    startTime: "14:05",
    durationMinutes: 60,
    icon: "🎯",
    content: {
      narrative: [
        "Now you know the workloads AND the components. Time to match them up!",
        "For each of 5 workloads, design the OPTIMAL build within budget.",
        "Bonus challenge: achieve the highest 'revenue per dollar' efficiency!",
      ],
      discussionPrompts: [
        "Which workload is the hardest to build for? Why?",
        "What would you do if your budget was cut in half?",
      ],
    },
    teacherGuide: {
      talkingPoints: [
        "Students cycle through 5 workloads in the Build tab",
        "Track scores — keep a leaderboard on the whiteboard",
        "Encourage experimentation — there's no single right answer",
        "Midway, call out the top 3 scorers to motivate others",
      ],
      probingQuestions: [
        "Why would a web server NEVER need a GPU?",
        "Why does an AI server need 128GB of RAM when a web server only needs 16GB?",
      ],
      commonMisconceptions: [
        "Some kids build the same thing for every workload — push them to differentiate",
      ],
      differentiationTips: {
        struggling: "Give them a cheat sheet with 'recommended CPU cores for each workload'",
        advanced: "Challenge: design for MAXIMUM profit (revenue - hardware cost spread over 3 years)",
      },
      slidesBullets: [
        "Workload Matchmaker Challenge\nYou just learned that different workloads need different hardware. Now prove you understand it. For each of five workloads — web, gaming, video, database, AI — design the optimal build within budget.",
        "Same Budget, Very Different Builds\nHere's what makes this interesting: the same $5,000 budget has to be spent completely differently depending on the workload. The right CPU for gaming is wrong for AI. The right RAM for a database is overkill for a blog.",
        "Live Leaderboard\nI'll track scores on the whiteboard as you go. This isn't to shame anyone — it's to give you something to push against. Every build you submit is a chance to learn what works and what doesn't.",
        "Top Three Shoutouts\nAt the end I'll call out the top three scorers and we'll look at what they did right. The goal isn't to be first — it's to understand WHY certain builds work better than others.",
      ],
      timerMinutes: 55,
    },
  },
  {
    id: "d1-showtell",
    dayNumber: 1,
    type: "show-and-tell",
    title: "Show & Tell: Your Best Build",
    subtitle: "Present your build — class votes on best value & most powerful",
    startTime: "15:05",
    durationMinutes: 30,
    icon: "🎤",
    content: {
      presentationRules: [
        "Each student gets 60 seconds to present their best build",
        "Show: CPU, RAM, Storage, GPU choices, total cost, and target workload",
        "Explain: WHY did you pick each component?",
        "Class votes: 'Best Value Build' and 'Most Powerful Build'",
      ],
    },
    teacherGuide: {
      talkingPoints: [
        "Project students' builds on the screen if possible",
        "Use a timer — 60 seconds STRICTLY",
        "Applaud after every presentation, even shy kids",
        "Take photos of winning builds for the camp album",
      ],
      probingQuestions: [
        "Ask presenters: What would you change if you had $1,000 more?",
        "Ask the audience: Whose build do you want to use, and why?",
      ],
      differentiationTips: {
        struggling: "Let them present to a small group of 3-4 first",
        advanced: "Ask them to defend their build against a 'challenge question' from the class",
      },
      slidesBullets: [
        "Show & Tell Time\nWe're going to wrap up the morning challenges by having every student present their favorite build to the class. This is how engineers actually work — they design things and then defend their decisions to teammates.",
        "60 Seconds Per Student\nEach of you gets exactly 60 seconds. Walk us through what CPU you picked and why, what RAM and storage you chose, whether you used a GPU, and what your total cost came out to. Keep it tight — every second matters.",
        "Explain the WHY\nAnyone can list components. The real skill is explaining WHY. Why that CPU over the others? Why that much RAM? If you can't defend a choice, it probably wasn't the right one — and that's a great learning moment.",
        "Class Votes on Winners\nAfter everyone presents, we'll vote on two awards: Best Value Build (maximum performance per dollar) and Most Powerful Build (best raw specs). These are real trade-offs engineers navigate every day.",
      ],
      timerMinutes: 28,
    },
  },
  {
    id: "d1-wrapup",
    dayNumber: 1,
    type: "wrapup",
    title: "Wrap-Up & Reflection",
    subtitle: "Journal, badges, and preview Day 2",
    startTime: "15:35",
    durationMinutes: 30,
    icon: "🌟",
    content: {
      journalPrompts: [
        "What surprised you most about computer components today?",
        "Which component do you think you'd be best at designing?",
        "If you had $10,000 to build any computer, what would you build and why?",
      ],
      badgeCeremony: true,
      tomorrowPreview: "Tomorrow we take your motherboard and turn it into a REAL SERVER. You'll learn about form factors (1U/2U/4U), RAID, and why servers run 24/7 without ever shutting down.",
    },
    teacherGuide: {
      talkingPoints: [
        "Students write in journals for 10 minutes",
        "Badge ceremony: name every student who earned a badge today",
        "Review the 6 components one more time (call and response)",
        "Preview Day 2 with excitement: 'Tomorrow you BUILD A SERVER'",
      ],
      probingQuestions: [
        "What's ONE thing you learned today that you'll tell your family about?",
        "What question do you have that we didn't answer?",
      ],
      differentiationTips: {
        struggling: "Let them draw their motherboard instead of writing",
        advanced: "Ask them to research one real CPU model at home",
      },
      slidesBullets: [
        "Day 1 Complete\nYou went from knowing almost nothing about computer components this morning to designing optimized builds for real workloads this afternoon. That's a huge leap and you should feel proud of it. Tomorrow we build on this foundation.",
        "Badges and Reflection\nI'll call out everyone who earned a badge today — First Pick, Budget Hawk, Power Saver, Challenge Champion, and more. These are permanent. They follow you through the rest of the week.",
        "Preview: Day 2 — Building a Server\nTomorrow we take the motherboards you designed today and assemble them into real servers. You'll learn about form factors (1U, 2U, 4U), redundancy, RAID levels, and why servers run 24 hours a day without ever shutting down.",
        "Great Work, Engineers\nYou are now officially more informed about computer hardware than 90% of adults. Get some rest, come back tomorrow ready to push the scale up another level.",
      ],
      timerMinutes: 28,
    },
  },
];

const day2: ScheduleBlock[] = [
  {
    id: "d2-warmup",
    dayNumber: 2,
    type: "warmup",
    title: "Server Room Virtual Tour",
    subtitle: "See inside a real Google data center",
    startTime: "09:00",
    durationMinutes: 30,
    icon: "🌅",
    content: {
      narrative: [
        "Yesterday you built a motherboard. Today we're going BIGGER — we're building a SERVER.",
        "But first, let's see what a real data center looks like. These places are INSANE — miles of servers, glowing LEDs, cooling fans the size of cars.",
      ],
      discussionPrompts: [
        "What do you think a data center smells like? (Hot electronics and cold air!)",
        "How big do you think the largest data centers are?",
        "Why do data centers need to be kept cold?",
      ],
    },
    teacherGuide: {
      talkingPoints: [
        "Show YouTube video: 'Inside a Google Data Center' (6 min, search: youtube google data center tour)",
        "Pause and discuss what they see: racks, cables, cooling systems",
        "Key visuals: miles of servers, blue LEDs, raised floors for cooling airflow",
        "Fun fact: Google has 20+ data centers globally, each covers acres",
      ],
      probingQuestions: [
        "Why are all the cables color-coded?",
        "Why is it so LOUD in there? (Cooling fans)",
      ],
      commonMisconceptions: [
        "Data centers aren't just 'the cloud' — they're real physical buildings with real hardware",
      ],
      differentiationTips: {
        struggling: "Pause the video frequently to explain what they're seeing",
        advanced: "Discuss how data centers are designed for earthquake/flood resistance",
      },
      slidesBullets: [
        "Welcome Back to Day 2\nYesterday you designed motherboards — the individual brains of a computer. Today we take those motherboards and assemble them into real servers, the machines that actually power the internet.",
        "Virtual Tour: Inside a Real Data Center\nBefore we go further, I want you to see what a real data center actually looks like. We're going to watch a six-minute tour of a Google data center. Pay attention to the SCALE — these buildings are enormous.",
        "What to Watch For\nLook for the long aisles of server racks, the thick colored cables, the raised floors (that's for cold airflow), and the giant cooling fans. Also notice how clean everything is — dust is the enemy in a data center.",
        "Fun Fact to Remember\nA single Google data center can be as big as 30 football fields. They build them near rivers for cooling and near wind farms for cheap electricity. Location matters a lot, and we'll come back to that on Day 3.",
      ],
      timerMinutes: 25,
    },
  },
  {
    id: "d2-lesson1",
    dayNumber: 2,
    type: "lesson",
    title: "Servers & Form Factors",
    subtitle: "1U, 2U, 4U — and why it matters",
    startTime: "09:30",
    durationMinutes: 60,
    icon: "📖",
    content: {
      existingComponent: "day-2-learn",
      keyConcepts: [
        { term: "Server", definition: "A computer built to run 24/7, serving many users", analogy: "Like a restaurant kitchen — always open, handles lots of orders", realWorldExample: "A web server can handle 10,000+ users at once" },
        { term: "Form Factor", definition: "The physical size of a server — measured in 'U' units", analogy: "Like shirt sizes (S/M/L) — same shirt, different dimensions", realWorldExample: "1U = 1.75 inches tall. 4U = 7 inches tall." },
        { term: "Redundancy", definition: "Having backup components so failures don't cause outages", analogy: "Like having a spare tire in your car", realWorldExample: "Hospitals have backup generators for when power fails" },
        { term: "Hot-Swap", definition: "Replacing a broken part WITHOUT turning off the server", analogy: "Like changing a tire while the car is moving", realWorldExample: "You can pull out a dead hard drive and plug in a new one without rebooting" },
      ],
      discussionPrompts: [
        "Why would anyone use 4U when 1U saves space?",
        "What happens if your bank's server crashes at 3 AM?",
      ],
    },
    teacherGuide: {
      talkingPoints: [
        "Show visual comparison of 1U vs 4U (same content, different density)",
        "Explain 'U' = Rack Unit = 1.75 inches",
        "Why 1U: maximum density, cheaper racks. Why 4U: more components, better cooling",
        "Servers run 24/7 — they're built for RELIABILITY not speed",
      ],
      probingQuestions: [
        "Would a gaming PC work as a server? (Yes, but it would fail fast — not built for 24/7)",
        "Why do servers have 2 power supplies? (Redundancy!)",
      ],
      commonMisconceptions: [
        "Servers aren't always faster than gaming PCs — they're more RELIABLE",
        "Hot-swap doesn't mean the part itself is hot — it means swapping while running",
      ],
      differentiationTips: {
        struggling: "Focus on 1U vs 4U only. Skip RAID details.",
        advanced: "Introduce RAID 5 math: N drives = N-1 usable capacity with parity",
      },
      slidesBullets: [
        "What Actually Makes a Server?\nA server isn't just a fast computer. It's a computer built for one specific thing: running 24 hours a day, 7 days a week, for years, without ever shutting down. That reliability requirement changes everything about the hardware.",
        "Form Factors: 1U, 2U, 4U\nServers come in standardized heights measured in Rack Units, or 'U'. One U is exactly 1.75 inches tall. A 1U server is the thinnest — great for saving space. A 4U is big and spacious — great for lots of components and better cooling.",
        "The Density Tradeoff\nWhy would you ever use 4U when 1U saves space? Because bigger servers can hold more motherboards, more storage, better cooling, and more power. It's a constant trade-off between density (fitting more in) and flexibility (having more per machine).",
        "Redundancy: Backup Everything\nSince servers run 24/7, they have backups for every critical part. Two power supplies, two network cards, mirrored hard drives. If one fails, the other takes over instantly. That's how real infrastructure stays online.",
        "Hot-Swap: Fix Without Shutdown\nThe most important trick in server design: hot-swap. You can pull out a broken hard drive and plug in a new one while the server is still running. Users never notice. This is how Google replaces 2% of its drives every year without any downtime.",
      ],
      timerMinutes: 55,
    },
  },
  {
    id: "d2-activity1",
    dayNumber: 2,
    type: "activity",
    title: "Configure Your Server",
    subtitle: "Budget $15,000 — assemble a production-ready server",
    startTime: "10:30",
    durationMinutes: 60,
    icon: "🔧",
    content: {
      existingComponent: "day-2-build",
      narrative: [
        "Now you're assembling a REAL server, not just a motherboard.",
        "You'll pick a form factor (1U/2U/4U), add motherboards, and configure it for a specific workload.",
        "Think about: How many motherboards fit? What's the power budget? Is there redundancy?",
      ],
    },
    teacherGuide: {
      talkingPoints: [
        "Students use Day 2 Build tab",
        "Emphasize: match form factor to workload (AI = 4U, web = 1U)",
        "Watch for kids trying to cram too much into 1U — it won't cool properly",
        "Budget is $15K — that's 3x yesterday, more flexibility",
      ],
      probingQuestions: [
        "Why did you choose 4U instead of 1U?",
        "Did you leave budget for redundant power supplies?",
      ],
      commonMisconceptions: [
        "Kids think bigger = better. Actually 1U is preferred for maximum density",
      ],
      differentiationTips: {
        struggling: "Start with 2U as a safe middle ground",
        advanced: "Challenge: build a 1U server that meets AI training requirements (nearly impossible!)",
      },
      slidesBullets: [
        "Configure a Production Server\nNow you're not just building a motherboard — you're assembling a whole server that will run around the clock. Your budget is $15,000, three times yesterday's budget, because real servers are more complex.",
        "Step 1: Pick Your Form Factor\nStart by choosing 1U, 2U, or 4U. This single decision affects everything else: how many motherboards fit, how much cooling you can add, and whether you have room for hot-swap bays. Think about the workload before you decide.",
        "Step 2: Add Motherboards\nDepending on form factor, you can fit 1, 2, or 4 motherboards inside. Pick pre-configured templates based on what the workload needs. An AI server wants powerful, spacious motherboards. A web server wants lots of small, cheap ones.",
        "Step 3: Match the Workload\nYour final score depends on whether the assembled server actually meets the target workload's requirements. Don't just throw parts in — think about whether the total CPU cores, RAM, and storage clear the bar.",
      ],
      timerMinutes: 55,
    },
  },
  {
    id: "d2-vedic",
    dayNumber: 2,
    type: "vedic-workshop",
    title: "Vedic Math: Multiplication Tricks",
    subtitle: "Quick multiplication for server cost calculations",
    startTime: "11:30",
    durationMinutes: 20,
    icon: "🧮",
    content: {
      narrative: [
        "Today's Vedic trick: Nikhilam multiplication for numbers near 100.",
        "Example: 97 × 96 = ? Normal way is hard. Vedic way: 97 is 3 below 100, 96 is 4 below. Cross-subtract: 97-4 = 93. Multiply the differences: 3×4=12. Answer: 9,312.",
        "This works for any numbers close to a round number!",
      ],
    },
    teacherGuide: {
      talkingPoints: [
        "Demo Nikhilam on the whiteboard: 97 × 96 = 9312 in 5 seconds",
        "Practice problems: 98×97, 95×96, 103×102 (works above base too!)",
        "Use the Math Dojo tab for timed practice",
        "Real-world tie: server bulk pricing (100 servers × $97 each)",
      ],
      probingQuestions: [
        "Why does this work? (It's algebra: (100-a)(100-b) = 10000 - 100a - 100b + ab)",
        "When would you use this in real life?",
      ],
      differentiationTips: {
        struggling: "Practice with easier numbers: 99×98 first",
        advanced: "Try numbers near 1,000: 998×997",
      },
      slidesBullets: [
        "Today's Trick: Multiply Big Numbers Instantly\nLet's say someone asks you 'what is 97 times 96?' Most people would either give up or reach for a calculator. With Vedic math you can answer in about five seconds, in your head, correctly, every time.",
        "Step 1: Find Distance from 100\n97 is three below 100. 96 is four below 100. Remember these two numbers — 3 and 4. That's the whole setup. Now the magic.",
        "Step 2: Cross-Subtract\nTake 97 and subtract the OTHER number's distance: 97 minus 4 equals 93. Or equivalently, 96 minus 3 equals 93. Either way gives you the first half of the answer: 93.",
        "Step 3: Multiply the Distances\nMultiply the two distances together: 3 times 4 equals 12. That's the second half of the answer. Put them side by side and you get 9,312. Check with a calculator — it's exactly right.",
        "Why This Works\nIt's algebra: (100 minus a) times (100 minus b) equals 10000 minus 100a minus 100b plus ab, which factors into 100 times (100 minus a minus b) plus ab. But you don't need the algebra — you just need the shortcut. Try it on 98 × 97.",
        "This Works for Any Base\nSame trick works for numbers near 50, near 1000, anywhere. Nikhilam means 'from 10 or 100' in Sanskrit, but really it means 'from any round number'. Practice this in the Math Dojo.",
      ],
      timerMinutes: 18,
    },
  },
  {
    id: "d2-lunch",
    dayNumber: 2,
    type: "lunch",
    title: "Lunch Break",
    subtitle: "Refuel and discuss",
    startTime: "11:50",
    durationMinutes: 45,
    icon: "🍕",
    content: {
      narrative: ["Lunch time! Bonus question to discuss at the table: What's the biggest data center you've ever heard of?"],
    },
    teacherGuide: {
      talkingPoints: [
        "Fun fact: The largest data center in the world is The Citadel in Nevada — 7.2 million sq ft",
        "Prep the Form Factor Bingo cards for the energizer",
      ],
    },
  },
  {
    id: "d2-energizer",
    dayNumber: 2,
    type: "energizer",
    title: "Form Factor Bingo",
    subtitle: "Match specs to form factors — first bingo wins!",
    startTime: "12:35",
    durationMinutes: 30,
    icon: "⚡",
    content: {
      gameConfig: {
        gameName: "Form Factor Bingo",
        type: "bingo",
        rules: [
          "Each student draws a 3×3 bingo card with random specs",
          "Options: 1U, 2U, 4U, Hot-Swap, RAID 1, RAID 5, 2 motherboards, 4 motherboards, Redundant PSU",
          "Teacher calls out scenarios ('Most space-efficient' = 1U)",
          "First to mark 3 in a row shouts 'SERVER ONLINE!'",
          "Winner explains WHY each square matches",
        ],
        teamBased: false,
      },
    },
    teacherGuide: {
      talkingPoints: [
        "Pre-made bingo cards save time — bring 20 copies",
        "Call scenarios with ENERGY: 'I need 4 motherboards in one box — what form factor?'",
        "Don't stop at first bingo — play until 3 winners",
        "Winners get mini prizes (stickers, candy) for motivation",
      ],
      probingQuestions: [
        "Why is 1U best for web hosting?",
        "When is RAID 1 better than RAID 5?",
      ],
      differentiationTips: {
        struggling: "Give them a 'cheat card' with form factor definitions",
        advanced: "Add harder squares: 'PUE < 1.2', 'Liquid Cooled'",
      },
      slidesBullets: [
        "Form Factor Bingo\nWe're playing a bingo game to reinforce server form factors. Each of you gets a 3×3 grid card with random server specs written in the squares. I'll call out scenarios, and you mark matching squares.",
        "Fill Your Bingo Card\nIn each square write something like '1U', '2U', '4U', 'Hot-Swap', 'RAID 1', 'RAID 5', '2 motherboards', '4 motherboards', or 'Redundant PSU'. Randomize them — no two cards should look identical.",
        "Teacher Calls Scenarios\nI'll call out scenarios like 'I need to pack maximum density into a rack' and you have to identify which square matches. In this case it's 1U, because it's the thinnest form factor and saves the most space.",
        "First to Three in a Row Wins\nStandard bingo rules — three in a row horizontally, vertically, or diagonally. When you get three, shout 'SERVER ONLINE!' and then explain to the class WHY each square matches what I called. Explanation is part of winning."
      ],
      timerMinutes: 25,
    },
  },
  {
    id: "d2-deepdive",
    dayNumber: 2,
    type: "deep-dive",
    title: "RAID Levels & Data Protection",
    subtitle: "What happens when a hard drive dies?",
    startTime: "13:05",
    durationMinutes: 60,
    icon: "🔬",
    content: {
      narrative: [
        "Hard drives WILL fail. Typical lifespan: 3-5 years. In a data center with 10,000 drives, one fails almost every day!",
        "RAID (Redundant Array of Independent Disks) combines multiple drives so data survives failures.",
        "RAID 0 = speed (no protection). RAID 1 = mirror (2x drives). RAID 5 = parity (1 drive can fail). RAID 10 = mirror + stripe (fast AND safe).",
      ],
      keyConcepts: [
        { term: "RAID 0", definition: "Splits data across drives for speed — NO protection", analogy: "Like two lanes of a highway — faster but if one closes, you lose half", realWorldExample: "Used for temporary data only" },
        { term: "RAID 1", definition: "Mirrors data to 2 drives — one fails, other survives", analogy: "Like writing your homework in 2 notebooks", realWorldExample: "Used for database servers — safety first" },
        { term: "RAID 5", definition: "Stripes data + parity — can survive 1 drive failure, loses ~33% capacity", analogy: "Like a puzzle where you can lose 1 piece and still figure it out", realWorldExample: "Most common RAID level for business servers" },
        { term: "RAID 10", definition: "Combines mirroring + striping — fast AND safe, but expensive", analogy: "Best of both worlds", realWorldExample: "Used for high-performance databases" },
      ],
      discussionPrompts: [
        "If you had precious family photos, which RAID level would YOU use?",
        "Why would anyone use RAID 0 if it has no protection?",
      ],
    },
    teacherGuide: {
      talkingPoints: [
        "Draw each RAID level on the whiteboard — visual is critical",
        "Tell the GitLab 2017 story: deleted 300GB database, 5 backups all failed",
        "Key lesson: 1 backup is NOT enough — you need multiple methods",
        "Real cost: 1 hour of downtime at Amazon = $13 million in lost sales",
      ],
      probingQuestions: [
        "What's more important for a bank: speed or safety?",
        "Why are backups tested regularly? (Untested backups often fail when needed)",
      ],
      commonMisconceptions: [
        "RAID is NOT a backup — it protects against HARDWARE failure, not accidental deletion",
        "Cloud storage is also data on spinning disks somewhere",
      ],
      differentiationTips: {
        struggling: "Focus on RAID 1 (mirror) and RAID 5 (parity) only",
        advanced: "Discuss erasure coding and RAID 6 (2 drive failures)",
      },
      slidesBullets: [
        "Hard Drives Will Fail — It's a Fact\nHere's an uncomfortable truth: hard drives WILL fail. Not 'might' — will. Typical drive lifespan is 3-5 years. If your data center has 10,000 drives, you're replacing one every single day. Engineers plan around this.",
        "RAID 0 — Speed Only, No Protection\nRAID 0 splits data across multiple drives so reads and writes are faster. But if ANY drive in the RAID dies, ALL your data is lost. This is only used for temporary data you can afford to lose — scratch space, video editing caches.",
        "RAID 1 — Mirror, 2 Copies of Everything\nRAID 1 writes the same data to two drives simultaneously. If one dies, the other has a complete copy. You lose half your storage capacity — 2TB of drives gives you 1TB of usable space — but your data is safe.",
        "RAID 5 — Parity, Can Survive One Failure\nRAID 5 is clever. It splits data across drives AND adds parity bits that can reconstruct any single lost drive. With 3 drives you lose ~33% capacity, but you gain protection. Most common RAID level in business servers.",
        "RAID 10 — Speed and Safety Both\nRAID 10 combines mirroring and striping. It's fast like RAID 0, safe like RAID 1. But you need double the drives. Used when you can't compromise on either performance OR reliability, like high-traffic databases.",
        "RAID is NOT a Backup\nThis is the most misunderstood thing in data storage. RAID protects against HARDWARE failures — a drive dying physically. It does NOT protect against accidental deletion, ransomware, or fires. You still need backups. Always.",
      ],
      timerMinutes: 55,
    },
  },
  {
    id: "d2-activity2",
    dayNumber: 2,
    type: "activity",
    title: "Server Farm Optimization",
    subtitle: "Given 10 servers, assign workloads to maximize revenue",
    startTime: "14:05",
    durationMinutes: 60,
    icon: "🎯",
    content: {
      narrative: [
        "You have 10 servers with different specs. You also have 10 workloads — each pays different monthly revenue.",
        "Your job: match servers to workloads to MAXIMIZE monthly revenue.",
        "Strategy matters — sometimes a cheaper workload on a better server is more profitable than the 'best' match!",
      ],
      discussionPrompts: [
        "Why wouldn't you put the most expensive workload on the best server?",
        "What if 2 workloads need the same server?",
      ],
    },
    teacherGuide: {
      talkingPoints: [
        "Work in pairs — explain your reasoning to your partner",
        "Track the highest revenue achieved on the whiteboard",
        "This is a real 'operations research' problem — similar to how Amazon assigns servers",
        "Let students realize: over-specced hardware is wasted money",
      ],
      probingQuestions: [
        "If workload A pays $5K but fits on 3 different servers, which server?",
        "Why is leaving a server idle sometimes the right choice?",
      ],
      differentiationTips: {
        struggling: "Start with 5 servers and 5 workloads",
        advanced: "Add constraint: maximize revenue AND minimize power consumption",
      },
      slidesBullets: [
        "Server Farm Optimization\nYou have 10 servers with different specs AND 10 different workloads that each pay different monthly revenue. Your job: assign workloads to servers to maximize total monthly revenue. This is a real problem called operations research.",
        "It's Not Just About Picking the Best\nThe instinct is to put the most profitable workload on the best server. But that's often wrong. What if two workloads can run on one server together? What if an over-specced server is wasted on a cheap workload?",
        "Strategy Beats Brute Force\nWork in pairs. Talk through your logic out loud. The students who do best aren't the fastest — they're the ones who can explain WHY their assignment beats the obvious one. Reasoning is the skill we're building.",
        "Track Your Top Score\nI'll write the best score on the whiteboard. Try to beat it. Every run teaches you something new about trade-offs, and that's the real goal here.",
      ],
      timerMinutes: 55,
    },
  },
  {
    id: "d2-showtell",
    dayNumber: 2,
    type: "show-and-tell",
    title: "Show & Tell: Best Server Build",
    subtitle: "Present your server — votes for reliability & performance",
    startTime: "15:05",
    durationMinutes: 30,
    icon: "🎤",
    content: {
      presentationRules: [
        "Present your best server build in 60 seconds",
        "Explain: form factor choice, motherboard count, redundancy decisions",
        "Class votes: 'Most Reliable Build' and 'Best Performance Build'",
      ],
    },
    teacherGuide: {
      talkingPoints: [
        "Use a visible countdown timer",
        "Celebrate creative choices even if they're unusual",
        "Give kids 2 minutes between presentations to prep questions",
      ],
      probingQuestions: [
        "What would you change if this server had to run for 10 years?",
      ],
      slidesBullets: [
        "Show & Tell: Your Best Server\nWe end the afternoon with presentations. Each of you picks your favorite server build and walks the class through it. 60 seconds strict — this is practice for explaining technical decisions under pressure.",
        "What to Cover in 60 Seconds\nStart with the form factor and WHY you picked it. Then describe the motherboards inside, the storage configuration including RAID level, and any redundancy you added. End with the workload it targets.",
        "Vote: Most Reliable vs Best Performance\nAfter presentations, the class votes on two categories. 'Most Reliable' rewards smart redundancy choices. 'Best Performance' rewards raw specs. Both are legitimate goals — real engineers choose based on what the customer needs.",
      ],
      timerMinutes: 28,
    },
  },
  {
    id: "d2-wrapup",
    dayNumber: 2,
    type: "wrapup",
    title: "Wrap-Up & Day 3 Preview",
    subtitle: "Reflection, badges, and a peek at racks",
    startTime: "15:35",
    durationMinutes: 30,
    icon: "🌟",
    content: {
      journalPrompts: [
        "Would you trust your bank account to your server build? Why or why not?",
        "What's harder: building a reliable server or a fast server?",
        "If your server had to run for 24 hours straight, what would you add?",
      ],
      badgeCeremony: true,
      tomorrowPreview: "Tomorrow we take your server and stack it into a RACK. You'll learn about power, cooling, and the 42U rack standard. By the end of Day 3, you'll be calculating BTUs and kilowatts like a pro!",
    },
    teacherGuide: {
      talkingPoints: [
        "Journal time: 10 minutes of silent writing",
        "Award badges earned today — call names publicly",
        "Preview Day 3: rack tetris, power calculations, cooling math",
      ],
      slidesBullets: [
        "Day 2 Complete — You Built Real Servers\nTwo days ago most of you had never heard of RAID. Today you're explaining RAID 5 to your classmates and making intentional trade-offs between density and reliability. That's engineering.",
        "What You Learned Today\nYou understand form factors, redundancy, hot-swap, and four different RAID levels. You know why servers have two power supplies. You've made server farm assignment decisions. That's a lot for one day.",
        "Tomorrow: Filling the Rack\nIf today was about the server, tomorrow is about what happens when you have DOZENS of them. We stack servers into a standard 42U rack, then start thinking about power and cooling at scale.",
        "Power and Cooling at Scale\nHere's a preview: a single full rack can draw as much electricity as 20 houses. All of that electricity eventually becomes heat. Cooling becomes its own engineering challenge. See you tomorrow.",
      ],
      timerMinutes: 28,
    },
  },
];

const day3: ScheduleBlock[] = [
  {
    id: "d3-warmup",
    dayNumber: 3,
    type: "warmup",
    title: "Rack Tetris Relay",
    subtitle: "Physical warm-up — stack boxes to understand 42U",
    startTime: "09:00",
    durationMinutes: 30,
    icon: "🌅",
    content: {
      narrative: [
        "Before we fill a virtual rack, let's play with PHYSICAL ones!",
        "We'll use empty cardboard boxes labeled 1U, 2U, 4U. Your job: stack them to fill exactly 42U without going over.",
        "Sound easy? It's not — some boxes are the wrong size, and you have to plan ahead.",
      ],
    },
    teacherGuide: {
      talkingPoints: [
        "Bring cardboard boxes of different heights labeled 1U/2U/4U",
        "Split class into teams of 3-4",
        "Give each team a 'rack space' marked on the wall or floor (42U = 42 inches for simplicity)",
        "Time them — fastest team to fill exactly 42U wins",
        "Physical activity wakes them up and teaches spatial reasoning",
      ],
      probingQuestions: [
        "What strategy did your team use?",
        "Why is it hard to fit exactly 42U with different size servers?",
      ],
      differentiationTips: {
        struggling: "Give teams only 1U and 2U boxes (easier math)",
        advanced: "Add 'budget' constraint — each size costs different amounts",
      },
      slidesBullets: [
        "Day 3: Filling the Rack\nYesterday you built one server. Today we think about what happens when you have dozens of them stacked together. Welcome to the world of racks, power budgets, and cooling math.",
        "Warm-Up: Physical Rack Tetris\nBefore we go digital, let's do this with our hands. I've brought cardboard boxes labeled 1U, 2U, and 4U. Your job is to stack them into a 'rack space' that is exactly 42 inches tall. Sounds easy until you try it.",
        "The Exact-42 Constraint\nReal racks are exactly 42 units tall. Not 41, not 43. You have to make your server sizes add up perfectly. You'll quickly discover you need to plan before you stack — picking only 4U servers leaves 2 units wasted.",
        "Teams Compete for Speed\nSplit into teams of three or four. Fastest team to fill exactly 42U wins. This isn't just a game — it's teaching you spatial reasoning and forward planning, which are exactly the skills you'll need in the digital build later.",
      ],
      timerMinutes: 25,
    },
  },
  {
    id: "d3-lesson1",
    dayNumber: 3,
    type: "lesson",
    title: "Racks, Power, and Cooling",
    subtitle: "The 42U standard and the rules of density",
    startTime: "09:30",
    durationMinutes: 60,
    icon: "📖",
    content: {
      existingComponent: "day-3-learn",
      keyConcepts: [
        { term: "Rack", definition: "A standardized metal cabinet that holds servers — 42U tall (~6 feet)", analogy: "Like a tall bookshelf, but for computers", realWorldExample: "Every data center uses this exact 19-inch wide, 42U standard" },
        { term: "PDU (Power Distribution Unit)", definition: "Distributes power to all the servers in a rack", analogy: "Like a giant power strip for a server rack", realWorldExample: "A single rack can draw 5-20 kilowatts — that's as much as 20 houses!" },
        { term: "Hot Aisle / Cold Aisle", definition: "Arranging racks so cold air goes in front, hot air exits back", analogy: "Like one-way streets — don't let hot and cold mix", realWorldExample: "Every modern data center uses this layout" },
        { term: "BTU (British Thermal Unit)", definition: "Measure of heat — how much cooling you need", analogy: "Like calories for your AC", realWorldExample: "1 watt = 3.41 BTU/hr of heat output" },
      ],
      discussionPrompts: [
        "Why is a rack only 42U? What's the magic number?",
        "If your rack draws 10 kilowatts, how much heat does it produce?",
      ],
    },
    teacherGuide: {
      talkingPoints: [
        "Show a photo of a real 42U rack — kids need to SEE the scale",
        "Explain why 42U: it's the tallest rack you can fit through a standard doorway",
        "Power math: 10 kW × 3.41 = 34,100 BTU/hr of cooling needed",
        "Real numbers: A fully loaded rack = power of 20 suburban homes",
      ],
      probingQuestions: [
        "What happens if cooling fails for 5 minutes?",
        "Why are racks at the BACK of data centers warmer?",
      ],
      commonMisconceptions: [
        "'42U' is the TALLEST standard, but many racks are shorter (24U, 36U)",
        "Power = heat. You can't just 'dump' it — cooling is half the cost",
      ],
      differentiationTips: {
        struggling: "Skip BTU math; focus on power draw and units",
        advanced: "Introduce PUE (Power Usage Effectiveness) early",
      },
      slidesBullets: [
        "The 42U Standard Rack\nEvery modern data center uses the same rack standard: 19 inches wide, 42 units tall, which is about 6 feet — the tallest that fits through a standard doorway. This standardization is why servers from different vendors all fit in the same racks.",
        "PDU: Power Distribution Unit\nEvery rack has a PDU running along the back — think of it as a giant power strip just for this rack. PDUs take high-voltage electricity from the data center floor and distribute it to each individual server. They also monitor power usage in real time.",
        "Hot Aisle / Cold Aisle\nHere's a clever trick. You arrange racks back-to-back so that cold air intakes face one aisle and hot exhaust faces another. This keeps hot and cold air separated — otherwise they mix and cooling becomes dramatically less efficient.",
        "BTU Math: Watts × 3.41\nEvery watt of electricity a server uses eventually becomes heat. To know how much cooling capacity you need, you convert watts to BTUs per hour by multiplying by 3.41. A 10kW rack produces about 34,100 BTU per hour of heat — a lot to remove.",
        "One Rack Equals 20 Houses\nHere's something to blow your mind: a single fully-loaded rack can draw 10-20 kilowatts. That's the same amount of electricity as 20 suburban houses. Multiply that by thousands of racks and you see why data centers are near power plants.",
      ],
      timerMinutes: 55,
    },
  },
  {
    id: "d3-activity1",
    dayNumber: 3,
    type: "activity",
    title: "Fill Your Rack",
    subtitle: "Budget $200,000 — fill a 42U rack optimally",
    startTime: "10:30",
    durationMinutes: 60,
    icon: "🔧",
    content: {
      existingComponent: "day-3-build",
      narrative: [
        "You have 42U of rack space and $200,000. Fill it with servers to MAXIMIZE monthly revenue.",
        "But watch out: power, cooling, and budget are all constraints.",
        "Can you fill the rack AND maximize revenue AND stay under budget? It's a puzzle!",
      ],
    },
    teacherGuide: {
      talkingPoints: [
        "Students use Day 3 Build tab",
        "Strategy tip: Mix 1U web servers with 4U AI servers for balance",
        "Watch for kids who max out power before filling rack — teach power budgeting",
        "Celebrate variety: don't let everyone copy the same build",
      ],
      probingQuestions: [
        "Why is a rack full of the same server type rarely optimal?",
        "How much headroom should you leave in your power budget?",
      ],
      commonMisconceptions: [
        "Filling 42U doesn't always mean more revenue — power limits matter more",
      ],
      differentiationTips: {
        struggling: "Give them a starter rack with 20U pre-filled",
        advanced: "Challenge: highest revenue-per-watt wins a special badge",
      },
      slidesBullets: [
        "Fill Your Rack: The Big Challenge\nThis is the biggest build challenge yet. You have a 42U rack, a $200,000 budget, and your job is to fill it with servers that maximize monthly revenue. But watch out — power and cooling limits will constrain you.",
        "Three Constraints Pulling in Different Directions\nYou have to balance three things at once: fit everything in 42 units, stay under budget, and stay within power limits. Optimizing one often breaks another, and that's the whole point of this exercise.",
        "The Mix Strategy\nMost winning builds mix server types. A few powerful 4U AI servers (big revenue, lots of power), a bunch of 1U web servers (small revenue, low power), maybe a 2U storage server. Diversity beats putting all your eggs in one basket.",
        "Maximize Monthly Revenue\nYour final score is based on monthly revenue, not raw specs. That's the business goal. Engineers work for the business — they don't build cool things for the sake of coolness, they build things that make money.",
      ],
      timerMinutes: 55,
    },
  },
  {
    id: "d3-vedic",
    dayNumber: 3,
    type: "vedic-workshop",
    title: "Vedic Math: BTU Conversion",
    subtitle: "Quick Watts → BTU math for cooling calculations",
    startTime: "11:30",
    durationMinutes: 20,
    icon: "🧮",
    content: {
      narrative: [
        "Today's trick: multiplying by 3.41 in your head.",
        "Easy method: multiply by 3, then add 41% of the original (which is itself 10% + 10% + 10% + 10% + 1%).",
        "Example: 10,000W × 3.41 → 30,000 + 4,100 = 34,100 BTU/hr.",
      ],
    },
    teacherGuide: {
      talkingPoints: [
        "Demo on whiteboard: convert 5,000W, 10,000W, 20,000W to BTU",
        "Show the 'multiply by 3, add 41%' shortcut",
        "Practice in Math Dojo with BTU conversion problems",
        "Tie to real life: 'If your rack is 15 kW, how big an AC do you need?'",
      ],
      probingQuestions: [
        "Why do we even need BTU? (Cooling specs are in BTU)",
        "If 1 watt = 3.41 BTU, how many watts = 1,000 BTU?",
      ],
      differentiationTips: {
        struggling: "Round 3.41 to 3.5 for easier mental math",
        advanced: "Convert bidirectionally — given BTU, find watts",
      },
      slidesBullets: [
        "Today: Watts to BTU Conversion\nWe introduced this earlier but now we practice it as a Vedic shortcut. The formula is watts times 3.41 equals BTU per hour. The question is: how do you multiply by 3.41 in your head?",
        "The Shortcut: Three Plus Forty-One Percent\nBreak 3.41 into 3 plus 0.41. So watts times 3.41 equals three times the watts, plus 41% of the watts. The 41% is easy because it's basically 40% plus 1%. Work through this slowly at first.",
        "Worked Example: 10,000 Watts\nThree times 10,000 is 30,000. Forty percent of 10,000 is 4,000. One percent is 100. Add them: 30,000 + 4,000 + 100 = 34,100. Compare to the exact answer 34,100 — we got it exactly right in our head.",
        "Why This Matters\nWhen you're designing a data center, you need to know your cooling capacity quickly. Slow calculations mean you miss deadlines or make mistakes. Vedic math is literally a job skill for infrastructure engineers.",
        "Practice in the Math Dojo\nOpen the Math Dojo tab. Try different watt numbers. Get faster. By the end of the week you should be able to convert any watt value in under five seconds.",
      ],
      timerMinutes: 18,
    },
  },
  {
    id: "d3-lunch",
    dayNumber: 3,
    type: "lunch",
    title: "Lunch Break",
    subtitle: "Hydrate and recharge",
    startTime: "11:50",
    durationMinutes: 45,
    icon: "🍕",
    content: {
      narrative: ["Lunch! Question for discussion: how much electricity do YOU think a data center uses vs your house?"],
    },
    teacherGuide: {
      talkingPoints: [
        "Fun fact: A single rack can use as much electricity as 20-100 homes",
        "Global fact: Data centers consume ~2% of worldwide electricity",
        "Prep the Rack Stacking Race activity for energizer",
      ],
    },
  },
  {
    id: "d3-energizer",
    dayNumber: 3,
    type: "energizer",
    title: "Rack Stacking Race",
    subtitle: "Teams race to build the highest-revenue 42U rack",
    startTime: "12:35",
    durationMinutes: 30,
    icon: "⚡",
    content: {
      gameConfig: {
        gameName: "Rack Stacking Race",
        type: "team-challenge",
        rules: [
          "Teams of 2-3 students",
          "Same $200K budget, same 42U limit",
          "10-minute timer starts NOW",
          "Goal: highest monthly revenue when time runs out",
          "Bonus: revenue-per-watt efficiency award",
        ],
        teamBased: true,
      },
    },
    teacherGuide: {
      talkingPoints: [
        "Project the timer on the screen — make it visible",
        "Circulate and hype the teams: 'Team A just broke $30K/month!'",
        "At 5 minutes: announce 'HALFWAY!'",
        "At 1 minute: countdown from 60 out loud",
        "When time runs out, pause ALL students and compare scores",
      ],
      probingQuestions: [
        "What was your strategy? Why?",
        "What would you change with 5 more minutes?",
      ],
      differentiationTips: {
        struggling: "Partner them with advanced students for scaffolding",
        advanced: "Add hidden constraint: max 15 kW total power",
      },
      slidesBullets: [
        "Rack Stacking Race\nSame rules as this morning's build, but now it's a TIMED competition in teams. You get the same $200K budget, same 42 units, same workload options. But you only have 10 minutes. Go fast, stay smart.",
        "Teams of Two or Three\nPair up. Talking through decisions out loud makes you think clearer. Two people catch mistakes one person would miss. And the best teams split the work — one person on power math, one on cost.",
        "Maximum Monthly Revenue Wins\nThe winning team is whoever hits the highest monthly revenue when time runs out. Ties are broken by revenue-per-watt — the team that got there most efficiently. Efficiency is a tiebreaker in real engineering too.",
        "Ready? Timer Starts on 'Go'\nI'll count down from three. When I say go, start building. I'll call out the 5-minute mark and the 1-minute mark. Halt exactly when time expires — no exceptions. This teaches you to manage time under pressure.",
      ],
      timerMinutes: 20,
    },
  },
  {
    id: "d3-deepdive",
    dayNumber: 3,
    type: "deep-dive",
    title: "Cooling Systems & PUE",
    subtitle: "Why Google builds data centers in Iceland",
    startTime: "13:05",
    durationMinutes: 60,
    icon: "🔬",
    content: {
      narrative: [
        "Data centers use 1-2% of ALL electricity on Earth. A huge chunk goes to COOLING.",
        "PUE = Power Usage Effectiveness = Total Power / IT Power. PUE of 2.0 means every watt of computing needs another watt of cooling. PUE of 1.1 is elite.",
        "Google's data centers hit PUE 1.1 using liquid cooling, AI-optimized airflow, and COLD CLIMATES (Finland, Oregon, Iowa).",
        "Microsoft is even testing UNDERWATER data centers — the ocean provides free cooling!",
      ],
      keyConcepts: [
        { term: "PUE (Power Usage Effectiveness)", definition: "Ratio of total power to IT power — lower is better", analogy: "Like miles per gallon: PUE 1.1 is a hybrid, PUE 2.5 is a gas guzzler", realWorldExample: "Industry average is 1.6. Google is 1.1." },
        { term: "Liquid Cooling", definition: "Running coolant directly through server components", analogy: "Like a car radiator — liquid carries heat away better than air", realWorldExample: "NVIDIA's newest AI servers REQUIRE liquid cooling" },
        { term: "Free Cooling", definition: "Using outside cold air instead of AC compressors", analogy: "Like opening the window instead of running AC", realWorldExample: "Facebook's Sweden data center uses Arctic air 8 months/year" },
        { term: "Heat Recycling", definition: "Using data center waste heat to warm other buildings", analogy: "Like reusing hot water from a shower to warm your house", realWorldExample: "Microsoft heats homes in Finland with data center exhaust" },
      ],
      discussionPrompts: [
        "Where in the world would YOU build a data center? Why?",
        "What creative ways could you reuse data center heat?",
      ],
    },
    teacherGuide: {
      talkingPoints: [
        "Show photos of Google's data centers (Finland, Oregon, Dalles)",
        "Do the PUE math live: 150 kW IT + 30 kW cooling = PUE 1.2",
        "Discuss climate: Iceland + geothermal + arctic air = PUE 1.05 possible",
        "Environmental angle: data centers can use 100% renewable energy",
      ],
      probingQuestions: [
        "Why NOT build data centers in deserts? (Water for cooling is limited)",
        "What's the theoretical minimum PUE? (1.0 — no overhead at all, impossible)",
      ],
      commonMisconceptions: [
        "Cold climates are great, but network latency to users still matters",
        "'The cloud is green' isn't automatic — only if the energy source is clean",
      ],
      differentiationTips: {
        struggling: "Focus on the concept: cooling costs almost as much as computing",
        advanced: "Discuss carbon-aware computing — moving workloads to cleaner grids",
      },
      slidesBullets: [
        "PUE: Power Usage Effectiveness\nPUE is the most important number in data center efficiency. The formula is simple: total facility power divided by just the power used for computing. A PUE of 2.0 means for every watt of computing, another watt is burned on overhead like cooling.",
        "Lower PUE Means Better\nPUE of 1.0 is theoretically perfect — every watt goes to computing, no overhead. That's impossible in practice. Industry average is around 1.6. Real engineering goal is to push it under 1.3.",
        "Google's Elite 1.1\nGoogle data centers consistently run at PUE 1.1 — meaning only 10% overhead on top of IT power. They achieve this with liquid cooling, AI-optimized airflow, building in cold climates, and obsessive attention to detail.",
        "Iceland and Arctic Air\nSome data centers in Iceland hit PUE as low as 1.05. They use geothermal power AND use Arctic outside air to cool everything for free. The environment does the cooling — you just need to build in the right place.",
        "Underwater Data Centers Are Real\nMicrosoft's Project Natick put an entire data center on the ocean floor. The ocean provides free cooling. It ran for two years with lower failure rates than land-based centers — no humans, no dust, constant temperature.",
        "Heat Recycling — The Future\nSome data centers in Finland use their waste heat to warm homes in nearby neighborhoods. You go from 'data center is polluting' to 'data center is heating the town for free'. That's what happens when engineers get creative.",
      ],
      timerMinutes: 55,
    },
  },
  {
    id: "d3-activity2",
    dayNumber: 3,
    type: "activity",
    title: "Cooling Crisis Challenge",
    subtitle: "Your rack hit 40kW — design a cooling solution",
    startTime: "14:05",
    durationMinutes: 60,
    icon: "🎯",
    content: {
      narrative: [
        "Your rack just exceeded 40kW of power draw. Standard air cooling can't handle it.",
        "You have a cooling budget. Choose between: Advanced Air, Liquid Cooling, or Hybrid Free Cooling.",
        "Each has different costs, PUE, and reliability trade-offs. What's YOUR call?",
      ],
      discussionPrompts: [
        "Is it better to spend more on cooling or more on servers?",
        "What would make you pick the MOST expensive cooling option?",
      ],
    },
    teacherGuide: {
      talkingPoints: [
        "Present 3 cooling options with cost/PUE trade-offs",
        "Have students calculate: annual power cost at different PUE values",
        "Key insight: cheap cooling can cost MORE long-term due to electricity bills",
        "No single right answer — defend your choice",
      ],
      probingQuestions: [
        "At what PUE does free cooling pay for itself?",
        "What happens if your liquid cooling LEAKS?",
      ],
      differentiationTips: {
        struggling: "Give them a pre-filled cost comparison table",
        advanced: "Factor in 5-year total cost of ownership",
      },
      slidesBullets: [
        "Scenario: Your Rack Just Hit 40kW\nYou built a great rack this morning, but business grew and now it's drawing 40 kilowatts. That's a LOT. Standard air cooling maxes out around 20 kilowatts per rack. You have a cooling crisis.",
        "Three Cooling Options\nI'm giving you three solutions to pick from: Advanced Air Cooling (cheap but limited), Liquid Cooling (expensive but effective), and Hybrid Free Cooling (medium cost, environmental benefits). Each has different trade-offs.",
        "Cost, PUE, and Reliability\nPick based on three criteria. Cost — how much each costs upfront and monthly. PUE — how efficient the solution is. Reliability — will it fail in weird weather or require lots of maintenance?",
        "Defend Your Choice Out Loud\nAt the end, explain to the class why you picked what you picked. There's no single right answer — but your reasoning has to hold up. That's what engineering decisions actually look like in the real world.",
      ],
      timerMinutes: 55,
    },
  },
  {
    id: "d3-showtell",
    dayNumber: 3,
    type: "show-and-tell",
    title: "Show & Tell: Most Efficient Rack",
    subtitle: "Present your rack build — votes for efficiency & revenue",
    startTime: "15:05",
    durationMinutes: 30,
    icon: "🎤",
    content: {
      presentationRules: [
        "Present your best rack build in 60 seconds",
        "Show: total revenue, power draw, PUE, and final score",
        "Class votes: 'Most Efficient' and 'Best Revenue'",
      ],
    },
    teacherGuide: {
      talkingPoints: [
        "Keep a running leaderboard on the whiteboard",
        "Celebrate low-PUE builds even if revenue is lower",
        "Ask each presenter: what was your biggest trade-off?",
      ],
      slidesBullets: [
        "Show & Tell: Your Best Rack\nEnd of day 3 presentations. Each of you picks your best rack build and walks the class through it. By now you're getting good at this — the explanations should be tighter and more confident.",
        "What to Cover in 60 Seconds\nOpen with your monthly revenue and power draw. Then describe the mix of servers you used and why. End with your PUE if you calculated it. Keep it specific — numbers over adjectives.",
        "Two Categories, Two Winners\nWe vote on 'Most Efficient' (best PUE, smart power usage) and 'Best Revenue' (highest monthly income). Both are valid engineering goals, and the best builds balance them — which is exactly why we have two winners.",
      ],
      timerMinutes: 28,
    },
  },
  {
    id: "d3-wrapup",
    dayNumber: 3,
    type: "wrapup",
    title: "Wrap-Up & Day 4 Preview",
    subtitle: "Reflection + preview of row design",
    startTime: "15:35",
    durationMinutes: 30,
    icon: "🌟",
    content: {
      journalPrompts: [
        "How much electricity does a data center use? Does that surprise you?",
        "If you were CEO of a data center company, where would you build your next facility?",
        "What's harder: building a server or filling a rack? Why?",
      ],
      badgeCeremony: true,
      tomorrowPreview: "Tomorrow we go even bigger: ROWS of racks! You'll design an entire data center row with cooling, networking, and redundancy. This is where REAL data centers are built.",
    },
    teacherGuide: {
      talkingPoints: [
        "Journal time: 10 minutes quiet",
        "Badge ceremony for Day 3 achievers",
        "Day 4 preview: 'Tomorrow you design a full ROW'",
      ],
      slidesBullets: [
        "Day 3 Complete — Master of the Rack\nYou started the day with cardboard boxes and ended with designs that balance power, cooling, budget, and revenue. That's a legitimate data center engineering skill, and you have it now.",
        "What You Can Do Now\nYou understand PUE, watts-to-BTU conversion, hot aisle cold aisle layout, and the economic trade-offs of different cooling systems. You can design a rack and justify every choice. Most adults can't do this.",
        "Tomorrow: Building a Row\nIf a rack is a single apartment, a ROW is an entire apartment building. Tomorrow we step up again and design rows of racks with shared cooling, power distribution, network topology, and redundancy levels.",
        "Preview: Redundancy and Uptime\nTomorrow's big concept is uptime guarantees. Banks need 99.99% uptime. That's only 52 minutes of downtime per YEAR. Achieving that requires backups for everything — backup power, backup cooling, backup networking. Get ready.",
      ],
      timerMinutes: 28,
    },
  },
];

const day4: ScheduleBlock[] = [
  {
    id: "d4-warmup",
    dayNumber: 4,
    type: "warmup",
    title: "Data Center Disaster Scenarios",
    subtitle: "What happens when things go WRONG?",
    startTime: "09:00",
    durationMinutes: 30,
    icon: "🌅",
    content: {
      narrative: [
        "Disaster! Your data center just had a power outage. What do you do?",
        "Or: the internet goes down. Or the cooling fails. Or a fire alarm trips.",
        "Today we'll learn about REDUNDANCY — having backups for your backups.",
      ],
      discussionPrompts: [
        "What's the longest you've gone without internet? How did it feel?",
        "If YouTube went down for 1 hour, how many people would be affected?",
        "What's the worst data center disaster you've heard about?",
      ],
    },
    teacherGuide: {
      talkingPoints: [
        "Start with a real story: Facebook's 6-hour outage in 2021 (cost: $100M)",
        "Ask kids to brainstorm disasters: power, water, fire, earthquake, human error",
        "Write each disaster on the board — we'll use them in the energizer later",
        "Build tension: 'By the end of today, you'll design a data center that SURVIVES all of these'",
      ],
      probingQuestions: [
        "Why is a 5-minute outage more damaging for a bank than a 5-hour outage for a blog?",
        "What would you do if you were the engineer on-call during an outage?",
      ],
      differentiationTips: {
        struggling: "Focus on relatable disasters (power outage, wifi dying)",
        advanced: "Discuss cascading failures — one failure triggering many",
      },
      slidesBullets: [
        "Day 4: Building a Row\nWe're zooming out one more level. Yesterday was one rack. Today we design an entire row — a line of racks sharing infrastructure like power, cooling, and network. This is where real data center engineering happens.",
        "Warm-up: Disaster Scenarios\nBefore we talk about how to design a row, let's talk about everything that can go wrong. Power outage. Network cable cut. Cooling pump fails. Tornado warning. Engineer makes a typo at 3 AM. Half of engineering is planning for disasters.",
        "What Can Go Wrong? Everything\nFacebook had a 6-hour global outage in 2021 — it cost them about $100 million and knocked Instagram, WhatsApp, and Messenger offline. The cause? A single bad network configuration change. One typo.",
        "Today's Mission: Prevent Disasters\nBy the end of today you'll understand redundancy levels, uptime math, network topology, and cooling systems. You'll know how real data centers achieve 99.99% uptime — and why it's so expensive.",
      ],
      timerMinutes: 25,
    },
  },
  {
    id: "d4-lesson1",
    dayNumber: 4,
    type: "lesson",
    title: "Row Design & Infrastructure",
    subtitle: "Power, cooling, network, redundancy — all at once",
    startTime: "09:30",
    durationMinutes: 60,
    icon: "📖",
    content: {
      existingComponent: "day-4-learn",
      keyConcepts: [
        { term: "Data Center Row", definition: "A line of racks sharing cooling, power, and network", analogy: "Like a city block — buildings (racks) share streets (power/network)", realWorldExample: "A typical row has 10-20 racks in a single hot/cold aisle pair" },
        { term: "N+1 Redundancy", definition: "Having 1 backup for every critical system", analogy: "Like a backup quarterback — if the starter gets hurt, someone's ready", realWorldExample: "N+1 cooling means if 1 AC unit fails, the others can still handle the load" },
        { term: "2N Redundancy", definition: "Full duplication — double everything", analogy: "Like having 2 complete cars in case one breaks down", realWorldExample: "Hospitals use 2N for life-critical systems" },
        { term: "UPS (Uninterruptible Power Supply)", definition: "Big batteries that keep servers running during outages", analogy: "Like a phone battery — keeps things running when unplugged", realWorldExample: "Data center UPS can run for 15-30 minutes until generators kick in" },
      ],
      discussionPrompts: [
        "Why would you pay 2x for 2N redundancy?",
        "What's the difference between reliability and redundancy?",
      ],
    },
    teacherGuide: {
      talkingPoints: [
        "Draw a row diagram: racks + cooling + UPS + generators + network switches",
        "Explain the power chain: Utility → Transformer → UPS → PDU → Server",
        "Redundancy costs money BUT downtime costs more",
        "Banks use 2N. Your blog can use N. Pick the right level.",
      ],
      probingQuestions: [
        "If uptime guarantees are 99.9% vs 99.99%, how much difference is that per year?",
        "Why can't we just use a generator and skip the UPS?",
      ],
      commonMisconceptions: [
        "More redundancy doesn't automatically mean more reliable — complexity can cause failures too",
        "Generators take 10-30 seconds to start — that's why UPS batteries bridge the gap",
      ],
      differentiationTips: {
        struggling: "Focus on 3 concepts: row, redundancy, UPS",
        advanced: "Introduce Tier 1-4 data center ratings",
      },
      slidesBullets: [
        "What Is a Row?\nA row is a line of racks that share infrastructure: the same cooling system, the same power distribution, the same network switches. Think of it as a city block — the buildings share streets, power lines, and water.",
        "N+1 Redundancy: One Backup\nIf you need 10 cooling units (N=10), N+1 means you install 11. If any one fails, the other 10 can still handle the load. It's the most common redundancy level because it's affordable AND effective for most scenarios.",
        "2N Redundancy: Double Everything\nIf N+1 is 'one backup', 2N is 'full duplication'. You build two complete systems. Either one can handle the full load alone. Banks and hospitals use this because the cost of failure is catastrophic.",
        "UPS: Uninterruptible Power Supply\nWhen the power grid fails, UPS batteries take over INSTANTLY — within milliseconds. They typically only last 15-30 minutes, but that's long enough for backup generators to start up. Without UPS, even a split-second outage crashes servers.",
        "The Power Chain\nHere's how power flows: Utility grid → Transformer (steps voltage down) → UPS (smooths spikes, provides battery backup) → PDU (distributes to racks) → Server power supplies → Components. Any break in this chain causes an outage.",
      ],
      timerMinutes: 55,
    },
  },
  {
    id: "d4-activity1",
    dayNumber: 4,
    type: "activity",
    title: "Design Your Row",
    subtitle: "Plan an entire data center row with redundancy choices",
    startTime: "10:30",
    durationMinutes: 60,
    icon: "🔧",
    content: {
      existingComponent: "day-4-build",
      narrative: [
        "You're designing an entire ROW of racks. Budget is big — $500,000.",
        "You'll pick: how many racks, cooling system, network architecture, redundancy level.",
        "Your choices affect UPTIME, COST, and MONTHLY REVENUE. Balance them carefully.",
      ],
    },
    teacherGuide: {
      talkingPoints: [
        "Students use Day 4 Build tab",
        "Stress the trade-off: higher redundancy = higher cost = lower profit margin",
        "Encourage students to write down their decisions BEFORE committing",
        "Discuss: why might a startup accept 99% uptime?",
      ],
      probingQuestions: [
        "What's your target market? (Banks need 99.99%, blogs are fine with 99%)",
        "Why did you pick that specific cooling system?",
      ],
      commonMisconceptions: [
        "Kids pick 2N for everything — too expensive",
        "Students forget network bandwidth matters as much as compute",
      ],
      differentiationTips: {
        struggling: "Limit choices: 5 racks, N+1 only, 2 cooling options",
        advanced: "Add SLA contract constraint: you MUST hit 99.99% uptime or lose revenue",
      },
      slidesBullets: [
        "Design Your Row: The $500K Challenge\nThis is the most complex build yet. You have half a million dollars and you're designing an entire row with multiple racks plus shared infrastructure. Every major subsystem is your call to make.",
        "Four Decisions You Have to Make\nOne: how many racks to install. Two: which cooling system — basic air, advanced air, liquid, or free cooling. Three: network speed — 1, 10, or 100 gigabits. Four: redundancy level — N, N+1, or 2N.",
        "Hit Your Target Uptime\nYour scenario has a target uptime. If your workload needs 99.99% uptime, you'd better have N+1 or 2N redundancy — you literally cannot hit four nines with single-point-of-failure architecture. Match the build to the requirement.",
        "Score: Profit Margin\nThe winning metric is profit margin — revenue minus costs, divided by revenue, times 100. Higher redundancy costs more, which eats into margin. The engineering art is spending just enough on reliability to hit the uptime target, and no more.",
      ],
      timerMinutes: 55,
    },
  },
  {
    id: "d4-vedic",
    dayNumber: 4,
    type: "vedic-workshop",
    title: "Vedic Math: Uptime & Profit Margins",
    subtitle: "Percentage math for investors",
    startTime: "11:30",
    durationMinutes: 20,
    icon: "🧮",
    content: {
      narrative: [
        "Today: percentage math for business. Profit margin = (Revenue - Costs) / Revenue × 100%.",
        "Quick trick for %: 10% is just moving the decimal. 5% = half of 10%. 25% = quarter.",
        "For uptime: 99.9% = 0.1% downtime. Of 525,600 minutes in a year, that's 525.6 minutes = ~8.7 hours/year.",
        "99.99% = 52.6 minutes/year. 99.999% = 5.26 minutes/year. Expensive but worth it for banks!",
      ],
    },
    teacherGuide: {
      talkingPoints: [
        "Demo: 'My row makes $100K revenue and costs $65K. Profit margin?' → 35%",
        "Practice with different numbers in Math Dojo",
        "Uptime math: demonstrate the '525,600 minutes per year' calculation",
        "Tie to yesterday's rack builds: 'your rack earns $10K but costs $7K — 30% margin'",
      ],
      probingQuestions: [
        "Is 30% profit margin good? (For hardware/infrastructure, yes!)",
        "Why is 99.999% called 'five nines' — what are the nines counting?",
      ],
      differentiationTips: {
        struggling: "Work with whole-number profits first ($100K - $50K = 50%)",
        advanced: "Introduce compound growth, payback period",
      },
      slidesBullets: [
        "Today's Math: Percentages for Business\nTwo skills you'll use in your pitch on Friday: profit margin and uptime math. Both are percentages, and both have Vedic shortcuts that let you calculate them in your head faster than a calculator.",
        "Profit Margin Formula\nProfit margin equals revenue minus cost, divided by revenue, times 100. If your row makes $100,000 a month and costs $65,000 to operate, your margin is 35%. Investors care about this number more than almost anything else.",
        "Percentage Shortcuts\nTen percent is just moving the decimal point one place. 25% is a quarter — divide by 4. 50% is half. 5% is half of 10%. Combine these to get any percentage. For 35%, do 25% plus 10%. Fast.",
        "Uptime to Downtime: The 525,600 Rule\nThere are 525,600 minutes in a year. If you have 99.9% uptime, that's 0.1% downtime, which is 525.6 minutes — about 8.7 hours of outage per year. That's a LOT for a bank.",
        "99.99% — About One Hour\n99.99% uptime means only 0.01% downtime. That's 52.6 minutes per year. This is the target for important business systems. Most cloud services promise this number.",
        "99.999% — Five Nines\nFive nines is only 5.26 minutes of downtime per year. This is reserved for truly critical systems — phone networks, stock exchanges, emergency services. Very expensive to achieve.",
      ],
      timerMinutes: 18,
    },
  },
  {
    id: "d4-lunch",
    dayNumber: 4,
    type: "lunch",
    title: "Lunch Break",
    subtitle: "Big day — lunch is essential",
    startTime: "11:50",
    durationMinutes: 45,
    icon: "🍕",
    content: {
      narrative: ["Lunch time! Tomorrow is the Shark Tank — start thinking about your business pitch."],
    },
    teacherGuide: {
      talkingPoints: [
        "Fun fact: Amazon Prime Day generates $12+ BILLION in sales — ALL through data centers",
        "Prep the Uptime Showdown scenario cards for the energizer",
      ],
    },
  },
  {
    id: "d4-energizer",
    dayNumber: 4,
    type: "energizer",
    title: "Uptime Showdown",
    subtitle: "Disaster scenario cards — pick the right redundancy",
    startTime: "12:35",
    durationMinutes: 30,
    icon: "⚡",
    content: {
      gameConfig: {
        gameName: "Uptime Showdown",
        type: "scenario-cards",
        rules: [
          "Teacher reads a disaster scenario",
          "Teams have 60 seconds to choose: N, N+1, or 2N redundancy",
          "Teams also estimate: How much downtime? Cost of outage?",
          "Teacher reveals the real-world answer",
          "5 scenarios total",
        ],
        teamBased: true,
      },
    },
    teacherGuide: {
      talkingPoints: [
        "Scenario ideas: 'Power grid fails for 2 hours', 'Network cable cut', 'Cooling pump broken', 'Server OS crash', 'Tornado warning'",
        "Give teams 60 seconds to discuss each scenario",
        "After reveals, tally points: +20 for right redundancy, +10 for close downtime estimate",
        "Build real decision-making skills — there's no single right answer",
      ],
      probingQuestions: [
        "Why is N+1 enough for most scenarios?",
        "When does 2N pay off?",
      ],
      differentiationTips: {
        struggling: "Give them the 3 redundancy options as reference cards",
        advanced: "Add constraint: justify your choice with a number",
      },
      slidesBullets: [
        "Uptime Showdown: Disaster Cards\nWe're making decision-making fun. I'll read out real-world disaster scenarios, and each team has to choose the right redundancy level to survive. This is the same thinking real data center managers do.",
        "How It Works\nTeams of three or four. I read a scenario — 'the power grid fails for 4 hours during a heat wave'. You have 60 seconds to pick N, N+1, or 2N redundancy. Then you also estimate: how much downtime? What does it cost?",
        "Five Scenarios Total\nThe scenarios get progressively harder. First one: simple power blip. Fifth one: multi-system failure. The right answer depends on WHICH systems are affected and WHAT the business impact is.",
        "Defend Your Answer\nAfter the 60-second timer, each team shares their choice and reasoning. The right answer isn't always the same — sometimes 2N is overkill, sometimes N+1 isn't enough. Judgment matters as much as knowledge.",
      ],
      timerMinutes: 25,
    },
  },
  {
    id: "d4-deepdive",
    dayNumber: 4,
    type: "deep-dive",
    title: "Network Architecture & Latency",
    subtitle: "Why 50ms ruins your Fortnite game",
    startTime: "13:05",
    durationMinutes: 60,
    icon: "🔬",
    content: {
      narrative: [
        "Inside a data center, thousands of servers talk to each other AND the internet. This requires a carefully designed network.",
        "Top-of-Rack (ToR) switches connect all servers in one rack. They connect upward to aggregation switches, which connect to core routers, which connect to the internet.",
        "LATENCY is how long data takes to travel. 200ms is fine for web pages. 50ms feels laggy in games. Stock traders pay MILLIONS for 1 microsecond.",
        "CDNs (Content Delivery Networks) cache content close to users. When you watch YouTube, it's probably streaming from a server less than 50 miles from you.",
      ],
      keyConcepts: [
        { term: "ToR Switch", definition: "Switch at the top of each rack connecting all the servers in it", analogy: "Like the lobby of an apartment building — all residents pass through", realWorldExample: "Modern ToR switches handle 100 Gbps" },
        { term: "Latency", definition: "Time delay for data to travel from A to B", analogy: "Like the delay between shouting and hearing an echo", realWorldExample: "NYC to London = 27ms minimum (speed of light in fiber)" },
        { term: "CDN (Content Delivery Network)", definition: "Network of caching servers worldwide", analogy: "Like having mini libraries in every neighborhood", realWorldExample: "Cloudflare has servers in 300+ cities" },
        { term: "Five Nines (99.999%)", definition: "Uptime guarantee — only 5.26 minutes of downtime per year", analogy: "Like a heart that beats perfectly — can only skip 5 beats per year", realWorldExample: "Banks require five-nines. A 1-hour outage = millions lost" },
      ],
      discussionPrompts: [
        "Why would a trading company pay millions for 1 ms faster connections?",
        "What happens to online games when a data center goes down?",
      ],
    },
    teacherGuide: {
      talkingPoints: [
        "Draw the network: Servers → ToR → Aggregation → Core → Internet",
        "Show speed of light math: fiber = ~200,000 km/s",
        "Cloudflare 2020 outage story: 27 minutes → thousands of sites down",
        "Gaming ping test: 10ms = perfect, 50ms = OK, 200ms = laggy",
      ],
      probingQuestions: [
        "Why do game servers have regions (US East, EU West)?",
        "What makes satellite internet laggy? (Distance to orbit = physics)",
      ],
      commonMisconceptions: [
        "Bandwidth ≠ speed. You can have high bandwidth but high latency",
        "'5G' isn't about latency only — it's a mix of speed and latency",
      ],
      differentiationTips: {
        struggling: "Focus on just latency: why distance matters",
        advanced: "Discuss BGP, DNS, packet routing",
      },
      slidesBullets: [
        "Network Architecture in One Slide\nHere's how data flows inside a data center: your server sends data up through a Top-of-Rack switch (the 'ToR'), then through an aggregation switch, then through a core router, and finally out to the internet. Every hop adds a tiny bit of latency.",
        "Latency Is Capped by Physics\nData in fiber optic cable travels at about 200,000 kilometers per second — two-thirds the speed of light. That's fast, but it's still a hard physical limit. You can't make it faster. You can only make it shorter.",
        "NYC to London: 27 Milliseconds Minimum\nThe distance from New York to London is about 5,500 kilometers. Divided by the speed of light in fiber, that's 27 milliseconds — and that's the absolute theoretical minimum. Real connections add more.",
        "CDNs: Local Copies Everywhere\nContent Delivery Networks solve latency by caching content in data centers close to users. When you watch a YouTube video, it's probably streaming from a server less than 50 miles from you. Cloudflare has servers in 300+ cities.",
        "Five Nines — Only 5.26 Minutes Offline Per YEAR\nLet me put five nines in perspective. That's 5.26 minutes of downtime in an entire year. To hit that, you need redundant power, redundant networking, redundant cooling, and software designed to tolerate failure without any interruption.",
        "Why Banks Pay Millions for Uptime\nIf a bank's database goes down during business hours, they lose transaction fees, customer trust, and sometimes billions of dollars. A 1-hour outage at Amazon during Prime Day costs about $100 million. That's why infrastructure reliability is a huge industry.",
      ],
      timerMinutes: 55,
    },
  },
  {
    id: "d4-activity2",
    dayNumber: 4,
    type: "activity",
    title: "Design for 99.99% Uptime",
    subtitle: "You must hit four nines — design accordingly",
    startTime: "14:05",
    durationMinutes: 60,
    icon: "🎯",
    content: {
      narrative: [
        "New constraint: your row MUST achieve 99.99% uptime. That's only 52.6 minutes of downtime per YEAR.",
        "You'll need N+1 or 2N redundancy, backup power, hot-swappable parts, and careful network design.",
        "Budget is tight — spend wisely. Can you make it profitable while hitting the uptime target?",
      ],
      discussionPrompts: [
        "What's the single point of failure in your design?",
        "How much more expensive is 99.99% vs 99.9%?",
      ],
    },
    teacherGuide: {
      talkingPoints: [
        "Students redesign their Day 4 row with 99.99% uptime constraint",
        "Walk around and point out single points of failure",
        "Compare: who hit the uptime target with the LOWEST cost?",
        "Real-world tie: banks pay huge premiums for this uptime",
      ],
      probingQuestions: [
        "What's the ROI of hitting 99.99% vs 99.9%?",
        "If you were a bank, would you pay the premium?",
      ],
      differentiationTips: {
        struggling: "Give a template: start with N+1, pick Advanced Cooling, 10 Gbps network",
        advanced: "Add constraint: achieve 99.999% instead — impossible within budget?",
      },
      slidesBullets: [
        "Challenge: Design for Four Nines\nYour new constraint is brutal: you MUST achieve 99.99% uptime. That's only 52.6 minutes of downtime per year, total, across all your systems. Every decision you make is in service of this target.",
        "Hunt Down Single Points of Failure\nThe first thing to check is: what in my design would take everything down if it failed? One power supply? One network switch? One cooling unit? Every 'one' is a single point of failure — eliminate them all.",
        "No Single Points of Failure\nEvery critical subsystem needs redundancy. Two power sources. Two network uplinks. N+1 or 2N cooling. This is expensive but it's the only way to achieve four nines. Half the work of high-uptime design is paranoid hunting.",
        "Lowest-Cost Winning Design\nThe twist: the team that hits 99.99% at the LOWEST cost wins. Anyone can spend infinite money on redundancy. The real skill is hitting the uptime target efficiently — just enough redundancy, no more, no less.",
      ],
      timerMinutes: 55,
    },
  },
  {
    id: "d4-showtell",
    dayNumber: 4,
    type: "show-and-tell",
    title: "Show & Tell: Most Reliable Row",
    subtitle: "Present your uptime design — votes for reliability & ROI",
    startTime: "15:05",
    durationMinutes: 30,
    icon: "🎤",
    content: {
      presentationRules: [
        "Present your row design in 90 seconds (more complex, more time)",
        "Explain: redundancy choices, cooling, network, total cost, uptime target",
        "Class votes: 'Most Reliable' and 'Best ROI'",
      ],
    },
    teacherGuide: {
      talkingPoints: [
        "90 seconds is longer — kids can go deeper",
        "Ask each presenter: what was your biggest trade-off?",
        "This is practice for TOMORROW's Shark Tank pitch",
      ],
      probingQuestions: [
        "Would you invest in this row? Why or why not?",
      ],
      slidesBullets: [
        "Show & Tell: Row Designs\nYour row designs are more complex than anything you've built this week. Presentations get 90 seconds each — 50% more time because there's more to explain. Use it well.",
        "What to Cover in 90 Seconds\nStart with your target uptime and how you achieve it. Then redundancy, cooling system, network tier, total monthly cost, and profit margin. End with the one trade-off you're most proud of navigating.",
        "Shark Tank Practice\nHere's the secret: tomorrow is Shark Tank, and these 90-second presentations are practice. The students who get good at this today will crush the pitch tomorrow. Treat it as a dress rehearsal, not a final.",
      ],
      timerMinutes: 28,
    },
  },
  {
    id: "d4-wrapup",
    dayNumber: 4,
    type: "wrapup",
    title: "Wrap-Up & Shark Tank Prep",
    subtitle: "Get ready for tomorrow's big pitch",
    startTime: "15:35",
    durationMinutes: 30,
    icon: "🌟",
    content: {
      journalPrompts: [
        "What would happen if YouTube went down for 1 hour? Be specific — who would be affected?",
        "What's the trade-off between cost and reliability in YOUR life?",
        "What will YOUR data center be called tomorrow? Brainstorm 3 names.",
      ],
      badgeCeremony: true,
      tomorrowPreview: "Tomorrow is the BIG DAY: SHARK TANK! You'll design a full data center, pitch it to the 'investors' (classmates + teacher), and compete for the top spot. Bring your A-game — and your best business ideas!",
    },
    teacherGuide: {
      talkingPoints: [
        "Journal time: 10 minutes",
        "Badge ceremony for Day 4",
        "HYPE the Shark Tank: 'Tomorrow you're CEOs. You pitch real businesses.'",
        "Assign homework: think of a cool data center NAME for your company",
      ],
      slidesBullets: [
        "Day 4 Complete — Row Masters\nYou're now designing entire infrastructure rows with shared cooling, redundant power, and network topology. This is the level at which real data center architects work. That's a huge accomplishment in four days.",
        "What You Know About Uptime\nYou understand the math of five nines, the economics of redundancy, and the physical limits of latency. You know why banks pay millions to hit 99.99%. You've made real engineering trade-offs.",
        "Tomorrow: Shark Tank Day\nEverything we've done this week builds to tomorrow. You design a complete data center — rows, infrastructure, business model — and pitch it to the class and me as your investors. Bring your best.",
        "Tonight: Think of a Name\nHomework for tonight: come up with a name for your data center company. Not a boring name. A memorable name. 'CloudVault', 'ScaleForge', 'DeepCore' — anything that sounds like a real startup. You'll pitch under that name tomorrow.",
      ],
      timerMinutes: 28,
    },
  },
];

const day5: ScheduleBlock[] = [
  {
    id: "d5-warmup",
    dayNumber: 5,
    type: "warmup",
    title: "Shark Tank Pitch Practice",
    subtitle: "60-second elevator pitches — warm up those voices",
    startTime: "09:00",
    durationMinutes: 30,
    icon: "🌅",
    content: {
      narrative: [
        "TODAY IS THE DAY. Shark Tank. Real pitches. Real competition.",
        "But first, we practice. Pair up. 60 seconds each. Pitch ANY business — a lemonade stand, a YouTube channel, a data center.",
        "Learn to sound confident, organized, and excited in 60 seconds.",
      ],
      discussionPrompts: [
        "What makes a pitch memorable?",
        "Would you rather watch a calm pitch or an energetic one?",
      ],
    },
    teacherGuide: {
      talkingPoints: [
        "Partner up students — rotate 3 times so they practice with different people",
        "60 seconds per pitch (STRICT). 30 seconds of feedback from partner.",
        "Key pitch elements: Problem → Solution → Market → Why You",
        "Build CONFIDENCE — no right or wrong pitches in practice",
      ],
      probingQuestions: [
        "What are you going to call YOUR data center?",
        "Who would be your target customer?",
      ],
      commonMisconceptions: [
        "A pitch isn't about selling — it's about telling a STORY",
      ],
      differentiationTips: {
        struggling: "Give them a pitch template: '[Name] is a [what] for [who] because [why]'",
        advanced: "Ask them to incorporate a surprising statistic in their pitch",
      },
      slidesBullets: [
        "Day 5 — Shark Tank Day\nThis is the day everything you've learned comes together. You're going to design a complete data center, build a business model around it, and pitch it to the class as your investors. The best pitches win special badges.",
        "Warm-Up: Practice Pitches\nBefore we build anything, we practice pitching. Pair up with someone near you. Each of you gets 60 seconds to pitch ANY business to your partner — a lemonade stand, a YouTube channel, a data center. The topic isn't what matters.",
        "Rotate Partners, Rotate Ideas\nAfter 60 seconds of pitching and 30 seconds of feedback, swap partners and try again. We'll do three rotations. The point is to get comfortable talking about your ideas out loud, under time pressure, to strangers.",
        "Tell a Story, Not Stats\nHere's the pitch secret: no one remembers numbers. Everyone remembers stories. Instead of 'PUE 1.2, 99.99% uptime', say 'We save enough electricity every year to power 50 homes, and we've never been offline'. Same facts, very different impact.",
      ],
      timerMinutes: 25,
    },
  },
  {
    id: "d5-lesson1",
    dayNumber: 5,
    type: "lesson",
    title: "Business Fundamentals",
    subtitle: "ROI, profit margin, payback — investor vocabulary",
    startTime: "09:30",
    durationMinutes: 60,
    icon: "📖",
    content: {
      existingComponent: "day-5-learn",
      keyConcepts: [
        { term: "ROI (Return on Investment)", definition: "How much profit you make vs how much you invested", analogy: "Planting a seed — ROI is how many apples you grow back", realWorldExample: "Data centers target 15-25% annual ROI" },
        { term: "Profit Margin", definition: "What % of revenue is actually profit after expenses", analogy: "If you sell lemonade for $1 and ingredients cost $0.60, margin = 40%", realWorldExample: "Amazon AWS has ~30% profit margin" },
        { term: "Payback Period", definition: "How many months until your investment pays itself back", analogy: "Saving allowance to buy a game — weeks until you can afford it", realWorldExample: "A $500K data center earning $15K/month = 33-month payback" },
        { term: "Pitch Deck", definition: "Short presentation (10-15 slides) that explains your business to investors", analogy: "Like a movie trailer — best parts only", realWorldExample: "Airbnb's original pitch deck was 10 slides. Now worth $80 billion." },
      ],
      discussionPrompts: [
        "Would you rather have high revenue or high profit margin?",
        "If your payback period is 3 years, would you still invest?",
      ],
    },
    teacherGuide: {
      talkingPoints: [
        "Draw the ROI formula on the board: (Profit / Investment) × 100",
        "Walk through an example: $500K investment, $100K/year profit = 20% ROI, 5-year payback",
        "Explain investor mindset: they want BIG returns fast",
        "Discuss: tech industry margins are usually higher than hardware",
      ],
      probingQuestions: [
        "Why do investors care about payback period, not just total profit?",
        "What's more important for a startup: fast growth or profitability?",
      ],
      commonMisconceptions: [
        "Revenue ≠ profit. You can have huge revenue and lose money.",
        "'Break even' isn't a failure — it means you'll profit from now on",
      ],
      differentiationTips: {
        struggling: "Focus on just ROI and payback period — skip margin",
        advanced: "Discuss TCO (total cost of ownership), NPV, discounted cash flow",
      },
      slidesBullets: [
        "Speaking the Language of Investors\nTo pitch successfully, you need to speak like a business person, not just a technologist. Today you'll learn four key business metrics that every investor asks about: ROI, profit margin, payback period, and unit economics.",
        "ROI: Return on Investment\nROI is the ratio of profit to investment, expressed as a percentage. If you invest $500,000 and make $100,000 profit per year, your annual ROI is 20%. Most investors want to see 15-25% ROI to fund a project.",
        "Profit Margin: Efficiency of the Business\nProfit margin is what percentage of revenue is actually profit after expenses. Amazon Web Services runs at about 30% profit margin — one of the best in any business. Low margin means you're working hard for little reward.",
        "Payback Period: When Does It Pay Itself Back?\nPayback period is how many months of profit it takes to pay back your original investment. A $500K data center making $15K per month profit has a 33-month payback — about 2.75 years. Investors usually want under 3 years.",
        "What Investors Want\nInvestors always want two things: HIGH ROI (big returns on their money) and FAST payback (quick return of their capital). These two often conflict — the cheapest thing has slow growth, the fastest-growing thing costs a lot upfront.",
      ],
      timerMinutes: 55,
    },
  },
  {
    id: "d5-activity1",
    dayNumber: 5,
    type: "activity",
    title: "Build Your Data Center",
    subtitle: "The Shark Tank challenge — design a full data center",
    startTime: "10:30",
    durationMinutes: 60,
    icon: "🔧",
    content: {
      existingComponent: "day-5-build",
      narrative: [
        "This is the main event. You're designing a COMPLETE data center — multiple rows, full infrastructure, business model.",
        "Budget: $2,000,000. Goal: maximize profitability, efficiency, and reliability.",
        "You'll pitch this to the class in the afternoon. Make it IMPRESSIVE.",
      ],
    },
    teacherGuide: {
      talkingPoints: [
        "Students use Day 5 Build tab",
        "Encourage NAMING the data center — it's psychological ownership",
        "Walk around asking: 'What's your unique angle? Why should investors pick YOU?'",
        "Help them think about their TARGET MARKET (gaming? AI? enterprise?)",
      ],
      probingQuestions: [
        "What makes YOUR data center different?",
        "Who are your customers? What do they need?",
      ],
      commonMisconceptions: [
        "Biggest isn't best — a focused niche data center can be more profitable",
      ],
      differentiationTips: {
        struggling: "Start with 1 row and expand from there",
        advanced: "Challenge: multi-region design with edge locations",
      },
      slidesBullets: [
        "Build Your Data Center — $2 Million Budget\nThis is the final build challenge. Two million dollars to design a complete data center from scratch: multiple rows, full infrastructure, complete business model. Everything you've learned comes into play.",
        "Multiple Rows, Full Infrastructure\nUnlike yesterday's single row, you're designing a full facility. Pick the number of rows, the cooling architecture, the network topology, the redundancy levels, and the target customer segments. This is a real data center plan.",
        "Name Your Company\nGive your data center a name — something memorable. You'll pitch under this name in the afternoon. If you didn't think of one last night, think of one now. 'CloudVault', 'ScaleForge', 'DeepCore' — sound like a real startup.",
        "This IS Your Pitch\nRemember: everything you build here is what you'll present this afternoon. Design with the pitch in mind. Which numbers will impress investors? What's your unique angle? What problem do you solve better than anyone else?",
      ],
      timerMinutes: 55,
    },
  },
  {
    id: "d5-vedic",
    dayNumber: 5,
    type: "vedic-workshop",
    title: "Vedic Math: Mental Math for Pitches",
    subtitle: "Impress investors with instant calculations",
    startTime: "11:30",
    durationMinutes: 20,
    icon: "🧮",
    content: {
      narrative: [
        "During a pitch, investors will ask: 'What's your profit margin?' 'ROI?' 'Payback period?'",
        "You should answer INSTANTLY — no calculator, no hesitation. That's where Vedic math wins.",
        "Practice quick mental math on your own financials. Know your numbers COLD.",
      ],
    },
    teacherGuide: {
      talkingPoints: [
        "Drill students on their own build's numbers: 'Quick! What's your annual ROI?'",
        "Use all 4 Vedic tricks: quick multiply, percentage, subtraction, ratio compare",
        "Simulate investor questions — rapid fire",
        "Goal: answers in under 3 seconds",
      ],
      probingQuestions: [
        "If revenue is $100K/mo, what's annual?",
        "If you invested $500K and make $50K/year profit, ROI is?",
      ],
      differentiationTips: {
        struggling: "Pre-write their key numbers on notecards for the pitch",
        advanced: "Challenge: do NPV calculations mentally",
      },
      slidesBullets: [
        "Mental Math for Pitches\nHere's a secret about investor pitches: nothing impresses them more than instant mental math. When they ask 'what's your profit margin?' and you answer in three seconds with perfect confidence, they take you seriously.",
        "Know Your Own Numbers Cold\nRight now, before lunch, memorize the key numbers from YOUR data center build. What's your monthly revenue? Total investment? Profit margin? ROI? Payback period? If you can't rattle them off instantly, investors will doubt you.",
        "Quick Multiply — The Core Skill\nWe've practiced multiplying numbers near 100 all week. Now use it on your own financials. Monthly revenue times 12 gives annual revenue. Investment divided by monthly profit gives payback. Practice these on your own numbers.",
        "Percentage Shortcuts for Margins\nProfit margin is a percentage. Practice: if revenue is $100K and costs are $65K, what's the margin? 35%. If revenue is $200K and costs are $140K? 30%. Do this ten times with different numbers until it's instant.",
        "Instant Answers Impress Investors\nWhen a Shark asks a question, count ONE second, then answer. Not three seconds. Not ten. The fast, confident response signals that you know your business cold. Slow answers signal hesitation and lack of preparation.",
      ],
      timerMinutes: 18,
    },
  },
  {
    id: "d5-lunch",
    dayNumber: 5,
    type: "lunch",
    title: "Lunch Break — Pitch Prep",
    subtitle: "Eat fast, think about your pitch",
    startTime: "11:50",
    durationMinutes: 45,
    icon: "🍕",
    content: {
      narrative: ["Last lunch of camp. Eat well — the Shark Tank is after the energizer. Practice your opening line while you eat!"],
    },
    teacherGuide: {
      talkingPoints: [
        "Encourage kids to rehearse their pitch mentally during lunch",
        "Prep the Budget Bidding War cards for the energizer",
        "Fun fact: Shark Tank (TV show) has funded 700+ companies, total sales $10B+",
      ],
    },
  },
  {
    id: "d5-energizer",
    dayNumber: 5,
    type: "energizer",
    title: "Budget Bidding War",
    subtitle: "Auction premium components — bid wisely!",
    startTime: "12:35",
    durationMinutes: 30,
    icon: "⚡",
    content: {
      gameConfig: {
        gameName: "Budget Bidding War",
        type: "auction",
        rules: [
          "Teams use their Shark Tank budget allocation",
          "Teacher auctions 8 premium items",
          "Items: Premium GPU, Liquid Cooling, 100Gbps Network, 2N Redundancy, Premium Storage, AI CPU, Backup Generator, Smart PDU",
          "Teams write secret bids on paper",
          "Highest bid wins — deducted from budget",
          "Items give stat boosts for the final Shark Tank build",
        ],
        teamBased: true,
      },
    },
    teacherGuide: {
      talkingPoints: [
        "Make it dramatic: 'Going once... going twice... SOLD!'",
        "Announce the bonus each item gives BEFORE bidding",
        "Keep a tally of each team's remaining budget",
        "After all 8 items, announce who got the best deals",
      ],
      probingQuestions: [
        "Did you bid too high? Too low?",
        "What would you do differently?",
      ],
      differentiationTips: {
        struggling: "Give them a bidding guide: 'This item is worth up to X'",
        advanced: "Hide the bonuses until after bidding — pure gut instinct",
      },
      slidesBullets: [
        "Budget Bidding War\nWe're making the afternoon dramatic with an auction. I'm going to put 8 premium data center components up for bidding. Each team bids from their Shark Tank budget. Win items to boost your final pitch.",
        "Eight Premium Items\nThe items are: Premium GPU, Liquid Cooling, 100Gbps Network, 2N Redundancy, Premium Storage, AI CPU, Backup Generator, and Smart PDU. Each one gives your pitch a specific stat boost — but only if you actually win it.",
        "Secret Bids on Paper\nWrite your bid for each item on paper, folded, so other teams can't see. When I ring the bell, everyone reveals simultaneously. Highest bid wins the item, and that money is deducted from the team's pitch budget.",
        "Strategy Matters\nDon't blow your entire budget on one item. Don't bid so low you lose everything. Think about which boosts actually help YOUR data center — if you're already efficient, don't waste money on more cooling.",
        "Save Budget for Shark Tank\nThe critical warning: whatever you spend here reduces what you have for the Shark Tank pitch. An efficient bidder wins useful items at fair prices and still has money left for the main event."
      ],
      timerMinutes: 25,
    },
  },
  {
    id: "d5-deepdive",
    dayNumber: 5,
    type: "deep-dive",
    title: "How to Pitch to Investors",
    subtitle: "Structure, story, confidence — the art of the pitch",
    startTime: "13:05",
    durationMinutes: 60,
    icon: "🔬",
    content: {
      narrative: [
        "Great pitches follow a simple structure: Problem → Solution → Market → Business → Financials → The Ask.",
        "PROBLEM: 'Companies need reliable compute but can't afford their own data centers.' SOLUTION: '[Your name] delivers [what].'",
        "Don't just say 'PUE 1.2' — say 'We're 20% more efficient than the industry, saving $50K/year on electricity.'",
        "CONFIDENCE matters as much as data. Eye contact, clear voice, know your numbers.",
      ],
      keyConcepts: [
        { term: "Elevator Pitch", definition: "A 30-60 second summary of your idea", analogy: "Like a movie trailer — best parts only", realWorldExample: "Practice: you have 60 seconds in an elevator with an investor" },
        { term: "The Ask", definition: "How much money you want AND what you'll use it for", analogy: "Like asking your parents for money — be specific", realWorldExample: "'We want $2M for 10% equity to hire engineers and expand'" },
        { term: "Market Size", definition: "How big the opportunity is", analogy: "Like counting fish in the ocean before fishing", realWorldExample: "Cloud computing is a $500 billion/year market" },
        { term: "Unit Economics", definition: "How much profit per customer/server/unit", analogy: "If each lemonade makes $0.40 profit, that's your unit economics", realWorldExample: "Each data center rack = $6K/month profit = good unit economics" },
      ],
      discussionPrompts: [
        "What makes a pitch memorable? Think of a great commercial — why did it stick?",
        "Would you rather pitch calmly or with high energy?",
      ],
    },
    teacherGuide: {
      talkingPoints: [
        "Show 1-2 short Shark Tank clips if possible (YouTube has great ones)",
        "Demo a GOOD pitch and a BAD pitch — let kids spot the difference",
        "Practice 'power poses' — 30 seconds of confident posture before pitching",
        "Equity basics: 'We give investors 10% of the company for $200K'",
      ],
      probingQuestions: [
        "What's your opening line? Say it out loud right now.",
        "If an investor asks 'Why YOU?' — what do you say?",
      ],
      commonMisconceptions: [
        "The best product doesn't always win — the best STORY wins",
        "Nerves are normal — professional pitchers still get nervous",
      ],
      differentiationTips: {
        struggling: "Give them a pitch script template to fill in",
        advanced: "Challenge: pitch without any notes at all",
      },
      slidesBullets: [
        "The Anatomy of a Great Pitch\nEvery great pitch follows the same structure. I'm going to walk you through it step by step and you'll see the pattern in every successful startup pitch.",
        "The Six-Part Structure\nProblem, Solution, Market, Business Model, Financials, The Ask. Problem first because investors need to feel the pain. Then solution — YOUR data center. Market — who needs it? Business model — how do you make money? Financials — show the numbers. Ask — what do you want from the investor?",
        "Tell a Story, Not a Spec Sheet\nInvestors tune out when you read specs. They tune in when you tell a story. 'Bank outages cost $5M per hour. Our 2N redundant row kept First National online for 18 months straight through hurricanes, grid failures, and a coffee spill on a PDU.' That's a story.",
        "Know Your Numbers COLD\nWhen a Shark asks 'what's your 3-year TCO?', you should answer in two seconds. Not three. If you hesitate, you lose credibility. Memorize your numbers before you walk up to pitch. Fluency with your own financials is non-negotiable.",
        "Confidence Equals Credibility\nNervousness is natural. Fake confidence until real confidence arrives. Eye contact. Clear voice. Stand up straight. Pause between sentences instead of filler words. These are the visible markers of a person investors want to bet on.",
        "Practice Your Opening Line\nThe first sentence is the most important. Write it down right now. Rehearse it out loud three times. When you walk up to pitch, your first sentence should be instant and perfect. Everything after that gets easier.",
      ],
      timerMinutes: 55,
    },
  },
  {
    id: "d5-activity2",
    dayNumber: 5,
    type: "activity",
    title: "Polish Your Pitch",
    subtitle: "Finalize your design, prepare your 3-minute pitch",
    startTime: "14:05",
    durationMinutes: 60,
    icon: "🎯",
    content: {
      narrative: [
        "Last chance to polish. Finalize your data center design.",
        "Prepare a 3-MINUTE pitch covering: Name, Problem, Solution, Financials, The Ask.",
        "Write it out. Practice it TWICE. Know your numbers.",
      ],
      discussionPrompts: [
        "What's your opening line?",
        "What's the one number that makes your pitch stand out?",
      ],
    },
    teacherGuide: {
      talkingPoints: [
        "Half the time = design polish, half the time = pitch rehearsal",
        "Partner kids up for 1 round of peer feedback",
        "Time their practice pitches — 3 minutes MAX",
        "Build energy: 'In 30 minutes you're pitching to the Sharks!'",
      ],
      probingQuestions: [
        "What's your ONE strongest number?",
        "What would make an investor say YES?",
      ],
      differentiationTips: {
        struggling: "Give a pitch outline template with blanks to fill in",
        advanced: "Ask them to prepare for 3 tough investor questions",
      },
      slidesBullets: [
        "One Hour to Polish Everything\nThis is your last hour before pitches. Use it well. Split your time: 30 minutes finalizing the data center design, 30 minutes writing and practicing your pitch. Treat it like a dress rehearsal for a real product launch.",
        "Finalize the Design First\nLock in your data center configuration. Don't keep tweaking — commit to your decisions. Note down the final numbers: total cost, monthly revenue, profit margin, uptime, PUE, payback period. You'll need all of these in the pitch.",
        "Write the Pitch Out Loud\nOpen a notebook. Write the exact words you'll say for each of the six parts. Read it out loud as you write — written-for-reading sounds different than written-for-speaking. Aim for about 3 minutes total, not 5.",
        "Practice Twice — Out Loud, Timed\nRun through your pitch twice with a timer. First time: slow and clumsy. Second time: smoother. The repetition is what turns a rough draft into a polished presentation. Most students skip this step — don't.",
        "Strict 3-Minute Limit\nThe Shark Tank round has a 3-minute cap, no exceptions. If you run long, you get cut off mid-sentence. Practice with a timer. When it beeps, you stop talking. Budget your time across the six parts accordingly.",
      ],
      timerMinutes: 55,
    },
  },
  {
    id: "d5-showtell",
    dayNumber: 5,
    type: "show-and-tell",
    title: "SHARK TANK — The Finale",
    subtitle: "Real pitches · Real votes · Real winners",
    startTime: "15:05",
    durationMinutes: 30,
    icon: "🦈",
    content: {
      presentationRules: [
        "Each student gets 3 minutes to pitch their data center",
        "Cover: Name, Problem, Solution, Financials, The Ask",
        "Teacher + classmates are the investors",
        "Score on: profitability, efficiency, presentation",
        "Top 3 pitches win special badges and bragging rights",
      ],
    },
    teacherGuide: {
      talkingPoints: [
        "This is the CLIMAX of the week. Make it feel BIG.",
        "Dim lights, spotlight each presenter if possible",
        "Use a 3-minute timer (strict)",
        "Ask each presenter 1-2 follow-up questions like a real Shark",
        "Score on a 1-5 scale for: Profit, Efficiency, Presentation",
        "Announce winners with drama: 'And 3rd place goes to...'",
      ],
      probingQuestions: [
        "Why should I invest in YOUR data center over the others?",
        "What happens if a competitor launches next month?",
        "What's your biggest risk?",
      ],
      differentiationTips: {
        struggling: "Let them read from notes — the content matters more than memorization",
        advanced: "Ask them to defend against a 'lowball' investor offer",
      },
      slidesBullets: [
        "The Finale — Shark Tank\nThis is the moment the entire week has been building toward. Each of you pitches your data center to the class. We — myself and your classmates — are the Sharks. We listen, we score, we decide who earns badges.",
        "Three Minutes Per Pitch\nYou have exactly 3 minutes. Not 3:15, not 3:30. The timer goes off, you stop. Treat every second as precious. Open strong, cover the six parts, close with a clear ask.",
        "Real Votes, Real Stakes\nAfter each pitch, the Sharks ask one or two questions — and your answers matter as much as the pitch itself. Then we score you on three criteria: profitability, efficiency, and presentation quality.",
        "Top Three Get Badges\nWe'll announce the top three pitches and award special badges at the end. These badges are the closest thing this bootcamp has to permanent recognition — they follow you into your student profile.",
        "Deep Breath — You've Got This\nEveryone in this room has been preparing for this since Monday morning. You know your numbers, you've rehearsed your pitch, you have a great data center. Trust your preparation. Walk up confident. Good luck.",
      ],
      timerMinutes: 28,
    },
  },
  {
    id: "d5-wrapup",
    dayNumber: 5,
    type: "wrapup",
    title: "Graduation & Certificate Ceremony",
    subtitle: "Celebrate the week — you did it!",
    startTime: "15:35",
    durationMinutes: 30,
    icon: "🎓",
    content: {
      journalPrompts: [
        "What's ONE thing you'll remember from this week 10 years from now?",
        "What will you build NEXT?",
        "Who in your class inspired you? Tell them.",
      ],
      badgeCeremony: true,
      tomorrowPreview: "You've finished Data Center Bootcamp! You now know more about how the internet actually works than 99% of people. Take this knowledge and BUILD something.",
    },
    teacherGuide: {
      talkingPoints: [
        "Final badge ceremony: call EVERY student up for a certificate",
        "Read each student's top achievement (quiz score, best build, top pitch, etc.)",
        "Photo moment: whole class with certificates",
        "End with: 'What will you build next?'",
        "Hand out physical certificates if you have them",
      ],
      probingQuestions: [
        "What's next for you? Keep learning?",
      ],
      differentiationTips: {
        struggling: "Focus on growth — 'Look how much you learned in 5 days'",
        advanced: "Share resources for continued learning (YouTube channels, books)",
      },
      slidesBullets: [
        "Congratulations — You Finished\nYou made it. Five days, five scale levels, five challenges, dozens of decisions, and one week of intense learning. You started Monday knowing almost nothing about data centers and you're ending Friday designing complete infrastructure with business models.",
        "What You Accomplished\nYou can explain six major computer components and their trade-offs. You understand form factors, RAID levels, redundancy, cooling systems, PUE, and network topology. You know ROI, profit margin, and payback period. You've pitched a real business.",
        "Five Days · Five Scale Levels\nMotherboard. Server. Rack. Row. Data Center. You went from one component to an entire facility with a business model in five days. That's a genuinely hard sequence of ideas, and you handled it.",
        "What Will You Build Next?\nThe bootcamp is ending, but your learning is just beginning. Data center engineering is one of the highest-demand careers in tech right now. If this week excited you, keep going — there are YouTube channels, free courses, and public data center tours you can join.",
        "Thank You for an Incredible Week\nOne last thing. This week was as much fun for me to teach as I hope it was for you to experience. You brought energy, curiosity, and hard work every single day. Thank you for that. Congratulations again, and I'm proud of you.",
      ],
      timerMinutes: 28,
    },
  },
];

export const daySchedules: Record<number, ScheduleBlock[]> = {
  1: day1,
  2: day2,
  3: day3,
  4: day4,
  5: day5,
};
