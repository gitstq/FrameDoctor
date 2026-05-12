/**
 * FrameDoctor - Score Calculator
 * Calculates health score and grade from diagnostic results
 */

import type { DiagnosticIssue, RuleCategory, CategoryScore, Severity } from '../types.js';

/** Severity weights for score calculation */
const SEVERITY_PENALTY: Record<Severity, number> = {
  error: 10,
  warn: 4,
  info: 1,
};

/** Category display names */
export const CATEGORY_LABELS: Record<RuleCategory, string> = {
  performance: '⚡ Performance',
  security: '🔒 Security',
  correctness: '✅ Correctness',
  architecture: '🏗️ Architecture',
  accessibility: '♿ Accessibility',
  'best-practice': '📋 Best Practices',
  'dead-code': '🧹 Dead Code',
};

/**
 * Calculate overall health score (0-100)
 */
export function calculateHealthScore(issues: DiagnosticIssue[]): number {
  if (issues.length === 0) return 100;

  let totalPenalty = 0;
  for (const issue of issues) {
    totalPenalty += SEVERITY_PENALTY[issue.severity];
  }

  // Exponential decay: more issues = exponentially worse score
  // Formula: score = 100 * e^(-totalPenalty / 50)
  const score = Math.round(100 * Math.exp(-totalPenalty / 50));
  return Math.max(0, Math.min(100, score));
}

/**
 * Calculate score grade from numeric score
 */
export function calculateGrade(score: number): string {
  if (score >= 90) return 'A';
  if (score >= 80) return 'B';
  if (score >= 65) return 'C';
  if (score >= 50) return 'D';
  return 'F';
}

/**
 * Calculate per-category scores
 */
export function calculateCategoryScores(issues: DiagnosticIssue[]): CategoryScore[] {
  const categories: RuleCategory[] = [
    'performance', 'security', 'correctness', 'architecture',
    'accessibility', 'best-practice', 'dead-code',
  ];

  return categories.map((category) => {
    const categoryIssues = issues.filter((i) => i.category === category);
    const penalty = categoryIssues.reduce((sum, i) => sum + SEVERITY_PENALTY[i.severity], 0);
    const maxPenalty = 50; // Reference max penalty for 0 score
    const score = Math.max(0, Math.round(100 * (1 - penalty / maxPenalty)));

    return {
      category,
      score,
      maxScore: 100,
      issueCount: categoryIssues.length,
    };
  });
}

/**
 * Get severity emoji
 */
export function severityEmoji(severity: Severity): string {
  switch (severity) {
    case 'error': return '🔴';
    case 'warn': return '🟡';
    case 'info': return '🔵';
    default: return '⚪';
  }
}

/**
 * Get grade emoji
 */
export function gradeEmoji(grade: string): string {
  switch (grade) {
    case 'A': return '🟢';
    case 'B': return '🟡';
    case 'C': return '🟠';
    case 'D': return '🔴';
    case 'F': return '💀';
    default: return '⚪';
  }
}
