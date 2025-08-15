import { Node } from "@tiptap/react";

export const PrismCodeFileName = Node.create({
  name: "codeFileName",
  content: "text*",
  marks: "",

  parseHTML() {
    return [
      {
        tag: "div[data-code-file-name]",
        priority: 100,
      },
    ];
  },

  renderHTML() {
    return [
      "div",
      { "data-code-file-name": "", class: "code-block-filename-container" },
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
