import Document from "@tiptap/extension-document";
import HardBreak from "@tiptap/extension-hard-break";
import Paragraph from "@tiptap/extension-paragraph";
import Text from "@tiptap/extension-text";
import { userEvent } from "@vitest/browser/context";
import { describe, expect, it } from "vitest";
import { waitSelectionChange } from "@/tests/dom";
import { renderTiptapEditor } from "@/tests/editor";
import { CodeBlock } from "../../code-block";
import { CodeBlockFileName } from "../../code-block-file-name";
import { CodeBlockContainer } from "../../index";
import { DiffCodeBlock } from "..";
import { DiffCodeLine } from "../diff-code-line";

const baseExtensions = [
  Document,
  Paragraph,
  Text,
  CodeBlockContainer,
  CodeBlock,
  CodeBlockFileName,
  DiffCodeBlock,
  DiffCodeLine,
  HardBreak,
];

describe("キーボードショートカット", () => {
  describe("Backspace", () => {
    it("差分コードブロックの先頭で Backspace を押すと解除", async () => {
      const editor = renderTiptapEditor({
        content: `<div class="code-block-container"><div class="code-block-filename-container"><span class="code-block-filename"></span></div>
          <pre><code class="language-diff-javascript diff-highlight"><span>Text</span></code></pre></div>`,
        extensions: baseExtensions,
      });

      await waitSelectionChange(() => {
        editor.chain().focus().setTextSelection(5).run();
      });
      await userEvent.keyboard("{Backspace}");

      const docString = editor.state.doc.toString();
      expect(docString).toBe('doc(paragraph("Text"))');
      expect(editor.state.selection.from).toBe(1);
    });

    it("ファイル名の先頭で Backspace を押しても何も起こらない", async () => {
      const editor = renderTiptapEditor({
        content: `<div class="code-block-container"><div class="code-block-filename-container"><span class="code-block-filename"></span></div>
          <pre><code class="language-diff-javascript diff-highlight"><span>Text</span></code></pre></div>`,
        extensions: baseExtensions,
      });

      await waitSelectionChange(() => {
        editor.chain().focus().setTextSelection(2).run();
      });
      await userEvent.keyboard("{Backspace}");

      const docString = editor.state.doc.toString();
      expect(docString).toBe(
        'doc(codeBlockContainer(codeBlockFileName, diffCodeBlock(diffCodeLine("Text"))))',
      );
      expect(editor.state.selection.from).toBe(2);
    });
  });

  describe("Enter", () => {
    it("文末でEnterを三回押すと差分コードブロックを脱出する", async () => {
      const editor = renderTiptapEditor({
        content: `<div class="code-block-container"><div class="code-block-filename-container"><span class="code-block-filename"></span></div>
          <pre><code class="language-diff-javascript diff-highlight"><span>Text</span></code></pre></div>`,
        extensions: baseExtensions,
      });

      await waitSelectionChange(() => {
        editor.chain().focus().setTextSelection(9).run();
      });
      await userEvent.keyboard("{Enter}{Enter}{Enter}");

      const docString = editor.state.doc.toString();
      expect(docString).toBe(
        'doc(codeBlockContainer(codeBlockFileName, diffCodeBlock(diffCodeLine("Text"))), paragraph)',
      );
      expect(editor.state.selection.from).toBe(13);
    });

    it("ファイル名でEnterを押すと何も起こらない", async () => {
      const editor = renderTiptapEditor({
        content: `<div class="code-block-container"><div class="code-block-filename-container"><span class="code-block-filename"></span></div>
          <pre><code class="language-diff-javascript diff-highlight"><span>Text</span></code></pre></div>`,
        extensions: baseExtensions,
      });

      await waitSelectionChange(() => {
        editor.chain().focus().setTextSelection(2).run();
      });
      await userEvent.keyboard("{Enter}");

      const docString = editor.state.doc.toString();
      expect(docString).toBe(
        'doc(codeBlockContainer(codeBlockFileName, diffCodeBlock(diffCodeLine("Text"))))',
      );
      expect(editor.state.selection.from).toBe(2);
    });
  });

  describe("ArrowLeft", () => {
    it("差分コードブロックの先頭で左矢印キーでファイル名の先頭に移動", async () => {
      const editor = renderTiptapEditor({
        content: `<div class="code-block-container"><div class="code-block-filename-container"><span class="code-block-filename"></span></div>
        <pre><code class="language-diff-javascript diff-highlight"><span>Text</span></code></pre></div>`,
        extensions: baseExtensions,
      });

      await waitSelectionChange(() => {
        editor.chain().focus().setTextSelection(5).run();
      });

      // NOTE: 理由が不明だが、テスト環境だと二回押さないと反応しない
      await userEvent.keyboard("{ArrowLeft}");
      await userEvent.keyboard("{ArrowLeft}");

      expect(editor.state.selection.from).toBe(2);
    });

    it("ファイル名の先頭で左矢印キーで直前ブロックの先頭に移動", async () => {
      const editor = renderTiptapEditor({
        content: `<p>Before</p><div class="code-block-container"><div class="code-block-filename-container"><span class="code-block-filename"></span></div>
          <pre><code class="language-javascript diff-highlight"><span>Text</span></code></pre></div>`,
        extensions: baseExtensions,
      });

      await waitSelectionChange(() => {
        editor.chain().focus().setTextSelection(10).run();
      });

      await userEvent.keyboard("{ArrowLeft}");

      expect(editor.state.selection.from).toBe(7);
    });

    it("差分コードブロックの直後で左矢印キーで差分コードブロックの末尾に移動", async () => {
      const editor = renderTiptapEditor({
        content: `<div class="code-block-container"><div class="code-block-filename-container"><span class="code-block-filename"></span></div>
        <pre><code class="language-diff-javascript diff-highlight"><span>Text</span></code></pre></div><p>After</p>`,
        extensions: baseExtensions,
      });

      await waitSelectionChange(() => {
        editor.chain().focus().setTextSelection(13).run();
      });

      await userEvent.keyboard("{ArrowLeft}");

      expect(editor.state.selection.from).toBe(9);
    });
  });

  describe("ArrowRight", () => {
    it("コードブロックの末尾で右矢印キーで次ノードに移動", async () => {
      const editor = renderTiptapEditor({
        content: `<div class="code-block-container"><div class="code-block-filename-container"><span class="code-block-filename"></span></div>
        <pre><code class="language-diff-javascript diff-highlight"><span>Text</span></code></pre></div><p>After</p>`,
        extensions: baseExtensions,
      });

      await waitSelectionChange(() => {
        editor.chain().focus().setTextSelection(9).run();
      });

      await userEvent.keyboard("{ArrowRight}");

      expect(editor.state.selection.from).toBe(13);
    });

    it("ファイル名のの末尾で右矢印キーでコードブロックの先頭に移動", async () => {
      const editor = renderTiptapEditor({
        content: `<div class="code-block-container"><div class="code-block-filename-container"><span class="code-block-filename"></span></div>
          <pre><code class="language-diff-javascript diff-highlight"><span>Text</span></code></pre></div>`,
        extensions: baseExtensions,
      });

      await waitSelectionChange(() => {
        editor.chain().focus().setTextSelection(2).run();
      });
      await userEvent.keyboard("{ArrowRight}");

      expect(editor.state.selection.from).toBe(5);
    });

    it("前のノードの末尾で右矢印キーを押すと、ファイル名の先頭に移動", async () => {
      const editor = renderTiptapEditor({
        content: `<p>Before</p><div class="code-block-container"><div class="code-block-filename-container"><span class="code-block-filename"></span></div>
          <pre><code class="language-diff-javascript diff-highlight"><span>Text</span></code></pre></div>`,
        extensions: baseExtensions,
      });

      await waitSelectionChange(() => {
        editor.chain().focus().setTextSelection(7).run();
      });
      await userEvent.keyboard("{ArrowRight}");

      expect(editor.state.selection.from).toBe(10);
    });
  });
});
