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
