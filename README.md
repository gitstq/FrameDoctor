<p align="center">
  <img src="https://img.shields.io/badge/version-1.0.0-blue.svg" alt="Version" />
  <img src="https://img.shields.io/badge/license-MIT-green.svg" alt="License" />
  <img src="https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen.svg" alt="Node.js" />
  <img src="https://img.shields.io/badge/TypeScript-5.4+-3178C6.svg" alt="TypeScript" />
  <img src="https://img.shields.io/badge/zero_dependencies-🟢-success.svg" alt="Zero Dependencies" />
</p>

<h1 align="center">🏥 FrameDoctor</h1>

<p align="center">
  <strong>Multi-Framework Frontend Code Health Diagnostic CLI Tool</strong><br/>
  Vue · React · Svelte · Angular — One Command, Full Health Check
</p>

<p align="center">
  <a href="#-简体中文">简体中文</a> ·
  <a href="#-繁體中文">繁體中文</a> ·
  <a href="#-english">English</a>
</p>

---

<a id="-简体中文"></a>

## 🎉 项目介绍

**FrameDoctor** 是一款轻量级、零运行时依赖的多框架前端代码健康诊断 CLI 工具。只需一条命令，即可对 Vue 2/3、React、Svelte、Angular 项目进行全面的代码质量扫描，输出 0-100 分的健康评分及可操作的诊断建议。

### 💡 灵感来源与差异化亮点

