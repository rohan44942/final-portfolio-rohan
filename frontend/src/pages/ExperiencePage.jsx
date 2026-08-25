import PageSection from "../components/PageSection";
import SectionNavLinks from "../components/SectionNavLinks";
import { fetchSection } from "../lib/api";
import { usePublicContent } from "../hooks/usePublicContent";
import experienceFallback from "../data/experience.json";

function resolveWorkDescription(item) {
  if (item?.workDescriptionText) {
    return String(item.workDescriptionText)
      .split(/\n+/)
      .map((line) => line.trim())
      .filter(Boolean);
  }
  if (Array.isArray(item?.workDescription) && item.workDescription.length) {
    return item.workDescription;
  }
  return [];
}

function ExperiencePage() {
  const { data: experience, isRefreshing } = usePublicContent("experience", experienceFallback, () =>
    fetchSection("experience")
  );

  return (
    <PageSection title="Experience" headerAside={<SectionNavLinks />}>
      {isRefreshing ? <p className="sync-hint muted">Syncing latest profile…</p> : null}
      <div className="timeline">
        {(experience.experiences || []).map((item) => {
          const bullets = resolveWorkDescription(item);
          return (
            <article className="timeline-card" key={`${item.title}-${item.dateText}`}>
              <p className="timeline-date">{item.dateText}</p>
              <div className="timeline-body">
                <h3>{item.title}</h3>
                <p className="timeline-subtitle">{item.subtitle}</p>
                {item.workType ? <p className="muted">{item.workType}</p> : null}
                {bullets.length ? (
                  <ul>
                    {bullets.map((desc) => (
                      <li key={desc}>{desc}</li>
                    ))}
                  </ul>
                ) : null}
              </div>
            </article>
          );
        })}
      </div>
    </PageSection>
  );
}

export default ExperiencePage;
