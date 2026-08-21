import PageSection from "../components/PageSection";
import SectionNavLinks from "../components/SectionNavLinks";
import { fetchSection } from "../lib/api";
import { normalizeImageUrl } from "../lib/driveUrl";
import { usePublicContent } from "../hooks/usePublicContent";
import aboutFallback from "../data/about.json";

function AboutPage() {
  const { data: about, isRefreshing } = usePublicContent("about", aboutFallback, () =>
    fetchSection("about")
  );
  const paragraphs = (about.about || "").split("\n\n").filter(Boolean);
  const [firstParagraph, ...restParagraphs] = paragraphs;
  const imageSrc = normalizeImageUrl(about.imageSource || "");

  return (
    <PageSection title="About" headerAside={<SectionNavLinks />}>
      {isRefreshing ? <p className="sync-hint muted">Syncing latest profile…</p> : null}
      <div className="editorial-split">
        <div className="about-text">
          {firstParagraph ? <p>{firstParagraph}</p> : null}
        </div>
        {imageSrc ? (
          <figure className="about-image-wrap">
            <img src={imageSrc} alt="Profile" className="about-image" />
          </figure>
        ) : null}
      </div>
      {restParagraphs.length ? (
        <div className="about-text about-text-rest">
          {restParagraphs.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>
      ) : null}
    </PageSection>
  );
}

export default AboutPage;
