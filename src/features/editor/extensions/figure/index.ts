import { InputRule, mergeAttributes, Node, nodeInputRule } from "@tiptap/react";

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
});

export default Figure;
