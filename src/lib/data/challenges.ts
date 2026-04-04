import type { Challenge, QuizQuestion } from "../types";

export const challenges: Record<number, Challenge[]> = {
  1: [
    {
      id: "ch-1-quiz",
      day: 1,
      title: "Motherboard Knowledge Check",
      description: "Test your knowledge about motherboard components!",
      type: "quiz",
      points: 100,
      difficulty: "easy",
    },
    {
      id: "ch-1-build",
      day: 1,
      title: "Build a Motherboard!",
      description:
        "A client needs a motherboard for their workload. Pick the right parts and stay within budget!",
      type: "budget",
      budget: 2000,
      requirements: ["CPU", "RAM", "Storage", "Network Card", "Power Supply"],
      points: 200,
      difficulty: "medium",
    },
  ],
  2: [
    {
      id: "ch-2-quiz",
      day: 2,
      title: "Server Savvy Quiz",
      description: "Show what you know about servers!",
      type: "quiz",
      points: 100,
      difficulty: "easy",
    },
    {
      id: "ch-2-build",
      day: 2,
      title: "Configure Your Server!",
      description:
        "Choose a form factor and fill it with motherboards to handle real workloads.",
      type: "budget",
      budget: 10000,
      requirements: [
        "Form Factor",
        "At least 1 Motherboard",
        "Meet workload requirements",
      ],
      points: 300,
      difficulty: "hard",
    },
  ],
  3: [
    {
      id: "ch-3-quiz",
      day: 3,
      title: "Rack Knowledge Check",
      description: "Test your knowledge about server racks and cooling!",
      type: "quiz",
      points: 100,
      difficulty: "easy",
    },
    {
      id: "ch-3-build",
      day: 3,
      title: "Fill Your Rack!",
      description:
        "Fill a 42U server rack with servers to maximize workload coverage and profitability.",
      type: "budget",
      budget: 100000,
      requirements: [
        "At least 5 servers",
        "Power under 20kW",
        "Positive revenue",
      ],
      timeLimit: 600,
      points: 300,
      difficulty: "medium",
    },
  ],
  4: [
    {
      id: "ch-4-quiz",
      day: 4,
      title: "Row & Infrastructure Quiz",
      description:
        "Test your knowledge about data center rows, cooling, and redundancy!",
      type: "quiz",
      points: 100,
      difficulty: "easy",
    },
    {
      id: "ch-4-build",
      day: 4,
      title: "Design Your Row!",
      description:
        "Design a complete data center row with racks, cooling, networking, and power redundancy.",
      type: "budget",
      budget: 500000,
      requirements: [
        "At least 4 racks",
        "Cooling system",
        "Network config",
        "Positive profit",
      ],
      timeLimit: 900,
      points: 500,
      difficulty: "hard",
    },
  ],
  5: [
    {
      id: "ch-5-quiz",
      day: 5,
      title: "Data Center Mastery Quiz",
      description: "The ultimate data center knowledge test!",
      type: "quiz",
      points: 100,
      difficulty: "easy",
    },
    {
      id: "ch-5-build",
      day: 5,
      title: "Launch Your Data Center!",
      description:
        "Build and manage a complete data center with multiple rows.",
      type: "budget",
      budget: 2000000,
      requirements: [
        "Multiple rows",
        "High uptime",
        "Profitable operations",
      ],
      timeLimit: 1200,
      points: 500,
      difficulty: "hard",
    },
  ],
};

