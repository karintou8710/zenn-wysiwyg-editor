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
  removeEmbedDeco(dom);

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

// URL単体の埋め込み要素は、不要なリンクとパラグラフを持つので削除する
function removeEmbedDeco(dom: HTMLElement) {
  const embeds = dom.querySelectorAll(
    ".zenn-embedded-github, .zenn-embedded-tweet, .zenn-embedded-card, .embed-youtube"
  );
  embeds.forEach((embed) => {
    // 不要なリンクを削除
    embed.nextSibling?.remove();

    // 不要な親のpタグを削除し、埋め込み要素を親要素の位置に置換
    const notUsedP = embed.parentElement;
    if (notUsedP?.tagName !== "P") {
      console.error(embed);
      throw new Error("should be embed with only url");
    }

    notUsedP.parentElement?.replaceChild(embed, notUsedP);
  });
}
