import { InputRule, mergeAttributes, Node } from "@tiptap/react";
import { cn } from "@/lib/utils";
import { createMessageSymbolDecorationPlugin } from "./message-symbol-decoration-plugin";

export type MessageType = "message" | "alert";

export interface MessageOptions {
  type?: MessageType;
}

declare module "@tiptap/react" {
  interface Commands<ReturnType> {
    message: {
      setMessage: (attrs: { type: MessageType }) => ReturnType;
    };
  }
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
        class: cn("msg", {
          alert: node.attrs.type === "alert",
        }),
      }),
      0,
    ];
  },

  addCommands() {
    return {
      setMessage:
        ({ type }) =>
        ({ commands }) => {
          return commands.wrapIn(this.name, { type });
        },
    };
  },

  addInputRules() {
    return [
      new InputRule({
        find: /^:::(message|alert)\s$/,
        handler: ({ chain, range, match }) => {
          const type = match[1] as MessageType;

          chain().deleteRange(range).setMessage({ type }).run();
        },
      }),
    ];
  },

  addProseMirrorPlugins() {
    return [createMessageSymbolDecorationPlugin(this.name)];
  },
});
