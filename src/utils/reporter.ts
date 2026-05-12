/**
 * FrameDoctor - Report Formatter
 * Formats diagnostic reports for terminal output and JSON
 */

import type { DiagnosticReport, DiagnosticIssue } from '../types.js';
import { CATEGORY_LABELS, severityEmoji, gradeEmoji } from './scoring.js';

/**
 * Format report as colored terminal output
 */
export function formatTextReport(report: DiagnosticReport): string {
  const lines: string[] = [];
  const sep = '─'.repeat(60);

  lines.push('');
  lines.push(`  🏥 FrameDoctor — Multi-Framework Code Health Report`);
  lines.push(`  ${sep}`);
  lines.push('');

  // Framework info
  lines.push(`  📦 Framework:     ${report.framework.framework.toUpperCase()} (confidence: ${Math.round(report.framework.confidence * 100)}%)`);
  lines.push(`  🔧 Build Tool:    ${report.framework.buildTool}`);
  lines.push(`  📦 Package Mgr:   ${report.framework.packageManager}`);
  if (report.framework.version) {
    lines.push(`  📌 Version:       ${report.framework.version}`);
  }
  lines.push('');

  // Health score
  lines.push(`  ${sep}`);
  lines.push(`  🏥 Health Score:   ${gradeEmoji(report.grade)} ${report.healthScore}/100 (Grade: ${report.grade})`);
  lines.push(`  ${sep}`);
  lines.push('');

  // Category breakdown
  lines.push(`  📊 Category Breakdown:`);
  lines.push('');
  for (const cat of report.categoryScores) {
    const label = CATEGORY_LABELS[cat.category];
    const bar = buildBar(cat.score);
    const count = cat.issueCount > 0 ? ` (${cat.issueCount} issues)` : ' ✓ No issues';
    lines.push(`    ${label}  ${bar} ${cat.score}/100${count}`);
  }
  lines.push('');

  // Issues summary
  const errors = report.issues.filter((i: DiagnosticIssue) => i.severity === 'error').length;
  const warns = report.issues.filter((i: DiagnosticIssue) => i.severity === 'warn').length;
  const infos = report.issues.filter((i: DiagnosticIssue) => i.severity === 'info').length;

  lines.push(`  ${sep}`);
  lines.push(`  📋 Issues Summary:  🔴 ${errors} errors  🟡 ${warns} warnings  🔵 ${infos} info`);
  lines.push(`  📁 Files Scanned:  ${report.filesScanned}`);
  lines.push(`  📝 Lines Analyzed: ${report.linesAnalyzed}`);
  lines.push(`  ⏱️  Scan Duration:  ${report.scanDurationMs}ms`);
  lines.push(`  ${sep}`);
  lines.push('');

  // Dead code
  if (report.deadCode.length > 0) {
    lines.push(`  🧹 Dead Code (${report.deadCode.length} entries):`);
    lines.push('');
    for (const dc of report.deadCode.slice(0, 20)) {
      lines.push(`    ${dc.type === 'unused-import' ? '📦' : dc.type === 'commented-code' ? '💬' : '🗑️'} ${dc.filePath}:${dc.line || '?'} — ${dc.description}`);
    }
    if (report.deadCode.length > 20) {
      lines.push(`    ... and ${report.deadCode.length - 20} more`);
    }
    lines.push('');
  }

  // Detailed issues (top 30)
  if (report.issues.length > 0) {
    lines.push(`  🔍 Detailed Issues (showing top ${Math.min(30, report.issues.length)}):`);
    lines.push('');
    const sorted = [...report.issues].sort((a: DiagnosticIssue, b: DiagnosticIssue) => {
      const sevOrder: Record<string, number> = { error: 0, warn: 1, info: 2 };
      return sevOrder[a.severity] - sevOrder[b.severity];
    });

    for (const issue of sorted.slice(0, 30)) {
      const emoji = severityEmoji(issue.severity);
      lines.push(`    ${emoji} [${issue.ruleId}] ${issue.message}`);
      lines.push(`       📍 ${issue.filePath}:${issue.line}`);
      if (issue.suggestion) {
        lines.push(`       💡 ${issue.suggestion}`);
      }
      lines.push('');
    }

    if (sorted.length > 30) {
      lines.push(`    ... and ${sorted.length - 30} more issues`);
      lines.push('');
    }
  }

  // Recommendations
  lines.push(`  ${sep}`);
  lines.push(`  💡 Recommendations:`);
  lines.push('');
  const recommendations = generateRecommendations(report);
  for (const rec of recommendations) {
    lines.push(`    ${rec}`);
  }
  lines.push('');
  lines.push(`  ${sep}`);
  lines.push('');

  return lines.join('\n');
}

/**
 * Build a visual bar for score display
 */
function buildBar(score: number): string {
  const filled = Math.round(score / 5);
  const empty = 20 - filled;
  let color = '🟩';
  if (score < 50) color = '🟥';
  else if (score < 70) color = '🟨';
  else if (score < 85) color = '🟧';
  return color.repeat(filled) + '⬜'.repeat(empty);
}

/**
 * Generate actionable recommendations based on report
 */
function generateRecommendations(report: DiagnosticReport): string[] {
  const recs: string[] = [];

  if (report.healthScore >= 90) {
    recs.push('✅ Excellent code health! Keep up the great work.');
  }

  // Security
  const secIssues = report.issues.filter((i: DiagnosticIssue) => i.category === 'security');
  if (secIssues.length > 0) {
    recs.push(`🔒 Fix ${secIssues.length} security issue(s) — these are high priority and should be addressed immediately.`);
  }

  // Performance
  const perfIssues = report.issues.filter((i: DiagnosticIssue) => i.category === 'performance');
  if (perfIssues.length > 0) {
    recs.push(`⚡ Address ${perfIssues.length} performance issue(s) to improve runtime efficiency.`);
  }

  // Dead code
  if (report.deadCode.length > 5) {
    recs.push(`🧹 Clean up ${report.deadCode.length} dead code entries to reduce bundle size and improve maintainability.`);
  }

  // Accessibility
  const a11yIssues = report.issues.filter((i: DiagnosticIssue) => i.category === 'accessibility');
  if (a11yIssues.length > 0) {
    recs.push(`♿ Fix ${a11yIssues.length} accessibility issue(s) to ensure WCAG 2.1 compliance.`);
  }

  // Tests
  const testRec = report.issues.find((i: DiagnosticIssue) => i.ruleId === 'bp-no-unit-tests');
  if (testRec) {
    recs.push('🧪 Add unit tests — no test files were detected in the project.');
  }

  // TypeScript
  const jsFiles = report.issues.filter((i: DiagnosticIssue) => i.ruleId === 'bp-no-typescript');
  if (jsFiles.length > 3) {
    recs.push(`📝 ${jsFiles.length} JavaScript file(s) found — consider migrating to TypeScript.`);
  }

  if (recs.length === 0) {
    recs.push('🎉 No critical issues found. Your project is in great shape!');
  }

  return recs;
}

/**
 * Format report as JSON string
 */
export function formatJsonReport(report: DiagnosticReport): string {
  return JSON.stringify(report, null, 2);
}
