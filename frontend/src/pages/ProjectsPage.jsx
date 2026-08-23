import PageSection from "../components/PageSection";
import SectionNavLinks from "../components/SectionNavLinks";
import { fetchProjects } from "../lib/api";
import { DEFAULT_PROJECT_IMAGE, getGithubLink, getLiveLink, projectImageSrc } from "../lib/projectDisplay";
import { usePublicContent } from "../hooks/usePublicContent";
import projectsFallback from "../data/projects.json";

function ProjectsPage() {
  const { data: projects, isRefreshing } = usePublicContent(
    "projects",
    projectsFallback.projects || [],
    fetchProjects
  );

  return (
    <PageSection title="Projects" headerAside={<SectionNavLinks />}>
      {isRefreshing ? <p className="sync-hint muted">Syncing latest profile…</p> : null}
      <div className="projects-list">
        {(projects || []).map((project) => {
          const imageSrc = projectImageSrc(project.image);
          const githubLink = getGithubLink(project);
          const liveLink = getLiveLink(project);
          return (
            <article className="project-row" key={project._id || project.title}>
              <div className="project-mark">
                <img
                  src={imageSrc}
                  alt=""
                  className="project-thumb"
                  onError={(event) => {
                    if (event.currentTarget.src.includes(DEFAULT_PROJECT_IMAGE)) return;
                    event.currentTarget.src = DEFAULT_PROJECT_IMAGE;
                  }}
                />
              </div>
              <div className="project-copy">
                <h3>{project.title}</h3>
                <p>{project.bodyText}</p>
                <div className="project-meta">{(project.tags || []).slice(0, 4).join(" / ")}</div>
              </div>
              <div className="project-actions">
                {githubLink ? (
                  <a className="project-link" href={githubLink.href} target="_blank" rel="noreferrer">
                    {githubLink.text || "GitHub"}
                    <span className="ext-arrow" aria-hidden="true">
                      ↗
                    </span>
                  </a>
                ) : null}
                {liveLink ? (
                  <a className="project-link" href={liveLink.href} target="_blank" rel="noreferrer">
                    Live
                    <span className="ext-arrow" aria-hidden="true">
                      ↗
                    </span>
                  </a>
                ) : (
                  <span className="project-link-missing">live not available</span>
                )}
              </div>
            </article>
          );
        })}
      </div>
    </PageSection>
  );
}

export default ProjectsPage;
