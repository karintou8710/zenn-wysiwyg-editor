import { Plugin, PluginKey } from "@tiptap/pm/state";
import { Decoration, DecorationSet } from "@tiptap/pm/view";
import { InputRule, mergeAttributes, Node } from "@tiptap/react";

export interface MessageOptions {
  type?: "message" | "alert";
}

export const Message = Node.create({
  name: "message",
  group: "block",
  content: "messageContent",

  addAttributes() {
    return {
      type: {
        default: "message",
        rendered: false,
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: "aside.msg",
        getAttrs: (element) => {
          return {
            type: element.classList.contains("alert") ? "alert" : "message",
          };
        },
      },
    ];
  },

  renderHTML({ node, HTMLAttributes }) {
    return [
      "aside",
      mergeAttributes(HTMLAttributes, {
        class: `msg ${node.attrs.type === "alert" ? "alert" : ""}`,
      }),
      0,
    ];
  },

  addInputRules() {
    return [
      new InputRule({
        find: /^:::(message|alert)\s$/,
        handler: ({ state, commands, range, match }) => {
          const type = match[1];
          const messageNode = this.type.createAndFill({ type: type });

          const $from = state.doc.resolve(range.from);
          commands.insertContentAt(
            {
              from: $from.before(),
              to: $from.after(),
            },
            messageNode,
          );
        },
      }),
    ];
  },

  addProseMirrorPlugins() {
    return [
      new Plugin({
        key: new PluginKey("messageSymbolDecoration"),
        props: {
          decorations: (state) => {
            // TODO: トランザクションの度に再実行されてるので、パフォーマンス改善の余地あり
            const { doc } = state;
            const decorations: Decoration[] = [];

            doc.descendants((node, pos) => {
              if (node.type.name === this.name) {
                decorations.push(
                  Decoration.widget(pos + 1, () => {
                    const element = document.createElement("span");
                    element.className = "msg-symbol";
                    element.textContent = "!";
                    return element;
                  }),
                );
              }
            });

            return DecorationSet.create(doc, decorations);
          },
        },
      }),
    ];
  },
});
