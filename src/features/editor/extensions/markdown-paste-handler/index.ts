import { Plugin, PluginKey } from "@tiptap/pm/state";
import { Extension } from "@tiptap/react";
import { DOMParser } from "@tiptap/pm/model";
import markdownToHtml from "zenn-markdown-html";

export const MarkdownPasteHandler = Extension.create({
  name: "markdownPasteHandler",

  addProseMirrorPlugins() {
    return [
      new Plugin({
        key: new PluginKey("markdownPasteHandler"),
        props: {
          // @ts-ignore: 続行のためにundefinedを返しても問題ない
          clipboardTextParser: (text, _, __, view) => {
            const { state } = view;
            const { selection } = state;
            const { $from } = selection;

            // トップレベルparagraphの空選択の場合に、Zennマークダウン記法でHTMLにする
            if (!selection.empty) return;
            if ($from.depth !== 1) return;
            if ($from.node().type !== state.schema.nodes.paragraph) return;

            const wrapper = document.createElement("div");
            wrapper.innerHTML = markdownToHtml(text);
            const parser = DOMParser.fromSchema(state.schema);
            const slice = parser.parseSlice(wrapper);

            return slice;
          },
        },
      }),
    ];
  },
});
