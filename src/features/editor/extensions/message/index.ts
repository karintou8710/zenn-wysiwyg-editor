import { InputRule, Node } from "@tiptap/react";

export interface MessageOptions {
  type?: "message" | "alert";
}

export const Message = Node.create({
  name: "message",
  group: "block",
  content: "messageContent",
  defining: true,
  isolating: true,

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
      dom.appendChild(contentWrapper);

      return {
        dom,
        contentDOM: contentWrapper,
      };
    };
  },

  addInputRules() {
    return [
      new InputRule({
        find: /^:::(message|alert)\s$/,
        handler: ({ state, chain, range, match }) => {
          const type = match[1];
          const messageContentNode = state.schema.nodes.messageContent.create({
            messageContent: true,
          });

          const messageNode = this.type.create(
            { type: type },
            messageContentNode
          );

          chain()
            .deleteRange({
              from: range.from - 1,
              to: range.to + 1,
            })
            .insertContentAt(range.from - 1, messageNode)
            .run();
        },
      }),
    ];
  },
});
