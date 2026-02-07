# gh-excavate

**Understand any codebase you didn’t write : quickly and intelligently**

`gh-excavate` is a TypeScript-based GitHub CLI extension built for code archaeology. It analyzes local and remote repositories using Git metadata, structural inspection, and GitHub Copilot to uncover the intent, evolution, design decisions, and potential risks behind a codebase.

Instead of manually scanning commits and stitching context together, `gh-excavate` synthesizes it for you directly in your terminal.

---

## Features

- Analyze a file, folder, or entire repository to infer purpose and architecture 
- Trace the life of a file from creation to deletion
- Detect potentially dead or abandoned code
- Investigate mysterious code behavior (planned)
- Surface design smells and structural risks
- Supports **local paths** or **GitHub repos** (`owner/repo[:path]`)
- Optional gentle roast mode for a humorous but insightful code critique
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
<img width="785" height="247" alt="gh_help " src="https://github.com/user-attachments/assets/9102746d-e6d6-4f34-8b81-2f8fcec87537" />

---

## Usage

### Analyze a local folder
Analyze an entire local directory to understand its purpose, architecture, and potential risks.
-if inside root folder use src, else ./src
```bash
gh excavate dig src
```
<img width="1091" height="344" alt="dig_src_1" src="https://github.com/user-attachments/assets/707acd45-bf59-4da4-b568-e1af374e06e9" />

### Analyze a local folder with gentle roast mode
Same analysis but with light, constructive criticism enabled.
```bash
gh excavate dig src --roast
```
<img width="1091" height="133" alt="dig_src_2" src="https://github.com/user-attachments/assets/9e96dd58-cef1-41c8-95d0-6d867b11a0a4" />

### Analyze a remote GitHub repository
Clone a public GitHub repository temporarily and analyze its structure and intent.
```bash
gh excavate dig owner/repo
```
[remote_repo.zip](https://github.com/user-attachments/files/25153495/remote_repo.zip)

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
<img width="503" height="66" alt="relic" src="https://github.com/user-attachments/assets/4821836c-9499-4bb0-8f80-24eb818446c0" />

### Detect likely dead code
Check whether a file appears unused based on git activity.
```bash
gh excavate should-this-exist src/old-helper.ts
```
<img width="503" height="75" alt="should_this_exist" src="https://github.com/user-attachments/assets/2c30183f-6a54-4cb4-bc19-9ca3289e54b5" />

### Ask a contextual blame question (experimental)
Investigate why something behaves a certain way.
```bash
gh excavate blame-smart "Why does this service retry three times?"
```
<img width="940" height="634" alt="investigate" src="https://github.com/user-attachments/assets/69d82219-287c-406c-bb5a-6caaeb8de4ed" />

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

- Performance depends on repository size and network conditions.
- Requires GitHub CLI (gh) authentication.
- Requires access to GitHub Copilot CLI.
- Remote repositories are cloned into temporary directories and safely removed after analysis.

