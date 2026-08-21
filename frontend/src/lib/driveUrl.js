/**
 * Convert common Google Drive share links into a direct image URL.
 * Falls back to the original string when it is not a Drive link.
 */
export function normalizeImageUrl(input = "") {
  const value = String(input || "").trim();
  if (!value) return "";

  // Already a usable direct Drive media URL
  if (/drive\.google\.com\/uc\?/i.test(value) || /googleusercontent\.com\//i.test(value)) {
    return value;
  }

  // https://drive.google.com/file/d/FILE_ID/view?...
  const fileMatch = value.match(/drive\.google\.com\/file\/d\/([^/]+)/i);
  if (fileMatch?.[1]) {
    return `https://drive.google.com/uc?export=view&id=${fileMatch[1]}`;
  }

  // https://drive.google.com/open?id=FILE_ID
  const openMatch = value.match(/[?&]id=([^&]+)/i);
  if (/drive\.google\.com/i.test(value) && openMatch?.[1]) {
    return `https://drive.google.com/uc?export=view&id=${openMatch[1]}`;
  }

  return value;
}

export function isLikelyGoogleDriveUrl(input = "") {
  return /drive\.google\.com|googleusercontent\.com/i.test(String(input || ""));
}
