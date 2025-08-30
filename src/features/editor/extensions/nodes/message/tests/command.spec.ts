import Document from "@tiptap/extension-document";
import Paragraph from "@tiptap/extension-paragraph";
import Text from "@tiptap/extension-text";
import { describe, expect, it } from "vitest";
import { createEditorInstance } from "@/tests/editor-instance";
import Heading from "../../heading";
import { Message } from "../message";
import { MessageContent } from "../message-content";

const baseExtensions = [Document, Paragraph, Text, Message, MessageContent];

describe("コマンド", () => {
  describe("setMessage", () => {
    it("段落をメッセージノードに変換できる", () => {
      const editor = createEditorInstance({
        extensions: baseExtensions,
        content: "<p>通常の段落</p>",
      });

      editor.commands.setTextSelection({ from: 1, to: 6 });
      editor.commands.setMessage({ type: "message" });

      const docString = editor.state.doc.toString();

      expect(docString).toBe(
        'doc(message(messageContent(paragraph("通常の段落"))))',
      );
    });

    it("段落を跨ぐ場合にメッセージノードに変換できる", () => {
      const editor = createEditorInstance({
        extensions: baseExtensions,
        content: "<p>段落1</p><p>段落2</p>",
      });

      // 段落を跨いでメッセージに変換
      editor.commands.setTextSelection({ from: 2, to: 7 });
      editor.commands.setMessage({ type: "alert" });

      const docString = editor.state.doc.toString();

      expect(docString).toBe(
        'doc(message(messageContent(paragraph("段落1"), paragraph("段落2"))))',
      );
    });

    it("見出しの中で呼び出せる", () => {
      const editor = createEditorInstance({
        extensions: [...baseExtensions, Heading],
        content: "<h1>見出しの中</h1>",
      });

      editor.commands.setTextSelection(1);
      const result = editor.commands.setMessage({ type: "message" });

      expect(result).toBe(true);
    });
  });

  describe("unsetMessage", () => {
    it("メッセージを通常の段落に戻せる", () => {
      const editor = createEditorInstance({
        extensions: baseExtensions,
        content:
          '<aside class="msg alert"><div class="msg-content"><p>メッセージ</p></div></aside>',
      });

      editor.commands.setTextSelection(3);
      editor.commands.unsetMessage();

      const docString = editor.state.doc.toString();

      expect(docString).toBe('doc(paragraph("メッセージ"))');
    });

    it("段落では呼び出せない", () => {
      const editor = createEditorInstance({
        extensions: baseExtensions,
        content: "<p>通常の段落</p>",
      });

      editor.commands.setTextSelection(3);
      const result = editor.commands.unsetMessage();

      expect(result).toBe(false);
    });
  });
});
