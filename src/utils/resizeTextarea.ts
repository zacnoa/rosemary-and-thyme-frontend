/**
 * Provides the resizeTextarea function.
 */
export const resizeTextarea = (el: HTMLTextAreaElement | undefined) => {
  if (!el) return;
  el.style.height = "auto"; // reset height first so scrollHeight below is accurate
  el.style.height = el.scrollHeight + "px";
};
