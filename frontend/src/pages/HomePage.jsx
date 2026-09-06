import { Link } from "react-router-dom";
import LivingAge from "../components/LivingAge";
import PageSection from "../components/PageSection";
import { fetchPosts, fetchProjects } from "../lib/api";
import { normalizeImageUrl } from "../lib/driveUrl";
import { DEFAULT_PROJECT_IMAGE, getLiveLink, projectImageSrc } from "../lib/projectDisplay";
import { postMeta } from "../lib/postDisplay";
import { usePublicContent } from "../hooks/usePublicContent";
import { usePublicShellContent } from "../hooks/usePublicShellContent";
import projectsFallback from "../data/projects.json";
import writingFallback from "../data/writing.json";

function HomePage() {
  const { home, social, siteConfig, isRefreshing } = usePublicShellContent();
  const { data: projects } = usePublicContent(
    "projects",
    projectsFallback.projects || [],
    fetchProjects
  );
  const { data: posts } = usePublicContent("writing", writingFallback.posts || [], fetchPosts);

  const summary = home?.summary || [];
  const locationLabel = siteConfig?.location?.label?.replace(/,\s*IN$/i, "") || "Gurgaon";
  const photo = normalizeImageUrl(home?.imageSource || "images/about/profile.jpg");
  const intro =
    home?.intro ||
    "Hello! I'm Rohan and you're currently exploring my tiny corner of the internet. I use this space to share the products I build and the engineering I'm obsessed with.";
  const introParagraphs = intro.split("\n\n").filter(Boolean);
  const otherSummary = summary.filter((item) => !/years?\s+old/i.test(String(item)));
  const previewProjects = [...(projects || [])]
    .sort((a, b) => Number(a.order ?? 99) - Number(b.order ?? 99))
    .slice(0, 3);
  const showWriting = siteConfig?.showWriting !== false;
  const homePosts = showWriting
    ? [...(posts || [])]
        .filter((post) => post.showOnHome)
        .sort((a, b) => Number(a.order ?? 99) - Number(b.order ?? 99))
        .slice(0, 3)
    : [];


  const normalizeHref = (href, network) => {
    if (!href) return "#";
    if (network === "email" && !href.startsWith("mailto:")) return `mailto:${href}`;
    return href;
  };

  return (
    <PageSection className="section-home">
      {isRefreshing ? <p className="sync-hint muted">Syncing latest profile…</p> : null}
      <div className="home-composition">
        <figure className="home-photo-wrap">
          <img src={photo} alt={home?.name || "Rohan Nooniwal"} className="home-photo" />
        </figure>
        <div className="intro-copy">
          {introParagraphs.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>
        <div className="home-copy">
          <section className="summary-block" aria-label="Summary">
            <p className="eyebrow">Summary</p>
            <ul className="summary-list">
              <li>
                <LivingAge locationLabel={locationLabel} />
              </li>
              {otherSummary.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </section>

          <div className="social-list">
            {(social?.social || []).map((item) => (
              <a
                className="social-link"
                key={item.href}
                href={normalizeHref(item.href, item.network)}
                target={item.network === "email" ? undefined : "_blank"}
                rel={item.network === "email" ? undefined : "noreferrer"}
              >
                {item.network}
                <span className="ext-arrow" aria-hidden="true">
                  ↗
                </span>
              </a>
            ))}
            {siteConfig?.resumeUrl ? (
              <a className="social-link resume-link" href={siteConfig.resumeUrl} target="_blank" rel="noreferrer">
                resume
                <span className="ext-arrow" aria-hidden="true">
                  ↗
                </span>
              </a>
            ) : null}
          </div>
        </div>
      </div>

      {previewProjects.length || homePosts.length ? (
        <div className="home-previews">
          {previewProjects.length ? (
            <section className="home-projects" aria-label="Selected projects">
              <div className="home-projects-header">
                <p className="eyebrow">Selected work</p>
                <Link to="/projects" className="home-projects-link">
                  all projects
                  <span className="ext-arrow" aria-hidden="true">
                    ↗
                  </span>
                </Link>
              </div>
              <div className="home-projects-list">
                {previewProjects.map((project) => {
                  const liveLink = getLiveLink(project);
                  const rowInner = (
                    <>
                      <div className="home-project-main">
                        <h3>{project.title}</h3>
                        <p>{project.bodyText}</p>
                      </div>
                      <span
                        className={
                          liveLink
                            ? "home-project-site"
                            : "home-project-site home-project-site-missing"
                        }
                      >
                        <img
                          src={projectImageSrc(project.image)}
                          alt=""
                          className="home-project-logo"
                          onError={(event) => {
                            if (event.currentTarget.src.includes(DEFAULT_PROJECT_IMAGE)) return;
                            event.currentTarget.src = DEFAULT_PROJECT_IMAGE;
                          }}
                        />
                        <span className="home-project-site-label">
                          {liveLink ? (
                            <>
                              Live
                              <span className="ext-arrow" aria-hidden="true">
                                ↗
                              </span>
                            </>
                          ) : (
                            "live not available"
                          )}
                        </span>
                      </span>
                    </>
                  );

                  return liveLink ? (
                    <a
                      className="home-project-row"
                      key={project._id || project.title}
                      href={liveLink.href}
                      target="_blank"
                      rel="noreferrer"
                      aria-label={`${project.title} live site`}
                    >
                      {rowInner}
                    </a>
                  ) : (
                    <article className="home-project-row" key={project._id || project.title}>
                      {rowInner}
                    </article>
                  );
                })}
              </div>
            </section>
          ) : null}

          {homePosts.length ? (
            <section className="home-projects home-writing" aria-label="Writing">
              <div className="home-projects-header">
                <p className="eyebrow">Writing</p>
                <Link to="/writing" className="home-projects-link">
                  all writing
                  <span className="ext-arrow" aria-hidden="true">
                    ↗
                  </span>
                </Link>
              </div>
              <div className="home-projects-list">
                {homePosts.map((post) => (
                  <Link
                    className="home-project-row home-writing-row"
                    key={post._id || post.slug}
                    to={`/writing/${post.slug}`}
                    aria-label={`Read ${post.title}`}
                  >
                    <div className="home-project-main">
                      <h3>{post.title}</h3>
                      <p>{post.excerpt}</p>
                    </div>
                    <span className="home-project-site">
                      <span className="home-project-site-label">
                        <span className="home-writing-meta">{postMeta(post) || "read"}</span>
                        <span className="home-writing-read">read</span>
                        <span className="ext-arrow" aria-hidden="true">
                          ↗
                        </span>
                      </span>
                    </span>
                  </Link>
                ))}
              </div>
            </section>
          ) : null}
        </div>
      ) : null}
    </PageSection>
  );
}

export default HomePage;
