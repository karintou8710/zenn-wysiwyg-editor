export function setSelection(dom: HTMLElement) {
  const range = document.createRange();
  range.selectNodeContents(dom);
  const selection = window.getSelection();
  if (!selection) return;
  selection.removeAllRanges();
  selection.addRange(range);
}
