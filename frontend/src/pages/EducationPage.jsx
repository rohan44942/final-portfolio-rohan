import { useEffect, useState } from "react";
import PageSection from "../components/PageSection";
import Loader from "../components/Loader";
import { fetchSection } from "../lib/api";

function EducationPage() {
  const [education, setEducation] = useState(null);

  useEffect(() => {
    fetchSection("education")
      .then(setEducation)
      .catch(() => setEducation({ education: [] }));
  }, []);

  if (!education) {
    return <Loader text="Loading education..." />;
  }

  return (
    <PageSection title="Education">
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
