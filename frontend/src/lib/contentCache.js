const CACHE_PREFIX = "portfolio_content_v4:";

export const readCache = (key) => {
  try {
    const raw = window.localStorage.getItem(`${CACHE_PREFIX}${key}`);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return parsed?.data ?? null;
  } catch {
    return null;
  }
};

export const writeCache = (key, data) => {
  try {
    window.localStorage.setItem(
      `${CACHE_PREFIX}${key}`,
      JSON.stringify({ data, savedAt: Date.now() })
    );
  } catch {
    // Ignore quota / private mode failures.
  }
};

export const mergeHomeContent = (remote, fallback) => {
  if (!remote) return fallback;
  const remoteSummary = Array.isArray(remote.summary) ? remote.summary : [];
  const fallbackSummary = Array.isArray(fallback.summary) ? fallback.summary : [];
  return {
    ...fallback,
    ...remote,
    intro: remote.intro || fallback.intro,
    // Prefer API/admin summary when present; fall back to local JSON.
    summary: remoteSummary.length ? remoteSummary : fallbackSummary,
    roles: Array.isArray(remote.roles) && remote.roles.length ? remote.roles : fallback.roles,
  };
};

export const mergeSiteConfig = (remote, fallback) => {
  if (!remote) return fallback;
  return {
    ...fallback,
    ...remote,
    // Prefer local location config so weather/city updates aren't stuck on old API data.
    location: fallback.location || remote.location,
    resumeUrl: remote.resumeUrl || fallback.resumeUrl,
  };
};
