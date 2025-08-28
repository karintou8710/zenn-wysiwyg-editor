import Document from "@tiptap/extension-document";
import Paragraph from "@tiptap/extension-paragraph";
import Text from "@tiptap/extension-text";
import { Editor } from "@tiptap/react";
import { describe, expect, it } from "vitest";
import { fromMarkdown } from "../../../lib/from-markdown";
import { markdownSerializer } from "../../../lib/to-markdown";
import { Message } from "./message";
import { MessageContent } from "./message-content";

describe("HTMLのパース", () => {
  it("aside.msgをメッセージノードとしてパースできる", () => {
    const editor = new Editor({
      extensions: [Document, Paragraph, Text, Message, MessageContent],
      content:
        '<aside class="msg"><div class="msg-content"><p>メッセージ</p></div></aside>',
    });

    const docString = editor.state.doc.toString();

    expect(docString).toBe(
      'doc(message(messageContent(paragraph("メッセージ"))))',
    );
  });

  it("aside.msg.alertをアラートタイプとしてパースできる", () => {
    const editor = new Editor({
      extensions: [Document, Paragraph, Text, Message, MessageContent],
      content:
        '<aside class="msg alert"><div class="msg-content"><p>メッセージ</p></div></aside>',
    });

    const docString = editor.state.doc.toString();

    expect(docString).toBe(
      'doc(message(messageContent(paragraph("メッセージ"))))',
    );
  });
});

describe("HTMLのレンダリング", () => {
  it("メッセージタイプが正しいHTMLでレンダリングされる", () => {
    const editor = new Editor({
      extensions: [Document, Paragraph, Text, Message, MessageContent],
      content:
        '<aside class="msg"><div class="msg-content"><p>メッセージ</p></div></aside>',
    });

    const html = editor.getHTML();
    expect(html).toContain('<aside class="msg">');
    expect(html).not.toContain('class="msg alert"');
  });

  it("アラートタイプが正しいHTMLでレンダリングされる", () => {
    const editor = new Editor({
      extensions: [Document, Paragraph, Text, Message, MessageContent],
      content:
        '<aside class="msg alert"><div class="msg-content"><p>メッセージ</p></div></aside>',
    });

    const html = editor.getHTML();
    expect(html).toContain('<aside class="msg alert">');
  });

  it("HTMLにレンダリング後にパースできる", () => {
    const editor = new Editor({
      extensions: [Document, Paragraph, Text, Message, MessageContent],
      content:
        '<aside class="msg alert"><div class="msg-content"><p>メッセージ</p></div></aside>',
    });

    const html = editor.getHTML();
    editor.commands.setContent(html);

    const docString = editor.state.doc.toString();

    expect(docString).toBe(
      'doc(message(messageContent(paragraph("メッセージ"))))',
    );
  });
});

describe("コマンド", () => {
  it("setMessageコマンドで段落をメッセージノードに変換できる", () => {
    const editor = new Editor({
      extensions: [Document, Paragraph, Text, Message, MessageContent],
      content: "<p>通常の段落</p>",
    });

    // 段落を選択
    editor.commands.setTextSelection({ from: 1, to: 6 });

    // メッセージに変換
    editor.commands.setMessage({ type: "message" });

    const docString = editor.state.doc.toString();

    expect(docString).toBe(
      'doc(message(messageContent(paragraph("通常の段落"))))',
    );
  });

  it("setMessageコマンドで段落を跨ぐ場合", () => {
    const editor = new Editor({
      extensions: [Document, Paragraph, Text, Message, MessageContent],
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

  it("unsetMessageコマンドでメッセージを通常の段落に戻せる", () => {
    const editor = new Editor({
      extensions: [Document, Paragraph, Text, Message, MessageContent],
      content:
        '<aside class="msg alert"><div class="msg-content"><p>メッセージ</p></div></aside>',
    });

    // メッセージノード内にカーソルを配置
    editor.commands.setTextSelection(3);

    // メッセージを解除
    editor.commands.unsetMessage();

    const docString = editor.state.doc.toString();

    expect(docString).toBe('doc(paragraph("メッセージ"))');
  });
});

describe("マークダウン", () => {
  it("メッセージノードをマークダウンに変換できる", () => {
    const editor = new Editor({
      extensions: [Document, Paragraph, Text, Message, MessageContent],
      content:
        '<aside class="msg"><div class="msg-content"><p>メッセージ</p></div></aside>',
    });

    const markdown = markdownSerializer.serialize(editor.state.doc);

    expect(markdown).toBe(":::message\nメッセージ\n:::");
  });

  it("メッセージアラートのノードをマークダウンに変換できる", () => {
    const editor = new Editor({
      extensions: [Document, Paragraph, Text, Message, MessageContent],
      content:
        '<aside class="msg alert"><div class="msg-content"><p>メッセージ</p></div></aside>',
    });

    const markdown = markdownSerializer.serialize(editor.state.doc);
    expect(markdown).toBe(":::message alert\nメッセージ\n:::");
  });

  it("メッセージノードのネストをマークダウンに変換できる", () => {
    const editor = new Editor({
      extensions: [Document, Paragraph, Text, Message, MessageContent],
      content: `
        <aside class="msg"><div class="msg-content">
        <p>メッセージ</p>
        <aside class="msg alert"><div class="msg-content"><p>ネスト</p></div></aside>
        </div>
        </aside>`,
    });

    const markdown = markdownSerializer.serialize(editor.state.doc);

    expect(markdown).toBe(
      "::::message\nメッセージ\n\n:::message alert\nネスト\n:::\n::::",
    );
  });

  it("マークダウンからメッセージノードに変換", () => {
    const markdown = `:::message\nメッセージ\n:::`;

    const html = fromMarkdown(markdown);
    const editor = new Editor({
      extensions: [Document, Paragraph, Text, Message, MessageContent],
      content: html,
    });
    const docString = editor.state.doc.toString();

    expect(docString).toBe(
      'doc(message(messageContent(paragraph("メッセージ"))))',
    );
  });
});
