import type { ResolvedPos } from "@tiptap/pm/model";

export function isChildOf($pos: ResolvedPos, parentNodeName: string) {
  const depth = $pos.depth;
  for (let i = depth - 1; i >= 0; i--) {
    const node = $pos.node(i);
    if (node.type.name === parentNodeName) {
      return true;
    }
  }
  return false;
}
