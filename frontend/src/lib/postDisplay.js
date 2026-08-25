export function formatPostDate(date) {
  if (!date) return "";
  const parsed = new Date(date);
  if (Number.isNaN(parsed.getTime())) return "";
  return parsed.toLocaleDateString("en", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export function postMeta(post) {
  const parts = [formatPostDate(post?.date), ...(post?.tags || []).slice(0, 2)].filter(Boolean);
  return parts.join(" / ");
}
