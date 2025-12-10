import fs from "fs";

// const data = fs.readFileSync(`${__dirname}/../input/day9-sample.txt`, "utf-8");
const data = fs.readFileSync(`${__dirname}/../input/input_day9.txt`, "utf-8");

const points = data.split("\n").map((point) => point.split(",").map(Number));

function findBiggestArea(): number {
  let area = 0;
  for (let i = 0; i < points.length; i++) {
    for (let j = i + 1; j < points.length; j++) {
      const p1 = points[i] as [number, number];
      const p2 = points[j] as [number, number];
      const currentArea =
        (Math.abs(p1[0] - p2[0]) + 1) * (Math.abs(p1[1] - p2[1]) + 1);
      if (currentArea > area) {
        area = currentArea;
      }
    }
  }
  return area;
}

function part1(): string {
  console.time("part1");
  const area = findBiggestArea();
  console.timeEnd("part1");
  return `Day 9 - Part 1: ${area}`;
}

console.log(part1());

// Coordinate compression - map large coordinates to small indices
function compressCoordinates() {
  const uniqueX = [...new Set(points.map((p) => p[0] as number))].sort(
    (a, b) => a - b,
  );
  const uniqueY = [...new Set(points.map((p) => p[1] as number))].sort(
    (a, b) => a - b,
  );

  const xToIndex = new Map(uniqueX.map((x, i) => [x, i]));
  const yToIndex = new Map(uniqueY.map((y, i) => [y, i]));

  return { uniqueX, uniqueY, xToIndex, yToIndex };
}

// Build boundary in compressed coordinates
function getBoundaryPoints(
  xToIndex: Map<number, number>,
  yToIndex: Map<number, number>,
): Set<string> {
  const validPoints = new Set<string>();
  for (let i = 0; i < points.length; i++) {
    const p1 = points[i] as [number, number];
    const nextIndex = (i + 1) % points.length;
    const p2 = points[nextIndex] as [number, number];

    const x1 = xToIndex.get(p1[0])!;
    const y1 = yToIndex.get(p1[1])!;
    const x2 = xToIndex.get(p2[0])!;
    const y2 = yToIndex.get(p2[1])!;

    // if the x axis is shared, add the column points between them
    if (x1 === x2) {
      const minY = Math.min(y1, y2);
      const maxY = Math.max(y1, y2);
      for (let j = minY; j <= maxY; j++) {
        validPoints.add(`${x1},${j}`);
      }
    }
    // if the y axis is shared, add the row points between them
    if (y1 === y2) {
      const minX = Math.min(x1, x2);
      const maxX = Math.max(x1, x2);
      for (let j = minX; j <= maxX; j++) {
        validPoints.add(`${j},${y1}`);
      }
    }
  }
  return validPoints;
}

function getInteriorPoints(
  boundary: Set<string>,
  numX: number,
  numY: number,
): Set<string> {
  // Work in compressed coordinate space
  // Expand by 1 to have a guaranteed outside starting point
  const minX = -1;
  const maxX = numX;
  const minY = -1;
  const maxY = numY;

  // Flood fill from outside corner to find all "outside" cells
  const outside = new Set<string>();
  const startKey = `${minX},${minY}`;
  outside.add(startKey);
  const queue: [number, number][] = [[minX, minY]];

  while (queue.length > 0) {
    const [x, y] = queue.shift()!;

    for (const [nx, ny] of [
      [x + 1, y],
      [x - 1, y],
      [x, y + 1],
      [x, y - 1],
    ]) {
      const nKey = `${nx},${ny}`;
      if (nx! < minX || nx! > maxX || ny! < minY || ny! > maxY) continue;
      if (outside.has(nKey) || boundary.has(nKey)) continue;
      outside.add(nKey);
      queue.push([nx!, ny!]);
    }
  }

  // Everything in bounds that's not outside and not boundary = inside
  const interior = new Set<string>();
  for (let x = 0; x < numX; x++) {
    for (let y = 0; y < numY; y++) {
      const key = `${x},${y}`;
      if (!outside.has(key) && !boundary.has(key)) {
        interior.add(key);
      }
    }
  }

  return interior;
}

function findBiggestValidArea(
  boundaryPoints: Set<string>,
  interiorPoints: Set<string>,
  xToIndex: Map<number, number>,
  yToIndex: Map<number, number>,
): number {
  let area = 0;
  for (let i = 0; i < points.length; i++) {
    SECOND_POINT: for (let j = i + 1; j < points.length; j++) {
      const p1 = points[i] as [number, number];
      const p2 = points[j] as [number, number];
      // Calculate actual area using original coordinates
      const currentArea =
        (Math.abs(p1[0] - p2[0]) + 1) * (Math.abs(p1[1] - p2[1]) + 1);
      if (currentArea > area) {
        // Check validity using compressed coordinates
        const cx1 = xToIndex.get(p1[0])!;
        const cy1 = yToIndex.get(p1[1])!;
        const cx2 = xToIndex.get(p2[0])!;
        const cy2 = yToIndex.get(p2[1])!;

        const minCX = Math.min(cx1, cx2);
        const maxCX = Math.max(cx1, cx2);
        const minCY = Math.min(cy1, cy2);
        const maxCY = Math.max(cy1, cy2);

        for (let cx = minCX; cx <= maxCX; cx++) {
          for (let cy = minCY; cy <= maxCY; cy++) {
            const coord = `${cx},${cy}`;
            if (!boundaryPoints.has(coord) && !interiorPoints.has(coord)) {
              continue SECOND_POINT;
            }
          }
        }
        area = currentArea;
      }
    }
  }
  return area;
}

function part2(): string {
  console.time("part2");
  const { uniqueX, uniqueY, xToIndex, yToIndex } = compressCoordinates();
  const boundary = getBoundaryPoints(xToIndex, yToIndex);
  const interior = getInteriorPoints(boundary, uniqueX.length, uniqueY.length);
  const area = findBiggestValidArea(boundary, interior, xToIndex, yToIndex);
  console.timeEnd("part2");
  return `Day 9 - Part 2: ${area}`;
}

console.log(part2());
