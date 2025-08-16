import { mergeAttributes, Node } from "@tiptap/react";
import { sanitizeEmbedToken } from "../../../lib/embed";

export const EmbedJsfiddle = Node.create({
  name: "embedJsfiddle",
  group: "block",
  atom: true,

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
    return [{ tag: "p[data-embed-jsfiddle]", priority: 100 }];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      "p",
      mergeAttributes(HTMLAttributes, {
        "data-embed-jsfiddle": "",
      }),
    ];
  },

  addNodeView() {
    return ({ node }) => {
      const dom = document.createElement("p");

      let url = node.attrs.url || "";
      if (!url.includes("embed")) {
        url = url.endsWith("/") ? `${url}embedded/` : `${url}/embedded/`;
      }
      dom.innerHTML = `<span class="embed-block embed-jsfiddle"><iframe src="${sanitizeEmbedToken(
        url
      )}" scrolling="no" frameborder="no" loading="lazy"></iframe></span>`;

      return {
        dom,
      };
    };
  },
});
