import Document from "@tiptap/extension-document";
import Paragraph from "@tiptap/extension-paragraph";
import Text from "@tiptap/extension-text";
import { describe, expect, it } from "vitest";
import LakeImage from "@/assets/sikotuko.jpeg";
import { createEditorInstance } from "@/tests/editor-instance";
import Figure from "..";
import { Caption } from "../caption";
import { Image } from "../image";

const basicExtension = [Document, Paragraph, Text, Figure, Image, Caption];

describe("HTMLのパース・レンダリング", () => {
  it("Figureノードが正しいHTMLでレンダリングされる", () => {
    const editor = createEditorInstance({
      extensions: basicExtension,
      content: `<p><img src="${LakeImage}" alt="支笏湖"><em>支笏湖</em></p>`,
    });

    const html = editor.getHTML();
    expect(html).toBe(
      `<p><img src="${LakeImage}" alt="支笏湖" class="md-img"><em>支笏湖</em></p>`,
    );
  });
});
