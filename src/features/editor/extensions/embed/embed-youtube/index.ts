import { mergeAttributes, Node } from "@tiptap/react";
import { extractYoutubeVideoParameters } from "@/features/editor/lib/url";
import { escapeHtml } from "@/features/editor/lib/escape";

export const EmbedYoutube = Node.create({
  name: "embedYoutube",
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
    return [{ tag: "p[data-embed-youtube]", priority: 100 }];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      "p",
      mergeAttributes(HTMLAttributes, {
        "data-embed-youtube": "",
      }),
    ];
  },

  addNodeView() {
    return ({ node }) => {
      const dom = document.createElement("p");

      const url = node.attrs.url || "";
      const params = extractYoutubeVideoParameters(url) || {
        videoId: url,
        start: null,
      };

      const escapedVideoId = escapeHtml(params.videoId);
      const time = Math.min(Number(params.start || 0), 48 * 60 * 60); // 48時間以内
      const startQuery = time ? `?start=${time}` : "";

      dom.innerHTML = `<span class="embed-block embed-youtube"><iframe src="https://www.youtube-nocookie.com/embed/${escapedVideoId}${startQuery}" allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen loading="lazy"></iframe></span>`;

      return {
        dom,
      };
    };
  },
});
