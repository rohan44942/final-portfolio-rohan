import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useRef, useState } from "react";
import { PublicContentProvider } from "../context/PublicContentContext";
import { usePublicShellContent } from "../hooks/usePublicShellContent";
import NavStatus from "./NavStatus";
import PageEditor from "./PageEditor";
import ThemeSwitch from "./ThemeSwitch";

const ADMIN_CLICK_WINDOW_MS = 900;

function LayoutInner() {
  const navigate = useNavigate();
  const { home, navbar, siteConfig } = usePublicShellContent();
  const [menuOpen, setMenuOpen] = useState(false);
  const brandClicksRef = useRef({ count: 0, timer: null });

  const sectionNavTitles = new Set(["skills", "education", "experience", "projects"]);
  const sections = navbar?.sections || [];
  const internalSections = sections.filter(
    (section) =>
      section.type !== "link" &&
      !sectionNavTitles.has(String(section.title || "").toLowerCase())
  );
  const externalSections = sections
    .filter((section) => section.type === "link")
    .map((section) => {
      if (section.title?.toLowerCase().includes("resume") && siteConfig?.resumeUrl) {
        return { ...section, href: siteConfig.resumeUrl };
      }
      return section;
    });

  const location = siteConfig?.location || {};
  const closeMenu = () => setMenuOpen(false);

  const handleBrandClick = (event) => {
    const state = brandClicksRef.current;
    state.count += 1;

    if (state.timer) {
      clearTimeout(state.timer);
    }

    if (state.count >= 3) {
      event.preventDefault();
      state.count = 0;
      state.timer = null;
      navigate("/admin/login");
      return;
    }

    state.timer = setTimeout(() => {
      state.count = 0;
      state.timer = null;
    }, ADMIN_CLICK_WINDOW_MS);
  };

  return (
    <div className="app-shell">
      <header className="topbar">
        <nav className="nav">
          <NavLink to="/" className="brand" onClick={handleBrandClick}>
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
            <span className="nav-divider" aria-hidden="true">
              |
            </span>
            <NavStatus
              locationLabel={location.label}
              latitude={location.latitude}
              longitude={location.longitude}
            />
            <ThemeSwitch />
          </div>
        </nav>
      </header>
      <main className="content">
        <Outlet />
      </main>
      <PageEditor />
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
