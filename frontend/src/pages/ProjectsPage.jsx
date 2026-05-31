import { useEffect, useState } from "react";
import PageSection from "../components/PageSection";
import Loader from "../components/Loader";
import { fetchProjects } from "../lib/api";

function ProjectsPage() {
  const [projects, setProjects] = useState(null);

  useEffect(() => {
    fetchProjects()
      .then(setProjects)
      .catch(() => setProjects([]));
  }, []);

  if (!projects) {
    return <Loader text="Loading projects..." />;
  }

  return (
    <PageSection title="Projects">
      <div className="projects-grid">
        {projects.map((project) => (
          <article className="card project-card" key={project._id || project.title}>
            {project.image ? <img src={project.image} alt={project.title} className="project-image" /> : null}
            <h3>{project.title}</h3>
            <p>{project.bodyText}</p>
            <div className="chips">
              {(project.tags || []).map((tag) => (
                <span className="chip" key={`${project.title}-${tag}`}>
                  {tag}
                </span>
              ))}
            </div>
            <div className="button-row">
              {(project.links || []).map((link) => (
                <a className="project-link" key={link.href} href={link.href} target="_blank" rel="noreferrer">
                  {link.text}
                </a>
              ))}
            </div>
          </article>
        ))}
      </div>
    </PageSection>
  );
}

export default ProjectsPage;
