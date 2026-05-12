/**
 * FrameDoctor - Test Suite
 * Unit tests for core diagnostic engine
 */

import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { diagnose } from '../diagnose.js';
import { detectFramework } from '../frameworks/detector.js';
import { calculateHealthScore, calculateGrade, calculateCategoryScores } from '../utils/scoring.js';
import { getRulesForFramework, filterBySeverity } from '../rules/registry.js';
import type { DiagnosticIssue, CategoryScore } from '../types.js';

describe('FrameDoctor Core', () => {
  describe('Framework Detection', () => {
    it('should detect unknown framework for empty directory', () => {
      const result = detectFramework('/tmp');
      assert.equal(result.framework, 'unknown');
      assert.ok(result.confidence < 0.5);
    });

    it('should have correct detection structure', () => {
      const result = detectFramework('/tmp');
      assert.ok('framework' in result);
      assert.ok('confidence' in result);
      assert.ok('evidence' in result);
      assert.ok('packageManager' in result);
      assert.ok('buildTool' in result);
      assert.ok(Array.isArray(result.evidence));
      assert.ok(typeof result.confidence === 'number');
    });
  });

  describe('Health Score Calculation', () => {
    it('should return 100 for no issues', () => {
      assert.equal(calculateHealthScore([]), 100);
    });

    it('should return lower score for more issues', () => {
      const issues: DiagnosticIssue[] = [
        { ruleId: 'test', severity: 'error', category: 'security', message: 'test', filePath: 'test.ts', line: 1 },
      ];
      const score1 = calculateHealthScore(issues);
      assert.ok(score1 < 100);

      issues.push(
        { ruleId: 'test2', severity: 'error', category: 'security', message: 'test2', filePath: 'test.ts', line: 2 },
        { ruleId: 'test3', severity: 'error', category: 'security', message: 'test3', filePath: 'test.ts', line: 3 },
      );
      const score2 = calculateHealthScore(issues);
      assert.ok(score2 < score1);
    });

    it('should never return negative score', () => {
      const issues: DiagnosticIssue[] = Array(100).fill(null).map((_: unknown, i: number) => ({
        ruleId: `test-${i}`,
        severity: 'error' as const,
        category: 'security' as const,
        message: 'test',
        filePath: 'test.ts',
        line: i + 1,
      }));
      const score = calculateHealthScore(issues);
      assert.ok(score >= 0);
      assert.ok(score <= 100);
    });
  });

  describe('Grade Calculation', () => {
    it('should return A for 90+', () => assert.equal(calculateGrade(95), 'A'));
    it('should return B for 80-89', () => assert.equal(calculateGrade(85), 'B'));
    it('should return C for 65-79', () => assert.equal(calculateGrade(70), 'C'));
    it('should return D for 50-64', () => assert.equal(calculateGrade(55), 'D'));
    it('should return F for below 50', () => assert.equal(calculateGrade(30), 'F'));
  });

  describe('Category Scores', () => {
    it('should return all categories', () => {
      const scores = calculateCategoryScores([]);
      assert.equal(scores.length, 7);
      assert.ok(scores.every((s: CategoryScore) => s.score === 100));
      assert.ok(scores.every((s: CategoryScore) => s.issueCount === 0));
    });

    it('should reflect issues in category scores', () => {
      const issues: DiagnosticIssue[] = [
        { ruleId: 'sec-v-html', severity: 'error', category: 'security', message: 'test', filePath: 'test.vue', line: 1 },
        { ruleId: 'sec-eval-usage', severity: 'error', category: 'security', message: 'test', filePath: 'test.vue', line: 2 },
      ];
      const scores = calculateCategoryScores(issues);
      const secScore = scores.find((s: CategoryScore) => s.category === 'security')!;
      assert.ok(secScore.score < 100);
      assert.equal(secScore.issueCount, 2);
    });
  });

  describe('Rules Registry', () => {
    it('should have rules for all frameworks', () => {
      for (const fw of ['vue', 'react', 'angular', 'svelte']) {
        const rules = getRulesForFramework(fw);
        assert.ok(rules.length > 0, `No rules for framework: ${fw}`);
      }
    });

    it('should filter by category', () => {
      const allRules = getRulesForFramework('vue');
      const secRules = getRulesForFramework('vue', ['security']);
      assert.ok(secRules.length < allRules.length);
      assert.ok(secRules.every((r: typeof secRules[0]) => r.category === 'security'));
    });

    it('should filter by severity', () => {
      const rules = getRulesForFramework('vue');
      const errorsOnly = filterBySeverity(rules, 'error');
      assert.ok(errorsOnly.every((r: typeof errorsOnly[0]) => r.severity === 'error' || r.severity === 'warn'));
    });
  });

  describe('Diagnostic Report', () => {
    it('should produce valid report structure', () => {
      const report = diagnose('/tmp');
      assert.ok('projectPath' in report);
      assert.ok('framework' in report);
      assert.ok('healthScore' in report);
      assert.ok('grade' in report);
      assert.ok('issues' in report);
      assert.ok('deadCode' in report);
      assert.ok('categoryScores' in report);
      assert.ok('filesScanned' in report);
      assert.ok('linesAnalyzed' in report);
      assert.ok('scanDurationMs' in report);
      assert.ok('timestamp' in report);
      assert.ok(typeof report.healthScore === 'number');
      assert.ok(typeof report.grade === 'string');
      assert.ok(Array.isArray(report.issues));
      assert.ok(Array.isArray(report.deadCode));
      assert.ok(Array.isArray(report.categoryScores));
    });
  });
});
