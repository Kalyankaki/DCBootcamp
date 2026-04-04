/**
 * Vedic Math Utilities for Data Center Bootcamp
 *
 * Ancient Indian math techniques applied to modern data center calculations.
 * Each function returns both the numeric result AND a step-by-step explanation
 * so students can learn the shortcuts.
 */

export interface VedicResult {
  result: number;
  explanation: string;
}

/**
 * Vedic multiplication using the "Nikhilam" method (working from a base).
 * Best for numbers close to powers of 10 (e.g., 97 x 96, 103 x 108).
 * Falls back to distributive property for other numbers.
 */
export function quickMultiply(a: number, b: number): VedicResult {
  // Find the nearest base (power of 10)
  const maxVal = Math.max(Math.abs(a), Math.abs(b));
  const base = maxVal === 0 ? 10 : Math.pow(10, Math.ceil(Math.log10(maxVal)));

  const diffA = a - base;
  const diffB = b - base;

  // Check if both numbers are close to the base (within 15%)
  if (Math.abs(diffA) <= base * 0.15 && Math.abs(diffB) <= base * 0.15) {
    // Nikhilam method: (a + diffB) * base + (diffA * diffB)
    const crossSum = a + diffB; // same as b + diffA
    const product = diffA * diffB;
    const result = crossSum * base + product;

    const explanation = [
      `Vedic Nikhilam Method (base ${base}):`,
      `Step 1: Find how far each number is from ${base}`,
      `  ${a} is ${diffA >= 0 ? '+' : ''}${diffA} from ${base}`,
      `  ${b} is ${diffB >= 0 ? '+' : ''}${diffB} from ${base}`,
      `Step 2: Cross-add: ${a} + (${diffB}) = ${crossSum}`,
      `Step 3: Multiply the differences: ${diffA} x ${diffB} = ${product}`,
      `Step 4: Combine: ${crossSum} x ${base} + ${product} = ${crossSum * base} + ${product} = ${result}`,
      `Answer: ${a} x ${b} = ${result}`,
    ].join('\n');

    return { result, explanation };
  }

  // Distributive property fallback for general numbers
  // Split into tens and units for easier mental math
  const aTens = Math.floor(a / 10) * 10;
  const aUnits = a % 10;
  const part1 = aTens * b;
  const part2 = aUnits * b;
  const result = a * b;

  const explanation = [
    `Vedic Distributive Method:`,
    `Step 1: Split ${a} into ${aTens} + ${aUnits}`,
    `Step 2: ${aTens} x ${b} = ${part1}`,
    `Step 3: ${aUnits} x ${b} = ${part2}`,
    `Step 4: Add them up: ${part1} + ${part2} = ${result}`,
    `Answer: ${a} x ${b} = ${result}`,
  ].join('\n');

  return { result, explanation };
}

/**
 * Quick percentage calculation using Vedic "by one more" and fraction tricks.
 * e.g., 15% of 240 = 10% of 240 + 5% of 240 = 24 + 12 = 36
 */
export function percentageOf(percent: number, number: number): VedicResult {
  const result = (percent / 100) * number;

  // Break percentage into easy parts
  const tens = Math.floor(percent / 10) * 10;
  const units = percent % 10;
  const tenPercent = number / 10;
  const tensValue = (tens / 10) * tenPercent;
  const fiveValue = units >= 5 ? tenPercent / 2 : 0;
  const remainder = units >= 5 ? units - 5 : units;
  const onePercent = number / 100;
  const remainderValue = remainder * onePercent;

  const steps = [`Vedic Percentage Shortcut:`];
  steps.push(`Step 1: 10% of ${number} = ${tenPercent} (just move the decimal)`);

  if (tens > 0) {
    steps.push(`Step 2: ${tens}% = ${tens / 10} x ${tenPercent} = ${tensValue}`);
  }

  if (units >= 5) {
    steps.push(`Step 3: 5% = half of 10% = ${tenPercent} / 2 = ${fiveValue}`);
  }

  if (remainder > 0) {
    steps.push(`Step ${units >= 5 ? 4 : 3}: ${remainder}% = ${remainder} x ${onePercent} = ${remainderValue}`);
  }

  const total = tensValue + fiveValue + remainderValue;
  steps.push(`Final: ${tensValue} + ${fiveValue} + ${remainderValue} = ${Math.round(total * 100) / 100}`);
  steps.push(`Answer: ${percent}% of ${number} = ${Math.round(result * 100) / 100}`);

  return { result: Math.round(result * 100) / 100, explanation: steps.join('\n') };
}

