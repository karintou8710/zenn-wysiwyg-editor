import Document from "@tiptap/extension-document";
import Paragraph from "@tiptap/extension-paragraph";
import Text from "@tiptap/extension-text";
import { describe, expect, it } from "vitest";
import LakeImage from "@/assets/sikotuko.jpeg";
import { createEditorInstance } from "@/tests/editor-instance";
import Figure from "..";
import { Caption } from "../caption";
import { Image } from "../image";

describe("コマンド", () => {
  it("setFigureコマンドで画像とキャプション付きのFigureノードを挿入できる", () => {
    const editor = createEditorInstance({
      extensions: [Document, Paragraph, Text, Figure, Image, Caption],
      content: "<p></p>",
    });

    editor.commands.setFigure({
      src: LakeImage,
      alt: "支笏湖",
      caption: "美しい支笏湖",
    });

    const docString = editor.state.doc.toString();
    expect(docString).toBe('doc(figure(image, caption("美しい支笏湖")))');

    const figureNode = editor.state.doc.child(0);
    expect(figureNode?.firstChild?.attrs).toEqual({
      src: LakeImage,
      alt: "支笏湖",
      width: null,
    });
  });

  it("setFigureコマンドでキャプションなしのFigureノードを挿入できる", () => {
    const editor = createEditorInstance({
      extensions: [Document, Paragraph, Text, Figure, Image, Caption],
      content: "<p></p>",
    });

    editor.commands.setFigure({
      src: LakeImage,
      alt: "支笏湖",
    });

    const docString = editor.state.doc.toString();
    expect(docString).toBe("doc(figure(image, caption))");

    const figureNode = editor.state.doc.child(0);
    expect(figureNode?.firstChild?.attrs).toEqual({
      src: LakeImage,
      alt: "支笏湖",
      width: null,
    });
  });

  it("clearFigureコマンドでFigureノードを削除できる", () => {
    const editor = createEditorInstance({
      extensions: [Document, Paragraph, Text, Figure, Image, Caption],
      content: `<p><img src="${LakeImage}" alt="支笏湖"><em>支笏湖</em></p>`,
    });

    editor.commands.setTextSelection(2);
    editor.commands.clearFigure();

    const docString = editor.state.doc.toString();
    expect(docString).toBe("doc(paragraph)");
  });

  it("clearFigureコマンドはFigureノード外では動作しない", () => {
    const editor = createEditorInstance({
      extensions: [Document, Paragraph, Text, Figure, Image, Caption],
      content: `<p>普通の段落</p><p><img src="${LakeImage}" alt="支笏湖"><em>支笏湖</em></p>`,
    });

    editor.commands.setTextSelection(2);
    const result = editor.commands.clearFigure();

    expect(result).toBe(false);
    const docString = editor.state.doc.toString();
    expect(docString).toBe(
      'doc(paragraph("普通の段落"), figure(image, caption("支笏湖")))',
    );
  });
});
