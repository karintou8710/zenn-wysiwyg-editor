import type {
  Node as ProseMirrorNode,
  ResolvedPos,
  Slice,
} from "@tiptap/pm/model";
import {
  type Editor,
  getText,
  getTextSerializersFromSchema,
  type Predicate,
} from "@tiptap/react";

export function getSliceText(slice: Slice): string {
  let textContent = "";
  slice.content.forEach((node) => {
    textContent += node.textContent;
  });
  return textContent;
}

export const isNodeVisible = (position: number, editor: Editor): boolean => {
  const node = editor.view.domAtPos(position).node as HTMLElement;
  const isOpen = node.offsetParent !== null;

  return isOpen;
};

export const findClosestVisibleNode = (
  $pos: ResolvedPos,
  predicate: Predicate,
  editor: Editor,
):
  | {
      pos: number;
      start: number;
      depth: number;
      node: ProseMirrorNode;
    }
  | undefined => {
  for (let i = $pos.depth; i > 0; i -= 1) {
    const node = $pos.node(i);
    const match = predicate(node);
    const isVisible = isNodeVisible($pos.start(i), editor);

    if (match && isVisible) {
      return {
        pos: i > 0 ? $pos.before(i) : 0,
        start: $pos.start(i),
        depth: i,
        node,
      };
    }
  }
};
