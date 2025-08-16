import { EditorState, Plugin, PluginKey } from "@tiptap/pm/state";
import {
  isGistUrl,
  isGithubUrl,
  isTweetUrl,
  isValidHttpUrl,
} from "../../lib/url";
import { Extension } from "@tiptap/react";
import type { Node } from "@tiptap/pm/model";

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

        let node = getEmbedNode(textContent, state);

        if (!node) return false;

        const { tr } = state;
        tr.replaceRangeWith(selection.from, selection.to, node);
        view.dispatch(tr);
        return true;
      },
    },
  });
}

function getEmbedNode(textContent: string, state: EditorState): Node | null {
  const { schema } = state;

  if (isTweetUrl(textContent)) {
    return schema.nodes.embedTweet.create({ url: textContent });
  } else if (isGithubUrl(textContent)) {
    return schema.nodes.embedGithub.create({ url: textContent });
  } else if (isGistUrl(textContent)) {
    return schema.nodes.embedGist.create({ url: textContent });
  } else if (isValidHttpUrl(textContent)) {
    return schema.nodes.embedLinkCard.create({ url: textContent });
  }

  return null;
}
