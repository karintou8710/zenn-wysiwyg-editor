import { Node } from "@tiptap/react";

declare module "@tiptap/react" {
  interface Commands<ReturnType> {
    footnote: {
      focusFootnote: (id: string) => ReturnType;
    };
  }
}

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

  addCommands() {
    return {
      focusFootnote:
        (id: string) =>
        ({ editor, chain }) => {
          const matchedFootnote = editor.$node("footnoteItem", {
            id: id,
          });

          if (matchedFootnote) {
            chain()
              .focus()
              .setTextSelection(
                matchedFootnote.from + matchedFootnote.content.size,
              )
              .scrollIntoView()
              .run();

            return true;
          }
          return false;
        },
    };
  },
});

export default FootnoteItem;
