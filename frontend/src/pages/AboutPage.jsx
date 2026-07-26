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
      <div className="card split">
        <p className="about-text">{about.about}</p>
        {about.imageSource ? (
          <img src={about.imageSource} alt="Profile" className="about-image" />
        ) : null}
      </div>
    </PageSection>
  );
}

export default AboutPage;
