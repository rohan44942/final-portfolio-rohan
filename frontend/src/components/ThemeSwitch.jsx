import { useTheme } from "../hooks/useTheme";

function ThemeSwitch() {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";

  return (
    <button
      type="button"
      className={`theme-switch ${isDark ? "dark" : "light"}`}
      onClick={toggleTheme}
      aria-label="Toggle dark and light mode"
      title={isDark ? "Switch to light mode" : "Switch to dark mode"}
    >
      <span className="theme-switch-thumb" aria-hidden="true">
        <span className="theme-icon">{isDark ? "🌙" : "☀️"}</span>
      </span>
    </button>
  );
}

export default ThemeSwitch;
