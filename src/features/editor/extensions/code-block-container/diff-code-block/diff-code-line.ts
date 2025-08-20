import { Node } from "@tiptap/react";

export const DiffCodeLine = Node.create({
  name: "diffCodeLine",
  content: "text*",
  marks: "",

  parseHTML() {
    return [
      {
        tag: ".diff-highlight > span",
        priority: 100,
      },
    ];
  },

  renderHTML() {
    return ["span", 0];
  },

  addKeyboardShortcuts() {
    return {
      Backspace: () => {
        const { selection } = this.editor.state;
        const { $from } = selection;

        if ($from.node().type.name !== this.name) return false;
        if (!selection.empty) return false;

        if (!($from.index(-1) === 0 && $from.start() === $from.pos))
          return false;

        // codeBlock全体を削除する
        this.editor
          .chain()
          .command(({ tr }) => {
            tr.replaceRangeWith(
              $from.before(-2),
              $from.after(-2),
              this.editor.state.schema.nodes.paragraph.create()
            );

            return true;
          })
          .setTextSelection($from.before(-2) + 1)
          .run();
        return true;
      },

      // exit node on triple enter
      Enter: ({ editor }) => {
        const { state } = editor;
        const { selection } = state;
        const { $from, empty } = selection;

        if (!empty || $from.parent.type !== this.type) {
          return false;
        }

        const codeBlock = $from.node(-1);
        const isAtLineEnd = $from.parentOffset === $from.parent.nodeSize - 2;
        const isAtRowEnd = $from.index(-1) === codeBlock.childCount - 1;
        const endsWithDoubleNewline =
          codeBlock.childCount >= 2 &&
          codeBlock.child(codeBlock.childCount - 1).childCount === 0 &&
          codeBlock.child(codeBlock.childCount - 2).childCount === 0;

        if (!isAtLineEnd || !isAtRowEnd || !endsWithDoubleNewline) {
          return false;
        }

        return editor
          .chain()
          .insertContentAt($from.pos + 3, {
            type: "paragraph",
          })
          .setTextSelection($from.pos + 3)
          .command(({ tr }) => {
            tr.delete($from.pos - 3, $from.pos);

            return true;
          })
          .run();
      },
    };
  },
});
