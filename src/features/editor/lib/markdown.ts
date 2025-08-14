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
    codeBlock(state, node) {
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
  },
  {
    link: {
      open() {
        return "[";
      },
      close(_, mark) {
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

export { markdownSerializer };
