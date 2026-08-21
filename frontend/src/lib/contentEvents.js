/** Notify public pages to refetch after admin saves. */
export const CONTENT_UPDATED_EVENT = "portfolio-content-updated";

export function notifyContentUpdated(section) {
  window.dispatchEvent(
    new CustomEvent(CONTENT_UPDATED_EVENT, {
      detail: { section, at: Date.now() },
    })
  );
}
