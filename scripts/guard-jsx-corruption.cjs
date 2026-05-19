#!/usr/bin/env node
/*
  Guard script for JSX source corruption checks.
  It scans common source files for a few high-signal corruption markers.
*/

const fs = require('node:fs');
const path = require('node:path');

const ROOT = process.cwd();
const SRC_DIRS = ['src'];
const EXTENSIONS = new Set(['.js', '.jsx', '.ts', '.tsx', '.mjs', '.cjs']);
const IGNORE_DIRS = new Set(['node_modules', '.next', '.git']);

const PATTERNS = [
  { label: 'Unicode replacement character', regex: /\uFFFD/ },
  { label: 'Git conflict marker', regex: /^<{7}|^={7}|^>{7}/m },
  { label: 'NUL byte', regex: /\u0000/ }
];

function walk(dir, files) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      if (IGNORE_DIRS.has(entry.name)) continue;
      walk(fullPath, files);
      continue;
    }

    if (!entry.isFile()) continue;
    const ext = path.extname(entry.name);
    if (EXTENSIONS.has(ext)) files.push(fullPath);
  }
}

function checkFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const issues = [];

  for (const pattern of PATTERNS) {
    if (pattern.regex.test(content)) {
      issues.push(pattern.label);
    }
  }

  return issues;
}

function main() {
  const files = [];

  for (const dir of SRC_DIRS) {
    const target = path.join(ROOT, dir);
    if (fs.existsSync(target)) {
      walk(target, files);
    }
  }

  const failures = [];

  for (const file of files) {
    const issues = checkFile(file);
    if (issues.length > 0) {
      failures.push({
        file: path.relative(ROOT, file),
        issues
      });
    }
  }

  if (failures.length > 0) {
    console.error('\nJSX corruption guard failed.\n');
    for (const failure of failures) {
      console.error(`- ${failure.file}: ${failure.issues.join(', ')}`);
    }
    console.error('\nPlease fix the flagged files and try again.');
    process.exit(1);
  }

  console.log('JSX corruption guard passed.');
}

main();
