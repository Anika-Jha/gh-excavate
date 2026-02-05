import simpleGit from "simple-git";
const git = simpleGit();
export async function analyzeRelic(filePath) {
    try {
        const log = await git.log({ file: filePath });
        if (log.total === 0) {
            return {
                status: "never-tracked",
            };
        }
        const first = log.all[log.total - 1];
        const last = log.latest;
        // Check if file exists in HEAD
        let exists = true;
        try {
            await git.show([`HEAD:${filePath}`]);
        }
        catch {
            exists = false;
        }
        let deletionCommit = null;
        let relatedFiles = [];
        if (!exists) {
            const diff = await git.show([
                `${last?.hash}`,
                "--name-only",
            ]);
            relatedFiles = diff
                .split("\n")
                .map((l) => l.trim())
                .filter(Boolean)
                .filter((f) => f !== filePath);
            deletionCommit = last;
        }
        return {
            status: exists ? "alive" : "deleted",
            firstSeen: first,
            lastSeen: last,
            deletionCommit,
            relatedFiles,
        };
    }
    catch (err) {
        throw new Error(err.message);
    }
}
