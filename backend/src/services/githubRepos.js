const env = require("../config/env");

const githubHeaders = () => {
  const headers = {
    Accept: "application/vnd.github+json",
    "User-Agent": "rohannooniwal-portfolio",
    "X-GitHub-Api-Version": "2022-11-28",
  };
  if (env.githubToken) {
    headers.Authorization = `Bearer ${env.githubToken}`;
  }
  return headers;
};

const fetchGithubRepos = async () => {
  const username = env.githubUsername;
  if (!username) {
    throw Object.assign(new Error("GITHUB_USERNAME is not configured."), { statusCode: 500 });
  }

  const repos = [];
  for (let page = 1; page <= 5; page += 1) {
    const url = `https://api.github.com/users/${encodeURIComponent(username)}/repos?per_page=100&page=${page}&sort=updated&type=owner`;
    const response = await fetch(url, { headers: githubHeaders() });
    if (!response.ok) {
      const detail = await response.text();
      const error = new Error(
        response.status === 403
          ? "GitHub rate limit reached. Add GITHUB_TOKEN to raise the limit."
          : `GitHub request failed (${response.status}).`
      );
      error.statusCode = response.status === 403 ? 429 : 502;
      error.detail = detail.slice(0, 200);
      throw error;
    }

    const batch = await response.json();
    if (!Array.isArray(batch) || batch.length === 0) {
      break;
    }
    repos.push(...batch);
    if (batch.length < 100) {
      break;
    }
  }

  return repos.filter((repo) => !repo.fork);
};

const mapRepoToProject = (repo) => {
  const links = [{ text: "GitHub", href: repo.html_url }];
  if (repo.homepage) {
    links.push({ text: "Live", href: repo.homepage });
  }

  return {
    githubId: repo.id,
    githubName: repo.name,
    title: String(repo.name || "Untitled").replace(/[-_]+/g, " ").trim(),
    bodyText: repo.description || `${repo.name} GitHub repository`,
    image: "",
    tags: repo.language ? [repo.language] : [],
    links,
    featured: false,
    visible: false,
    order: 1000,
  };
};

module.exports = {
  fetchGithubRepos,
  mapRepoToProject,
};
