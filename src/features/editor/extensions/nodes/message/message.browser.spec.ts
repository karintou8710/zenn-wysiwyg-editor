import Document from "@tiptap/extension-document";
import Paragraph from "@tiptap/extension-paragraph";
import Text from "@tiptap/extension-text";
import { userEvent } from "@vitest/browser/context";
import { describe, expect, it } from "vitest";
import { waitSelectionChange } from "@/tests/dom";
import { renderTiptapEditor } from "@/tests/editor";
import { Details } from "../details";
import { DetailsContent } from "../details/content";
import { DetailsSummary } from "../details/summary";
import { Message } from "./message";
import { MessageContent } from "./message-content";

describe("InputRule", () => {
  it(":::message で メッセージブロックが作成される", async () => {
    const editor = renderTiptapEditor({
      content: "<p>Text</p>",
      extensions: [Document, Paragraph, Text, Message, MessageContent],
    });

    await waitSelectionChange(() => {
      editor.chain().focus().run();
    });
    await userEvent.keyboard(":::message ");

    const docString = editor.state.doc.toString();
    expect(docString).toBe('doc(message(messageContent(paragraph("Text"))))');
    expect(editor.state.selection.from).toBe(3);
  });

  it(":::alert で アラートブロックが作成される", async () => {
    const editor = renderTiptapEditor({
      content: "<p>Text</p>",
      extensions: [Document, Paragraph, Text, Message, MessageContent],
    });

    await waitSelectionChange(() => {
      editor.chain().focus().run();
    });
    await userEvent.keyboard(":::alert ");

    const docString = editor.state.doc.toString();
    expect(docString).toBe('doc(message(messageContent(paragraph("Text"))))');
    expect(editor.state.doc.firstChild?.attrs.type).toEqual("alert");
    expect(editor.state.selection.from).toBe(3);
  });

  it("行の途中では InputRule が発動しない", async () => {
    const editor = renderTiptapEditor({
      content: "<p>Text</p>",
      extensions: [Document, Paragraph, Text, Message, MessageContent],
    });

    await waitSelectionChange(() => {
      editor.chain().focus().setTextSelection(2).run();
    });
    await userEvent.keyboard(":::alert ");

    const docString = editor.state.doc.toString();
    expect(docString).toBe('doc(paragraph("T:::alert ext"))');
  });

  it("アコーディオンのタイトルでは InputRule が発動しない", async () => {
    const editor = renderTiptapEditor({
      content:
        '<details><summary></summary><div class="details-content"><p>Text</p></div></details>',
      extensions: [
        Document,
        Paragraph,
        Text,
        Message,
        MessageContent,
        Details,
        DetailsContent,
        DetailsSummary,
      ],
    });

    await waitSelectionChange(() => {
      editor.chain().focus().setTextSelection(2).run();
    });
    await userEvent.keyboard(":::alert ");

    const docString = editor.state.doc.toString();
    expect(docString).toBe(
      'doc(details(detailsSummary(":::alert "), detailsContent(paragraph("Text"))))',
    );
  });
});

describe("キー入力", () => {
  it("メッセージコンテンツの先頭で Backspace を押すとメッセージブロックが解除される", async () => {
    const editor = renderTiptapEditor({
      content:
        '<aside class="msg"><div class="msg-content"><p>Text</p></div></aside>',
      extensions: [Document, Paragraph, Text, Message, MessageContent],
    });

    await waitSelectionChange(() => {
      editor.chain().focus().setTextSelection(3).run();
    });
    await userEvent.keyboard("{Backspace}");

    const docString = editor.state.doc.toString();
    expect(docString).toBe('doc(paragraph("Text"))');
    expect(editor.state.selection.from).toBe(1);
  });

  it("Enter を押すとメッセージコンテンツ内で改行される", async () => {
    const editor = renderTiptapEditor({
      content:
        '<aside class="msg"><div class="msg-content"><p>Text</p></div></aside>',
      extensions: [Document, Paragraph, Text, Message, MessageContent],
    });

    await waitSelectionChange(() => {
      editor.chain().focus().setTextSelection(4).run();
    });
    await userEvent.keyboard("{Enter}");

    const docString = editor.state.doc.toString();
    expect(docString).toBe(
      'doc(message(messageContent(paragraph("T"), paragraph("ext"))))',
    );
    expect(editor.state.selection.from).toBe(6);
  });

  it("ミッセージの先頭で左矢印キーを押すと前のノードに移動する", async () => {
    const editor = renderTiptapEditor({
      content:
        '<p>Before</p><aside class="msg"><div class="msg-content"><p>Text</p></div></aside>',
      extensions: [Document, Paragraph, Text, Message, MessageContent],
    });

    await waitSelectionChange(() => {
      editor.chain().focus().setTextSelection(11).run();
    });
    await userEvent.keyboard("{ArrowLeft}");

    expect(editor.state.selection.from).toBe(7); // "Before" の最後
  });

  it("ミッセージの末尾で右矢印キーを押すと次のノードに移動する", async () => {
    const editor = renderTiptapEditor({
      content:
        '<aside class="msg"><div class="msg-content"><p>Text</p></div></aside><p>After</p>',
      extensions: [Document, Paragraph, Text, Message, MessageContent],
    });

    await waitSelectionChange(() => {
      editor.chain().focus().setTextSelection(7).run();
    });

    await userEvent.keyboard("{ArrowRight}");

    expect(editor.state.selection.from).toBe(11); // "After" の最初
  });
});

describe("範囲選択", () => {
  it("前のノードとメッセージの間で範囲選択してBackspaceを押すと、メッセージが削除される", async () => {
    const editor = renderTiptapEditor({
      content:
        '<p>Before</p><aside class="msg"><div class="msg-content"><p>Text</p></div></aside>',
      extensions: [Document, Paragraph, Text, Message, MessageContent],
    });

    await waitSelectionChange(() => {
      editor
        .chain()
        .focus()
        .setTextSelection({
          from: 5,
          to: 12,
        })
        .run();
    });

    await userEvent.keyboard("{Backspace}");

    expect(editor.state.doc.toString()).toBe('doc(paragraph("Befoext"))');
    expect(editor.state.selection.from).toBe(5);
  });

  it("メッセージと次のノードの間で範囲選択してBackspaceを押すと、メッセージに結合する", async () => {
    const editor = renderTiptapEditor({
      content:
        '<aside class="msg"><div class="msg-content"><p>Text</p></div></aside><p>After</p>',
      extensions: [Document, Paragraph, Text, Message, MessageContent],
    });

    await waitSelectionChange(() => {
      editor
        .chain()
        .focus()
        .setTextSelection({
          from: 5,
          to: 12,
        })
        .run();
    });
    await userEvent.keyboard("{Backspace}");

    expect(editor.state.doc.toString()).toBe(
      'doc(message(messageContent(paragraph("Tefter"))))',
    );
    expect(editor.state.selection.from).toBe(5);
  });
});
