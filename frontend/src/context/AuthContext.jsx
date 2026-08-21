import { useEffect, useMemo, useState } from "react";
import { getAdminMe, setAuthToken } from "../lib/api";
import { clearStoredToken, getStoredToken, setStoredToken } from "../lib/storage";
import AuthContext from "./authContextValue";

export function AuthProvider({ children }) {
  const [admin, setAdmin] = useState(null);
  const [isChecking, setIsChecking] = useState(true);

  const refreshAuth = async () => {
    const token = getStoredToken();
    if (!token) {
      setAuthToken(null);
      setAdmin(null);
      return null;
    }

    setAuthToken(token);
    try {
      const me = await getAdminMe();
      setAdmin(me);
      return me;
    } catch {
      clearStoredToken();
      setAuthToken(null);
      setAdmin(null);
      return null;
    }
  };

  useEffect(() => {
    let cancelled = false;
    refreshAuth()
      .catch(() => null)
      .finally(() => {
        if (!cancelled) setIsChecking(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const login = async (token) => {
    setStoredToken(token);
    setAuthToken(token);
    const me = await getAdminMe();
    setAdmin(me);
    return me;
  };

  const logout = () => {
    clearStoredToken();
    setAuthToken(null);
    setAdmin(null);
  };

  const value = useMemo(
    () => ({
      admin,
      isAdmin: Boolean(admin),
      isChecking,
      login,
      logout,
      refreshAuth,
    }),
    [admin, isChecking]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
