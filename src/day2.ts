import fs from "fs";

type Range = [number, number];
const data = fs.readFileSync(`${__dirname}/../input/input_day2.txt`, "utf-8");
const ranges: Range[] = data
  .split(",")
  .map((range) => range.split("-").map(Number) as Range);

function part1(): string {
  console.time("part1");
  let count = 0;
  for (const range of ranges) {
    const range1 = range[0];
    const range2 = range[1];
    // if no number in the range is an even length we can skip the range
    if (
      range1.toString().length % 2 !== 0 &&
      range2.toString().length % 2 !== 0
    ) {
      continue;
    }
    for (let i = range1; i <= range2; i++) {
      const numString = i.toString();
      // first some easy checks
      if (numString.length < 2) continue; // single digit can't be repeated
      if (numString.length % 2 !== 0) continue; // uneven length can't have contiguous repeated patterns
      // split the current Id in half, if they match, we have a hit -> add the current ID
      let leftHalf = numString.slice(0, numString.length / 2);
      let rightHalf = numString.slice(numString.length / 2);
      if (leftHalf === rightHalf) {
        count += i;
      }
    }
  }
  console.timeEnd("part1");
  return `Day 2 - Part 1: ${count}`;
}

console.log(part1());

function part1Optimized(): string {
  console.time("part1-optimized");
  let totalSum = 0;

  for (const [rangeStart, rangeEnd] of ranges) {
    // For each possible half-length (1 to ~10 covers up to 20-digit numbers)
    for (let halfLen = 1; halfLen <= 10; halfLen++) {
      const multiplier = 10 ** halfLen + 1;

      // Pattern must be in range [10^(halfLen-1), 10^halfLen - 1]
      // Exception: for halfLen=1, pattern range is [1, 9]
      const minPatternForLength = halfLen === 1 ? 1 : 10 ** (halfLen - 1);
      const maxPatternForLength = 10 ** halfLen - 1;

      // Find patterns that produce IDs in our range
      let minPattern = Math.ceil(rangeStart / multiplier);
      let maxPattern = Math.floor(rangeEnd / multiplier);

      // Clamp to valid pattern range
      minPattern = Math.max(minPattern, minPatternForLength);
      maxPattern = Math.min(maxPattern, maxPatternForLength);

      if (minPattern > maxPattern) continue;

      // Sum using arithmetic series: n × (first + last) / 2, then multiply by multiplier
      const count = maxPattern - minPattern + 1;
      const sumOfPatterns = (count * (minPattern + maxPattern)) / 2;
      totalSum += multiplier * sumOfPatterns;
    }
  }

  console.timeEnd("part1-optimized");
  return `Day 2 - Part 1 (optimized): ${totalSum}`;
}

console.log(part1Optimized());

function part2(): string {
  console.time("part2");
  let count = 0;
  for (const range of ranges) {
    const range1 = range[0];
    const range2 = range[1];
    for (let i = range1; i <= range2; i++) {
      const numString = i.toString();
      // first some easy checks
      if (numString.length < 2) continue; // single digit can't be repeated
      let divisibleByNums: number[] = [];
      for (let j = 1; j <= numString.length / 2; j++) {
        if (numString.length % j === 0) {
          divisibleByNums.push(j);
        }
      }
      for (const dividend of divisibleByNums) {
        // get the base pattern for the current dividend
        const pattern = numString.slice(0, dividend);
        // now construct what a repeating string WOULD look like with the current pattern
        // then check to see if that matches the current ID we're looking at. 
        const repeatedPattern = pattern.repeat(numString.length / dividend);
        if (repeatedPattern === numString) {
          count += i;
          break;
        }
      }
    }
  }
  console.timeEnd("part2");
  return `Day 2 - Part 2: ${count}`;
}

console.log(part2());

function part2Optimized(): string {
  console.time("part2-optimized");
  let totalSum = 0;

  for (const [rangeStart, rangeEnd] of ranges) {
    const seen = new Set<number>();

    // For each total digit count d from 2 to ~11
    for (let d = 2; d <= 11; d++) {
      // For each divisor of d that gives us repetition count k >= 2
      for (let k = 2; k <= d; k++) {
        if (d % k !== 0) continue;
        const h = d / k; // pattern length

        // multiplier = 10^(d-h) + 10^(d-2h) + ... + 1 = (10^d - 1) / (10^h - 1)
        const multiplier = (10 ** d - 1) / (10 ** h - 1);

        const minPatternForLength = h === 1 ? 1 : 10 ** (h - 1);
        const maxPatternForLength = 10 ** h - 1;

        let minPattern = Math.ceil(rangeStart / multiplier);
        let maxPattern = Math.floor(rangeEnd / multiplier);

        minPattern = Math.max(minPattern, minPatternForLength);
        maxPattern = Math.min(maxPattern, maxPatternForLength);

        for (let p = minPattern; p <= maxPattern; p++) {
          const invalidId = p * multiplier;
          if (!seen.has(invalidId)) {
            seen.add(invalidId);
            totalSum += invalidId;
          }
        }
      }
    }
  }

  console.timeEnd("part2-optimized");
  return `Day 2 - Part 2 (optimized): ${totalSum}`;
}

console.log(part2Optimized());