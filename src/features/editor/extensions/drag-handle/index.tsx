import { Editor } from "@tiptap/react";

import { useDragHandle } from "./use-drag-handle";
import { DragIcon } from "./drag-icon";
import { calcOffset } from "./calc-offset";

interface DragHandleProps {
  editor: Editor | null;
}

export default function DragHandle({ editor }: DragHandleProps) {
  const { dragTarget, handleDragStart, handleDragEnd, handleClick } =
    useDragHandle(editor);

  if (dragTarget === null || !editor) return null;

  const offsetStyles = calcOffset(dragTarget, editor);

  return (
    <div
      draggable="true"
      className="absolute size-6 cursor-grab text-gray-300"
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onClick={handleClick}
      style={{
        ...offsetStyles,
      }}
    >
      <DragIcon />
    </div>
  );
}
