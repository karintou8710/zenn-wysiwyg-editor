import { Node } from "@tiptap/react";

export const DetailsSummary = Node.create({
  name: "detailsSummary",

  content: "text*",
  defining: true,
  selectable: false,
  isolating: true,

  parseHTML() {
    return [
      {
        tag: "summary",
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return ["summary", HTMLAttributes, 0];
  },

  addNodeView() {
    return ({ getPos }) => {
      const dom = document.createElement("summary");

      const toggleButton = document.createElement("button");
      toggleButton.type = "button";
      toggleButton.contentEditable = "false";
      const triangle = document.createElement("span");
      triangle.className = "triangle";
      toggleButton.appendChild(triangle);

      const content = document.createElement("div");
      dom.appendChild(toggleButton);
      dom.appendChild(content);

      toggleButton.addEventListener("click", (event) => {
        event.preventDefault();
        event.stopPropagation();

        this.editor.commands.command(({ tr }) => {
          const summaryPos = getPos(); // summaryノードのbefore位置を取得
          if (!summaryPos) {
            return false;
          }

          const $detailsPos = tr.doc.resolve(summaryPos); // detailsノードが指定される
          const open = !$detailsPos.node().attrs.open;
          tr.setNodeMarkup($detailsPos.before(), undefined, {
            ...$detailsPos.parent.attrs,
            open,
          });
          return true;
        });
      });

      return {
        dom,
        contentDOM: content,
      };
    };
  },
});
