import { computePosition, flip, shift } from "@floating-ui/dom";
import TiptapLink from "@tiptap/extension-link";
import type { Mark } from "@tiptap/pm/model";
import type { EditorView } from "@tiptap/pm/view";
import { ReactRenderer } from "@tiptap/react";
import LinkEdit from "./link-edit";

const updatePosition = (
  targetElement: HTMLElement,
  popOverElement: HTMLElement,
) => {
  computePosition(targetElement, popOverElement, {
    placement: "bottom",
    strategy: "absolute",
    middleware: [shift(), flip()],
  }).then(({ x, y, strategy }) => {
    popOverElement.style.width = "max-content";
    popOverElement.style.position = strategy;
    popOverElement.style.left = `${x}px`;
    popOverElement.style.top = `${y}px`;
  });
};

export const Link = TiptapLink.extend({
  inclusive: false,

  addMarkView() {
    return ({
      mark,
      updateAttributes,
      view,
    }: {
      mark: Mark;
      updateAttributes: (attrs: Record<string, any>) => void;
      view: EditorView;
    }) => {
      const a = document.createElement("a");
      a.setAttribute("href", mark.attrs.href);
      a.setAttribute("target", mark.attrs.target);
      a.setAttribute("rel", mark.attrs.rel);

      let component: ReactRenderer | null = null;
      const destroyComponent = () => {
        if (component) {
          component.destroy();
          component = null;
        }
      };
      const handleDelete = () => {
        // 位置はイベント時に動的に取得することで、最新の状態を参照できる
        const pos = view.posAtDOM(a, 0);
        const node = view.state.doc.nodeAt(pos); // TextNode
        if (!pos || !node) return null;

        this.editor.commands.command(({ tr }) => {
          tr.removeMark(pos, pos + node.nodeSize, this.type);
          return true;
        });
        destroyComponent();
      };

      a.addEventListener("mouseenter", (e) => {
        component = new ReactRenderer(LinkEdit, {
          props: {
            href: mark.attrs.href,
            handleMouseLeave: (e: MouseEvent) => {
              e.stopPropagation();
              destroyComponent();
            },
            handleSave: (href: string) => {
              if (!href) {
                handleDelete();
                return;
              }

              updateAttributes({ href: href });
              destroyComponent();
            },
            handleDelete: handleDelete,
          },
          editor: this.editor,
        });

        const element = component.element as HTMLElement;
        element.style.position = "absolute";
        document.body.appendChild(element);
        updatePosition(e.target as HTMLElement, element);
      });

      a.addEventListener("mouseleave", (e) => {
        if (
          e.relatedTarget &&
          e.relatedTarget instanceof Node &&
          (component?.element as HTMLElement)?.contains(e.relatedTarget)
        ) {
          return;
        }

        destroyComponent();
      });

      return {
        dom: a,
        destroy: destroyComponent,
      };
    };
  },
});
