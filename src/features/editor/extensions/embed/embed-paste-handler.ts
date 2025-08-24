import type { Node } from "@tiptap/pm/model";
import { Plugin, PluginKey } from "@tiptap/pm/state";
import type { EditorView } from "@tiptap/pm/view";
import { Extension } from "@tiptap/react";
import { getEmbedTypeFromUrl } from "../../lib/embed";
import { extractSpeakerDeckEmbedParams } from "../../lib/url";

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

        let node: Node;
        if (type === "speakerdeck") {
          node = createSpeakerDeckNode(view, textContent);
        } else {
          node = state.schema.nodes.embed.create({
            url: textContent,
            type,
          });
        }

        const { tr } = state;
        tr.replaceSelectionWith(node);
        view.dispatch(tr);
        return true;
      },
    },
  });
}

function createSpeakerDeckNode(view: EditorView, url: string) {
  const params = extractSpeakerDeckEmbedParams(url);
  if (params) {
    return view.state.schema.nodes.speakerDeckEmbed.create(params);
  }

  fetch(
    `http://localhost:8787/api/speakerdeck/embed?url=${encodeURIComponent(url)}`,
  )
    .then((response) => {
      const data = response.json();
      return data;
    })
    .then((data) => {
      const embedId = data.embedId;
      const node = view.state.schema.nodes.speakerDeckEmbed.create({
        embedId,
        loading: false,
      });
      view.dispatch(view.state.tr.replaceSelectionWith(node));
    });

  return view.state.schema.nodes.speakerDeckEmbed.create({ loading: true });
}
