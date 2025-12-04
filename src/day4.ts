import fs from "fs";

const data = fs.readFileSync(`${__dirname}/../input/input_day4.txt`, "utf-8");
const grid: string[][] = data.split("\n").map((row) => row.split(""));

function part1(): string {
  console.time("part1");
  let rollCount = 0;
  for (let i = 0; i < grid.length; i++) {
    const currentRow = grid[i]!;
    for (let j = 0; j < currentRow.length; j++) {
      if (currentRow[j] !== "@") continue;
      // check all existing adjacent positions for rolls - "@", if we have atleast four the roll doesn't count.
      //...123....
      //...4@5....
      //...678....
      const adjacentPositions: [row: number, column: number][] = [
        [i - 1, j - 1],
        [i - 1, j],
        [i - 1, j + 1],
        [i, j - 1],
        [i, j + 1],
        [i + 1, j - 1],
        [i + 1, j],
        [i + 1, j + 1],
      ];
      let touchingRolls = 0;
      for (const position of adjacentPositions) {
        const [row, column] = position;
        if (grid[row]?.[column] === "@") {
          touchingRolls++;
        }
      }
      if (touchingRolls < 4) {
        rollCount++;
      }
    }
  }
  console.timeEnd("part1");
  return `Day 4 - Part 1: ${rollCount}`;
}

console.log(part1());

function part2(): string {
  console.time("part2");
  let rollCount = 0;
  let rollsRemoved: number | undefined;
  while (rollsRemoved !== 0) {
    rollsRemoved = 0;
    for (let i = 0; i < grid.length; i++) {
      for (let j = 0; j < grid[i]!.length; j++) {
        if (grid[i]![j] !== "@") continue;
        const adjacentPositions: [row: number, column: number][] = [
          [i - 1, j - 1],
          [i - 1, j],
          [i - 1, j + 1],
          [i, j - 1],
          [i, j + 1],
          [i + 1, j - 1],
          [i + 1, j],
          [i + 1, j + 1],
        ];
        let touchingRolls = 0;
        for (const position of adjacentPositions) {
          const [row, column] = position;
          if (grid[row]?.[column] === "@") {
            touchingRolls++;
          }
        }
        if (touchingRolls < 4) {
          rollCount++;
          rollsRemoved++;
          grid[i]![j] = "x";
        }
      }
    }
  }
  console.timeEnd("part2");
  return `Day 4 - Part 2: ${rollCount}`;
}

console.log(part2());
