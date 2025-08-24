import { Node } from "@tiptap/react";
import { escapeHtml } from "../../lib/escape";
import { extractSpeakerDeckEmbedParams } from "../../lib/url";

export const SpeakerDeckEmbed = Node.create({
  name: "spckedDeckEmbed",
  group: "block",
  atom: true,
  marks: "",

  addAttributes() {
    return {
      embedId: {
        default: null,
        rendered: false,
      },
      slideIndex: {
        default: null,
        rendered: false,
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: "span.embed-block",
        priority: 100,
        getAttrs: (element) => {
          const iframe = element.querySelector("iframe");
          if (!iframe) return false;
          const src = iframe.getAttribute("src");
          if (!src) return false;

          const decodedUrl = decodeURIComponent(src);

          const embedParams = extractSpeakerDeckEmbedParams(decodedUrl);
          console.log(embedParams);
          if (!embedParams) return false;

          return {
            embedId: embedParams.embedId,
            slideIndex: embedParams.slideIndex,
          };
        },
      },
    ];
  },

  renderHTML({ node }) {
    return [
      "span",
      {
        class: "embed-block embed-jsfiddle",
      },
      [
        "iframe",
        {
          src: `https://speakerdeck.com/player/${escapeHtml(node.attrs.embedId)}?slide=${escapeHtml(node.attrs.slideIndex || "1")}`,
          scrolling: "no",
          allowfullscreen: true,
          loading: "lazy",
          allow: "encrypted-media",
        },
      ],
    ];
  },
});
