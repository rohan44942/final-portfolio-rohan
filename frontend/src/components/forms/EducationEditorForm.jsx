import { useEffect, useState } from "react";

function EducationEditorForm({ value, saving, onSave }) {
  const [items, setItems] = useState(value?.education || []);

  useEffect(() => {
    setItems(value?.education || []);
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
        cardTitle: "",
        cardSubtitle: "",
        cardDetailedText: "",
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
        onSave({ education: items });
      }}
    >
      {items.map((item, index) => (
        <div className="editor-card" key={`edu-${index}`}>
          <div className="editor-card-head">
            <strong>Education #{index + 1}</strong>
            <button type="button" onClick={() => removeItem(index)}>
              Remove
            </button>
          </div>
          <label>
            Date / title
            <input value={item.title || ""} onChange={(e) => updateItem(index, "title", e.target.value)} />
          </label>
          <label>
            School / card title
            <input
              value={item.cardTitle || ""}
              onChange={(e) => updateItem(index, "cardTitle", e.target.value)}
            />
          </label>
          <label>
            Subtitle
            <input
              value={item.cardSubtitle || ""}
              onChange={(e) => updateItem(index, "cardSubtitle", e.target.value)}
            />
          </label>
          <label>
            Details
            <textarea
              rows={4}
              value={item.cardDetailedText || ""}
              onChange={(e) => updateItem(index, "cardDetailedText", e.target.value)}
            />
          </label>
        </div>
      ))}
      <button type="button" onClick={addItem}>
        Add education
      </button>
      <button type="submit" disabled={saving}>
        {saving ? "Saving…" : "Save education"}
      </button>
    </form>
  );
}

export default EducationEditorForm;
