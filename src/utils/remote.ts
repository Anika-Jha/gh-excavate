import { tmpdir } from "os";
import { join } from "path";
import { mkdtemp, rm } from "fs/promises";
import simpleGit, { SimpleGit } from "simple-git";
import ora from "ora";

export interface CloneResult {
  dir: string;
  cleanup: () => Promise<void>;
}

export async function cloneRepo(repo: string): Promise<CloneResult> {
  const spinner = ora(`🌐 Cloning ${repo}...`).start();

  const tempDir = await mkdtemp(join(tmpdir(), "excavate-"));
  const git: SimpleGit = simpleGit();

  try {
    await git.clone(`https://github.com/${repo}.git`, tempDir);
    spinner.succeed(`✅ Cloned ${repo}`);

    return {
      dir: tempDir,
      cleanup: async () => {
        spinner.start("🧹 Cleaning up temp clone...");
        await rm(tempDir, { recursive: true, force: true });
        spinner.succeed("✅ Temp clone removed");
      },
    };
  } catch (err: any) {
    spinner.fail(`❌ Failed to clone ${repo}`);
    throw err;
  }
}
