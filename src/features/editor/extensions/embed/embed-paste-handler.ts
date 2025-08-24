import { Plugin, PluginKey } from "@tiptap/pm/state";

import { Extension } from "@tiptap/react";
import { getEmbedTypeFromUrl } from "../../lib/embed";

export const EmbedPasteHandler = Extension.create({
  name: "embedPasteHandler",

  addProseMirrorPlugins() {
    return [pasteHandlerPlugin()];
  },
});

function pasteHandlerPlugin(): Plugin {
  return new Plugin({
    key: new PluginKey("embedPasteHandler"),
    props: {
      handlePaste: (view, _, slice) => {
        const { state } = view;
        const { selection } = state;
        const { empty } = selection;

        // 範囲選択の場合はデフォルトのリンクマークの挙動にする
        if (!empty) {
          return false;
        }

        let textContent = "";

        slice.content.forEach((node) => {
          textContent += node.textContent;
        });

        const type = getEmbedTypeFromUrl(textContent);
        if (!type) return false;

        const node = state.schema.nodes.embed.create({
          url: textContent,
          type,
        });

        const { tr } = state;
        tr.replaceRangeWith(selection.from, selection.to, node);
        view.dispatch(tr);
        return true;
      },
    },
  });
}
