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

export function getHighlightNodes(html: string): ChildNode[] {
  const pre = document.createElement("pre");
  pre.innerHTML = html;
  console.log(html);
  return Array.from(pre.childNodes);
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
