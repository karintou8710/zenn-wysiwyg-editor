import {
  type EditorState,
  NodeSelection,
  Plugin,
  PluginKey,
} from "@tiptap/pm/state";
import type { EditorView } from "@tiptap/pm/view";
import { Extension } from "@tiptap/react";

export const NodeSelectionRect = Extension.create({
  name: "nodeSelectionRect",

  addProseMirrorPlugins() {
    return [
      new Plugin({
        key: new PluginKey("nodeSelectionRect"),
        view(view) {
          return new NodeSelectionRectView(view);
        },
      }),
    ];
  },
});

class NodeSelectionRectView {
  private rectDom: HTMLDivElement;

  constructor(view: EditorView) {
    this.rectDom = document.createElement("div");
    this.rectDom.style.position = "absolute";
    this.rectDom.style.pointerEvents = "none";
    this.rectDom.style.background = "#2383e24d";
    this.rectDom.style.display = "none";
    document.body.appendChild(this.rectDom);
    this.update(view, null);
  }

  update(view: EditorView, _: EditorState | null) {
    const { state } = view;
    const { selection } = state;

    if (selection instanceof NodeSelection) {
      const dom = view.nodeDOM(selection.from);
      if (dom) {
        const rect = (dom as HTMLElement).getBoundingClientRect();
        this.rectDom.style.display = "block";
        this.rectDom.style.left = `${window.scrollX + rect.left}px`;
        this.rectDom.style.top = `${window.scrollY + rect.top}px`;
        this.rectDom.style.width = `${rect.width}px`;
        this.rectDom.style.height = `${rect.height}px`;
      }
    } else {
      this.rectDom.style.display = "none";
    }
  }

  destroy() {
    this.rectDom.remove();
  }
}
