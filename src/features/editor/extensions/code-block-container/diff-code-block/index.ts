import { mergeAttributes, Node } from "@tiptap/react";
import { PrismPlugin } from "./prism-plugin";

// カスタマイズのため、TiptapのBlockquoteを直接編集する
// https://github.com/ueberdosis/tiptap/blob/main/packages/extension-code-block/src/code-block.ts

export interface CodeBlockOptions {
  languageClassPrefix: string;
  exitOnTripleEnter: boolean;
  exitOnArrowDown: boolean;
  defaultLanguage: string;
  HTMLAttributes: Record<string, any>;
}

export const DiffCodeBlock = Node.create<CodeBlockOptions>({
  name: "diffCodeBlock",

  addOptions() {
    return {
      languageClassPrefix: "language-",
      exitOnTripleEnter: true,
      exitOnArrowDown: true,
      defaultLanguage: "plaintext",
      HTMLAttributes: {},
    };
  },

  content: "diffCodeLine+",
  marks: "",
  code: true,
  defining: true,

  addAttributes() {
    return {
      language: {
        default: this.options.defaultLanguage,
        parseHTML: (element) => {
          const { languageClassPrefix } = this.options;
          const classNames = [...(element.firstElementChild?.classList || [])];
          const languages = classNames
            .filter((className) => className.startsWith(languageClassPrefix))
            .map((className) => className.replace(languageClassPrefix, ""));
          const language = languages[0];

          if (!language) {
            return null;
          }

          return language;
        },
        rendered: false,
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: "pre",
        preserveWhitespace: "full",
      },
    ];
  },

  renderHTML({ node, HTMLAttributes }) {
    return [
      "pre",
      mergeAttributes(this.options.HTMLAttributes, HTMLAttributes),
      [
        "code",
        {
          class: node.attrs.language
            ? this.options.languageClassPrefix + node.attrs.language
            : null,
        },
        0,
      ],
    ];
  },

  addNodeView() {
    return ({ node }) => {
      console.log("diff");
      const dom = document.createElement("div");
      dom.className = "code-block-wrapper-for-langname"; // 言語名表示のポジションのため
      dom.setAttribute(
        "data-language",
        node.attrs.language || this.options.defaultLanguage
      );
      const pre = document.createElement("pre");

      const code = document.createElement("code");
      code.className = node.attrs.language
        ? this.options.languageClassPrefix + node.attrs.language
        : "";
      code.textContent = node.textContent;

      pre.appendChild(code);
      dom.appendChild(pre);

      return {
        dom,
        contentDOM: code,
      };
    };
  },

  addProseMirrorPlugins() {
    return [
      PrismPlugin({
        name: this.name,
        defaultLanguage: this.options.defaultLanguage,
      }),
    ];
  },
});
