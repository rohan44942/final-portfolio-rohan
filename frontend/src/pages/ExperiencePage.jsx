import PageSection from "../components/PageSection";
import { fetchSection } from "../lib/api";
import { usePublicContent } from "../hooks/usePublicContent";
import experienceFallback from "../data/experience.json";

function ExperiencePage() {
  const { data: experience, isRefreshing } = usePublicContent("experience", experienceFallback, () =>
    fetchSection("experience")
  );

  return (
    <PageSection title="Experience">
      {isRefreshing ? <p className="sync-hint muted">Syncing latest profile…</p> : null}
      <div className="timeline">
        {(experience.experiences || []).map((item) => (
          <article className="timeline-card" key={`${item.title}-${item.dateText}`}>
            <p className="timeline-date">{item.dateText}</p>
            <div className="timeline-body">
              <h3>{item.title}</h3>
              <p className="timeline-subtitle">{item.subtitle}</p>
              {item.workType ? <p className="muted">{item.workType}</p> : null}
              <ul>
                {(item.workDescription || []).map((desc) => (
                  <li key={desc}>{desc}</li>
                ))}
              </ul>
            </div>
          </article>
        ))}
      </div>
    </PageSection>
  );
}

export default ExperiencePage;
