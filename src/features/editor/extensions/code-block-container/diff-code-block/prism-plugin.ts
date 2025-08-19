import type { Node as ProsemirrorNode } from "@tiptap/pm/model";
import { Plugin, PluginKey } from "@tiptap/pm/state";
import { Decoration, DecorationSet } from "@tiptap/pm/view";
import { findChildren } from "@tiptap/react";
import Prism from "prismjs";

function parseNodes(
  nodes: Node[],
  className: string[] = []
): { text: string; classes: string[] }[] {
  return nodes.flatMap((node) => {
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
  });
}

function getHighlightNodes(html: string): ChildNode[] {
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, "text/html");
  return Array.from(doc.body.childNodes);
}

function highlightCode(code: string, language: string): string {
  try {
    return Prism.highlight(code, Prism.languages.diff, language);
  } catch (err: any) {
    console.warn(
      `Language "${language}" not supported, falling back to plaintext`
    );
    return Prism.highlight(code, Prism.languages.plaintext, "plaintext");
  }
}

function getCode(codeNode: ProsemirrorNode) {
  let code = "";
  let isFirst = true;

  codeNode.children.forEach((child) => {
    if (!isFirst) {
      code += "\n";
    } else {
      isFirst = false;
    }

    code += child.textContent;
  });
  return code;
}

function createDiffDecorations(
  nodes: ChildNode[],
  startPos: number
): Decoration[] {
  const decorations: Decoration[] = [];

  let to = startPos + 1;
  Array.from(nodes).forEach((lineNode) => {
    const lineStart = to;
    let from = to;

    if (lineNode.nodeType === Node.TEXT_NODE) {
      const text = lineNode.textContent!.replace(/\n$/, "");
      const lineBreakCount = (text.match(/\n/g) || []).length;
      to = from + text.length + lineBreakCount + 2;
    } else if (lineNode instanceof HTMLElement) {
      parseNodes(Array.from(lineNode.childNodes)).forEach((node) => {
        const text = node.text.replace(/\n$/, "");
        to = from + text.length;

        if (node.classes.length) {
          const decoration = Decoration.inline(from, to, {
            class: node.classes.join(" "),
          });
          decorations.push(decoration);
        }

        from = to;
      });

      decorations.push(
        Decoration.node(lineStart - 1, to + 1, {
          class: lineNode.className,
        })
      );

      to += 2;
    }
  });

  return decorations;
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

  findChildren(doc, (node) => node.type.name === name).forEach((preNode) => {
    const from = preNode.pos + 1;
    const language = preNode.node.attrs.language || defaultLanguage;

    const html = highlightCode(getCode(preNode.node), language);
    const nodes = getHighlightNodes(html);

    const blockDecorations = createDiffDecorations(nodes, from);

    console.log(blockDecorations);

    decorations.push(...blockDecorations);
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
    key: new PluginKey("diff-prism"),

    state: {
      init: (_, { doc }) =>
        getDecorations({
          doc,
          name,
          defaultLanguage,
        }),
      apply: (transaction, decorationSet, oldState, newState) => {
        const oldNodeName = oldState.selection.$head.node(-1)?.type.name;
        const newNodeName = newState.selection.$head.node(-1)?.type.name;

        if (oldNodeName !== name && newNodeName !== name) {
          return decorationSet.map(transaction.mapping, transaction.doc);
        }

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
