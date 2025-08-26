import { Editor, type Extension, type Mark, type Node } from "@tiptap/react";
import { afterEach, beforeEach } from "vitest";

// テスト毎に描画するDOMをリセットする
let ___global_container: HTMLElement | null = null;

beforeEach(() => {
  ___global_container = document.createElement("div");
  document.body.appendChild(___global_container);
});

afterEach(async () => {
  if (___global_container) {
    document.body.removeChild(___global_container);
  }
});

type RenderTiptapEditor = {
  content: string;
  extensions: (Extension | Node | Mark)[];
};

export function renderTiptapEditor({
  content,
  extensions,
}: RenderTiptapEditor) {
  const editor = new Editor({
    element: ___global_container,
    extensions,
    content,
  });

  return editor;
}
