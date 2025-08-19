import { NodeSelection, Plugin, PluginKey } from "@tiptap/pm/state";
import { mergeAttributes, Node } from "@tiptap/react";

export interface ImageOptions {
  HTMLAttributes: Record<string, any>;
}

export interface SetImageOptions {
  src: string;
  alt?: string;
  width?: number;
}

export const Image = Node.create<ImageOptions>({
  name: "image",

  addOptions() {
    return {
      HTMLAttributes: {},
    };
  },

  draggable: false,
  selectable: false,

  addAttributes() {
    return {
      src: {
        default: null,
      },
      alt: {
        default: null,
      },
      width: {
        default: null,
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: "img[src]",
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      "img",
      mergeAttributes(this.options.HTMLAttributes, HTMLAttributes, {
        class: "md-img",
      }),
    ];
  },

  addKeyboardShortcuts() {
    return {
      Backspace: ({ editor }) => {
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
              NodeSelection.create(view.state.doc, $pos.before()),
            );
            view.dispatch(tr);

            return true;
          },
        },
      }),
    ];
  },
});
