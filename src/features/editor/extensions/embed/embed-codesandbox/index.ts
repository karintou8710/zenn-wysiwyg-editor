import { mergeAttributes, Node } from "@tiptap/react";
import { sanitizeEmbedToken } from "../../../lib/embed";

export const EmbedCodesandbox = Node.create({
  name: "embedCodesandbox",
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
    return [{ tag: "p[data-embed-codesandbox]", priority: 100 }];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      "p",
      mergeAttributes(HTMLAttributes, {
        "data-embed-codesandbox": "",
      }),
    ];
  },

  addNodeView() {
    return ({ node }) => {
      const dom = document.createElement("p");
      dom.className = "embed-codesandbox";

      dom.innerHTML = `<span class="embed-block embed-codesandbox"><iframe src="${sanitizeEmbedToken(
        node.attrs.url || ""
      )}" style="width:100%;height:500px;border:none;overflow:hidden;" allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking" loading="lazy" sandbox="allow-modals allow-forms allow-popups allow-scripts allow-same-origin"></iframe></span>`;

      return {
        dom,
      };
    };
  },
});
