import { mergeAttributes, Node } from "@tiptap/react";
import { sanitizeEmbedToken } from "../../../lib/embed";

export const EmbedCodepen = Node.create({
  name: "embedCodepen",
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
    return [{ tag: "p[data-embed-codepen]", priority: 100 }];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      "p",
      mergeAttributes(HTMLAttributes, {
        "data-embed-codepen": "",
      }),
    ];
  },

  addNodeView() {
    return ({ node }) => {
      const dom = document.createElement("p");

      const url = node.attrs.url || "";
      const embedUrl = new URL(url.replace("/pen/", "/embed/"));
      embedUrl.searchParams.set("embed-version", "2");
      dom.innerHTML = `<span class="embed-block embed-codepen"><iframe src="${sanitizeEmbedToken(
        embedUrl.toString()
      )}" scrolling="no" frameborder="no" loading="lazy"></iframe></span>`;

      return {
        dom,
      };
    };
  },
});
