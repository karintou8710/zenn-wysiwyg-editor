// @ts-ignore
import "zenn-content-css";
import "./editor.css";

import { useEditor, EditorContent } from "@tiptap/react";
import FixedMenu from "./components/fixed-menu";
import { CONTENT_KEY, useLocalStorage } from "@/hooks/useLocalStorage";

import { extensions } from "./extensions";
import { INITIAL_CONTENT } from "./lib/initial-content";
import BubbleMenu from "./components/bubble-menu";
import ImageBubbleMenu from "./components/image-bubble-menu";
import DragHandle from "./extensions/drag-handle";
import markdownToHtml from "zenn-markdown-html";

function Editor() {
  const [content, setContent] = useLocalStorage(CONTENT_KEY, "");

  const editor = useEditor({
    extensions,
    content: content || INITIAL_CONTENT,
    onUpdate: ({ editor }) => {
      setContent(editor.getHTML());
    },
    editorProps: {
      transformPastedText(text) {
        console.log(text);
        console.log(markdownToHtml(text));
        return text;
      },
    },
  });

  return (
    <>
      <FixedMenu editor={editor} className="mb-2" />
      <BubbleMenu editor={editor} />
      <ImageBubbleMenu editor={editor} />
      <EditorContent editor={editor} className="znc" />
      <DragHandle editor={editor} />
    </>
  );
}

export default Editor;
