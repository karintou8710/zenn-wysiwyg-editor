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

function highlightCode(code: string, language: string): string {
  try {
    const isDiff = language.startsWith("diff-");
    const targetLanguage = isDiff ? "diff" : language;

    return Prism.highlight(code, Prism.languages[targetLanguage], language);
  } catch (err: any) {
    console.warn(
      `Language "${language}" not supported, falling back to plaintext`
    );
    return Prism.highlight(code, Prism.languages.plaintext, "plaintext");
  }
}

function createStandardDecorations(
  nodes: ChildNode[],
  startPos: number
): Decoration[] {
  const decorations: Decoration[] = [];
  let from = startPos;

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

  return decorations;
}

function createDiffDecorations(
  nodes: ChildNode[],
  startPos: number
): Decoration[] {
  const decorations: Decoration[] = [];
  let from = startPos;

  // diff-highlightの構造がネストになってProseMirrorに対応不可なため、spanの構造をフラットにする
  // diff色は各トークンに適用する
  let to = startPos;
  Array.from(nodes).forEach((diffNode) => {
    let lineStart = to;
    let from = to;

    if (diffNode.nodeType === Node.TEXT_NODE) {
      to = from + diffNode.textContent!.length;
    } else {
      parseNodes(Array.from(diffNode.childNodes)).forEach((node) => {
        to = from + node.text.length;

        if (node.classes.length) {
          const decoration = Decoration.inline(from, to, {
            class: node.classes.join(" "),
          });
          decorations.push(decoration);
        }

        from = to;
      });
    }

    if (diffNode instanceof Element) {
      const isInserted = diffNode.classList.contains("inserted");
      const isDeleted = (diffNode as HTMLElement).classList.contains("deleted");

      if (isInserted || isDeleted) {
        decorations.push(
          Decoration.inline(lineStart, to, {
            class: isInserted ? "insertedToken" : "deletedToken",
          })
        );
      }
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

  findChildren(doc, (node) => node.type.name === name).forEach((block) => {
    const from = block.pos + 1;
    const language = block.node.attrs.language || defaultLanguage;
    const isDiff = language.startsWith("diff-");

    const html = highlightCode(block.node.textContent, language);
    const nodes = getHighlightNodes(html);

    const blockDecorations = isDiff
      ? createDiffDecorations(nodes, from)
      : createStandardDecorations(nodes, from);

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
