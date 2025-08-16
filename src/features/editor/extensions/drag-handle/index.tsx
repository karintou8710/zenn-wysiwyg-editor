import { Editor } from "@tiptap/react";

import { useDragHandle } from "./use-drag-handle";
import { DragIcon } from "./drag-icon";
import { calcOffset } from "./calc-offset";

interface DragHandleProps {
  editor: Editor | null;
}

export function DragHandle({ editor }: DragHandleProps) {
  const { dragTarget, handleDragStart, handleDragEnd, handleClick } =
    useDragHandle(editor);

  if (dragTarget === null) return null;

  const offsetStyles = calcOffset(dragTarget);

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

// デフォルトエクスポートも提供
export default DragHandle;
