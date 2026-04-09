/** Extended afternoon lesson content per day. Narrative + key concepts + discussion prompts. */

export interface DeepDiveContent {
  title: string;
  subtitle: string;
  narrative: string[];
  keyConcepts: { term: string; definition: string; analogy: string; realWorldExample: string }[];
  discussionPrompts: string[];
  caseStudy: { company: string; story: string; lesson: string };
}

export const deepDives: Record<number, DeepDiveContent> = {
  1: {
    title: "Real-World Workloads & Cloud Providers",
    subtitle: "What happens when you press play on Netflix?",
    narrative: [
      "Every time you open an app, watch a video, or send a message — a server somewhere is doing work for you. But not all work is the same!",
      "Netflix needs massive storage and network bandwidth to stream 4K video to 230 million subscribers. But it barely needs any GPU power.",
      "Fortnite needs lightning-fast CPUs and low-latency networking to track 100 players in real-time. But it doesn't need much storage.",
      "ChatGPT needs the most powerful GPUs on the planet to process your questions. A single training run uses thousands of GPUs for months!",
      "Companies like Amazon (AWS), Microsoft (Azure), and Google (GCP) built ENORMOUS data centers and rent out servers by the hour. This is called 'cloud computing.'",
      "Instead of buying a $3,500 CPU, you can rent a server with that CPU for $0.50/hour. If you only need it for 10 hours, you just saved $3,495!",
    ],
    keyConcepts: [
      { term: "Workload", definition: "The specific type of job a server is designed to handle", analogy: "Like different vehicles for different jobs — a sports car for racing, a truck for hauling, an ambulance for emergencies", realWorldExample: "YouTube's workload is 'video transcoding' — converting a video into 20+ quality levels" },
      { term: "Cloud Computing", definition: "Renting server capacity from companies like AWS instead of buying your own hardware", analogy: "Like renting a car vs buying one. You only pay for the hours you drive", realWorldExample: "Airbnb runs entirely on AWS — they don't own a single server" },
      { term: "SKU (Stock Keeping Unit)", definition: "A specific configuration of cloud server you can rent, with set CPU/RAM/GPU specs", analogy: "Like menu items at a restaurant — each one has a fixed set of ingredients and a price", realWorldExample: "AWS 'p4d.24xlarge' = 8 GPUs, 96 CPU cores, 1.1TB RAM, $32.77/hour" },
      { term: "Pay-as-you-go", definition: "Only paying for the compute time you actually use", analogy: "Like a taxi meter — it only runs when you're riding", realWorldExample: "A startup can launch on $50/month of cloud, then scale to $50K/month when they go viral" },
    ],
    discussionPrompts: [
      "If you were starting a game studio, would you buy your own servers or use the cloud? Why?",
      "Why do you think Amazon built AWS? What advantage did they have?",
      "What workload do you think uses the MOST electricity in the world right now?",
    ],
    caseStudy: {
      company: "Netflix",
      story: "Netflix used to mail DVDs to your house! In 2007, they started streaming — and realized they needed MASSIVE server capacity. Instead of building their own data centers, they moved everything to AWS. Today, Netflix is AWS's single biggest customer, streaming to 230 million subscribers across 190 countries. During peak hours (Sunday evenings), Netflix uses about 15% of ALL internet bandwidth in the US!",
      lesson: "Even the biggest companies use cloud computing. The key question isn't 'own or rent?' — it's 'what makes my business successful?'",
    },
  },
  2: {
    title: "RAID Levels & Data Protection",
    subtitle: "What happens when a hard drive dies?",
    narrative: [
      "Hard drives WILL fail. It's not a question of IF — it's WHEN. A typical server hard drive lasts about 3-5 years. In a data center with 10,000 drives, that means a drive fails almost every day!",
      "RAID (Redundant Array of Independent Disks) is the solution. It combines multiple drives so that when one fails, your data survives.",
      "RAID 0: Splits data across drives for SPEED. But if any drive fails, ALL data is lost! Used for temporary data only.",
      "RAID 1: Mirrors everything to 2 drives. If one dies, the other has a complete copy. But you lose 50% of your storage capacity.",
      "RAID 5: Splits data + adds 'parity' (a math trick to rebuild lost data). Can survive 1 drive failure. Loses ~33% capacity with 3 drives.",
      "RAID 10: Combines mirroring AND striping. Fast AND safe. But costs 2x the drives!",
      "When a drive fails in a real data center, the server beeps, an alert goes to the operations team, and a technician 'hot-swaps' a new drive — without turning the server off!",
    ],
    keyConcepts: [
      { term: "RAID", definition: "Combining multiple hard drives so data survives drive failures", analogy: "Like writing your homework in 2 notebooks — if you lose one, you still have a copy", realWorldExample: "Every bank in the world uses RAID for financial records" },
      { term: "Hot-Swap", definition: "Replacing a failed component without shutting down the server", analogy: "Like changing a tire on a race car during a pit stop — the race (server) never stops", realWorldExample: "Google replaces about 2% of its drives every year — all while services stay online" },
      { term: "Redundancy", definition: "Having backup systems so failures don't cause outages", analogy: "Like a spare tire in your car, or a backup goalkeeper on a soccer team", realWorldExample: "Hospitals have backup generators that kick in within 10 seconds of a power outage" },
      { term: "Mean Time Between Failures (MTBF)", definition: "Average time a component lasts before breaking", analogy: "Like knowing your phone battery lasts about 2 years before it degrades", realWorldExample: "Enterprise SSDs have MTBF of 2 million hours (~228 years!) but that's an average across all units" },
    ],
    discussionPrompts: [
      "If you had important family photos, which RAID level would you choose? Why?",
      "Why would anyone use RAID 0 if it has no protection?",
      "What's more important for a bank: speed or safety? What about for a gaming company?",
    ],
    caseStudy: {
      company: "GitLab",
      story: "In 2017, a GitLab engineer accidentally deleted a production database — 300GB of data, gone in seconds. Their backups? Five different backup methods, and ALL of them had problems. Some hadn't run in months, others were corrupted. They lost 6 hours of user data. GitLab live-streamed their recovery effort on YouTube, and it became one of the most famous data loss incidents ever. They now have 14 different backup systems!",
      lesson: "Redundancy means having MULTIPLE backup methods that you regularly TEST. One backup is not enough!",
    },
  },
  3: {
    title: "Cooling Systems & Energy Efficiency",
    subtitle: "Data centers use more electricity than some countries!",
    narrative: [
      "Here's a mind-blowing fact: Data centers use about 1-2% of ALL electricity on Earth. That's more than most countries!",
      "Every watt of computing power creates heat. A single server rack can produce as much heat as 20 space heaters running at once.",
      "If you don't cool the servers, they'll overheat and crash — or even catch fire. Cooling is the #1 operational cost in most data centers.",
      "PUE (Power Usage Effectiveness) measures how efficient a data center is. PUE = Total Power / IT Power. A PUE of 2.0 means for every watt of computing, you spend another watt on cooling and overhead!",
      "Google's data centers average a PUE of 1.1 — meaning only 10% overhead. They achieve this with advanced liquid cooling, AI-optimized airflow, and building in cold climates.",
      "Microsoft is experimenting with UNDERWATER data centers (Project Natick) — the ocean provides free cooling!",
      "Some data centers recycle their heat to warm nearby buildings, swimming pools, and even greenhouses!",
    ],
    keyConcepts: [
      { term: "PUE (Power Usage Effectiveness)", definition: "Ratio of total data center power to IT computing power. Lower = better", analogy: "Like miles per gallon for a car — PUE 1.2 is like getting 50 MPG, PUE 2.0 is like getting 25 MPG", realWorldExample: "Industry average PUE is ~1.6. Google achieves 1.1. Old data centers can be 2.5+" },
      { term: "Hot Aisle / Cold Aisle", definition: "Arranging racks so cold air enters the front and hot air exits the back into separate corridors", analogy: "Like one-way streets — you don't want hot and cold traffic mixing", realWorldExample: "Almost every modern data center uses this layout" },
      { term: "Liquid Cooling", definition: "Running water or coolant directly through or near server components", analogy: "Like the radiator in a car — liquid absorbs heat much better than air", realWorldExample: "NVIDIA's latest AI servers REQUIRE liquid cooling — they're too hot for air!" },
      { term: "Free Cooling", definition: "Using outside cold air or water instead of running AC compressors", analogy: "Like opening the window instead of running the AC when it's cool outside", realWorldExample: "Facebook's data center in Sweden uses Arctic air for free cooling 8 months/year" },
    ],
    discussionPrompts: [
      "If you were building a data center, where in the world would you put it? Why?",
      "What creative ways could you reuse data center heat?",
      "Is PUE of 1.0 possible? What would that mean?",
    ],
    caseStudy: {
      company: "Google",
      story: "Google uses AI (DeepMind) to control its data center cooling systems. The AI monitors thousands of sensors — temperature, humidity, airflow, server load — and adjusts cooling in real-time. This reduced cooling energy by 40%! It's AI optimizing the hardware that runs AI. Google also builds data centers next to rivers and wind farms to use renewable energy and natural cooling.",
      lesson: "The most efficient data centers combine smart design (where you build), smart technology (liquid cooling, AI optimization), and smart energy (renewables, heat recycling).",
    },
  },
  4: {
    title: "Network Architecture & Latency",
    subtitle: "Why does 50ms of lag ruin your Fortnite game?",
    narrative: [
      "Inside a data center, thousands of servers need to talk to each other AND to the internet. This requires a carefully designed network — like a highway system.",
      "At the top of each rack is a 'Top-of-Rack' (ToR) switch. Every server in that rack plugs into it. The ToR switch connects to an 'aggregation' switch, which connects to the 'core' router that reaches the internet.",
      "Latency is how long it takes data to travel from point A to point B. For a web page, 200ms is fine. For a multiplayer game, even 50ms feels laggy. For stock trading, firms spend MILLIONS to shave off 1 microsecond!",
      "That's why location matters. If your game server is in Virginia but you're playing from California, the data has to travel 2,500 miles — that's about 40ms of latency just from distance!",
      "CDNs (Content Delivery Networks) solve this by caching content in data centers close to users. When you watch a YouTube video, it's probably streaming from a server less than 50 miles from your house.",
      "'Five nines' (99.999%) uptime means less than 5.26 minutes of downtime per YEAR. Achieving this requires redundant everything — power, cooling, network, and even the building itself.",
    ],
    keyConcepts: [
      { term: "Latency", definition: "Time delay between sending data and receiving a response", analogy: "Like the delay between shouting across a canyon and hearing the echo", realWorldExample: "Speed of light in fiber: ~200,000 km/s. NYC to London (5,500km) = 27ms minimum" },
      { term: "Top-of-Rack (ToR) Switch", definition: "Network switch at the top of each rack connecting all servers in that rack", analogy: "Like the lobby phone in an apartment building — connects all apartments to the outside world", realWorldExample: "Modern ToR switches handle 100Gbps — that's downloading a full movie in 0.3 seconds" },
      { term: "CDN (Content Delivery Network)", definition: "Network of servers worldwide that cache content close to users", analogy: "Like having mini libraries in every neighborhood instead of one giant library downtown", realWorldExample: "Cloudflare has servers in 300+ cities. When you visit a website, the nearest one responds" },
      { term: "Five Nines (99.999%)", definition: "Uptime guarantee of 99.999% — only 5.26 minutes of downtime per year", analogy: "Like a heart that beats perfectly 99.999% of the time — it can only skip 5 beats per year", realWorldExample: "Banks and hospitals require five-nines. A 1-hour bank outage can cost millions in lost transactions" },
    ],
    discussionPrompts: [
      "Why would a stock trading company pay millions to be 1ms faster?",
      "If you were designing a network for your school, what would you prioritize?",
      "What happens to online games when a data center goes down? Have you experienced it?",
    ],
    caseStudy: {
      company: "Cloudflare",
      story: "In 2020, Cloudflare (which protects ~25% of all websites) had a 27-minute outage caused by a bad network configuration change. Millions of websites went down simultaneously — Discord, Shopify, and even some government sites. The root cause? A single network rule that accidentally dropped all traffic. Cloudflare now has automated 'canary deployments' that test changes on 1% of traffic before going global.",
      lesson: "In networking, a single misconfiguration can take down half the internet. That's why redundancy, testing, and rollback plans are essential.",
    },
  },
  5: {
    title: "How to Pitch to Investors",
    subtitle: "Your data center is a business — sell it!",
    narrative: [
      "You've designed a real data center — now you need to convince investors to fund it. In the real world, this is called a 'pitch deck.'",
      "Great pitches follow a simple structure: Problem → Solution → Market → Business Model → Financials → The Ask.",
      "PROBLEM: 'Companies need reliable, efficient compute power but can't afford to build their own data centers.'",
      "SOLUTION: 'We built a [X]-rack data center with [PUE], [uptime], and [workload specialization].'",
      "FINANCIALS are where Vedic math shines! Quick mental math during a pitch impresses investors. 'Our payback period is just [X] months — that's under 3 years for a full return.'",
      "CONFIDENCE matters as much as data. Make eye contact, speak clearly, and know your numbers cold. If someone asks 'What's your profit margin?' you should answer instantly.",
      "The best pitches tell a STORY. Don't just say 'PUE 1.2' — say 'We're 20% more efficient than the industry average, saving $50,000 per year on electricity.'",
    ],
    keyConcepts: [
      { term: "ROI (Return on Investment)", definition: "How much profit you make compared to how much you invested", analogy: "Like planting a seed — ROI is how many apples you get back for each seed you plant", realWorldExample: "Data centers typically target 15-25% annual ROI" },
      { term: "Payback Period", definition: "How many months until your investment pays for itself from profits", analogy: "Like saving your allowance — payback period is how many weeks until you've earned back the price of a game", realWorldExample: "A $500K data center earning $15K/month profit has a 33-month payback period" },
      { term: "Profit Margin", definition: "What percentage of revenue is actual profit after expenses", analogy: "If you sell lemonade for $1 and ingredients cost $0.60, your profit margin is 40%", realWorldExample: "Amazon's AWS has ~30% profit margin — their most profitable business!" },
      { term: "Pitch Deck", definition: "A short presentation (10-15 slides) that explains your business to investors", analogy: "Like a movie trailer — it shows the best parts to get investors excited in just a few minutes", realWorldExample: "Airbnb's original pitch deck was 10 slides. They raised $600K and are now worth $80 billion" },
    ],
    discussionPrompts: [
      "What makes a pitch memorable? Think of a commercial that stuck with you — why?",
      "Would you invest in a data center that's very profitable but has low uptime? Why or why not?",
      "If you had $1 million to invest, would you build a data center or put it in the stock market?",
    ],
    caseStudy: {
      company: "Equinix",
      story: "Equinix started in 1998 with one small data center. Their pitch: 'We'll build the place where networks meet.' They focused on being the BEST location for companies to connect to each other — not the cheapest. Today, Equinix operates 260+ data centers in 72 cities across 33 countries. Revenue: $7.8 billion/year. Their secret? They don't just rent server space — they sell CONNECTION. Being in an Equinix data center means you're physically close to major cloud providers, reducing latency.",
      lesson: "The best business isn't always the cheapest — it's the one that solves the most important problem. Equinix solved the 'Where should servers be?' problem better than anyone.",
    },
  },
};
