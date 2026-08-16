import PageSection from "../components/PageSection";
import { fetchSection } from "../lib/api";
import { usePublicContent } from "../hooks/usePublicContent";
import aboutFallback from "../data/about.json";

function AboutPage() {
  const { data: about, isRefreshing } = usePublicContent("about", aboutFallback, () =>
    fetchSection("about")
  );

  return (
    <PageSection title="About">
      {isRefreshing ? <p className="sync-hint muted">Syncing latest profile…</p> : null}
      <div className="editorial-split">
        <div className="about-text">
          {(about.about || "").split("\n\n").map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>
        {about.imageSource ? (
          <figure className="about-image-wrap">
            <img src={about.imageSource} alt="Profile" className="about-image" />
          </figure>
        ) : null}
      </div>
    </PageSection>
  );
}

export default AboutPage;
