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
          <article className="card timeline-card" key={`${item.title}-${item.dateText}`}>
            <p className="timeline-date">{item.dateText}</p>
            <h3>{item.title}</h3>
            <p className="timeline-subtitle">{item.subtitle}</p>
            {item.workType ? <p className="muted">{item.workType}</p> : null}
            <ul>
              {(item.workDescription || []).map((desc) => (
                <li key={desc}>{desc}</li>
              ))}
            </ul>
          </article>
        ))}
      </div>
    </PageSection>
  );
}

export default ExperiencePage;
