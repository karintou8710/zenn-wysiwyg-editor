import { EMBED_ORIGIN } from "@/features/editor/lib/constants";
import { Node } from "@tiptap/react";

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
    return [
      {
        tag: "p > span.zenn-embedded-card",
        priority: 100,
        getAttrs: (element) => {
          const iframe = element.querySelector("iframe");
          if (!iframe) return false;
          const url = iframe.getAttribute("data-content");
          if (!url) return false;

          return { url: decodeURIComponent(url) };
        },
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    const id = `zenn-embedded__${Math.random().toString(16).slice(2)}`;
    const iframeSrc = `${EMBED_ORIGIN}/card#${id}`;
    const encodedSrc = encodeURIComponent(HTMLAttributes["data-url"]);

    return [
      "p",
      [
        "span",
        {
          class: "embed-block zenn-embedded zenn-embedded-card",
        },
        [
          "iframe",
          {
            id: id,
            src: iframeSrc,
            frameborder: "0",
            scrolling: "no",
            loading: "lazy",
            "data-content": encodedSrc,
          },
        ],
      ],
    ];
  },
});
