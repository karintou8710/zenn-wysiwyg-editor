import { findChildren } from "@tiptap/react";
import { Node as ProsemirrorNode } from "@tiptap/pm/model";
import { Plugin, PluginKey } from "@tiptap/pm/state";
import { Decoration, DecorationSet } from "@tiptap/pm/view";
import Prism from "prismjs";

function parseNodes(
  nodes: Node[],
  className: string[] = []
): { text: string; classes: string[] }[] {
  return nodes
    .map((node) => {
      const classes = [...className];

      // エレメントノードの場合、クラス名を取得
      if (node.nodeType === Node.ELEMENT_NODE) {
        const element = node as Element;
        if (element.className) {
          classes.push(...element.className.split(" ").filter(Boolean));
        }
      }

      // 子ノードがある場合は再帰的に処理
      if (node.childNodes && node.childNodes.length > 0) {
        return parseNodes(Array.from(node.childNodes), classes);
      }

      // テキストノードの場合
      if (node.nodeType === Node.TEXT_NODE) {
        return {
          text: node.textContent || "",
          classes,
        };
      }

      return {
        text: node.textContent || "",
        classes,
      };
    })
    .flat();
}

function getHighlightNodes(html: string): ChildNode[] {
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, "text/html");
  return Array.from(doc.body.childNodes);
}

function getDecorations({
  doc,
  name,
  defaultLanguage,
}: {
  doc: ProsemirrorNode;
  name: string;
  defaultLanguage: string | null | undefined;
}) {
  const decorations: Decoration[] = [];

  findChildren(doc, (node) => node.type.name === name).forEach((block) => {
    let from = block.pos + 1;
    const language = block.node.attrs.language || defaultLanguage;
    let html: string = "";

    try {
      // babel-plugin-prismjsによって必要な言語は自動でインポート済み
      html = Prism.highlight(
        block.node.textContent,
        Prism.languages[language],
        language
      );
    } catch (err: any) {
      console.warn(
        `Language "${language}" not supported, falling back to plaintext`
      );
      html = Prism.highlight(
        block.node.textContent,
        Prism.languages.plaintext,
        "plaintext"
      );
    }

    const nodes = getHighlightNodes(html);

    parseNodes(nodes).forEach((node) => {
      const to = from + node.text.length;

      if (node.classes.length) {
        const decoration = Decoration.inline(from, to, {
          class: node.classes.join(" "),
        });

        decorations.push(decoration);
      }

      from = to;
    });
  });

  return DecorationSet.create(doc, decorations);
}

export function PrismPlugin({
  name,
  defaultLanguage,
}: {
  name: string;
  defaultLanguage: string;
}) {
  const prismjsPlugin: Plugin<any> = new Plugin({
    key: new PluginKey("prism"),

    state: {
      init: (_, { doc }) =>
        getDecorations({
          doc,
          name,
          defaultLanguage,
        }),
      apply: (transaction, decorationSet, oldState, newState) => {
        const oldNodeName = oldState.selection.$head.parent.type.name;
        const newNodeName = newState.selection.$head.parent.type.name;
        const oldNodes = findChildren(
          oldState.doc,
          (node) => node.type.name === name
        );
        const newNodes = findChildren(
          newState.doc,
          (node) => node.type.name === name
        );

        if (
          transaction.docChanged &&
          ([oldNodeName, newNodeName].includes(name) ||
            newNodes.length !== oldNodes.length)
        ) {
          return getDecorations({
            doc: transaction.doc,
            name,
            defaultLanguage,
          });
        }

        return decorationSet.map(transaction.mapping, transaction.doc);
      },
    },

    props: {
      decorations(state) {
        return prismjsPlugin.getState(state);
      },
    },
  });

  return prismjsPlugin;
}
