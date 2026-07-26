import { useEffect, useRef, useState } from "react";
import { readCache, writeCache } from "../lib/contentCache";

/**
 * Show static/cache data immediately, then refresh from the API in the background.
 * Never blocks first paint on a cold Render dyno.
 */
export function usePublicContent(cacheKey, fallback, fetcher) {
  const fetcherRef = useRef(fetcher);
  fetcherRef.current = fetcher;

  const [data, setData] = useState(() => readCache(cacheKey) ?? fallback);
  const [isRefreshing, setIsRefreshing] = useState(true);
  const [source, setSource] = useState(() => (readCache(cacheKey) ? "cache" : "static"));

  useEffect(() => {
    let cancelled = false;
    setIsRefreshing(true);

    fetcherRef
      .current()
      .then((fresh) => {
        if (cancelled || fresh == null) return;
        setData(fresh);
        writeCache(cacheKey, fresh);
        setSource("api");
      })
      .catch(() => {
        // Keep static/cache content visible when the API is cold or offline.
      })
      .finally(() => {
        if (!cancelled) setIsRefreshing(false);
      });

    return () => {
      cancelled = true;
    };
  }, [cacheKey]);

  return { data, isRefreshing, source };
}
