import fs from "fs";

const data = fs.readFileSync(`${__dirname}/../input/input_day5.txt`, "utf-8");
const parsedData = data.split("\n");
const dividerIndex = parsedData.findIndex((line) => line === "");
const ranges = parsedData.slice(0, dividerIndex);
const ids = parsedData.slice(dividerIndex + 1).map(Number);

function condenseRanges(ranges: string[]): [number, number][] {
  const condensedRanges: [number, number][] = [];
  const sortedRanges = ranges
    .map((range) => range.split("-").map(Number))
    .sort((a, b) => a[0]! - b[0]!) as [number, number][];
  for (const [currentStart, currentEnd] of sortedRanges) {
    if (condensedRanges.length === 0) {
      condensedRanges.push([currentStart, currentEnd]);
      continue;
    }
    const [previousStart, previousEnd] =
      condensedRanges[condensedRanges.length - 1]!;
    if (currentStart <= previousEnd + 1 && currentEnd >= previousEnd) {
      // we can extend the previous range
      condensedRanges[condensedRanges.length - 1] = [previousStart, currentEnd];
    } else if (currentStart <= previousEnd + 1 && currentEnd <= previousEnd) {
      // the previous range contains the current range
      // that means we can just leave the current range out of the condensed ranges
      continue;
    } else {
      // there is no overlap, so add this range to the condensed ranges
      condensedRanges.push([currentStart, currentEnd]);
    }
  }
  return condensedRanges;
}

function isIncludedInRange(id: number, ranges: [number, number][]): boolean {
  let left = 0;
  let right = ranges.length - 1;
  
  while (left <= right) {
    const mid = Math.floor((left + right) / 2);
    const [start, end] = ranges[mid]!;
    
    if (id >= start && id <= end) {
      // Found in this range
      return true;
    } else if (id < start) {
       // Search left half
      right = mid - 1;
    } else {
       // Search right half (id > end)
      left = mid + 1;
    }
  }
  // If we get here, the ID was not found in any of the ranges
  return false;
}

function part1(): string {
  console.time("part1");
  let freshIngredients = 0;
  const condensedRanges = condenseRanges(ranges);
  for (const id of ids) {
    if (isIncludedInRange(id, condensedRanges)) {
      freshIngredients++;
    }
  }
  console.timeEnd("part1");
  return `Day 5 - Part 1: ${freshIngredients}`;
}

console.log(part1());

function part2(): string {
  console.time("part2");
  const condensedRanges = condenseRanges(ranges);
  let allFreshIdsCount = 0;
  for (const [start, end] of condensedRanges) {
    allFreshIdsCount += end - start + 1;
  }
  console.timeEnd("part2");
  return `Day 5 - Part 2: ${allFreshIdsCount}`;
}

console.log(part2());
