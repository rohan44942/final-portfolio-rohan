import { useEffect, useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { fetchProjects, fetchSection, saveSection, createProject, updateProject, removeProject } from "../lib/api";
import { notifyContentUpdated } from "../lib/contentEvents";
import { writeCache } from "../lib/contentCache";
import { normalizeImageUrl } from "../lib/driveUrl";
import HomeEditorForm from "./forms/HomeEditorForm";
import AboutEditorForm from "./forms/AboutEditorForm";
import SkillsEditorForm from "./forms/SkillsEditorForm";
import EducationEditorForm from "./forms/EducationEditorForm";
import ExperienceEditorForm from "./forms/ExperienceEditorForm";
import ProjectsEditorForm from "./forms/ProjectsEditorForm";

const routeSectionMap = {
  "/": "home",
  "/about": "about",
  "/skills": "skills",
  "/education": "education",
  "/experience": "experience",
  "/projects": "projects",
};

function PageEditor() {
  const { isAdmin } = useAuth();
  const { pathname } = useLocation();
  const section = routeSectionMap[pathname] || null;

  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [status, setStatus] = useState("");
  const [draft, setDraft] = useState(null);

  const title = useMemo(() => {
    if (!section) return "Edit page";
    return `Edit ${section}`;
  }, [section]);

  useEffect(() => {
    setOpen(false);
    setDraft(null);
    setError("");
    setStatus("");
  }, [pathname]);

  useEffect(() => {
    if (!open || !section) return undefined;
    let cancelled = false;
    setLoading(true);
    setError("");

    const loader =
      section === "projects"
        ? fetchProjects().then((projects) => ({ projects }))
        : fetchSection(section);

    loader
      .then((data) => {
        if (!cancelled) setDraft(data);
      })
      .catch((requestError) => {
        if (!cancelled) {
          setError(requestError.response?.data?.message || "Could not load content.");
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [open, section]);

  if (!isAdmin || !section) return null;

  const handleSave = async (payload) => {
    setSaving(true);
    setError("");
    setStatus("");
    try {
      if (section === "projects") {
        // ProjectsEditorForm handles its own saves; this path is for section blobs.
        setStatus("Projects are saved individually below.");
      } else {
        const normalized = { ...payload };
        if (normalized.imageSource) {
          normalized.imageSource = normalizeImageUrl(normalized.imageSource);
        }
        if (normalized.image) {
          normalized.image = normalizeImageUrl(normalized.image);
        }
        const saved = await saveSection(section, normalized);
        writeCache(section, saved);
        setDraft(saved);
        notifyContentUpdated(section);
        setStatus("Saved. Page will refresh with new content.");
      }
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Save failed.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <button type="button" className="page-edit-fab" onClick={() => setOpen(true)}>
        Edit
      </button>

      {open ? (
        <div className="page-editor-overlay" role="dialog" aria-modal="true" aria-label={title}>
          <button
            type="button"
            className="page-editor-backdrop"
            aria-label="Close editor"
            onClick={() => setOpen(false)}
          />
          <aside className="page-editor-drawer">
            <header className="page-editor-header">
              <div>
                <p className="eyebrow">Admin</p>
                <h2>{title}</h2>
              </div>
              <button type="button" className="page-editor-close" onClick={() => setOpen(false)}>
                Close
              </button>
            </header>

            <div className="page-editor-body">
              {loading ? <p className="muted">Loading…</p> : null}
              {error ? <p className="error">{error}</p> : null}
              {status ? <p className="success-hint">{status}</p> : null}

              {!loading && draft && section === "home" ? (
                <HomeEditorForm
                  value={draft}
                  saving={saving}
                  onSave={handleSave}
                />
              ) : null}
              {!loading && draft && section === "about" ? (
                <AboutEditorForm value={draft} saving={saving} onSave={handleSave} />
              ) : null}
              {!loading && draft && section === "skills" ? (
                <SkillsEditorForm value={draft} saving={saving} onSave={handleSave} />
              ) : null}
              {!loading && draft && section === "education" ? (
                <EducationEditorForm value={draft} saving={saving} onSave={handleSave} />
              ) : null}
              {!loading && draft && section === "experience" ? (
                <ExperienceEditorForm value={draft} saving={saving} onSave={handleSave} />
              ) : null}
              {!loading && draft && section === "projects" ? (
                <ProjectsEditorForm
                  projects={draft.projects || []}
                  onChanged={async () => {
                    const projects = await fetchProjects();
                    setDraft({ projects });
                    writeCache("projects", projects);
                    notifyContentUpdated("projects");
                  }}
                  createProject={createProject}
                  updateProject={updateProject}
                  removeProject={removeProject}
                />
              ) : null}
            </div>
          </aside>
        </div>
      ) : null}
    </>
  );
}

export default PageEditor;
