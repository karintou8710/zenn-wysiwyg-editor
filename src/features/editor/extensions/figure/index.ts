import { Plugin, PluginKey } from "@tiptap/pm/state";
import { InputRule, mergeAttributes, Node } from "@tiptap/react";
import { isImageURL } from "../../lib/url";

export interface FigureOptions {
  HTMLAttributes: Record<string, any>;
}

export interface InsertFigureOptions {
  src: string;
  alt?: string;
  caption?: string;
}

declare module "@tiptap/react" {
  interface Commands<ReturnType> {
    figure: {
      insertFigureAt: (pos: number, options: InsertFigureOptions) => ReturnType;
    };
  }
}

// ![image](src)
export const inputRegex = /(?:^|\s)(!\[(.+|:?)]\((\S+)\))$/;

export const Figure = Node.create({
  name: "figure",

  group: "block",
  content: "image caption",
  isolating: true,
  draggable: true,
  selectable: true,
  priority: 1000,

  addOptions() {
    return {
      HTMLAttributes: {},
    };
  },

  parseHTML() {
    return [
      {
        tag: "p[data-figure]",
        priority: 100,
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      "p",
      mergeAttributes(this.options.HTMLAttributes, HTMLAttributes, {
        "data-figure": "",
      }),
      0,
    ];
  },

  addCommands() {
    return {
      insertFigureAt:
        (pos, options) =>
        ({ commands }) => {
          return commands.insertContentAt(pos, {
            type: this.name,
            content: [
              {
                type: "image",
                attrs: {
                  src: options.src,
                  alt: options.alt || "",
                },
              },
              {
                type: "caption",
                content: options.caption
                  ? [{ type: "text", text: options.caption }]
                  : [],
              },
            ],
          });
        },
    };
  },

  addInputRules() {
    return [
      new InputRule({
        find: inputRegex,
        handler: ({ match, chain, range }) => {
          const [, , alt, src] = match;

          chain()
            .deleteRange(range)
            .insertFigureAt(range.from, { src, alt })
            .run();
        },
      }),
    ];
  },

  /* 埋め込みのペーストハンドラーよりも先に実行する */
  addProseMirrorPlugins() {
    return [
      new Plugin({
        key: new PluginKey("imageURLPasteHandler"),
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

            if (!isImageURL(textContent)) return false;

            this.editor
              .chain()
              .deleteRange({ from: selection.from, to: selection.to })
              .insertFigureAt(selection.from, { src: textContent })
              .run();
            return true;
          },
        },
      }),
    ];
  },
});

export default Figure;
