// @ts-ignore
import "zenn-content-css";
import "./editor.css";

import { useEditor, EditorContent } from "@tiptap/react";
import FixedMenu from "./components/fixed-menu";
import { CONTENT_KEY, useLocalStorage } from "@/hooks/useLocalStorage";

import { extensions } from "./extensions";
import BubbleMenu from "./components/bubble-menu";

function Editor() {
  const [content, setContent] = useLocalStorage(CONTENT_KEY, "");

  const editor = useEditor({
    extensions,
    content: content,
    onUpdate: ({ editor }) => {
      setContent(editor.getHTML());
    },
  });

  return (
    <>
      <FixedMenu editor={editor} className="mb-2" />
      <BubbleMenu editor={editor} />
      <EditorContent editor={editor} className="znc" />
    </>
  );
}

export default Editor;
