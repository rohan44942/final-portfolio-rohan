import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  createProject,
  fetchAdminProjects,
  fetchSection,
  getAdminMe,
  removeProject,
  saveSection,
  setAuthToken,
  setProjectVisibility,
  syncGithubProjects,
  updateProject,
} from "../lib/api";
import { clearStoredToken, getStoredToken } from "../lib/storage";
import Loader from "../components/Loader";
import ThemeSwitch from "../components/ThemeSwitch";

const sectionOptions = [
  "site-config",
  "home",
  "about",
  "skills",
  "education",
  "experience",
  "social",
  "navbar",
  "routes",
];

const emptyProject = {
  title: "",
  bodyText: "",
  image: "",
  tags: [],
  links: [],
  featured: false,
  visible: true,
  order: 0,
};

function AdminDashboardPage() {
  const navigate = useNavigate();
  const [selectedSection, setSelectedSection] = useState("home");
  const [sectionText, setSectionText] = useState("{}");
  const [sectionBaseline, setSectionBaseline] = useState("{}");
  const [projects, setProjects] = useState([]);
  const [projectForm, setProjectForm] = useState(emptyProject);
  const [editingProjectId, setEditingProjectId] = useState("");
  const [resumeUrl, setResumeUrl] = useState("");
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(true);
  const [githubSyncing, setGithubSyncing] = useState(false);

  const currentSectionLabel = useMemo(() => selectedSection.toUpperCase(), [selectedSection]);

  const refreshAll = async () => {
    const [sectionData, projectsData, configData] = await Promise.all([
      fetchSection(selectedSection),
      fetchAdminProjects(),
      fetchSection("site-config").catch(() => ({})),
    ]);
    const sectionString = JSON.stringify(sectionData, null, 2);
    setSectionText(sectionString);
    setSectionBaseline(sectionString);
    setProjects(projectsData);
    setResumeUrl(configData?.resumeUrl || "");
  };

  useEffect(() => {
    const token = getStoredToken();
    if (!token) {
      navigate("/admin/login");
      return;
    }

    setAuthToken(token);
    getAdminMe()
      .then(() => refreshAll())
      .then(() => setLoading(false))
      .then(() => handleGithubSync())
      .catch(() => {
        clearStoredToken();
        setAuthToken(null);
        navigate("/admin/login");
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (loading) return;

    fetchSection(selectedSection)
      .then((data) => {
        const sectionString = JSON.stringify(data, null, 2);
        setSectionText(sectionString);
        setSectionBaseline(sectionString);
      })
      .catch(() => {
        setSectionText("{}");
        setSectionBaseline("{}");
      });
  }, [selectedSection, loading]);

  const handleLogout = () => {
    clearStoredToken();
    setAuthToken(null);
    navigate("/");
  };

  const handleSaveSection = async () => {
    try {
      const parsed = JSON.parse(sectionText);
      await saveSection(selectedSection, parsed);
      const savedText = JSON.stringify(parsed, null, 2);
      setSectionText(savedText);
      setSectionBaseline(savedText);
      setStatus(`${currentSectionLabel} saved successfully.`);
    } catch (error) {
      setStatus(error.response?.data?.message || "Invalid JSON or save failed.");
    }
  };

  const handlePrettyFormat = () => {
    try {
      const parsed = JSON.parse(sectionText);
      setSectionText(JSON.stringify(parsed, null, 2));
      setStatus("Section JSON formatted.");
    } catch {
      setStatus("Cannot format: JSON is invalid.");
    }
  };

  const handleCopyJson = async () => {
    try {
      await window.navigator.clipboard.writeText(sectionText);
      setStatus("Section JSON copied.");
    } catch {
      setStatus("Copy failed. Please copy manually.");
    }
  };

  const handleResetJson = () => {
    setSectionText(sectionBaseline);
    setStatus("Section JSON reset.");
  };

  const handleEditProject = (project) => {
    setProjectForm({
      title: project.title,
      bodyText: project.bodyText,
      image: project.image || "",
      tags: project.tags || [],
      links: project.links || [],
      featured: Boolean(project.featured),
      visible: project.visible !== false,
      githubId: project.githubId,
      githubName: project.githubName || "",
      order: Number(project.order || 0),
    });
    setEditingProjectId(project._id);
  };

  const handleProjectSubmit = async (event) => {
    event.preventDefault();
    try {
      if (editingProjectId) {
        await updateProject(editingProjectId, projectForm);
      } else {
        await createProject(projectForm);
      }
      setEditingProjectId("");
      setProjectForm(emptyProject);
      setProjects(await fetchAdminProjects());
      setStatus("Projects updated.");
    } catch (error) {
      setStatus(error.response?.data?.message || "Project save failed.");
    }
  };

  const handleDeleteProject = async (id) => {
    try {
      await removeProject(id);
      setProjects(await fetchAdminProjects());
      setStatus("Project deleted.");
    } catch (error) {
      setStatus(error.response?.data?.message || "Project delete failed.");
    }
  };

  const handleGithubSync = async () => {
    setGithubSyncing(true);
    try {
      const result = await syncGithubProjects();
      setProjects(result.projects || []);
      setStatus(
        `Loaded GitHub repos for ${result.username}. Imported ${result.imported}, linked ${result.linked}. Toggle Show on site to publish.`
      );
    } catch (error) {
      setStatus(error.response?.data?.message || "GitHub sync failed.");
    } finally {
      setGithubSyncing(false);
    }
  };

  const handleToggleVisible = async (project) => {
    try {
      const nextVisible = project.visible === false;
      const updated = await setProjectVisibility(project._id, nextVisible);
      setProjects((current) => current.map((item) => (item._id === updated._id ? updated : item)));
      setStatus(
        updated.visible
          ? `${updated.title} is now visible on the projects page.`
          : `${updated.title} is hidden from the projects page.`
      );
    } catch (error) {
      setStatus(error.response?.data?.message || "Visibility update failed.");
    }
  };

  const handleSaveResumeUrl = async () => {
    try {
      const existing = await fetchSection("site-config").catch(() => ({}));
      await saveSection("site-config", {
        ...existing,
        resumeUrl: resumeUrl.trim(),
      });
      setStatus("Resume link updated.");
    } catch (error) {
      setStatus(error.response?.data?.message || "Resume link save failed.");
    }
  };

  if (loading) {
    return <Loader text="Loading admin dashboard..." />;
  }

  return (
    <main className="admin-shell">
      <div className="admin-top-controls">
        <ThemeSwitch />
      </div>
      <div className="admin-layout">
        <section className="card">
          <div className="admin-header">
            <h1>Admin Dashboard</h1>
            <button type="button" onClick={handleLogout}>
              Logout
            </button>
          </div>
          <p>Manage all portfolio content dynamically from here.</p>
          <div className="tab-row">
            {sectionOptions.map((option) => (
              <button
                type="button"
                key={option}
                className={option === selectedSection ? "tab active" : "tab"}
                onClick={() => setSelectedSection(option)}
              >
                {option}
              </button>
            ))}
          </div>
          <label htmlFor="section-editor">Section JSON</label>
          <textarea
            id="section-editor"
            className="admin-section-editor"
            rows={16}
            value={sectionText}
            onChange={(event) => setSectionText(event.target.value)}
          />
          <div className="editor-actions">
            <button type="button" onClick={handlePrettyFormat}>
              Pretty Format
            </button>
            <button type="button" onClick={handleCopyJson}>
              Copy JSON
            </button>
            <button type="button" onClick={handleResetJson}>
              Reset
            </button>
          </div>
          <button type="button" onClick={handleSaveSection}>
            Save {currentSectionLabel}
          </button>
        </section>

        <section className="card">
          <h2>Resume Link (Google Drive)</h2>
          <p className="muted">Paste your shareable Google Drive resume URL.</p>
          <input
            type="url"
            placeholder="https://drive.google.com/file/d/..."
            value={resumeUrl}
            onChange={(event) => setResumeUrl(event.target.value)}
          />
          <button type="button" onClick={handleSaveResumeUrl}>
            Save Resume Link
          </button>
        </section>

        <section className="card">
          <h2>GitHub projects</h2>
          <p className="muted">
            Your public GitHub repositories are loaded here. Check <strong>Show on site</strong> to
            display a repo on the main projects page, then edit the copy below.
          </p>
          <button type="button" onClick={handleGithubSync} disabled={githubSyncing}>
            {githubSyncing ? "Loading GitHub…" : "Refresh from GitHub"}
          </button>
          <div className="github-project-list">
            {projects.map((project) => (
              <div className="github-project-row" key={project._id}>
                <label className="checkbox">
                  <input
                    type="checkbox"
                    checked={project.visible !== false}
                    onChange={() => handleToggleVisible(project)}
                  />
                  Show on site
                </label>
                <div className="github-project-copy">
                  <strong>{project.title}</strong>
                  {project.githubName ? <span className="muted">{project.githubName}</span> : null}
                  <p>{project.bodyText}</p>
                </div>
                <div className="button-row">
                  <button type="button" onClick={() => handleEditProject(project)}>
                    Edit
                  </button>
                  <button type="button" onClick={() => handleDeleteProject(project._id)}>
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="card">
          <h2>{editingProjectId ? "Edit project" : "Add project"}</h2>
          <form className="admin-form" onSubmit={handleProjectSubmit}>
            <input
              placeholder="Project title"
              value={projectForm.title}
              onChange={(event) => setProjectForm({ ...projectForm, title: event.target.value })}
              required
            />
            <textarea
              rows={4}
              placeholder="Description"
              value={projectForm.bodyText}
              onChange={(event) => setProjectForm({ ...projectForm, bodyText: event.target.value })}
              required
            />
            <input
              placeholder="Image URL"
              value={projectForm.image}
              onChange={(event) => setProjectForm({ ...projectForm, image: event.target.value })}
            />
            <input
              placeholder="Tags (comma separated)"
              value={projectForm.tags.join(", ")}
              onChange={(event) =>
                setProjectForm({
                  ...projectForm,
                  tags: event.target.value
                    .split(",")
                    .map((tag) => tag.trim())
                    .filter(Boolean),
                })
              }
            />
            <input
              placeholder={'Links JSON [{"text":"GitHub","href":"https://..."}]'}
              value={JSON.stringify(projectForm.links)}
              onChange={(event) => {
                try {
                  const links = JSON.parse(event.target.value);
                  setProjectForm({ ...projectForm, links: Array.isArray(links) ? links : [] });
                } catch {
                  // Keep previous valid value while typing invalid JSON.
                }
              }}
            />
            <input
              type="number"
              placeholder="Order"
              value={projectForm.order}
              onChange={(event) => setProjectForm({ ...projectForm, order: Number(event.target.value) })}
            />
            <label className="checkbox">
              <input
                type="checkbox"
                checked={projectForm.featured}
                onChange={(event) => setProjectForm({ ...projectForm, featured: event.target.checked })}
              />
              Featured
            </label>
            <label className="checkbox">
              <input
                type="checkbox"
                checked={projectForm.visible !== false}
                onChange={(event) => setProjectForm({ ...projectForm, visible: event.target.checked })}
              />
              Show on site
            </label>
            <button type="submit">{editingProjectId ? "Update Project" : "Create Project"}</button>
          </form>
        </section>

        {status ? <p className="status">{status}</p> : null}
      </div>
    </main>
  );
}

export default AdminDashboardPage;
