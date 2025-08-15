import { mergeAttributes, Node } from "@tiptap/react";
import { generateEmbedServerIframe } from "../../lib/embed";
import { EMBED_ORIGIN } from "../../lib/constants";

export const EmbedGithub = Node.create({
  name: "embedGithub",
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
    return [{ tag: "p[data-embed-github]", priority: 100 }];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      "p",
      mergeAttributes(HTMLAttributes, {
        "data-embed-github": "",
      }),
    ];
  },

  addNodeView() {
    return ({ node }) => {
      const dom = document.createElement("p");
      dom.innerHTML = generateEmbedServerIframe(
        "github",
        node.attrs.url || "",
        EMBED_ORIGIN
      );

      return {
        dom,
      };
    };
  },
});
