import Document from "@tiptap/extension-document";
import HardBreak from "@tiptap/extension-hard-break";
import Paragraph from "@tiptap/extension-paragraph";
import Text from "@tiptap/extension-text";
import { Editor } from "@tiptap/react";
import { describe, expect, it } from "vitest";
import { Details } from "../../details";
import { DetailsContent } from "../../details/content";
import { DetailsSummary } from "../../details/summary";
import { CodeBlockFileName } from "../code-block-file-name";
import { DiffCodeBlock } from "../diff-code-block";
import { DiffCodeLine } from "../diff-code-block/diff-code-line";
import { CodeBlockContainer } from "../index";
import { CodeBlock } from "./index";

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
