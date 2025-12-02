#!/usr/bin/env node
const { spawn } = require('child_process');
const path = require('path');

// Get day number from command line arguments (after --) or environment variable
// npm start -- 1 or DAY=1 npm start
const day = process.argv[2] || process.env.DAY || '1';

const dayFile = path.join(__dirname, '..', 'src', `day${day}.ts`);

console.log(`Running day ${day}...\n`);

const tsx = spawn('npx', ['tsx', dayFile], {
  stdio: 'inherit',
  shell: true
});

tsx.on('close', (code) => {
  process.exit(code || 0);
});

