#!/usr/bin/env node

const fs = require("fs");
const path = require("path");
const compileAndRun = require("./src/compiler.js");

const filename = process.argv[2];

if (!filename) {
  console.error("Usage: ajj <filename>");
  process.exit(1);
}

const filePath = path.resolve(process.cwd(), filename);

compileAndRun(filePath);