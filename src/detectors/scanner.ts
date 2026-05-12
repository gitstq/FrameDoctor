/**
 * FrameDoctor - Source File Scanner
 * Scans project files and applies diagnostic rules
 */

import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { join, resolve, extname, basename } from 'node:path';
import type { DiagnosticIssue, DiagnosticRule, DeadCodeEntry, Framework, DoctorOptions } from '../types.js';
import { getRulesForFramework, filterBySeverity } from '../rules/registry.js';

/** Default ignore patterns */
const DEFAULT_IGNORE = [
  'node_modules', 'dist', '.git', '.next', '.nuxt', '.output',
  'build', 'coverage', '.turbo', '.cache', '__pycache__',
  '*.min.js', '*.min.css', '*.bundle.js', '*.chunk.js',
  'vendor', '.venv', 'env',
];

/**
 * Scan a project directory and return diagnostic issues
 */
export function scanProject(
  projectPath: string,
  framework: Framework,
  options: DoctorOptions = {}
): { issues: DiagnosticIssue[]; deadCode: DeadCodeEntry[]; filesScanned: number; linesAnalyzed: number } {
  const absPath = resolve(projectPath);
  const ignorePatterns = [...DEFAULT_IGNORE, ...(options.ignore || [])];
  const applicableRules = filterBySeverity(
    getRulesForFramework(framework, options.categories),
    options.minSeverity || 'info'
  );

  const issues: DiagnosticIssue[] = [];
  const deadCode: DeadCodeEntry[] = [];
  let filesScanned = 0;
  let linesAnalyzed = 0;

  // Collect all scannable files
  const files = collectFiles(absPath, ignorePatterns);

  for (const filePath of files) {
    filesScanned++;
    let content: string;
    try {
      content = readFileSync(filePath, 'utf-8');
    } catch {
      continue;
    }

    const lines = content.split('\n');
    linesAnalyzed += lines.length;
    const ext = extname(filePath);
    const relPath = filePath.replace(absPath, '').replace(/^\/+/, '');

    // Apply rules to each file
    for (const rule of applicableRules) {
      const ruleIssues = applyRule(rule, content, lines, filePath, relPath, ext, framework);
      issues.push(...ruleIssues);
    }

    // Dead code detection
    if (options.deadCode !== false) {
      const dc = detectDeadCode(content, lines, filePath, relPath, ext);
      deadCode.push(...dc);
    }
  }

  return { issues, deadCode, filesScanned, linesAnalyzed };
}

/**
 * Collect all scannable source files from directory
 */
function collectFiles(dir: string, ignorePatterns: string[], depth = 0): string[] {
  if (depth > 8) return [];
  const files: string[] = [];
  const scannableExts = [
    '.vue', '.svelte', '.tsx', '.jsx', '.ts', '.js', '.mjs', '.cjs',
    '.html', '.css', '.scss', '.less', '.json',
  ];

  try {
    const entries = readdirSync(dir);
    for (const entry of entries) {
      // Check ignore patterns
      if (ignorePatterns.some((p) => matchPattern(entry, p))) continue;

      const full = join(dir, entry);
      try {
        const st = statSync(full);
        if (st.isDirectory()) {
          files.push(...collectFiles(full, ignorePatterns, depth + 1));
        } else if (st.isFile()) {
          const ext = extname(full).toLowerCase();
          if (scannableExts.includes(ext)) {
            files.push(full);
          }
        }
      } catch {
        // Skip inaccessible files
      }
    }
  } catch {
    // Skip inaccessible directories
  }

  return files;
}

/**
 * Apply a single diagnostic rule to file content
 */
