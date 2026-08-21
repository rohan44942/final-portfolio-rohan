import { useEffect, useEffectEvent, useState } from "react";
import { CONTENT_UPDATED_EVENT } from "../lib/contentEvents";
import { readCache, writeCache } from "../lib/contentCache";

/**
 * Show static/cache data immediately, then refresh from the API in the background.
 * Never blocks first paint on a cold Render dyno.
 */
export function usePublicContent(cacheKey, fallback, fetcher) {
  const [data, setData] = useState(() => readCache(cacheKey) ?? fallback);
  const [isRefreshing, setIsRefreshing] = useState(true);
  const [source, setSource] = useState(() => (readCache(cacheKey) ? "cache" : "static"));
  const [reloadToken, setReloadToken] = useState(0);
  const fetchFresh = useEffectEvent(() => fetcher());

  useEffect(() => {
    let cancelled = false;
    setIsRefreshing(true);

    fetchFresh()
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
  }, [cacheKey, reloadToken]);

  useEffect(() => {
    const onUpdated = (event) => {
      const section = event.detail?.section;
      if (!section || section === cacheKey || section === "*") {
        setReloadToken((value) => value + 1);
      }
    };
    window.addEventListener(CONTENT_UPDATED_EVENT, onUpdated);
    return () => window.removeEventListener(CONTENT_UPDATED_EVENT, onUpdated);
  }, [cacheKey]);

  return { data, setData, isRefreshing, source, refresh: () => setReloadToken((value) => value + 1) };
}
