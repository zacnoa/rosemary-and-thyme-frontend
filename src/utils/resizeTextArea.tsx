
export const resizeTextarea = (el: HTMLTextAreaElement | undefined) => {
  if (!el) return;
  el.style.height = "auto"; // resetiraj visinu da scrollHeight bude točan
  el.style.height = el.scrollHeight + "px";
};
