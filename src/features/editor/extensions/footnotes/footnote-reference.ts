import { Node } from "@tiptap/react";
import { getRandomString } from "@/lib/utils";

declare module "@tiptap/react" {
  interface Commands<ReturnType> {
    footnoteReference: {
      addFootnote: () => ReturnType;
    };
  }
}

const FootnoteReference = Node.create({
  name: "footnoteReference",
  inline: true,
  group: "inline",
  atom: true,
  draggable: false,

  addAttributes() {
    return {
      id: {
        isRequired: true,
      },
      footnoteId: {
        isRequired: true,
      },
      referenceNumber: {
        default: null,
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: "sup.footnote-ref",
        getAttrs: (element) => {
          const anchor = element.querySelector("a");
          if (!anchor) {
            return false;
          }

          const id = anchor.getAttribute("id");
          const footnoteId = anchor.getAttribute("href")?.replace("#", "");
          const referenceNumber = anchor.textContent
            ? anchor.textContent.replace(/[[\]]/g, "")
            : null;

          if (!id || !footnoteId || !referenceNumber) {
            return false;
          }

          return {
            id,
            footnoteId,
            referenceNumber,
          };
        },
      },
    ];
  },

  renderHTML({ node }) {
    return [
      "sup",
      { class: "footnote-ref" },
      [
        "a",
        {
          href: `#${node.attrs.footnoteId}`,
          id: node.attrs.id,
        },
        `[${node.attrs.referenceNumber ?? "?"}]`,
      ],
    ];
  },

  addCommands() {
    return {
      addFootnote:
        () =>
        ({ state, tr }) => {
          const node = this.type.create({
            id: getRandomString(),
            footnoteId: getRandomString(),
          });
          tr.insert(state.selection.from, node);
          return true;
        },
    };
  },

  addInputRules() {
    // [^text] の形式 (空のテキストでも良い)
    return [
      {
        find: /\[\^(.*?)\]/,
        type: this.type,
        handler({ range, chain }) {
          chain().deleteRange(range).addFootnote().run();
        },
      },
    ];
  },
});

export default FootnoteReference;
