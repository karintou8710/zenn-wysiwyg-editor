import Document from "@tiptap/extension-document";
import HardBreak from "@tiptap/extension-hard-break";
import Paragraph from "@tiptap/extension-paragraph";
import Text from "@tiptap/extension-text";
import { Editor } from "@tiptap/react";
import { describe, expect, it } from "vitest";
import { CodeBlockContainer } from "../..";
import { CodeBlock } from "../../code-block";
import { CodeBlockFileName } from "../../code-block-file-name";
import { DiffCodeBlock } from "../../diff-code-block";
import { DiffCodeLine } from "../../diff-code-block/diff-code-line";

describe("HTMLのレンダリング", () => {
  it("JavaScript差分コードブロックが正しいHTMLでレンダリングされる", () => {
    const content =
      '<div class="code-block-container"><div class="code-block-filename-container"><span class="code-block-filename"></span></div><pre><code class="diff-highlight language-diff-javascript"><span>console.log("hello");</span></code></pre></div>';
    const editor = new Editor({
      extensions: [
        Document,
        Paragraph,
        Text,
        CodeBlockContainer,
        CodeBlock,
        CodeBlockFileName,
        DiffCodeBlock,
        DiffCodeLine,
        HardBreak,
      ],
      content,
    });

    const html = editor.getHTML();
    expect(html).toBe(content);
  });

  it("diff言語の差分コードブロックが正しいHTMLでレンダリングされる", () => {
    const content =
      '<div class="code-block-container"><div class="code-block-filename-container"><span class="code-block-filename"></span></div><pre><code class="diff-highlight language-diff"><span>plaintext code</span></code></pre></div>';
    const editor = new Editor({
      extensions: [
        Document,
        Paragraph,
        Text,
        CodeBlockContainer,
        CodeBlock,
        CodeBlockFileName,
        DiffCodeBlock,
        DiffCodeLine,
        HardBreak,
      ],
      content,
    });

    const html = editor.getHTML();
    expect(html).toBe(content);
  });
});
