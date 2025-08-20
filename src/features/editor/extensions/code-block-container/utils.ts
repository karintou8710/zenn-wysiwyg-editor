import type { Node as ProsemirrorNode } from "@tiptap/pm/model";
import Prism from "prismjs";

// NOTE: nodesが<span>とtextノードのみであり、ネストなしの必要がある
export function parseNodes(
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

export function getHighlightNodes(html: string) {
  const pre = document.createElement("pre");
  pre.innerHTML = html;
  return Array.from(pre.childNodes);
}

/*
  diff-highlightの構造を行単位に変換する
  <span class="line"><span class="token keyword">const</span>;</span>
  <span class="line"><span class="token keyword">const</span>;</span>
*/
export function getDiffHighlightLineNodes(html: string) {
  const pre = document.createElement("pre");
  pre.innerHTML = html;

  // 差分ノードでは、行ブロックなため末尾の不要な行を削除する
  const lineNodes: HTMLElement[] = [];
  pre.childNodes.forEach((topChild, i) => {
    if (topChild.nodeType === Node.TEXT_NODE) {
      // テキストノードは行単位に分割する
      const text = topChild.textContent || "";
      const lines = text.split("\n");

      if (text.endsWith("\n") && i !== pre.childNodes.length - 1) {
        // 文末の改行以外は不要。NodeViewと位置がズレるため削除
        lines.pop();
      }

      lines.forEach((line) => {
        const span = document.createElement("span");
        span.textContent = line;
        lineNodes.push(span);
      });
    } else if (topChild instanceof HTMLElement) {
      // coordの行は特殊なため、例外的に処理
      if (topChild.classList.contains("coord")) {
        lineNodes.push(topChild.cloneNode(true) as HTMLElement);
        if (topChild.nextSibling) {
          // coordの次のノードは改行TextNodeなので、先頭の改行を削除
          topChild.nextSibling.textContent =
            topChild.nextSibling.textContent!.slice(1);
          if (topChild.nextSibling.textContent === "") {
            // 改行のみのテキストノードであれば削除
            topChild.nextSibling.remove();
          }
        }
        return;
      }

      let lineNode = document.createElement("span");
      lineNode.classList.add(...topChild.classList);

      topChild.childNodes.forEach((token, j) => {
        const text = token.textContent || "";
        const isCodeEnd =
          i === pre.childNodes.length - 1 &&
          j === topChild.childNodes.length - 1;

        if (text.endsWith("\n") || isCodeEnd) {
          if (text.endsWith("\n")) {
            token.textContent = text.slice(0, -1);
          }

          lineNode.appendChild(token.cloneNode(true));
          lineNodes.push(lineNode);
          lineNode = document.createElement("span");
        } else {
          lineNode.appendChild(token.cloneNode(true));
        }
      });
    }
  });

  return lineNodes;
}

export function highlightCode(code: string, language: string): string {
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

export function getDiffCode(codeNode: ProsemirrorNode): string {
  const lines: string[] = [];

  codeNode.forEach((child) => {
    lines.push(child.textContent || "");
  });

  return lines.join("\n");
}
