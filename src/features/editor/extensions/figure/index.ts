import { mergeAttributes, Node } from "@tiptap/react";

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
      insertFigure: (pos: number, options: InsertFigureOptions) => ReturnType;
    };
  }
}

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

  addAttributes() {
    return {
      figure: {
        default: true,
        parseHTML: (element) => element.hasAttribute("data-figure"),
        renderHTML: ({ figure }) => {
          return {
            "data-figure": figure || false,
          };
        },
      },
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
      mergeAttributes(this.options.HTMLAttributes, HTMLAttributes),
      0,
    ];
  },

  addCommands() {
    return {
      insertFigure:
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
});

export default Figure;
