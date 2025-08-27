import Document from "@tiptap/extension-document";
import Paragraph from "@tiptap/extension-paragraph";
import Text from "@tiptap/extension-text";
import { Editor } from "@tiptap/react";
import { describe, expect, it } from "vitest";
import LakeImage from "@/assets/sikotuko.jpeg";
import { fromMarkdown } from "@/features/editor/lib/from-markdown";
import { markdownSerializer } from "@/features/editor/lib/to-markdown";
import Figure from ".";
import { Caption } from "./caption";
import { Image } from "./image";

describe("HTMLのパース・レンダリング", () => {
  it("画像タグをFigureノードとしてパースできる", () => {
    const editor = new Editor({
      extensions: [Document, Paragraph, Text, Figure, Image, Caption],
      content: `<p><img src="${LakeImage}" alt="支笏湖"><em>支笏湖</em></p>`,
    });

    const docString = editor.state.doc.toString();

    expect(docString).toBe('doc(figure(image, caption("支笏湖")))');
    expect(editor.state.doc.firstChild?.firstChild?.attrs).toEqual({
      src: LakeImage,
      alt: "支笏湖",
      width: null,
    });
  });

  it("改行付き画像タグをFigureノードとしてパースできる", () => {
    const editor = new Editor({
      extensions: [Document, Paragraph, Text, Figure, Image, Caption],
      content: `<p><img src="${LakeImage}" alt="支笏湖"><br/><em>支笏湖</em></p>`,
    });

    const docString = editor.state.doc.toString();

    expect(docString).toBe('doc(figure(image, caption("支笏湖")))');
    expect(editor.state.doc.firstChild?.firstChild?.attrs).toEqual({
      src: LakeImage,
      alt: "支笏湖",
      width: null,
    });
  });

  it("キャプションが空の画像タグをFigureノードとしてパースできる", () => {
    const editor = new Editor({
      extensions: [Document, Paragraph, Text, Figure, Image, Caption],
      content: `<p><img src="${LakeImage}" alt="支笏湖"><br/><em></em></p>`,
    });

    const docString = editor.state.doc.toString();

    expect(docString).toBe("doc(figure(image, caption))");
    expect(editor.state.doc.firstChild?.firstChild?.attrs).toEqual({
      src: LakeImage,
      alt: "支笏湖",
      width: null,
    });
  });

  it("Figureノードが正しいHTMLでレンダリングされる", () => {
    const editor = new Editor({
      extensions: [Document, Paragraph, Text, Figure, Image, Caption],
      content: `<p><img src="${LakeImage}" alt="支笏湖"><em>支笏湖</em></p>`,
    });

    const html = editor.getHTML();
    expect(html).toBe(
      `<p><img src="${LakeImage}" alt="支笏湖" class="md-img"><em>支笏湖</em></p>`,
    );
  });
});

describe("コマンド", () => {
  it("setFigureコマンドで画像とキャプション付きのFigureノードを挿入できる", () => {
    const editor = new Editor({
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
    const editor = new Editor({
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
    const editor = new Editor({
      extensions: [Document, Paragraph, Text, Figure, Image, Caption],
      content: `<p><img src="${LakeImage}" alt="支笏湖"><em>支笏湖</em></p>`,
    });

    editor.commands.setTextSelection(2);
    editor.commands.clearFigure();

    const docString = editor.state.doc.toString();
    expect(docString).toBe("doc(paragraph)");
  });

  it("clearFigureコマンドはFigureノード外では動作しない", () => {
    const editor = new Editor({
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

describe("マークダウン", () => {
  it("Figureノードをマークダウンに変換できる", () => {
    const editor = new Editor({
      extensions: [Document, Paragraph, Text, Figure, Image, Caption],
      content: `<p><img src="${LakeImage}" alt="支笏湖"><em>支笏湖</em></p>`,
    });

    const markdown = markdownSerializer.serialize(editor.state.doc);

    expect(markdown).toBe(`![支笏湖](${LakeImage})\n*支笏湖*`);
  });

  it("キャプションなしのFigureノードをマークダウンに変換できる", () => {
    const editor = new Editor({
      extensions: [Document, Paragraph, Text, Figure, Image, Caption],
      content: `<p><img src="${LakeImage}" alt="支笏湖"></p>`,
    });

    const markdown = markdownSerializer.serialize(editor.state.doc);

    expect(markdown).toBe(`![支笏湖](${LakeImage})`);
  });

  it("マークダウンからFigureノードに変換", () => {
    const markdown = `![支笏湖](${LakeImage})\n*支笏湖*`;

    const html = fromMarkdown(markdown);
    const editor = new Editor({
      extensions: [Document, Paragraph, Text, Figure, Image, Caption],
      content: html,
    });
    const docString = editor.state.doc.toString();

    expect(docString).toBe('doc(figure(image, caption("支笏湖")))');
  });

  it("キャプションなしのマークダウンからFigureノードに変換", () => {
    const markdown = `![支笏湖](${LakeImage})`;

    const html = fromMarkdown(markdown);
    const editor = new Editor({
      extensions: [Document, Paragraph, Text, Figure, Image, Caption],
      content: html,
    });
    const docString = editor.state.doc.toString();

    expect(docString).toBe("doc(figure(image, caption))");
  });
});
