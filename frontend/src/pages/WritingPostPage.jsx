import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Loader from "../components/Loader";
import PageSection from "../components/PageSection";
import SectionNavLinks from "../components/SectionNavLinks";
import { fetchPost } from "../lib/api";
import { postMeta } from "../lib/postDisplay";
import writingFallback from "../data/writing.json";

function WritingPostPage() {
  const { slug } = useParams();
  const fallback = (writingFallback.posts || []).find((post) => post.slug === slug);
  const [post, setPost] = useState(fallback || null);
  const [loading, setLoading] = useState(!fallback);

  useEffect(() => {
    let cancelled = false;
    fetchPost(slug)
      .then((fresh) => {
        if (!cancelled) setPost(fresh);
      })
      .catch(() => {
        // Keep fallback visible if API is unavailable.
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [slug]);

  if (loading) {
    return <Loader text="Loading writing..." />;
  }

  if (!post) {
    return (
      <PageSection title="Writing" headerAside={<SectionNavLinks />}>
        <p className="muted">Post not found.</p>
        <Link className="back-home-link" to="/writing">
          back to writing
        </Link>
      </PageSection>
    );
  }

  const paragraphs = String(post.body || post.excerpt || "")
    .split(/\n{2,}/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);

  return (
    <PageSection title={post.title} headerAside={<SectionNavLinks />}>
      <article className="writing-post">
        <p className="project-meta">{postMeta(post)}</p>
        <div className="writing-post-body">
          {paragraphs.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>
      </article>
    </PageSection>
  );
}

export default WritingPostPage;
