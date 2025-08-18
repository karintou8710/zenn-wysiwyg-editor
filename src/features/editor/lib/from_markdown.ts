import markdownToHtml from "zenn-markdown-html";
import { EMBED_ORIGIN } from "./constants";

export function fromMarkdown(text: string) {
  const html = markdownToHtml(text, {
    embedOrigin: EMBED_ORIGIN,
  });
  const dom = document.createElement("div");
  dom.innerHTML = html;

  removeMessageSymbol(dom);
  addCodeBlockFileName(dom);

  return dom.innerHTML;
}

function removeMessageSymbol(dom: HTMLElement) {
  const messageSymbols = dom.querySelectorAll(".msg-symbol");
  messageSymbols.forEach((el) => {
    el.remove();
  });
}

function addCodeBlockFileName(dom: HTMLElement) {
  const codeBlockContainers = dom.querySelectorAll(".code-block-container");
  codeBlockContainers.forEach((codeBlockContainer) => {
    if (codeBlockContainer.children.length === 1) {
      // ファイル名がないので追加する
      const fileNameDom = document.createElement("div");
      fileNameDom.className = "code-block-filename-container";
      codeBlockContainer.insertBefore(
        fileNameDom,
        codeBlockContainer.firstChild
      );
    }
  });
}
