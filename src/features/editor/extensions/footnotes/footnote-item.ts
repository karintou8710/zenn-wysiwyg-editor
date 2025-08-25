import { Node } from "@tiptap/react";

const FootnoteItem = Node.create({
  name: "footnoteItem",
  content: "text*", // footnoteReferenceを含めないようにする
  isolating: true,
  defining: true,
  draggable: false,
  priority: 1000, // list item よりも優先度を高くする

  addAttributes() {
    return {
      id: {
        isRequired: true,
      },
      referenceId: {
        isRequired: true,
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: "li.footnote-item",
        getAttrs: (element) => {
          const id = element.getAttribute("id");
          const referenceId = element.getAttribute(
            "data-footnote-reference-id",
          );
          if (!id || !referenceId) {
            return false;
          }

          return { id, referenceId };
        },
      },
    ];
  },

  renderHTML({ node }) {
    return [
      "li",
      {
        id: node.attrs.id,
        class: "footnote-item",
        "data-footnote-reference-id": node.attrs.referenceId,
      },
      ["p", 0],
    ];
  },
});

export default FootnoteItem;
