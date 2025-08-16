import React, { useCallback, useEffect, useState } from "react";
import { Editor } from "@tiptap/react";
import { NodeSelection } from "@tiptap/pm/state";
import { Node, Slice } from "@tiptap/pm/model";

// ProseMirrorの内部実装がエクスポートされてないので、自前定義
class Dragging {
  constructor(
    // @ts-ignore
    public slice: Slice,
    // @ts-ignore
    public move: boolean,
    // @ts-ignore
    public node?: NodeSelection
  ) {}
}

export interface DragTarget {
  dom: HTMLElement;
  node: Node;
  nodeSelection: NodeSelection;
}

export function useDragHandle(editor: Editor | null) {
  const [dragTarget, setDragTarget] = useState<DragTarget | null>(null);

  const setTopBlockDragTarget = useCallback(
    (pos: number) => {
      if (!editor) return;

      const $pos = editor.state.doc.resolve(pos);
      const beforePos = $pos.before(1);
      const dom = editor.view.nodeDOM(beforePos) as HTMLElement | null;
      const node = editor.state.doc.nodeAt(beforePos);

      if (!node || !dom) return;

      setDragTarget({
        dom,
        node,
        nodeSelection: NodeSelection.create(editor.state.doc, beforePos),
      });
    },
    [editor]
  );

  const handleDragStart = useCallback(
    (ev: React.DragEvent) => {
      // ProseMirrorのDragStart参考に実装すれば良さそう。view.draggingに対象のNodeSelectionを入れる
      // https://github.com/ProseMirror/prosemirror-view/blob/b2e782ae7c8013505ba05683b185886585ef5939/src/input.ts

      if (!editor || dragTarget === null || !ev.dataTransfer) return;

      ev.dataTransfer.setDragImage(dragTarget.dom, 0, 0);
      ev.dataTransfer.effectAllowed = "copyMove";

      editor.view.dragging = new Dragging(
        dragTarget.nodeSelection.content(),
        true,
        dragTarget.nodeSelection
      );
    },
    [editor, dragTarget]
  );

  const handleMouseMove = useCallback(
    (ev: MouseEvent) => {
      if (!editor) return;

      const posWithInside = editor.view.posAtCoords({
        left: ev.clientX,
        top: ev.clientY,
      });
      if (!posWithInside) return;

      // カーソルが乗った位置で、深さ１ノードのbefore位置を取得
      setTopBlockDragTarget(posWithInside.pos);
    },
    [editor, setTopBlockDragTarget]
  );

  const handleClick = useCallback(() => {
    if (!editor || dragTarget === null) return;

    editor
      ?.chain()
      .focus()
      .setNodeSelection(dragTarget.nodeSelection.from)
      .run();
  }, [editor, dragTarget]);

  const handleDragEnd = useCallback(() => {
    if (!editor) return;

    editor.view.dragging = null;
    setDragTarget(null);
  }, [editor]);

  useEffect(() => {
    if (!editor) return;

    const element = editor.$doc.element;
    element.addEventListener("mousemove", handleMouseMove);

    return () => {
      element.removeEventListener("mousemove", handleMouseMove);
    };
  }, [editor, handleMouseMove]);

  return {
    dragTarget,
    handleDragStart,
    handleClick,
    handleDragEnd,
  };
}
