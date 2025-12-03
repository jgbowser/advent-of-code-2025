import fs from "fs";

const data = fs.readFileSync(`${__dirname}/../input/input_day3.txt`, "utf-8");
const banks = data.split("\n");

function part1(): string {
  console.time("part1");
  let totalSum = 0;
  for (const bank of banks) {
    const combinations: string[] = [];
    for (let i = 0; i < bank.length; i++) {
      for (let j = i + 1; j < bank.length; j++) {
        combinations.push(`${bank[i]}${bank[j]}`);
      }
    }
    totalSum += Math.max(...combinations.map(combination => Number(combination)));
  }
  console.timeEnd("part1");

  return `Day 3 - Part 1: ${totalSum}`;
}

console.log(part1());

function part2(): string {
  console.time("part2");
  let totalSum = 0;
  for (const bank of banks) {
    // we need to find 12 digits
    // the farthest the first high digit can be is the 12th to last digit.
    // so we have a shrinking range of options as we select digits, until we just need to take everything remaining.
    let combination = "";
    let lastSelectedDigitIndex = -1;
    // our loop will run until we have selected 12 digits.
    for (let i = 0; i < 12; i++) {
      // figure out how many digits are left to pick, and use that to define our range.
      const digitsRemainingToPick = 12 - i;
      let rangeStart = lastSelectedDigitIndex + 1; // this value will increase as we select digits.
      let rangeEnd = bank.length - digitsRemainingToPick; // this value will also increase, meaning our range gets closer to the end of the bank

      let highestNum = "0";
      let highestNumIndex = rangeStart;

      for (let j = rangeStart; j<= rangeEnd; j++) {
        const digit = bank[j];
        if (digit !== undefined && digit > highestNum) {
          highestNum = digit;
          highestNumIndex = j;
        }
      }

      // we found our best digit in the range, add it to our combination and save our next range start.
      combination += highestNum;
      lastSelectedDigitIndex = highestNumIndex;
    }

    totalSum += Number(combination);
  }
  console.timeEnd("part2");
  return `Day 3 - Part 2: ${totalSum}`;
}

console.log(part2());
