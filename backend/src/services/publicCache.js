const cache = new Map();

const DEFAULT_TTL_MS = 60_000;

const getCached = (key) => {
  const entry = cache.get(key);
  if (!entry) return null;
  if (Date.now() > entry.expiresAt) {
    cache.delete(key);
    return null;
  }
  return entry.value;
};

const setCached = (key, value, ttlMs = DEFAULT_TTL_MS) => {
  cache.set(key, {
    value,
    expiresAt: Date.now() + ttlMs,
  });
  return value;
};

const invalidate = (key) => {
  if (key) {
    cache.delete(key);
    cache.delete("bootstrap");
    return;
  }
  cache.clear();
};

module.exports = {
  getCached,
  setCached,
  invalidate,
  DEFAULT_TTL_MS,
};
