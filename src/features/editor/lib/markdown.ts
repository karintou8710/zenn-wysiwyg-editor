import type { Mark, Node } from "@tiptap/pm/model";
import { MarkdownSerializer } from "prosemirror-markdown";

const markdownSerializer = new MarkdownSerializer(
  {
    paragraph(state, node) {
      state.renderInline(node);
      state.closeBlock(node);
    },
    heading(state, node) {
      state.write(state.repeat("#", node.attrs.level) + " ");
      state.renderInline(node, false);
      state.closeBlock(node);
    },
    bulletList(state, node) {
      state.renderList(node, "  ", () => "- ");
    },
    orderedList(state, node) {
      state.renderList(node, "  ", (i) => `${i + 1}. `);
    },
    listItem(state, node) {
      state.renderContent(node);
    },
    text(state, node) {
      state.text(node.text!);
    },
    blockquote(state, node) {
      state.wrapBlock("> ", null, node, () => state.renderContent(node));
    },
    horizontalRule(state, node) {
      state.write(node.attrs.markup || "---");
      state.closeBlock(node);
    },
    message(state, node) {
      const type = node.attrs.type === "message" ? "" : node.attrs.type;
      state.write(`:::message ${type}\n`);
      state.renderContent(node);
      state.write("\n:::");
      state.closeBlock(node);
    },
    messageContent(state, node) {
      state.renderInline(node);
    },
    hardBreak(state) {
      state.write("\n");
    },
    codeBlockContainer(state, node) {
      const fileName = node.firstChild!.textContent;
      const contentNode = node.lastChild!;

      const backticks = contentNode.textContent.match(/`{3,}/gm);
      const fence = backticks ? backticks.sort().slice(-1)[0] + "`" : "```";
      const isDiff = contentNode.attrs.language?.startsWith("diff-");
      const language =
        contentNode.attrs.language?.replace("diff-", "") || "plaintext";

      state.write(
        fence +
          (isDiff ? "diff " : "") +
          language +
          (fileName ? `:${fileName}` : "") +
          "\n"
      );
      state.text(contentNode!.textContent, false);
      state.write("\n");
      state.write(fence);
      state.closeBlock(node);
    },
    figure(state, node) {
      const src = node.firstChild?.attrs.src || "";
      const alt = node.firstChild?.attrs.alt || "";
      const caption = node.lastChild?.textContent || "";
      state.write(`![${alt}](${src})`);
      if (caption) {
        state.write(`\n*${caption}*`);
      }
      state.closeBlock(node);
    },
    embedLinkCard(state, node) {
      const url = node.attrs.url || "";
      state.write(url);
      state.closeBlock(node);
    },
    embedGithub(state, node) {
      const url = node.attrs.url || "";
      state.write(url);
      state.closeBlock(node);
    },
    embedTweet(state, node) {
      const url = node.attrs.url || "";
      state.write(url);
      state.closeBlock(node);
    },
    embedYoutube(state, node) {
      const url = node.attrs.url || "";
      state.write(url);
      state.closeBlock(node);
    },

    embedGist(state, node) {
      const url = node.attrs.url || "";
      state.write(`@[gist](${url})`);
      state.closeBlock(node);
    },
    embedCodepen(state, node) {
      const url = node.attrs.url || "";
      state.write(`@[codepen](${url})`);
      state.closeBlock(node);
    },
    embedCodesandbox(state, node) {
      const url = node.attrs.url || "";
      state.write(`@[codesandbox](${url})`);
      state.closeBlock(node);
    },
    embedJsfiddle(state, node) {
      const url = node.attrs.url || "";
      state.write(`@[jsfiddle](${url})`);
      state.closeBlock(node);
    },
    embedStackblitz(state, node) {
      const url = node.attrs.url || "";
      state.write(`@[stackblitz](${url})`);
      state.closeBlock(node);
    },
  },
  {
    link: {
      open(state, mark, parent, index) {
        // @ts-ignore
        state.inAutolink = isPlainURL(mark, parent, index);
        // @ts-ignore
        if (state.inAutolink) return "";
        return "[";
      },
      close(state, mark) {
        // @ts-ignore
        let { inAutolink } = state;
        // @ts-ignore
        state.inAutolink = undefined;

        if (inAutolink) return "";

        return (
          "](" +
          mark.attrs.href.replace(/[\(\)"]/g, "\\$&") +
          (mark.attrs.title
            ? ` "${mark.attrs.title.replace(/"/g, '\\"')}"`
            : "") +
          ")"
        );
      },
      mixable: true,
    },
    bold: {
      open: "**",
      close: "**",
      mixable: true,
      expelEnclosingWhitespace: true,
    },
    code: {
      open: "`",
      close: "`",
      escape: false,
    },
    italic: {
      open: "*",
      close: "*",
      mixable: true,
      expelEnclosingWhitespace: true,
    },
    strike: {
      open: "~~",
      close: "~~",
      mixable: true,
      expelEnclosingWhitespace: true,
    },
  }
);

function isPlainURL(link: Mark, parent: Node, index: number) {
  if (link.attrs.title || !/^\w+:/.test(link.attrs.href)) return false;
  let content = parent.child(index);
  if (
    !content.isText ||
    content.text != link.attrs.href ||
    content.marks[content.marks.length - 1] != link
  )
    return false;
  return (
    index == parent.childCount - 1 ||
    !link.isInSet(parent.child(index + 1).marks)
  );
}

export { markdownSerializer };
