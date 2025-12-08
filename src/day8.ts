import fs from "fs";

type Point = [number, number, number];

// const data = fs.readFileSync(`${__dirname}/../input/day8-sample.txt`, "utf-8");
const data = fs.readFileSync(`${__dirname}/../input/input_day8.txt`, "utf-8");
const points = data
  .split("\n")
  .map((line) => line.split(",").map(Number)) as Point[];

function calculateDistance(p1: Point, p2: Point) {
  return Math.sqrt(
    Math.pow(p1[0] - p2[0], 2) +
      Math.pow(p1[1] - p2[1], 2) +
      Math.pow(p1[2] - p2[2], 2),
  );
}

function findAllDistancePairs(): [number, Point, Point][] {
  let result: [number, Point, Point][] = [];
  // iterate through all the combinations once and build a list of the distance between each point
  for (let i = 0; i < points.length; i++) {
    for (let j = i + 1; j < points.length; j++) {
      const distance = calculateDistance(points[i]!, points[j]!);
      result.push([distance, points[i]!, points[j]!]);
    }
  }
  return result;
}

function findCircuitRoot(parentMap: Map<string, string>, point: string): string {
  if (parentMap.get(point) !== point) {
    // this is a connected node
    // we recursively call findCircuitRoot to compress our path
    // instead of having point 1 --> point 2 --> point 3
    // we essentially have point 3 as the root and every other point directly references it
    parentMap.set(point, findCircuitRoot(parentMap, parentMap.get(point)!));
  }
  return parentMap.get(point)!;
}

function mergeCircuits(parentMap: Map<string, string>, point1: string, point2: string): boolean {
  const point1Root = findCircuitRoot(parentMap, point1);
  const point2Root = findCircuitRoot(parentMap, point2);
  if (point1Root === point2Root) {
    // already same circuit
    return false;
  }
  // set point1's root to point2's root
  parentMap.set(point1Root, point2Root);
  return true;
}

function part1(): string {
  console.time("part1");
  const distancePairs = findAllDistancePairs();
  // now we need to sort the results least to greatest and build our circuits
  const sortedDistances = distancePairs.sort((a, b) => a[0] - b[0]);
  // initialize each of our points as its own unconnected circuit node (its root is itself)
  // the key is the point and the value is the root node it is connected to
  // as we make connections we update the value to point to the root of the circuit
  const parentMap = new Map<string, string>();
  for (const point of points) {
    const key = point.join(",");
    parentMap.set(key, key);
  }

  // now we process 1000 pairs, merging circuits as needed
  let processedCount = 0;
  for (const [_, point1, point2] of sortedDistances) {
    if (processedCount >= 1000) {
      break;
    }
    const key1 = point1.join(",");
    const key2 = point2.join(",");
    // if the the root of each point isn't already the same join them and increment connections
    if (findCircuitRoot(parentMap, key1) !== findCircuitRoot(parentMap, key2)) {
      mergeCircuits(parentMap, key1, key2);
    }
    processedCount++;
  }

  // Count circuit sizes
  const circuitSizes = new Map<string, number>();

  for (const point of points) {
    const key = point.join(",");
    const root = findCircuitRoot(parentMap, key);

    // Increment count for this root
    circuitSizes.set(root, (circuitSizes.get(root) ?? 0) + 1);
  }

  // Get the sizes, sort descending, multiply top 3
  const sizes = Array.from(circuitSizes.values());
  sizes.sort((a, b) => b - a);
  const answer = sizes[0]! * sizes[1]! * sizes[2]!;
  console.timeEnd("part1");
  return `Day 8 - Part 1: ${answer}`;
}

console.log(part1());

function part2(): string {
  console.time("part2");
  const distancePairs = findAllDistancePairs();
  const sortedDistances = distancePairs.sort((a, b) => a[0] - b[0]);
  
  const parentMap = new Map<string, string>();
  for (const point of points) {
    const key = point.join(",");
    parentMap.set(key, key);
  }
  
  let successfulMerges = 0;
  let lastMergedPair: [Point, Point] | null = null;
  
  for (const [_, point1, point2] of sortedDistances) {
    const key1 = point1.join(",");
    const key2 = point2.join(",");
    
    if (findCircuitRoot(parentMap, key1) !== findCircuitRoot(parentMap, key2)) {
      mergeCircuits(parentMap, key1, key2);
      successfulMerges++;
      lastMergedPair = [point1, point2];
      
      // Stop when all points are connected
      if (successfulMerges === points.length - 1) {
        break;
      }
    }
  }
  
  const answer = lastMergedPair![0][0] * lastMergedPair![1][0];  // X coords
  console.timeEnd("part2");
  return `Day 8 - Part 2: ${answer}`;
}

console.log(part2());
