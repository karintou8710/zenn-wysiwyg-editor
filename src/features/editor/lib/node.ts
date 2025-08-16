import type { Editor } from "@tiptap/react";

export function isTopBlockAtomNode(editor: Editor, pos: number) {
  const $pos = editor.state.doc.resolve(pos);
  const node = editor.state.doc.nodeAt(pos);

  return $pos.node().type.name === "doc" && node?.isAtom && node?.isBlock;
}
