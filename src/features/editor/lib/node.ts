import type { Slice } from "@tiptap/pm/model";

export function getSliceText(slice: Slice): string {
  let textContent = "";
  slice.content.forEach((node) => {
    textContent += node.textContent;
  });
  return textContent;
}
