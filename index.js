#!/usr/bin/env node
// DADB Academy Course Automator
// Developed by Kshitij Shingare
// Main Entry Point

const { runEngine } = require('./src/engine');

runEngine().catch(err => {
  console.error('\n[EXECUTION ERROR]', err.message);
  process.exit(1);
});
