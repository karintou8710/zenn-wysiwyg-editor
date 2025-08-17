import markdownIt from "markdown-it";
import { sanitize } from "./sanitizer";
import { embedGenerators } from "./embed";
import { MarkdownOptions } from "./types";

// plugis
import markdownItImSize from "@steelydylan/markdown-it-imsize";
import markdownItAnchor from "markdown-it-anchor";
import { mdBr } from "./utils/md-br";
import { mdKatex } from "./utils/md-katex";
import { mdCustomBlock } from "./utils/md-custom-block";
import { mdLinkAttributes } from "./utils/md-link-attributes";
import { mdSourceMap } from "./utils/md-source-map";
import { mdLinkifyToCard } from "./utils/md-linkify-to-card";
import { mdRendererFence } from "./utils/md-renderer-fence";
import { mdImage } from "./utils/md-image";
import {
  containerDetailsOptions,
  containerMessageOptions,
} from "./utils/md-container";
import mdContainer from "markdown-it-container";
import mdFootnote from "markdown-it-footnote";
import mdTaskLists from "markdown-it-task-lists";
import mdInlineComments from "markdown-it-inline-comments";

const markdownToHtml = (text: string, options?: MarkdownOptions): string => {
  if (!(text && text.length)) return "";

  const markdownOptions: MarkdownOptions = {
    ...options,
    customEmbed: {
      ...embedGenerators,
      ...options?.customEmbed,
    },
  };

  const md = markdownIt({ breaks: true, linkify: true });

  md.linkify.set({ fuzzyLink: false });
  md.linkify.set({ fuzzyEmail: false }); // refs: https://github.com/markdown-it/linkify-it

  md.use(mdBr)
    .use(mdKatex)
    .use(mdFootnote)
    .use(mdInlineComments)
    .use(markdownItImSize)
    .use(mdLinkAttributes)
    .use(mdCustomBlock, markdownOptions)
    .use(mdRendererFence, markdownOptions)
    .use(mdLinkifyToCard, markdownOptions)
    .use(mdTaskLists, { enabled: true })
    .use(mdContainer, "details", containerDetailsOptions)
    .use(mdContainer, "message", containerMessageOptions)
    .use(markdownItAnchor, {
      level: [1, 2, 3, 4],
      permalink: markdownItAnchor.permalink.ariaHidden({
        placement: "before",
        class: "header-anchor-link",
        symbol: "",
      }),
      tabIndex: false,
    })
    .use(mdSourceMap)
    .use(mdImage);

  // custom footnote
  md.renderer.rules.footnote_block_open = () =>
    '<section class="footnotes">\n' +
    '<span class="footnotes-title">脚注</span>\n' +
    '<ol class="footnotes-list">\n';

  return sanitize(md.render(text));
};

export default markdownToHtml;
export { markdownToSimpleHtml } from "./markdown-to-simple-html";
