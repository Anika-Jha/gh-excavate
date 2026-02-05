import simpleGit from "simple-git";

const git = simpleGit();

export async function getFileHistory(path: string) {
  const log = await git.log({ file: path, maxCount: 10 });

  return {
    totalCommits: log.total,
    commits: log.all.map(c => ({
      hash: c.hash,
      date: c.date,
      message: c.message,
      author: c.author_name
    }))
  };
}
