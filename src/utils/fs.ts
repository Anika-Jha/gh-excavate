import fs from "fs";
import path from "path";

export function readTarget(targetPath: string): string {
  const resolved = path.resolve(targetPath);

  if (!fs.existsSync(resolved)) {
    throw new Error(`Path does not exist: ${targetPath}`);
  }

  const stat = fs.statSync(resolved);

  if (stat.isFile()) {
    return fs.readFileSync(resolved, "utf-8");
  }

  if (stat.isDirectory()) {
    const files = fs.readdirSync(resolved);
    return `Directory contains:\n${files.join("\n")}`;
  }

  throw new Error("Unsupported file type");
}
