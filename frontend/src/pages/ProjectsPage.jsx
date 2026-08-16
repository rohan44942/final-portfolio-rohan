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
      <div className="projects-list">
        {(projects || []).map((project) => (
          <article className="project-row" key={project._id || project.title}>
            <div className="project-mark">
              {project.image ? <img src={project.image} alt="" className="project-thumb" /> : project.title.charAt(0)}
            </div>
            <div className="project-copy">
              <h3>{project.title}</h3>
              <p>{project.bodyText}</p>
              <div className="project-meta">{(project.tags || []).slice(0, 4).join(" / ")}</div>
            </div>
            <div className="project-actions">
              {(project.links || []).map((link) => (
                <a className="project-link" key={link.href} href={link.href} target="_blank" rel="noreferrer">
                  {link.text} -&gt;
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
