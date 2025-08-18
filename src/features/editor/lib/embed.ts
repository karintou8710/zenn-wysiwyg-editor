import type { EmbedType } from "../types";
import {
  isCodepenUrl,
  isCodesandboxUrl,
  isGistUrl,
  isGithubUrl,
  isJsfiddleUrl,
  isStackblitzUrl,
  isTweetUrl,
  isValidHttpUrl,
  isYoutubeUrl,
} from "../lib/url";

/** 渡された文字列をサニタイズする */
export function sanitizeEmbedToken(str: string): string {
  return str.replace(/"/g, "%22");
}

export function getEmbedTypeFromElement(
  element: HTMLElement
): EmbedType | null {
  if (element.classList.contains("zenn-embedded-card")) {
    return "card";
  } else if (element.classList.contains("zenn-embedded-tweet")) {
    return "tweet";
  } else if (element.classList.contains("zenn-embedded-gist")) {
    return "gist";
  } else if (element.classList.contains("zenn-embedded-stackblitz")) {
    return "stackblitz";
  } else if (element.classList.contains("zenn-embedded-codesandbox")) {
    return "codesandbox";
  } else if (element.classList.contains("zenn-embedded-codepen")) {
    return "codepen";
  }
  return null;
}

export function getEmbedTypeFromUrl(url: string): EmbedType | null {
  if (isTweetUrl(url)) {
    return "tweet";
  } else if (isGithubUrl(url)) {
    return "github";
  } else if (isGistUrl(url)) {
    return "gist";
  } else if (isCodepenUrl(url)) {
    return "codepen";
  } else if (isJsfiddleUrl(url)) {
    return "jsfiddle";
  } else if (isCodesandboxUrl(url)) {
    return "codesandbox";
  } else if (isStackblitzUrl(url)) {
    return "stackblitz";
  } else if (isYoutubeUrl(url)) {
    return "youtube";
  } else if (isValidHttpUrl(url)) {
    return "card";
  }

  return null;
}
