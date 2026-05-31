import { useEffect, useState } from "react";
import PageSection from "../components/PageSection";
import Loader from "../components/Loader";
import { fetchSection } from "../lib/api";

function SkillsPage() {
  const [skillsData, setSkillsData] = useState(null);

  useEffect(() => {
    fetchSection("skills")
      .then(setSkillsData)
      .catch(() => setSkillsData({ intro: "", skills: [] }));
  }, []);

  if (!skillsData) {
    return <Loader text="Loading skills..." />;
  }

  return (
    <PageSection title="Skills">
      <p>{skillsData.intro}</p>
      <div className="skill-groups">
        {(skillsData.skills || []).map((group) => (
          <div className="card" key={group.title}>
            <h3>{group.title}</h3>
            <div className="skill-items">
              {(group.items || []).map((item) => (
                <div className="skill-item" key={`${group.title}-${item.title}`}>
                  {item.icon ? <img src={item.icon} alt={item.title} className="skill-icon" /> : null}
                  <span className="chip">{item.title}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </PageSection>
  );
}

export default SkillsPage;
