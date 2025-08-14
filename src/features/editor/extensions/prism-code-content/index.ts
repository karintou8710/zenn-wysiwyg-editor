import { mergeAttributes, Node } from "@tiptap/react";
import { Plugin, PluginKey, Selection, TextSelection } from "@tiptap/pm/state";
import { PrismPlugin } from "./prism-plugin";

// カスタマイズのため、TiptapのBlockquoteを直接編集する
// https://github.com/ueberdosis/tiptap/blob/main/packages/extension-code-block/src/code-block.ts

export interface CodeBlockOptions {
  languageClassPrefix: string;
  exitOnTripleEnter: boolean;
  exitOnArrowDown: boolean;
  defaultLanguage: string;
  HTMLAttributes: Record<string, any>;
}

export const PrismCodeContent = Node.create<CodeBlockOptions>({
  name: "codeContent",

  addOptions() {
    return {
      languageClassPrefix: "language-",
      exitOnTripleEnter: true,
      exitOnArrowDown: true,
      defaultLanguage: "plaintext",
      HTMLAttributes: {},
    };
  },

  content: "text*",
  marks: "",
  code: true,
  defining: true,

  addAttributes() {
    return {
      language: {
        default: this.options.defaultLanguage,
        parseHTML: (element) => {
          const { languageClassPrefix } = this.options;
          const classNames = [...(element.firstElementChild?.classList || [])];
          const languages = classNames
            .filter((className) => className.startsWith(languageClassPrefix))
            .map((className) => className.replace(languageClassPrefix, ""));
          const language = languages[0];

          if (!language) {
            return null;
          }

          return language;
        },
        rendered: false,
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: "pre",
        preserveWhitespace: "full",
      },
    ];
  },

  renderHTML({ node, HTMLAttributes }) {
    return [
      "pre",
      mergeAttributes(this.options.HTMLAttributes, HTMLAttributes, {
        "data-language": node.attrs.language,
      }),
      [
        "code",
        {
          class: node.attrs.language
            ? this.options.languageClassPrefix + node.attrs.language
            : null,
        },
        0,
      ],
    ];
  },

  addKeyboardShortcuts() {
    return {
      Backspace: () => {
        const { selection } = this.editor.state;
        const { $from } = selection;

        if ($from.node().type.name !== this.name) return false;

        if (!selection.empty || $from.start() !== $from.pos) return false;

        if ($from.node(-1).type !== this.editor.state.schema.nodes.codeBlock) {
          // ファイル名なし
          return this.editor.commands.clearNodes();
        }

        const text = $from.node().textContent;
        // codeBlock全体を削除する
        this.editor
          .chain()
          .command(({ tr }) => {
            tr.replaceRangeWith(
              $from.before(-1),
              $from.after(-1),
              this.editor.state.schema.nodes.paragraph.create(
                null,
                text ? [this.editor.state.schema.text(text)] : []
              )
            );

            return true;
          })
          .setTextSelection($from.before(-1) + 1)
          .run();
        return true;
      },

      // exit node on triple enter
      Enter: ({ editor }) => {
        if (!this.options.exitOnTripleEnter) {
          return false;
        }

        const { state } = editor;
        const { selection } = state;
        const { $from, empty } = selection;

        if (!empty || $from.parent.type !== this.type) {
          return false;
        }

        const isAtEnd = $from.parentOffset === $from.parent.nodeSize - 2;
        const endsWithDoubleNewline = $from.parent.textContent.endsWith("\n\n");

        if (!isAtEnd || !endsWithDoubleNewline) {
          return false;
        }

        return editor
          .chain()
          .insertContentAt($from.pos + 2, {
            type: "paragraph",
          })
          .setTextSelection($from.pos + 2)
          .command(({ tr }) => {
            tr.delete($from.pos - 2, $from.pos);

            return true;
          })
          .run();
      },

      // exit node on arrow down
      ArrowDown: ({ editor }) => {
        if (!this.options.exitOnArrowDown) {
          return false;
        }

        const { state } = editor;
        const { selection, doc } = state;
        const { $from, empty } = selection;

        if (!empty || $from.parent.type !== this.type) {
          return false;
        }

        const isAtEnd = $from.parentOffset === $from.parent.nodeSize - 2;

        if (!isAtEnd) {
          return false;
        }

        const after = $from.after();

        if (after === undefined) {
          return false;
        }

        const nodeAfter = doc.nodeAt(after);

        if (nodeAfter) {
          return editor.commands.command(({ tr }) => {
            tr.setSelection(Selection.near(doc.resolve(after)));
            return true;
          });
        }

        return editor.commands.exitCode();
      },
    };
  },

  addProseMirrorPlugins() {
    return [
      PrismPlugin({
        name: this.name,
        defaultLanguage: this.options.defaultLanguage,
      }),
      new Plugin({
        key: new PluginKey("codeBlockVSCodeHandler"),
        props: {
          handlePaste: (view, event) => {
            if (!event.clipboardData) {
              return false;
            }

            // don’t create a new code block within code blocks
            if (this.editor.isActive(this.type.name)) {
              return false;
            }

            const text = event.clipboardData.getData("text/plain");
            const vscode = event.clipboardData.getData("vscode-editor-data");
            const vscodeData = vscode ? JSON.parse(vscode) : undefined;
            const language = vscodeData?.mode;

            if (!text || !language) {
              return false;
            }

            const { tr, schema } = view.state;

            // prepare a text node
            // strip carriage return chars from text pasted as code
            // see: https://github.com/ProseMirror/prosemirror-view/commit/a50a6bcceb4ce52ac8fcc6162488d8875613aacd
            const textNode = schema.text(text.replace(/\r\n?/g, "\n"));

            // create a code block with the text node
            // replace selection with the code block
            tr.replaceSelectionWith(this.type.create({ language }, textNode));

            if (tr.selection.$from.parent.type !== this.type) {
              // put cursor inside the newly created code block
              tr.setSelection(
                TextSelection.near(
                  tr.doc.resolve(Math.max(0, tr.selection.from - 2))
                )
              );
            }

            // store meta information
            // this is useful for other plugins that depends on the paste event
            // like the paste rule plugin
            tr.setMeta("paste", true);

            view.dispatch(tr);

            return true;
          },
        },
      }),
    ];
  },
});