function applyRule(
  rule: DiagnosticRule,
  content: string,
  lines: string[],
  filePath: string,
  relPath: string,
  ext: string,
  framework: Framework
): DiagnosticIssue[] {
  const issues: DiagnosticIssue[] = [];

  switch (rule.id) {
    // ========================
    // Performance Rules
    // ========================
    case 'perf-large-component':
      if (lines.length > 300) {
        issues.push(makeIssue(rule, filePath, relPath, 1,
          `Component file has ${lines.length} lines (max recommended: 300). Consider splitting into smaller components.`,
          lines[0]?.substring(0, 60),
          'Extract logical sections into separate child components'
        ));
      }
      break;

    case 'perf-v-for-without-key':
      for (let i = 0; i < lines.length; i++) {
        if (/v-for=/.test(lines[i]) && !/:key=/.test(lines[i]) && !/@key=/.test(lines[i])) {
          issues.push(makeIssue(rule, filePath, relPath, i + 1,
            'v-for directive missing :key attribute',
            lines[i].trim().substring(0, 80),
            'Add :key="item.id" or other unique identifier to v-for'
          ));
        }
      }
      break;

    case 'perf-react-list-key':
      for (let i = 0; i < lines.length; i++) {
        if (/\.map\s*\(/.test(lines[i]) && /return\s*(<|jsx)/.test(lines.slice(i, i + 5).join(''))) {
          const block = lines.slice(i, Math.min(i + 10, lines.length)).join('\n');
          if (!/key\s*=\s*[{"]/.test(block) && !/key\s*=\s*\w+/.test(block)) {
            issues.push(makeIssue(rule, filePath, relPath, i + 1,
              'Array.map() rendering without unique key prop',
              lines[i].trim().substring(0, 80),
              'Add key={item.id} to the rendered element'
            ));
          }
        }
      }
      break;

    case 'perf-heavy-computation-in-template':
      for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        if (/\{\{[^}]*\.(filter|sort|reduce|map|find|forEach)\s*\(/.test(line) ||
            /\{\{[^}]*new\s+(Date|Array|Map|Set)/.test(line) ||
            /\{\{[^}]*JSON\.(stringify|parse)/.test(line)) {
          issues.push(makeIssue(rule, filePath, relPath, i + 1,
            'Complex computation in template expression',
            line.trim().substring(0, 80),
            'Move computation to a computed property or method'
          ));
        }
      }
      break;

    case 'perf-angular-ngfor-trackby':
      for (let i = 0; i < lines.length; i++) {
        if (/\*ngFor/.test(lines[i]) && !/trackBy/.test(lines[i])) {
          issues.push(makeIssue(rule, filePath, relPath, i + 1,
            '*ngFor directive missing trackBy function',
            lines[i].trim().substring(0, 80),
            'Add trackBy function to optimize DOM updates'
          ));
        }
      }
      break;

    case 'perf-svelte-reactive':
      if (ext === '.svelte') {
        for (let i = 0; i < lines.length; i++) {
          if (/let\s+\w+\s*=/.test(lines[i]) && !/^\s*\$:\s*/.test(lines[i])) {
            const varName = lines[i].match(/let\s+(\w+)/)?.[1];
            if (varName) {
              const laterUsage = lines.slice(i + 1).some(l => l.includes(`${varName}.`) || l.includes(`${varName}[`));
              if (laterUsage) {
                issues.push(makeIssue(rule, filePath, relPath, i + 1,
                  `Variable "${varName}" may need $: reactive declaration`,
                  lines[i].trim().substring(0, 80),
                  'Wrap derived values in $: reactive declarations'
                ));
              }
            }
          }
        }
      }
      break;

    case 'perf-no-virtual-scroll': {
      const listPatterns = [/\bmap\s*\(/g, /\bv-for\s*=/g, /\*ngFor/g];
      let listCount = 0;
      for (const line of lines) {
        for (const pat of listPatterns) {
          const matches = line.match(pat);
          if (matches) listCount += matches.length;
        }
      }
      if (listCount >= 3) {
        issues.push(makeIssue(rule, filePath, relPath, 1,
          `Found ${listCount} list renderings — consider virtual scrolling for large lists`,
          undefined,
          'Use virtual-list, react-window, or similar for lists with 100+ items'
        ));
      }
      break;
    }

    // ========================
    // Security Rules
    // ========================
    case 'sec-v-html':
      for (let i = 0; i < lines.length; i++) {
        if (/v-html\s*=/.test(lines[i])) {
          issues.push(makeIssue(rule, filePath, relPath, i + 1,
            'v-html directive renders raw HTML — potential XSS vulnerability',
            lines[i].trim().substring(0, 80),
            'Use DOMPurify to sanitize HTML before rendering, or use text interpolation'
          ));
        }
      }
      break;

    case 'sec-dangerouslysetinnerhtml':
      for (let i = 0; i < lines.length; i++) {
        if (/dangerouslySetInnerHTML/.test(lines[i])) {
          issues.push(makeIssue(rule, filePath, relPath, i + 1,
            'dangerouslySetInnerHTML renders raw HTML — potential XSS vulnerability',
            lines[i].trim().substring(0, 80),
            'Use DOMPurify to sanitize HTML content before rendering'
          ));
        }
      }
      break;

    case 'sec-innerhtml-binding':
      for (let i = 0; i < lines.length; i++) {
        if (/innerHTML\s*=/.test(lines[i]) && !/\/\//.test(lines[i].split('innerHTML')[0])) {
          issues.push(makeIssue(rule, filePath, relPath, i + 1,
            'Direct innerHTML assignment — potential XSS vulnerability',
            lines[i].trim().substring(0, 80),
            'Use textContent or sanitize HTML with DOMPurify'
          ));
        }
      }
      break;

    case 'sec-eval-usage':
      for (let i = 0; i < lines.length; i++) {
        if (/\beval\s*\(/.test(lines[i]) || /new\s+Function\s*\(/.test(lines[i])) {
          issues.push(makeIssue(rule, filePath, relPath, i + 1,
            'eval() or new Function() usage — code injection vulnerability',
            lines[i].trim().substring(0, 80),
            'Never use eval() — use JSON.parse() for data, or proper function references'
          ));
        }
      }
      break;

    case 'sec-localstorage-sensitive':
      for (let i = 0; i < lines.length; i++) {
        const line = lines[i].toLowerCase();
        if (/localStorage\.set/.test(line) && /token|password|secret|api.?key|auth/.test(line)) {
          issues.push(makeIssue(rule, filePath, relPath, i + 1,
            'Storing sensitive data in localStorage — accessible by any script on the page',
            lines[i].trim().substring(0, 80),
            'Use httpOnly cookies or secure session storage for sensitive data'
          ));
        }
      }
      break;

    case 'sec-no-csp': {
      const htmlFiles = content.match(/<meta[^>]*http-equiv[^>]*Content-Security-Policy/i);
      if (ext === '.html' && !htmlFiles) {
        const hasMeta = /<meta\s/i.test(content);
        if (hasMeta) {
          issues.push(makeIssue(rule, filePath, relPath, 1,
            'HTML file with meta tags but no Content-Security-Policy',
            undefined,
            'Add <meta http-equiv="Content-Security-Policy" content="default-src \'self\'"> header'
          ));
        }
      }
      break;
    }

    // ========================
    // Correctness Rules
    // ========================
    case 'corr-react-useeffect-deps':
      for (let i = 0; i < lines.length; i++) {
        if (/useEffect\s*\(/.test(lines[i])) {
          const block = lines.slice(i, Math.min(i + 15, lines.length)).join('\n');
          if (/useEffect\s*\(\s*\(\)\s*=>\s*\{/.test(block) && !/\],\s*\[/.test(block) && !/\]\s*\)/.test(block.slice(block.indexOf('useEffect'), block.indexOf('useEffect') + 200))) {
            // Check if it has dependencies array
            const endIdx = block.indexOf(');', block.indexOf('useEffect'));
            const relevantBlock = block.substring(0, endIdx > 0 ? endIdx : 300);
            if (!/\[\s*\w/.test(relevantBlock) && !/\[\s*\]/.test(relevantBlock)) {
              issues.push(makeIssue(rule, filePath, relPath, i + 1,
                'useEffect may be missing dependency array',
                lines[i].trim().substring(0, 80),
                'Add dependency array as second argument: useEffect(() => {}, [deps])'
              ));
            }
          }
        }
      }
      break;

    case 'corr-angular-ondestroy':
      if (ext === '.ts') {
        const hasSubscribe = content.includes('.subscribe(') || content.includes('setInterval(');
        const hasOnDestroy = content.includes('ngOnDestroy') || content.includes('OnDestroy');
        if (hasSubscribe && !hasOnDestroy) {
          issues.push(makeIssue(rule, filePath, relPath, 1,
            'Component with subscriptions/intervals but no OnDestroy cleanup',
            undefined,
            'Implement OnDestroy interface and unsubscribe/clear intervals in ngOnDestroy()'
          ));
        }
      }
      break;

    case 'corr-type-assertion-any':
      for (let i = 0; i < lines.length; i++) {
        if (/as\s+any\b/.test(lines[i]) || /<any>/.test(lines[i])) {
          issues.push(makeIssue(rule, filePath, relPath, i + 1,
            'Type assertion to "any" — defeats TypeScript type safety',
            lines[i].trim().substring(0, 80),
            'Use proper type definitions or "unknown" with type narrowing'
          ));
        }
      }
      break;

    case 'corr-console-log-prod':
      for (let i = 0; i < lines.length; i++) {
        if (/console\.(log|debug|info)\s*\(/.test(lines[i]) && !/\/\//.test(lines[i].split('console')[0])) {
          issues.push(makeIssue(rule, filePath, relPath, i + 1,
            'console.log/debug/info statement found',
            lines[i].trim().substring(0, 80),
            'Remove console statements or use a logging library with production mode'
          ));
        }
      }
      break;

    // ========================
    // Architecture Rules
    // ========================
    case 'arch-god-component':
      if (lines.length > 500) {
        const hasState = /useState|ref\(|data\s*\(\)|@State/.test(content);
        const hasMethods = content.split('function ').length > 5 || content.split('const \\w+ = \\(').length > 5;
        const hasTemplate = /<template>|return\s*\(?\s*</.test(content);
        if (hasState && hasMethods && hasTemplate) {
          issues.push(makeIssue(rule, filePath, relPath, 1,
            `Component has ${lines.length} lines with state, multiple methods, and template — "God Component" anti-pattern`,
            undefined,
            'Split into smaller, focused components with clear responsibilities'
          ));
        }
      }
      break;

    case 'arch-no-error-boundary':
      if (ext === '.tsx' || ext === '.jsx') {
        const hasErrorBoundary = content.includes('ErrorBoundary') || content.includes('componentDidCatch');
        if (!hasErrorBoundary && (content.includes('createRoot') || content.includes('render'))) {
          issues.push(makeIssue(rule, filePath, relPath, 1,
            'Application entry point without Error Boundary',
            undefined,
            'Wrap your app with an Error Boundary component to catch rendering errors'
          ));
        }
      }
      break;

    case 'arch-vue-no-error-handler':
      if (content.includes('createApp') && !content.includes('errorHandler')) {
        issues.push(makeIssue(rule, filePath, relPath, 1,
          'Vue app without global error handler',
          undefined,
          'Add app.config.errorHandler to catch and report runtime errors globally'
        ));
      }
      break;

    case 'arch-no-lazy-loading': {
      const hasDynamicImport = /import\s*\(/.test(content);
      const hasRouter = content.includes('createRouter') || content.includes('RouterModule') ||
                        content.includes('createBrowserRouter') || content.includes('Routes');
      if (hasRouter && !hasDynamicImport && (ext === '.ts' || ext === '.js')) {
        issues.push(makeIssue(rule, filePath, relPath, 1,
          'Router configuration without lazy-loaded routes',
          undefined,
          'Use dynamic imports: () => import("./Page.vue") for route components'
        ));
      }
      break;
    }

    // ========================
    // Accessibility Rules
    // ========================
    case 'a11y-missing-alt':
      for (let i = 0; i < lines.length; i++) {
        if (/<img\b/.test(lines[i]) && !/alt\s*=/.test(lines[i])) {
          issues.push(makeIssue(rule, filePath, relPath, i + 1,
            '<img> tag without alt attribute',
            lines[i].trim().substring(0, 80),
            'Add alt="description" to all img tags for screen reader support'
          ));
        }
      }
      break;

    case 'a11y-missing-label':
      for (let i = 0; i < lines.length; i++) {
        if (/<input\b|<select\b|<textarea\b/.test(lines[i])) {
          const context = lines.slice(Math.max(0, i - 3), i + 1).join('\n');
          if (!/label\s*=|<label|aria-label|aria-labelledby/.test(context)) {
            issues.push(makeIssue(rule, filePath, relPath, i + 1,
              'Form input without associated label',
              lines[i].trim().substring(0, 80),
              'Add a <label> element with matching "for" attribute or use aria-label'
            ));
          }
        }
      }
      break;

    case 'a11y-click-div':
      for (let i = 0; i < lines.length; i++) {
        if (/<div[^>]*(?:onClick|@click)/.test(lines[i]) && !/role\s*=/.test(lines[i])) {
          issues.push(makeIssue(rule, filePath, relPath, i + 1,
            'Clickable div without role and keyboard support',
            lines[i].trim().substring(0, 80),
            'Add role="button", tabIndex={0}, and onKeyDown handler for keyboard accessibility'
          ));
        }
      }
      break;

    // ========================
    // Best Practice Rules
    // ========================
    case 'bp-no-typescript':
      if (ext === '.js' || ext === '.jsx') {
        issues.push(makeIssue(rule, filePath, relPath, 1,
          'JavaScript file in project — consider TypeScript for type safety',
          undefined,
          'Rename to .ts/.tsx and add type annotations for better IDE support and bug prevention'
        ));
      }
      break;

    case 'bp-no-unit-tests': {
      // Only report once for the project (checked at project level)
      break;
    }

    case 'bp-vue-composition-api':
      if (ext === '.vue') {
        const hasOptionsAPI = /export\s+default\s*\{[\s\S]*?(?:data\s*\(|methods\s*:|computed\s*:|watch\s*:)/.test(content);
        const hasCompositionAPI = /<script\s+setup|setup\s*\(\)/.test(content);
        if (hasOptionsAPI && !hasCompositionAPI) {
          issues.push(makeIssue(rule, filePath, relPath, 1,
            'Vue component using Options API — consider Composition API',
            undefined,
            'Migrate to <script setup> for better type inference and code organization'
          ));
        }
      }
      break;

    case 'bp-react-class-component':
      if (ext === '.tsx' || ext === '.jsx') {
        if (/class\s+\w+\s+extends\s+(React\.)?Component/.test(content)) {
          issues.push(makeIssue(rule, filePath, relPath, 1,
            'React class component detected — prefer functional components with hooks',
            undefined,
            'Convert to functional component using useState, useEffect, and other hooks'
          ));
        }
      }
      break;

    case 'bp-magic-numbers':
      for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        // Skip common acceptable numbers
        if (/\b(?:0|1)\b/.test(line)) continue;
        // Detect standalone numbers that aren't in common patterns
        if (/(?<![.\w])(?:\d{2,}|0x[0-9a-fA-F]{2,})(?!\w*[.\/])/g.test(line) &&
            !/port|version|http|localhost|const\s+\w+\s*=\s*\d/.test(line.toLowerCase()) &&
            !/^\s*\/\//.test(line) && !/export/.test(line)) {
          const nums = line.match(/(?<![.\w])(\d{2,})(?!\w*[.\/])/g);
          if (nums && nums.some(n => parseInt(n) > 10 && parseInt(n) !== 100 && parseInt(n) !== 1000)) {
            issues.push(makeIssue(rule, filePath, relPath, i + 1,
              `Magic number detected: ${nums.find(n => parseInt(n) > 10)}`,
              line.trim().substring(0, 80),
              'Extract to a named constant: const MAX_RETRY_COUNT = 3'
            ));
          }
        }
      }
      break;

    default:
      // Rules handled by pattern matching below
      break;
  }

  return issues;
}

/**
 * Detect dead code in file content
 */
function detectDeadCode(
  content: string,
  lines: string[],
  filePath: string,
  relPath: string,
  ext: string
): DeadCodeEntry[] {
  const entries: DeadCodeEntry[] = [];

  // Detect unused imports
  const importRegex = /import\s+(?:\{([^}]+)\}|(\w+))\s+from\s+['"][^'"]+['"]/g;
  let match;
  while ((match = importRegex.exec(content)) !== null) {
    const namedImports = match[1];
    const defaultImport = match[2];
    if (namedImports) {
      for (const imp of namedImports.split(',').map(s => s.trim().split(/\s+as\s+/).pop()?.trim())) {
        if (imp && imp !== 'type' && imp !== 'React' && imp !== 'Vue') {
          // Count usages (rough heuristic)
          const regex = new RegExp(`\\b${imp.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'g');
          const usages = (content.match(regex) || []).length;
          if (usages <= 1) { // Only the import itself
            const lineIdx = content.substring(0, match.index).split('\n').length;
            entries.push({
              type: 'unused-import',
              filePath: relPath,
              line: lineIdx,
              description: `Imported "${imp}" is never used`,
            });
          }
        }
      }
    }
  }

  // Detect commented-out code blocks (3+ consecutive comment lines with code-like content)
  let commentBlockStart = -1;
  let commentBlockCount = 0;
  for (let i = 0; i < lines.length; i++) {
    const trimmed = lines[i].trim();
    if ((trimmed.startsWith('//') || trimmed.startsWith('*') || trimmed.startsWith('<!--')) &&
        trimmed.length > 10) {
      if (commentBlockStart === -1) commentBlockStart = i;
      commentBlockCount++;
    } else {
      if (commentBlockCount >= 3) {
        entries.push({
          type: 'commented-code',
          filePath: relPath,
          line: commentBlockStart + 1,
          description: `Block of ${commentBlockCount} commented-out lines detected`,
        });
      }
      commentBlockStart = -1;
      commentBlockCount = 0;
    }
  }

  return entries;
}

/**
 * Create a diagnostic issue object
 */
function makeIssue(
  rule: DiagnosticRule,
  filePath: string,
  relPath: string,
  line: number,
  message: string,
  snippet?: string,
  suggestion?: string
): DiagnosticIssue {
  return {
    ruleId: rule.id,
    severity: rule.severity,
    category: rule.category,
    message,
    filePath: relPath,
    line,
    snippet,
    suggestion,
  };
}

/**
 * Simple glob pattern matching
 */
function matchPattern(name: string, pattern: string): boolean {
  if (pattern.startsWith('*')) {
    const ext = pattern.slice(1);
    return name.endsWith(ext);
  }
  return name === pattern;
}
