# gh-excavate

**Understand any codebase you didn’t write, quickly.**

`gh-excavate` is a TypeScript-based CLI tool that helps developers analyze both local and remote code repositories. Using **GitHub Copilot**, it performs "code archaeology" by inspecting files, folders, or entire repos to uncover the intent, history, design decisions, and potential risks** behind the code.
---

## Features

- Analyze a file or folder to understand purpose, risks, and design decisions
- Trace the life of a file from creation to deletion
- Detect likely dead code
- Investigate mysterious code behavior (planned)
- Supports **local paths** or **GitHub repos** (`owner/repo[:path]`)
- Provides optional **gentle roast mode** for a humorous code review
---

## Installation

### Prerequisites
- GitHub CLI (`gh`) installed and authenticated
- Node.js (v18+ recommended)
- npm

### Install
## 1. Clone the repo:
```bash
git clone https://github.com/YourUsername/gh-excavate.git
cd gh-excavate
```
## 2. Install dependencies:
```bash
npm install
```
## 3. Build Typescript project:
```bash
npm run build
```
## 4. Install as a GitHub CLI extension:
```bash
gh extension install .
```
## 5. Verify installation:
```bash
gh excavate --help
```
---

## Usage

### Analyze a local folder
Analyze an entire local directory to understand its purpose, architecture, and potential risks.
-if inside root folder use src, else ./src
```bash
gh excavate dig src
```

### Analyze a local folder with gentle roast mode
Same analysis but with light, constructive criticism enabled.
```bash
gh excavate dig src --roast
```
### Analyze a remote GitHub repository
Clone a public GitHub repository temporarily and analyze its structure and intent.
```bash
gh excavate dig owner/repo
```
### Analyze a specific file in a GitHub repository
Target a single file inside a repository.
```bash
gh excavate dig owner/repo:path/to/file.ts
```
### Trace the lifecycle of a file (git archaeology)
See when a file was created, last modified, and how it evolved.
```bash
gh excavate relic src/utils/git.ts
```
### Detect likely dead code
Check whether a file appears unused based on git activity.
```bash
gh excavate should-this-exist src/old-helper.ts
```
### Ask a contextual blame question (experimental)
Investigate why something behaves a certain way.
```bash
gh excavate blame-smart "Why does this service retry three times?"
```
---

## Commands

| Command | Description |
|--------|-------------|
| `dig <path>` | Excavates a file, folder, or repository for purpose, risks, and design decisions |
| `should-this-exist <path>` | Determines whether a file or module is likely dead |
| `relic <path>` | Traces the lifecycle of a file using Git history |
| `blame-smart <question>` | Investigates why something behaves a certain way (future feature) |
| `help` | Displays command help |

### Options

- `--roast` — Adds a light sarcastic tone to the analysis
---

## How It Works

### Detect local vs remote
- If a GitHub repository is provided, it is temporarily cloned.
- If a local path is provided, it is analyzed directly.

### Read files and directories
- Loads file contents and directory structure.
- Reads important configuration files such as `package.json`, `README.md`, `tsconfig.json`, and others.

### Ask Copilot
- Sends relevant code and context to GitHub Copilot.
- Prompts Copilot to infer purpose, risks, and design decisions.

### Output results
- Displays a structured report including:
  - Project purpose
  - Why files exist
  - Design smells and risks
  - Recommendations for maintainers

### Cleanup
- Deletes temporary cloned repositories after analysis.
- Handles errors gracefully and prints informative messages.
---

## Notes

- Large repositories may take a few minutes to clone and analyze.
- Ensure GitHub CLI is installed and authenticated.
- Copilot requires a valid GitHub subscription and API access.
- Temporary clones are automatically removed after execution.

