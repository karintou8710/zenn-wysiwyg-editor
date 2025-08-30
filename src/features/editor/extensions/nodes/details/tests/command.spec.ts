import Document from "@tiptap/extension-document";
import Paragraph from "@tiptap/extension-paragraph";
import Text from "@tiptap/extension-text";
import { Editor } from "@tiptap/react";
import { describe, expect, it } from "vitest";
import { createEditorInstance } from "@/tests/editor-instance";
import { Details } from "..";
import { DetailsContent } from "../content";
import { DetailsSummary } from "../summary";

describe("コマンド", () => {
  it("setDetailsコマンドでアコーディオンを挿入できる", () => {
    const editor = createEditorInstance({
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
    const editor = createEditorInstance({
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
    const editor = createEditorInstance({
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
    const editor = createEditorInstance({
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
