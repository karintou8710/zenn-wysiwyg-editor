import { Node } from "@tiptap/react";

export const MessageContent = Node.create({
  name: "messageContent",
  content: "inline*",

  addAttributes() {
    return {
      messageContent: {
        default: true,
        parseHTML: (element) => {
          return element.hasAttribute("data-message-content");
        },
        renderHTML: ({ messageContent }) => {
          if (messageContent) {
            return {
              "data-message-content": "",
            };
          }
          return {};
        },
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: "p[data-message-content]",
        priority: 100, // 高い優先度で確実に認識されるようにする
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return ["p", HTMLAttributes, 0];
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
});
