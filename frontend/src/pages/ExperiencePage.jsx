import { useEffect, useState } from "react";
import PageSection from "../components/PageSection";
import Loader from "../components/Loader";
import { fetchSection } from "../lib/api";

function ExperiencePage() {
  const [experience, setExperience] = useState(null);

  useEffect(() => {
    fetchSection("experience")
      .then(setExperience)
      .catch(() => setExperience({ experiences: [] }));
  }, []);

  if (!experience) {
    return <Loader text="Loading experience..." />;
  }

  return (
    <PageSection title="Experience">
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
