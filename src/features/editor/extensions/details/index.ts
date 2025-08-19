import { InputRule, mergeAttributes, Node } from "@tiptap/react";

export const Details = Node.create({
  name: "details",

  content: "detailsSummary detailsContent",
  group: "block",
  defining: true,
  isolating: true,

  addAttributes() {
    return {
      open: {
        default: false,
        parseHTML: (element) => element.hasAttribute("open"),
        renderHTML: ({ open }) => {
          if (!open) {
            return {};
          }

          return { open: "" };
        },
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: "details",
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      "details",
      mergeAttributes(this.options.HTMLAttributes, HTMLAttributes),
      0,
    ];
  },

  addNodeView() {
    return ({ node }) => {
      const dom = document.createElement("div");
      dom.className = "details";

      if (node.attrs.open) {
        dom.setAttribute("data-open", "");
      }

      return {
        dom,
        contentDOM: dom,
      };
    };
  },

  addInputRules() {
    return [
      new InputRule({
        find: /^:::details\s$/,
        handler: ({ state, range, commands }) => {
          const detailsNode = this.type.createAndFill({
            open: false,
          });

          const $from = state.doc.resolve(range.from);

          commands.insertContentAt(
            { from: $from.before(), to: $from.after() },
            detailsNode,
          );
        },
      }),
    ];
  },
});
