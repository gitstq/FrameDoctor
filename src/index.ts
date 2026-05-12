#!/usr/bin/env node
/**
 * FrameDoctor CLI — Multi-Framework Frontend Code Health Diagnostic Tool
 *
 * Usage:
 *   framedoctor [path] [options]
 *
 * Examples:
 *   framedoctor ./my-project
 *   framedoctor ./my-app --output json
 *   framedoctor . --categories security,performance
 *   framedoctor . --min-severity warn
 */

import { resolve } from 'node:path';
import { runDiagnostic } from './diagnose.js';
import type { DoctorOptions, RuleCategory, Severity } from './types.js';

/** Print help text */
function printHelp(): string {
  return `
🏥 FrameDoctor — Multi-Framework Frontend Code Health Diagnostic Tool

Usage:
  framedoctor [path] [options]

Arguments:
  path                  Project directory path (default: current directory)

Options:
  -o, --output <format> Output format: text (default) or json
  -f, --file <path>     Save JSON report to file
  -c, --categories <c>  Only check specific categories (comma-separated)
                        Available: performance, security, correctness, architecture,
                                   accessibility, best-practice, dead-code
  -s, --min-severity    Minimum severity: error, warn (default), info
  -d, --no-dead-code    Skip dead code detection
  -i, --ignore <p>      Additional ignore patterns (comma-separated)
  -v, --verbose         Show verbose output
  -h, --help            Show this help message
  -V, --version         Show version number

Supported Frameworks:
  🟢 Vue 2/3    🟢 React    🟢 Svelte    🟢 Angular

Examples:
  framedoctor ./my-project
  framedoctor ./my-app --output json --file report.json
  framedoctor . --categories security,performance --min-severity warn
  framedoctor . --ignore dist,build,generated

Quick Start:
  npx framedoctor .
`;
}

/** Parse CLI arguments */
function parseArgs(args: string[]): { path: string; options: DoctorOptions; showHelp: boolean; showVersion: boolean } {
  const positional: string[] = [];
  const options: DoctorOptions = {};
  let showHelp = false;
  let showVersion = false;

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    switch (arg) {
      case '-h':
      case '--help':
        showHelp = true;
        break;
      case '-V':
      case '--version':
        showVersion = true;
        break;
      case '-o':
      case '--output':
        options.output = (args[++i] as 'text' | 'json') || 'text';
        break;
      case '-f':
      case '--file':
        options.outputFile = args[++i];
        break;
      case '-c':
      case '--categories':
        options.categories = (args[++i] || '').split(',') as RuleCategory[];
        break;
      case '-s':
      case '--min-severity':
        options.minSeverity = (args[++i] as Severity) || 'info';
        break;
      case '-d':
      case '--no-dead-code':
        options.deadCode = false;
        break;
      case '-i':
      case '--ignore':
        options.ignore = (args[++i] || '').split(',');
        break;
      case '-v':
      case '--verbose':
        options.verbose = true;
        break;
      default:
        if (!arg.startsWith('-')) {
          positional.push(arg);
        }
        break;
    }
  }

  return {
    path: positional[0] || process.cwd(),
    options,
    showHelp,
    showVersion,
  };
}

// Main entry point
function main(): void {
  const args = process.argv.slice(2);
  const { path, options, showHelp, showVersion } = parseArgs(args);

  if (showHelp) {
    console.log(printHelp());
    process.exit(0);
  }

  if (showVersion) {
    console.log('framedoctor v1.0.0');
    process.exit(0);
  }

  try {
    const projectPath = resolve(path);
    const result = runDiagnostic(projectPath, options);
    console.log(result);
  } catch (error: any) {
    console.error(`\n❌ Error: ${error.message}\n`);
    process.exit(1);
  }
}

main();
