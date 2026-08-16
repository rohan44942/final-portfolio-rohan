import PageSection from "../components/PageSection";
import { fetchSection } from "../lib/api";
import { usePublicContent } from "../hooks/usePublicContent";
import skillsFallback from "../data/skills.json";

function SkillsPage() {
  const { data: skillsData, isRefreshing } = usePublicContent("skills", skillsFallback, () =>
    fetchSection("skills")
  );

  return (
    <PageSection title="Skills">
      {isRefreshing ? <p className="sync-hint muted">Syncing latest profile…</p> : null}
      <p className="section-intro">{skillsData.intro}</p>
      <div className="skill-groups">
        {(skillsData.skills || []).map((group) => (
          <section className="skill-group" key={group.title}>
            <h3>{group.title}</h3>
            <div className="skill-items">
              {(group.items || []).map((item) => (
                <div className="skill-item" key={`${group.title}-${item.title}`}>
                  {item.icon ? <img src={item.icon} alt={item.title} className="skill-icon" /> : null}
                  <span>{item.title}</span>
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>
    </PageSection>
  );
}

export default SkillsPage;
