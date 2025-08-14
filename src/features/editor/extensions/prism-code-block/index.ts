import { InputRule, Node } from "@tiptap/react";

export const PrismCodeBlock = Node.create({
  name: "codeBlock",
  group: "block",
  content: "codeFileName codeContent",

  parseHTML() {
    return [
      {
        tag: "div[data-code-block]",
        priority: 100,
      },
    ];
  },

  renderHTML() {
    return ["div", { "data-code-block": "", class: "code-block-container" }, 0];
  },

  addInputRules() {
    return [
      new InputRule({
        find: /^```([a-z]+)?[\s\n]$/,
        handler: ({ state, range, match, chain }) => {
          const codeFileName = state.schema.nodes.codeFileName.create();
          const codeContent = state.schema.nodes.codeContent.create();
          const codeBlock = state.schema.nodes.codeBlock.create(null, [
            codeFileName,
            codeContent,
          ]);

          chain()
            .deleteRange({
              from: range.from - 1,
              to: range.to + 1,
            })
            .insertContentAt(range.from - 1, codeBlock)
            .run();
        },
      }),
    ];
  },
});
