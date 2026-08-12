/**
 * Grows a `<textarea>` to fit its content, called from `onInput` by every
 * auto-growing textarea in the recipe editor (Header, InstructionItem, Notes).
 *
 * Resetting to `"auto"` first (rather than reading `scrollHeight` directly
 * off the textarea's current height) matters when the content shrinks, e.g.
 * deleting a line: `scrollHeight` never reports smaller than the element's
 * current height, so without the reset the textarea would only ever grow,
 * never shrink back down.
 *
 * @param el the textarea to resize, or `undefined` (a no-op) - accepts
 * `undefined` so callers can pass an unset `ref` directly without a guard
 */
export const resizeTextarea = (el: HTMLTextAreaElement | undefined) => {
  if (!el) return;
  el.style.height = "auto"; // reset height first so scrollHeight below is accurate
  el.style.height = el.scrollHeight + "px";
};
