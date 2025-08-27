import Document from "@tiptap/extension-document";
import Paragraph from "@tiptap/extension-paragraph";
import Text from "@tiptap/extension-text";
import { page, userEvent } from "@vitest/browser/context";
import { describe, expect, it } from "vitest";
import LakeImage from "@/assets/sikotuko.jpeg";
import { setSelection, waitSelectionChange } from "@/tests/dom";
import { renderTiptapEditor } from "@/tests/editor";
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
    await userEvent.type(editor.view.dom, `!{\\[}支笏湖{\\]}(${LakeImage}) `);

    const docString = editor.state.doc.toString();
    expect(docString).toBe("doc(figure(image, caption))");
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
    await userEvent.type(editor.view.dom, `!{\\[}支笏湖{\\]}(${LakeImage}) `);

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
    expect(docString).toBe(`doc(figure(image, caption("支笏湖")), paragraph)`);
    expect(editor.state.selection.from).toBe(9);
  });

  it("キャプションの先頭で左矢印キーを押すと前のノードに移動する", async () => {
    const editor = renderTiptapEditor({
      content: `<p>Before</p><p><img src='${LakeImage}' alt='支笏湖'><em>支笏湖</em></p>`,
      extensions: [Document, Paragraph, Text, Figure, Caption, Image],
    });

    await waitSelectionChange(() => {
      editor.chain().focus().setTextSelection(11).run();
    });

    await waitSelectionChange(async () => {
      await userEvent.type(editor.view.dom, "{ArrowLeft}");
    });

    expect(editor.state.selection.from).toBe(7); // "Before" の最後
  });

  it("キャプションの末尾で右矢印キーを押すと次のノードに移動する", async () => {
    const editor = renderTiptapEditor({
      content: `<p><img src='${LakeImage}' alt='支笏湖'><em>支笏湖</em></p><p>After</p>`,
      extensions: [Document, Paragraph, Text, Figure, Caption, Image],
    });

    await waitSelectionChange(() => {
      editor.chain().focus().setTextSelection(6).run();
    });

    await waitSelectionChange(async () => {
      await userEvent.type(editor.view.dom, "{ArrowRight}");
    });

    expect(editor.state.selection.from).toBe(9); // "After" の最初
  });
});

describe("ペースト", () => {
  it("![alt](src) をペーストすると Figure ノードが作成される", async () => {
    const editor = renderTiptapEditor({
      content: "",
      extensions: [Document, Paragraph, Text, Figure, Caption, Image],
    });

    const p = document.createElement("p");
    p.textContent = `![支笏湖](${LakeImage})`;
    document.body.appendChild(p);

    setSelection(p);
    expect(window.getSelection()?.anchorNode).toBe(p);

    await userEvent.copy();
    await waitSelectionChange(() => {
      editor.chain().focus().run();
    });

    expect(window.getSelection()?.anchorNode).toBe(editor.view.dom.firstChild);
    await userEvent.paste();
    await expect.element(page.getByRole("img")).toBeVisible();

    const docString = editor.state.doc.toString();
    expect(docString).toBe("doc(figure(image, caption))");
    expect(editor.state.selection.from).toBe(3);
    expect(editor.state.doc.firstChild?.firstChild?.attrs).toEqual({
      src: LakeImage,
      alt: "支笏湖",
      width: null,
    });

    p.remove(); // クリーンアップ
  });

  it("拡張子がjpegの画像URLをペーストするとFigureノードが作成される", async () => {
    const editor = renderTiptapEditor({
      content: "",
      extensions: [Document, Paragraph, Text, Figure, Caption, Image],
    });
    const url = `${location.origin}${LakeImage}`;

    const p = document.createElement("p");
    p.textContent = url;
    document.body.appendChild(p);

    setSelection(p);
    expect(window.getSelection()?.anchorNode).toBe(p);
    await userEvent.copy();
    await waitSelectionChange(() => {
      editor.chain().focus().setTextSelection(1).run();
    });
    expect(window.getSelection()?.anchorNode).toBe(editor.view.dom.firstChild);

    await userEvent.paste();

    // altがないとgetByRoleで弾かれる
    editor.commands.command(({ tr }) => {
      tr.setNodeAttribute(1, "alt", "支笏湖");
      return true;
    });
    await expect.element(page.getByRole("img")).toBeVisible();

    const docString = editor.state.doc.toString();
    expect(docString).toBe("doc(figure(image, caption))");
    expect(editor.state.selection.from).toBe(3);
    expect(editor.state.doc.firstChild?.firstChild?.attrs).toEqual({
      src: url,
      alt: "支笏湖",
      width: null,
    });

    p.remove(); // クリーンアップ
  });

  it("webkit copy test", async () => {
    const input = document.createElement("input");
    input.placeholder = "source";
    document.body.appendChild(input);

    const target = document.createElement("input");
    target.placeholder = "target";
    document.body.appendChild(target);

    // write to 'source'
    await userEvent.click(page.getByPlaceholder("source"));
    await userEvent.keyboard("hello");

    // select and copy 'source'
    await userEvent.dblClick(page.getByPlaceholder("source"));
    await userEvent.copy();

    // paste to 'target'
    await userEvent.click(page.getByPlaceholder("target"));
    await userEvent.paste();

    await expect.element(page.getByPlaceholder("source")).toHaveValue("hello");
    await expect.element(page.getByPlaceholder("target")).toHaveValue("hello");

    input.remove(); // クリーンアップ
  });
});
