# Advent of Code 2025

This repository contains my solutions for [Advent of Code 2025](https://adventofcode.com/2025).

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```

## Project Structure

```
AoC_2025/
├── input/          # Input files for each day
│   └── input_day1.txt
├── src/            # TypeScript solution files
│   └── day1.ts
├── scripts/        # Helper scripts
└── package.json    # Project configuration
```

## Adding Input

1. Create an input file in the `input/` directory:
   ```
   input/input_day{N}.txt
   ```
   Where `{N}` is the day number (e.g., `input_day1.txt`, `input_day2.txt`)

2. Copy your puzzle input from the Advent of Code website into the file.

## Adding Solution Code

1. Create a new TypeScript file in the `src/` directory:
   ```
   src/day{N}.ts
   ```
   Where `{N}` is the day number (e.g., `day1.ts`, `day2.ts`)

2. Use the following template to read the input file:
   ```typescript
   import fs from "fs";

   const data = fs.readFileSync(`${__dirname}/../input/input_day{N}.txt`, "utf-8");
   
   // Your solution code here
   ```

## Running Solutions

Run a day's solution using one of these methods:

**Method 1: Using npm start with arguments**
```bash
npm start -- 1    # Run day 1
npm start -- 2    # Run day 2
npm start -- 3    # Run day 3
# etc.
```

**Method 2: Using environment variable**
```bash
DAY=1 npm start   # Run day 1
DAY=2 npm start   # Run day 2
DAY=3 npm start   # Run day 3
# etc.
```

**Default behavior:** If no day is specified, it defaults to day 1.

## How It Works

- Uses [tsx](https://github.com/esbuild-kit/tsx) to run TypeScript files directly without compilation
- No build step required - just write TypeScript and run!
- The `scripts/run-day.js` script handles finding and executing the correct day file