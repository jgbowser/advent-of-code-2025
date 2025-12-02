import fs from "fs";

const data = fs.readFileSync(`${__dirname}/../input/input_day1.txt`, "utf-8");
// create a list of instruction. Lines starting in "R" are positive, lines starting in "L" are negative.
const instructions = data.split("\n").map((line) => {
  const direction = line.startsWith("R") ? 1 : -1;
  const distance = parseInt(line.slice(1));
  return direction * distance;
});

function part1(): string {
  console.time("part1");
  let dialPosition = 50;
  let timesLandedOnZero = 0;

  for (const instruction of instructions) {
    // any time the dial position stops at 0 (evenly divisible by 100), increment the timesLandedOnZero counter
    dialPosition += instruction;
    if (dialPosition % 100 === 0) {
      timesLandedOnZero++;
    }
  }
  console.timeEnd("part1");
  return `Day 1 - Part 1: ${timesLandedOnZero}`;
}

console.log(part1());

function part2(): string {
  console.time("part2:1");
  let dialPosition = 50;
  let timesPassedZero = 0;

  for (const instruction of instructions) {
    let previousPosition = dialPosition;
    const simplifiedTurns = Math.abs(instruction % 100); // this gives us the +/- number of turns without any of the extra 100ths or 100ths places.
    const hundredsOfTurns = Math.abs(instruction) - simplifiedTurns;
    // for each hundred turns we must pass 0 once
    timesPassedZero += hundredsOfTurns / 100;
    if (simplifiedTurns === 0) {
      // however many hundreds of turns we have, we end up where we started. Nothing else needs to be done.
      continue;
    }
    const moves = instruction > 0 ? simplifiedTurns : simplifiedTurns * -1;
    const positionAfterMove = previousPosition + moves;
    if (instruction < 0) {
      // we're moving left
      // if we are negative that means we passed 0
      // increment, then figure out what our new dial position is by adding 100 to get our new dial position.
      if (positionAfterMove < 0) {
        timesPassedZero++;
        dialPosition = positionAfterMove + 100;
        continue;
      } else if (positionAfterMove === 0 && previousPosition !== 0) {
        timesPassedZero++;
        dialPosition = 0;
        continue;
      } else {
        dialPosition = positionAfterMove;
        continue;
      }
    }
    if (instruction > 0) {
      // we're moving right
      if (positionAfterMove > 99) {
        if (positionAfterMove === 100 && previousPosition === 0) {
          continue;
        }
        timesPassedZero++;
        dialPosition = positionAfterMove - 100;
        continue;
      } else {
        dialPosition = positionAfterMove;
        continue;
      }
    }
  }
  console.timeEnd("part2:1");
  return `Day 1 - Part 2: ${timesPassedZero}`;
}

function part2ThatWorks(): string {
  console.time("part2:2");
  let timesPassedZero = 0;
  let dialPosition = 50;

  for (const instruction of instructions) {
    for (let i = 0; i < Math.abs(instruction); i++) {
      dialPosition = instruction < 0 ? dialPosition - 1 : dialPosition + 1;
      if (dialPosition === 0 || dialPosition % 100 === 0) {
        timesPassedZero++;
      }
    }
  }
  console.timeEnd("part2:2");
  return `Day 1 - Part 2 - That Works: ${timesPassedZero}`;
}

console.log(part2());
console.log(part2ThatWorks());
