import Document from "@tiptap/extension-document";
import Paragraph from "@tiptap/extension-paragraph";
import Text from "@tiptap/extension-text";
import { userEvent } from "@vitest/browser/context";
import { describe, expect, it } from "vitest";
import LakeImage from "@/assets/sikotuko.jpeg";
import { renderTiptapEditor } from "@/tests/editor";
import { wait } from "@/tests/utils";
import { Figure } from ".";
import { Caption } from "./caption";
import { Image } from "./image";

describe("InputRule", () => {
  it("![alt](src) で Figure ノードが作成される", async () => {
    const editor = renderTiptapEditor({
      content: "<p></p>",
      extensions: [Document, Paragraph, Text, Figure, Caption, Image],
    });

    editor.chain().focus().setTextSelection(1).run();
    await userEvent.type(editor.view.dom, `![支笏湖](${LakeImage}) `);

    const docString = editor.state.doc.toString();
    expect(docString).toBe('doc(figure(image, caption("支笏湖")))');
    expect(editor.state.selection.from).toBe(3);
    expect(editor.state.doc.firstChild?.firstChild?.attrs).toEqual({
      src: LakeImage,
      alt: "支笏湖",
      width: null,
    });
  });

  it("行の途中では InputRule が発動しない", async () => {
    const editor = renderTiptapEditor({
      content: "<p>Text</p>",
      extensions: [Document, Paragraph, Text, Figure, Caption, Image],
    });

    editor.chain().focus().setTextSelection(2).run();
    await userEvent.type(editor.view.dom, `![支笏湖](${LakeImage}) `);

    const docString = editor.state.doc.toString();
    expect(docString).toBe(`doc(paragraph("T![支笏湖](${LakeImage}) ext"))`);
  });
});

describe("キー入力", () => {
  it("キャプションの先頭で Backspace を押すとFigureが削除される", async () => {
    const editor = renderTiptapEditor({
      content: `<p><img src='${LakeImage}' alt='支笏湖'><em>支笏湖</em></p>`,
      extensions: [Document, Paragraph, Text, Image, Caption, Figure],
    });

    editor.chain().focus().setTextSelection(3).run();
    await userEvent.type(editor.view.dom, "{Backspace}");

    const docString = editor.state.doc.toString();
    expect(docString).toBe("doc(paragraph)");
    expect(editor.state.selection.from).toBe(1);
  });

  it("キャプション内で Enter を押すと、段落を挿入して移動する", async () => {
    const editor = renderTiptapEditor({
      content: `<p><img src='${LakeImage}' alt='支笏湖'><em>支笏湖</em></p>`,
      extensions: [Document, Paragraph, Text, Image, Caption, Figure],
    });

    editor.chain().focus().setTextSelection(4).run();
    await userEvent.type(editor.view.dom, "{Enter}");

    const docString = editor.state.doc.toString();
    expect(docString).toBe(`doc(figure(image, caption("支笏湖"))), paragraph`);
    expect(editor.state.selection.from).toBe(6);
  });

  it("キャプションの先頭で左矢印キーを押すと前のノードに移動する", async () => {
    const editor = renderTiptapEditor({
      content: `<p>Before</p><p><img src='${LakeImage}' alt='支笏湖'><em>支笏湖</em></p>`,
      extensions: [Document, Paragraph, Text, Figure, Caption, Image],
    });

    editor.chain().focus().setTextSelection(11).run();

    await wait(50); // カーソルの同期を待つ

    await userEvent.type(editor.view.dom, "{ArrowLeft}");

    await wait(50); // カーソルの同期を待つ

    expect(editor.state.selection.from).toBe(8); // "Before" の最後
  });

  it("ミッセージの末尾で右矢印キーを押すと次のノードに移動する", async () => {
    const editor = renderTiptapEditor({
      content: `<p>Before</p><p><img src='${LakeImage}' alt='支笏湖'><em>支笏湖</em></p><p>After</p>`,
      extensions: [Document, Paragraph, Text, Figure, Caption, Image],
    });

    editor.chain().focus().setTextSelection(7).run();

    await wait(50); // カーソルの同期を待つ

    await userEvent.type(editor.view.dom, "{ArrowRight}");

    await wait(50); // カーソルの同期を待つ

    expect(editor.state.selection.from).toBe(11); // "After" の最初
  });
});
