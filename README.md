# gh-excavate

**Understand any codebase you didn’t write — quickly.**

`gh-excavate` is a TypeScript-based CLI tool that helps developers analyze both local and remote code repositories. Using **GitHub Copilot**, it performs "code archaeology" by inspecting files, folders, or entire repos to uncover the **intent, history, design decisions, and potential risks** behind the code.

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
1. Clone the repository:

```bash
git clone https://github.com/YourUsername/gh-excavate.git
cd gh-excavate


