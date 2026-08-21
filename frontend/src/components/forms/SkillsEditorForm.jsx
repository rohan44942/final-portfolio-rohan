import { useEffect, useState } from "react";
import { normalizeImageUrl } from "../../lib/driveUrl";

function SkillsEditorForm({ value, saving, onSave }) {
  const [intro, setIntro] = useState(value?.intro || "");
  const [groupsText, setGroupsText] = useState("");

  useEffect(() => {
    setIntro(value?.intro || "");
    setGroupsText(JSON.stringify(value?.skills || [], null, 2));
  }, [value]);

  return (
    <form
      className="page-editor-form"
      onSubmit={(event) => {
        event.preventDefault();
        try {
          const skills = JSON.parse(groupsText);
          const normalized = (skills || []).map((group) => ({
            ...group,
            items: (group.items || []).map((item) => ({
              ...item,
              icon: normalizeImageUrl(item.icon || ""),
            })),
          }));
          onSave({ intro, skills: normalized });
        } catch {
          alert("Skills JSON is invalid. Keep the array structure.");
        }
      }}
    >
      <label>
        Intro
        <textarea rows={3} value={intro} onChange={(event) => setIntro(event.target.value)} />
      </label>
      <label>
        Skills groups (structured JSON)
        <textarea rows={16} value={groupsText} onChange={(event) => setGroupsText(event.target.value)} />
      </label>
      <p className="field-hint muted">
        For icons, use Drive links or `images/...` paths inside each item&apos;s `icon` field.
      </p>
      <button type="submit" disabled={saving}>
        {saving ? "Saving…" : "Save skills"}
      </button>
    </form>
  );
}

export default SkillsEditorForm;
