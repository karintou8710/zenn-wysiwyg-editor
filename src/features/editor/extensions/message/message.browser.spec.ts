import Document from "@tiptap/extension-document";
import Paragraph from "@tiptap/extension-paragraph";
import Text from "@tiptap/extension-text";
import { page, userEvent } from "@vitest/browser/context";
import { describe, expect, it } from "vitest";
import { renderTiptapEditor } from "@/tests/editor";
import { Message } from "./message";
import { MessageContent } from "./message-content";

describe("InputRule", () => {
  it(":::message で メッセージブロックが作成される", async () => {
    const editor = renderTiptapEditor({
      content: "<p>Text</p>",
      extensions: [Document, Paragraph, Text, Message, MessageContent],
    });

    editor.chain().focus().setTextSelection(1).run();
    await userEvent.type(editor.view.dom, ":::message ");

    const docString = editor.state.doc.toString();
    expect(docString).toBe('doc(message(messageContent(paragraph("Text"))))');
    expect(editor.state.selection.from).toBe(3);
  });

  it(":::alert で アラートブロックが作成される", async () => {
    const editor = renderTiptapEditor({
      content: "<p>Text</p>",
      extensions: [Document, Paragraph, Text, Message, MessageContent],
    });

    editor.chain().focus().setTextSelection(1).run();
    await userEvent.type(editor.view.dom, ":::alert ");

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

    editor.chain().focus().setTextSelection(2).run();
    await userEvent.type(editor.view.dom, ":::alert ");

    // InputRuleが発動せず、テキストとして追加される
    const docString = editor.state.doc.toString();
    expect(docString).toBe('doc(paragraph("T:::alert ext"))');
  });
});
