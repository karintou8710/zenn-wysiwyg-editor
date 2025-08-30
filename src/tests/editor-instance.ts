import { Editor, type Extension, type Mark, type Node } from "@tiptap/react";
import { afterEach } from "vitest";

let __global_editor: Editor | null = null;

export function createEditorInstance(config: {
  content: string;
  extensions: (Extension | Node | Mark)[];
}) {
  __global_editor?.destroy();

  __global_editor = new Editor({
    extensions: config.extensions,
    content: config.content,
  });

  return __global_editor;
}

// インスタンスを削除しないと、setTimeoutなどで後から実行されることでエラーになる
afterEach(() => {
  __global_editor?.destroy();
  __global_editor = null;
});
