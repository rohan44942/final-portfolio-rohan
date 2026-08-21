import { useEffect, useState } from "react";
import { normalizeImageUrl } from "../../lib/driveUrl";

const emptyProject = {
  title: "",
  bodyText: "",
  image: "",
  tagsText: "",
  linksText: "",
  featured: false,
  order: 0,
};

function toForm(project = {}) {
  return {
    ...emptyProject,
    ...project,
    tagsText: (project.tags || []).join(", "),
    linksText: (project.links || [])
      .map((link) => `${link.text || "Link"} | ${link.href || ""}`)
      .join("\n"),
  };
}

function fromForm(form) {
  return {
    title: form.title || "",
    bodyText: form.bodyText || "",
    image: normalizeImageUrl(form.image || ""),
    featured: Boolean(form.featured),
    order: Number(form.order) || 0,
    tags: String(form.tagsText || "")
      .split(",")
      .map((tag) => tag.trim())
      .filter(Boolean),
    links: String(form.linksText || "")
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean)
      .map((line) => {
        const [text, href] = line.split("|").map((part) => part.trim());
        return { text: text || "Link", href: href || "#" };
      }),
  };
}

function ProjectsEditorForm({
  projects,
  onChanged,
  createProject,
  updateProject,
  removeProject,
}) {
  const [form, setForm] = useState(emptyProject);
  const [editingId, setEditingId] = useState("");
  const [status, setStatus] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!editingId) setForm(emptyProject);
  }, [editingId]);

  const startEdit = (project) => {
    setEditingId(project._id);
    setForm(toForm(project));
    setStatus("");
  };

  const handleSave = async (event) => {
    event.preventDefault();
    setSaving(true);
    setStatus("");
    try {
      const payload = fromForm(form);
      if (editingId) {
        await updateProject(editingId, payload);
        setStatus("Project updated.");
      } else {
        await createProject(payload);
        setStatus("Project created.");
      }
      setEditingId("");
      setForm(emptyProject);
      await onChanged();
    } catch (error) {
      setStatus(error.response?.data?.message || "Could not save project.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this project?")) return;
    await removeProject(id);
    if (editingId === id) {
      setEditingId("");
      setForm(emptyProject);
    }
    await onChanged();
  };

  return (
    <div className="page-editor-form">
      <div className="editor-card">
        <strong>Existing projects</strong>
        <ul className="editor-project-list">
          {(projects || []).map((project) => (
            <li key={project._id || project.title}>
              <span>{project.title}</span>
              <span className="editor-project-actions">
                <button type="button" onClick={() => startEdit(project)}>
                  Edit
                </button>
                <button type="button" onClick={() => handleDelete(project._id)}>
                  Delete
                </button>
              </span>
            </li>
          ))}
        </ul>
      </div>

      <form onSubmit={handleSave}>
        <h3>{editingId ? "Edit project" : "Add project"}</h3>
        <label>
          Title
          <input
            value={form.title}
            onChange={(e) => setForm((current) => ({ ...current, title: e.target.value }))}
            required
          />
        </label>
        <label>
          Description
          <textarea
            rows={4}
            value={form.bodyText}
            onChange={(e) => setForm((current) => ({ ...current, bodyText: e.target.value }))}
          />
        </label>
        <label>
          Image URL (Drive link or path)
          <input
            value={form.image}
            onChange={(e) => setForm((current) => ({ ...current, image: e.target.value }))}
            placeholder="Google Drive public file link"
          />
        </label>
        {form.image ? (
          <img className="editor-image-preview" src={normalizeImageUrl(form.image)} alt="Preview" />
        ) : null}
        <label>
          Tags (comma separated)
          <input
            value={form.tagsText}
            onChange={(e) => setForm((current) => ({ ...current, tagsText: e.target.value }))}
          />
        </label>
        <label>
          Links (one per line: Label | https://...)
          <textarea
            rows={3}
            value={form.linksText}
            onChange={(e) => setForm((current) => ({ ...current, linksText: e.target.value }))}
          />
        </label>
        <label>
          Order
          <input
            type="number"
            value={form.order}
            onChange={(e) => setForm((current) => ({ ...current, order: e.target.value }))}
          />
        </label>
        <label className="checkbox-row">
          <input
            type="checkbox"
            checked={Boolean(form.featured)}
            onChange={(e) => setForm((current) => ({ ...current, featured: e.target.checked }))}
          />
          Featured
        </label>
        {status ? <p className="muted">{status}</p> : null}
        <div className="editor-actions-row">
          <button type="submit" disabled={saving}>
            {saving ? "Saving…" : editingId ? "Update project" : "Create project"}
          </button>
          {editingId ? (
            <button type="button" onClick={() => { setEditingId(""); setForm(emptyProject); }}>
              Cancel edit
            </button>
          ) : null}
        </div>
      </form>
    </div>
  );
}

export default ProjectsEditorForm;