/**
 * Cross multiplication for comparing ratios.
 * Useful for comparing price-to-performance across components.
 * Returns which ratio is larger: a/b vs c/d
 * Result: 1 if a/b > c/d, -1 if a/b < c/d, 0 if equal
 */
export function crossMultiplyCompare(
  a: number,
  b: number,
  c: number,
  d: number,
  labelA = 'Option A',
  labelB = 'Option B'
): VedicResult {
  const cross1 = a * d;
  const cross2 = b * c;

  let winner: string;
  let resultCode: number;

  if (cross1 > cross2) {
    winner = `${labelA} (${a}/${b}) is GREATER`;
    resultCode = 1;
  } else if (cross1 < cross2) {
    winner = `${labelB} (${c}/${d}) is GREATER`;
    resultCode = -1;
  } else {
    winner = 'Both ratios are EQUAL';
    resultCode = 0;
  }

  const explanation = [
    `Vedic Cross Multiplication:`,
    `Comparing ${labelA}: ${a}/${b} vs ${labelB}: ${c}/${d}`,
    `Step 1: Cross multiply: ${a} x ${d} = ${cross1}`,
    `Step 2: Cross multiply: ${b} x ${c} = ${cross2}`,
    `Step 3: Compare: ${cross1} vs ${cross2}`,
    `Result: ${winner}`,
    ``,
    `Pro tip: This is great for comparing price/performance ratios!`,
  ].join('\n');

  return { result: resultCode, explanation };
}

/**
 * Digit sum verification (Vedic "Beejank" method).
 * Reduce a number to its digit sum to quickly verify calculations.
 * If A x B = C, then digitSum(A) x digitSum(B) should have the same digit sum as digitSum(C).
 */
export function digitSum(n: number): VedicResult {
  const original = Math.abs(Math.round(n));
  const steps: string[] = [`Vedic Digit Sum (Beejank) for ${original}:`];

  let sum = original;
  let iteration = 0;
  while (sum >= 10 && iteration < 20) {
    const digits = String(sum).split('').map(Number);
    const newSum = digits.reduce((acc, d) => acc + d, 0);
    steps.push(`Step ${iteration + 1}: ${digits.join(' + ')} = ${newSum}`);
    sum = newSum;
    iteration++;
  }

  steps.push(`Digit sum of ${original} = ${sum}`);
  steps.push(``);
  steps.push(`Use this to verify: if A x B = C, then digitSum(A) x digitSum(B) should match digitSum(C)!`);

  return { result: sum, explanation: steps.join('\n') };
}

/**
 * Verify a multiplication using digit sums.
 * Returns 1 if verification passes, 0 if it fails.
 */
export function digitSumVerify(a: number, b: number, product: number): VedicResult {
  const dsA = digitSum(a).result;
  const dsB = digitSum(b).result;
  const dsProduct = digitSum(product).result;
  const expectedDs = digitSum(dsA * dsB).result;
  const correct = expectedDs === dsProduct;

  const explanation = [
    `Verifying: ${a} x ${b} = ${product}`,
    `Digit sum of ${a}: ${dsA}`,
    `Digit sum of ${b}: ${dsB}`,
    `Product of digit sums: ${dsA} x ${dsB} = ${dsA * dsB} -> digit sum: ${expectedDs}`,
    `Digit sum of ${product}: ${dsProduct}`,
    correct
      ? `Matches! The answer is likely correct.`
      : `Does not match! Check your calculation.`,
  ].join('\n');

  return { result: correct ? 1 : 0, explanation };
}

/**
 * Calculate profit margin using Vedic-friendly steps.
 * Profit Margin = (Revenue - Cost) / Revenue * 100
 */
