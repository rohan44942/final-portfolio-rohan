import { useEffect, useMemo, useState } from "react";
import PageSection from "../components/PageSection";
import { usePublicShellContent } from "../context/PublicContentContext";

function HomePage() {
  const { home, social, siteConfig, isRefreshing } = usePublicShellContent();
  const [roleIndex, setRoleIndex] = useState(0);

  const roleText = useMemo(() => (home?.roles || []).join(" • "), [home]);
  const animatedRole = useMemo(() => {
    const roles = home?.roles || [];
    return roles.length ? roles[roleIndex % roles.length] : "";
  }, [home, roleIndex]);

  useEffect(() => {
    const roles = home?.roles || [];
    if (!roles.length) return undefined;

    const timer = window.setInterval(() => {
      setRoleIndex((current) => current + 1);
    }, 1800);

    return () => window.clearInterval(timer);
  }, [home]);

  return (
    <PageSection title={home.name || "Home"}>
      {isRefreshing ? <p className="sync-hint muted">Syncing latest profile…</p> : null}
      <div className="hero-block">
        <h2 className="hero-role">
          I&apos;m <span className="role-highlight">{animatedRole}</span>
        </h2>
        <p className="muted">{roleText}</p>
      </div>
      <div className="social-list">
        {(social?.social || []).map((item) => (
          <a className="social-link" key={item.href} href={item.href} target="_blank" rel="noreferrer">
            {item.network}
          </a>
        ))}
        {siteConfig?.resumeUrl ? (
          <a className="social-link resume-link" href={siteConfig.resumeUrl} target="_blank" rel="noreferrer">
            resume
          </a>
        ) : null}
      </div>
    </PageSection>
  );
}

export default HomePage;
