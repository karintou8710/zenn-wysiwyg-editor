import { getEmbedTypeFromElement } from "@/features/editor/lib/embed";
import { Node } from "@tiptap/react";
import { generateEmbedOutputSpec } from "./generateEmbedOutputSpec";

export const Embed = Node.create({
  name: "embed",
  group: "block",
  atom: true,
  marks: "",

  addAttributes() {
    return {
      url: {
        default: null,
        rendered: false,
      },
      type: {
        default: null,
        rendered: false,
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: "p > span.zenn-embedded",
        priority: 100,
        getAttrs: (element) => {
          const iframe = element.querySelector("iframe");
          if (!iframe) return false;
          const dataContent = iframe.getAttribute("data-content");
          const src = iframe.getAttribute("src");
          if (!dataContent || !src) return false;

          const url = decodeURIComponent(dataContent || src);

          const type = getEmbedTypeFromElement(element);
          if (!type) return false;
          return {
            url: url,
            type: type,
          };
        },
      },
    ];
  },

  renderHTML({ node }) {
    return generateEmbedOutputSpec(node.attrs.type, node.attrs.url);
  },
});
