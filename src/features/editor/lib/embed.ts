// htmlToMarkdownがブラウザで動作しないため、必要箇所だけ切り出す
// https://github.com/zenn-dev/zenn-editor/tree/canary/packages/zenn-markdown-html/src

import type { EmbedServerType } from "../types";

/** 渡された文字列をサニタイズする */
export function sanitizeEmbedToken(str: string): string {
  return str.replace(/"/g, "%22");
}

/** Embedサーバーを使った埋め込み要素の文字列を生成する */
export function generateEmbedServerIframe(
  type: EmbedServerType,
  src: string,
  embedOrigin: string
): string {
  const origin = (() => {
    try {
      return new URL(embedOrigin).origin;
    } catch {
      return void 0;
    }
  })();

  // 埋め込みサーバーの origin が設定されてなければ空文字列を返す
  if (!origin) {
    console.warn("The embedOrigin option not set");
    return "";
  }

  // ユーザーからの入力値が引数として渡されたときのために念のためencodeする
  const encodedType = encodeURIComponent(type);
  const encodedSrc = encodeURIComponent(src);
  const id = `zenn-embedded__${Math.random().toString(16).slice(2)}`;
  const iframeSrc = `${origin}/${encodedType}#${id}`;

  return `<span class="embed-block zenn-embedded zenn-embedded-${encodedType}"><iframe id="${id}" src="${iframeSrc}" data-content="${encodedSrc}" frameborder="0" scrolling="no" loading="lazy"></iframe></span>`;
}
