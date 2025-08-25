import { Plugin, PluginKey } from "@tiptap/pm/state";
import { Node } from "@tiptap/react";
import { isFootnoteRefChanged, updateFootnotes } from "./utils";

const Footnotes = Node.create({
  name: "footnotes",
  content: "footnoteItem+",
  isolating: true,
  defining: true,
  draggable: false,

  parseHTML() {
    return [
      {
        tag: "section.footnotes",
      },
    ];
  },

  renderHTML() {
    return [
      "section",
      { class: "footnotes" },
      [
        "span",
        {
          class: "footnotes-title",
          contenteditable: "false",
        },
        "脚注",
      ],
      ["ol", { class: "footnotes-list" }, 0],
    ];
  },

  addProseMirrorPlugins() {
    return [
      new Plugin({
        key: new PluginKey("footnoteRules"),

        // 脚注参照が追加・削除・移動時に、脚注関連を更新する
        appendTransaction(transactions, _, newState) {
          const newTr = newState.tr;

          if (isFootnoteRefChanged(transactions)) {
            updateFootnotes(newTr, newState);
            return newTr;
          }

          return null;
        },
      }),
    ];
  },
});

export default Footnotes;
