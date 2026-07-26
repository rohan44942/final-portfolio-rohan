const CACHE_PREFIX = "portfolio_content_v1:";

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
