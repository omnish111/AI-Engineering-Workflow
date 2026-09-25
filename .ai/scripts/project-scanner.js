/**
 * project-scanner.js
 * Scans an existing external project directory and produces structured metadata:
 * - Tech stack detection (Framework, Language, Styling, DB/ORM, Testing, Auth)
 * - Project structure and file statistics
 * - Key entry points, routes, and models
 * Pure Node.js - Zero external npm dependencies.
 */

const fs = require('fs');
const path = require('path');

const IGNORED_DIRS = new Set([
  'node_modules',
  '.git',
  '.next',
  '.cache',
  'dist',
  'build',
  'out',
  'coverage',
  '.turbo',
  '.vscode',
  '.idea'
]);

function scanProject(targetDir) {
  if (!fs.existsSync(targetDir)) {
    throw new Error(`Target directory does not exist: ${targetDir}`);
  }

  const resolvedTarget = path.resolve(targetDir);
  const projectName = path.basename(resolvedTarget);

  const stats = {
    targetDir: resolvedTarget,
    projectName,
    scannedAt: new Date().toISOString(),
    packageJson: null,
    lockfile: null,
    framework: 'unknown',
    language: 'javascript',
    styling: 'vanilla-css',
    database: 'none',
    orm: 'none',
    testing: 'none',
    auth: 'none',
    packageManager: 'npm',
    scripts: {},
    dependencies: {},
    devDependencies: {},
    fileCount: 0,
    totalLoc: 0,
    extensions: {},
    routes: [],
    models: [],
    structure: []
  };

  // 1. Detect package.json and lockfiles
  const pkgPath = path.join(resolvedTarget, 'package.json');
  if (fs.existsSync(pkgPath)) {
    try {
      const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
      stats.packageJson = {
        name: pkg.name || projectName,
        version: pkg.version || '1.0.0',
        description: pkg.description || ''
      };
      stats.scripts = pkg.scripts || {};
      stats.dependencies = pkg.dependencies || {};
      stats.devDependencies = pkg.devDependencies || {};
    } catch (e) {
      console.warn(`Warning: Could not parse package.json: ${e.message}`);
    }
  }

  // Detect lockfile / package manager
  if (fs.existsSync(path.join(resolvedTarget, 'pnpm-lock.yaml'))) {
    stats.packageManager = 'pnpm';
  } else if (fs.existsSync(path.join(resolvedTarget, 'yarn.lock'))) {
    stats.packageManager = 'yarn';
  } else if (fs.existsSync(path.join(resolvedTarget, 'bun.lockb')) || fs.existsSync(path.join(resolvedTarget, 'bun.lock'))) {
    stats.packageManager = 'bun';
  } else if (fs.existsSync(path.join(resolvedTarget, 'package-lock.json'))) {
    stats.packageManager = 'npm';
  }

  // 2. Scan directory tree
  function walk(currentDir, depth = 0) {
    if (depth > 6) return; // Prevent excessive recursion
    let entries = [];
    try {
      entries = fs.readdirSync(currentDir, { withFileTypes: true });
    } catch (err) {
      return;
    }

    for (const entry of entries) {
      if (IGNORED_DIRS.has(entry.name)) continue;

      const fullPath = path.join(currentDir, entry.name);
      const relativePath = path.relative(resolvedTarget, fullPath);

      if (entry.isDirectory()) {
        if (depth < 2) {
          stats.structure.push({ type: 'dir', path: relativePath });
        }
        walk(fullPath, depth + 1);
      } else if (entry.isFile()) {
        stats.fileCount++;
        const ext = path.extname(entry.name).toLowerCase() || 'no-ext';
        stats.extensions[ext] = (stats.extensions[ext] || 0) + 1;

        // Route detection
        if (
          relativePath.includes('app' + path.sep) ||
          relativePath.includes('pages' + path.sep) ||
          relativePath.includes('routes' + path.sep) ||
          relativePath.includes('controllers' + path.sep)
        ) {
          if (['.js', '.jsx', '.ts', '.tsx'].includes(ext)) {
            stats.routes.push(relativePath.replace(/\\/g, '/'));
          }
        }

        // Model / Schema detection
        if (
          relativePath.includes('models' + path.sep) ||
          relativePath.includes('schema' + path.sep) ||
          relativePath.includes('entities' + path.sep) ||
          entry.name.endsWith('.model.ts') ||
          entry.name.endsWith('.schema.ts') ||
          entry.name.endsWith('.prisma')
        ) {
          stats.models.push(relativePath.replace(/\\/g, '/'));
        }

        // Approximate LOC for source files
        if (['.js', '.jsx', '.ts', '.tsx', '.py', '.go', '.html', '.css'].includes(ext)) {
          try {
            const content = fs.readFileSync(fullPath, 'utf8');
            stats.totalLoc += content.split('\n').length;
          } catch (e) {}
        }
      }
    }
  }

  walk(resolvedTarget);

  // 3. Infer Technologies from Dependencies & File Extensions
  const allDeps = { ...stats.dependencies, ...stats.devDependencies };

  // Language
  if (stats.extensions['.ts'] || stats.extensions['.tsx'] || fs.existsSync(path.join(resolvedTarget, 'tsconfig.json'))) {
    stats.language = 'typescript';
  } else {
    stats.language = 'javascript';
  }

  // Framework
  if (allDeps['next']) stats.framework = 'next.js';
  else if (allDeps['@nestjs/core']) stats.framework = 'nestjs';
  else if (allDeps['express']) stats.framework = 'express';
  else if (allDeps['vue'] || allDeps['nuxt']) stats.framework = allDeps['nuxt'] ? 'nuxt' : 'vue';
  else if (allDeps['@angular/core']) stats.framework = 'angular';
  else if (allDeps['svelte'] || allDeps['@sveltejs/kit']) stats.framework = 'svelte';
  else if (allDeps['react']) stats.framework = 'react';

  // Styling
  if (allDeps['tailwindcss']) stats.styling = 'tailwind-css';
  else if (allDeps['@chakra-ui/react']) stats.styling = 'chakra-ui';
  else if (allDeps['styled-components']) stats.styling = 'styled-components';
  else if (stats.extensions['.scss'] || stats.extensions['.sass']) stats.styling = 'sass';

  // Database / ORM
  if (allDeps['mongoose']) {
    stats.database = 'mongodb';
    stats.orm = 'mongoose';
  } else if (allDeps['@prisma/client'] || allDeps['prisma']) {
    stats.orm = 'prisma';
    stats.database = 'sql-or-mongo';
  } else if (allDeps['typeorm']) {
    stats.orm = 'typeorm';
  } else if (allDeps['drizzle-orm']) {
    stats.orm = 'drizzle';
  } else if (allDeps['pg'] || allDeps['postgres']) {
    stats.database = 'postgresql';
  } else if (allDeps['mysql2'] || allDeps['mysql']) {
    stats.database = 'mysql';
  }

  // Testing
  if (allDeps['jest']) stats.testing = 'jest';
  else if (allDeps['vitest']) stats.testing = 'vitest';
  else if (allDeps['playwright'] || allDeps['@playwright/test']) stats.testing = 'playwright';
  else if (allDeps['cypress']) stats.testing = 'cypress';

  // Auth
  if (allDeps['next-auth'] || allDeps['@auth/core']) stats.auth = 'next-auth';
  else if (allDeps['@clerk/nextjs'] || allDeps['@clerk/clerk-react']) stats.auth = 'clerk';
  else if (allDeps['jsonwebtoken'] || allDeps['passport']) stats.auth = 'jwt-passport';
  else if (allDeps['firebase']) stats.auth = 'firebase-auth';

  // Cap route & model listing to top 30 for token brevity
  if (stats.routes.length > 30) stats.routes = stats.routes.slice(0, 30);
  if (stats.models.length > 20) stats.models = stats.models.slice(0, 20);

  return stats;
}

// CLI Execution Support
if (require.main === module) {
  const target = process.argv[2];
  if (!target) {
    console.error('Usage: node project-scanner.js <targetDirectory> [--output <jsonFile>]');
    process.exit(1);
  }

  try {
    const results = scanProject(target);
    const outputIdx = process.argv.indexOf('--output');
    if (outputIdx !== -1 && process.argv[outputIdx + 1]) {
      fs.writeFileSync(process.argv[outputIdx + 1], JSON.stringify(results, null, 2), 'utf8');
      console.log(`Scan written to ${process.argv[outputIdx + 1]}`);
    } else {
      console.log(JSON.stringify(results, null, 2));
    }
  } catch (err) {
    console.error(`Scan error: ${err.message}`);
    process.exit(1);
  }
}

module.exports = { scanProject };
