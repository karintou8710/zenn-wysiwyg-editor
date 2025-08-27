import Document from "@tiptap/extension-document";
import Paragraph from "@tiptap/extension-paragraph";
import Text from "@tiptap/extension-text";
import { userEvent } from "@vitest/browser/context";
import { describe, expect, it } from "vitest";
import { waitSelectionChange } from "@/tests/dom";
import { renderTiptapEditor } from "@/tests/editor";
import { DetailsContent } from "./content";
import { Details } from "./index";
import { DetailsSummary } from "./summary";

describe("InputRule", () => {
  it(":::details で アコーディオンブロックが作成される", async () => {
    const editor = renderTiptapEditor({
      content: "<p>Text</p>",
      extensions: [
        Document,
        Paragraph,
        Text,
        Details,
        DetailsContent,
        DetailsSummary,
      ],
    });

    await waitSelectionChange(() => {
      editor.chain().focus().run();
    });
    await userEvent.type(editor.view.dom, ":::details ");

    const docString = editor.state.doc.toString();
    expect(docString).toBe(
      'doc(details(detailsSummary, detailsContent(paragraph("Text"))))',
    );
    expect(editor.state.selection.from).toBe(2);
  });

  it("行の途中では InputRule が発動しない", async () => {
    const editor = renderTiptapEditor({
      content: "<p>Text</p>",
      extensions: [
        Document,
        Paragraph,
        Text,
        Details,
        DetailsContent,
        DetailsSummary,
      ],
    });

    await waitSelectionChange(() => {
      editor.chain().focus().setTextSelection(2).run();
    });
    await userEvent.type(editor.view.dom, ":::details ");

    const docString = editor.state.doc.toString();
    expect(docString).toBe('doc(paragraph("T:::details ext"))');
  });

  it("アコーディオンのタイトル内では InputRule が発動しない", async () => {
    const editor = renderTiptapEditor({
      content:
        '<details><summary>Title</summary><div class="details-content"><p>Text</p></div></details>',
      extensions: [
        Document,
        Paragraph,
        Text,
        Details,
        DetailsContent,
        DetailsSummary,
      ],
    });

    await waitSelectionChange(() => {
      editor.chain().focus().setTextSelection(2).run();
    });
    await userEvent.type(editor.view.dom, ":::details ");

    const docString = editor.state.doc.toString();
    expect(docString).toBe(
      'doc(details(detailsSummary(":::details Title"), detailsContent(paragraph("Text"))))',
    );
  });
});