受 GitHub Trending 热门项目 [react-doctor](https://github.com/millionco/react-doctor)（7.6k+ stars）启发，FrameDoctor 在其核心理念基础上进行了**全面差异化升级**：

- 🌐 **多框架支持**：react-doctor 仅支持 React，FrameDoctor 支持 Vue 2/3、React、Svelte、Angular 四大主流框架
- 📦 **零运行时依赖**：仅依赖 Node.js 内置模块，安装即用，无环境陷阱
- 🔍 **40+ 诊断规则**：覆盖性能、安全、正确性、架构、可访问性、最佳实践、死代码 7 大维度
- 📊 **智能评分系统**：基于指数衰减算法的 0-100 分健康评分 + A-F 等级评定
- 🧹 **死代码检测**：自动发现未使用的导入、注释代码块等冗余内容
- 🏗️ **框架自动识别**：自动检测项目框架、版本、包管理器、构建工具

---

## ✨ 核心特性

| 特性 | 描述 |
|---|---|
| 🌐 **多框架支持** | Vue 2/3、React、Svelte、Angular 四大主流前端框架 |
| ⚡ **零依赖** | 仅依赖 Node.js 内置模块，安装体积极小 |
| 🔍 **40+ 诊断规则** | 覆盖性能、安全、正确性、架构、可访问性、最佳实践、死代码 |
| 📊 **健康评分** | 0-100 分量化评分 + A-F 等级，一目了然 |
| 🏗️ **自动检测** | 自动识别框架类型、版本、包管理器、构建工具 |
| 🧹 **死代码检测** | 发现未使用的导入、变量、注释代码块 |
| 📋 **多格式输出** | 支持终端彩色输出和 JSON 格式报告 |
| 🎯 **灵活过滤** | 按类别、严重程度过滤，精准定位问题 |
| 🧪 **内置测试** | 16 个单元测试，确保核心引擎稳定可靠 |

---

## 🚀 快速开始

### 环境要求

- **Node.js** >= 18.0.0
- **npm** / **yarn** / **pnpm** / **bun**（任一包管理器）

### 安装

```bash
# 全局安装（推荐）
npm install -g framedoctor

# 或使用 npx 直接运行（无需安装）
npx framedoctor .
```

### 本地开发

```bash
# 克隆仓库
git clone https://github.com/gitstq/FrameDoctor.git
cd FrameDoctor

# 安装依赖
npm install

# 编译 TypeScript
npm run build

# 运行测试
npm test

# 扫描当前项目
node dist/index.js .
```

### 使用示例

```bash
# 扫描当前目录
framedoctor .

# 扫描指定项目
framedoctor ./my-vue-project

# 仅检查安全和性能问题
framedoctor . --categories security,performance

# 仅显示错误级别问题
framedoctor . --min-severity error

# 输出 JSON 格式报告并保存到文件
framedoctor . --output json --file report.json

# 忽略特定目录
framedoctor . --ignore dist,build,generated
```

---

## 📖 详细使用指南

### CLI 参数说明

| 参数 | 简写 | 说明 | 示例 |
|---|---|---|---|
| `--output` | `-o` | 输出格式：`text`（默认）或 `json` | `-o json` |
| `--file` | `-f` | 将 JSON 报告保存到指定文件 | `-f report.json` |
| `--categories` | `-c` | 仅检查指定类别（逗号分隔） | `-c security,performance` |
| `--min-severity` | `-s` | 最低严重程度：`error`、`warn`、`info` | `-s warn` |
| `--no-dead-code` | `-d` | 跳过死代码检测 | `-d` |
| `--ignore` | `-i` | 额外的忽略模式（逗号分隔） | `-i dist,build` |
| `--verbose` | `-v` | 显示详细输出 | `-v` |
| `--help` | `-h` | 显示帮助信息 | `-h` |
| `--version` | `-V` | 显示版本号 | `-V` |

### 诊断类别

| 类别 | 说明 | 规则数 |
|---|---|---|
| ⚡ Performance | 性能优化建议 | 9 |
| 🔒 Security | 安全漏洞检测 | 6 |
| ✅ Correctness | 代码正确性检查 | 7 |
| 🏗️ Architecture | 架构设计建议 | 6 |
| ♿ Accessibility | 可访问性检查 | 5 |
| 📋 Best Practices | 最佳实践建议 | 8 |
| 🧹 Dead Code | 死代码检测 | 4 |

### 编程接口

```typescript
import { diagnose } from 'framedoctor';

// 运行诊断
const report = diagnose('./my-project');

console.log(`健康评分: ${report.healthScore}/100 (${report.grade})`);
console.log(`检测到 ${report.issues.length} 个问题`);
console.log(`扫描了 ${report.filesScanned} 个文件`);
```

---

## 💡 设计思路与迭代规划

### 设计理念

FrameDoctor 的核心设计理念是**零门槛、零配置、多框架**。我们相信代码质量检查不应该需要繁琐的配置过程，开发者应该能够一条命令就获得有价值的诊断结果。

### 技术选型原因

- **TypeScript**：提供完整的类型安全，确保诊断引擎的可靠性
- **零运行时依赖**：仅使用 Node.js 内置模块（fs、path），确保安装速度和兼容性
- **AST-free 设计**：采用正则表达式 + 启发式规则，避免引入重量级 AST 解析库，保持轻量

### 后续迭代计划

- [ ] **自动修复模式**（`--fix`）：自动修复常见问题
- [ ] **CI/CD 集成**：GitHub Actions 质量门禁
- [ ] **历史趋势追踪**：记录评分变化，生成趋势图
- [ ] **HTML 可视化报告**：生成交互式 HTML 报告
- [ ] **更多框架支持**：Solid.js、Preact、Qwik
- [ ] **编辑器插件**：VS Code / WebStorm 实时诊断

---

## 📦 打包与部署

### 作为 npm 包使用

```bash
# 全局安装
npm install -g framedoctor

# 在项目中使用
npm install framedoctor
```

### 作为 CLI 工具

FrameDoctor 是一个纯 CLI 工具，无需打包部署。编译后的 `dist/` 目录可直接运行：

```bash
# 编译
npm run build

# 运行
node dist/index.js <project-path>
```

### 兼容环境

| 环境 | 最低版本 |
|---|---|
| Node.js | >= 18.0.0 |
| 操作系统 | Windows / macOS / Linux |
| 包管理器 | npm / yarn / pnpm / bun |

---

## 🤝 贡献指南

欢迎贡献代码！请遵循以下规范：

1. **Fork** 本仓库
2. 创建特性分支：`git checkout -b feature/my-feature`
3. 提交更改：`git commit -m "feat: add my feature"`
4. 推送分支：`git push origin feature/my-feature`
5. 提交 **Pull Request**

### 提交规范

遵循 Angular 提交规范：

- `feat:` 新增功能
- `fix:` 修复问题
- `docs:` 文档更新
- `refactor:` 代码重构
- `test:` 测试相关
- `chore:` 构建/工具链更新

### Issue 反馈

发现 Bug 或有功能建议？请 [提交 Issue](https://github.com/gitstq/FrameDoctor/issues)。

---

## 📄 开源协议

本项目基于 [MIT License](./LICENSE) 开源。

---

<a id="-繁體中文"></a>

## 🎉 專案介紹

**FrameDoctor** 是一款輕量級、零執行期依賴的多框架前端程式碼健康診斷 CLI 工具。只需一條命令，即可對 Vue 2/3、React、Svelte、Angular 專案進行全面的程式碼品質掃描，輸出 0-100 分的健康評分及可操作的診斷建議。

### 💡 靈感來源與差異化亮點

受 GitHub Trending 熱門專案 [react-doctor](https://github.com/millionco/react-doctor)（7.6k+ stars）啟發，FrameDoctor 在其核心理念基礎上進行了**全面差異化升級**：

- 🌐 **多框架支援**：react-doctor 僅支援 React，FrameDoctor 支援 Vue 2/3、React、Svelte、Angular 四大主流框架
- 📦 **零執行期依賴**：僅依賴 Node.js 內建模組，安裝即用，無環境陷阱
- 🔍 **40+ 診斷規則**：涵蓋效能、安全、正確性、架構、可訪問性、最佳實踐、死程式碼 7 大維度
- 📊 **智慧評分系統**：基於指數衰減演算法的 0-100 分健康評分 + A-F 等級評定
- 🧹 **死程式碼偵測**：自動發現未使用的匯入、註解程式碼區塊等冗餘內容
- 🏗️ **框架自動識別**：自動偵測專案框架、版本、套件管理器、建置工具

---

## ✨ 核心特性

| 特性 | 描述 |
|---|---|
| 🌐 **多框架支援** | Vue 2/3、React、Svelte、Angular 四大主流前端框架 |
| ⚡ **零依賴** | 僅依賴 Node.js 內建模組，安裝體積極小 |
| 🔍 **40+ 診斷規則** | 涵蓋效能、安全、正確性、架構、可訪問性、最佳實踐、死程式碼 |
| 📊 **健康評分** | 0-100 分量化評分 + A-F 等級，一目了然 |
| 🏗️ **自動偵測** | 自動識別框架類型、版本、套件管理器、建置工具 |
| 🧹 **死程式碼偵測** | 發現未使用的匯入、變數、註解程式碼區塊 |
| 📋 **多格式輸出** | 支援終端彩色輸出和 JSON 格式報告 |
| 🎯 **靈活過濾** | 按類別、嚴重程度過濾，精準定位問題 |
| 🧪 **內建測試** | 16 個單元測試，確保核心引擎穩定可靠 |

---

## 🚀 快速開始

### 環境需求

- **Node.js** >= 18.0.0
- **npm** / **yarn** / **pnpm** / **bun**（任一套件管理器）

### 安裝

```bash
# 全域安裝（推薦）
npm install -g framedoctor

# 或使用 npx 直接執行（無需安裝）
npx framedoctor .
```

### 本地開發

```bash
# 克隆倉庫
git clone https://github.com/gitstq/FrameDoctor.git
cd FrameDoctor

# 安裝依賴
npm install

# 編譯 TypeScript
npm run build

# 執行測試
npm test

# 掃描當前專案
node dist/index.js .
```

### 使用範例

```bash
# 掃描當前目錄
framedoctor .

# 掃描指定專案
framedoctor ./my-vue-project

# 僅檢查安全和效能問題
framedoctor . --categories security,performance

# 僅顯示錯誤級別問題
framedoctor . --min-severity error

# 輸出 JSON 格式報告並儲存到檔案
framedoctor . --output json --file report.json

# 忽略特定目錄
framedoctor . --ignore dist,build,generated
```

---

## 📖 詳細使用指南

### CLI 參數說明

| 參數 | 簡寫 | 說明 | 範例 |
|---|---|---|---|
| `--output` | `-o` | 輸出格式：`text`（預設）或 `json` | `-o json` |
| `--file` | `-f` | 將 JSON 報告儲存到指定檔案 | `-f report.json` |
| `--categories` | `-c` | 僅檢查指定類別（逗號分隔） | `-c security,performance` |
| `--min-severity` | `-s` | 最低嚴重程度：`error`、`warn`、`info` | `-s warn` |
| `--no-dead-code` | `-d` | 跳過死程式碼偵測 | `-d` |
| `--ignore` | `-i` | 額外的忽略模式（逗號分隔） | `-i dist,build` |
| `--verbose` | `-v` | 顯示詳細輸出 | `-v` |
| `--help` | `-h` | 顯示說明資訊 | `-h` |
| `--version` | `-V` | 顯示版本號 | `-V` |

### 診斷類別

| 類別 | 說明 | 規則數 |
|---|---|---|
| ⚡ Performance | 效能最佳化建議 | 9 |
| 🔒 Security | 安全漏洞偵測 | 6 |
| ✅ Correctness | 程式碼正確性檢查 | 7 |
| 🏗️ Architecture | 架構設計建議 | 6 |
| ♿ Accessibility | 可訪問性檢查 | 5 |
| 📋 Best Practices | 最佳實踐建議 | 8 |
| 🧹 Dead Code | 死程式碼偵測 | 4 |

### 程式設計介面

```typescript
import { diagnose } from 'framedoctor';

// 執行診斷
const report = diagnose('./my-project');

console.log(`健康評分: ${report.healthScore}/100 (${report.grade})`);
console.log(`偵測到 ${report.issues.length} 個問題`);
console.log(`掃描了 ${report.filesScanned} 個檔案`);
```

---

## 💡 設計思路與迭代規劃

### 設計理念

FrameDoctor 的核心設計理念是**零門檻、零配置、多框架**。我們相信程式碼品質檢查不應該需要繁瑣的配置過程，開發者應該能夠一條命令就獲得有價值的診斷結果。

### 技術選型原因

- **TypeScript**：提供完整的型別安全，確保診斷引擎的可靠性
- **零執行期依賴**：僅使用 Node.js 內建模組（fs、path），確保安裝速度和相容性
- **AST-free 設計**：採用正規表示式 + 啟發式規則，避免引入重量級 AST 解析函式庫，保持輕量

### 後續迭代計畫

- [ ] **自動修復模式**（`--fix`）：自動修復常見問題
- [ ] **CI/CD 整合**：GitHub Actions 品質門禁
- [ ] **歷史趨勢追蹤**：記錄評分變化，生成趨勢圖
- [ ] **HTML 視覺化報告**：產生互動式 HTML 報告
- [ ] **更多框架支援**：Solid.js、Preact、Qwik
- [ ] **編輯器外掛**：VS Code / WebStorm 即時診斷

---

## 📦 打包與部署

### 作為 npm 套件使用

```bash
# 全域安裝
npm install -g framedoctor

# 在專案中使用
npm install framedoctor
```

### 作為 CLI 工具

FrameDoctor 是一個純 CLI 工具，無需打包部署。編譯後的 `dist/` 目錄可直接執行：

```bash
# 編譯
npm run build

# 執行
node dist/index.js <project-path>
```

### 相容環境

| 環境 | 最低版本 |
|---|---|
| Node.js | >= 18.0.0 |
| 作業系統 | Windows / macOS / Linux |
| 套件管理器 | npm / yarn / pnpm / bun |

---

## 🤝 貢獻指南

歡迎貢獻程式碼！請遵循以下規範：

1. **Fork** 本倉庫
2. 建立特性分支：`git checkout -b feature/my-feature`
3. 提交變更：`git commit -m "feat: add my feature"`
4. 推送分支：`git push origin feature/my-feature`
5. 提交 **Pull Request**

### 提交規範

遵循 Angular 提交規範：

- `feat:` 新增功能
- `fix:` 修復問題
- `docs:` 文件更新
- `refactor:` 程式碼重構
- `test:` 測試相關
- `chore:` 建置/工具鏈更新

### Issue 回饋

發現 Bug 或有功能建議？請 [提交 Issue](https://github.com/gitstq/FrameDoctor/issues)。

---

## 📄 開源協議

本專案基於 [MIT License](./LICENSE) 開源。

---

<a id="-english"></a>

## 🎉 Introduction

**FrameDoctor** is a lightweight, zero-runtime-dependency CLI tool for multi-framework frontend code health diagnostics. With a single command, it scans Vue 2/3, React, Svelte, and Angular projects for comprehensive code quality analysis, outputting a 0-100 health score with actionable diagnostic suggestions.

### 💡 Inspiration & Differentiation

Inspired by the trending GitHub project [react-doctor](https://github.com/millionco/react-doctor) (7.6k+ stars), FrameDoctor delivers a **comprehensive differentiated upgrade**:

- 🌐 **Multi-Framework Support**: Unlike react-doctor (React-only), FrameDoctor supports Vue 2/3, React, Svelte, and Angular
- 📦 **Zero Runtime Dependencies**: Only uses Node.js built-in modules — instant setup, no environment traps
- 🔍 **40+ Diagnostic Rules**: Covers performance, security, correctness, architecture, accessibility, best practices, and dead code
- 📊 **Smart Scoring System**: Exponential decay algorithm for 0-100 health score + A-F grade
- 🧹 **Dead Code Detection**: Automatically finds unused imports, commented-out code blocks, and more
- 🏗️ **Auto-Detection**: Identifies framework type, version, package manager, and build tool automatically

---

## ✨ Core Features

| Feature | Description |
|---|---|
| 🌐 **Multi-Framework** | Vue 2/3, React, Svelte, Angular — all major frontend frameworks |
| ⚡ **Zero Dependencies** | Only Node.js built-in modules, minimal install size |
| 🔍 **40+ Rules** | Performance, security, correctness, architecture, accessibility, best practices, dead code |
| 📊 **Health Score** | Quantified 0-100 score + A-F grade at a glance |
| 🏗️ **Auto-Detection** | Identifies framework, version, package manager, and build tool |
| 🧹 **Dead Code Detection** | Finds unused imports, variables, commented-out code blocks |
| 📋 **Multi-Format Output** | Terminal colored output and JSON format reports |
| 🎯 **Flexible Filtering** | Filter by category and severity for precise issue targeting |
| 🧪 **Built-in Tests** | 16 unit tests ensuring core engine reliability |

---

## 🚀 Quick Start

### Requirements

- **Node.js** >= 18.0.0
- **npm** / **yarn** / **pnpm** / **bun** (any package manager)

### Installation

```bash
# Global install (recommended)
npm install -g framedoctor

# Or run directly with npx (no install needed)
npx framedoctor .
```

### Local Development

```bash
# Clone the repository
git clone https://github.com/gitstq/FrameDoctor.git
cd FrameDoctor

# Install dependencies
npm install

# Build TypeScript
npm run build

# Run tests
npm test

# Scan current project
node dist/index.js .
```

### Usage Examples

```bash
# Scan current directory
framedoctor .

# Scan a specific project
framedoctor ./my-vue-project

# Only check security and performance
framedoctor . --categories security,performance

# Only show error-level issues
framedoctor . --min-severity error

# Output JSON report and save to file
framedoctor . --output json --file report.json

# Ignore specific directories
framedoctor . --ignore dist,build,generated
```

---

## 📖 Detailed Usage Guide

### CLI Options

| Option | Short | Description | Example |
|---|---|---|---|
| `--output` | `-o` | Output format: `text` (default) or `json` | `-o json` |
| `--file` | `-f` | Save JSON report to file | `-f report.json` |
| `--categories` | `-c` | Only check specific categories (comma-separated) | `-c security,performance` |
| `--min-severity` | `-s` | Minimum severity: `error`, `warn`, `info` | `-s warn` |
| `--no-dead-code` | `-d` | Skip dead code detection | `-d` |
| `--ignore` | `-i` | Additional ignore patterns (comma-separated) | `-i dist,build` |
| `--verbose` | `-v` | Show verbose output | `-v` |
| `--help` | `-h` | Show help information | `-h` |
| `--version` | `-V` | Show version number | `-V` |

### Diagnostic Categories

| Category | Description | Rules |
|---|---|---|
| ⚡ Performance | Performance optimization suggestions | 9 |
| 🔒 Security | Security vulnerability detection | 6 |
| ✅ Correctness | Code correctness checks | 7 |
| 🏗️ Architecture | Architecture design suggestions | 6 |
| ♿ Accessibility | Accessibility checks | 5 |
| 📋 Best Practices | Best practice recommendations | 8 |
| 🧹 Dead Code | Dead code detection | 4 |

### Programmatic API

```typescript
import { diagnose } from 'framedoctor';

// Run diagnostics
const report = diagnose('./my-project');

console.log(`Health Score: ${report.healthScore}/100 (${report.grade})`);
console.log(`Found ${report.issues.length} issues`);
console.log(`Scanned ${report.filesScanned} files`);
```

---

## 💡 Design Philosophy & Roadmap

### Design Philosophy

FrameDoctor's core design principle is **zero-barrier, zero-config, multi-framework**. We believe code quality checks shouldn't require complex setup — developers should get valuable diagnostic insights with a single command.

### Technology Choices

- **TypeScript**: Full type safety ensuring diagnostic engine reliability
- **Zero Runtime Dependencies**: Only Node.js built-in modules (fs, path) for fast install and broad compatibility
- **AST-Free Design**: Regex + heuristic rules avoid heavyweight AST parsers, keeping the tool lightweight

### Roadmap

- [ ] **Auto-Fix Mode** (`--fix`): Automatically fix common issues
- [ ] **CI/CD Integration**: GitHub Actions quality gates
- [ ] **Historical Trend Tracking**: Track score changes over time with trend graphs
- [ ] **HTML Visual Reports**: Generate interactive HTML reports
- [ ] **More Frameworks**: Solid.js, Preact, Qwik support
- [ ] **Editor Plugins**: VS Code / WebStorm real-time diagnostics

---

## 📦 Build & Deployment

### As an npm Package

```bash
# Global install
npm install -g framedoctor

# Use in a project
npm install framedoctor
```

### As a CLI Tool

FrameDoctor is a pure CLI tool — no build/deployment needed. The compiled `dist/` directory is ready to run:

```bash
# Build
npm run build

# Run
node dist/index.js <project-path>
```

### Compatible Environments

| Environment | Minimum Version |
|---|---|
| Node.js | >= 18.0.0 |
| OS | Windows / macOS / Linux |
| Package Manager | npm / yarn / pnpm / bun |

---

## 🤝 Contributing

Contributions are welcome! Please follow these guidelines:

1. **Fork** this repository
2. Create a feature branch: `git checkout -b feature/my-feature`
3. Commit your changes: `git commit -m "feat: add my feature"`
4. Push to the branch: `git push origin feature/my-feature`
5. Submit a **Pull Request**

### Commit Convention

Follow the Angular commit convention:

- `feat:` New feature
- `fix:` Bug fix
- `docs:` Documentation update
- `refactor:` Code refactoring
- `test:` Test-related changes
- `chore:` Build/tooling updates

### Issue Reports

Found a bug or have a feature request? Please [open an issue](https://github.com/gitstq/FrameDoctor/issues).

---

## 📄 License

This project is licensed under the [MIT License](./LICENSE).

---

<p align="center">
  Built with ❤️ by <a href="https://github.com/gitstq">FrameDoctor Team</a>
</p>
