import { execa } from "execa";
/**
 * Calls GitHub Copilot in non-interactive prompt mode
 */
export async function askCopilot(prompt) {
    const { stdout } = await execa("gh", [
        "copilot",
        "-p",
        prompt,
    ]);
    return stdout.trim();
}
