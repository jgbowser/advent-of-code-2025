import fs from "fs";

const data = fs.readFileSync(`${__dirname}/../input/input_day6.txt`, "utf-8");

function part1(): string {
  console.time("part1");
  const parsedData: string[][] = data
    .split("\n")
    .map((row) => row.split(" ").filter((element) => element !== ""));

  let totalSum = 0;
  const operatorRow = parsedData.pop() as string[];
  const numberOfProblems = operatorRow.length - 1;
  for (let i = 0; i < numberOfProblems; i++) {
    const problemOperator = operatorRow[i] as "+" | "*";
    let problemResult = problemOperator === "+" ? 0 : 1;
    for (let j = 0; j < parsedData.length; j++) {
      const parsedNumber = Number(parsedData[j]?.[i]);
      problemResult =
        problemOperator === "+"
          ? (problemResult += parsedNumber)
          : (problemResult *= parsedNumber);
    }
    totalSum += problemResult;
  }
  console.timeEnd("part1");
  return `Day 6 - Part 1: ${totalSum}`;
}

console.log(part1());

function part2(): string {
  console.time("part2");
  let totalSum = 0;
  // we'll need to keep each row as its original string so we can maintain the columnar placement of numbers
  const rows: string[] = data.split("\n");
  // pop off the operand row so we don't need to deal with it
  const operandArray = (rows.pop() as string).replaceAll(" ", "").split("");
  // now we need to walk backwards and build numbers from top to bottom
  // we'll build the number for each column and push it into an array
  // we hit the end of our problem column when we have a column of all " "
  // then we check the last operand, perform the arithmetic based off that, add the result to the total, then pop off the operand.
  const columnHeight = rows.length - 1;
  const rowLength = (rows[0]?.length ?? 0) - 1;
  // we start at the last columnIndex of the top row, move down through the row til we hit the bottom, then decrement our column
  let numString = "";
  let problemNums: number[] = [];
  for (let colIndex = rowLength; colIndex >= 0; colIndex--) {
    for (let rowIndex = 0; rowIndex <= columnHeight; rowIndex++) {
      numString += rows[rowIndex]?.[colIndex];
    }
    problemNums.push(Number(numString));
    numString = "";
    // Number("    ") === 0
    if (problemNums.at(-1) === 0 || colIndex === 0) {
      if (problemNums.at(-1) === 0) {
        problemNums.pop();
      }
      const operand = operandArray.pop() as "+" | "*";
      let result = operand === "+" ? 0 : 1;
      problemNums.forEach((value) => {
        if (operand === "+") {
          result += value;
        } else {
          result *= value;
        }
      });
      totalSum += result;
      problemNums = [];
    }
  }
  console.timeEnd("part2");
  return `Day 6 - Part 2: ${totalSum}`;
}

console.log(part2());
