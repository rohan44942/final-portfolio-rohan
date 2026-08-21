import { useEffect, useMemo, useState } from "react";
import { fetchBootstrap, warmApi } from "../lib/api";
import {
  mergeHomeContent,
  mergeSiteConfig,
  readCache,
  writeCache,
} from "../lib/contentCache";
import { CONTENT_UPDATED_EVENT } from "../lib/contentEvents";
import homeFallback from "../data/home.json";
import socialFallback from "../data/social.json";
import navbarFallback from "../data/navbar.json";
import siteConfigFallback from "../data/site-config.json";
import PublicContentContext from "./publicContentContextValue";

const initialState = () => ({
  home: mergeHomeContent(readCache("home"), homeFallback),
  social: readCache("social") ?? socialFallback,
  navbar: readCache("navbar") ?? navbarFallback,
  siteConfig: mergeSiteConfig(readCache("site-config"), siteConfigFallback),
});

export function PublicContentProvider({ children }) {
  const [content, setContent] = useState(initialState);
  const [isRefreshing, setIsRefreshing] = useState(true);
  const [reloadToken, setReloadToken] = useState(0);

  useEffect(() => {
    let cancelled = false;

    warmApi();
    setIsRefreshing(true);

    fetchBootstrap()
      .then((payload) => {
        if (cancelled || !payload) return;

        setContent((prev) => {
          const next = {
            home: mergeHomeContent(payload.home ?? prev.home, homeFallback),
            social: payload.social ?? prev.social,
            navbar: payload.navbar ?? prev.navbar,
            siteConfig: mergeSiteConfig(
              payload.siteConfig ?? prev.siteConfig,
              siteConfigFallback
            ),
          };

          writeCache("home", next.home);
          writeCache("social", next.social);
          writeCache("navbar", next.navbar);
          writeCache("site-config", next.siteConfig);
          return next;
        });
      })
      .catch(() => {
        // Static/cache content already on screen.
      })
      .finally(() => {
        if (!cancelled) setIsRefreshing(false);
      });

    return () => {
      cancelled = true;
    };
  }, [reloadToken]);

  useEffect(() => {
    const onUpdated = () => setReloadToken((value) => value + 1);
    window.addEventListener(CONTENT_UPDATED_EVENT, onUpdated);
    return () => window.removeEventListener(CONTENT_UPDATED_EVENT, onUpdated);
  }, []);

  const value = useMemo(
    () => ({
      ...content,
      isRefreshing,
    }),
    [content, isRefreshing]
  );

  return <PublicContentContext.Provider value={value}>{children}</PublicContentContext.Provider>;
}
