import { Node } from "@tiptap/react";

export const CodeBlockFileName = Node.create({
  name: "codeBlockFileName",
  content: "text*",
  marks: "",

  parseHTML() {
    return [
      {
        tag: "div.code-block-filename-container",
        priority: 100,
      },
    ];
  },

  renderHTML() {
    return [
      "div",
      {
        class: "code-block-filename-container",
      },
      ["span", { class: "code-block-filename" }, 0],
    ];
  },

  addKeyboardShortcuts() {
    return {
      Backspace: () => {
        const { selection } = this.editor.state;
        const { $from } = selection;
        if ($from.node().type.name !== this.name) return false;

        if (!selection.empty || $from.start() !== $from.pos) return false;

        return true;
      },
    };
  },
});
