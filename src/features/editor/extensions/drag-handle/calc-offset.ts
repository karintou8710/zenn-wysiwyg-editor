import { type DragTarget } from "./use-drag-handle";

const DRAG_HANDLE_X_OFFSET = 25;

export function calcOffset(dragTarget: DragTarget) {
  const rect = dragTarget.dom.getBoundingClientRect();
  let top = rect?.top + window.scrollY;
  let left = rect?.left + window.scrollX - DRAG_HANDLE_X_OFFSET;

  return { top, left };
}
