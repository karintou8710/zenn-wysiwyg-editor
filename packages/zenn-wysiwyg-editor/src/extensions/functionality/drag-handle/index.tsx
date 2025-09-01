import type { Editor } from "@tiptap/react";
import { calcOffset } from "./calc-offset";
import { DragIcon } from "./drag-icon";
import { useDragHandle } from "./use-drag-handle";

interface DragHandleProps {
  editor: Editor | null;
}

export default function DragHandle({ editor }: DragHandleProps) {
  const { dragTarget, handleDragStart, handleDragEnd, handleClick } =
    useDragHandle(editor);

  if (dragTarget === null || !editor) return null;

  const offsetStyles = calcOffset(dragTarget, editor);

  return (
    <button
      type="button"
      draggable="true"
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onClick={handleClick}
      style={{
        position: "absolute",
        width: "1.5rem",
        height: "1.5rem",
        cursor: "grab",
        color: "#d1d5db",
        ...offsetStyles,
      }}
    >
      <DragIcon />
    </button>
  );
}
