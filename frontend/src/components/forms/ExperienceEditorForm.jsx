import { useEffect, useState } from "react";

function ExperienceEditorForm({ value, saving, onSave }) {
  const [items, setItems] = useState(value?.experiences || []);

  useEffect(() => {
    setItems(value?.experiences || []);
  }, [value]);

  const updateItem = (index, key, next) => {
    setItems((current) =>
      current.map((item, i) => (i === index ? { ...item, [key]: next } : item))
    );
  };

  const addItem = () => {
    setItems((current) => [
      ...current,
      {
        title: "",
        subtitle: "",
        workType: "",
        dateText: "",
        workDescription: [],
      },
    ]);
  };

  const removeItem = (index) => {
    setItems((current) => current.filter((_, i) => i !== index));
  };

  return (
    <form
      className="page-editor-form"
      onSubmit={(event) => {
        event.preventDefault();
        onSave({
          experiences: items.map((item) => {
            const { workDescriptionText, workDescription, ...rest } = item;
            const fromText =
              workDescriptionText != null
                ? String(workDescriptionText)
                : Array.isArray(workDescription)
                  ? workDescription.join("\n")
                  : String(workDescription || "");
            return {
              ...rest,
              workDescription: fromText
                .split(/\n+/)
                .map((line) => line.trim())
                .filter(Boolean),
            };
          }),
        });
      }}
    >
      {items.map((item, index) => (
        <div className="editor-card" key={`exp-${index}`}>
          <div className="editor-card-head">
            <strong>Experience #{index + 1}</strong>
            <button type="button" onClick={() => removeItem(index)}>
              Remove
            </button>
          </div>
          <label>
            Role title
            <input value={item.title || ""} onChange={(e) => updateItem(index, "title", e.target.value)} />
          </label>
          <label>
            Company / subtitle
            <input
              value={item.subtitle || ""}
              onChange={(e) => updateItem(index, "subtitle", e.target.value)}
            />
          </label>
          <label>
            Work type
            <input
              value={item.workType || ""}
              onChange={(e) => updateItem(index, "workType", e.target.value)}
            />
          </label>
          <label>
            Dates
            <input
              value={item.dateText || ""}
              onChange={(e) => updateItem(index, "dateText", e.target.value)}
            />
          </label>
          <label>
            Bullet points (one per line)
            <textarea
              rows={5}
              value={
                item.workDescriptionText ??
                (Array.isArray(item.workDescription) ? item.workDescription.join("\n") : "")
              }
              onChange={(e) => updateItem(index, "workDescriptionText", e.target.value)}
            />
          </label>
        </div>
      ))}
      <button type="button" onClick={addItem}>
        Add experience
      </button>
      <button type="submit" disabled={saving}>
        {saving ? "Saving…" : "Save experience"}
      </button>
    </form>
  );
}

export default ExperienceEditorForm;
