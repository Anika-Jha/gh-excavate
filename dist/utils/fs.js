import { readFileSync, readdirSync, statSync } from "fs";
import path from "path";
export function readTarget(filePath) {
    try {
        return readFileSync(filePath, "utf-8");
    }
    catch {
        return ""; // return empty string if file doesn't exist
    }
}
export function listDirectory(dirPath) {
    try {
        return readdirSync(dirPath).map((f) => {
            const fullPath = path.join(dirPath, f);
            const stats = statSync(fullPath);
            return stats.isDirectory() ? f + "/" : f;
        });
    }
    catch {
        return [];
    }
}
