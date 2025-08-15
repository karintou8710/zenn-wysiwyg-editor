import TiptapImage from "@tiptap/extension-image";
import { NodeSelection, Plugin, PluginKey } from "@tiptap/pm/state";
import { Editor } from "@tiptap/react";

const Image = TiptapImage.extend({
  group: "image", // figureからのみ挿入可能
  draggable: false,
  selectable: false,

  addKeyboardShortcuts() {
    return {
      Backspace: ({ editor }: { editor: Editor }) => {
        const { selection } = editor.state;

        if (
          !(selection instanceof NodeSelection) ||
          selection.node.type.name !== this.name
        ) {
          return false;
        }

        // 親のfigureを削除
        editor.commands.deleteRange({
          from: selection.$from.before(),
          to: selection.$from.after(),
        });

        return true;
      },
    };
  },

  addProseMirrorPlugins() {
    return [
      new Plugin({
        key: new PluginKey("imageClickHandler"),
        props: {
          handleClickOn(view, _pos, node, nodePos, _event) {
            if (node.type.name !== "image") return false;

            const $pos = view.state.doc.resolve(nodePos);
            const tr = view.state.tr.setSelection(
              NodeSelection.create(view.state.doc, $pos.before())
            );
            view.dispatch(tr);

            return true;
          },
        },
      }),
    ];
  },
});

export default Image;
