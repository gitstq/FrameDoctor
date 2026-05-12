/**
 * FrameDoctor - Core Types
 * Multi-framework frontend code health diagnostic engine
 */

/** Supported framework types */
export type Framework = 'vue' | 'svelte' | 'angular' | 'react' | 'unknown';

/** Severity levels for diagnostic rules */
export type Severity = 'error' | 'warn' | 'info';

/** Category of diagnostic rules */
export type RuleCategory =
  | 'performance'
  | 'security'
  | 'correctness'
  | 'architecture'
  | 'accessibility'
  | 'best-practice'
  | 'dead-code';

/** A single diagnostic issue found */
export interface DiagnosticIssue {
  /** Rule ID that triggered this issue */
  ruleId: string;
  /** Severity level */
  severity: Severity;
  /** Category of the rule */
  category: RuleCategory;
  /** Human-readable message */
  message: string;
  /** Absolute file path */
  filePath: string;
  /** Line number (1-based) */
  line: number;
  /** Column number (1-based) */
  column?: number;
  /** Code snippet around the issue */
  snippet?: string;
  /** Suggested fix description */
  suggestion?: string;
}

/** A single diagnostic rule definition */
export interface DiagnosticRule {
  /** Unique rule ID */
  id: string;
  /** Human-readable name */
  name: string;
  /** Description of what this rule checks */
  description: string;
  /** Severity when violated */
  severity: Severity;
  /** Category */
  category: RuleCategory;
  /** Applicable frameworks (empty = all frameworks) */
  frameworks: Framework[];
  /** Weight for scoring (higher = more impact on health score) */
  weight: number;
}

/** Framework detection result */
export interface FrameworkDetection {
  /** Detected framework */
  framework: Framework;
  /** Confidence level 0-1 */
  confidence: number;
  /** Detected version if available */
  version?: string;
  /** Evidence files that led to detection */
  evidence: string[];
  /** Package manager detected */
  packageManager: 'npm' | 'yarn' | 'pnpm' | 'bun' | 'unknown';
  /** Build tool detected */
  buildTool: string;
}

/** Dead code detection result */
export interface DeadCodeEntry {
  /** Type of dead code */
  type: 'unused-file' | 'unused-export' | 'unused-import' | 'unused-variable' | 'unused-function' | 'duplicate-code' | 'commented-code';
  /** File path */
  filePath: string;
  /** Line number */
  line?: number;
  /** Description */
  description: string;
}

/** Score breakdown by category */
export interface CategoryScore {
  category: RuleCategory;
  score: number;
  maxScore: number;
  issueCount: number;
}

/** Complete diagnostic report */
export interface DiagnosticReport {
  /** Project path that was analyzed */
  projectPath: string;
  /** Framework detection result */
  framework: FrameworkDetection;
  /** Overall health score 0-100 */
  healthScore: number;
  /** Score grade (A/B/C/D/F) */
  grade: string;
  /** All issues found */
  issues: DiagnosticIssue[];
  /** Dead code entries */
  deadCode: DeadCodeEntry[];
  /** Score breakdown by category */
  categoryScores: CategoryScore[];
  /** Total files scanned */
  filesScanned: number;
  /** Total lines analyzed */
  linesAnalyzed: number;
  /** Scan duration in milliseconds */
  scanDurationMs: number;
  /** Timestamp of the scan */
  timestamp: string;
}

/** CLI configuration options */
export interface DoctorOptions {
  /** Project directory path */
  cwd?: string;
  /** Output format */
  output?: 'text' | 'json';
  /** Only check specific categories */
  categories?: RuleCategory[];
  /** Minimum severity to report */
  minSeverity?: Severity;
  /** Include dead code detection */
  deadCode?: boolean;
  /** Output file path for JSON report */
  outputFile?: string;
  /** Show progress */
  verbose?: boolean;
  /** Ignore patterns (glob) */
  ignore?: string[];
}
