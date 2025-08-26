import { InputRule, mergeAttributes, Node } from "@tiptap/react";
import { createMessageSymbolDecorationPlugin } from "./message-symbol-decoration-plugin";

export interface MessageOptions {
  type?: "message" | "alert";
}

export const Message = Node.create({
  name: "message",
  group: "block",
  content: "messageContent",
  isolating: true,

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
    return [createMessageSymbolDecorationPlugin(this.name)];
  },
});
