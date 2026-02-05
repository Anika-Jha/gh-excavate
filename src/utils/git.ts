import simpleGit from "simple-git";

const git = simpleGit();

/* -------- Archaeology: history -------- */

export async function getFileHistory(path: string) {
  try {
    const isRepo = await git.checkIsRepo();
    if (!isRepo) return null;

    const log = await git.log({ file: path, maxCount: 10 });

    if (log.total === 0) {
      return {
        note: "No commit history found for this file yet.",
        commits: []
      };
    }

    return {
      totalCommits: log.total,
      commits: log.all.map(c => ({
        hash: c.hash,
        date: c.date,
        message: c.message,
        author: c.author_name
      }))
    };
  } catch {
    return {
      note: "Git history unavailable (repo has no commits yet).",
      commits: []
    };
  }
}

/* -------- Blame-Smart: recent cause -------- */

export async function getRecentChange(path: string) {
  try {
    const log = await git.log({ file: path, maxCount: 1 });

    if (log.total === 0) return null;

    const commit = log.all[0];
    const diff = await git.show([commit.hash, "--", path]);

    return {
      hash: commit.hash,
      date: commit.date,
      message: commit.message,
      author: commit.author_name,
      diff
    };
  } catch {
    return null;
  }
}
