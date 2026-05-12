/**
 * FrameDoctor - Framework Detector
 * Automatically detects the frontend framework used in a project
 */

import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { join, resolve } from 'node:path';
import type { Framework, FrameworkDetection } from '../types.js';

/**
 * Detect the frontend framework used in a project directory
 */
export function detectFramework(projectPath: string): FrameworkDetection {
  const absPath = resolve(projectPath);
  const evidence: string[] = [];
  let framework: Framework = 'unknown';
  let confidence = 0;
  let version: string | undefined;
  let packageManager: FrameworkDetection['packageManager'] = 'unknown';
  let buildTool = 'unknown';

  // 1. Read package.json if exists
  let pkg: Record<string, any> = {};
  const pkgPath = join(absPath, 'package.json');
  if (existsSync(pkgPath)) {
    try {
      const raw = readFileSync(pkgPath, 'utf-8');
      pkg = JSON.parse(raw);
    } catch {
      // Invalid package.json
    }
  }

  const deps = { ...pkg.dependencies, ...pkg.devDependencies };
  const depKeys = Object.keys(deps);

  // 2. Detect framework from dependencies
  // Vue detection
  if (deps['vue'] || deps['vue-router'] || deps['pinia'] || deps['vuex']) {
    framework = 'vue';
    confidence = 0.9;
    version = deps['vue'] || deps['vue-router'];
    if (deps['vue']) evidence.push('package.json: vue dependency');
    if (deps['vue-router']) evidence.push('package.json: vue-router dependency');
    if (deps['pinia']) evidence.push('package.json: pinia dependency');
    if (deps['vuex']) evidence.push('package.json: vuex dependency');
    // Check for Vue 2 vs Vue 3 indicators
    if (deps['@vue/composition-api']) {
      evidence.push('package.json: @vue/composition-api (Vue 2 + Composition API)');
    }
  }

  // React detection
  if (deps['react'] || deps['react-dom']) {
    const reactConf = 0.9;
    if (reactConf > confidence) {
      framework = 'react';
      confidence = reactConf;
      version = deps['react'];
      evidence.length = 0;
    }
    if (deps['react']) evidence.push('package.json: react dependency');
    if (deps['react-dom']) evidence.push('package.json: react-dom dependency');
    if (deps['next']) evidence.push('package.json: next.js dependency');
    if (deps['@remix-run/react']) evidence.push('package.json: remix dependency');
  }

  // Angular detection
  if (deps['@angular/core'] || deps['@angular/cli']) {
    framework = 'angular';
    confidence = 0.95;
    version = deps['@angular/core'];
    evidence.length = 0;
    if (deps['@angular/core']) evidence.push('package.json: @angular/core dependency');
    if (deps['@angular/cli']) evidence.push('package.json: @angular/cli dependency');
  }

  // Svelte detection
  if (deps['svelte'] || deps['@sveltejs/kit'] || deps['@sveltejs/vite-plugin-svelte']) {
    const svelteConf = 0.9;
    if (svelteConf > confidence) {
      framework = 'svelte';
      confidence = svelteConf;
      version = deps['svelte'];
      evidence.length = 0;
    }
    if (deps['svelte']) evidence.push('package.json: svelte dependency');
    if (deps['@sveltejs/kit']) evidence.push('package.json: @sveltejs/kit dependency');
  }

  // 3. Detect from file patterns if package.json is inconclusive
  if (framework === 'unknown') {
    const filePatterns = scanFilePatterns(absPath);
    if (filePatterns.vueFiles > 5) {
      framework = 'vue';
      confidence = 0.7;
      evidence.push(`Found ${filePatterns.vueFiles} .vue files`);
    } else if (filePatterns.svelteFiles > 5) {
      framework = 'svelte';
      confidence = 0.7;
      evidence.push(`Found ${filePatterns.svelteFiles} .svelte files`);
    } else if (filePatterns.tsxFiles > 5) {
      framework = 'react';
      confidence = 0.6;
      evidence.push(`Found ${filePatterns.tsxFiles} .tsx files`);
    } else if (filePatterns.angularFiles) {
      framework = 'angular';
      confidence = 0.7;
      evidence.push('Found angular.json');
    }
  }

  // 4. Detect package manager
  if (existsSync(join(absPath, 'pnpm-lock.yaml'))) {
    packageManager = 'pnpm';
  } else if (existsSync(join(absPath, 'yarn.lock'))) {
    packageManager = 'yarn';
  } else if (existsSync(join(absPath, 'bun.lockb')) || existsSync(join(absPath, 'bun.lock'))) {
    packageManager = 'bun';
  } else if (existsSync(join(absPath, 'package-lock.json'))) {
    packageManager = 'npm';
  }

  // 5. Detect build tool
  if (deps['vite'] || deps['@vitejs/plugin-vue'] || deps['@sveltejs/vite-plugin-svelte']) {
    buildTool = 'Vite';
  } else if (deps['webpack'] || deps['webpack-cli']) {
    buildTool = 'Webpack';
  } else if (deps['@angular-devkit/build-angular']) {
    buildTool = 'Angular CLI';
  } else if (deps['next']) {
    buildTool = 'Next.js';
  } else if (deps['nuxt'] || deps['nuxt3']) {
    buildTool = 'Nuxt';
  } else if (deps['vite']) {
    buildTool = 'Vite';
  } else if (deps['rollup']) {
    buildTool = 'Rollup';
  } else if (deps['esbuild']) {
    buildTool = 'esbuild';
  } else if (deps['turbo']) {
    buildTool = 'Turbopack';
  }

  return {
    framework,
    confidence,
    version: version ? cleanVersion(version) : undefined,
    evidence,
    packageManager,
    buildTool,
  };
}

/** Scan file patterns in project directory */
function scanFilePatterns(dir: string) {
  let vueFiles = 0;
  let svelteFiles = 0;
  let tsxFiles = 0;
  let angularFiles = false;

  function walk(d: string, depth = 0) {
    if (depth > 4) return; // Limit depth for performance
    try {
      const entries = readdirSync(d);
      for (const entry of entries) {
        if (entry.startsWith('.') || entry === 'node_modules' || entry === 'dist' || entry === '.git') continue;
        const full = join(d, entry);
        try {
          const st = statSync(full);
          if (st.isDirectory()) {
            walk(full, depth + 1);
          } else {
            if (entry.endsWith('.vue')) vueFiles++;
            if (entry.endsWith('.svelte')) svelteFiles++;
            if (entry.endsWith('.tsx')) tsxFiles++;
            if (entry === 'angular.json') angularFiles = true;
          }
        } catch {
          // Skip inaccessible files
        }
      }
    } catch {
      // Skip inaccessible directories
    }
  }

  walk(dir);
  return { vueFiles, svelteFiles, tsxFiles, angularFiles };
}

/** Clean version string (remove ^, ~, >=, etc.) */
function cleanVersion(ver: string): string {
  return ver.replace(/^[^0-9]*/, '').replace(/[^0-9.].*$/, '');
}