export function calculateProfitMarginVedic(revenue: number, cost: number): VedicResult {
  const profit = revenue - cost;
  const margin = revenue === 0 ? 0 : (profit / revenue) * 100;
  const roundedMargin = Math.round(margin * 100) / 100;

  const explanation: string[] = [
    `Vedic Profit Margin Calculation:`,
    `Step 1: Find the profit: Revenue - Cost = $${revenue} - $${cost} = $${profit}`,
    `Step 2: Divide profit by revenue: $${profit} / $${revenue}`,
  ];

  // Try to simplify the fraction for easier mental math
  if (revenue > 0) {
    const gcd = greatestCommonDivisor(Math.abs(profit), revenue);
    const simplifiedNum = profit / gcd;
    const simplifiedDen = revenue / gcd;
    explanation.push(`  Simplify: ${profit}/${revenue} = ${simplifiedNum}/${simplifiedDen}`);

    if (simplifiedDen <= 20) {
      explanation.push(`  That is easy to convert: ${simplifiedNum}/${simplifiedDen} = ${roundedMargin}%`);
    } else {
      explanation.push(`  = ${roundedMargin}%`);
    }
  }

  explanation.push(`Step 3: Profit margin = ${roundedMargin}%`);

  if (roundedMargin > 0) {
    explanation.push(`Your data center is making money! Nice!`);
  } else if (roundedMargin === 0) {
    explanation.push(`Breaking even - not losing money, but not making any either.`);
  } else {
    explanation.push(`Uh oh, you are losing money! Time to cut costs or boost revenue.`);
  }

  return { result: roundedMargin, explanation: explanation.join('\n') };
}

/**
 * Calculate Power Usage Effectiveness (PUE) with Vedic steps.
 * PUE = Total Facility Power / IT Equipment Power
 * Ideal PUE = 1.0 (impossible), good = 1.2-1.4, average = 1.5-2.0
 */
export function calculatePowerEfficiencyVedic(itPower: number, totalPower: number): VedicResult {
  const pue = itPower === 0 ? 0 : totalPower / itPower;
  const roundedPue = Math.round(pue * 100) / 100;

  const overhead = totalPower - itPower;
  const overheadPercent = itPower === 0 ? 0 : Math.round((overhead / itPower) * 100);

  const explanation = [
    `Vedic PUE Calculation:`,
    `Step 1: Total facility power = ${totalPower}W`,
    `Step 2: IT equipment power = ${itPower}W`,
    `Step 3: Overhead (cooling, lighting, etc.) = ${totalPower} - ${itPower} = ${overhead}W`,
    `Step 4: PUE = ${totalPower} / ${itPower}`,
  ];

  // Simplify the division
  if (itPower > 0) {
    const gcd = greatestCommonDivisor(totalPower, itPower);
    explanation.push(`  Simplify: ${totalPower / gcd} / ${itPower / gcd} = ${roundedPue}`);
  }

  explanation.push(`Step 5: PUE = ${roundedPue}`);
  explanation.push(``);

  if (roundedPue <= 1.2) {
    explanation.push(`Amazing! PUE of ${roundedPue} is world-class efficiency (Google-level)!`);
  } else if (roundedPue <= 1.4) {
    explanation.push(`Great! PUE of ${roundedPue} is very efficient. Well designed!`);
  } else if (roundedPue <= 1.6) {
    explanation.push(`Good. PUE of ${roundedPue} is about average. Room for improvement!`);
  } else {
    explanation.push(`PUE of ${roundedPue} is high. ${overheadPercent}% of power is wasted on overhead!`);
  }

  return { result: roundedPue, explanation: explanation.join('\n') };
}

/**
 * Calculate Return on Investment (ROI) with Vedic-friendly steps.
 * ROI = (Total Returns - Investment) / Investment * 100
 * Also calculates payback period.
 */
