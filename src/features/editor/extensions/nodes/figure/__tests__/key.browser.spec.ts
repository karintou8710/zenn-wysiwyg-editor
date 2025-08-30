import Document from "@tiptap/extension-document";
import Paragraph from "@tiptap/extension-paragraph";
import Text from "@tiptap/extension-text";
import { userEvent } from "@vitest/browser/context";
import { describe, expect, it } from "vitest";
import LakeImage from "@/assets/sikotuko.jpeg";
import { waitSelectionChange } from "@/tests/dom";
import { renderTiptapEditor } from "@/tests/editor";
import { Caption } from "../caption";
import { Image } from "../image";
import { Figure } from "../index";

const basicExtension = [Document, Paragraph, Text, Figure, Caption, Image];

describe("キー入力", () => {
  it("キャプションの先頭で Backspace を押すとFigureが削除される", async () => {
    const editor = renderTiptapEditor({
      content: `<p><img src='${LakeImage}' alt='支笏湖'><em>支笏湖</em></p>`,
      extensions: basicExtension,
    });

    await waitSelectionChange(() => {
      editor.chain().focus().setTextSelection(3).run();
    });
    await userEvent.keyboard("{Backspace}");

    const docString = editor.state.doc.toString();
    expect(docString).toBe("doc(paragraph)");
    expect(editor.state.selection.from).toBe(1);
  });

  it("キャプション内で Enter を押すと、段落を挿入して移動する", async () => {
    const editor = renderTiptapEditor({
      content: `<p><img src='${LakeImage}' alt='支笏湖'><em>支笏湖</em></p>`,
      extensions: basicExtension,
    });

    await waitSelectionChange(() => {
      editor.chain().focus().setTextSelection(4).run();
    });
    await userEvent.keyboard("{Enter}");

    const docString = editor.state.doc.toString();
    expect(docString).toBe(`doc(figure(image, caption("支笏湖")), paragraph)`);
    expect(editor.state.selection.from).toBe(9);
  });

  it("キャプションの先頭で左矢印キーを押すと前のノードに移動する", async () => {
    const editor = renderTiptapEditor({
      content: `<p>Before</p><p><img src='${LakeImage}' alt='支笏湖'><em>支笏湖</em></p>`,
      extensions: basicExtension,
    });

    await waitSelectionChange(() => {
      editor.chain().focus().setTextSelection(11).run();
    });

    await userEvent.keyboard("{ArrowLeft}");

    expect(editor.state.selection.from).toBe(7); // "Before" の最後
  });

  it("キャプションの末尾で右矢印キーを押すと次のノードに移動する", async () => {
    const editor = renderTiptapEditor({
      content: `<p><img src='${LakeImage}' alt='支笏湖'><em>支笏湖</em></p><p>After</p>`,
      extensions: basicExtension,
    });

    await waitSelectionChange(() => {
      editor.chain().focus().setTextSelection(6).run();
    });

    await userEvent.keyboard("{ArrowRight}");

    expect(editor.state.selection.from).toBe(9); // "After" の最初
  });
});
