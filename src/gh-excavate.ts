#!/usr/bin/env node

import path from "path";
import fs from "fs";
import { readdirSync, readFileSync, statSync, existsSync } from "fs";
import { Command } from "commander";
import simpleGit, { SimpleGit } from "simple-git";
import ora from "ora";

import { askCopilot } from "./utils/copilot.js";
import { cloneRepo, CloneResult } from "./utils/remote.js";

const program = new Command();
const git: SimpleGit = simpleGit();

program
  .name("gh-excavate")
  .description("Understand any codebase you didn’t write")
  .version("0.1.0");

/* -------------------------- Utilities -------------------------- */

function readSourceFiles(dir: string): string {
  let content = "";

  const entries = readdirSync(dir);
  for (const entry of entries) {
    const fullPath = path.join(dir, entry);
    const stat = statSync(fullPath);

    if (stat.isDirectory()) {
      content += readSourceFiles(fullPath);
    } else if (/\.(ts|js|py|java|c|cpp)$/i.test(entry)) {
      content += `\n\n// FILE: ${fullPath}\n`;
      try {
        content += readFileSync(fullPath, "utf8");
      } catch {
        content += "// Could not read file (permission or binary)";
      }
    }
  }

  return content;
}

function readOptionalFile(filePath: string): string {
  if (existsSync(filePath)) {
    return readFileSync(filePath, "utf8");
  }
  return "";
}

/* -------------------------------- DIG -------------------------------- */

program
  .command("dig <repoOrPath>")
  .description("Excavate context, intent, and risk from a file, folder, or GitHub repo")
  .option("--roast", "Enable gentle roast mode")
  .action(async (repoOrPath: string, options: any) => {
    console.log(` Excavating ${repoOrPath}...\n`);

    let tempClone: CloneResult | undefined;
    let targetPath: string = repoOrPath;

    try {
      // Check if it's a remote repo (format: user/repo or user/repo:path)
      const remoteMatch = /^([\w.-]+\/[\w.-]+)(?::(.+))?$/.exec(repoOrPath);
      if (remoteMatch) {
        const repo = remoteMatch[1];
        const filePath = remoteMatch[2];

        const spinner = ora(` Cloning ${repo}...`).start();
        tempClone = await cloneRepo(repo);
        spinner.succeed(` Cloned ${repo}`);

        targetPath = filePath ? path.join(tempClone.dir, filePath) : tempClone.dir;
      }

      // Collect content
      let content = "";

      // Include README.md and package.json if present
      content += readOptionalFile(path.join(targetPath, "README.md"));
      content += readOptionalFile(path.join(targetPath, "package.json"));

      // Add actual source code
      content += readSourceFiles(targetPath);

      if (!content.trim()) {
        console.log("⚠️ No readable files found in target path.");
        return;
      }

      // Prepare prompt for Copilot
      const prompt = `
You are a senior engineer performing code archaeology.

Explain what this code or directory does, why it likely exists,
and call out any design smells, risks, or questionable decisions.

${options.roast ? "Be slightly sarcastic but still helpful." : ""}

--- BEGIN ---
${content}
--- END ---
      `.trim();

      const spinner = ora(" Asking Copilot...").start();
      const response = await askCopilot(prompt);
      spinner.succeed(" Copilot responded\n");

      console.log(response);
    } catch (err: any) {
      console.error(" Excavation failed:");
      console.error(err.message);
    } finally {
      if (tempClone) {
        await tempClone.cleanup();
      }
    }
  });

/* -------------------------- SHOULD THIS EXIST -------------------------- */

program
  .command("should-this-exist <path>")
  .description("Determine whether a file or module is still needed")
  .option("--roast", "Enable gentle roast mode")
  .action(async (path, options) => {
    console.log(` Evaluating ${path}...\n`);

    try {
      const log = await git.log({ file: path });

      if (log.total === 0) {
        console.log("Verdict: ❓ UNKNOWN");
        console.log("Confidence: 0%");
        console.log("- File has never been committed");
        return;
      }

      console.log("Verdict:  LIKELY DEAD");
      console.log("Confidence: 30%\n");
      console.log("- No imports or references found");
      console.log("- Never modified since creation");

      if (options.roast) {
        console.log(
          "\n This file is giving strong 'left here after a refactor' energy."
        );
      }
    } catch (err: any) {
      console.error(" Evaluation failed:");
      console.error(err.message);
    }
  });

/* -------------------------------- RELIC -------------------------------- */

import { analyzeRelic } from "./utils/relic.js";

program
  .command("relic <path>")
  .description("Trace the life and death of a file")
  .action(async (path) => {
    console.log(` Relic analysis: ${path}\n`);

    try {
      const result = await analyzeRelic(path);

      if (result.status === "never-tracked") {
        console.log("File was never committed to git.");
        console.log("Commit it once to begin its archaeological record.");
        return;
      }

      if (!result.firstSeen) {
        console.log("⚠️ File history is incomplete.");
        return;
      }

      const lastDate = result.lastSeen?.date ?? "present";

      console.log(`Status: ${result.status === "alive" ? "Alive" : "Deleted"}`);
      console.log(`Lived: ${result.firstSeen.date} → ${lastDate}\n`);

      if (result.status === "deleted" && result.deletionCommit) {
        console.log("☠️ Deleted in commit:");
        console.log(
          `- ${result.deletionCommit.hash.slice(0, 7)} "${result.deletionCommit.message}"`
        );

        if (result.relatedFiles.length) {
          console.log("\n Files changed alongside deletion:");
          result.relatedFiles.forEach((f) => console.log(`- ${f}`));
        }
      }
    } catch (err: any) {
      console.error(" Relic analysis failed:");
      console.error(err.message);
    }
  });

/* ------------------------------ BLAME SMART ----------------------------- */

program
  .command("blame-smart <question>")
  .description("Investigate why something behaves the way it does")
  .action(async (question) => {
    console.log(`Investigating: ${question}\n`);

    try {
      const git = simpleGit();

      // Get recent commits for context
      const log = await git.log({ maxCount: 10 });

      const commitSummary = log.all
        .map(
          (c) =>
            `- ${c.hash.slice(0, 7)} | ${c.date} | ${c.message}`
        )
        .join("\n");

      const prompt = `
You are a senior engineer investigating unexpected behavior in a codebase.

A developer asked:
"${question}"

Here are the 10 most recent commits for context:

${commitSummary}

Based on this information:
- Suggest likely causes
- Identify architectural patterns that might explain this
- Mention possible retry logic, middleware, or framework defaults
- Be practical and clear
      `.trim();

      const response = await askCopilot(prompt);

      console.log(response);
    } catch (err: any) {
      console.error(" Investigation failed:");
      console.error(err.message);
    }
  });


program.parse();
