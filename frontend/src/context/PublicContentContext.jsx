import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { fetchBootstrap, warmApi } from "../lib/api";
import { readCache, writeCache } from "../lib/contentCache";
import homeFallback from "../data/home.json";
import socialFallback from "../data/social.json";
import navbarFallback from "../data/navbar.json";
import siteConfigFallback from "../data/site-config.json";

const PublicContentContext = createContext(null);

const initialState = () => ({
  home: readCache("home") ?? homeFallback,
  social: readCache("social") ?? socialFallback,
  navbar: readCache("navbar") ?? navbarFallback,
  siteConfig: readCache("site-config") ?? siteConfigFallback,
});

export function PublicContentProvider({ children }) {
  const [content, setContent] = useState(initialState);
  const [isRefreshing, setIsRefreshing] = useState(true);

  useEffect(() => {
    let cancelled = false;

    // Start waking the API immediately (Render free-tier cold start).
    warmApi();

    fetchBootstrap()
      .then((payload) => {
        if (cancelled || !payload) return;

        setContent((prev) => {
          const next = {
            home: payload.home ?? prev.home,
            social: payload.social ?? prev.social,
            navbar: payload.navbar ?? prev.navbar,
            siteConfig: payload.siteConfig ?? prev.siteConfig,
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

export function usePublicShellContent() {
  const value = useContext(PublicContentContext);
  if (!value) {
    throw new Error("usePublicShellContent must be used within PublicContentProvider");
  }
  return value;
}
