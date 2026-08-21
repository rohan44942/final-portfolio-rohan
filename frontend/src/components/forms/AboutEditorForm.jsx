import { useEffect, useState } from "react";
import { normalizeImageUrl } from "../../lib/driveUrl";

function AboutEditorForm({ value, saving, onSave }) {
  const [form, setForm] = useState(value);

  useEffect(() => {
    setForm(value);
  }, [value]);

  return (
    <form
      className="page-editor-form"
      onSubmit={(event) => {
        event.preventDefault();
        onSave({
          ...form,
          imageSource: normalizeImageUrl(form.imageSource),
        });
      }}
    >
      <label>
        About text
        <textarea
          rows={12}
          value={form.about || ""}
          onChange={(event) => setForm((current) => ({ ...current, about: event.target.value }))}
        />
      </label>
      <label>
        Image URL
        <input
          value={form.imageSource || ""}
          onChange={(event) =>
            setForm((current) => ({ ...current, imageSource: event.target.value }))
          }
          placeholder="Google Drive link or images/about/profile.jpg"
        />
      </label>
      <p className="field-hint muted">Public Google Drive file links are converted automatically.</p>
      {form.imageSource ? (
        <img
          className="editor-image-preview"
          src={normalizeImageUrl(form.imageSource)}
          alt="Preview"
        />
      ) : null}
      <button type="submit" disabled={saving}>
        {saving ? "Saving…" : "Save about"}
      </button>
    </form>
  );
}

export default AboutEditorForm;
