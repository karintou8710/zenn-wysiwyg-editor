import markdownToHtml from "zenn-markdown-html";

export function fromMarkdown(text: string) {
  const html = markdownToHtml(text);
  const dom = document.createElement("div");
  dom.innerHTML = html;

  removeMessageSymbol(dom);

  return dom.innerHTML;
}

function removeMessageSymbol(dom: HTMLElement) {
  const messageSymbols = dom.querySelectorAll(".msg-symbol");
  messageSymbols.forEach((el) => {
    el.remove();
  });
}
