import Document from "@tiptap/extension-document";
import Paragraph from "@tiptap/extension-paragraph";
import Text from "@tiptap/extension-text";
import { userEvent } from "@vitest/browser/context";
import { describe, expect, it } from "vitest";
import LakeImage from "@/assets/sikotuko.jpeg";
import { waitSelectionChange } from "@/tests/dom";
import { copyText, renderTiptapEditor } from "@/tests/editor";
import { Details } from "../../details";
import { DetailsContent } from "../../details/content";
import { DetailsSummary } from "../../details/summary";
import { Embed } from "../../embed";
import { EmbedPasteHandler } from "../../embed/embed-paste-handler";
import { Caption } from "../caption";
import { Image } from "../image";
import { Figure } from "../index";

const basicExtension = [Document, Paragraph, Text, Figure, Caption, Image];

describe("ペースト", () => {
  it("![alt](src) をペーストすると Figure ノードが作成される", async () => {
    const editor = renderTiptapEditor({
      content: "",
      extensions: basicExtension,
    });

    const input = document.createElement("input");
    input.value = `![支笏湖](${LakeImage})`;
    document.body.appendChild(input);

    await userEvent.tripleClick(input);
    await userEvent.copy();

    await waitSelectionChange(() => {
      editor.chain().focus().run();
    });

    await userEvent.paste();

    const docString = editor.state.doc.toString();
    expect(docString).toBe("doc(figure(image, caption))");
    expect(editor.state.selection.from).toBe(3);
    expect(editor.state.doc.firstChild?.firstChild?.attrs).toEqual({
      src: LakeImage,
      alt: "支笏湖",
      width: null,
    });

    input.remove(); // クリーンアップ
  });

  it("拡張子がjpegの画像URLをペーストするとFigureノードが作成される(埋め込みより優先)", async () => {
    const editor = renderTiptapEditor({
      content: "",
      extensions: [...basicExtension, Embed, EmbedPasteHandler],
    });
    const url = `${location.origin}${LakeImage}`;

    await copyText(url);
    await waitSelectionChange(() => {
      editor.chain().focus().setTextSelection(1).run();
    });
    await userEvent.paste();

    const docString = editor.state.doc.toString();
    expect(docString).toBe("doc(figure(image, caption))");
    expect(editor.state.selection.from).toBe(3);
    expect(editor.state.doc.firstChild?.firstChild?.attrs).toEqual({
      src: url,
      alt: "",
      width: null,
    });
  });

  it("アコーディオンのタイトルでペーストしても、Figureノードが生成されない", async () => {
    const editor = renderTiptapEditor({
      content:
        '<details><summary></summary><div class="details-content"><p>Text</p></div></details>',
      extensions: [...basicExtension, Details, DetailsContent, DetailsSummary],
    });

    await copyText(`![支笏湖](${LakeImage})`);
    await waitSelectionChange(() => {
      editor.chain().focus().setTextSelection(2).run();
    });
    await userEvent.paste();

    const docString = editor.state.doc.toString();
    expect(docString).toBe(
      `doc(details(detailsSummary("![支笏湖](${LakeImage})"), detailsContent(paragraph("Text"))))`,
    );
  });
});
