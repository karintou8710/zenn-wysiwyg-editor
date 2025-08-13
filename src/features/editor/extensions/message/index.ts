import { Node } from "@tiptap/react";

export interface MessageOptions {
  type?: "message" | "alert";
}

export const Message = Node.create({
  name: "message",
  group: "block",
  content: "inline*",
  defining: true,

  addAttributes() {
    return {
      type: {
        default: "message",
        parseHTML: (element) => element.getAttribute("data-type") || "message",
        renderHTML: ({ type }) => {
          return {
            "data-type": type || "message",
          };
        },
      },
    };
  },

  parseHTML() {
    return [{ tag: "zenn-message" }];
  },

  renderHTML() {
    return ["zenn-message", 0];
  },

  addKeyboardShortcuts() {
    return {
      Enter: ({ editor }) => {
        const { state } = this.editor.view;
        const { $from } = state.selection;
        if ($from.node().type.name !== this.name || !state.selection.empty)
          return false;

        if (
          $from.nodeBefore &&
          $from.nodeBefore.type.name === "hardBreak" &&
          !$from.nodeAfter
        ) {
          const pos = $from.after();
          editor
            .chain()
            .insertContentAt(pos, { type: "paragraph" })
            .setTextSelection(pos + 1)
            .deleteRange({
              from: $from.pos - 1,
              to: $from.pos,
            })
            .run();
          return true;
        } else {
          editor.commands.setHardBreak();
        }

        return true;
      },
    };
  },

  addNodeView() {
    return ({ node }) => {
      const dom = document.createElement("aside");
      dom.className = `msg ${node.attrs.type}`;

      const symbol = document.createElement("span");
      symbol.className = "msg-symbol";
      symbol.textContent = "!";
      dom.appendChild(symbol);

      const contentWrapper = document.createElement("div");
      contentWrapper.className = "msg-content";
      const content = document.createElement("p");
      content.className = "code-line";
      contentWrapper.appendChild(content);
      dom.appendChild(contentWrapper);

      return {
        dom,
        contentDOM: content,
      };
    };
  },
});
