import { useEffect, useMemo, useState } from "react";
import ThemeContext from "./themeContextValue";

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(
    window.localStorage.getItem("portfolio_theme") || "light"
  );

  useEffect(() => {
    document.body.dataset.theme = theme;
    window.localStorage.setItem("portfolio_theme", theme);
  }, [theme]);

  const value = useMemo(
    () => ({
      theme,
      toggleTheme: () =>
        setTheme((currentTheme) => (currentTheme === "dark" ? "light" : "dark")),
    }),
    [theme]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}
