import { Fragment, Slice } from "@tiptap/pm/model";
import { Plugin, PluginKey } from "@tiptap/pm/state";
import { Node } from "@tiptap/react";

export const DiffCodeLine = Node.create({
  name: "diffCodeLine",
  content: "text*",
  marks: "",
  code: true,

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
              this.editor.state.schema.nodes.paragraph.create(),
            );

            return true;
          })
          .setTextSelection($from.before(-2) + 1)
          .run();
        return true;
      },

      // exit node on triple enter
      Enter: ({ editor }) => {
        return editor.commands.first(({ chain }) => [
          () => {
            const { state } = editor;
            const { selection } = state;
            const { $from, empty } = selection;

            if (!empty || $from.parent.type !== this.type) {
              return false;
            }

            const codeBlock = $from.node(-1);
            const isAtLineEnd =
              $from.parentOffset === $from.parent.nodeSize - 2;
            const isAtRowEnd = $from.index(-1) === codeBlock.childCount - 1;
            const endsWithDoubleNewline =
              codeBlock.childCount >= 2 &&
              codeBlock.child(codeBlock.childCount - 1).childCount === 0 &&
              codeBlock.child(codeBlock.childCount - 2).childCount === 0;

            if (!isAtLineEnd || !isAtRowEnd || !endsWithDoubleNewline) {
              return false;
            }

            return chain()
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
          ({ commands }) => {
            const { state } = editor;
            const { selection } = state;
            const { $from } = selection;

            if ($from.parent.type !== this.type) {
              return false;
            }

            // コードブロックだと<br/>が挿入されるので、先に改行で分割する
            return commands.splitBlock();
          },
        ]);
      },
    };
  },

  addProseMirrorPlugins() {
    return [
      new Plugin({
        key: new PluginKey("diffCodeLine"),
        props: {
          handlePaste: (view, event) => {
            const { $from, $to } = view.state.selection;

            if ($from.node().type.name !== this.name) return false;

            const text = event.clipboardData?.getData("text/plain");
            if (!text) return false;

            const tr = view.state.tr;
            const nodes = text
              .split("\n")
              .map((line) =>
                this.type.createAndFill(
                  null,
                  line ? [view.state.schema.text(line)] : [],
                ),
              )
              .filter((node) => node !== null);

            const fragment = Fragment.fromArray(nodes);
            const slice = new Slice(fragment, 1, 1);

            tr.replace($from.pos, $to.pos, slice);
            view.dispatch(tr);

            return true;
          },
          // @ts-expect-error: undefinedを返すことを許容, 別のプラグインに処理を移す
          clipboardTextSerializer: (slice, view) => {
            const { state } = view;
            const { $from, $to } = state.selection;

            if (
              $from.node().type.name !== this.name ||
              $to.node().type.name !== this.name
            )
              return;

            const text = slice.content.textBetween(0, slice.content.size, "\n");

            return text;
          },
        },
      }),
    ];
  },
});
