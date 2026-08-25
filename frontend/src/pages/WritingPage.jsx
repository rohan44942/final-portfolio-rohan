import { Link } from "react-router-dom";
import PageSection from "../components/PageSection";
import SectionNavLinks from "../components/SectionNavLinks";
import { fetchPosts } from "../lib/api";
import { postMeta } from "../lib/postDisplay";
import { usePublicContent } from "../hooks/usePublicContent";
import writingFallback from "../data/writing.json";

function WritingPage() {
  const { data: posts, isRefreshing } = usePublicContent(
    "writing",
    writingFallback.posts || [],
    fetchPosts
  );

  return (
    <PageSection title="Writing" headerAside={<SectionNavLinks />}>
      {isRefreshing ? <p className="sync-hint muted">Syncing latest writing…</p> : null}
      <div className="writing-list">
        {(posts || []).map((post) => (
          <article className="writing-row" key={post._id || post.slug}>
            <div className="writing-copy">
              <p className="project-meta">{postMeta(post)}</p>
              <h3>{post.title}</h3>
              <p>{post.excerpt}</p>
            </div>
            <Link className="project-link" to={`/writing/${post.slug}`}>
              read
              <span className="ext-arrow" aria-hidden="true">
                ↗
              </span>
            </Link>
          </article>
        ))}
      </div>
    </PageSection>
  );
}

export default WritingPage;
