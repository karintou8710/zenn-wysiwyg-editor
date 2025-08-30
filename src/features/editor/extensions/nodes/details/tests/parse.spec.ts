import Document from "@tiptap/extension-document";
import Paragraph from "@tiptap/extension-paragraph";
import Text from "@tiptap/extension-text";
import { describe, expect, it } from "vitest";
import { createEditorInstance } from "@/tests/editor-instance";
import { Details } from "..";
import { DetailsContent } from "../content";
import { DetailsSummary } from "../summary";

describe("HTMLのパース・レンダリング", () => {
  it("アコーディオンのHTMLをパースできる", () => {
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

    const docString = editor.state.doc.toString();

    expect(docString).toBe(
      'doc(details(detailsSummary, detailsContent(paragraph("テキスト"))))',
    );
  });
});
