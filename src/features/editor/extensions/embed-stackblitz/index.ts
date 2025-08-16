import { mergeAttributes, Node } from "@tiptap/react";
import { sanitizeEmbedToken } from "../../lib/embed";

export const EmbedStackblitz = Node.create({
  name: "embedStackblitz",
  group: "block",
  atom: true,
  marks: "",

  addAttributes() {
    return {
      url: {
        default: null,
        parseHTML: (element) => element.getAttribute("data-url"),
        renderHTML: ({ url }) => ({ "data-url": url }),
      },
    };
  },

  parseHTML() {
    return [{ tag: "p[data-embed-stackblitz]", priority: 100 }];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      "p",
      mergeAttributes(HTMLAttributes, {
        "data-embed-stackblitz": "",
      }),
    ];
  },

  addNodeView() {
    return ({ node }) => {
      const dom = document.createElement("p");

      dom.innerHTML = `<span class="embed-block embed-stackblitz"><iframe src="${sanitizeEmbedToken(
        node.attrs.url || ""
      )}" scrolling="no" frameborder="no" loading="lazy"></iframe></span>`;

      return {
        dom,
      };
    };
  },
});
