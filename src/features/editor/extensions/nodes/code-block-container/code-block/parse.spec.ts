import Document from "@tiptap/extension-document";
import HardBreak from "@tiptap/extension-hard-break";
import Paragraph from "@tiptap/extension-paragraph";
import Text from "@tiptap/extension-text";
import { Editor } from "@tiptap/react";
import { describe, expect, it } from "vitest";
import { CodeBlockFileName } from "../code-block-file-name";
import { DiffCodeBlock } from "../diff-code-block";
import { DiffCodeLine } from "../diff-code-block/diff-code-line";
import { CodeBlockContainer } from "../index";
import { CodeBlock } from "./index";

describe("HTMLのパース", () => {
  it("preタグをコードブロックノードとしてパースできる", () => {
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
      content:
        '<div class="code-block-container"><div class="code-block-filename-container"></div><pre><code class="language-javascript">console.log("hello");</code></pre></div>',
    });

    const docString = editor.state.doc.toString();

    expect(docString).toBe(
      'doc(codeBlockContainer(codeBlockFileName, codeBlock("console.log(\\"hello\\");")))',
    );
  });

  it("言語名なしのpreタグをパースできる", () => {
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
      content:
        '<div class="code-block-container"><div class="code-block-filename-container"></div><pre><code class="language-plaintext">plaintext code</code></pre></div>',
    });

    const docString = editor.state.doc.toString();
    expect(docString).toBe(
      'doc(codeBlockContainer(codeBlockFileName, codeBlock("plaintext code")))',
    );
  });

  it("言語とファイル名ありのpreタグをパースできる", () => {
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
      content:
        '<div class="code-block-container"><div class="code-block-filename-container">example.ts</div><pre><code class="language-typescript">const a = 1;</code></pre></div>',
    });

    const docString = editor.state.doc.toString();
    expect(docString).toBe(
      'doc(codeBlockContainer(codeBlockFileName("example.ts"), codeBlock("const a = 1;")))',
    );
  });
});
