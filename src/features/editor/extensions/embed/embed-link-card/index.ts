import { mergeAttributes, Node } from "@tiptap/react";
import { generateEmbedServerIframe } from "../../../lib/embed";
import { EMBED_ORIGIN } from "../../../lib/constants";

export const EmbedLinkCard = Node.create({
  name: "embedLinkCard",
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
    return [{ tag: "p[data-embed-link-card]", priority: 100 }];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      "p",
      mergeAttributes(HTMLAttributes, {
        "data-embed-link-card": "",
      }),
    ];
  },

  addNodeView() {
    return ({ node }) => {
      const dom = document.createElement("p");
      dom.innerHTML = generateEmbedServerIframe(
        "card",
        node.attrs.url || "",
        EMBED_ORIGIN
      );

      return {
        dom,
      };
    };
  },
});
