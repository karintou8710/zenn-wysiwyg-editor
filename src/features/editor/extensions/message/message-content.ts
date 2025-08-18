import { mergeAttributes, Node } from "@tiptap/react";

export const MessageContent = Node.create({
  name: "messageContent",
  content: "block+",

  parseHTML() {
    return [
      {
        tag: "div.msg-content",
        priority: 100, // paragraph よりも先に評価する
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      "div",
      mergeAttributes(HTMLAttributes, {
        class: "msg-content",
      }),
      0,
    ];
  },
});
