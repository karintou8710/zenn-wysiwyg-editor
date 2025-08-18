import markdownToHtml from "zenn-markdown-html";
import { EMBED_ORIGIN } from "./constants";

export function fromMarkdown(text: string) {
  const html = markdownToHtml(text, {
    embedOrigin: EMBED_ORIGIN,
  });
  console.log(html);
  const dom = document.createElement("div");
  dom.innerHTML = html;

  removeMessageSymbol(dom);
  addCodeBlockFileName(dom);
  removeEmbedDeco(dom);
  removeCodeBlockEndNewLine(dom);

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

// 原因は不明だが、マークダウンペーストだと末尾に余分な改行が1つ増える
function removeCodeBlockEndNewLine(dom: HTMLElement) {
  const codeBlocks = dom.querySelectorAll("pre code");
  codeBlocks.forEach((codeBlock) => {
    const code = codeBlock.textContent || "";
    if (code.endsWith("\n")) {
      codeBlock.textContent = code.slice(0, -1);
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