export const quizQuestions: Record<number, QuizQuestion[]> = {
  1: [
    {
      id: "q1-1",
      question: "What is the CPU often called?",
      options: [
        "The heart of the computer",
        "The brain of the computer",
        "The lungs of the computer",
        "The eyes of the computer",
      ],
      correctAnswer: 1,
      explanation:
        "The CPU (Central Processing Unit) is called the brain because it processes all the instructions and calculations, just like your brain processes thoughts!",
      points: 10,
    },
    {
      id: "q1-2",
      question:
        "What does RAM do? Think of it like a desk -- the bigger the desk...",
      options: [
        "Stores files permanently like a filing cabinet",
        "Lets you work on more things at the same time",
        "Makes the computer look prettier",
        "Connects the computer to the internet",
      ],
      correctAnswer: 1,
      explanation:
        "RAM is like your desk space. The more RAM you have, the more apps and files you can have open at once without things slowing down!",
      points: 10,
    },
    {
      id: "q1-3",
      question: "What is the difference between an SSD and an HDD?",
      options: [
        "SSDs are bigger than HDDs",
        "HDDs are faster than SSDs",
        "SSDs have no moving parts and are faster",
        "There is no difference",
      ],
      correctAnswer: 2,
      explanation:
        "SSDs (Solid State Drives) use flash memory with no moving parts, making them much faster than HDDs (Hard Disk Drives) which use spinning magnetic disks.",
      points: 10,
      vedicMathTip:
        "An NVMe SSD can read at 7,000 MB/s vs an HDD at 150 MB/s. That is about 47x faster! Quick trick: 7000/150 -- round to 7000/150 = 700/15 = about 47.",
    },
    {
      id: "q1-4",
      question: "What does GPU stand for?",
      options: [
        "General Processing Unit",
        "Graphics Processing Unit",
        "Global Power Unit",
        "Game Playing Utility",
      ],
      correctAnswer: 1,
      explanation:
        "GPU stands for Graphics Processing Unit. It is like an art studio -- it is amazing at doing thousands of small calculations at once, which is perfect for graphics, AI, and gaming!",
      points: 10,
    },
    {
      id: "q1-5",
      question: "What does TDP measure?",
      options: [
        "How fast the component runs",
        "How much data it can store",
        "How much heat/power it uses (in Watts)",
        "How many ports it has",
      ],
      correctAnswer: 2,
      explanation:
        "TDP (Thermal Design Power) tells you how much heat a component produces, measured in Watts. More Watts = more power needed = more cooling needed!",
      points: 10,
      vedicMathTip:
        "To quickly add up TDP: if CPU uses 140W and GPU uses 300W, round to 150 + 300 = 450W, then subtract 10 you added: 440W. Close enough for picking a power supply!",
    },
  ],
  2: [
    {
      id: "q2-1",
      question: "What is a server?",
      options: [
        "A really big monitor",
        "A powerful computer that provides services to other computers",
        "A type of keyboard",
        "A video game console",
      ],
      correctAnswer: 1,
      explanation:
        "A server is a specialized computer designed to run 24/7, handling requests from other computers. When you watch a video online, a server is sending that video to you!",
      points: 10,
    },
    {
      id: "q2-2",
      question: 'What does "1U" mean for a server?',
      options: [
        "1 USB port",
        "1 rack unit (1.75 inches tall)",
        "1 user capacity",
        "1 unit of power",
      ],
      correctAnswer: 1,
      explanation:
        'A rack unit (U) is 1.75 inches (44.45mm). A 1U server is the thinnest standard server size.',
      points: 10,
    },
    {
      id: "q2-3",
      question: "How many motherboards can a 4U server typically hold?",
      options: ["1", "2", "4", "8"],
      correctAnswer: 2,
      explanation:
        "A 4U server has enough physical space and power capacity for up to 4 motherboards.",
      points: 10,
    },
    {
      id: "q2-4",
      question: "What is the main advantage of a 1U server?",
      options: [
        "Most powerful",
        "Takes the least rack space",
        "Cheapest to cool",
        "Holds the most GPUs",
      ],
      correctAnswer: 1,
      explanation:
        "1U servers are the most space-efficient, allowing you to fit more servers in a rack.",
      points: 10,
    },
    {
      id: "q2-5",
      question: "Why do servers run 24/7?",
      options: [
        "Because they cannot be turned off",
        "Because people need access to services at all times",
        "Because turning them off breaks them",
        "Because they charge per hour",
      ],
      correctAnswer: 1,
      explanation:
        "Servers run around the clock because websites, apps, and services need to be available whenever someone wants to use them -- even at 3 AM!",
      points: 10,
    },
  ],
  3: [
    {
      id: "q3-1",
      question:
        "How many rack units (U) does a standard server rack have?",
      options: ["10U", "24U", "42U", "100U"],
      correctAnswer: 2,
      explanation:
        "A standard full-size server rack is 42U tall, which is about 6 feet (73.5 inches) of usable space.",
      points: 10,
    },
    {
      id: "q3-2",
      question:
        'What is "hot aisle / cold aisle" in a data center?',
      options: [
        "A food court layout",
        "An arrangement where server fronts face cold air and backs exhaust hot air",
        "Temperature zones for different seasons",
        "A fire safety system",
      ],
      correctAnswer: 1,
      explanation:
        "Hot/cold aisle containment arranges racks so cool air enters from the front (cold aisle) and hot exhaust exits the back (hot aisle), improving cooling efficiency.",
      points: 10,
    },
    {
      id: "q3-3",
      question:
        "How do you convert watts to BTU/hr for cooling calculations?",
      options: [
        "Multiply by 2.0",
        "Multiply by 3.41",
        "Divide by 1000",
        "Multiply by 100",
      ],
      correctAnswer: 1,
      explanation:
        "To convert watts to BTU/hr, multiply by 3.41. So a 10,000W rack needs about 34,100 BTU/hr of cooling!",
      points: 10,
      vedicMathTip:
        "Quick trick: multiply watts by 3.4 and add 1% for a fast estimate!",
    },
    {
      id: "q3-4",
      question: "What is a PDU in a server rack?",
      options: [
        "Personal Data Unit",
        "Power Distribution Unit",
        "Packet Data Uplink",
        "Processor Diagnostic Utility",
      ],
      correctAnswer: 1,
      explanation:
        "A PDU (Power Distribution Unit) distributes electrical power to all the servers and equipment in a rack.",
      points: 10,
    },
    {
      id: "q3-5",
      question:
        "A full server rack can use as much electricity as how many homes?",
      options: ["2 homes", "5 homes", "20 homes", "100 homes"],
      correctAnswer: 2,
      explanation:
        "A fully loaded server rack can draw 20kW or more -- roughly the same as 20 average homes!",
      points: 10,
    },
  ],
  4: [
    {
      id: "q4-1",
      question: "What does PUE stand for?",
      options: [
        "Power Usage Effectiveness",
        "Processing Unit Efficiency",
        "Power Utility Estimate",
        "Performance Under Evaluation",
      ],
      correctAnswer: 0,
      explanation:
        "PUE (Power Usage Effectiveness) measures how efficiently a data center uses energy. A PUE of 1.0 would be perfect -- all power goes to computing!",
      points: 10,
    },
    {
      id: "q4-2",
      question: 'What does "N+1" redundancy mean?',
      options: [
        "The network has 1 extra router",
        "You have one more of a component than you need, as backup",
        "The system needs N+1 users to operate",
        "Power is multiplied by N+1",
      ],
      correctAnswer: 1,
      explanation:
        "N+1 means you have one extra backup for every N components needed. If you need 3 power supplies, you have 4 -- so one can fail without downtime.",
      points: 10,
    },
    {
      id: "q4-3",
      question: "What is a CRAC unit?",
      options: [
        "Computer Room Air Conditioning",
        "Central Rack Assembly Controller",
        "Cable Routing and Containment",
        "Core Router Access Control",
      ],
      correctAnswer: 0,
      explanation:
        "CRAC (Computer Room Air Conditioning) units are specialized cooling systems designed for data centers.",
      points: 10,
    },
    {
      id: "q4-4",
      question: 'What is a "Top-of-Rack" (ToR) switch?',
      options: [
        "A power switch on top of the rack",
        "A network switch placed at the top of each rack",
        "A cooling fan at the top",
        "An emergency shutoff",
      ],
      correctAnswer: 1,
      explanation:
        "A ToR switch sits at the top of a server rack and connects all servers in that rack to the data center network.",
      points: 10,
    },
    {
      id: "q4-5",
      question: 'What is "free cooling" in a data center?',
      options: [
        "Cooling that costs no money",
        "Using outside cold air to cool the data center",
        "Fans powered by solar panels",
        "Turning off servers to cool down",
      ],
      correctAnswer: 1,
      explanation:
        "Free cooling uses cool outside air (when available) instead of mechanical chillers, saving huge amounts of energy. Data centers in cold climates love this!",
      points: 10,
    },
  ],
  5: [
    {
      id: "q5-1",
      question:
        "How many data centers does Google operate worldwide?",
      options: ["5", "15", "30+", "100+"],
      correctAnswer: 2,
      explanation:
        "Google operates over 30 data centers around the world to serve billions of users!",
      points: 10,
    },
    {
      id: "q5-2",
      question:
        'What uptime does "five nines" (99.999%) allow per year?',
      options: [
        "About 5 minutes",
        "About 1 hour",
        "About 1 day",
        "About 1 week",
      ],
      correctAnswer: 0,
      explanation:
        "99.999% uptime allows only about 5.26 minutes of downtime per entire year!",
      points: 10,
    },
  ],
};
