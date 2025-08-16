import React, { useCallback, useEffect, useState } from "react";
import { Editor } from "@tiptap/react";
import { NodeSelection } from "@tiptap/pm/state";
import { Node, Slice } from "@tiptap/pm/model";
import { isTopBlockAtomNode } from "../../lib/node";

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

  const setTopBlockAtomDragInfo = useCallback(
    (pos: number) => {
      if (!editor) return;

      const dom = editor.view.nodeDOM(pos);
      const node = editor.state.doc.nodeAt(pos);

      if (!dom || !node) return;

      setDragTarget({
        dom: dom as HTMLElement,
        node,
        nodeSelection: NodeSelection.create(editor.state.doc, pos),
      });
    },
    [editor]
  );

  const setTopBlockDragInfo = useCallback(
    (pos: number) => {
      if (!editor) return;

      const $pos = editor.state.doc.resolve(pos);
      const node = $pos.node(1);

      if (!node) return;

      setDragTarget({
        dom: editor.view.domAtPos($pos.start(1)).node as HTMLElement,
        node,
        nodeSelection: NodeSelection.create(editor.state.doc, $pos.before(1)),
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

      // リーフノードはNodeやDOMの取得方法が通常と異なるので、分けて処理する

      if (isTopBlockAtomNode(editor, posWithInside.pos)) {
        // inside != -1の時、atomではposが上半分と下半分で異なる(pos.insideは同じ)
        setTopBlockAtomDragInfo(
          posWithInside.inside >= 0 ? posWithInside.inside : posWithInside.pos
        );
      } else {
        // inside == -1の時、posWithInside.posは要素の外になるので+1する
        setTopBlockDragInfo(
          posWithInside.inside >= 0 ? posWithInside.pos : posWithInside.pos + 1
        );
      }
    },
    [editor, setTopBlockAtomDragInfo, setTopBlockDragInfo]
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
