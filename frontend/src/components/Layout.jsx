import { NavLink, Outlet } from "react-router-dom";
import { useState } from "react";
import { PublicContentProvider } from "../context/PublicContentContext";
import { usePublicShellContent } from "../hooks/usePublicShellContent";
import ThemeSwitch from "./ThemeSwitch";

function LayoutInner() {
  const { home, navbar, siteConfig } = usePublicShellContent();
  const [menuOpen, setMenuOpen] = useState(false);

  const sections = navbar?.sections || [];
  const internalSections = sections.filter((section) => section.type !== "link");
  const externalSections = sections
    .filter((section) => section.type === "link")
    .map((section) => {
      if (section.title?.toLowerCase().includes("resume") && siteConfig?.resumeUrl) {
        return { ...section, href: siteConfig.resumeUrl };
      }
      return section;
    });

  const closeMenu = () => setMenuOpen(false);

  return (
    <div className="app-shell">
      <header className="topbar">
        <nav className="nav">
          <NavLink to="/" className="brand">
            <span>{navbar?.brand || home?.name || "Rohan Nooniwal"}</span>
          </NavLink>
          <button
            type="button"
            className="menu-toggle"
            onClick={() => setMenuOpen((current) => !current)}
            aria-label="Toggle menu"
          >
            {menuOpen ? "Close" : "Menu"}
          </button>
          <div className={menuOpen ? "links open" : "links"}>
            {internalSections.map((section) => (
              <NavLink
                key={`${section.title}-${section.href}`}
                to={section.href}
                className={({ isActive }) => (isActive ? "navbar-link active" : "navbar-link")}
                end={section.href === "/"}
                onClick={closeMenu}
              >
                {String(section.title || "").toLowerCase()}
              </NavLink>
            ))}
            {externalSections.map((section) => (
              <a
                key={`${section.title}-${section.href}`}
                href={section.href}
                target="_blank"
                rel="noreferrer"
                className="navbar-link"
                onClick={closeMenu}
              >
                {String(section.title || "").toLowerCase()}
                <span className="ext-arrow" aria-hidden="true">
                  ↗
                </span>
              </a>
            ))}
            <NavLink
              to="/admin/login"
              className={({ isActive }) => (isActive ? "navbar-link active" : "navbar-link")}
              onClick={closeMenu}
            >
              admin
            </NavLink>
            <ThemeSwitch />
          </div>
        </nav>
      </header>
      <main className="content">
        <Outlet />
      </main>
    </div>
  );
}

function Layout() {
  return (
    <PublicContentProvider>
      <LayoutInner />
    </PublicContentProvider>
  );
}

export default Layout;
