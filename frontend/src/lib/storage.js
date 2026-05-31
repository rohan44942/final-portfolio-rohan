const KEY = "portfolio_admin_token";

export const getStoredToken = () => window.localStorage.getItem(KEY);
export const setStoredToken = (token) => window.localStorage.setItem(KEY, token);
export const clearStoredToken = () => window.localStorage.removeItem(KEY);
