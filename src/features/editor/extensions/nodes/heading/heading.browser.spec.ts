import Document from "@tiptap/extension-document";
import Paragraph from "@tiptap/extension-paragraph";
import Text from "@tiptap/extension-text";
import { userEvent } from "@vitest/browser/context";
import { describe, expect, it } from "vitest";
import { renderTiptapEditor } from "@/tests/editor";
import { wait } from "@/tests/utils";
import Heading from ".";

describe("キー入力", () => {
  it("Enterで見出しが分割される", async () => {
    const editor = renderTiptapEditor({
      extensions: [Document, Paragraph, Text, Heading],
      content: "<h1>見出し</h1>",
    });

    editor.chain().focus().setTextSelection(2).run();

    await wait(50);
    await userEvent.keyboard("{Enter}");
    await wait(50);

    const doc = editor.state.doc.toString();
    expect(doc).toBe('doc(heading("見"), paragraph("出し"))');
    expect(editor.state.selection.from).toBe(4);
  });

  it("先頭でBackspaceを押す", async () => {
    const editor = renderTiptapEditor({
      extensions: [Document, Paragraph, Text, Heading],
      content: "<h1>見出し</h1>",
    });

    editor.chain().focus().setTextSelection(1).run();

    await wait(50);
    await userEvent.keyboard("{Backspace}");
    await wait(50);

    const doc = editor.state.doc.toString();
    expect(doc).toBe('doc(paragraph("見出し"))');
    expect(editor.state.selection.from).toBe(1);
  });
});
