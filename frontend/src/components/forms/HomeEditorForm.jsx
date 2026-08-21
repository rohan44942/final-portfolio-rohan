import { useEffect, useState } from "react";
import { normalizeImageUrl } from "../../lib/driveUrl";

function HomeEditorForm({ value, saving, onSave }) {
  const [form, setForm] = useState(value);

  useEffect(() => {
    setForm(value);
  }, [value]);

  const update = (key, next) => setForm((current) => ({ ...current, [key]: next }));

  return (
    <form
      className="page-editor-form"
      onSubmit={(event) => {
        event.preventDefault();
        onSave({
          name: form.name || "",
          intro: form.intro || "",
          imageSource: normalizeImageUrl(form.imageSource),
          roles: String(form.rolesText ?? (form.roles || []).join("\n"))
            .split("\n")
            .map((item) => item.trim())
            .filter(Boolean),
          summary: String(form.summaryText ?? (form.summary || []).join("\n"))
            .split("\n")
            .map((item) => item.trim())
            .filter(Boolean),
        });
      }}
    >
      <label>
        Name
        <input
          value={form.name || ""}
          onChange={(event) => update("name", event.target.value)}
        />
      </label>
      <label>
        Intro
        <textarea
          rows={5}
          value={form.intro || ""}
          onChange={(event) => update("intro", event.target.value)}
        />
      </label>
      <label>
        Profile image URL
        <input
          value={form.imageSource || ""}
          onChange={(event) => update("imageSource", event.target.value)}
          placeholder="images/about/profile.jpg or Google Drive link"
        />
      </label>
      <p className="field-hint muted">
        Paste a public Google Drive file link, or a path like `images/about/profile.jpg`.
      </p>
      {form.imageSource ? (
        <img
          className="editor-image-preview"
          src={normalizeImageUrl(form.imageSource)}
          alt="Preview"
        />
      ) : null}
      <label>
        Roles (one per line)
        <textarea
          rows={4}
          value={form.rolesText ?? (form.roles || []).join("\n")}
          onChange={(event) => update("rolesText", event.target.value)}
        />
      </label>
      <label>
        Summary points (one per line)
        <textarea
          rows={6}
          value={form.summaryText ?? (form.summary || []).join("\n")}
          onChange={(event) => update("summaryText", event.target.value)}
        />
      </label>
      <button type="submit" disabled={saving}>
        {saving ? "Saving…" : "Save home"}
      </button>
    </form>
  );
}

export default HomeEditorForm;
