import { mergeAttributes, Node } from "@tiptap/react";
import { generateEmbedServerIframe } from "../../lib/embed";
import { EMBED_ORIGIN } from "../../lib/constants";

export const EmbedTweet = Node.create({
  name: "embedTweet",
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
    return [{ tag: "p[data-embed-tweet]", priority: 100 }];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      "p",
      mergeAttributes(HTMLAttributes, {
        "data-embed-tweet": "",
      }),
    ];
  },

  addNodeView() {
    return ({ node }) => {
      const dom = document.createElement("p");
      dom.innerHTML = generateEmbedServerIframe(
        "tweet",
        node.attrs.url || "",
        EMBED_ORIGIN
      );

      return {
        dom,
      };
    };
  },
});
