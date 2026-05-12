/**
 * FrameDoctor - Diagnostic Rules Registry
 * All built-in diagnostic rules for multi-framework health checks
 */

import type { DiagnosticRule, RuleCategory, Severity } from '../types.js';

/**
 * Built-in diagnostic rules for Vue, Svelte, Angular, and React projects
 */
export const rules: DiagnosticRule[] = [
  // ========================
  // Performance Rules
  // ========================
  {
    id: 'perf-large-component',
    name: 'Large Component Detection',
    description: 'Component file exceeds 300 lines — consider splitting into smaller components',
    severity: 'warn',
    category: 'performance',
    frameworks: ['vue', 'svelte', 'angular', 'react'],
    weight: 3,
  },
  {
    id: 'perf-v-for-without-key',
    name: 'v-for Without Key',
    description: 'v-for directive missing :key attribute — causes inefficient DOM updates',
    severity: 'error',
    category: 'performance',
    frameworks: ['vue'],
    weight: 5,
  },
  {
    id: 'perf-missing-vue-key',
    name: 'Missing Template Key',
    description: 'Vue template list rendering missing proper key binding',
    severity: 'warn',
    category: 'performance',
    frameworks: ['vue'],
    weight: 4,
  },
  {
    id: 'perf-react-memo',
    name: 'Missing React.memo',
    description: 'Component with complex props passed to children without React.memo — may cause unnecessary re-renders',
    severity: 'info',
    category: 'performance',
    frameworks: ['react'],
    weight: 2,
  },
  {
    id: 'perf-react-list-key',
    name: 'React List Without Key',
    description: 'Array.map() rendering without unique key prop — causes reconciliation issues',
    severity: 'error',
    category: 'performance',
    frameworks: ['react'],
    weight: 5,
  },
  {
    id: 'perf-svelte-reactive',
    name: 'Svelte Reactive Statement Missing',
    description: 'Derived value not wrapped in $: reactive declaration — may not update correctly',
    severity: 'warn',
    category: 'performance',
    frameworks: ['svelte'],
    weight: 3,
  },
  {
    id: 'perf-angular-ngfor-trackby',
    name: 'Angular *ngFor Without trackBy',
    description: '*ngFor directive missing trackBy function — causes full DOM recreation on updates',
    severity: 'warn',
    category: 'performance',
    frameworks: ['angular'],
    weight: 4,
  },
  {
    id: 'perf-heavy-computation-in-template',
    name: 'Heavy Computation in Template',
    description: 'Complex expressions or function calls in template — move to computed properties/methods',
    severity: 'warn',
    category: 'performance',
    frameworks: ['vue', 'angular'],
    weight: 3,
  },
  {
    id: 'perf-no-virtual-scroll',
    name: 'Large List Without Virtual Scroll',
    description: 'Rendering 100+ items without virtual scrolling — consider using virtual-list or similar',
    severity: 'info',
    category: 'performance',
    frameworks: ['vue', 'react', 'angular', 'svelte'],
    weight: 2,
  },

  // ========================
  // Security Rules
  // ========================
  {
    id: 'sec-v-html',
    name: 'Unsafe v-html Usage',
    description: 'v-html directive renders raw HTML — XSS vulnerability risk. Use text interpolation or sanitize input',
    severity: 'error',
    category: 'security',
    frameworks: ['vue'],
    weight: 8,
  },
  {
    id: 'sec-dangerouslysetinnerhtml',
    name: 'Unsafe dangerouslySetInnerHTML',
    description: 'dangerouslySetInnerHTML renders raw HTML — XSS vulnerability risk. Use a sanitization library',
    severity: 'error',
    category: 'security',
    frameworks: ['react'],
    weight: 8,
  },
  {
    id: 'sec-innerhtml-binding',
    name: 'Unsafe innerHTML Binding',
    description: 'Direct innerHTML binding detected — XSS vulnerability risk',
    severity: 'error',
    category: 'security',
    frameworks: ['angular', 'svelte'],
    weight: 8,
  },
  {
    id: 'sec-eval-usage',
    name: 'eval() Usage Detected',
    description: 'eval() or Function() constructor usage — code injection vulnerability',
    severity: 'error',
    category: 'security',
    frameworks: ['vue', 'react', 'angular', 'svelte'],
    weight: 10,
  },
  {
    id: 'sec-localstorage-sensitive',
    name: 'Sensitive Data in localStorage',
    description: 'Storing tokens, passwords, or personal data in localStorage — use httpOnly cookies instead',
    severity: 'error',
    category: 'security',
    frameworks: ['vue', 'react', 'angular', 'svelte'],
    weight: 7,
  },
  {
    id: 'sec-no-csp',
    name: 'Missing Content Security Policy',
    description: 'No Content-Security-Policy header detected in meta tags or server config',
    severity: 'warn',
    category: 'security',
    frameworks: ['vue', 'react', 'angular', 'svelte'],
    weight: 5,
  },

  // ========================
  // Correctness Rules
  // ========================
  {
    id: 'corr-vue-lifecycle-hooks',
    name: 'Vue Lifecycle Hook Issues',
    description: 'Incorrect lifecycle hook usage detected — check hook ordering and cleanup',
    severity: 'warn',
    category: 'correctness',
    frameworks: ['vue'],
    weight: 4,
  },
  {
    id: 'corr-react-useeffect-deps',
    name: 'React useEffect Missing Dependencies',
    description: 'useEffect hook may be missing dependencies — could cause stale closures or infinite loops',
    severity: 'error',
    category: 'correctness',
    frameworks: ['react'],
    weight: 6,
  },
  {
    id: 'corr-react-usestate-initializer',
    name: 'React useState Lazy Initializer',
    description: 'Expensive computation in useState initializer — use lazy initialization function',
    severity: 'info',
    category: 'correctness',
    frameworks: ['react'],
    weight: 2,
  },
  {
    id: 'corr-angular-ondestroy',
    name: 'Angular Missing OnDestroy Cleanup',
    description: 'Component with subscriptions or intervals missing OnDestroy cleanup — memory leak risk',
    severity: 'warn',
    category: 'correctness',
    frameworks: ['angular'],
    weight: 5,
  },
  {
    id: 'corr-svelte-store-subscription',
    name: 'Svelte Store Subscription Leak',
    description: 'Auto-subscribed store not properly cleaned up — potential memory leak',
    severity: 'warn',
    category: 'correctness',
    frameworks: ['svelte'],
    weight: 4,
  },
  {
    id: 'corr-type-assertion-any',
    name: 'Excessive Type Assertion to any',
    description: 'Type assertion to "any" defeats TypeScript safety — use proper types or unknown',
    severity: 'warn',
    category: 'correctness',
    frameworks: ['vue', 'react', 'angular', 'svelte'],
    weight: 3,
  },
  {
    id: 'corr-console-log-prod',
    name: 'console.log in Production Code',
    description: 'console.log/console.debug statements found — remove before production deployment',
    severity: 'info',
    category: 'correctness',
    frameworks: ['vue', 'react', 'angular', 'svelte'],
    weight: 1,
  },

  // ========================
  // Architecture Rules
  // ========================
  {
    id: 'arch-component-depth',
    name: 'Deep Component Nesting',
    description: 'Component nesting depth exceeds 5 levels — consider flattening the component tree',
    severity: 'warn',
    category: 'architecture',
    frameworks: ['vue', 'react', 'angular', 'svelte'],
    weight: 3,
  },
  {
    id: 'arch-prop-drilling',
    name: 'Prop Drilling Detection',
    description: 'Props passed through 3+ levels — consider using provide/inject, context, or state management',
    severity: 'info',
    category: 'architecture',
    frameworks: ['vue', 'react', 'svelte'],
    weight: 2,
  },
  {
    id: 'arch-god-component',
    name: 'God Component Anti-pattern',
    description: 'Single component handles too many responsibilities — apply separation of concerns',
    severity: 'warn',
    category: 'architecture',
    frameworks: ['vue', 'react', 'angular', 'svelte'],
    weight: 4,
  },
  {
    id: 'arch-no-error-boundary',
    name: 'Missing Error Boundary',
    description: 'No error boundary detected — unhandled errors will crash the entire application',
    severity: 'warn',
    category: 'architecture',
    frameworks: ['react'],
    weight: 4,
  },
  {
    id: 'arch-vue-no-error-handler',
    name: 'Missing Global Error Handler',
    description: 'No Vue global error handler (app.config.errorHandler) detected',
    severity: 'warn',
    category: 'architecture',
    frameworks: ['vue'],
    weight: 4,
  },
  {
    id: 'arch-no-lazy-loading',
    name: 'Missing Route Lazy Loading',
    description: 'All routes are eagerly loaded — use dynamic imports for code splitting',
    severity: 'info',
    category: 'architecture',
    frameworks: ['vue', 'react', 'angular', 'svelte'],
    weight: 3,
  },

  // ========================
  // Accessibility Rules
  // ========================
  {
    id: 'a11y-missing-alt',
    name: 'Missing Image Alt Text',
    description: '<img> tag without alt attribute — screen readers cannot describe the image',
    severity: 'error',
    category: 'accessibility',
    frameworks: ['vue', 'react', 'angular', 'svelte'],
    weight: 5,
  },
  {
    id: 'a11y-missing-label',
    name: 'Missing Form Label',
    description: 'Form input without associated label — screen readers cannot identify the field purpose',
    severity: 'warn',
    category: 'accessibility',
    frameworks: ['vue', 'react', 'angular', 'svelte'],
    weight: 4,
  },
  {
    id: 'a11y-missing-aria',
    name: 'Missing ARIA Attributes',
    description: 'Interactive element missing appropriate ARIA attributes for accessibility',
    severity: 'warn',
    category: 'accessibility',
    frameworks: ['vue', 'react', 'angular', 'svelte'],
    weight: 3,
  },
  {
    id: 'a11y-low-contrast',
    name: 'Low Color Contrast',
    description: 'Inline styles with potential low contrast ratio — ensure WCAG 2.1 AA compliance (4.5:1)',
    severity: 'info',
    category: 'accessibility',
    frameworks: ['vue', 'react', 'angular', 'svelte'],
    weight: 2,
  },
  {
    id: 'a11y-click-div',
    name: 'Clickable Div Without Role',
    description: 'Div with click handler but no role="button" or tabindex — not keyboard accessible',
    severity: 'warn',
    category: 'accessibility',
    frameworks: ['vue', 'react', 'angular', 'svelte'],
    weight: 4,
  },

  // ========================
  // Best Practice Rules
  // ========================
  {
    id: 'bp-hardcoded-strings',
    name: 'Hardcoded Strings',
    description: 'Hardcoded user-facing strings detected — consider using i18n for internationalization',
    severity: 'info',
    category: 'best-practice',
    frameworks: ['vue', 'react', 'angular', 'svelte'],
    weight: 1,
  },
  {
    id: 'bp-no-typescript',
    name: 'Missing TypeScript',
    description: 'JavaScript files found in project — consider migrating to TypeScript for type safety',
    severity: 'info',
    category: 'best-practice',
    frameworks: ['vue', 'react', 'angular', 'svelte'],
    weight: 2,
  },
  {
    id: 'bp-magic-numbers',
    name: 'Magic Numbers',
    description: 'Unexplained numeric literals in code — extract to named constants for readability',
    severity: 'info',
    category: 'best-practice',
    frameworks: ['vue', 'react', 'angular', 'svelte'],
    weight: 1,
  },
  {
    id: 'bp-no-unit-tests',
    name: 'Missing Unit Tests',
    description: 'No test files detected — add unit tests to ensure code reliability',
    severity: 'warn',
    category: 'best-practice',
    frameworks: ['vue', 'react', 'angular', 'svelte'],
    weight: 3,
  },
  {
    id: 'bp-outdated-deps',
    name: 'Outdated Dependencies',
    description: 'Dependencies with known security vulnerabilities or major version lag detected',
    severity: 'warn',
    category: 'best-practice',
    frameworks: ['vue', 'react', 'angular', 'svelte'],
    weight: 4,
  },
  {
    id: 'bp-vue-composition-api',
    name: 'Vue 3 Options API Usage',
    description: 'Using Options API in Vue 3 — consider migrating to Composition API for better reusability',
    severity: 'info',
    category: 'best-practice',
    frameworks: ['vue'],
    weight: 2,
  },
  {
    id: 'bp-react-class-component',
    name: 'React Class Component',
    description: 'Class component detected — prefer functional components with hooks',
    severity: 'info',
    category: 'best-practice',
    frameworks: ['react'],
    weight: 2,
  },
  {
    id: 'bp-angular-standalone',
    name: 'Angular Non-Standalone Component',
    description: 'Component not using standalone: true — migrate to standalone components (Angular 14+)',
    severity: 'info',
    category: 'best-practice',
    frameworks: ['angular'],
    weight: 2,
  },

  // ========================
  // Dead Code Rules
  // ========================
  {
    id: 'dc-unused-import',
    name: 'Unused Import',
    description: 'Imported module/variable is never used in the file',
    severity: 'warn',
    category: 'dead-code',
    frameworks: ['vue', 'react', 'angular', 'svelte'],
    weight: 2,
  },
  {
    id: 'dc-unused-variable',
    name: 'Unused Variable',
    description: 'Declared variable is never referenced',
    severity: 'warn',
    category: 'dead-code',
    frameworks: ['vue', 'react', 'angular', 'svelte'],
    weight: 2,
  },
  {
    id: 'dc-unused-function',
    name: 'Unused Function/Method',
    description: 'Function or method is declared but never called',
    severity: 'warn',
    category: 'dead-code',
    frameworks: ['vue', 'react', 'angular', 'svelte'],
    weight: 2,
  },
  {
    id: 'dc-commented-code',
    name: 'Commented-out Code Blocks',
    description: 'Large blocks of commented-out code detected — remove dead code or use version control',
    severity: 'info',
    category: 'dead-code',
    frameworks: ['vue', 'react', 'angular', 'svelte'],
    weight: 1,
  },
];

/**
 * Get rules filtered by framework and category
 */
export function getRulesForFramework(
  framework: string,
  categories?: RuleCategory[]
): DiagnosticRule[] {
  return rules.filter((rule) => {
    const frameworkMatch = rule.frameworks.length === 0 || rule.frameworks.includes(framework as any);
    const categoryMatch = !categories || categories.length === 0 || categories.includes(rule.category);
    return frameworkMatch && categoryMatch;
  });
}

/**
 * Get rules filtered by minimum severity
 */
export function filterBySeverity(
  ruleList: DiagnosticRule[],
  minSeverity: Severity
): DiagnosticRule[] {
  const severityOrder: Record<Severity, number> = { error: 3, warn: 2, info: 1 };
  const minLevel = severityOrder[minSeverity] || 0;
  return ruleList.filter((r) => severityOrder[r.severity] >= minLevel);
}
