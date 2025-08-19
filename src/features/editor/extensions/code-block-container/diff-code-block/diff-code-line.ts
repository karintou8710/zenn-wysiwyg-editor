import { Node } from "@tiptap/react";

export const DiffCodeLine = Node.create({
  name: "diffCodeLine",
  content: "text*",

  parseHTML() {
    return [
      {
        tag: "span.diff-code-line",
        priority: 100,
      },
    ];
  },

  renderHTML() {
    return [
      "span",
      {
        class: "diff-code-line",
      },
      0,
    ];
  },
});
