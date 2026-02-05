import fs from "fs";
import path from "path";
import simpleGit from "simple-git";

const git = simpleGit();

/* -------- usage scan (FIXED) -------- */

export function findUsages(
  targetFile: string,
  rootDir = process.cwd()
) {
  const results: string[] = [];

  const targetNoExt = targetFile.replace(/\.(ts|js)$/, "");
  const targetBase = path.basename(targetNoExt);

  function walk(dir: string) {
    const entries = fs.readdirSync(dir, { withFileTypes: true });

    for (const entry of entries) {
      if (
        entry.name.startsWith(".") ||
        entry.name === "node_modules"
      ) {
        continue;
      }

      const fullPath = path.join(dir, entry.name);

      if (entry.isDirectory()) {
        walk(fullPath);
      } else if (
        entry.isFile() &&
        (entry.name.endsWith(".ts") || entry.name.endsWith(".js"))
      ) {
        const content = fs.readFileSync(fullPath, "utf8");

        // Match common import patterns
        const importRegex = new RegExp(
          `from ['"].*${targetBase}['"]|require\\(['"].*${targetBase}['"]\\)`
        );

        if (importRegex.test(content)) {
          results.push(fullPath);
        }
      }
    }
  }

  walk(rootDir);
  return results;
}

/* -------- last modified -------- */

export async function lastModified(pathName: string) {
  try {
    const log = await git.log({ file: pathName, maxCount: 1 });
    if (log.total === 0) return null;
    return log.latest;
  } catch {
    return null;
  }
}
