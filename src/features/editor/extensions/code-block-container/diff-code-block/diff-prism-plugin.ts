import type { Node as ProsemirrorNode } from "@tiptap/pm/model";
import { Plugin, PluginKey } from "@tiptap/pm/state";
import { Decoration, DecorationSet } from "@tiptap/pm/view";
import { findChildren } from "@tiptap/react";
import { getHighlightNodes, highlightCode, parseNodes } from "../utils";

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
    let from = to;

    if (lineNode.nodeType === Node.TEXT_NODE) {
      // 特定のトークンに認識されなかったノード
      const text = lineNode.textContent!.replace(/\n$/, "");
      const lineBreakCount = (text.match(/\n/g) || []).length;
      to = from + text.length + lineBreakCount + 2;
    } else if (lineNode instanceof HTMLElement) {
      // 一行のコードブロック
      const linePosList: { from: number; to: number }[] = [];
      let lineStartInner = from; // insert deleteは複数行つながる可能性があるので、行の開始位置を記録

      const parsedNodes = parseNodes(Array.from(lineNode.childNodes));
      parsedNodes.forEach((node, i) => {
        const hasLineBreak = node.text.endsWith("\n");
        const text = node.text.replace(/\n$/, "");
        to = from + text.length;

        if (node.classes.length) {
          console.log("node.classes", node.classes);
          const decoration = Decoration.inline(from, to, {
            class: node.classes.join(" "),
          });
          decorations.push(decoration);
        }

        // 行末 (文末は改行がなくてもlinePosListに追加する)
        if (hasLineBreak || i === parsedNodes.length - 1) {
          linePosList.push({ from: lineStartInner - 1, to: to + 1 });
          lineStartInner = to + 2;
          to += 2;
        }

        from = to;
      });

      linePosList.forEach(({ from, to }, i) => {
        decorations.push(
          Decoration.node(from, to, { class: lineNode.className })
        );
      });
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

export function DiffPrismPlugin({
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
