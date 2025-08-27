import Document from "@tiptap/extension-document";
import Paragraph from "@tiptap/extension-paragraph";
import Text from "@tiptap/extension-text";
import { Editor } from "@tiptap/react";
import { describe, expect, it } from "vitest";
import { fromMarkdown } from "@/features/editor/lib/from-markdown";
import { markdownSerializer } from "@/features/editor/lib/to-markdown";
import { Details } from ".";
import { DetailsContent } from "./content";
import { DetailsSummary } from "./summary";

describe("HTMLのパース・レンダリング", () => {
  it("アコーディオンのHTMLをパースできる", () => {
    const editor = new Editor({
      extensions: [
        Document,
        Paragraph,
        Text,
        Details,
        DetailsContent,
        DetailsSummary,
      ],
      content:
        '<details><summary></summary><div class="details-content"><p>テキスト</p></div></details>',
    });

    const docString = editor.state.doc.toString();

    expect(docString).toBe(
      'doc(details(detailsSummary, detailsContent(paragraph("テキスト"))))',
    );
  });

  it("アコーディオンが正しいHTMLでレンダリングされる", () => {
    const editor = new Editor({
      extensions: [
        Document,
        Paragraph,
        Text,
        Details,
        DetailsContent,
        DetailsSummary,
      ],
      content:
        '<details><summary></summary><div class="details-content"><p>テキスト</p></div></details>',
    });

    const html = editor.getHTML();
    expect(html).toContain("<details>");
    expect(html).toContain("<summary></summary>");
    expect(html).toContain('<div class="details-content">');
    expect(html).toContain("<p>テキスト</p>");
    expect(html).toContain("</div>");
    expect(html).toContain("</details>");
  });

  it("HTMLにレンダリング後、パースできる", () => {
    const editor = new Editor({
      extensions: [
        Document,
        Paragraph,
        Text,
        Details,
        DetailsContent,
        DetailsSummary,
      ],
      content:
        '<details><summary></summary><div class="details-content"><p>テキスト</p></div></details>',
    });

    const html = editor.getHTML();

    editor.commands.setContent(html);
    const docString = editor.state.doc.toString();

    expect(docString).toBe(
      'doc(details(detailsSummary, detailsContent(paragraph("テキスト"))))',
    );
  });
});

describe("コマンド", () => {
  it("setDetailsコマンドでアコーディオンを挿入できる", () => {
    const editor = new Editor({
      extensions: [
        Document,
        Paragraph,
        Text,
        Details,
        DetailsContent,
        DetailsSummary,
      ],
      content: "<p>テキスト</p>",
    });

    editor.commands.setDetails();

    const docString = editor.state.doc.toString();
    expect(docString).toBe(
      'doc(details(detailsSummary, detailsContent(paragraph("テキスト"))))',
    );
  });

  it("setDetailsコマンドはアコーディオンタイトル内で実行できない", () => {
    const editor = new Editor({
      extensions: [
        Document,
        Paragraph,
        Text,
        Details,
        DetailsContent,
        DetailsSummary,
      ],
      content:
        '<details><summary></summary><div class="details-content"><p>テキスト</p></div></details>',
    });

    // アコーディオン外にカーソルがある場合
    editor.commands.setTextSelection(2);
    expect(editor.can().setDetails()).toBe(false);
  });

  it("unsetDetailsコマンドでアコーディオンを削除できる", () => {
    const editor = new Editor({
      extensions: [
        Document,
        Paragraph,
        Text,
        Details,
        DetailsContent,
        DetailsSummary,
      ],
      content:
        '<details><summary></summary><div class="details-content"><p>テキスト</p></div></details>',
    });

    editor.commands.unsetDetails();

    const docString = editor.state.doc.toString();
    expect(docString).toBe('doc(paragraph, paragraph("テキスト"))');
  });

  it("unsetDetailsコマンドはアコーディオン内にカーソルがある場合にのみ有効", () => {
    const editor = new Editor({
      extensions: [
        Document,
        Paragraph,
        Text,
        Details,
        DetailsContent,
        DetailsSummary,
      ],
      content:
        '<details><summary></summary><div class="details-content"><p>テキスト</p></div></details><p>テキスト2</p>',
    });

    // アコーディオン外にカーソルがある場合
    editor.commands.setTextSelection(15);
    expect(editor.can().unsetDetails()).toBe(false);
  });
});

describe("マークダウン", () => {
  it("アコーディオンのマークダウン記法で出力できる", () => {
    const editor = new Editor({
      extensions: [
        Document,
        Paragraph,
        Text,
        Details,
        DetailsContent,
        DetailsSummary,
      ],
      content:
        '<details><summary>summary</summary><div class="details-content"><p>テキスト</p></div></details>',
    });

    const markdown = markdownSerializer.serialize(editor.state.doc);

    expect(markdown).toBe(":::details summary\nテキスト\n\n:::");
  });

  it("アコーディオンのネストをマークダウン記法に出力できる", () => {
    const editor = new Editor({
      extensions: [
        Document,
        Paragraph,
        Text,
        Details,
        DetailsContent,
        DetailsSummary,
      ],
      content: `<details><summary>summary</summary><div class="details-content">
        <p>テキスト</p>
            <details><summary>nest summary</summary><div class="details-content">
                <p>ネスト</p>
            </div></details>
        </div>
        </details>`,
    });

    const markdown = markdownSerializer.serialize(editor.state.doc);

    expect(markdown).toBe(
      "::::details summary\nテキスト\n\n:::details nest summary\nネスト\n\n:::\n\n::::",
    );
  });

  it("マークダウンからアコーディオンをパースできる", () => {
    const markdown = ":::details summary\nテキスト\n\n:::";
    const html = fromMarkdown(markdown);

    const editor = new Editor({
      extensions: [
        Document,
        Paragraph,
        Text,
        Details,
        DetailsContent,
        DetailsSummary,
      ],
      content: html,
    });

    const docString = editor.state.doc.toString();

    expect(docString).toBe(
      'doc(details(detailsSummary("summary"), detailsContent(paragraph("テキスト"))))',
    );
  });
});
