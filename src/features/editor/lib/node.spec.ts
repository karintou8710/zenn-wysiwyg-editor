import Blockquote from "@tiptap/extension-blockquote";
import Document from "@tiptap/extension-document";
import Paragraph from "@tiptap/extension-paragraph";
import Text from "@tiptap/extension-text";
import { Editor } from "@tiptap/react";
import { afterEach, describe, expect, it } from "vitest";
import { isChildOf } from "./node";

describe("isChildOf", () => {
  let editor: Editor;

  afterEach(() => {
    editor?.destroy();
  });

  it("ノードが指定された親の子である場合にtrueを返す", () => {
    editor = new Editor({
      extensions: [Document, Paragraph, Text, Blockquote],
      content: "<blockquote><p>test</p></blockquote>",
    });

    // blockquote > paragraph 内のテキストの位置
    const $pos = editor.state.doc.resolve(3);

    // paragraphがblockquoteの子供であることを確認
    expect(isChildOf($pos, "blockquote")).toBe(true);
  });

  it("ノードが指定された親の子でない場合にfalseを返す", () => {
    editor = new Editor({
      extensions: [Document, Paragraph, Text, Blockquote],
      content: "<p>test</p>",
    });

    // paragraph内のテキストの位置
    const $pos = editor.state.doc.resolve(2);

    // paragraphがblockquoteの子供でないことを確認
    expect(isChildOf($pos, "blockquote")).toBe(false);
  });

  it("ネストした親子関係でもtrueを返す", () => {
    editor = new Editor({
      extensions: [Document, Paragraph, Text, Blockquote],
      content: "<blockquote><blockquote><p>test</p></blockquote></blockquote>",
    });

    // 最内部のparagraph内のテキストの位置
    const $pos = editor.state.doc.resolve(5);

    // 複数レベル上のblockquoteの子供であることを確認
    expect(isChildOf($pos, "blockquote")).toBe(true);
  });

  it("ドキュメントルートの位置ではfalseを返す", () => {
    editor = new Editor({
      extensions: [Document, Paragraph, Text, Blockquote],
      content: "<p>test</p>",
    });

    // ドキュメントルートの位置
    const $pos = editor.state.doc.resolve(0);

    expect(isChildOf($pos, "paragraph")).toBe(false);
  });
});