describe("キー入力", () => {
  describe("Backspace", () => {
    it("サマリーの先頭で Backspace を押すとアコーディオンブロックが解除される", async () => {
      const editor = renderTiptapEditor({
        content:
          '<details><summary>Title</summary><div class="details-content"><p>Text</p></div></details>',
        extensions: [
          Document,
          Paragraph,
          Text,
          Details,
          DetailsContent,
          DetailsSummary,
        ],
      });

      await waitSelectionChange(() => {
        editor.chain().focus().setTextSelection(2).run();
      });
      await userEvent.type(editor.view.dom, "{Backspace}");

      const docString = editor.state.doc.toString();
      expect(docString).toBe('doc(paragraph("Title"), paragraph("Text"))');
      expect(editor.state.selection.from).toBe(1);
    });
  });

  describe("Enter", () => {
    it("サマリー内かつコンテンツが閉じた状態で Enter 段落を挿入して移動する", async () => {
      const editor = renderTiptapEditor({
        content:
          '<details><summary>Title</summary><div class="details-content"><p>Text</p></div></details>',
        extensions: [
          Document,
          Paragraph,
          Text,
          Details,
          DetailsContent,
          DetailsSummary,
        ],
      });

      await waitSelectionChange(() => {
        editor.chain().focus().setTextSelection(4).run();
      });
      await userEvent.type(editor.view.dom, "{Enter}");

      const docString = editor.state.doc.toString();
      expect(docString).toBe(
        'doc(details(detailsSummary("Title"), detailsContent(paragraph("Text"))), paragraph)',
      );
      expect(editor.state.selection.from).toBe(18);
    });

    it("サマリー内かつコンテンツが開いた状態で Enter コンテンツに段落を挿入して移動する", async () => {
      const editor = renderTiptapEditor({
        content:
          '<details open="true"><summary>Title</summary><div class="details-content"><p>Text</p></div></details>',
        extensions: [
          Document,
          Paragraph,
          Text,
          Details,
          DetailsContent,
          DetailsSummary,
        ],
      });

      await waitSelectionChange(() => {
        editor.chain().focus().setTextSelection(4).run();
      });
      await userEvent.type(editor.view.dom, "{Enter}");

      const docString = editor.state.doc.toString();
      expect(docString).toBe(
        'doc(details(detailsSummary("Title"), detailsContent(paragraph, paragraph("Text"))))',
      );
      expect(editor.state.selection.from).toBe(10);
    });
  });

  describe("左矢印キーによる移動", () => {
    it("サマリーの先頭で左矢印キーを押すと前のノードに移動する", async () => {
      const editor = renderTiptapEditor({
        content:
          '<p>Before</p><details><summary>Title</summary><div class="details-content"><p>Text</p></div></details>',
        extensions: [
          Document,
          Paragraph,
          Text,
          Details,
          DetailsContent,
          DetailsSummary,
        ],
      });

      await waitSelectionChange(() => {
        editor.chain().focus().setTextSelection(10).run();
      });

      await waitSelectionChange(async () => {
        await userEvent.type(editor.view.dom, "{ArrowLeft}");
      });

      expect(editor.state.selection.from).toBe(7); // "Before" の最後
    });

    it("コンテンツの先頭で左矢印キーを押すと前のノードに移動する", async () => {
      const editor = renderTiptapEditor({
        content:
          '<details open="true"><summary>Title</summary><div class="details-content"><p>Text</p></div></details>',
        extensions: [
          Document,
          Paragraph,
          Text,
          Details,
          DetailsContent,
          DetailsSummary,
        ],
      });

      await waitSelectionChange(() => {
        editor.chain().focus().setTextSelection(10).run();
      });

      await waitSelectionChange(async () => {
        await userEvent.type(editor.view.dom, "{ArrowLeft}");
      });

      expect(editor.state.selection.from).toBe(7); // タイトルの末尾
    });

    it("開いたコンテンツの直後で左矢印キーを押すと、コンテンツの末尾に移動する", async () => {
      const editor = renderTiptapEditor({
        content:
          '<details open="true"><summary></summary><div class="details-content"><p>Text</p></div></details><p>After</p>',
        extensions: [
          Document,
          Paragraph,
          Text,
          Details,
          DetailsContent,
          DetailsSummary,
        ],
      });

      await waitSelectionChange(() => {
        editor.chain().focus().setTextSelection(13).run();
      });

      await waitSelectionChange(async () => {
        await userEvent.type(editor.view.dom, "{ArrowLeft}");
      });

      expect(editor.state.selection.from).toBe(9); // コンテンツの末尾
    });

    it("閉じたコンテンツの直後で左矢印キーを押すと、サマリーの末尾に移動する", async () => {
      const editor = renderTiptapEditor({
        content:
          '<details><summary></summary><div class="details-content"><p>Text</p></div></details><p>After</p>',
        extensions: [
          Document,
          Paragraph,
          Text,
          Details,
          DetailsContent,
          DetailsSummary,
        ],
      });

      await waitSelectionChange(() => {
        editor.chain().focus().setTextSelection(13).run();
      });

      await userEvent.keyboard("{ArrowLeft}");

      expect(editor.state.selection.from).toBe(2); // タイトルの末尾
    });
  });

  describe("右矢印キーによる移動", () => {
    it("サマリーの末尾で右矢印キーを押すとコンテンツ先頭に移動する（開いている）", async () => {
      const editor = renderTiptapEditor({
        content:
          '<details open><summary></summary><div class="details-content"><p>Text</p></div></details>',
        extensions: [
          Document,
          Paragraph,
          Text,
          Details,
          DetailsContent,
          DetailsSummary,
        ],
      });

      await waitSelectionChange(() => {
        editor.chain().focus().setTextSelection(2).run();
      });

      await userEvent.keyboard("{ArrowRight}");

      expect(editor.state.selection.from).toBe(5); // コンテンツの最初
    });

    it("サマリーの末尾で右矢印キーを押すとコンテンツ先頭に移動する（閉じている）", async () => {
      const editor = renderTiptapEditor({
        content:
          '<details><summary></summary><div class="details-content"><p>Text</p></div></details><p></p>',
        extensions: [
          Document,
          Paragraph,
          Text,
          Details,
          DetailsContent,
          DetailsSummary,
        ],
      });

      await waitSelectionChange(() => {
        editor.chain().focus().setTextSelection(2).run();
      });

      await userEvent.keyboard("{ArrowRight}");

      expect(editor.state.selection.from).toBe(13); // コンテンツの直後
    });

    it("コンテンツの末尾で右矢印キーを押すと次のノードに移動する", async () => {
      const editor = renderTiptapEditor({
        content:
          '<details><summary></summary><div class="details-content"><p>Text</p></div></details><p>After</p>',
        extensions: [
          Document,
          Paragraph,
          Text,
          Details,
          DetailsContent,
          DetailsSummary,
        ],
      });

      await waitSelectionChange(() => {
        editor.chain().focus().setTextSelection(9).run();
      });

      await waitSelectionChange(async () => {
        await userEvent.type(editor.view.dom, "{ArrowRight}");
      });

      expect(editor.state.selection.from).toBe(11); // "After" の最初
    });
  });
});

