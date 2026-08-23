import { normalizeImageUrl } from "./driveUrl";

export const DEFAULT_PROJECT_IMAGE = "images/projects/image.png";

const isGithubHref = (href = "") => /github\.com/i.test(href);
const isUnavailableText = (text = "") => /not available|unavailable/i.test(text);
const isLiveText = (text = "") => /live|website|demo|site/i.test(text);

export function projectImageSrc(image) {
  return normalizeImageUrl(image || DEFAULT_PROJECT_IMAGE) || DEFAULT_PROJECT_IMAGE;
}

export function getGithubLink(project) {
  return (project?.links || []).find(
    (link) => /github/i.test(String(link.text || "")) || isGithubHref(link.href)
  );
}

export function getLiveLink(project) {
  const links = project?.links || [];
  return (
    links.find((link) => {
      const text = String(link.text || "");
      const href = String(link.href || "").trim();
      if (!href || isGithubHref(href) || isUnavailableText(text)) {
        return false;
      }
      return isLiveText(text);
    }) ||
    links.find((link) => {
      const text = String(link.text || "");
      const href = String(link.href || "").trim();
      return href && !isGithubHref(href) && !isUnavailableText(text);
    }) ||
    null
  );
}
