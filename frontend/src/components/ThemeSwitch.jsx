import { useTheme } from "../context/ThemeContext";

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
      <span className="theme-switch-track">
        <span className="theme-icon moon" aria-hidden="true">
          🌙
        </span>
        <span className="theme-icon sun" aria-hidden="true">
          ☀️
        </span>
      </span>
      <span className="theme-switch-thumb" />
    </button>
  );
}

export default ThemeSwitch;
