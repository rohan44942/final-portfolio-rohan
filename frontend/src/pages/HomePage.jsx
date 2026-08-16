import { motion } from "framer-motion";
import PageSection from "../components/PageSection";
import { usePublicShellContent } from "../hooks/usePublicShellContent";

function HomePage() {
  const { home, social, siteConfig, isRefreshing } = usePublicShellContent();

  const roles = home?.roles || [];
  const summary = home?.summary || [];
  const photo = home?.imageSource || "images/about/profile.jpg";
  const intro =
    home?.intro ||
    "Hello! I'm Rohan and you're currently exploring my tiny corner of the internet. I use this space to share the products I build and the engineering I'm obsessed with.";

  const normalizeHref = (href, network) => {
    if (!href) return "#";
    if (network === "email" && !href.startsWith("mailto:")) return `mailto:${href}`;
    return href;
  };

  return (
    <PageSection className="section-home">
      {isRefreshing ? <p className="sync-hint muted">Syncing latest profile…</p> : null}
      <div className="home-composition">
        <motion.div
          className="home-copy"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.38, ease: "easeOut" }}
        >
          <p className="intro-copy">{intro}</p>
          <div className="role-line">
            {roles.map((role) => (
              <span key={role}>{role.replace(/^a |^an /i, "")}</span>
            ))}
          </div>

          {summary.length ? (
            <section className="summary-block" aria-label="Summary">
              <p className="eyebrow">Summary</p>
              <ul className="summary-list">
                {summary.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </section>
          ) : null}

          <div className="social-list">
            {(social?.social || []).map((item) => (
              <a
                className="social-link"
                key={item.href}
                href={normalizeHref(item.href, item.network)}
                target={item.network === "email" ? undefined : "_blank"}
                rel={item.network === "email" ? undefined : "noreferrer"}
              >
                {item.network}
                <span className="ext-arrow" aria-hidden="true">
                  ↗
                </span>
              </a>
            ))}
            {siteConfig?.resumeUrl ? (
              <a className="social-link resume-link" href={siteConfig.resumeUrl} target="_blank" rel="noreferrer">
                resume
                <span className="ext-arrow" aria-hidden="true">
                  ↗
                </span>
              </a>
            ) : null}
          </div>
        </motion.div>

        <motion.figure
          className="home-photo-wrap"
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.45, delay: 0.08, ease: "easeOut" }}
        >
          <img src={photo} alt={home?.name || "Rohan Nooniwal"} className="home-photo" />
        </motion.figure>
      </div>
    </PageSection>
  );
}

export default HomePage;
