// src/Tiptap.tsx
import { useEditor, EditorContent } from "@tiptap/react";
import Document from "@tiptap/extension-document";
import Paragraph from "@tiptap/extension-paragraph";
import Text from "@tiptap/extension-text";

// @ts-ignore
import "zenn-content-css";
import "./editor.css";

function Editor() {
  const editor = useEditor({
    extensions: [Document, Paragraph, Text],
    content: "<p>Hello World!</p>",
  });

  return (
    <>
      <EditorContent editor={editor} className="znc" />
    </>
  );
}

export default Editor;
