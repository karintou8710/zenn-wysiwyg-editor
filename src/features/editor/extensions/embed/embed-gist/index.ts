import { mergeAttributes, Node } from "@tiptap/react";
import { generateEmbedServerIframe } from "../../../lib/embed";
import { EMBED_ORIGIN } from "../../../lib/constants";

export const EmbedGist = Node.create({
  name: "embedGist",
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
    return [{ tag: "p[data-embed-gist]", priority: 100 }];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      "p",
      mergeAttributes(HTMLAttributes, {
        "data-embed-gist": "",
      }),
    ];
  },

  addNodeView() {
    return ({ node }) => {
      const dom = document.createElement("p");
      dom.innerHTML = generateEmbedServerIframe(
        "gist",
        node.attrs.url || "",
        EMBED_ORIGIN
      );

      return {
        dom,
      };
    };
  },
});
