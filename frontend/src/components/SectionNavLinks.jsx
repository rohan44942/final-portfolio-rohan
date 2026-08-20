import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";

const sectionTrail = [
  { title: "about", href: "/about" },
  { title: "skills", href: "/skills" },
  { title: "education", href: "/education" },
  { title: "experience", href: "/experience" },
  { title: "projects", href: "/projects" },
];

const ABOUT_HINT_MS = 2500;

function SectionNavLinks() {
  const { pathname } = useLocation();
  const [showNextHint, setShowNextHint] = useState(false);
  const currentIndex = sectionTrail.findIndex((section) => section.href === pathname);
  const previous = currentIndex > 0 ? sectionTrail[currentIndex - 1] : null;
  const next =
    currentIndex >= 0 && currentIndex < sectionTrail.length - 1
      ? sectionTrail[currentIndex + 1]
      : null;

  useEffect(() => {
    if (pathname !== "/about") {
      setShowNextHint(false);
      return undefined;
    }

    setShowNextHint(true);
    const timer = setTimeout(() => setShowNextHint(false), ABOUT_HINT_MS);
    return () => clearTimeout(timer);
  }, [pathname]);

  return (
    <nav className="section-arrow-nav" aria-label="Section navigation">
      {previous ? (
        <Link
          to={previous.href}
          className="section-arrow-link"
          aria-label={`Go to ${previous.title}`}
        >
          <span className="section-arrow-label">{previous.title}</span>
          <span className="section-arrow-icon" aria-hidden="true">
            ←
          </span>
        </Link>
      ) : (
        <span className="section-arrow-link disabled" aria-hidden="true">
          <span className="section-arrow-icon">←</span>
        </span>
      )}
      {next ? (
        <Link
          to={next.href}
          className={`section-arrow-link${showNextHint ? " hint-visible" : ""}`}
          aria-label={`Go to ${next.title}`}
        >
          <span className="section-arrow-label">{next.title}</span>
          <span className="section-arrow-icon" aria-hidden="true">
            →
          </span>
        </Link>
      ) : (
        <span className="section-arrow-link disabled" aria-hidden="true">
          <span className="section-arrow-icon">→</span>
        </span>
      )}
    </nav>
  );
}

export default SectionNavLinks;
