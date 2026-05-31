import { NavLink, Outlet } from "react-router-dom";
import { useEffect, useState } from "react";
import { fetchSection } from "../lib/api";
import ThemeSwitch from "./ThemeSwitch";

function Layout() {
  const [navbar, setNavbar] = useState(null);
  const [siteConfig, setSiteConfig] = useState({});
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    Promise.all([fetchSection("navbar"), fetchSection("site-config").catch(() => ({}))])
      .then(([navbarData, configData]) => {
        setNavbar(navbarData);
        setSiteConfig(configData || {});
      })
      .catch(() => setNavbar({ sections: [] }));
  }, []);

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
            {navbar?.logo?.source ? (
              <img
                src={navbar.logo.source}
                alt="Rohan logo"
                width={navbar.logo.width || 50}
                height={navbar.logo.height || 45}
              />
            ) : (
              <span>Rohan</span>
            )}
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
                {section.title}
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
                {section.title}
              </a>
            ))}
            <NavLink
              to="/admin/login"
              className={({ isActive }) => (isActive ? "navbar-link active" : "navbar-link")}
              onClick={closeMenu}
            >
              Admin
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

export default Layout;
