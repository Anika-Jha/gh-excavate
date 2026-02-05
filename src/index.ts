#!/usr/bin/env node
import { Command } from "commander";
import { askCopilot } from "./utils/copilot";
import { readTarget } from "./utils/fs";
import { getFileHistory } from "./utils/git";

const program = new Command();

program
  .name("gh-excavate")
  .description("Understand any codebase you didn’t write")
  .version("0.1.0");

program
  .command("dig <path>")
  .description("Excavate context, intent, and risk from a file or folder")
  .option("--roast", "Enable gentle roast mode")
  .option("--archaeology", "Include git history and evolution context")
  .action(async (path, options) => {
    console.log(`🏛️ Excavating ${path}...\n`);

    try {
      const content = readTarget(path);

      let history = null;

      if (options.archaeology) {
        console.log("📜 Collecting git history...");
        history = await getFileHistory(path);
      }

      const prompt = `
You are a senior engineer performing **code archaeology**.

Your job:
- Explain what this code does
- Why it likely exists
- How it evolved over time
- What problem it was reacting to
- Call out red flags, legacy scars, or design smells

${options.roast ? "Be slightly sarcastic but still helpful." : ""}

${history ? `--- GIT HISTORY ---
${JSON.stringify(history, null, 2)}
` : ""}

--- CODE ---
${content}
--- END ---
      `;

      const response = await askCopilot(prompt);
      console.log(response);
    } catch (err: any) {
      console.error("❌ Excavation failed:");
      console.error(err.message);
    }
  });

program
  .command("blame-smart <question>")
  .description("Investigate why something behaves the way it does")
  .action((question) => {
    console.log(`🧠 Investigating: ${question}`);
  });

program
  .command("should-this-exist <path>")
  .description("Determine whether a file or module is still needed")
  .option("--roast", "Enable gentle roast mode")
  .action((path, options) => {
    console.log(`🏛️ Evaluating existence of ${path}...`);
    if (options.roast) {
      console.log("😈 Brutally honest mode enabled");
    }
  });

program.parse();
