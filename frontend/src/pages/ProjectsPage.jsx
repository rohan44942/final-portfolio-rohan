import PageSection from "../components/PageSection";
import { fetchProjects } from "../lib/api";
import { usePublicContent } from "../hooks/usePublicContent";
import projectsFallback from "../data/projects.json";

function ProjectsPage() {
  const { data: projects, isRefreshing } = usePublicContent(
    "projects",
    projectsFallback.projects || [],
    fetchProjects
  );

  return (
    <PageSection title="Projects">
      {isRefreshing ? <p className="sync-hint muted">Syncing latest profile…</p> : null}
      <div className="projects-grid">
        {(projects || []).map((project) => (
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
