import Document from "@tiptap/extension-document";
import HardBreak from "@tiptap/extension-hard-break";
import Paragraph from "@tiptap/extension-paragraph";
import Text from "@tiptap/extension-text";
import { Editor } from "@tiptap/react";
import { describe, expect, it } from "vitest";
import { fromMarkdown } from "@/features/editor/lib/from-markdown";
import { markdownSerializer } from "@/features/editor/lib/to-markdown";
import { Details } from "../../details";
import { DetailsContent } from "../../details/content";
import { DetailsSummary } from "../../details/summary";
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

describe("HTMLのレンダリング", () => {
  it("JavaScriptコードブロックが正しいHTMLでレンダリングされる", () => {
    const content =
      '<div class="code-block-container"><div class="code-block-filename-container"></div><pre><code class="language-javascript">console.log("hello");</code></pre></div>';
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
    expect(html).toBe(html);
  });

  it("言語名なしのコードブロックが正しいHTMLでレンダリングされる", () => {
    const content =
      '<div class="code-block-container"><div class="code-block-filename-container"></div><pre><code class="language-plaintext">plaintext code</code></pre></div>';
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
    expect(html).toBe(html);
  });
});

describe("コマンド", () => {
  it("setAllSelectionInCodeBlockコマンドでコードブロック全体を選択できる", () => {
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

    // コードブロック内にカーソルを配置
    editor.commands.setTextSelection(5);

    // コードブロック全体を選択
    editor.commands.setAllSelectionInCodeBlock();

    const { from, to } = editor.state.selection;

    expect(from).toBe(4);
    expect(to).toBe(25);
  });
  it("setCodeBlockContainerコマンドで段落をコードブロックに変換できる", () => {
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
      content: '<p>console.log("hello");</p>',
    });

    // 段落を選択
    editor.commands.setTextSelection(1);

    // コードブロックに変換
    editor.commands.setCodeBlockContainer({ language: "javascript" });

    const docString = editor.state.doc.toString();
    expect(docString).toBe(
      'doc(codeBlockContainer(codeBlockFileName, codeBlock("console.log(\\"hello\\");")))',
    );
  });

  it("setCodeBlockContainerコマンドで改行ありの段落を保持したまま呼び出せる", () => {
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
      content: '<p>console.log("hello");<br>console.log("world");</p>',
    });

    // 段落を選択
    editor.commands.setTextSelection(1);

    // コードブロックに変換
    editor.commands.setCodeBlockContainer({ language: "javascript" });

    const docString = editor.state.doc.toString();
    expect(docString).toBe(
      'doc(codeBlockContainer(codeBlockFileName, codeBlock("console.log(\\"hello\\");\\nconsole.log(\\"world\\");")))',
    );
  });

  it("setCodeBlockContainerコマンドをアコーディオンのサマリー部分で実行できない", () => {
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
        DetailsSummary,
        Details,
        DetailsContent,
      ],
      content:
        '<details><summary>Accordion summary</summary><div class="details-content">アコーディオンの内容</div></details>',
    });

    editor.commands.setTextSelection(2);

    const result = editor.commands.setCodeBlockContainer({
      language: "javascript",
    });
    expect(result).toBe(false);
  });

  it("unsetCodeBlockContainerコマンドでコードブロックを段落に戻せる", () => {
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

    // コードブロック内にカーソルを配置
    editor.commands.setTextSelection(2);

    // コードブロックを解除
    editor.commands.unsetCodeBlockContainer();

    const docString = editor.state.doc.toString();
    expect(docString).toBe('doc(paragraph("console.log(\\"hello\\");"))');
  });
});

describe("マークダウン", () => {
  it("JavaScriptコードブロックをマークダウンに変換できる", () => {
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

    const markdown = markdownSerializer.serialize(editor.state.doc);
    expect(markdown).toBe('```javascript\nconsole.log("hello");\n```');
  });

  it("言語名なしのコードブロックをマークダウンに変換できる", () => {
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

    const markdown = markdownSerializer.serialize(editor.state.doc);
    expect(markdown).toBe("```plaintext\nplaintext code\n```");
  });

  it("複数行のコードブロックをマークダウンに変換できる", () => {
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
        '<div class="code-block-container"><div class="code-block-filename-container"></div><pre><code class="language-python">def hello():\n    print("Hello, World!")\n    return True</code></pre></div>',
    });

    const markdown = markdownSerializer.serialize(editor.state.doc);
    expect(markdown).toBe(
      '```python\ndef hello():\n    print("Hello, World!")\n    return True\n```',
    );
  });

  it("マークダウンからコードブロックに変換", () => {
    const markdown = '```javascript\nconsole.log("hello");\n```';

    const html = fromMarkdown(markdown);
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
      content: html,
    });
    const docString = editor.state.doc.toString();

    expect(docString).toBe(
      'doc(codeBlockContainer(codeBlockFileName, codeBlock("console.log(\\"hello\\");")))',
    );
  });

  it("ファイル名付きマークダウンからコードブロックに変換", () => {
    const markdown = '```javascript:hello.js\nconsole.log("hello");\n```';

    const html = fromMarkdown(markdown);
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
      content: html,
    });
    const docString = editor.state.doc.toString();

    expect(docString).toBe(
      'doc(codeBlockContainer(codeBlockFileName("hello.js"), codeBlock("console.log(\\"hello\\");")))',
    );
  });
});
