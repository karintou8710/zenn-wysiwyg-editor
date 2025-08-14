import { mergeAttributes, Node } from "@tiptap/react";

export interface CaptionOptions {
  HTMLAttributes: Record<string, any>;
}

export const Caption = Node.create<CaptionOptions>({
  name: "caption",
  group: "block",
  content: "inline*",
  defining: true,

  addOptions() {
    return {
      HTMLAttributes: {},
    };
  },

  addAttributes() {
    return {
      caption: {
        default: true,
        parseHTML: (element) => element.hasAttribute("data-caption"),
        renderHTML: ({ caption }) => {
          return {
            "data-caption": caption || false,
          };
        },
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: "em[data-caption]",
        priority: 100,
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      "em",
      mergeAttributes(this.options.HTMLAttributes, HTMLAttributes),
      0,
    ];
  },

  addKeyboardShortcuts() {
    return {
      Backspace: ({ editor }) => {
        const { selection } = editor.state;
        const { $from } = selection;

        if (
          !selection.empty ||
          $from.node().type.name !== this.name ||
          $from.start() !== $from.pos
        ) {
          return false;
        }

        // 親のfigureを削除
        editor.commands.deleteRange({
          from: $from.before(-1),
          to: $from.after(-1),
        });

        return true;
      },
      Enter: ({ editor }) => {
        const { $from } = editor.state.selection;

        if ($from.node().type.name !== this.name) {
          return false;
        }

        return editor.commands.insertContentAt($from.after(-1), {
          type: "paragraph",
        });
      },
    };
  },
});