describe("範囲選択", () => {
  it("前のノードとアコーディオンコンテンツの間で範囲選択してBackspaceを押すと、アコーディオンが削除される", async () => {
    const editor = renderTiptapEditor({
      content:
        '<p>Before</p><details open="true"><summary></summary><div class="details-content"><p>Text</p></div></details>',
      extensions: [
        Document,
        Paragraph,
        Text,
        Details,
        DetailsContent,
        DetailsSummary,
      ],
    });

    await waitSelectionChange(() => {
      editor
        .chain()
        .focus()
        .setTextSelection({
          from: 5,
          to: 14,
        })
        .run();
    });

    await userEvent.keyboard("{Backspace}");

    expect(editor.state.doc.toString()).toBe('doc(paragraph("Befoext"))');
    expect(editor.state.selection.from).toBe(5);
  });

  it("アコーディオンと次のノードの間で範囲選択してBackspaceを押すと、アコーディオンのコンテンツに結合する", async () => {
    const editor = renderTiptapEditor({
      content:
        '<details><summary>Title</summary><div class="details-content"><p>Text</p></div></details><p>After</p>',
      extensions: [
        Document,
        Paragraph,
        Text,
        Details,
        DetailsContent,
        DetailsSummary,
      ],
    });

    await waitSelectionChange(() => {
      editor
        .chain()
        .focus()
        .setTextSelection({
          from: 11,
          to: 19,
        })
        .run();
    });
    await userEvent.keyboard("{Backspace}");

    expect(editor.state.doc.toString()).toBe(
      'doc(details(detailsSummary("Title"), detailsContent(paragraph("Tfter"))))',
    );
    expect(editor.state.selection.from).toBe(11);
  });
});

describe("アコーディオンの開閉", () => {
  it("アコーディオンはデフォルトで開いている", async () => {
    const editor = renderTiptapEditor({
      content: "<p>Text</p>",
      extensions: [
        Document,
        Paragraph,
        Text,
        Details,
        DetailsContent,
        DetailsSummary,
      ],
    });

    await waitSelectionChange(() => {
      editor.chain().focus().setDetails().run();
    });

    const detailsNode = editor.state.doc.firstChild;
    expect(detailsNode?.attrs.open).toBe(true);
  });

  it("HTMLからのパースでopen属性が正しく設定される", async () => {
    const editor = renderTiptapEditor({
      content:
        '<details open><summary>Title</summary><div class="details-content"><p>Text</p></div></details>',
      extensions: [
        Document,
        Paragraph,
        Text,
        Details,
        DetailsContent,
        DetailsSummary,
      ],
    });

    const detailsNode = editor.state.doc.firstChild;
    expect(detailsNode?.attrs.open).toBe(true);
  });

  it("HTMLからのパースでopen属性がない場合はfalseになる", async () => {
    const editor = renderTiptapEditor({
      content:
        '<details><summary>Title</summary><div class="details-content"><p>Text</p></div></details>',
      extensions: [
        Document,
        Paragraph,
        Text,
        Details,
        DetailsContent,
        DetailsSummary,
      ],
    });

    const detailsNode = editor.state.doc.firstChild;
    expect(detailsNode?.attrs.open).toBe(false);
  });
});
