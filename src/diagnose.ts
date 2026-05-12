/**
 * FrameDoctor - Core Diagnostic Engine
 * Main entry point for programmatic usage
 */

import { existsSync } from 'node:fs';
import { resolve } from 'node:path';
import type { DiagnosticReport, DoctorOptions } from './types.js';
import { detectFramework } from './frameworks/detector.js';
import { scanProject } from './detectors/scanner.js';
import { calculateHealthScore, calculateGrade, calculateCategoryScores } from './utils/scoring.js';
import { formatTextReport, formatJsonReport } from './utils/reporter.js';

/**
 * Run a full diagnostic on a project directory
 * This is the main API for programmatic usage
 */
export function diagnose(projectPath: string, options: DoctorOptions = {}): DiagnosticReport {
  const absPath = resolve(options.cwd || projectPath);

  // Validate project path
  if (!existsSync(absPath)) {
    throw new Error(`Project path does not exist: ${absPath}`);
  }

  const startTime = performance.now();

  // Step 1: Detect framework
  const framework = detectFramework(absPath);

  // Step 2: Scan project files
  const { issues, deadCode, filesScanned, linesAnalyzed } = scanProject(
    absPath,
    framework.framework,
    options
  );

  const endTime = performance.now();

  // Step 3: Calculate scores
  const healthScore = calculateHealthScore(issues);
  const grade = calculateGrade(healthScore);
  const categoryScores = calculateCategoryScores(issues);

  // Step 4: Build report
  const report: DiagnosticReport = {
    projectPath: absPath,
    framework,
    healthScore,
    grade,
    issues,
    deadCode,
    categoryScores,
    filesScanned,
    linesAnalyzed,
    scanDurationMs: Math.round(endTime - startTime),
    timestamp: new Date().toISOString(),
  };

  return report;
}

/**
 * Run diagnostic and format output
 */
export function runDiagnostic(projectPath: string, options: DoctorOptions = {}): string {
  const report = diagnose(projectPath, options);

  if (options.output === 'json') {
    const jsonStr = formatJsonReport(report);
    if (options.outputFile) {
      const { writeFileSync } = require('node:fs');
      writeFileSync(options.outputFile, jsonStr, 'utf-8');
      return `Report saved to ${options.outputFile}`;
    }
    return jsonStr;
  }

  return formatTextReport(report);
}

export { detectFramework } from './frameworks/detector.js';
export { formatTextReport, formatJsonReport } from './utils/reporter.js';
export { calculateHealthScore, calculateGrade, calculateCategoryScores } from './utils/scoring.js';
export type { DiagnosticReport, DiagnosticIssue, DoctorOptions, FrameworkDetection, Framework } from './types.js';
