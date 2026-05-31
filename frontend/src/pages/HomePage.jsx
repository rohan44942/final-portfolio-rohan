import { useEffect, useMemo, useState } from "react";
import PageSection from "../components/PageSection";
import Loader from "../components/Loader";
import { fetchSection } from "../lib/api";

function HomePage() {
  const [home, setHome] = useState(null);
  const [social, setSocial] = useState(null);
  const [siteConfig, setSiteConfig] = useState({});
  const [roleIndex, setRoleIndex] = useState(0);

  useEffect(() => {
    Promise.all([
      fetchSection("home"),
      fetchSection("social"),
      fetchSection("site-config").catch(() => ({})),
    ])
      .then(([homeData, socialData, configData]) => {
        setHome(homeData);
        setSocial(socialData);
        setSiteConfig(configData || {});
      })
      .catch(() => {
        setHome({ name: "Rohan", roles: [] });
        setSocial({ social: [] });
      });
  }, []);

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

  if (!home) {
    return <Loader text="Loading home..." />;
  }

  return (
    <PageSection title={home.name || "Home"}>
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
