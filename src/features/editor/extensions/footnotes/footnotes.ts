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
        filterTransaction(tr) {
          const { from, to } = tr.selection;

          // 全選択の場合は許可
          if (from === 0 && to === tr.doc.content.size) return true;

          let selectedFootnotes = false;
          let selectedContent = false;
          let footnoteCount = 0;

          tr.doc.nodesBetween(from, to, (node, _, parent) => {
            if (parent?.type.name === "doc" && node.type.name !== "footnotes") {
              selectedContent = true;
            } else if (node.type.name === "footnoteItem") {
              footnoteCount += 1;
            } else if (node.type.name === "footnotes") {
              selectedFootnotes = true;
            }
          });
          const overSelected = selectedContent && selectedFootnotes;

          // コンテンツと脚注を跨ぐ or 脚注アイテムを跨ぐ トランザクションは不可
          return !overSelected && footnoteCount <= 1;
        },

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