export function calculateROI(
  investment: number,
  monthlyRevenue: number,
  monthlyExpenses: number
): VedicResult {
  const monthlyProfit = monthlyRevenue - monthlyExpenses;
  const yearlyProfit = monthlyProfit * 12;
  const roi = investment === 0 ? 0 : (yearlyProfit / investment) * 100;
  const roundedRoi = Math.round(roi * 100) / 100;
  const paybackMonths = monthlyProfit <= 0 ? Infinity : Math.ceil(investment / monthlyProfit);

  const explanation = [
    `Vedic ROI Calculation:`,
    `Step 1: Monthly profit = Revenue - Expenses = $${monthlyRevenue} - $${monthlyExpenses} = $${monthlyProfit}`,
    `Step 2: Yearly profit = $${monthlyProfit} x 12`,
  ];

  // Break down the x12 multiplication
  const times10 = monthlyProfit * 10;
  const times2 = monthlyProfit * 2;
  explanation.push(`  Vedic shortcut: ${monthlyProfit} x 12 = ${monthlyProfit} x 10 + ${monthlyProfit} x 2 = ${times10} + ${times2} = ${yearlyProfit}`);

  explanation.push(`Step 3: ROI = Yearly Profit / Investment x 100`);
  explanation.push(`  = $${yearlyProfit} / $${investment} x 100`);

  if (investment > 0) {
    const gcd = greatestCommonDivisor(Math.abs(yearlyProfit), investment);
    const sNum = yearlyProfit / gcd;
    const sDen = investment / gcd;
    explanation.push(`  Simplify: ${sNum} / ${sDen} x 100 = ${roundedRoi}%`);
  }

  explanation.push(`Step 4: Annual ROI = ${roundedRoi}%`);

  if (monthlyProfit > 0) {
    explanation.push(`Step 5: Payback period = $${investment} / $${monthlyProfit} = ${paybackMonths} months`);
    if (paybackMonths <= 12) {
      explanation.push(`Excellent! You will make back your investment in under a year!`);
    } else if (paybackMonths <= 24) {
      explanation.push(`Good! About ${Math.round(paybackMonths / 12 * 10) / 10} years to pay it off.`);
    } else {
      explanation.push(`That is a long payback period. Can you boost revenue or cut costs?`);
    }
  } else {
    explanation.push(`Warning: Monthly profit is $${monthlyProfit}. You will never pay this off at current rates!`);
  }

  return { result: roundedRoi, explanation: explanation.join('\n') };
}

/**
 * Helper: Greatest Common Divisor (Euclidean algorithm)
 */
function greatestCommonDivisor(a: number, b: number): number {
  a = Math.abs(Math.round(a));
  b = Math.abs(Math.round(b));
  while (b > 0) {
    const temp = b;
    b = a % b;
    a = temp;
  }
  return a || 1;
}

/** Vedic math tips that can be shown throughout the app */
export const vedicTips = [
  {
    id: 'tip-1',
    title: 'The 11x Trick',
    description: 'To multiply any 2-digit number by 11, put the sum of the digits in the middle!',
    example: '72 x 11 -> 7_(7+2)_2 -> 792',
    formula: 'ab x 11 = a(a+b)b',
    applicableTo: 'Quick server count calculations',
  },
  {
    id: 'tip-2',
    title: 'Squaring Numbers Ending in 5',
    description: 'Take the first digit, multiply by (itself + 1), then append 25!',
    example: '35 squared -> 3 x 4 = 12, append 25 -> 1225',
    formula: 'n5 squared = n(n+1) | 25',
    applicableTo: 'Power calculations (watts squared for heat)',
  },
  {
    id: 'tip-3',
    title: '9x Table Finger Trick',
    description: 'Hold up 10 fingers. Fold down the nth finger. Left fingers = tens, right = ones!',
    example: '9 x 7: fold finger 7 -> 6 left, 3 right -> 63',
    formula: '9 x n = (n-1)(9-n+1)',
    applicableTo: 'Quick rack unit calculations',
  },
  {
    id: 'tip-4',
    title: 'Subtracting from 1000',
    description: 'Subtract each digit from 9, except the last from 10. Works for any power of 10!',
    example: '1000 - 647: 9-6=3, 9-4=5, 10-7=3 -> 353',
    formula: '10^n - abc = (9-a)(9-b)(10-c)',
    applicableTo: 'Calculating remaining budget quickly',
  },
  {
    id: 'tip-5',
    title: 'Doubling and Halving',
    description: 'To multiply hard numbers, double one and halve the other until it is easy!',
    example: '25 x 48 -> 50 x 24 -> 100 x 12 = 1200',
    formula: 'a x b = (2a) x (b/2)',
    applicableTo: 'Estimating total rack costs',
  },
  {
    id: 'tip-6',
    title: 'Cross-Multiplication for Comparing',
    description: 'To compare fractions a/b and c/d, cross multiply: if ad > bc then a/b > c/d',
    example: 'Is 3/7 > 5/12? -> 3x12=36, 5x7=35 -> Yes, 3/7 is bigger!',
    formula: 'a/b vs c/d -> compare axd with bxc',
    applicableTo: 'Comparing price-to-performance ratios',
  },
];
