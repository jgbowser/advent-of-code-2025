import fs from "fs";

const data = fs.readFileSync(`${__dirname}/../input/input_day7.txt`, "utf-8");
const diagram = data.split("\n");

function part1(): string {
  console.time("part1");
  let totalSplits = 0;
  const beamMap: Record<number, boolean> = {};
  const splitterMap: Record<number, boolean> = {};
  const beamStartIndex = diagram[0]?.indexOf("S") as number;
  // build the beam map and splitter map
  for (let i = 0; i <= diagram[0]!.length; i++) {
    if (i === beamStartIndex) {
      beamMap[i] = true;
    } else {
      beamMap[i] = false;
    }
    splitterMap[i] = false;
  }
  // iterate through diagram (can start at 2 and skip every other row)
  for (let i = 2; i < diagram.length; i += 2) {
    // get indices of all splitters
    const row = diagram[i] as string;
    let currIndex = row.indexOf("^");
    while (currIndex !== -1) {
      // if a splitter is true that means a column that was a beam has been split and the beam isn't present anymore
      if (beamMap[currIndex] === true && !splitterMap[currIndex]) {
        totalSplits++;
        const leftIndex = currIndex - 1;
        const rightIndex = currIndex + 1;
        if (leftIndex >= 0) {
          beamMap[leftIndex] = true;
          // if beam is moving into a column that has an active splitter, toggle it so our check above works correctly
          if (splitterMap[leftIndex]) {
            splitterMap[leftIndex] = false;
          }
        }
        if (rightIndex <= row.length - 1) {
          beamMap[rightIndex] = true;
          if (splitterMap[rightIndex]) {
            splitterMap[rightIndex] = false;
          }
        }
      }
      splitterMap[currIndex] = true;
      currIndex = row.indexOf("^", currIndex + 2); // splitters aren't adjacent so we can add 2 instead of 1
    }
  }
  console.timeEnd("part1");
  return `Day 7 - Part 1: ${totalSplits}`;
}

console.log(part1());

function part2(): string {
  console.time("part1");
  let totalTimelines = 0;
  const diagramHeight = diagram.length;
  const diagramWidth = diagram[0]?.length as number;
  // first we find our start point
  const startCoords = [0, diagram[0]!.indexOf("S")] as [number, number];
  // we need to recursively follow every path down from the start point.
  // if we land on a "." we recurse straight down
  // if we land on a "^" we recurse down one column to the left and one column to the right
  // if we go out of bounds return
  // if we hit the height increment our counter and return

  // well.... worked well for the example, real input was probably about to crash the program (ran for ~30 secs before I killed it)
  // So, we should use memoization (thanks computerphile)
  // we'll cache the number of paths from encountered coords so we don't have to recompute every time we hit a previously seen spot
  const cache: Map<string, number> = new Map();
  function pathSearch(row: number, col: number): number {
    if (col < 0 || col >= diagramWidth) {
      return 0;
    }

    if (row === diagramHeight - 1) {
      return 1;
    }

    const cacheKey = `${row},${col}`;
    if (cache.has(cacheKey)) {
      return cache.get(cacheKey)!;
    }

    let paths = 0;
    if (diagram[row + 1]![col] === ".") {
      paths += pathSearch(row + 1, col);
    }
    if (diagram[row + 1]![col] === "^") {
      paths += pathSearch(row + 1, col - 1);
      paths += pathSearch(row + 1, col + 1);
    }

    cache.set(cacheKey, paths);
    return paths
  }

  totalTimelines = pathSearch(startCoords[0], startCoords[1]);
  console.timeEnd("part1");
  return `Day 7 - Part 2: ${totalTimelines}`;
}

console.log(part2());
