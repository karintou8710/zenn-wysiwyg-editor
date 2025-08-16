import { Plugin, PluginKey } from "@tiptap/pm/state";
import { isValidHttpUrl } from "../../lib/url";

export function pasteHandlerPlugin(): Plugin {
  return new Plugin({
    key: new PluginKey("handlePasteEmbedLinkCard"),
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

        if (!isValidHttpUrl(textContent)) {
          return false;
        }

        const { tr } = state;
        tr.replaceRangeWith(
          selection.from,
          selection.to,
          state.schema.nodes.embedLinkCard.create({
            url: textContent,
          })
        );
        view.dispatch(tr);
        return true;
      },
    },
  });
}
