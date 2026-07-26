import PageSection from "../components/PageSection";
import { fetchSection } from "../lib/api";
import { usePublicContent } from "../hooks/usePublicContent";
import educationFallback from "../data/education.json";

function EducationPage() {
  const { data: education, isRefreshing } = usePublicContent("education", educationFallback, () =>
    fetchSection("education")
  );

  return (
    <PageSection title="Education">
      {isRefreshing ? <p className="sync-hint muted">Syncing latest profile…</p> : null}
      <div className="timeline">
        {(education.education || []).map((item) => (
          <article className="card timeline-card" key={`${item.title}-${item.cardTitle}`}>
            <p className="timeline-date">{item.title}</p>
            <h3>{item.cardTitle}</h3>
            <p className="timeline-subtitle">{item.cardSubtitle}</p>
            <p>{item.cardDetailedText}</p>
          </article>
        ))}
      </div>
    </PageSection>
  );
}

export default EducationPage;
